"""PaperMind AI — Models API endpoints."""

from __future__ import annotations

from fastapi import APIRouter

from app.providers import get_provider, list_provider_names
from app.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter()


@router.get("/models")
async def list_models():
    """List all available models across all providers."""
    all_models = []
    for name in list_provider_names():
        try:
            provider = get_provider(name)
            models = await provider.list_models()
            for m in models:
                all_models.append({
                    "id": m.id,
                    "name": m.name,
                    "provider": m.provider,
                    "context_window": m.context_window,
                })
        except Exception as e:
            logger.warning(f"Could not list models for {name}: {e}")

    return {"models": all_models}


@router.get("/models/health")
async def models_health():
    """Check health status of all model providers."""
    statuses = []
    for name in list_provider_names():
        try:
            provider = get_provider(name)
            status = await provider.health_check()
            statuses.append(status)
        except Exception as e:
            statuses.append({
                "status": "error",
                "provider": name,
                "error": str(e),
            })

    return {"providers": statuses}
