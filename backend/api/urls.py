from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CategoryViewSet, ProductViewSet, CartView, CartItemViewSet,
    OrderViewSet, UserProfileView, RegisterView,
    CreateRazorpayOrderView, VerifyPaymentView, PaymentStatusView,
    AdminDashboardView, AdminOrdersView
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'cart-items', CartItemViewSet, basename='cartitem')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    # Authentication
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),

    # Cart
    path('cart/', CartView.as_view(), name='cart'),

    # Payment
    path('payments/create-razorpay-order/', CreateRazorpayOrderView.as_view(), name='create_razorpay_order'),
    path('payments/verify-payment/', VerifyPaymentView.as_view(), name='verify_payment'),
    path('payments/<int:order_id>/status/', PaymentStatusView.as_view(), name='payment_status'),

    # Admin
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('admin/orders/', AdminOrdersView.as_view(), name='admin_orders'),
    path('admin/orders/<int:order_id>/status/', AdminOrdersView.as_view(), name='admin_order_status'),

    # Router URLs
    path('', include(router.urls)),
]

