import sys
import os

# Add the current directory to sys.path
sys.path.append(os.getcwd())

from backend.app.rag_knowledge_base import RAGKnowledgeBase
from backend.app.vector_store import get_vector_store
from backend.app.spelling_fix import correct_spelling

query = "Prof. Prasad A. Lahare"
corrected = correct_spelling(query)
print(f"Original: '{query}'")
print(f"Corrected: '{corrected}'")

kb = RAGKnowledgeBase(data_dir='backend/data')
chunks = kb.load_all_data()

vs = get_vector_store()
vs.add_chunks(chunks)

results = vs.search(corrected, top_k=5)

print(f"\nResults for search: '{corrected}'")
for i, res in enumerate(results):
    print(f"Result {i} (Score: {res['score']}):")
    # print(res['chunk']['text'])
    # Only print first line to keep output clean
    print(res['chunk']['text'].split('\n')[0])
    print("-" * 20)
