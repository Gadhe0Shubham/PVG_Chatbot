#!/usr/bin/env python3
"""
Fast vectorless RAG response generator.
Produces answers directly from retrieved context without heavy model inference.
"""

import logging
import re
from typing import List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+")
TOKEN_PATTERN = re.compile(r"[a-z0-9&]+")


def _tokens(text: str) -> set:
    return set(TOKEN_PATTERN.findall((text or "").lower()))


def _clean_text(text: str) -> str:
    return " ".join((text or "").replace("\n", " ").split()).strip()


def _extract_structured_answer(chunk: str) -> str:
    chunk = chunk or ""

    # Question-pattern chunks store explicit "Answer: ..."
    if "Answer:" in chunk:
        answer = chunk.split("Answer:", 1)[1]
        return _clean_text(answer)

    # Canonical raw data chunks use "Information: ..."
    if "Information:" in chunk:
        info = chunk.split("Information:", 1)[1]
        return _clean_text(info)

    return _clean_text(chunk)


def _extract_best_sentences(query: str, context_chunks: List[str], max_sentences: int = 3) -> List[str]:
    query_tokens = _tokens(query)
    candidates = []

    for chunk in context_chunks or []:
        for sentence in SENTENCE_SPLIT.split(chunk.replace("\n", " ").strip()):
            sentence = sentence.strip(" -")
            if len(sentence) < 25:
                continue
            low = sentence.lower()
            if low.startswith("user query pattern:") or low.startswith("intent:"):
                continue
            sentence_tokens = _tokens(sentence)
            overlap = len(query_tokens & sentence_tokens)
            if overlap == 0:
                continue
            # Prefer concise and relevant sentences
            brevity_bonus = 1.0 / (1.0 + max(len(sentence.split()) - 28, 0))
            score = overlap + brevity_bonus
            candidates.append((score, sentence))

    candidates.sort(key=lambda item: item[0], reverse=True)

    selected = []
    seen = set()
    for _, sentence in candidates:
        key = sentence.lower()
        if key in seen:
            continue
        seen.add(key)
        selected.append(sentence)
        if len(selected) >= max_sentences:
            break

    return selected


async def get_llm_response(query: str, context: List[str] = None) -> str:
    """
    Return a context-grounded answer quickly.
    """
    if not context:
        return "I could not find that in the college dataset. Please ask about courses, admissions, fees, faculty, contact, or departments."

    primary = _extract_structured_answer(context[0])
    if len(primary) >= 20:
        return primary[:700]

    best_sentences = _extract_best_sentences(query, context, max_sentences=3)
    if best_sentences:
        return " ".join(best_sentences)

    # Fallback: first informative context line
    first_chunk = context[0].replace("\n", " ").strip()
    if first_chunk:
        return first_chunk[:450]

    return "I could not find a reliable answer for that query in the current dataset."


def is_query_college_related(query: str) -> bool:
    return True
