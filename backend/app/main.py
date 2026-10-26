"""PaperMind AI — FastAPI application entry point."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.logging import setup_logging, get_logger
from app.api.v1 import health as health_router
from app.api.v1 import papers as papers_router
from app.api.v1 import chat as chat_router
from app.api.v1 import models as models_router
from app.db.postgres import init_db, close_db

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Manage application startup and shutdown."""
    settings = get_settings()
    setup_logging("DEBUG" if settings.debug else "INFO")
    logger.info("PaperMind AI backend starting up")

    # Initialize database tables
    try:
        await init_db()
        logger.info("Database initialized")
    except Exception as e:
        logger.warning(f"Database init skipped (may not be available yet): {e}")

    yield

    # Cleanup
    await close_db()
    logger.info("PaperMind AI backend shutting down")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        description="Research Intelligence Platform — RAG-powered paper analysis",
        version="0.1.0",
        lifespan=lifespan,
    )

    # ── CORS ────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # ── Routes ──────────────────────────────────────────────
    app.include_router(health_router.router, prefix="/api/v1", tags=["health"])
    app.include_router(papers_router.router, prefix="/api/v1", tags=["papers"])
    app.include_router(chat_router.router, prefix="/api/v1", tags=["chat"])
    app.include_router(models_router.router, prefix="/api/v1", tags=["models"])

    return app


app = create_app()
