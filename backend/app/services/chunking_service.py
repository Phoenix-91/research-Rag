"""PaperMind AI — Text chunking service."""

from __future__ import annotations

from dataclasses import dataclass

from app.services.pdf_service import PageContent
from app.core.logging import get_logger

logger = get_logger(__name__)


@dataclass
class Chunk:
    """A text chunk with metadata."""
    chunk_id: str
    paper_id: str
    page: int
    chunk_index: int
    text: str
    section: str
    char_count: int


def chunk_pages(
    pages: list[PageContent],
    paper_id: str,
    chunk_size: int = 800,
    chunk_overlap: int = 200,
) -> list[Chunk]:
    """
    Split extracted pages into overlapping chunks.

    Preserves page number and generates sequential chunk IDs.
    Uses a sliding window approach with configurable size and overlap.
    """
    chunks: list[Chunk] = []
    global_index = 0

    for page in pages:
        text = page.text
        if not text.strip():
            continue

        # Try to detect section headers (simple heuristic)
        current_section = _detect_section(text)

        # Split into chunks
        start = 0
        while start < len(text):
            end = start + chunk_size

            # Try to break at sentence boundary
            if end < len(text):
                # Look for sentence endings near the chunk boundary
                for boundary in [". ", ".\n", "? ", "!\n", "\n\n"]:
                    pos = text.rfind(boundary, start + chunk_size // 2, end + 100)
                    if pos > 0:
                        end = pos + len(boundary)
                        break

            chunk_text = text[start:end].strip()

            if chunk_text and len(chunk_text) > 50:  # Skip tiny fragments
                chunk = Chunk(
                    chunk_id=f"{paper_id}_p{page.page_number}_c{global_index}",
                    paper_id=paper_id,
                    page=page.page_number,
                    chunk_index=global_index,
                    text=chunk_text,
                    section=current_section,
                    char_count=len(chunk_text),
                )
                chunks.append(chunk)
                global_index += 1

            # Move forward with overlap
            start = end - chunk_overlap if end < len(text) else len(text)

    logger.info(f"Created {len(chunks)} chunks from {len(pages)} pages for paper {paper_id}")
    return chunks


def _detect_section(text: str) -> str:
    """Simple heuristic to detect section headers from text."""
    section_keywords = [
        "Abstract", "Introduction", "Background", "Related Work",
        "Methodology", "Methods", "Experiments", "Results",
        "Discussion", "Conclusion", "References", "Appendix",
    ]

    first_lines = text.split("\n")[:5]
    for line in first_lines:
        line_clean = line.strip().rstrip(".")
        for keyword in section_keywords:
            if keyword.lower() in line_clean.lower() and len(line_clean) < 80:
                return keyword
    return "Body"
