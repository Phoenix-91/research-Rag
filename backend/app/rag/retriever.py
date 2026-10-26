"""PaperMind AI — Vector retriever."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from app.services.embedding_service import embed_query
from app.db.vector_store import search_vectors
from app.core.logging import get_logger

logger = get_logger(__name__)


@dataclass
class RetrievedChunk:
    """A chunk retrieved from vector search."""
    text: str
    page: int
    section: str
    score: float
    chunk_id: str
    paper_id: str


def retrieve_context(
    query: str,
    paper_id: Optional[str] = None,
    top_k: int = 5,
) -> list[RetrievedChunk]:
    """
    Retrieve relevant chunks for a query.

    1. Embed the query
    2. Search Qdrant with optional paper filter
    3. Return ranked chunks with metadata
    """
    # Embed query
    query_vector = embed_query(query)
    if not query_vector:
        logger.warning("Empty query embedding")
        return []

    # Search
    results = search_vectors(
        query_vector=query_vector,
        paper_id=paper_id,
        top_k=top_k,
    )

    chunks = [
        RetrievedChunk(
            text=r["text"],
            page=r["page"],
            section=r["section"],
            score=r["score"],
            chunk_id=r.get("id", ""),
            paper_id=r.get("paper_id", ""),
        )
        for r in results
    ]

    logger.info(
        f"Retrieved {len(chunks)} chunks for query (paper={paper_id}, "
        f"top score={chunks[0].score:.3f})" if chunks else
        f"Retrieved 0 chunks for query (paper={paper_id})"
    )

    return chunks
