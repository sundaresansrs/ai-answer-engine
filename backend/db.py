from pymongo import MongoClient
import os

MONGODB_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGODB_URI)
db = client["ai_answer_engine"]
conversations = db["conversations"]

def save_conversation(user_id: str, question: str, answer: str, sources: list):
    conversations.insert_one({
        "user_id": user_id,
        "question": question,
        "answer": answer,
        "sources": sources
    })

def get_user_conversations(user_id: str):
    return list(conversations.find(
        {"user_id": user_id},
        {"_id": 0}
    ))
