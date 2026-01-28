import os
import re
import torch
from sentence_transformers import SentenceTransformer

from backend.web_retrieval import search_web
from backend.reasoning import decompose_question, generate_reasoning_summary
from backend.answer_rules import classify_question, format_answer


DATA_DIR = "data/documents"
SIMILARITY_THRESHOLD = 0.35   # relaxed (important)
TOP_K_LOCAL = 2

model = SentenceTransformer("all-MiniLM-L6-v2")

documents = []
doc_sources = []
embeddings = None


# -------------------------
# Normalization (CRITICAL)
# -------------------------
COMMON_CORRECTIONS = {
    "desent": "descent",
    "algoritm": "algorithm",
    "reinforcemnt": "reinforcement",
    "optmization": "optimization",
}

def normalize_question(q: str) -> str:
    q = q.lower().strip()
    words = q.split()
    words = [COMMON_CORRECTIONS.get(w, w) for w in words]
    return " ".join(words)


# -------------------------
# Load local documents
# -------------------------
def load_documents():
    global documents, doc_sources
    documents, doc_sources = [], []

    if not os.path.exists(DATA_DIR):
        return

    for file in os.listdir(DATA_DIR):
        if file.endswith(".txt"):
            path = os.path.join(DATA_DIR, file)
            with open(path, "r", encoding="utf-8") as f:
                text = f.read().strip()
                if text:
                    documents.append(text)
                    doc_sources.append(file)


def build_embeddings():
    global embeddings
    embeddings = (
        model.encode(documents, convert_to_tensor=True)
        if documents else None
    )


load_documents()
build_embeddings()


# -------------------------
# Local retrieval
# -------------------------
def retrieve_local_facts(question: str):
    if embeddings is None or not documents:
        return [], [], False

    q_emb = model.encode(question, convert_to_tensor=True)
    scores = torch.cosine_similarity(q_emb, embeddings)

    if torch.max(scores).item() < SIMILARITY_THRESHOLD:
        return [], [], False

    k = min(TOP_K_LOCAL, scores.shape[0])
    top_idx = torch.topk(scores, k).indices

    facts, sources = [], []

    for idx in top_idx:
        sentences = documents[idx].split(".")
        for s in sentences:
            s = s.strip()
            if len(s) > 40:
                facts.append(s + ".")

        sources.append({
            "title": doc_sources[idx],
            "url": f"local://{doc_sources[idx]}"
        })

    return facts, sources, True


# -------------------------
# Web retrieval (cleaned)
# -------------------------
def is_bad_source(title: str) -> bool:
    if not title:
        return True

    t = title.lower()
    reject_terms = [
        "song", "album", "film", "movie", "painting",
        "book", "novel", "lyrics", "band"
    ]
    return any(term in t for term in reject_terms)


def retrieve_web_facts(question: str):
    facts, sources = [], []
    results = search_web(question)

    for r in results:
        title = r.get("title")
        snippet = r.get("snippet")

        if not snippet or len(snippet.strip()) < 40:
            continue

        if is_bad_source(title):
            continue

        cleaned = re.sub(
            r"^(\d+\s+(seconds?|minutes?|hours?|days?|weeks?|months?|years?)\s+ago\s*[-–—·]\s*)",
            "",
            snippet,
            flags=re.IGNORECASE
        )

        cleaned = cleaned.replace("...", "").replace("…", "").strip()

        facts.append(cleaned)
        sources.append({
            "title": title,
            "url": r.get("url")
        })

    return facts, sources


# -------------------------
# Ranking
# -------------------------
def rank_facts(question: str, facts: list[str]):
    if not facts:
        return []

    q_emb = model.encode(question, convert_to_tensor=True)
    f_embs = model.encode(facts, convert_to_tensor=True)
    scores = torch.cosine_similarity(q_emb, f_embs)

    ranked = sorted(
        zip(facts, scores.tolist()),
        key=lambda x: x[1],
        reverse=True
    )

    return [f[0] for f in ranked]


# -------------------------
# FINAL ANSWER PIPELINE
# -------------------------
def answer_question(question: str):
    original_question = question
    question = normalize_question(question)

    question_type = classify_question(question)
    sub_questions = decompose_question(question)

    all_facts, all_sources = [], []
    used_local, used_web = False, False

    for sq in sub_questions:
        lf, ls, lu = retrieve_local_facts(sq)
        if lf:
            used_local = True
            all_facts.extend(lf)
            all_sources.extend(ls)

        wf, ws = retrieve_web_facts(sq)
        if wf:
            used_web = True
            all_facts.extend(wf)
            all_sources.extend(ws)

    ranked_facts = rank_facts(question, all_facts)

    # ❗ DO NOT OVER-FILTER DEFINITIONS
    if not ranked_facts:
        final_answer = "I could not find sufficient reliable information to answer this question."
    else:
        final_answer = format_answer(question_type, ranked_facts)

    return (
        {
            "final_answer": final_answer,
            "facts": ranked_facts[:6],
            "assumptions": [
                "The retrieved information from internal documents and web sources is assumed to be accurate and up to date."
            ],
            "reasoning_summary": generate_reasoning_summary(
                sub_questions=sub_questions,
                used_web=used_web,
                used_local=used_local
            ),
            "answer_type": question_type
        },
        all_sources[:5]
    )
