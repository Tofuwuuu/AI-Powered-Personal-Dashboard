from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..settings import settings
from openai import OpenAI


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    model: str = "gpt-4o-mini"


client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

router = APIRouter()


@router.post("/chat")
def chat(req: ChatRequest):
    if not client:
        raise HTTPException(status_code=400, detail="OPENAI_API_KEY not configured")
    response = client.chat.completions.create(
        model=req.model,
        messages=[{"role": m.role, "content": m.content} for m in req.messages],
        temperature=0.2,
    )
    return {"message": response.choices[0].message}


