from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.models import ActivityLog, User, Department
from datetime import datetime, timedelta

def get_department_activity(db: Session, days: int = 30):
    since = datetime.utcnow() - timedelta(days=days)
    results = db.query(Department.name, func.count(ActivityLog.id).label("activity_count")).join(
        User, ActivityLog.user_id == User.id).join(Department, User.department_id == Department.id
    ).filter(ActivityLog.created_at >= since).group_by(Department.name).all()
    return [{"department": r.name, "activity_count": r.activity_count} for r in results]

def get_activity_trend(db: Session, days: int = 14):
    since = datetime.utcnow() - timedelta(days=days)
    results = db.query(func.date(ActivityLog.created_at).label("date"), func.count(ActivityLog.id).label("count")).filter(
        ActivityLog.created_at >= since).group_by(func.date(ActivityLog.created_at)).order_by(func.date(ActivityLog.created_at)).all()
    return [{"date": str(r.date), "count": r.count} for r in results]

def get_action_breakdown(db: Session):
    results = db.query(ActivityLog.action, func.count(ActivityLog.id).label("count")).group_by(
        ActivityLog.action).order_by(func.count(ActivityLog.id).desc()).limit(10).all()
    return [{"action": r.action, "count": r.count} for r in results]
