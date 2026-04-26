from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import User, Order, OrderStatus
from app.security import get_current_user
import razorpay
import os
import hmac
import hashlib

router = APIRouter(prefix="/payments", tags=["payments"])

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY_ID", ""), os.getenv("RAZORPAY_SECRET_KEY", ""))
)

class CreateRazorpayOrderRequest(BaseModel):
    order_id: int
    amount: float

class VerifyPaymentRequest(BaseModel):
    order_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-razorpay-order/")
def create_razorpay_order(
    request: CreateRazorpayOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Razorpay order for payment processing"""
    # Verify order exists and belongs to user
    order = db.query(Order).filter(
        (Order.id == request.order_id) &
        (Order.user_id == current_user.id)
    ).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    try:
        # Create Razorpay order (amount in paise)
        razorpay_order = razorpay_client.order.create({
            "amount": int(request.amount * 100),  # Convert to paise
            "currency": "INR",
            "receipt": f"order_{request.order_id}",
            "notes": {
                "order_id": str(request.order_id),
                "user_id": str(current_user.id)
            }
        })

        return {
            "razorpay_order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create payment order: {str(e)}"
        )

@router.post("/verify-payment/")
def verify_payment(
    request: VerifyPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verify Razorpay payment signature and update order status"""
    # Verify order exists and belongs to user
    order = db.query(Order).filter(
        (Order.id == request.order_id) &
        (Order.user_id == current_user.id)
    ).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    try:
        # Verify signature
        generated_signature = hmac.new(
            os.getenv("RAZORPAY_SECRET_KEY", "").encode(),
            f"{request.razorpay_order_id}|{request.razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()

        if generated_signature != request.razorpay_signature:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid payment signature"
            )

        # Update order with payment details
        order.razorpay_order_id = request.razorpay_order_id
        order.razorpay_payment_id = request.razorpay_payment_id
        order.status = OrderStatus.PAID

        db.commit()

        return {
            "status": "success",
            "message": "Payment verified successfully",
            "order_id": request.order_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment verification failed: {str(e)}"
        )
