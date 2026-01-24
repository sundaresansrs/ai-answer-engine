# MindX — AI Answer Engine

**MindX** is a full-stack AI Answer Engine designed to deliver reliable, source-backed answers instead of hallucinated responses.  
The system retrieves relevant knowledge, reasons over it, and returns answers with verifiable sources.

**Tagline:**  
**Answers you can trust. Sources you can verify.**

---

##  Features

- Source-grounded question answering  
- Retrieval-Augmented Generation (RAG) pipeline  
- Modern frontend UI (Next.js + Tailwind CSS)  
- FastAPI-based backend  
- Persistent conversation history using MongoDB Atlas  
- Clean, production-style architecture  

---

##  System Architecture

Frontend (Next.js)  
|  
| HTTP Requests  
v  
Backend API (FastAPI)  
|  
|-- RAG Pipeline  
| ├── Document Loader  
| ├── Embedding Model (SentenceTransformer)  
| ├── Similarity Search  
| └── Answer Builder  
|  
|-- MongoDB Atlas  
└── Conversation Storage

---

##  Setup Instructions

### Prerequisites

- Python 3.12+  
- Node.js 18+  
- npm  
- MongoDB Atlas account

---

##  Backend Setup (FastAPI)

```bash
cd ai-answer-engine
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Environment Variable:
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>
# Password must be URL encoded.
```

Run Backend:
```bash
uvicorn backend.main:app --reload
```

Backend URL:
```
http://127.0.0.1:8000
```

Swagger UI:
```
http://127.0.0.1:8000/docs
```

---

##  Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:
```
http://localhost:3000
```

---

## 🧩 How MindX Works

1. User submits a question from the frontend  
2. Frontend sends the request to FastAPI backend  
3. Backend embeds the query  
4. Relevant document chunks are retrieved using cosine similarity  
5. A grounded answer is generated from retrieved context  
6. Answer and sources are returned to the frontend  
7. Conversation is stored in MongoDB Atlas

---

##  Knowledge Source

- Internal text documents  
- Embedded using SentenceTransformer  
- Ranked via cosine similarity  
- Ensures answers are grounded and verifiable

---

##  Major Problems Faced & Solutions

- MongoDB Local Connection Issues  
  - Local MongoDB failed due to network restrictions.  
  - Solution: Migrated to MongoDB Atlas (cloud-based).

- Invalid MongoDB URI Errors  
  - Special characters in passwords caused URI failures.  
  - Solution: Applied proper URL encoding.

- CORS Errors Between Frontend and Backend  
  - Browser blocked cross-origin API calls.  
  - Solution: Configured CORS middleware in FastAPI.

- Empty Embedding Runtime Errors  
  - Cosine similarity failed when documents were missing.  
  - Solution: Added validation checks before similarity computation.

- Over-Verbose and Prompt-Leaking Answers  
  - Initial responses contained prompts and context.  
  - Solution: Post-processed output to return only final answers and sources.

- Swagger UI Not User-Friendly  
  - Swagger was suitable for testing but not end users.  
  - Solution: Built a dedicated frontend UI using Next.js.

---

##  Current Status

- Backend API: Complete  
- RAG pipeline: Functional  
- Frontend UI (MindX): Implemented  
- Database persistence: Enabled  
- Production-style structure: Achieved

---

##  Future Enhancements

- Multi-document chunking  
- Web search + document hybrid retrieval  
- Streaming responses  
- Authentication & role management  
- Admin document upload UI

---

##  Project Summary

MindX is a production-style AI Answer Engine demonstrating backend engineering, retrieval-based reasoning, database integration, and frontend system design.

MindX — Answers you can trust. Sources you can verify.