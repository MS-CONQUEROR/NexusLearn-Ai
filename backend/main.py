import os
import shutil
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage

load_dotenv()

from agent.graph import agent
from ingestion.loaders import load_document
from vectorstore.store import add_documents, get_all_sources, clear_store

app = FastAPI(title="QBank Agent API")

# allow React frontend to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── request/response models ───────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []  # [{role: "user/assistant", content: "..."}]


class ChatResponse(BaseModel):
    answer: str
    sources: List[dict] = []
    route: str = "chat"


# ─── endpoints ─────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    return {"status": "QBank Agent is running"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Accepts PDF, DOCX, or PPTX.
    Loads, chunks, embeds, and stores in FAISS.
    """
    allowed = [".pdf", ".docx", ".pptx"]
    ext = os.path.splitext(file.filename)[1].lower()

    if ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {ext}. Allowed: pdf, docx, pptx"
        )

    # save uploaded file to a temp location
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        docs = load_document(tmp_path)

        # fix the source name to show original filename not temp path
        for doc in docs:
            doc.metadata["source"] = file.filename

        chunks_added = add_documents(docs)

        return {
            "message": f"Successfully processed {file.filename}",
            "pages": len(docs),
            "chunks": chunks_added,
            "filename": file.filename,
            "source_type": ext.replace(".", "")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # always clean up temp file
        os.unlink(tmp_path)


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint.
    Runs the LangGraph agent and returns answer + sources.
    """
    # build message history for the agent
    messages = []
    for msg in request.history:
        if msg["role"] == "user":
            messages.append(HumanMessage(content=msg["content"]))

    # add current message
    messages.append(HumanMessage(content=request.message))

    # run the agent
    result = agent.invoke({
        "messages": messages,
        "query": request.message,
        "context": [],
        "route": "",
        "sources": []
    })

    # extract the last AI message
    last_message = result["messages"][-1]
    answer = last_message.content

    return ChatResponse(
        answer=answer,
        sources=result.get("sources", []),
        route=result.get("route", "chat")
    )


@app.get("/sources")
def get_sources():
    """
    Returns all uploaded documents.
    Used by React sidebar.
    """
    return {"sources": get_all_sources()}


@app.delete("/clear")
def clear_all():
    """Clears the entire vector store."""
    clear_store()
    return {"message": "Vector store cleared"}


@app.get("/health")
def detailed_health():
    sources = get_all_sources()
    return {
        "status": "ok",
        "documents_uploaded": len(sources),
        "sources": sources
    }