from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm.groq_service import GroqService
from services.tutor import evaluate_speaking, tutor_chat
from core.config import get_settings

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    api_key: str = ""

class EvaluateRequest(BaseModel):
    text: str
    topic: str
    api_key: str = ""

def get_llm(api_key: str):
    settings = get_settings()
    key = api_key or settings.groq_api_key
    if not key:
        raise HTTPException(status_code=400, detail="No API key provided")
    return GroqService(api_key=key)

@router.post("/message")
async def chat_message(req: ChatRequest):
    llm = get_llm(req.api_key)
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    response = await tutor_chat(messages, llm)
    return {"response": response}

@router.post("/evaluate")
async def evaluate(req: EvaluateRequest):
    llm = get_llm(req.api_key)
    result = await evaluate_speaking(req.text, req.topic, llm)
    return result
