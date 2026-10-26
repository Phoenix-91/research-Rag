"""PaperMind AI — PDF text extraction service."""

from __future__ import annotations

from pathlib import Path
from dataclasses import dataclass

import fitz  # PyMuPDF

from app.core.logging import get_logger

logger = get_logger(__name__)


@dataclass
class PageContent:
    """Extracted content from a single PDF page."""
    page_number: int
    text: str
    char_count: int


@dataclass
class ExtractionResult:
    """Result of PDF text extraction."""
    title: str | None
    pages: list[PageContent]
    total_pages: int
    failed_pages: list[int]


def extract_pdf(file_path: str | Path) -> ExtractionResult:
    """
    Extract text from a PDF file page by page.

    Uses PyMuPDF for extraction. Detects empty pages and
    extraction failures.
    """
    file_path = Path(file_path)
    if not file_path.exists():
        raise FileNotFoundError(f"PDF not found: {file_path}")

    doc = fitz.open(str(file_path))
    pages: list[PageContent] = []
    failed_pages: list[int] = []
    title: str | None = None

    # Try to get title from metadata
    metadata = doc.metadata
    if metadata and metadata.get("title"):
        title = metadata["title"].strip()

    for page_num in range(len(doc)):
        try:
            page = doc[page_num]
            text = page.get_text("text").strip()

            if not text:
                failed_pages.append(page_num + 1)
                logger.warning(f"Empty page {page_num + 1} in {file_path.name}")
                continue

            pages.append(
                PageContent(
                    page_number=page_num + 1,
                    text=text,
                    char_count=len(text),
                )
            )
        except Exception as e:
            failed_pages.append(page_num + 1)
            logger.error(f"Failed to extract page {page_num + 1}: {e}")

    doc.close()

    # Fallback title from first page content
    if not title and pages:
        first_lines = pages[0].text.split("\n")
        if first_lines:
            candidate = first_lines[0].strip()
            if 10 < len(candidate) < 200:
                title = candidate

    logger.info(
        f"Extracted {len(pages)}/{len(doc)} pages from {file_path.name}, "
        f"{len(failed_pages)} failed"
    )

    return ExtractionResult(
        title=title,
        pages=pages,
        total_pages=len(doc),
        failed_pages=failed_pages,
    )
