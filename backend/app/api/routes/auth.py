from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import timedelta, date, datetime
from app.database import get_db
from app import models
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_user
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginInput(BaseModel):
    email: str
    password: str


class RegisterInput(BaseModel):
    name: str
    email: str
    password: str
    role: str = "user"


def user_to_dict(u):
    return {"id": u.id, "name": u.name, "email": u.email, "role": u.role, "avatar": u.avatar, "created_at": str(u.created_at)}


@router.post("/login")
def login(body: LoginInput, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    from app.notifications.activity_service import ActivityService
    ActivityService(db).log(
        action="login",
        description=f"{user.name} signed in",
        actor_id=user.id,
        actor_name=user.name,
        actor_role=user.role,
    )
    # Mark attendance as present for today on first login of the day.
    employee = db.query(models.Employee).filter(models.Employee.email == user.email).first()
    if employee:
        today = date.today().isoformat()
        existing = db.query(models.AttendanceRecord).filter(
            models.AttendanceRecord.employee_id == employee.id,
            models.AttendanceRecord.date == today,
        ).first()
        if not existing:
            db.add(models.AttendanceRecord(
                employee_id=employee.id, date=today, status="present",
                check_in=datetime.now().strftime("%H:%M"),
            ))

    db.commit()

    token = create_access_token({"sub": str(user.id)}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer", "user": user_to_dict(user)}


@router.post("/register", status_code=201)
def register(body: RegisterInput, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(name=body.name, email=body.email, hashed_password=get_password_hash(body.password), role=body.role)
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id)}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer", "user": user_to_dict(user)}


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return user_to_dict(current_user)


_AVATAR_MAX_BYTES = 512 * 1024  # 512 KB base64 upper bound
_ALLOWED_AVATAR_PREFIXES = ("data:image/jpeg;base64,", "data:image/png;base64,", "data:image/webp;base64,", "data:image/gif;base64,")


class MeUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None


@router.patch("/me")
def update_me(body: MeUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if body.name is not None:
        name = body.name.strip()
        if not name or len(name) > 120:
            raise HTTPException(status_code=400, detail="Name must be between 1 and 120 characters")
        body = body.model_copy(update={"name": name})
    if body.avatar is not None:
        if len(body.avatar) > _AVATAR_MAX_BYTES:
            raise HTTPException(status_code=400, detail="Avatar image is too large (max 512 KB)")
        if not any(body.avatar.startswith(p) for p in _ALLOWED_AVATAR_PREFIXES):
            raise HTTPException(status_code=400, detail="Avatar must be a JPEG, PNG, WebP, or GIF data URI")
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(current_user, k, v)
    db.commit()
    db.refresh(current_user)
    return user_to_dict(current_user)
