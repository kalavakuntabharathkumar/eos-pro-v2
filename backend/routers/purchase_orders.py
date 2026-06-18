from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from backend.database import get_db
from backend.models import PurchaseOrder, User
from backend.security import get_current_user
from pydantic import BaseModel
import json

router = APIRouter(prefix="/api/erp/purchase-orders", tags=["erp"])

class POCreate(BaseModel):
    po_number: str
    vendor_id: int
    total_amount: float
    items: list
    status: str = "pending"

@router.get("/")
async def list_pos(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pos = db.query(PurchaseOrder).order_by(PurchaseOrder.created_at.desc()).all()
    result = []
    for po in pos:
        d = {c.name: getattr(po, c.name) for c in po.__table__.columns}
        d["items"] = json.loads(d.get("items") or "[]")
        result.append(d)
    return result

@router.post("/", status_code=201)
async def create_po(data: POCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    po = PurchaseOrder(
        po_number=data.po_number, vendor_id=data.vendor_id,
        total_amount=data.total_amount, items=json.dumps(data.items),
        status=data.status, created_by=current_user.id, created_at=datetime.utcnow(),
    )
    db.add(po)
    db.commit()
    db.refresh(po)
    return po

@router.patch("/{po_id}/approve")
async def approve_po(po_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Not found")
    po.status = "approved"
    db.commit()
    return po
