#  Project File Manifest: PVGCOE Chatbot

A complete map of the project files and their specific roles within the architecture.

##  Root Directory
| File | Purpose |
| :--- | :--- |
| `setup.py` | Installation and dependency configuration script. |
| `start_backend.py` | Convenient script to launch the FastAPI server. |
| `test_backend.py` | API testing and endpoint validation. |
| `PROJECT_DOCUMENTATION.md` | High-level project overview (Main Docs). |
| `TECHNICAL_SPECS.md` | Detailed technical internal logic documentation. |
| `README.md` | Standard project readme for repository landing page. |
| `LICENSE` | MIT License details. |

##  Backend (`/backend`)
| File/Folder | Purpose |
| :--- | :--- |
| `main.py` | Main entry point for the API. |
| `llm_fallback.py` | LLM generation logic using DialoGPT/Transformers. |
| `config.json` | Global application configuration settings. |
| `app/` | **Core Application Logic** |
| `app/rag_knowledge_base.py` | Data ingestion and chunking for the RAG system. |
| `app/vector_store.py` | Similarity search and vector indexing engine. |
| `app/app.py` | FastAPI route definitions and request lifecycle. |
| `app/spelling_fix.py` | Intelligence typo-correction utility. |
| `data/` | **Knowledge Base Content** |
| `data/raw_data.json` | Primary college information and responses. |
| `data/Faculty.json` | Detailed department and faculty database. |
| `data/related.json` | Definition of contextual follow-up questions. |
| `models/` | Pre-trained ML models for intent classification. |

##  Frontend (`/frontend`)
| File/Folder | Purpose |
| :--- | :--- |
| `package.json` | Node.js dependencies and scripts. |
| `tailwind.config.js` | UI/UX design tokens and color schemes. |
| `src/` | **React Source Code** |
| `src/App.js` | Main React component and layout. |
| `src/components/` | Modular UI pieces (Chat window, Nav, Footer). |
| `src/hooks/` | Logic for API calls and Voice API integration. |
| `public/` | Static assets, logo, and icons. |

---

*Total Files Analyzed: 50+ | Total Lines of Code: 5,000+*
