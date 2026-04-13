#!/usr/bin/env python3
"""
Simple script to start the Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Chatbot backend
"""

import sys
import os
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

def start_backend():
    print("Starting Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Chatbot Backend...")
    print("=" * 50)
    
    try:
        # Try to start the main app first
        print("Attempting to start main backend with ML interpreter...")
        os.chdir(backend_dir)
        from app.app import run_app
        run_app()
    except Exception as e:
        print(f"Main backend failed: {e}")
        print("\nFalling back to simple server...")
        try:
            import uvicorn
            from simple_server import app
            print("Starting simple server without ML dependencies...")
            uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
        except Exception as e2:
            print(f"Simple server also failed: {e2}")
            print("\nPlease check your Python environment and dependencies.")
            sys.exit(1)

if __name__ == "__main__":
    start_backend()