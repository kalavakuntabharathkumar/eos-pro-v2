from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from backend.database import get_db
from backend.models import LeaveRequest, User, Role
from backend.security import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/hrms/leaves", tags=["hrms"])

class LeaveCreate(BaseModel):
    leave_type: str
    start_date: str
    end_date: str
    reason: str

@router.get("/")
async def list_leaves(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role in (Role.ADMIN, Role.HR):
        return db.query(LeaveRequest).order_by(LeaveRequest.created_at.desc()).all()
    return db.query(LeaveRequest).filter(LeaveRequest.employee_id == current_user.id).all()

@router.post("/", status_code=201)
async def create_leave(data: LeaveCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    leave = LeaveRequest(
        employee_id=current_user.id,
        leave_type=data.leave_type,
        start_date=datetime.fromisoformat(data.start_date),
        end_date=datetime.fromisoformat(data.end_date),
        reason=data.reason,
        status="pending",
        created_at=datetime.utcnow(),
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return leave

@router.patch("/{leave_id}/approve")
async def approve_leave(leave_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in (Role.ADMIN, Role.HR, Role.MANAGER):
        raise HTTPException(status_code=403, detail="Not authorized")
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    leave.status = "approved"
    leave.approved_by = current_user.id
    db.commit()
    return leave

@router.patch("/{leave_id}/reject")
async def reject_leave(leave_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in (Role.ADMIN, Role.HR, Role.MANAGER):
        raise HTTPException(status_code=403, detail="Not authorized")
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    leave.status = "rejected"
    leave.approved_by = current_user.id
    db.commit()
    return leave
