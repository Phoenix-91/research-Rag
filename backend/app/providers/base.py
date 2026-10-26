"""PaperMind AI — Base LLM provider interface."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import AsyncIterator, Optional


@dataclass
class ModelInfo:
    """Information about an available model."""
    id: str
    name: str
    provider: str
    context_window: int | None = None


@dataclass
class GenerationResult:
    """Result from a generation call."""
    content: str
    model: str
    provider: str
    usage: dict | None = None


class BaseLLMProvider(ABC):
    """
    Abstract base for LLM providers.

    Implement this interface for each provider (Groq, Ollama, etc.)
    so the RAG pipeline calls a uniform API regardless of backend.
    """

    provider_name: str = "base"

    @abstractmethod
    async def generate(
        self,
        messages: list[dict],
        model: str | None = None,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> GenerationResult:
        """Generate a complete response."""
        ...

    @abstractmethod
    async def stream(
        self,
        messages: list[dict],
        model: str | None = None,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> AsyncIterator[str]:
        """Stream response tokens."""
        ...

    @abstractmethod
    async def list_models(self) -> list[ModelInfo]:
        """List available models for this provider."""
        ...

    @abstractmethod
    async def health_check(self) -> dict:
        """Check if the provider is available and return status info."""
        ...
