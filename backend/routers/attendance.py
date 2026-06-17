from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.database import get_db
from backend.models import Attendance, User, Role
from backend.security import get_current_user

router = APIRouter(prefix="/api/hrms/attendance", tags=["hrms"])

@router.get("/")
async def list_attendance(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role in (Role.ADMIN, Role.HR):
        return db.query(Attendance).order_by(Attendance.date.desc()).limit(200).all()
    return db.query(Attendance).filter(Attendance.employee_id == current_user.id).all()

@router.post("/", status_code=201)
async def check_in(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    today = datetime.utcnow().date()
    if db.query(Attendance).filter(Attendance.employee_id == current_user.id, Attendance.date == today).first():
        raise HTTPException(status_code=400, detail="Already checked in today")
    record = Attendance(employee_id=current_user.id, date=today, check_in=datetime.utcnow(), status="present")
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.patch("/{record_id}/checkout")
async def check_out(record_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    record = db.query(Attendance).filter(Attendance.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    if record.employee_id != current_user.id and current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Forbidden")
    record.check_out = datetime.utcnow()
    db.commit()
    return record
