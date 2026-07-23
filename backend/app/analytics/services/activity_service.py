"""Activity analytics service — returns empty data (ActivityLog model removed)."""
from sqlalchemy.orm import Session
from datetime import datetime, timedelta


def get_activity_analytics(user, db: Session) -> dict:
    now = datetime.utcnow()
    daily_activity = [
        {"date": (now - timedelta(days=i)).strftime("%b %d"), "count": 0}
        for i in range(29, -1, -1)
    ]
    return {
        "total_30d": 0,
        "daily_activity": daily_activity,
        "top_actors": [],
        "entity_type_breakdown": [],
    }
