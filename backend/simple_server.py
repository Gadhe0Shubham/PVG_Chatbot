
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import random
import json
from pathlib import Path
import asyncio
import logging

# Import LLM fallback
try:
    from llm_fallback import get_llm_response, is_query_college_related
    LLM_AVAILABLE = True
except ImportError as e:
    print(f"LLM fallback not available: {e}")
    LLM_AVAILABLE = False

# Load responses data
try:
    responses_path = Path("data/responses.json")
    with open(responses_path) as f:
        responses_data = json.load(f)
    
    related_path = Path("data/related.json")
    with open(related_path) as f:
        related_data = json.load(f)
except Exception as e:
    print(f"Warning: Could not load data files: {e}")
    responses_data = []
    related_data = []

app = FastAPI(
    title="JITBot Simple Server", 
    description="A simple version of JITBot that works without TensorFlow",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Simple keyword-based intent matching
def simple_intent_detection(query):
    """Simple keyword-based intent detection"""
    query_lower = query.lower()
    
    # Define simple keyword mappings
    intent_keywords = {
        "welcomegreeting": ["hello", "hi", "hey", "greetings"],
        "about_college": ["about", "college", "information", "info", "pune", "vidyarthi", "griha", "engineering", "dhamankar", "management", "about college"],
        "course": ["course", "courses", "what courses", "which courses", "degree", "curriculum"],
        "admission_enquiry": ["admission", "apply", "application", "join", "enroll"],
        "contact": ["contact", "phone", "email", "address", "location"],
        "address": ["address", "location", "where", "situated"],
        "visit_hours": ["visit", "hours", "time", "timing", "when"],
        "student_strength": ["students", "strength", "how many", "total", "number"],
        "campus_visit": ["campus", "visit", "tour"],
        "scholarship": ["scholarship", "scholorship", "financial", "aid"],
    }
    
    # Check for exact keyword matches (more precise)
    for intent, keywords in intent_keywords.items():
        for keyword in keywords:
            if intent == "welcomegreeting":
                # For greetings, check if the query starts with or is exactly the greeting
                if query_lower.strip() in keywords or query_lower.strip().startswith(tuple(keywords)):
                    return intent
            elif intent == "course":
                # For courses, be more specific - avoid matching general "what is" questions
                if keyword in query_lower and not any(general in query_lower for general in ["what is", "explain", "define"]):
                    return intent
            else:
                # For other intents, check if keyword is present
                if keyword in query_lower:
                    return intent
    
    # Default intent - return None to trigger LLM fallback
    return None

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": 200,
        "message": "JITBot Simple Server is running",
        "mode": "simple",
        "tensorflow_required": False,
        "llm_available": LLM_AVAILABLE
    }

@app.get("/test-llm/{q}")
async def test_llm(q: str):
    """Test LLM functionality directly"""
    if not LLM_AVAILABLE:
        return {"error": "LLM not available"}
    
    try:
        is_college = is_query_college_related(q)
        llm_response = await get_llm_response(q)
        return {
            "query": q,
            "is_college_related": is_college,
            "llm_response": llm_response,
            "llm_available": LLM_AVAILABLE
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/query/{q}")
async def query(q: str):
    """Handle user queries with simple intent detection and LLM fallback"""
    try:
        # First, try college-specific intent detection
        intent = simple_intent_detection(q)
        response_text = ""
        related_queries = []
        
        # Look for college-specific response
        college_response_found = False
        for response in responses_data:
            if response.get("intent") == intent:
                response_text = random.choice(response.get("responses", []))
                college_response_found = True
                break
        
        # Find related queries for college topics
        for related in related_data:
            if related.get("intent") == intent:
                related_queries = related.get("related", [])
                break
        
        # If no college-specific response found or intent is None, try LLM fallback
        if (not college_response_found or intent is None) and LLM_AVAILABLE:
            # Check if query might be general (not college-related)
            if not is_query_college_related(q):
                try:
                    print(f"Using LLM fallback for query: {q}")  # Debug log
                    llm_response = await get_llm_response(q)
                    if llm_response and len(llm_response.strip()) > 0:
                        return {
                            "status": 200,
                            "message": llm_response,
                            "related": [
                                {"text": "About College", "tag": "about_college"},
                                {"text": "Courses", "tag": "course"},
                                {"text": "Admissions", "tag": "admission_enquiry"},
                                {"text": "Contact", "tag": "contact"}
                            ],
                            "intent": "llm_fallback",
                            "mode": "llm_enhanced"
                        }
                except Exception as llm_error:
                    print(f"LLM fallback error: {llm_error}")  # Debug log
                    logging.error(f"LLM fallback error: {llm_error}")
        
        # Use college response or default
        if not response_text:
            response_text = "I'm here to help with questions about Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management. Please ask about our courses, admissions, fees, or contact information."
            related_queries = [
                {"text": "About College", "tag": "about_college"},
                {"text": "Courses", "tag": "course"},
                {"text": "Admissions", "tag": "admission_enquiry"},
                {"text": "Contact", "tag": "contact"}
            ]
        
        return {
            "status": 200,
            "message": response_text,
            "related": related_queries,
            "intent": intent,
            "mode": "simple_enhanced" if LLM_AVAILABLE else "simple"
        }
        
    except Exception as e:
        logging.error(f"Query processing error: {e}")
        return {
            "status": 500,
            "message": "Sorry, I encountered an error processing your request.",
            "error": str(e)
        }

@app.get("/direct/{intent}")
async def direct(intent: str):
    """Handle direct intent requests"""
    try:
        response_text = "I don't have information about that topic."
        related_queries = []
        
        # Find response for the intent
        for response in responses_data:
            if response.get("intent") == intent:
                response_text = random.choice(response.get("responses", [response_text]))
                break
        
        # Find related queries
        for related in related_data:
            if related.get("intent") == intent:
                related_queries = related.get("related", [])
                break
        
        return {
            "status": 200,
            "message": response_text,
            "related": related_queries,
            "intent": intent,
            "mode": "simple"
        }
        
    except Exception as e:
        return {
            "status": 500,
            "message": "Sorry, I encountered an error processing your request.",
            "error": str(e)
        }

if __name__ == "__main__":
    import multiprocessing
    import platform
    
    # Fix for Windows multiprocessing issue
    multiprocessing.freeze_support()
    
    print("Starting JITBot Simple Server...")
    print("This server uses keyword-based intent detection instead of ML models")
    print("Access the API at: http://localhost:8001")
    
    # Disable reload on Windows to avoid multiprocessing issues
    reload_enabled = platform.system() != "Windows"
    uvicorn.run("simple_server:app", host="0.0.0.0", port=8001, reload=reload_enabled)