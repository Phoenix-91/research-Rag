"""PaperMind AI — RAG pipeline orchestrator."""

from __future__ import annotations

from typing import AsyncIterator, Optional
from dataclasses import dataclass

from app.rag.retriever import retrieve_context, RetrievedChunk
from app.rag.prompt_builder import build_rag_prompt, build_summary_prompt
from app.providers import get_provider
from app.providers.base import GenerationResult
from app.core.logging import get_logger

logger = get_logger(__name__)


@dataclass
class RAGResponse:
    """Complete RAG response with citations."""
    content: str
    citations: list[dict]
    model: str
    provider: str


async def ask_question(
    query: str,
    paper_id: Optional[str] = None,
    provider_name: str = "groq",
    model: Optional[str] = None,
    top_k: int = 5,
) -> RAGResponse:
    """
    Full RAG pipeline: retrieve → build prompt → generate answer.

    Returns the answer with source citations.
    """
    # 1. Retrieve relevant chunks
    chunks = retrieve_context(query, paper_id=paper_id, top_k=top_k)

    if not chunks:
        return RAGResponse(
            content="No relevant passages were found in the uploaded papers. Please ensure a paper has been uploaded and indexed.",
            citations=[],
            model=model or "unknown",
            provider=provider_name,
        )

    # 2. Build prompt
    messages = build_rag_prompt(query, chunks)

    # 3. Generate answer
    provider = get_provider(provider_name)
    result = await provider.generate(messages, model=model)

    # 4. Build citations from retrieved chunks
    citations = [
        {
            "page": c.page,
            "text": c.text[:300] + ("..." if len(c.text) > 300 else ""),
            "section": c.section,
            "score": round(c.score, 3),
            "chunk_id": c.chunk_id,
        }
        for c in chunks
    ]

    return RAGResponse(
        content=result.content,
        citations=citations,
        model=result.model,
        provider=result.provider,
    )


async def stream_question(
    query: str,
    paper_id: Optional[str] = None,
    provider_name: str = "groq",
    model: Optional[str] = None,
    top_k: int = 5,
) -> tuple[AsyncIterator[str], list[dict]]:
    """
    Streaming RAG pipeline.

    Returns an async iterator of content tokens and the citations list.
    """
    # 1. Retrieve
    chunks = retrieve_context(query, paper_id=paper_id, top_k=top_k)

    if not chunks:
        async def empty_stream():
            yield "No relevant passages were found. Please upload and index a paper first."
        return empty_stream(), []

    # 2. Build prompt
    messages = build_rag_prompt(query, chunks)

    # 3. Stream answer
    provider = get_provider(provider_name)
    token_stream = provider.stream(messages, model=model)

    # 4. Build citations
    citations = [
        {
            "page": c.page,
            "text": c.text[:300] + ("..." if len(c.text) > 300 else ""),
            "section": c.section,
            "score": round(c.score, 3),
            "chunk_id": c.chunk_id,
        }
        for c in chunks
    ]

    return token_stream, citations


async def generate_summary(
    paper_id: str,
    provider_name: str = "groq",
    model: Optional[str] = None,
) -> RAGResponse:
    """Generate a paper summary using top chunks from each section."""
    # Retrieve broadly from the paper
    chunks = retrieve_context(
        "summarize the main contributions methodology findings and limitations",
        paper_id=paper_id,
        top_k=15,
    )

    if not chunks:
        return RAGResponse(
            content="No indexed content found for this paper.",
            citations=[],
            model=model or "unknown",
            provider=provider_name,
        )

    messages = build_summary_prompt(chunks)
    provider = get_provider(provider_name)
    result = await provider.generate(messages, model=model, max_tokens=3000)

    citations = [
        {"page": c.page, "section": c.section, "score": round(c.score, 3)}
        for c in chunks
    ]

    return RAGResponse(
        content=result.content,
        citations=citations,
        model=result.model,
        provider=result.provider,
    )
