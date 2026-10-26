"""PaperMind AI — Papers API endpoints."""

from __future__ import annotations

import uuid
import shutil
from pathlib import Path
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.logging import get_logger
from app.rag.ingest import ingest_paper
from app.rag.pipeline import generate_summary
from app.db.vector_store import delete_paper_vectors

logger = get_logger(__name__)
router = APIRouter()

# In-memory paper store (will move to PostgreSQL with proper DB session in Phase 6)
_papers: dict[str, dict] = {}


class PaperResponse(BaseModel):
    id: str
    filename: str
    title: str
    status: str
    pages: int
    size_mb: float
    uploaded_at: str


class SummaryRequest(BaseModel):
    provider: str = "groq"
    model: str | None = None


async def _process_paper(paper_id: str, file_path: str) -> None:
    """Background task to process and index a paper."""
    try:
        _papers[paper_id]["status"] = "processing"
        result = await ingest_paper(file_path, paper_id)

        _papers[paper_id].update({
            "status": "indexed",
            "title": result["title"] or _papers[paper_id]["filename"],
            "pages": result["total_pages"],
        })
        logger.info(f"Paper {paper_id} indexed successfully: {result['chunks']} chunks")
    except Exception as e:
        _papers[paper_id]["status"] = "failed"
        _papers[paper_id]["error"] = str(e)
        logger.error(f"Paper {paper_id} processing failed: {e}")


@router.post("/papers", response_model=PaperResponse)
async def upload_paper(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
):
    """Upload a PDF research paper for processing."""
    settings = get_settings()

    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    if not file.content_type or "pdf" not in file.content_type.lower():
        raise HTTPException(status_code=400, detail="Invalid content type. Expected application/pdf")

    # Read file to check size
    content = await file.read()
    size_bytes = len(content)
    max_bytes = settings.upload_max_size_mb * 1024 * 1024

    if size_bytes > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.upload_max_size_mb}MB"
        )

    if size_bytes == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    # Save file
    paper_id = str(uuid.uuid4())
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    safe_filename = f"{paper_id}.pdf"
    file_path = upload_dir / safe_filename

    with open(file_path, "wb") as f:
        f.write(content)

    # Create paper record
    paper = {
        "id": paper_id,
        "filename": file.filename,
        "title": file.filename.replace(".pdf", ""),
        "status": "uploaded",
        "pages": 0,
        "size_mb": round(size_bytes / (1024 * 1024), 2),
        "uploaded_at": datetime.utcnow().isoformat(),
        "file_path": str(file_path),
    }
    _papers[paper_id] = paper

    # Process in background
    background_tasks.add_task(_process_paper, paper_id, str(file_path))

    logger.info(f"Paper uploaded: {file.filename} ({paper['size_mb']} MB) -> {paper_id}")
    return PaperResponse(**{k: v for k, v in paper.items() if k != "file_path" and k != "error"})


@router.get("/papers")
async def list_papers():
    """List all uploaded papers."""
    return [
        {k: v for k, v in p.items() if k not in ("file_path", "error")}
        for p in _papers.values()
    ]


@router.get("/papers/{paper_id}")
async def get_paper(paper_id: str):
    """Get paper details and indexing status."""
    paper = _papers.get(paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return {k: v for k, v in paper.items() if k != "file_path"}


@router.delete("/papers/{paper_id}")
async def delete_paper(paper_id: str):
    """Delete a paper and its associated vectors."""
    paper = _papers.get(paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    # Delete vectors
    try:
        delete_paper_vectors(paper_id)
    except Exception as e:
        logger.warning(f"Could not delete vectors for {paper_id}: {e}")

    # Delete file
    try:
        file_path = Path(paper.get("file_path", ""))
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        logger.warning(f"Could not delete file for {paper_id}: {e}")

    del _papers[paper_id]
    logger.info(f"Paper {paper_id} deleted")
    return {"detail": "Paper deleted"}


@router.post("/papers/{paper_id}/summary")
async def paper_summary(paper_id: str, request: SummaryRequest | None = None):
    """Generate a summary of the paper."""
    paper = _papers.get(paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    if paper["status"] != "indexed":
        raise HTTPException(status_code=400, detail=f"Paper is not indexed yet. Status: {paper['status']}")

    provider = request.provider if request else "groq"
    model = request.model if request else None

    try:
        result = await generate_summary(paper_id, provider_name=provider, model=model)
        return {
            "summary": result.content,
            "citations": result.citations,
            "model": result.model,
            "provider": result.provider,
        }
    except Exception as e:
        logger.error(f"Summary generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
