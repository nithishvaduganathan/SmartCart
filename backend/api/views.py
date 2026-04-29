from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Q
from .models import Category, Product, Cart, CartItem, Order, OrderItem, UserProfile, Payment
from .serializers import (
    UserSerializer, UserProfileSerializer, CategorySerializer,
    ProductSerializer, CartSerializer, CartItemSerializer, OrderSerializer,
    PaymentSerializer, CreateRazorpayOrderSerializer, VerifyPaymentSerializer
)
from .services.payment import PaymentService
from .services.email import EmailService

from .permissions import IsAdminUserOrReadOnly

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]
    pagination_class = None

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    pagination_class = None

    def get_queryset(self):
        queryset = Product.objects.all()
        category_slug = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        if category_slug is not None:
            queryset = queryset.filter(category__slug=category_slug)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        return queryset

class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartItemSerializer

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        product = serializer.validated_data['product']
        quantity = serializer.validated_data.get('quantity', 1)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity},
        )

        if not created:
            item.quantity += quantity
            item.save(update_fields=['quantity'])

        response_serializer = self.get_serializer(item)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        shipping_address = request.data.get('shipping_address', '').strip()
        if not shipping_address:
            return Response({"error": "Shipping address is required"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            cart_items = list(cart.items.select_related('product'))
            unavailable = [
                item.product.name
                for item in cart_items
                if item.product.stock < item.quantity
            ]

            if unavailable:
                return Response(
                    {"error": f"Not enough stock for: {', '.join(unavailable)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            total = sum(item.product.price * item.quantity for item in cart_items)

            order = Order.objects.create(
                user=request.user,
                total_price=total,
                shipping_address=shipping_address,
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    price=item.product.price,
                    quantity=item.quantity
                )
                item.product.stock -= item.quantity
                item.product.save(update_fields=['stock'])

            cart.items.all().delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({"error": "Username, email, and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        UserProfile.objects.create(user=user)
        Cart.objects.create(user=user)

        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)

        # Send registration confirmation email
        EmailService.send_registration_confirmation(email, username)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


# ==================== Payment Views ====================

class CreateRazorpayOrderView(APIView):
    """Create a Razorpay order for payment"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateRazorpayOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order_id = serializer.validated_data['order_id']
        amount = serializer.validated_data['amount']

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        payment_service = PaymentService()
        result = payment_service.create_razorpay_order(
            order_id=order_id,
            amount=amount,
            customer_email=request.user.email,
            customer_phone=getattr(request.user.profile, 'phone', '')
        )

        if result['success']:
            return Response({
                'razorpay_order_id': result['razorpay_order_id'],
                'amount': result['amount'],
                'currency': result['currency'],
            })
        else:
            return Response({"error": result['error']}, status=status.HTTP_400_BAD_REQUEST)


class VerifyPaymentView(APIView):
    """Verify Razorpay payment signature"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order_id = serializer.validated_data['order_id']
        razorpay_order_id = serializer.validated_data['razorpay_order_id']
        razorpay_payment_id = serializer.validated_data['razorpay_payment_id']
        razorpay_signature = serializer.validated_data['razorpay_signature']

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        payment_service = PaymentService()

        # Verify signature
        if not payment_service.verify_payment_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature):
            return Response({"error": "Invalid payment signature"}, status=status.HTTP_400_BAD_REQUEST)

        # Update order and create payment record
        with transaction.atomic():
            payment_service.update_order_payment_status(order, razorpay_order_id, razorpay_payment_id, 'Paid')

            Payment.objects.create(
                order=order,
                razorpay_payment_id=razorpay_payment_id,
                razorpay_order_id=razorpay_order_id,
                amount=order.total_price,
                status='Completed',
                signature=razorpay_signature
            )

            # Send payment confirmation email
            EmailService.send_payment_received(
                request.user.email,
                request.user.username,
                order_id,
                order.total_price
            )

        return Response({
            'success': True,
            'message': 'Payment verified successfully',
            'order': OrderSerializer(order).data
        })

class MockProcessPaymentView(APIView):
    """Process a mock payment to bypass Razorpay test environment failures"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({"error": "order_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        with transaction.atomic():
            # Update order status
            order.status = 'Paid'
            order.is_paid = True
            order.save()

            # Create mock payment record
            Payment.objects.create(
                order=order,
                razorpay_payment_id=f"mock_pay_{order_id}",
                razorpay_order_id=f"mock_order_{order_id}",
                amount=order.total_price,
                status='Completed',
                signature="mock_signature_bypassed"
            )

            # Send payment confirmation email
            EmailService.send_payment_received(
                request.user.email,
                request.user.username,
                order_id,
                order.total_price
            )

        return Response({
            'success': True,
            'message': 'Mock Payment processed successfully',
            'order': OrderSerializer(order).data
        })


class PaymentStatusView(APIView):
    """Get payment status"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        try:
            payment = Payment.objects.get(order__id=order_id, order__user=request.user)
            serializer = PaymentSerializer(payment)
            return Response(serializer.data)
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)


# ==================== Admin Views ====================

class AdminDashboardView(APIView):
    """Admin dashboard statistics"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

        total_orders = Order.objects.count()
        total_revenue = sum(order.total_price for order in Order.objects.filter(status='Delivered'))
        total_users = User.objects.count()
        pending_orders = Order.objects.filter(status='Pending').count()

        return Response({
            'total_orders': total_orders,
            'total_revenue': float(total_revenue),
            'total_users': total_users,
            'pending_orders': pending_orders,
        })


class AdminOrdersView(APIView):
    """Admin view for all orders"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

        orders = Order.objects.all().order_by('-created_at')
        page = request.query_params.get('page', 1)
        page_size = 20

        start = (int(page) - 1) * page_size
        end = start + page_size

        serializer = OrderSerializer(orders[start:end], many=True)
        return Response({
            'count': orders.count(),
            'results': serializer.data
        })

    def put(self, request, order_id):
        if not request.user.is_staff:
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled']:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        old_status = order.status
        order.status = new_status
        order.save()

        # Send email notification based on status change
        if new_status == 'Shipped':
            EmailService.send_shipment_notification(order.user.email, order.user.username, order.id)
        elif new_status == 'Delivered':
            EmailService.send_delivery_confirmation(order.user.email, order.user.username, order.id)

        return Response({
            'success': True,
            'message': f'Order status updated from {old_status} to {new_status}',
            'order': OrderSerializer(order).data
        })

