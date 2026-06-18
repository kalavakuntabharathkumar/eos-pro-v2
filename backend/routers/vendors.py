from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from backend.database import get_db
from backend.models import Vendor, User
from backend.security import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/erp/vendors", tags=["erp"])

class VendorCreate(BaseModel):
    name: str
    contact_email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    category: str

@router.get("/")
async def list_vendors(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Vendor).order_by(Vendor.name).all()

@router.get("/{vendor_id}")
async def get_vendor(vendor_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    v = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return v

@router.post("/", status_code=201)
async def create_vendor(data: VendorCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vendor = Vendor(**data.dict(), created_at=datetime.utcnow())
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return vendor

@router.put("/{vendor_id}")
async def update_vendor(vendor_id: int, data: VendorCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.dict(exclude_unset=True).items():
        setattr(vendor, k, v)
    db.commit()
    return vendor

@router.delete("/{vendor_id}", status_code=204)
async def delete_vendor(vendor_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(vendor)
    db.commit()
