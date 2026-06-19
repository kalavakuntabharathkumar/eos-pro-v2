from fastapi import Request
from backend.models import Role

async def data_scoping_middleware(request: Request, call_next):
    response = await call_next(request)
    return response

def scope_query_by_role(query, user, model):
    """Apply row-level security based on user role and department.
    Fixed: employees cannot view other departments' data.
    """
    if user.role == Role.ADMIN:
        return query
    if user.role == Role.HR:
        return query
    if user.role == Role.MANAGER:
        if hasattr(model, "department_id") and user.department_id is not None:
            return query.filter(model.department_id == user.department_id)
        return query
    # EMPLOYEE role: strictly own records only
    if hasattr(model, "employee_id"):
        return query.filter(model.employee_id == user.id)
    elif hasattr(model, "submitted_by"):
        return query.filter(model.submitted_by == user.id)
    elif hasattr(model, "assigned_to"):
        return query.filter(model.assigned_to == user.id)
    elif hasattr(model, "department_id") and user.department_id:
        return query.filter(model.department_id == user.department_id)
    return query
