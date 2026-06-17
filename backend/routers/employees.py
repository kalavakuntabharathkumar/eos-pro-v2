from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from backend.database import get_db
from backend.models import User, Role
from backend.security import get_current_user
from backend.middleware.scoping import scope_query_by_role
from pydantic import BaseModel

router = APIRouter(prefix="/api/hrms/employees", tags=["hrms"])

class EmployeeCreate(BaseModel):
    email: str
    full_name: str
    role: str = "employee"
    department_id: Optional[int] = None

@router.get("/")
async def list_employees(
    search: Optional[str] = Query(None),
    department_id: Optional[int] = Query(None),
    skip: int = 0, limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(User).filter(User.is_active == True)
    query = scope_query_by_role(query, current_user, User)
    if search:
        query = query.filter(User.full_name.ilike(f"%{search}%"))
    if department_id:
        query = query.filter(User.department_id == department_id)
    total = query.count()
    return {"data": query.offset(skip).limit(limit).all(), "total": total}

@router.get("/{employee_id}")
async def get_employee(employee_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    emp = db.query(User).filter(User.id == employee_id, User.is_active == True).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@router.post("/", status_code=201)
async def create_employee(data: EmployeeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in (Role.ADMIN, Role.HR):
        raise HTTPException(status_code=403, detail="Not authorized")
    from backend.security import hash_password
    user = User(**data.dict(), hashed_password=hash_password("Welcome@123"), is_active=True, created_at=datetime.utcnow())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.put("/{employee_id}")
async def update_employee(employee_id: int, data: EmployeeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in (Role.ADMIN, Role.HR):
        raise HTTPException(status_code=403, detail="Not authorized")
    emp = db.query(User).filter(User.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.dict(exclude_unset=True).items():
        setattr(emp, k, v)
    db.commit()
    return emp

@router.delete("/{employee_id}", status_code=204)
async def deactivate_employee(employee_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Admin only")
    emp = db.query(User).filter(User.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Not found")
    emp.is_active = False
    db.commit()
