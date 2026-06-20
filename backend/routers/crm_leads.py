from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from backend.database import get_db
from backend.models import CRMLead, User, Role
from backend.security import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/crm/leads", tags=["crm"])

class LeadCreate(BaseModel):
    name: str; email: str; company: str; phone: Optional[str] = None
    status: str = "new"; value: float = 0.0; assigned_to: Optional[int] = None

@router.get("/")
async def list_leads(status: Optional[str] = Query(None), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = db.query(CRMLead)
    if current_user.role == Role.EMPLOYEE:
        q = q.filter(CRMLead.assigned_to == current_user.id)
    if status:
        q = q.filter(CRMLead.status == status)
    return q.order_by(CRMLead.created_at.desc()).all()

@router.post("/", status_code=201)
async def create_lead(data: LeadCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    lead = CRMLead(**data.dict(), created_at=datetime.utcnow())
    db.add(lead); db.commit(); db.refresh(lead)
    return lead

@router.put("/{lead_id}")
async def update_lead(lead_id: int, data: LeadCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    lead = db.query(CRMLead).filter(CRMLead.id == lead_id).first()
    if not lead: raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.dict(exclude_unset=True).items(): setattr(lead, k, v)
    db.commit(); return lead

@router.delete("/{lead_id}", status_code=204)
async def delete_lead(lead_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    lead = db.query(CRMLead).filter(CRMLead.id == lead_id).first()
    if not lead: raise HTTPException(status_code=404, detail="Not found")
    db.delete(lead); db.commit()
