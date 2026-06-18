from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from backend.database import get_db
from backend.models import Project, Task, Milestone, User
from backend.security import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/projects", tags=["projects"])

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    status: str = "active"

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: int
    assigned_to: Optional[int] = None
    priority: str = "medium"
    due_date: Optional[str] = None
    status: str = "todo"

class MilestoneCreate(BaseModel):
    title: str
    project_id: int
    due_date: str

@router.get("/")
async def list_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Project).order_by(Project.created_at.desc()).all()

@router.post("/", status_code=201)
async def create_project(data: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = Project(name=data.name, description=data.description, status=data.status,
        start_date=datetime.fromisoformat(data.start_date),
        end_date=datetime.fromisoformat(data.end_date) if data.end_date else None,
        manager_id=current_user.id, created_at=datetime.utcnow())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/{project_id}/tasks")
async def get_tasks(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Task).filter(Task.project_id == project_id).all()

@router.post("/tasks", status_code=201)
async def create_task(data: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = Task(**data.dict(), created_at=datetime.utcnow())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/{project_id}/milestones")
async def get_milestones(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Milestone).filter(Milestone.project_id == project_id).all()

@router.post("/milestones", status_code=201)
async def create_milestone(data: MilestoneCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    m = Milestone(title=data.title, project_id=data.project_id,
        due_date=datetime.fromisoformat(data.due_date), created_at=datetime.utcnow())
    db.add(m)
    db.commit()
    db.refresh(m)
    return m
