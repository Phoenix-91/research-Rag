"""PaperMind AI — Groq LLM provider."""

from __future__ import annotations

from typing import AsyncIterator

from groq import AsyncGroq

from app.providers.base import BaseLLMProvider, GenerationResult, ModelInfo
from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# Default models available on Groq
GROQ_MODELS = [
    ModelInfo(id="llama-3.3-70b-versatile", name="Llama 3.3 70B", provider="groq", context_window=128000),
    ModelInfo(id="llama-3.1-8b-instant", name="Llama 3.1 8B", provider="groq", context_window=128000),
    ModelInfo(id="mixtral-8x7b-32768", name="Mixtral 8x7B", provider="groq", context_window=32768),
    ModelInfo(id="gemma2-9b-it", name="Gemma 2 9B", provider="groq", context_window=8192),
]


class GroqProvider(BaseLLMProvider):
    """Groq cloud inference provider."""

    provider_name = "groq"

    def __init__(self):
        settings = get_settings()
        self.api_key = settings.groq_api_key
        self.default_model = "llama-3.3-70b-versatile"
        self._client: AsyncGroq | None = None

    def _get_client(self) -> AsyncGroq:
        if not self.api_key:
            raise ValueError("Groq API key is not configured. Set GROQ_API_KEY in .env")
        if self._client is None:
            self._client = AsyncGroq(api_key=self.api_key)
        return self._client

    async def generate(
        self,
        messages: list[dict],
        model: str | None = None,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> GenerationResult:
        """Generate a complete response via Groq."""
        client = self._get_client()
        model = model or self.default_model

        try:
            response = await client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )

            content = response.choices[0].message.content or ""
            usage = None
            if response.usage:
                usage = {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens,
                }

            return GenerationResult(
                content=content,
                model=model,
                provider="groq",
                usage=usage,
            )
        except Exception as e:
            logger.error(f"Groq generation failed: {e}")
            raise

    async def stream(
        self,
        messages: list[dict],
        model: str | None = None,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> AsyncIterator[str]:
        """Stream response tokens from Groq."""
        client = self._get_client()
        model = model or self.default_model

        try:
            stream = await client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True,
            )

            async for chunk in stream:
                delta = chunk.choices[0].delta
                if delta and delta.content:
                    yield delta.content
        except Exception as e:
            logger.error(f"Groq streaming failed: {e}")
            raise

    async def list_models(self) -> list[ModelInfo]:
        """Return known Groq models."""
        return GROQ_MODELS

    async def health_check(self) -> dict:
        """Check Groq API connectivity."""
        if not self.api_key:
            return {"status": "unconfigured", "provider": "groq", "error": "No API key set"}
        try:
            client = self._get_client()
            models = await client.models.list()
            return {"status": "healthy", "provider": "groq", "models_count": len(models.data)}
        except Exception as e:
            return {"status": "error", "provider": "groq", "error": str(e)}
