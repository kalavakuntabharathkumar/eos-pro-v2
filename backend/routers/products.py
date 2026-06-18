from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from backend.database import get_db
from backend.models import Product, User, Role
from backend.security import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/erp/products", tags=["erp"])

class ProductCreate(BaseModel):
    name: str
    sku: str
    category: str
    quantity: int = 0
    unit_price: float
    reorder_level: int = 10

@router.get("/")
async def list_products(category: Optional[str] = Query(None), low_stock: Optional[bool] = Query(None), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = db.query(Product)
    if category:
        q = q.filter(Product.category == category)
    if low_stock:
        q = q.filter(Product.quantity <= Product.reorder_level)
    return q.all()

@router.post("/", status_code=201)
async def create_product(data: ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = Product(**data.dict(), created_at=datetime.utcnow())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}")
async def update_product(product_id: int, data: ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.dict(exclude_unset=True).items():
        setattr(product, k, v)
    db.commit()
    return product

@router.patch("/{product_id}/stock")
async def adjust_stock(product_id: int, quantity: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Not found")
    product.quantity += quantity
    db.commit()
    return {"id": product_id, "new_quantity": product.quantity}
