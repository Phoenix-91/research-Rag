"""PaperMind AI — Health check endpoint."""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    """Health check response schema."""
    status: str
    service: str
    version: str


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Return application health status."""
    return HealthResponse(
        status="healthy",
        service="PaperMind AI",
        version="0.1.0",
    )
