"""PaperMind AI — Provider registry and factory."""

from __future__ import annotations

from app.providers.base import BaseLLMProvider
from app.providers.groq_provider import GroqProvider
from app.providers.ollama_provider import OllamaProvider

_providers: dict[str, BaseLLMProvider] = {}


def get_provider(name: str = "groq") -> BaseLLMProvider:
    """Get a provider instance by name (cached singletons)."""
    if name not in _providers:
        if name == "groq":
            _providers[name] = GroqProvider()
        elif name == "ollama":
            _providers[name] = OllamaProvider()
        else:
            raise ValueError(f"Unknown provider: {name}. Available: groq, ollama")
    return _providers[name]


def list_provider_names() -> list[str]:
    """Return all registered provider names."""
    return ["groq", "ollama"]
