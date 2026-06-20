from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from backend.database import get_db
from backend.models import CRMContact, User
from backend.security import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/crm/contacts", tags=["crm"])

class ContactCreate(BaseModel):
    full_name: str; email: str; company: str; phone: Optional[str] = None; position: Optional[str] = None

@router.get("/")
async def list_contacts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(CRMContact).order_by(CRMContact.full_name).all()

@router.post("/", status_code=201)
async def create_contact(data: ContactCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    c = CRMContact(**data.dict(), created_at=datetime.utcnow())
    db.add(c); db.commit(); db.refresh(c); return c

@router.put("/{contact_id}")
async def update_contact(contact_id: int, data: ContactCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    c = db.query(CRMContact).filter(CRMContact.id == contact_id).first()
    if not c: raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.dict(exclude_unset=True).items(): setattr(c, k, v)
    db.commit(); return c

@router.delete("/{contact_id}", status_code=204)
async def delete_contact(contact_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    c = db.query(CRMContact).filter(CRMContact.id == contact_id).first()
    if not c: raise HTTPException(status_code=404, detail="Not found")
    db.delete(c); db.commit()
