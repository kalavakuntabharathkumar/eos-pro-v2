from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.models import User, LeaveRequest, Department, Attendance
from datetime import datetime, timedelta

def get_headcount_by_department(db: Session):
    """Fixed: use outerjoin so departments with 0 employees still appear."""
    results = db.query(Department.name, func.count(User.id).label("count")).outerjoin(
        User, (User.department_id == Department.id) & (User.is_active == True)
    ).group_by(Department.id, Department.name).all()
    return [{"department": r.name, "count": r.count or 0} for r in results]

def get_leave_stats(db: Session):
    total = db.query(LeaveRequest).count()
    pending = db.query(LeaveRequest).filter(LeaveRequest.status == "pending").count()
    approved = db.query(LeaveRequest).filter(LeaveRequest.status == "approved").count()
    rejected = db.query(LeaveRequest).filter(LeaveRequest.status == "rejected").count()
    return {"total": total, "pending": pending, "approved": approved, "rejected": rejected}

def get_attendance_rate(db: Session, days: int = 30) -> float:
    since = datetime.utcnow() - timedelta(days=days)
    total_employees = db.query(User).filter(User.is_active == True).count()
    if not total_employees:
        return 0.0
    present_count = db.query(Attendance).filter(Attendance.date >= since, Attendance.status == "present").count()
    expected = total_employees * days
    return round((present_count / expected) * 100, 2) if expected else 0.0

def get_new_hires(db: Session, days: int = 30) -> int:
    since = datetime.utcnow() - timedelta(days=days)
    return db.query(User).filter(User.created_at >= since, User.is_active == True).count()
