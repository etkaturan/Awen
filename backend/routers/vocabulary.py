from fastapi import APIRouter, Depends
from pydantic import BaseModel
from core.database import get_db
import sqlite3

router = APIRouter(prefix="/vocabulary", tags=["vocabulary"])

class WordIn(BaseModel):
    word_de: str
    word_en: str
    article: str = ""

class WordUpdate(BaseModel):
    status: str  # new, learning, known

@router.get("/")
def get_words(db: sqlite3.Connection = Depends(get_db)):
    words = db.execute("SELECT * FROM vocabulary ORDER BY created_at DESC").fetchall()
    return [dict(w) for w in words]

@router.post("/")
def add_word(word: WordIn, db: sqlite3.Connection = Depends(get_db)):
    db.execute(
        "INSERT INTO vocabulary (user_id, word_de, word_en, article, status) VALUES (1, ?, ?, ?, 'new')",
        (word.word_de, word.word_en, word.article)
    )
    db.commit()
    return {"ok": True}

@router.patch("/{word_id}")
def update_status(word_id: int, update: WordUpdate, db: sqlite3.Connection = Depends(get_db)):
    db.execute("UPDATE vocabulary SET status = ? WHERE id = ?", (update.status, word_id))
    db.commit()
    return {"ok": True}

@router.delete("/{word_id}")
def delete_word(word_id: int, db: sqlite3.Connection = Depends(get_db)):
    db.execute("DELETE FROM vocabulary WHERE id = ?", (word_id,))
    db.commit()
    return {"ok": True}