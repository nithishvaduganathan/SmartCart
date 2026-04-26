from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Order, OrderItem, Cart, CartItem, Product, Discount
from app.schemas import OrderResponse, OrderCreate
from app.security import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("", response_model=List[OrderResponse])
def get_user_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Order).filter(Order.user_id == current_user.id).all()

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        (Order.id == order_id) &
        (Order.user_id == current_user.id)
    ).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order

@router.post("", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get user's cart
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart or not cart.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty"
        )

    # Validate shipping address
    shipping_address = order_data.shipping_address.strip()
    if not shipping_address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Shipping address is required"
        )

    # Check stock availability
    cart_items = cart.items
    unavailable = []
    for item in cart_items:
        if item.product.stock < item.quantity:
            unavailable.append(item.product.name)

    if unavailable:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough stock for: {', '.join(unavailable)}"
        )

    # Calculate total
    total = sum(item.product.price * item.quantity for item in cart_items)

    # Handle discount code if provided
    discount_code = None
    discount_amount = 0

    if order_data.discount_code:
        discount = db.query(Discount).filter(
            (Discount.code.ilike(order_data.discount_code)) &
            (Discount.is_active == True)
        ).first()

        if discount:
            # Validate discount
            if discount.max_uses > 0 and discount.uses_count >= discount.max_uses:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Discount code has reached maximum usage limit"
                )

            if total < discount.min_order_amount:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Minimum order amount of {discount.min_order_amount} required for this discount"
                )

            # Calculate discount amount
            if discount.discount_type == "percentage":
                discount_amount = (total * discount.discount_value) / 100
            else:  # fixed
                discount_amount = min(discount.discount_value, total)

            discount_code = discount.code
            discount.uses_count += 1

    # Create order with calculated total (after discount)
    final_total = max(0, total - discount_amount)
    order = Order(
        user_id=current_user.id,
        total_price=final_total,
        discount_code=discount_code,
        discount_amount=round(discount_amount, 2),
        shipping_address=shipping_address
    )
    db.add(order)
    db.flush()  # Get the order ID

    # Create order items and update stock
    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            price=item.product.price,
            quantity=item.quantity
        )
        db.add(order_item)
        item.product.stock -= item.quantity

    # Clear cart
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()

    db.commit()
    db.refresh(order)
    return order
