from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User
from backend.security import get_current_user
from backend.config import settings
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/ai", tags=["ai"])

class ChatMessage(BaseModel):
    role: str; content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]; context: str = "general"

@router.post("/chat")
async def ai_chat(req: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="AI service not configured. Please set OPENAI_API_KEY.")
    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        system = f"You are an AI assistant for Enterprise OS. Help {current_user.full_name} (role: {current_user.role}) with HR queries, project management, financial questions, and general workplace support. Be concise and professional."
        messages = [{"role":"system","content":system}] + [{"role":m.role,"content":m.content} for m in req.messages[-10:]]
        response = client.chat.completions.create(model="gpt-4o-mini", messages=messages, max_tokens=800, temperature=0.7)
        return {"reply": response.choices[0].message.content, "model": response.model}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
