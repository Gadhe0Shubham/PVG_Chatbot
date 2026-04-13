from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.interpreter import Interpreter
from data import data
from app.greetings import get_updated_string
from app.spelling_fix import correct_spelling
import uvicorn
import random
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

__app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

def simple_intent_detection(query):
    """Simple keyword-based intent detection as fallback"""
    query_lower = query.lower().strip()
    
    # Define keyword mappings based on our data
    intent_keywords = {
        "about_college": ["about", "college", "information", "info", "pune", "vidyarthi", "griha", "engineering", "dhamankar", "management"],
        "course": ["course", "courses", "program", "engineering", "degree", "study"],
        "computer_engineering": ["computer", "computer engineering", "cse", "it"],
        "mechanical_engineering": ["mechanical", "mechanical engineering", "mech"],
        "electrical_engineering": ["electrical", "electrical engineering", "eee"],
        "ai&ds_engineering": ["ai", "artificial intelligence", "data science", "aids", "ai&ds"],
        "admission_enquiry": ["admission", "apply", "application", "join", "enroll", "entrance"],
        "contact": ["contact", "phone", "email", "address", "location", "call"],
        "address": ["address", "location", "where", "situated", "campus"],
        "visit_hours": ["visit", "hours", "time", "timing", "when"],
        "student_strength": ["students", "strength", "how many", "total", "number"],
        "campus_visit": ["campus", "visit", "tour"],
        "scholarship": ["scholarship", "scholorship", "financial", "aid"],
        "computer_fee": ["fee", "fees", "cost", "price", "tuition", "computer fee"],
        "mechanical_fee": ["mechanical fee", "mech fee"],
        "electrical_fee": ["electrical fee", "eee fee"],
        "ai&ds_fee": ["ai fee", "aids fee", "data science fee"],
        "open_fee": ["open", "general", "open category"],
        "obc_fee": ["obc", "other backward class"],
        "scst_fee": ["sc", "st", "scheduled caste", "scheduled tribe"],
        "computer_intake": ["computer intake", "computer seats", "cse seats"],
        "mechanical_intake": ["mechanical intake", "mechanical seats", "mech seats"],
        "electrical_intake": ["electrical intake", "electrical seats", "eee seats"],
        "ai&ds_intake": ["ai intake", "aids intake", "data science seats"],
        "computer_criteria": ["computer eligibility", "computer criteria"],
        "mechanical_criteria": ["mechanical eligibility", "mechanical criteria"],
        "electrical_criteria": ["electrical eligibility", "electrical criteria"],
        "ai&ds_criteria": ["ai eligibility", "aids eligibility"],
        "computer_duration": ["computer duration", "computer years"],
        "mechanical_duration": ["mechanical duration", "mechanical years"],
        "electrical_duration": ["electrical duration", "electrical years"],
        "ai&ds_duration": ["ai duration", "aids duration"],
    }
    
    # Check for exact matches first
    for intent, keywords in intent_keywords.items():
        for keyword in keywords:
            if keyword in query_lower:
                return intent
    
    # Check for partial matches
    if any(word in query_lower for word in ["hello", "hi", "hey", "greetings"]):
        return "welcomegreeting"
    elif any(word in query_lower for word in ["bye", "goodbye", "exit"]):
        return "endgreeting"
    elif any(word in query_lower for word in ["thank", "thanks"]):
        return "thankgreet"
    
    # Default to about_college for unrecognized queries to provide helpful info
    return "about_college"

@__app.get("/query/{q}")
async def query(q: str):
    if not q or q.strip() == "":
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        corrected_query = correct_spelling(q.strip())
        logger.info(f"Processing query: '{q}' -> '{corrected_query}'")
        
        klass = None
        
        # Try using the interpreter first if available
        if __interpreter:
            try:
                klass = __interpreter.parse(corrected_query)
                logger.info(f"Interpreter result: {klass}")
            except Exception as e:
                logger.warning(f"Interpreter failed: {e}, falling back to keyword matching")
        
        # If interpreter failed or not available, use simple keyword matching
        if not klass or klass == "no_indent":
            klass = simple_intent_detection(corrected_query)
            logger.info(f"Keyword matching result: {klass}")
        
        # Find response
        response = ""
        for res in data.responses:
            if res["intent"] == klass:
                response = random.choice(res["responses"])
                if res["intent"] == "welcomegreeting":
                    response = get_updated_string(response)
                break
        
        # Find related queries
        related = []
        for rel in data.related:
            if rel["intent"] == klass:
                related = rel["related"]
                break
        
        if not response:
            # If no response found, provide a helpful default
            response = "I'm sorry, I don't have specific information about that. Please try asking about our courses, admissions, fees, or contact information."
            # Add some default related options
            related = [
                {"text": "About College", "tag": "about_college"},
                {"text": "Courses", "tag": "course"},
                {"text": "Admissions", "tag": "admission_enquiry"},
                {"text": "Contact", "tag": "contact"}
            ]
        
        return {
            "status": 200,
            "message": response,
            "related": related,
            "intent": klass
        }
        
    except Exception as e:
        logger.error(f"Error processing query '{q}': {e}")
        return {
            "status": 500,
            "message": "Sorry, I encountered an error processing your request. Please try again.",
            "error": str(e) if logger.level <= logging.DEBUG else None
        }

@__app.get("/direct/{klass}")
async def direct(klass: str):
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
    """Health check endpoint"""
    return {
        "status": 200,
        "message": "Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Chatbot backend is running",
        "interpreter_loaded": __interpreter is not None
    }

@__app.get("/{path:path}")
async def not_found_404(path: str):
    return {
        "status": 404,
        "message": f"Path{' '+path} not found on server!, please check the Endpoint",
    }


def run_app():
    import platform
    # Disable reload on Windows to avoid multiprocessing issues
    reload_enabled = platform.system() != "Windows"
    uvicorn.run("app.app:__app", host="0.0.0.0", port=8000, reload=reload_enabled)