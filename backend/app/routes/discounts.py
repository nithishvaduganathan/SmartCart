from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import Discount, Order, Cart, CartItem, User
from app.security import get_current_user, get_current_admin_user
from datetime import datetime

router = APIRouter(prefix="/discounts", tags=["discounts"])

class DiscountValidateRequest(BaseModel):
    code: str
    order_amount: float

class DiscountResponse(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    discount_amount: float
    final_amount: float
    message: str

class DiscountCreate(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    max_uses: int = 0
    min_order_amount: float = 0
    is_active: bool = True

class DiscountUpdate(BaseModel):
    code: str = None
    discount_type: str = None
    discount_value: float = None
    max_uses: int = None
    min_order_amount: float = None
    is_active: bool = None

@router.post("/validate/", response_model=DiscountResponse)
def validate_discount(
    request: DiscountValidateRequest,
    db: Session = Depends(get_db)
):
    """Validate a discount code and calculate discount amount"""
    discount = db.query(Discount).filter(
        (Discount.code.ilike(request.code)) &
        (Discount.is_active == True)
    ).first()

    if not discount:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discount code not found or inactive"
        )

    # Check if max uses exceeded
    if discount.max_uses > 0 and discount.uses_count >= discount.max_uses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Discount code has reached maximum usage limit"
        )

    # Check minimum order amount
    if request.order_amount < discount.min_order_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Minimum order amount of {discount.min_order_amount} required for this discount"
        )

    # Calculate discount amount
    if discount.discount_type == "percentage":
        discount_amount = (request.order_amount * discount.discount_value) / 100
    else:  # fixed
        discount_amount = min(discount.discount_value, request.order_amount)

    final_amount = max(0, request.order_amount - discount_amount)

    return DiscountResponse(
        code=discount.code,
        discount_type=discount.discount_type,
        discount_value=discount.discount_value,
        discount_amount=round(discount_amount, 2),
        final_amount=round(final_amount, 2),
        message="Discount applied successfully"
    )

@router.post("/admin/", response_model=dict)
def create_discount(
    request: DiscountCreate,
    admin_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new discount code (admin only)"""
    # Check if code already exists
    existing = db.query(Discount).filter(Discount.code.ilike(request.code)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Discount code already exists"
        )

    discount = Discount(
        code=request.code.upper(),
        discount_type=request.discount_type,
        discount_value=request.discount_value,
        max_uses=request.max_uses,
        min_order_amount=request.min_order_amount,
        is_active=request.is_active
    )

    db.add(discount)
    db.commit()
    db.refresh(discount)

    return {
        "id": discount.id,
        "code": discount.code,
        "message": "Discount created successfully"
    }

@router.get("/admin/")
def get_discounts(
    admin_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all discount codes (admin only)"""
    discounts = db.query(Discount).all()
    return [
        {
            "id": d.id,
            "code": d.code,
            "discount_type": d.discount_type,
            "discount_value": d.discount_value,
            "max_uses": d.max_uses,
            "uses_count": d.uses_count,
            "min_order_amount": d.min_order_amount,
            "is_active": d.is_active,
            "created_at": d.created_at,
            "updated_at": d.updated_at
        }
        for d in discounts
    ]

@router.get("/admin/{discount_id}")
def get_discount(
    discount_id: int,
    admin_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get a specific discount code (admin only)"""
    discount = db.query(Discount).filter(Discount.id == discount_id).first()

    if not discount:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discount not found"
        )

    return {
        "id": discount.id,
        "code": discount.code,
        "discount_type": discount.discount_type,
        "discount_value": discount.discount_value,
        "max_uses": discount.max_uses,
        "uses_count": discount.uses_count,
        "min_order_amount": discount.min_order_amount,
        "is_active": discount.is_active,
        "created_at": discount.created_at,
        "updated_at": discount.updated_at
    }

@router.put("/admin/{discount_id}")
def update_discount(
    discount_id: int,
    request: DiscountUpdate,
    admin_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a discount code (admin only)"""
    discount = db.query(Discount).filter(Discount.id == discount_id).first()

    if not discount:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discount not found"
        )

    # Check if new code already exists
    if request.code and request.code.upper() != discount.code:
        existing = db.query(Discount).filter(Discount.code.ilike(request.code)).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Discount code already exists"
            )
        discount.code = request.code.upper()

    if request.discount_type:
        discount.discount_type = request.discount_type
    if request.discount_value is not None:
        discount.discount_value = request.discount_value
    if request.max_uses is not None:
        discount.max_uses = request.max_uses
    if request.min_order_amount is not None:
        discount.min_order_amount = request.min_order_amount
    if request.is_active is not None:
        discount.is_active = request.is_active

    discount.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(discount)

    return {
        "id": discount.id,
        "code": discount.code,
        "message": "Discount updated successfully"
    }

@router.delete("/admin/{discount_id}")
def delete_discount(
    discount_id: int,
    admin_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a discount code (admin only)"""
    discount = db.query(Discount).filter(Discount.id == discount_id).first()

    if not discount:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Discount not found"
        )

    db.delete(discount)
    db.commit()

    return {"message": "Discount deleted successfully"}
