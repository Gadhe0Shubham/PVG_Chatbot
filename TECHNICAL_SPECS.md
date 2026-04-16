#  Technical Specifications: PVGCOE Chatbot RAG System

This document delves into the implementation details of the AI-Powered College Enquiry Chatbot.

---

##  Core Logic: Retrieval-Augmented Generation (RAG)

The system transitions from a simple intent-response model to a sophisticated RAG pipeline to provide more accurate and context-aware answers.

### 1. Data Processing (`rag_knowledge_base.py`)
The `RAGKnowledgeBase` class is responsible for converting unstructured/semi-structured JSON data into searchable text chunks.

- **Sources**:
    - **Raw Data**: Extracts responses, questions, and tags from `raw_data.json`.
    - **Faculty Data**: Iterates through `Faculty.json`, creating chunks for:
        - Department Overviews (Vision, Mission, Objectives).
        - Individual Teaching Faculty (Designation, Qualification, Specialization).
        - Technical Staff and Lab Assistants.
- **Chunking Strategy**: Each chunk is enriched with metadata (source, type, department) and "Keyword" hints to improve retrieval accuracy.

### 2. Information Retrieval (`vector_store.py`)
We use an in-memory vector indexing system for speed and simplicity.

- **Vectorization**: Uses `TfidfVectorizer` (or similar embedding logic) to convert text chunks into numerical vectors.
- **Similarity Search**: When a user asks a question, the query is vectorized and compared against the index using **Cosine Similarity**.
- **Top-K Retrieval**: The system fetches the top 5 most relevant chunks to serve as context for the LLM.

### 3. Response Generation (`llm_fallback.py`)
The final response is generated using a "System Prompt" + "Context" + "User Query" pattern.

- **LLM Engine**: DialoGPT-small (local) or API-based integration.
- **Prompt Engineering**: The model is instructed to act as a "helpful assistant for PVGCOE Nashik" and only use the provided context to answer questions, ensuring facts remain tied to the college data.

---

##  Hybrid Intent Classification

The system ensures that even if RAG retrieval is noisy, the "Intent" is still captured for UI elements like "Related Questions".

1.  **TensorFlow Classifier**:
    - Uses a `Sequence-to-Vector` model followed by a `Vector-to-Class` dense network.
    - Categorizes queries into 45+ intents (e.g., `fees`, `admission`, `computer_dept`).
2.  **Keyword-based Fallback**:
    - A dictionary-based matcher (`simple_intent_detection`) ensures that if the ML model fails, high-confidence keywords (like "admission" or "hod") still trigger the correct intent.

---

##  Frontend Implementation

The frontend is a single-page application (SPA) focused on interactive communication.

### Key Components:
- **`ChatInterface`**: Manages the message history, auto-scrolling, and interaction with the Backend API.
- **`VoiceHandler`**: 
    - Implements `SpeechRecognition` to capture user voice.
    - Implements `SpeechSynthesis` to read out the bot's responses.
- **`RelatedQueries`**: Renders clickable buttons based on the `related` field in the API response, guiding the user through the knowledge base.

---

##  Data Schema

### `raw_data.json`
```json
{
  "tag": "placement",
  "questions": ["How is placement?", "Companies visiting"],
  "response": ["Our college has an excellent placement record with top companies like TCS, Capgemini..."],
  "related": [{"text": "Placement Statistics", "tag": "placement_stats"}]
}
```

### `Faculty.json`
```json
{
  "departments": [
    {
      "name": "Computer Engineering",
      "vision": "...",
      "faculty": [
        {
          "name": "Prof. X",
          "designation": "HOD",
          "areas_of_interest": ["AI", "ML"]
        }
      ]
    }
  ]
}
```

---

## ️ Error Handling & Robustness

- **Spell Check**: The `spelling_fix.py` uses the `autocorrect` library but is customized to **ignore proper nouns** (like college names or faculty names) to prevent "over-correction".
- **Empty Query Handling**: Validates input before sending to the backend to save resources.
- **API Resilience**: The frontend includes retry logic and user-friendly error messages if the backend is offline.

---

*Revision: 1.1 | Date: April 14, 2026*
