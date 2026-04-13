#!/usr/bin/env python3
"""
LLM Fallback Module for College Chatbot
Uses a small Hugging Face model for general queries not related to college
"""

import logging
from typing import Optional
import asyncio
from functools import lru_cache

# Import torch at module level
try:
    import torch
    from transformers import AutoTokenizer, AutoModelForCausalLM
    TORCH_AVAILABLE = True
except ImportError as e:
    print(f"PyTorch/Transformers not available: {e}")
    TORCH_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMFallback:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.model_loaded = False
        self.model_name = "microsoft/DialoGPT-small"  # Small, fast conversational model
        
    async def initialize_model(self):
        """Initialize the LLM model asynchronously"""
        if self.model_loaded or not TORCH_AVAILABLE:
            return self.model_loaded
            
        try:
            logger.info("Loading LLM model for fallback responses...")
            
            # Load tokenizer and model
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else None
            )
            
            # Add padding token if not present
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            self.model_loaded = True
            logger.info("LLM model loaded successfully!")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load LLM model: {e}")
            self.model_loaded = False
            return False
    
    def is_college_related(self, query: str) -> bool:
        """Check if query is related to college topics"""
        college_keywords = [
            # College specific
            "pune", "vidyarthi", "griha", "dhamankar", "nashik", "college", "engineering",
            "management", "pvg", "institute",
            
            # Academic topics
            "course", "courses", "program", "degree", "study", "curriculum", "syllabus",
            "admission", "apply", "application", "join", "enroll", "eligibility", "criteria",
            "fee", "fees", "cost", "price", "tuition", "payment", "scholarship",
            "faculty", "teacher", "professor", "staff", "department",
            "facility", "facilities", "lab", "library", "hostel", "campus",
            "placement", "job", "career", "company", "recruitment",
            "contact", "phone", "email", "address", "location",
            "computer", "mechanical", "electrical", "ai", "data science", "engineering",
            "semester", "exam", "result", "grade", "marks", "attendance",
            "student", "students", "batch", "class", "section"
        ]
        
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in college_keywords)
    
    async def generate_response(self, query: str, max_length: int = 100) -> str:
        """Generate response using LLM"""
        if not TORCH_AVAILABLE:
            return "I'm sorry, I can only help with college-related questions. Please ask about our courses, admissions, fees, or contact information."
            
        if not self.model_loaded:
            await self.initialize_model()
            
        if not self.model_loaded:
            return "I'm sorry, I can only help with college-related questions. Please ask about our courses, admissions, fees, or contact information."
        
        try:
            # Check if query is college-related
            if self.is_college_related(query):
                return "I'd be happy to help with college-related questions! Please ask about our courses, admissions, fees, faculty, or contact information."
            
            # For general questions, provide comprehensive answers
            # Add specific knowledge for common academic topics
            query_lower = query.lower()
            
            if "newton" in query_lower and "third" in query_lower and "law" in query_lower:
                return """Newton's Third Law of Motion states: "For every action, there is an equal and opposite reaction."

This means:
• When you push on something, it pushes back on you with equal force
• When you walk, you push backward on the ground, and the ground pushes forward on you
• When a rocket burns fuel downward, the reaction force pushes the rocket upward
• When you sit on a chair, you push down on it, and it pushes up on you

This law explains how forces always come in pairs and is fundamental to understanding motion and mechanics.

If you have any questions about Physics courses at Pune Vidyarthi Griha's College of Engineering, I'd be happy to help!"""
            
            elif "newton" in query_lower and "second" in query_lower and "law" in query_lower:
                return """Newton's Second Law of Motion states: "The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass."

Formula: F = ma (Force = mass × acceleration)

This means:
• More force = more acceleration
• More mass = less acceleration (for the same force)
• If you push harder on an object, it accelerates faster
• Heavier objects need more force to achieve the same acceleration

Examples:
• A car needs more force to accelerate when it's fully loaded
• A baseball accelerates faster than a bowling ball with the same force
• Rockets need enormous force to accelerate their massive weight

This law is fundamental in engineering and physics calculations.

If you have any questions about Physics or Mechanical Engineering at Pune Vidyarthi Griha's College, I'd be happy to help!"""
            
            elif "python" in query_lower and ("programming" in query_lower or "language" in query_lower or "what is" in query_lower):
                return """Python is a high-level, interpreted programming language known for its simplicity and readability.

Key features:
• Easy to learn and write with clean, readable syntax
• Versatile - used for web development, data science, AI, automation
• Large ecosystem of libraries and frameworks
• Cross-platform compatibility
• Strong community support

Python is widely used in:
• Web development (Django, Flask)
• Data science and machine learning
• Automation and scripting
• Software development

At Pune Vidyarthi Griha's College of Engineering, we teach Python programming in our Computer Science and AI&DS courses!"""
            
            elif "artificial intelligence" in query_lower or "ai" in query_lower:
                return """Artificial Intelligence (AI) is the simulation of human intelligence in machines that are programmed to think and learn.

Types of AI:
• Narrow AI - Designed for specific tasks (like voice assistants)
• General AI - Human-level intelligence across all domains
• Machine Learning - Systems that learn from data
• Deep Learning - Neural networks that mimic brain function

Applications:
• Healthcare diagnostics
• Autonomous vehicles
• Natural language processing
• Computer vision
• Robotics

Our AI&DS Engineering program at Pune Vidyarthi Griha's College covers these exciting topics in depth!"""
            
            # For other general questions, use the LLM model
            # Prepare input for the model with better prompting
            input_text = f"Question: {query}\nAnswer:"
            
            # Tokenize input with attention mask
            inputs = self.tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True, padding=True)
            
            # Generate response with better parameters
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs.input_ids,
                    attention_mask=inputs.attention_mask,
                    max_length=inputs.input_ids.shape[1] + max_length,
                    num_return_sequences=1,
                    temperature=0.8,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id,
                    no_repeat_ngram_size=3,
                    repetition_penalty=1.2
                )
            
            # Decode response
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract only the answer part
            if "Answer:" in response:
                bot_response = response.split("Answer:")[-1].strip()
            else:
                bot_response = response.replace(input_text, "").strip()
            
            # Clean up the response
            bot_response = bot_response.replace("Question:", "").strip()
            
            # Remove any repeated text or artifacts
            lines = bot_response.split('\n')
            clean_lines = []
            for line in lines:
                line = line.strip()
                if line and line not in clean_lines:
                    clean_lines.append(line)
            
            bot_response = '\n'.join(clean_lines[:5])  # Limit to 5 lines
            
            # Ensure reasonable length
            if len(bot_response) > 300:
                bot_response = bot_response[:300] + "..."
            
            # Add college context if response is good
            if bot_response and len(bot_response.strip()) > 10:
                bot_response += "\n\nIf you have any questions about Pune Vidyarthi Griha's College of Engineering, I'd be happy to help!"
                return bot_response
            else:
                # Fallback to a helpful response
                return f"I understand you're asking about '{query}'. While I specialize in college information, I'm here to help! For detailed academic questions, our faculty at Pune Vidyarthi Griha's College of Engineering would be the best resource. Feel free to ask about our courses, admissions, or contact information!"
            
        except Exception as e:
            logger.error(f"Error generating LLM response: {e}")
            return "I'm sorry, I encountered an issue. Please ask about our college courses, admissions, or contact information."

# Global instance
llm_fallback = LLMFallback()

async def get_llm_response(query: str) -> str:
    """Get response from LLM fallback"""
    return await llm_fallback.generate_response(query)

def is_query_college_related(query: str) -> bool:
    """Check if query is college-related"""
    return llm_fallback.is_college_related(query)