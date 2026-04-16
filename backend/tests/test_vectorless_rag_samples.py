import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.rag_knowledge_base import RAGKnowledgeBase
from app.vector_store import get_vector_store


def _setup_store():
    kb = RAGKnowledgeBase(data_dir="data")
    chunks = kb.load_all_data()
    store = get_vector_store()
    store.add_chunks(chunks)
    return store


def test_detect_intent_samples():
    store = _setup_store()

    samples = [
        ("what is computer engineering fee", "computer_fee"),
        ("it department intake", "it_intake"),
        ("mba duration", "mba_duration"),
        ("where is college located", "address"),
    ]

    for query, expected_intent in samples:
        detected = store.detect_intent(query)
        assert detected == expected_intent, f"Expected {expected_intent}, got {detected} for query: {query}"


def test_search_returns_relevant_results():
    store = _setup_store()
    results = store.search("who is Prof. Prasad A. Lahare", top_k=3, intent_hint="about_college")
    assert len(results) > 0
    top_type = results[0]["chunk"].get("metadata", {}).get("type")
    assert top_type in {"faculty", "staff", "raw_data", "raw_data_question", "department_info"}
