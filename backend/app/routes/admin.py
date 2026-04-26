from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Order, Product, Category, OrderStatus
from app.schemas import ProductCreate, ProductUpdate
from app.security import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["admin"])


def _serialize_order(order: Order) -> dict:
    return {
        "id": order.id,
        "status": order.status.value if hasattr(order.status, "value") else str(order.status),
        "total_price": order.total_price,
        "shipping_address": order.shipping_address,
        "created_at": order.created_at,
        "user": {
            "id": order.user.id,
            "username": order.user.username,
            "email": order.user.email,
        } if order.user else None,
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price,
                "product": {
                    "id": item.product.id,
                    "name": item.product.name,
                    "image_url": item.product.image_url,
                } if item.product else None,
            }
            for item in order.items
        ],
    }


def _serialize_product(product: Product) -> dict:
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "stock": product.stock,
        "category_id": product.category_id,
        "image_url": product.image_url,
        "created_at": product.created_at,
        "category": {
            "id": product.category.id,
            "name": product.category.name,
            "slug": product.category.slug,
        } if product.category else None,
    }


@router.get("/dashboard")
def admin_dashboard(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    orders = db.query(Order).all()
    total_revenue = sum(order.total_price for order in orders)
    pending_orders = sum(1 for order in orders if order.status == OrderStatus.PENDING)
    users_count = db.query(User).count()
    products_count = db.query(Product).count()

    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(8).all()

    return {
        "admin": {
            "id": current_admin.id,
            "username": current_admin.username,
            "email": current_admin.email,
        },
        "metrics": {
            "total_orders": len(orders),
            "total_revenue": total_revenue,
            "pending_orders": pending_orders,
            "total_users": users_count,
            "total_products": products_count,
        },
        "recent_orders": [_serialize_order(order) for order in recent_orders],
    }


@router.get("/orders")
def admin_get_orders(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    _ = current_admin
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return {
        "results": [_serialize_order(order) for order in orders],
        "count": len(orders),
    }


@router.put("/orders/{order_id}/status")
def admin_update_order_status(
    order_id: int,
    payload: dict,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    _ = current_admin
    status_value = payload.get("status")
    allowed = {item.value for item in OrderStatus}

    if status_value not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Allowed values: {', '.join(sorted(allowed))}",
        )

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    order.status = OrderStatus(status_value)
    db.commit()
    db.refresh(order)
    return _serialize_order(order)


@router.get("/products")
def admin_get_products(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    _ = current_admin
    products = db.query(Product).order_by(Product.created_at.desc()).all()
    categories = db.query(Category).order_by(Category.name.asc()).all()
    return {
        "results": [_serialize_product(product) for product in products],
        "categories": [
            {"id": category.id, "name": category.name, "slug": category.slug}
            for category in categories
        ],
        "count": len(products),
    }


@router.post("/products")
def admin_create_product(
    product: ProductCreate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    _ = current_admin
    category = db.query(Category).filter(Category.id == product.category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return _serialize_product(db_product)


@router.put("/products/{product_id}")
def admin_update_product(
    product_id: int,
    product_update: ProductUpdate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    _ = current_admin
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    update_data = product_update.model_dump(exclude_unset=True)

    if "category_id" in update_data:
        category = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return _serialize_product(product)


@router.delete("/products/{product_id}")
def admin_delete_product(
    product_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    _ = current_admin
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}
