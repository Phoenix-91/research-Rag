"""PaperMind AI — Qdrant vector store client."""

from __future__ import annotations

from typing import Optional
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_client: Optional[QdrantClient] = None


def get_qdrant() -> QdrantClient:
    """Get or create the Qdrant client singleton."""
    global _client
    if _client is None:
        settings = get_settings()
        _client = QdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port,
        )
        logger.info(f"Qdrant client connected to {settings.qdrant_host}:{settings.qdrant_port}")
    return _client


async def ensure_collection(dimension: int = 384) -> None:
    """Create the collection if it does not exist."""
    settings = get_settings()
    client = get_qdrant()
    collections = client.get_collections().collections
    exists = any(c.name == settings.qdrant_collection for c in collections)

    if not exists:
        client.create_collection(
            collection_name=settings.qdrant_collection,
            vectors_config=VectorParams(
                size=dimension,
                distance=Distance.COSINE,
            ),
        )
        logger.info(f"Created Qdrant collection: {settings.qdrant_collection} (dim={dimension})")
    else:
        logger.info(f"Qdrant collection already exists: {settings.qdrant_collection}")


def upsert_vectors(
    points: list[PointStruct],
) -> None:
    """Insert or update vectors in the collection."""
    settings = get_settings()
    client = get_qdrant()
    client.upsert(
        collection_name=settings.qdrant_collection,
        points=points,
    )


def search_vectors(
    query_vector: list[float],
    paper_id: Optional[str] = None,
    top_k: int = 5,
) -> list[dict]:
    """Search for similar vectors, optionally filtered by paper_id."""
    settings = get_settings()
    client = get_qdrant()

    search_filter = None
    if paper_id:
        search_filter = Filter(
            must=[
                FieldCondition(
                    key="paper_id",
                    match=MatchValue(value=paper_id),
                )
            ]
        )

    results = client.search(
        collection_name=settings.qdrant_collection,
        query_vector=query_vector,
        query_filter=search_filter,
        limit=top_k,
        with_payload=True,
    )

    return [
        {
            "id": str(hit.id),
            "score": hit.score,
            "paper_id": hit.payload.get("paper_id", ""),
            "page": hit.payload.get("page", 0),
            "chunk_index": hit.payload.get("chunk_index", 0),
            "text": hit.payload.get("text", ""),
            "section": hit.payload.get("section", ""),
        }
        for hit in results
    ]


def delete_paper_vectors(paper_id: str) -> None:
    """Delete all vectors associated with a paper."""
    settings = get_settings()
    client = get_qdrant()
    client.delete(
        collection_name=settings.qdrant_collection,
        points_selector=Filter(
            must=[
                FieldCondition(
                    key="paper_id",
                    match=MatchValue(value=paper_id),
                )
            ]
        ),
    )
    logger.info(f"Deleted vectors for paper {paper_id}")
