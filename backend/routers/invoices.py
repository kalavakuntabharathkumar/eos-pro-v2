from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from backend.database import get_db
from backend.models import Invoice, User, Role
from backend.security import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/finance/invoices", tags=["finance"])

class InvoiceCreate(BaseModel):
    invoice_number: str; client_name: str; amount: float; tax: float = 0; due_date: str; status: str = "draft"

@router.get("/")
async def list_invoices(status: Optional[str] = Query(None), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = db.query(Invoice)
    if status: q = q.filter(Invoice.status == status)
    invoices = q.order_by(Invoice.created_at.desc()).all()
    return {"invoices": [{c.name: getattr(i, c.name) for c in i.__table__.columns} for i in invoices],
            "total_paid": sum(i.amount for i in invoices if i.status == "paid"),
            "total_pending": sum(i.amount for i in invoices if i.status in ("draft","sent"))}

@router.post("/", status_code=201)
async def create_invoice(data: InvoiceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in (Role.ADMIN, Role.FINANCE): raise HTTPException(status_code=403, detail="Not authorized")
    inv = Invoice(invoice_number=data.invoice_number, client_name=data.client_name, amount=data.amount,
        tax=data.tax, status=data.status, due_date=datetime.fromisoformat(data.due_date),
        created_by=current_user.id, created_at=datetime.utcnow())
    db.add(inv); db.commit(); db.refresh(inv); return inv

@router.patch("/{invoice_id}/status")
async def update_status(invoice_id: int, status: str = Query(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv: raise HTTPException(status_code=404, detail="Not found")
    inv.status = status; db.commit(); return inv
