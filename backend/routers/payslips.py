from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from backend.database import get_db
from backend.models import Payslip, User, Role
from backend.security import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/hrms/payslips", tags=["hrms"])

class PayslipCreate(BaseModel):
    employee_id: int
    month: int
    year: int
    basic_salary: float
    allowances: float = 0
    deductions: float = 0

@router.get("/")
async def list_payslips(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role in (Role.ADMIN, Role.HR, Role.FINANCE):
        return db.query(Payslip).order_by(Payslip.year.desc(), Payslip.month.desc()).all()
    return db.query(Payslip).filter(Payslip.employee_id == current_user.id).all()

@router.post("/", status_code=201)
async def generate_payslip(data: PayslipCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in (Role.ADMIN, Role.HR, Role.FINANCE):
        raise HTTPException(status_code=403, detail="Not authorized")
    payslip = Payslip(
        employee_id=data.employee_id,
        month=data.month, year=data.year,
        basic_salary=data.basic_salary,
        allowances=data.allowances,
        deductions=data.deductions,
        net_salary=data.basic_salary + data.allowances - data.deductions,
        generated_at=datetime.utcnow(),
    )
    db.add(payslip)
    db.commit()
    db.refresh(payslip)
    return payslip
