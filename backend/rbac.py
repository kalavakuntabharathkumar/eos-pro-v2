from functools import wraps
from fastapi import HTTPException, status
from backend.models import Role

PERMISSIONS = {
    Role.ADMIN: [
        "users:read", "users:write", "users:delete",
        "hrms:read", "hrms:write", "hrms:delete",
        "finance:read", "finance:write", "finance:delete",
        "crm:read", "crm:write", "crm:delete",
        "erp:read", "erp:write", "erp:delete",
        "projects:read", "projects:write", "projects:delete",
        "analytics:read", "documents:read", "documents:write",
        "support:read", "support:write",
        "workflows:read", "workflows:write",
        "notifications:read", "notifications:write",
    ],
    Role.HR: [
        "hrms:read", "hrms:write",
        "users:read",
        "analytics:read",
        "documents:read", "documents:write",
        "notifications:read",
    ],
    Role.MANAGER: [
        "hrms:read", "hrms:write",
        "projects:read", "projects:write",
        "analytics:read",
        "documents:read",
        "notifications:read",
    ],
    Role.EMPLOYEE: [
        "hrms:read",
        "projects:read",
        "documents:read",
        "notifications:read",
    ],
    Role.FINANCE: [
        "finance:read", "finance:write",
        "analytics:read",
        "documents:read",
        "notifications:read",
    ],
    Role.CRM: [
        "crm:read", "crm:write",
        "analytics:read",
        "notifications:read",
    ],
}

def has_permission(user, permission: str) -> bool:
    return permission in PERMISSIONS.get(user.role, [])

def require_permission(permission: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get("current_user")
            if not current_user or not has_permission(current_user, permission):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Permission denied: {permission}")
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def inherit_permissions(role: Role) -> list:
    base = list(PERMISSIONS.get(role, []))
    if role == Role.MANAGER:
        base = list(set(base + PERMISSIONS.get(Role.EMPLOYEE, [])))
    return base
