import os
import torch
from sentence_transformers import SentenceTransformer

DATA_DIR = "data/documents"

model = SentenceTransformer("all-MiniLM-L6-v2")

documents = []
sources = []
embeddings = None

def load_documents():
    global documents, sources
    documents = []
    sources = []

    if not os.path.exists(DATA_DIR):
        return

    for file in os.listdir(DATA_DIR):
        path = os.path.join(DATA_DIR, file)
        if file.endswith(".txt"):
            with open(path, "r", encoding="utf-8") as f:
                text = f.read().strip()
                if text:
                    documents.append(text)
                    sources.append(file)

def build_embeddings():
    global embeddings
    if not documents:
        embeddings = None
        return
    embeddings = model.encode(documents, convert_to_tensor=True)

load_documents()
build_embeddings()

def retrieve_context(question: str, top_k: int = 3):
    if embeddings is None or len(documents) == 0:
        return "", []

    query_embedding = model.encode(question, convert_to_tensor=True)
    scores = torch.cosine_similarity(query_embedding, embeddings)
    top_indices = torch.topk(scores, min(top_k, len(scores))).indices

    context = []
    used_sources = []

    for idx in top_indices:
        context.append(documents[idx])
        used_sources.append({
            "filename": sources[idx],
            "chunk_id": int(idx)
        })

    return "\n".join(context), used_sources

def answer_question(question: str):
    context, used_sources = retrieve_context(question)

    if not context:
        return (
            "I don’t have enough information in my knowledge base to answer this question yet.",
            []
        )

    lines = [line.strip() for line in context.split("\n") if line.strip()]
    answer = " ".join(lines[:5])

    return answer, used_sources
