from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from backend.database import get_db
from backend.models import SupportTicket, User, Role
from backend.security import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/support", tags=["support"])

class TicketCreate(BaseModel):
    title: str; description: str; priority: str = "medium"

@router.get("/tickets")
async def list_tickets(status: Optional[str] = Query(None), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = db.query(SupportTicket)
    if current_user.role not in (Role.ADMIN, Role.HR): q = q.filter(SupportTicket.submitted_by == current_user.id)
    if status: q = q.filter(SupportTicket.status == status)
    return q.order_by(SupportTicket.created_at.desc()).all()

@router.post("/tickets", status_code=201)
async def create_ticket(data: TicketCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    t = SupportTicket(**data.dict(), submitted_by=current_user.id, status="open", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    db.add(t); db.commit(); db.refresh(t); return t

@router.patch("/tickets/{ticket_id}/close")
async def close_ticket(ticket_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    t = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not t: raise HTTPException(status_code=404, detail="Ticket not found")
    t.status = "closed"; t.updated_at = datetime.utcnow(); db.commit(); return t
