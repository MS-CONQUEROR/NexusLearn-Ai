# NexusLearn AI 🎓

**Intelligent Academic Assistant by Team Nexus**

Upload your notes, textbooks, and question papers. Ask anything. Get comprehensive answers with source citations.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-blue?style=for-the-badge)](https://nexuslearn-ai.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-purple?style=for-the-badge)](https://nexuslearn-ai-production.up.railway.app/docs)

---

## What We Built

NexusLearn AI is a production-grade multi-source RAG academic assistant. Students upload their study materials and get intelligent, cited answers — with the exact page and file referenced.

No more scrolling through 200-page PDFs. Just ask.

---

## Live Links

- Frontend: https://nexuslearn-ai.vercel.app
- Backend API: https://nexuslearn-ai-production.up.railway.app
- API Docs: https://nexuslearn-ai-production.up.railway.app/docs
- GitHub: https://github.com/MS-CONQUEROR/NexusLearn-Ai

---

## Features

- Upload PDF, DOCX, and PPTX files
- 4 intelligent agent tools (see below)
- Every answer cites the exact source file and page number
- Free chat mode when no documents are uploaded
- Smart router — agent decides which tool to use automatically
- 5 Groq API keys rotating with Mistral fallback — zero rate limit downtime

---

## The 4 Agent Tools

| Tool | Example Query | What it does |
|------|--------------|--------------|
| Topic Explainer | "Explain Database Normalization" | Theory + concepts + examples from your notes |
| Question Solver | "Solve Q3 from 2023 DBMS paper" | Step-by-step solution with source references |
| Learning Path Generator | "I have exams in 3 days, help me study OS" | Day-wise study plan from your uploaded syllabus |
| Content Synthesizer | "What do my notes and textbook say about SQL joins?" | Cross-references all uploaded documents |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI + Python 3.12 |
| AI Framework | LangChain + LangGraph |
| LLM Primary | Groq — llama-3.3-70b-versatile |
| LLM Fallback | Mistral — mistral-large-latest |
| Embeddings | Mistral Embed API |
| Vector Store | FAISS |
| Document Loaders | pypdf + python-docx + python-pptx |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

---

## Architecture

```
User Message
      ↓
React Frontend → POST /chat → FastAPI Backend
                                    ↓
                            LangGraph Agent
                                    ↓
                         ┌─── Router Node ───┐
                         ↓                   ↓
                    RAG Pipeline         Free LLM Chat
                         ↓
                  Retriever Node
                  (FAISS search)
                         ↓
                  Generator Node
                  (LLM answers)
                         ↓
              Answer + Source Citations
                         ↓
              React UI — source pills shown
```

---

## Project Structure

```
NexusLearn-Ai/
├── backend/
│   ├── agent/
│   │   ├── llm.py          # Groq key rotation + Mistral fallback
│   │   ├── state.py        # LangGraph state definition
│   │   ├── tools.py        # 4 agent tools
│   │   ├── nodes.py        # Router, Retriever, Generator nodes
│   │   └── graph.py        # LangGraph graph
│   ├── ingestion/
│   │   └── loaders.py      # PDF, DOCX, PPTX loaders
│   ├── vectorstore/
│   │   └── store.py        # FAISS vector store
│   └── main.py             # FastAPI endpoints
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── ChatWindow.jsx
    │   │   ├── Message.jsx
    │   │   └── InputBar.jsx
    │   └── App.jsx
    └── package.json
```

---

## Local Setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- Groq API key — free at groq.com
- Mistral API key — free at mistral.ai

### Backend

```bash
git clone https://github.com/MS-CONQUEROR/NexusLearn-Ai.git
cd NexusLearn-Ai/backend
pip install -r requirements.txt
```

Create `.env` file inside `backend/`:

```env
GROQ_API_KEY_1=your_key
GROQ_API_KEY_2=your_key
GROQ_API_KEY_3=your_key
GROQ_API_KEY_4=your_key
GROQ_API_KEY_5=your_key
MISTRAL_API_KEY=your_key
```

```bash
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | / | Health check |
| POST | /upload | Upload PDF, DOCX, or PPTX |
| POST | /chat | Send message to agent |
| GET | /sources | List uploaded documents |
| DELETE | /clear | Clear vector store |
| GET | /health | Detailed health check |

---

## How RAG Works in This Project

1. User uploads a PDF/DOCX/PPTX
2. File is parsed by format-specific loader
3. Text is split into 1000-character chunks with 200 overlap
4. Chunks are embedded using Mistral Embed API
5. Embeddings stored in FAISS vector store with metadata
6. User asks a question
7. Router node classifies the query
8. Retriever fetches top-5 most relevant chunks
9. Generator produces answer using retrieved context
10. Response sent back with source file + page number

---

## Team Nexus

Built as part of the Subject Guide & Question Bank Assistant AI Agent Development Project.

Track B — Advanced Implementation

SNIST — Sreenidhi Institute of Science and Technology
B.Tech Information Technology, 2028 Batch
