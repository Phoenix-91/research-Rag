"""PaperMind AI — Database models."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Column, String, Integer, Float, DateTime, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase
import enum


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


class PaperStatus(str, enum.Enum):
    """Paper processing status."""
    uploaded = "uploaded"
    processing = "processing"
    indexed = "indexed"
    failed = "failed"


class Paper(Base):
    """Research paper metadata."""

    __tablename__ = "papers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = Column(String(512), nullable=False)
    title = Column(String(1024), nullable=True)
    status = Column(
        Enum(PaperStatus),
        nullable=False,
        default=PaperStatus.uploaded,
    )
    pages = Column(Integer, nullable=True)
    size_bytes = Column(Integer, nullable=True)
    file_path = Column(String(1024), nullable=False)
    error_message = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    indexed_at = Column(DateTime, nullable=True)

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "filename": self.filename,
            "title": self.title or self.filename,
            "status": self.status.value if self.status else "uploaded",
            "pages": self.pages or 0,
            "size_mb": round((self.size_bytes or 0) / (1024 * 1024), 2),
            "uploaded_at": self.uploaded_at.isoformat() if self.uploaded_at else None,
            "file_path": self.file_path,
        }


class Conversation(Base):
    """Chat conversation."""

    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    paper_id = Column(UUID(as_uuid=True), nullable=True)
    title = Column(String(512), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Message(Base):
    """Chat message within a conversation."""

    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), nullable=False)
    role = Column(String(20), nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    citations_json = Column(Text, nullable=True)
    model_name = Column(String(128), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Note(Base):
    """Research note."""

    __tablename__ = "notes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    paper_id = Column(UUID(as_uuid=True), nullable=True)
    title = Column(String(512), nullable=False)
    content = Column(Text, nullable=False, default="")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)
