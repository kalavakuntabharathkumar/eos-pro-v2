"""Department analytics service — per-department operational metrics."""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app import models
from app.core.scoping import get_effective_scope


def get_department_analytics(user, db: Session) -> dict:
    scope = get_effective_scope(user, db)
    level = scope["level"]
    scope_dept = scope.get("dept")

    cutoff = datetime.utcnow() - timedelta(days=30)

    # Derive departments from employee records
    all_emps = db.query(models.Employee).all()
    emp_dept_map: dict[int, str] = {e.id: e.department for e in all_emps}

    dept_names = sorted({e.department for e in all_emps if e.department})
    if level == "dept_head" and scope_dept:
        dept_names = [d for d in dept_names if d == scope_dept]

    # Leave requests in last 30 days
    recent_leaves = db.query(models.LeaveRequest).filter(
        models.LeaveRequest.created_at >= cutoff
    ).all()

    # Document uploads in last 30 days
    recent_docs = db.query(models.Document).filter(
        models.Document.created_at >= cutoff
    ).all()

    # Leave by department
    leave_by_dept: dict[str, int] = {}
    for lr in recent_leaves:
        dept = emp_dept_map.get(lr.employee_id, "")
        if dept:
            leave_by_dept[dept] = leave_by_dept.get(dept, 0) + 1

    # Docs by department
    docs_by_dept: dict[str, int] = {}
    for d in recent_docs:
        dept = d.department or ""
        if dept:
            docs_by_dept[dept] = docs_by_dept.get(dept, 0) + 1

    emp_count_by_dept: dict[str, int] = {}
    for e in all_emps:
        emp_count_by_dept[e.department] = emp_count_by_dept.get(e.department, 0) + 1

    departments = [
        {
            "department": dept_name,
            "employee_count": emp_count_by_dept.get(dept_name, 0),
            "leave_requests_30d": leave_by_dept.get(dept_name, 0),
            "activity_count_30d": 0,
            "doc_uploads_30d": docs_by_dept.get(dept_name, 0),
        }
        for dept_name in dept_names
    ]

    return {
        "scope_dept": scope_dept,
        "departments": departments,
    }


def get_department_activity_export_rows(user, db: Session) -> list[dict]:
    """Export aggregated department metrics."""
    data = get_department_analytics(user, db)
    return data["departments"]
