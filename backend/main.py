from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.rag import answer_question
from backend.auth import get_current_user
from backend.db import save_conversation, get_user_conversations

app = FastAPI(title="MindX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

@app.get("/")
def health():
    return {"status": "MindX backend running"}

@app.post("/ask")
def ask_question(
    payload: QuestionRequest,
    user_id: str = Depends(get_current_user)
):
    answer, sources = answer_question(payload.question)

    try:
        save_conversation(
            user_id=user_id,
            question=payload.question,
            answer=answer,
            sources=sources
        )
    except Exception as e:
        print("MongoDB logging failed:", e)

    return {
        "user_id": user_id,
        "question": payload.question,
        "answer": answer,
        "sources": sources
    }

@app.get("/history")
def get_history(user_id: str = Depends(get_current_user)):
    return get_user_conversations(user_id)
