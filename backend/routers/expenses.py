from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from backend.database import get_db
from backend.models import Expense, User, Role
from backend.security import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/finance/expenses", tags=["finance"])

class ExpenseCreate(BaseModel):
    title: str; amount: float; category: str

@router.get("/")
async def list_expenses(category: Optional[str] = Query(None), status: Optional[str] = Query(None), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = db.query(Expense)
    if current_user.role not in (Role.ADMIN, Role.FINANCE, Role.HR): q = q.filter(Expense.submitted_by == current_user.id)
    if category: q = q.filter(Expense.category == category)
    if status: q = q.filter(Expense.status == status)
    expenses = q.order_by(Expense.created_at.desc()).all()
    cat_totals: dict = {}
    for e in expenses: cat_totals[e.category] = cat_totals.get(e.category, 0) + e.amount
    return {"expenses": [{c.name: getattr(e, c.name) for c in e.__table__.columns} for e in expenses], "category_totals": cat_totals, "total": sum(e.amount for e in expenses)}

@router.post("/", status_code=201)
async def create_expense(data: ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    exp = Expense(**data.dict(), submitted_by=current_user.id, status="pending", created_at=datetime.utcnow())
    db.add(exp); db.commit(); db.refresh(exp); return exp

@router.patch("/{expense_id}/approve")
async def approve_expense(expense_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in (Role.ADMIN, Role.FINANCE): raise HTTPException(status_code=403, detail="Not authorized")
    exp = db.query(Expense).filter(Expense.id == expense_id).first()
    if not exp: raise HTTPException(status_code=404, detail="Not found")
    exp.status = "approved"; exp.approved_by = current_user.id; db.commit(); return exp

@router.patch("/{expense_id}/reject")
async def reject_expense(expense_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    exp = db.query(Expense).filter(Expense.id == expense_id).first()
    if not exp: raise HTTPException(status_code=404, detail="Not found")
    exp.status = "rejected"; db.commit(); return exp
