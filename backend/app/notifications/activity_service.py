"""
Activity log service — ActivityLog model removed; this is a no-op stub
so other services that import it don't break.
"""
from sqlalchemy.orm import Session


class ActivityService:
    def __init__(self, db: Session):
        self.db = db

    def log(self, action: str, description: str, actor_id: int = None,
            actor_name: str = None, actor_role: str = None,
            entity_type: str = None, entity_id: int = None):
        return None
