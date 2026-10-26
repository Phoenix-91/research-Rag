"""PaperMind AI — Embedding service using Sentence Transformers."""

from __future__ import annotations

from typing import Optional

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_model = None


def _get_model():
    """Lazy-load the sentence transformer model."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        settings = get_settings()
        logger.info(f"Loading embedding model: {settings.embedding_model}")
        _model = SentenceTransformer(settings.embedding_model)
        logger.info(f"Embedding model loaded, dimension: {_model.get_sentence_embedding_dimension()}")
    return _model


def get_embedding_dimension() -> int:
    """Return the embedding vector dimension."""
    model = _get_model()
    return model.get_sentence_embedding_dimension()


def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Generate embeddings for a list of texts.

    Returns a list of float vectors.
    """
    if not texts:
        return []

    model = _get_model()
    embeddings = model.encode(
        texts,
        batch_size=32,
        show_progress_bar=False,
        normalize_embeddings=True,
    )
    return embeddings.tolist()


def embed_query(query: str) -> list[float]:
    """Generate embedding for a single query string."""
    result = embed_texts([query])
    return result[0] if result else []
