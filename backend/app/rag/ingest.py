"""PaperMind AI — RAG ingestion pipeline."""

from __future__ import annotations

import uuid
from datetime import datetime

from qdrant_client.models import PointStruct

from app.services.pdf_service import extract_pdf
from app.services.chunking_service import chunk_pages
from app.services.embedding_service import embed_texts, get_embedding_dimension
from app.db.vector_store import upsert_vectors, ensure_collection
from app.core.logging import get_logger

logger = get_logger(__name__)


async def ingest_paper(
    file_path: str,
    paper_id: str,
) -> dict:
    """
    Full ingestion pipeline: extract → chunk → embed → index.

    Returns a summary of the ingestion result.
    """
    logger.info(f"Starting ingestion for paper {paper_id}: {file_path}")

    # 1. Extract text
    extraction = extract_pdf(file_path)
    if not extraction.pages:
        raise ValueError(f"No text could be extracted from the PDF: {file_path}")

    logger.info(f"Extracted {len(extraction.pages)} pages, title: {extraction.title}")

    # 2. Chunk
    chunks = chunk_pages(extraction.pages, paper_id)
    if not chunks:
        raise ValueError("No chunks produced from extracted text")

    logger.info(f"Created {len(chunks)} chunks")

    # 3. Embed
    texts = [c.text for c in chunks]
    embeddings = embed_texts(texts)

    if len(embeddings) != len(chunks):
        raise ValueError(f"Embedding count mismatch: {len(embeddings)} vs {len(chunks)}")

    logger.info(f"Generated {len(embeddings)} embeddings")

    # 4. Ensure collection exists
    dimension = get_embedding_dimension()
    await ensure_collection(dimension)

    # 5. Build Qdrant points
    points = []
    for chunk, embedding in zip(chunks, embeddings):
        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding,
            payload={
                "paper_id": paper_id,
                "chunk_id": chunk.chunk_id,
                "page": chunk.page,
                "chunk_index": chunk.chunk_index,
                "text": chunk.text,
                "section": chunk.section,
                "char_count": chunk.char_count,
            },
        )
        points.append(point)

    # 6. Upsert in batches
    batch_size = 100
    for i in range(0, len(points), batch_size):
        batch = points[i : i + batch_size]
        upsert_vectors(batch)

    logger.info(f"Indexed {len(points)} vectors for paper {paper_id}")

    return {
        "title": extraction.title,
        "total_pages": extraction.total_pages,
        "extracted_pages": len(extraction.pages),
        "failed_pages": extraction.failed_pages,
        "chunks": len(chunks),
        "vectors": len(points),
    }
