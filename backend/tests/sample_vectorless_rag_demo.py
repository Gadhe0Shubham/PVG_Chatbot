import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.rag_knowledge_base import RAGKnowledgeBase
from app.vector_store import get_vector_store
from app.spelling_fix import correct_spelling
from llm_fallback import get_llm_response


SAMPLE_QUERIES = [
    "what is computer engineering fee",
    "it department intake",
    "who is Prof. Prasad A. Lahare",
    "mba duration",
    "where is college located",
]


async def run_demo():
    kb = RAGKnowledgeBase(data_dir="data")
    chunks = kb.load_all_data()

    store = get_vector_store()
    store.add_chunks(chunks)

    print("\n=== Vectorless RAG Demo ===")
    print(f"Indexed chunks: {len(chunks)}")

    for query in SAMPLE_QUERIES:
        corrected_query = correct_spelling(query.strip())
        detected_intent = store.detect_intent(corrected_query) or "about_college"

        results = store.search(corrected_query, top_k=3, intent_hint=detected_intent)
        if results:
            top_type = results[0]["chunk"].get("metadata", {}).get("type")
            if top_type in {"faculty", "staff"}:
                detected_intent = "faculty_info"

        context_chunks = [res["chunk"]["text"] for res in results]
        answer = await get_llm_response(corrected_query, context_chunks)

        print("\n----------------------------------------")
        print(f"Query          : {query}")
        print(f"Corrected      : {corrected_query}")
        print(f"Detected intent: {detected_intent}")
        print("Top retrievals :")
        for i, res in enumerate(results, start=1):
            meta = res["chunk"].get("metadata", {})
            first_line = res["chunk"]["text"].split("\n")[0]
            print(
                f"  {i}. score={res['score']:.3f} "
                f"tag={meta.get('tag')} type={meta.get('type')} -> {first_line[:100]}"
            )
        print(f"Answer         : {answer[:300]}")


if __name__ == "__main__":
    asyncio.run(run_demo())
