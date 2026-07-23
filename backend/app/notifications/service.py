"""
Notification service — notifications module removed; this is a no-op stub
so other services that import it don't break.
"""
from sqlalchemy.orm import Session


class NotificationService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, title: str, message: str, notif_type: str = "info",
               user_id: int = None, link: str = None, target_role: str = None):
        return None

    def create_for_role(self, title: str, message: str, role: str,
                        notif_type: str = "info", link: str = None):
        return None

    def create_global(self, title: str, message: str, notif_type: str = "info",
                      link: str = None):
        return None
