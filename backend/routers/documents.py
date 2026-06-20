from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
import os, shutil
from backend.database import get_db
from backend.models import Document, User, Role
from backend.security import get_current_user
from backend.config import settings

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.get("/")
async def list_documents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role in (Role.ADMIN, Role.HR):
        return db.query(Document).order_by(Document.created_at.desc()).all()
    return db.query(Document).filter(
        (Document.uploaded_by == current_user.id) | (Document.department_id == current_user.department_id)
    ).order_by(Document.created_at.desc()).all()

@router.post("/", status_code=201)
async def upload_document(file: UploadFile = File(...), title: str = Form(""), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    filename = f"{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    with open(file_path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)
    file.file.seek(0, 2)
    file_size = file.file.tell()
    doc = Document(title=title or file.filename or "", file_path=file_path,
        file_type=file.content_type or "application/octet-stream", file_size=file_size,
        uploaded_by=current_user.id, department_id=current_user.department_id, created_at=datetime.utcnow())
    db.add(doc); db.commit(); db.refresh(doc); return doc

@router.delete("/{doc_id}", status_code=204)
async def delete_document(doc_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc: raise HTTPException(status_code=404, detail="Not found")
    if doc.uploaded_by != current_user.id and current_user.role != Role.ADMIN: raise HTTPException(status_code=403, detail="Forbidden")
    if os.path.exists(doc.file_path): os.remove(doc.file_path)
    db.delete(doc); db.commit()
