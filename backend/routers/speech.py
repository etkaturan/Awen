from fastapi import APIRouter, Depends
from pydantic import BaseModel
from services.llm.groq_service import GroqService
from services.speech.tts import synthesize, get_all_voices
from core.config import get_settings

router = APIRouter(prefix="/speech", tags=["speech"])

class ParagraphRequest(BaseModel):
    text: str
    api_key: str = ""

class PracticeRequest(BaseModel):
    paragraph: str
    user_answer: str
    api_key: str = ""

class TTSRequest(BaseModel):
    text: str
    voice_key: str = "de_female_1"
    speed: float = 1.0

class ListeningRequest(BaseModel):
    topic: str
    difficulty: str = "B2"
    api_key: str = ""

def get_llm(api_key: str):
    settings = get_settings()
    key = api_key or settings.groq_api_key
    return GroqService(api_key=key)

@router.get("/voices")
def list_voices():
    return get_all_voices()

@router.post("/tts")
async def text_to_speech(req: TTSRequest):
    result = await synthesize(req.text, req.voice_key, req.speed)
    return result

@router.post("/analyze-paragraph")
async def analyze_paragraph(req: ParagraphRequest):
    llm = get_llm(req.api_key)
    prompt = (
        f"Analyze this German paragraph for a B2 learner. "
        f"Identify: 1) Key vocabulary, 2) Grammar structures used, 3) Difficulty level. "
        f"Be concise.\n\nParagraph:\n{req.text}"
    )
    response = await llm.chat([{"role": "user", "content": prompt}])
    return {"analysis": response}

@router.post("/practice-paragraph")
async def practice_paragraph(req: PracticeRequest):
    llm = get_llm(req.api_key)
    prompt = (
        f"The learner was asked to reproduce or paraphrase this paragraph:\n"
        f"ORIGINAL:\n{req.paragraph}\n\n"
        f"LEARNER'S VERSION:\n{req.user_answer}\n\n"
        f"Compare them. Point out: differences, grammar mistakes, missing key phrases. "
        f"Rate Accuracy, Fluency, Vocabulary out of 100. Be encouraging."
    )
    response = await llm.chat([{"role": "user", "content": prompt}])
    return {"feedback": response}

@router.post("/generate-listening")
async def generate_listening(req: ListeningRequest):
    llm = get_llm(req.api_key)
    prompt = (
        f"Create a {req.difficulty} German listening exercise about: {req.topic}.\n\n"
        f"Return ONLY valid JSON in this exact format:\n"
        f'{{"text": "3-4 sentence German paragraph", '
        f'"questions": [{{"question": "English question?", "answer": "English answer"}}], '
        f'"vocabulary": [{{"de": "German word", "en": "English meaning"}}]}}'
    )
    response = await llm.chat([{"role": "user", "content": prompt}])
    import json, re
    try:
        cleaned = re.sub(r"```json|```", "", response).strip()
        return json.loads(cleaned)
    except Exception:
        return {"error": "Could not parse AI response", "raw": response}