"""PaperMind AI — Ollama local LLM provider."""

from __future__ import annotations

from typing import AsyncIterator

import httpx

from app.providers.base import BaseLLMProvider, GenerationResult, ModelInfo
from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class OllamaProvider(BaseLLMProvider):
    """Ollama local inference provider."""

    provider_name = "ollama"

    def __init__(self):
        settings = get_settings()
        self.base_url = settings.ollama_base_url.rstrip("/")
        self.default_model = "llama3.1"

    async def generate(
        self,
        messages: list[dict],
        model: str | None = None,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> GenerationResult:
        """Generate a complete response via Ollama."""
        model = model or self.default_model

        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/chat",
                    json={
                        "model": model,
                        "messages": messages,
                        "stream": False,
                        "options": {
                            "temperature": temperature,
                            "num_predict": max_tokens,
                        },
                    },
                )
                response.raise_for_status()
                data = response.json()

                return GenerationResult(
                    content=data.get("message", {}).get("content", ""),
                    model=model,
                    provider="ollama",
                    usage={
                        "prompt_tokens": data.get("prompt_eval_count", 0),
                        "completion_tokens": data.get("eval_count", 0),
                    },
                )
            except Exception as e:
                logger.error(f"Ollama generation failed: {e}")
                raise

    async def stream(
        self,
        messages: list[dict],
        model: str | None = None,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> AsyncIterator[str]:
        """Stream response tokens from Ollama."""
        model = model or self.default_model

        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/api/chat",
                    json={
                        "model": model,
                        "messages": messages,
                        "stream": True,
                        "options": {
                            "temperature": temperature,
                            "num_predict": max_tokens,
                        },
                    },
                ) as response:
                    response.raise_for_status()
                    import json
                    async for line in response.aiter_lines():
                        if line.strip():
                            try:
                                data = json.loads(line)
                                content = data.get("message", {}).get("content", "")
                                if content:
                                    yield content
                                if data.get("done", False):
                                    break
                            except json.JSONDecodeError:
                                continue
            except Exception as e:
                logger.error(f"Ollama streaming failed: {e}")
                raise

    async def list_models(self) -> list[ModelInfo]:
        """List models available on the Ollama server."""
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(f"{self.base_url}/api/tags")
                response.raise_for_status()
                data = response.json()

                return [
                    ModelInfo(
                        id=m["name"],
                        name=m["name"],
                        provider="ollama",
                    )
                    for m in data.get("models", [])
                ]
            except Exception as e:
                logger.warning(f"Could not list Ollama models: {e}")
                return []

    async def health_check(self) -> dict:
        """Check Ollama server connectivity."""
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                response = await client.get(f"{self.base_url}/api/tags")
                if response.status_code == 200:
                    data = response.json()
                    model_count = len(data.get("models", []))
                    return {
                        "status": "healthy",
                        "provider": "ollama",
                        "models_count": model_count,
                        "base_url": self.base_url,
                    }
                return {"status": "error", "provider": "ollama", "error": f"HTTP {response.status_code}"}
            except Exception as e:
                return {
                    "status": "unavailable",
                    "provider": "ollama",
                    "error": f"Cannot connect to Ollama at {self.base_url}. Is Ollama running?",
                }
