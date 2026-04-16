from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.interpreter import Interpreter
from data import data
from app.greetings import get_updated_string
from app.spelling_fix import correct_spelling
from app.rag_knowledge_base import RAGKnowledgeBase
from app.vector_store import get_vector_store
from llm_fallback import get_llm_response
import uvicorn
import random
import logging
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize RAG Components
kb = RAGKnowledgeBase()
vector_store = get_vector_store()

def initialize_rag():
    logger.info("Initializing RAG Knowledge Base...")
    chunks = kb.load_all_data()
    vector_store.add_chunks(chunks)
    logger.info(f"RAG System ready with {len(chunks)} chunks.")

# Run initialization
initialize_rag()

# Initialize interpreter
try:
    __interpreter = Interpreter.load_interpreter("new_stem")
    __interpreter.parse("hello")
    logger.info("Interpreter loaded successfully")
except Exception as e:
    logger.error(f"Failed to load interpreter: {e}")
    __interpreter = None

__app = FastAPI(
    title="Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Chatbot", 
    description="A College Enquiry Chat bot of Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Nashik",
    version="1.0.0"
)

# Updated CORS origins for better security
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:8001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:8001",
]


__app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

def simple_intent_detection(query):
    """Simple keyword-based intent detection as fallback for related questions"""
    query_lower = query.lower().strip()
    
    # Define keyword mappings based on our data
    intent_keywords = {
        "faculty_info": ["faculty", "teacher", "professor", "staff", "hod", "head", "principal", "member"],
        "facilities": ["facility", "lab", "laboratory", "classroom", "infrastructure", "setup"],
        "about_college": ["about", "college", "information", "info", "brief", "pvg"],
        "course": ["course", "courses", "program", "engineering", "study", "department", "branch"],
        "computer_engineering": ["computer", "cse", "comp", "computer science"],
        "it_engineering": ["information technology", "it eng", "it dept", " it "],
        "mechanical_engineering": ["mechanical", "mech"],
        "electrical_engineering": ["electrical", "eee"],
        "entc_engineering": ["electronics", "telecommunication", "entc", "e&tc"],
        "ai&ds_engineering": ["ai", "data science", "aids", "artificial intelligence"],
        "admission_enquiry": ["admission", "apply", "enquiry", "join", "how to take"],
        "contact": ["contact", "phone", "email", "mobile", "call"],
        "address": ["address", "location", "reach", "where"],
        "scholarship": ["scholarship", "financial aid", "mahadbt"],
        "fee": ["fee", "cost", "charge", "payment"]
    }
    
    for intent, keywords in intent_keywords.items():
        if any(keyword in query_lower for keyword in keywords):
            return intent
    
    if any(word in query_lower for word in ["hello", "hi", "hey"]):
        return "welcomegreeting"
    
    return "about_college"

@__app.get("/query/{q}")
async def query(q: str):
    if not q or q.strip() == "":
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        corrected_query = correct_spelling(q.strip())
        logger.info(f"Processing query: '{q}' -> '{corrected_query}'")
        
        # 1. Intent detection (vectorless NLP from dataset questions first)
        klass = None

        try:
            klass = vector_store.detect_intent(corrected_query)
        except Exception as detect_error:
            logger.warning(f"Vectorless intent detection failed: {detect_error}")

        # NOTE: Legacy interpreter model is dataset-stale and can misclassify
        # modern intents (IT/E&TC/MBA/faculty names). We keep it loaded for
        # compatibility but do not use it in live routing.
        if not klass or klass == "no_indent":
            klass = simple_intent_detection(corrected_query)
        
        # 2. Vectorless RAG Retrieval
        retrieved_results = vector_store.search(corrected_query, top_k=6, intent_hint=klass)
        context_chunks = [res["chunk"]["text"] for res in retrieved_results]

        # Retrieval-driven intent correction for people/faculty queries.
        if retrieved_results:
            top_type = retrieved_results[0]["chunk"].get("metadata", {}).get("type")
            if top_type in {"faculty", "staff"}:
                klass = "faculty_info"
        
        # 3. RAG Generation
        response = await get_llm_response(corrected_query, context_chunks)
        
        # 4. Find related queries (maintain existing logic)
        related = []
        for rel in data.related:
            if rel["intent"] == klass:
                related = rel["related"]
                break
        
        if not related:
            related = [
                {"text": "About College", "tag": "about_college"},
                {"text": "Courses", "tag": "course"},
                {"text": "Admissions", "tag": "admission_enquiry"}
            ]
        
        return {
            "status": 200,
            "message": response,
            "related": related,
            "intent": klass,
            "retrieved_context": context_chunks if logger.level <= logging.DEBUG else None
        }
        
    except Exception as e:
        logger.error(f"Error processing query '{q}': {e}")
        return {
            "status": 500,
            "message": "Sorry, I encountered an error processing your request.",
            "error": str(e)
        }

@__app.get("/direct/{klass}")
async def direct(klass: str):
    # For direct tag clicks, we can still use the old random response or trigger a specialized RAG query
    response = ""
    related = []
    for res in data.responses:
        if res["intent"] == klass:
            response = random.choice(res["responses"])
            if res["intent"] == "welcomegreeting":
                response = get_updated_string(response)
            break
    for rel in data.related:
        if rel["intent"] == klass:
            related = rel["related"]
            break
    return {
        "status": 200,
        "message": response,
        "related": related,
    }

@__app.get("/health")
async def health_check():
    return {
        "status": 200,
        "message": "PVGCOE Chatbot RAG System is running",
        "rag_ready": vector_store.index is not None
    }

@__app.get("/{path:path}")
async def not_found_404(path: str):
    return {
        "status": 404,
        "message": f"Path {path} not found",
    }


def run_app():
    import platform
    # Disable reload on Windows to avoid multiprocessing issues
    reload_enabled = platform.system() != "Windows"
    uvicorn.run("app.app:__app", host="0.0.0.0", port=8001, reload=reload_enabled)


if __name__ == "__main__":
    run_app()
