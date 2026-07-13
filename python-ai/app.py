from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from pathlib import Path
import shutil

from rag.ingest import ingest
from rag.chain import ask

app = FastAPI()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "Company Knowledge Base AI Service Running"
    }


# -----------------------------
# Upload & Index Document
# -----------------------------
@app.post("/ingest")
async def ingest_document(chatId: str, file: UploadFile = File(...)):

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pages, chunks = ingest(file.filename, chatId)

    return {
        "filename": file.filename,
        "pages": pages,
        "chunks": chunks,
        "message": "Document Indexed Successfully"
    }


# -----------------------------
# Ask Question
# -----------------------------
class QuestionRequest(BaseModel):
    question: str
    chatId: str


@app.post("/ask")
def ask_question(request: QuestionRequest):

    answer, sources = ask(request.question, request.chatId)

    return {
        "question": request.question,
        "answer": answer,
        "sources": sources
    }