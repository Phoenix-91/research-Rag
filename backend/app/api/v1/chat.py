"""PaperMind AI — Chat API endpoints."""

from __future__ import annotations

import json
from typing import Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.rag.pipeline import ask_question, stream_question
from app.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter()


class ChatRequest(BaseModel):
    """Chat request schema."""
    message: str
    paper_id: Optional[str] = None
    provider: str = "groq"
    model: Optional[str] = None
    stream: bool = True


@router.post("/papers/chat")
async def chat(request: ChatRequest):
    """
    Ask a question about uploaded papers.

    Supports both streaming (SSE) and non-streaming responses.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    if request.stream:
        return await _stream_response(request)
    else:
        return await _full_response(request)


@router.post("/papers/{paper_id}/chat")
async def chat_with_paper(paper_id: str, request: ChatRequest):
    """Ask a question about a specific paper."""
    request.paper_id = paper_id
    return await chat(request)


async def _full_response(request: ChatRequest):
    """Generate a complete (non-streaming) response."""
    try:
        result = await ask_question(
            query=request.message,
            paper_id=request.paper_id,
            provider_name=request.provider,
            model=request.model,
        )
        return {
            "content": result.content,
            "citations": result.citations,
            "model": result.model,
            "provider": result.provider,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        raise HTTPException(status_code=500, detail=f"Chat generation failed: {str(e)}")


async def _stream_response(request: ChatRequest):
    """Generate a streaming SSE response."""
    try:
        token_stream, citations = await stream_question(
            query=request.message,
            paper_id=request.paper_id,
            provider_name=request.provider,
            model=request.model,
        )

        async def event_generator():
            try:
                async for token in token_stream:
                    yield f"data: {json.dumps({'content': token})}\n\n"

                # Send citations at the end
                yield f"data: {json.dumps({'citations': citations})}\n\n"
                yield "data: [DONE]\n\n"
            except Exception as e:
                logger.error(f"Streaming error: {e}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
                yield "data: [DONE]\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Chat streaming setup failed: {e}")
        raise HTTPException(status_code=500, detail=f"Chat setup failed: {str(e)}")
