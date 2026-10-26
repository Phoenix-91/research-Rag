"""PaperMind AI — Core configuration."""

from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ── Application ─────────────────────────────────────────
    app_name: str = "PaperMind AI"
    debug: bool = False
    secret_key: str = "changeme_secret_key_at_least_32_chars_long"

    # ── Server ──────────────────────────────────────────────
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    frontend_url: str = "http://localhost:3000"

    # ── CORS ────────────────────────────────────────────────
    cors_origins: str = "http://localhost:3000"

    # ── Database ────────────────────────────────────────────
    postgres_user: str = "papermind"
    postgres_password: str = "changeme_postgres_password"
    postgres_db: str = "papermind"
    postgres_host: str = "localhost"
    postgres_port: int = 5432

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    # ── Qdrant ──────────────────────────────────────────────
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    qdrant_collection: str = "papermind_papers"

    # ── LLM Providers ───────────────────────────────────────
    groq_api_key: str = ""
    ollama_base_url: str = "http://localhost:11434"

    # ── Embedding ───────────────────────────────────────────
    embedding_model: str = "all-MiniLM-L6-v2"

    # ── Uploads ─────────────────────────────────────────────
    upload_max_size_mb: int = 50
    upload_dir: Path = Path("data/uploads")
    processed_dir: Path = Path("data/processed")

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
