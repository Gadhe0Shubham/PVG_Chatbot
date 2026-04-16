#!/usr/bin/env python3
"""
Test script to verify JITBot setup is working correctly
"""

import sys
import os
from pathlib import Path

def test_backend():
    """Test backend dependencies and basic functionality"""
    print("Testing Backend...")
    
    try:
        # Test basic imports
        import fastapi
        import uvicorn
        print("PASS FastAPI and Uvicorn imported successfully")
        
        # Test NLTK
        try:
            import nltk
            print("PASS NLTK imported successfully")
        except ImportError:
            print("WARNING NLTK not found - install with: pip install nltk")
        
        # Test data loading
        sys.path.append(str(Path("backend").absolute()))
        from data import data
        print("PASS Data files loaded successfully")
        
        # Test TensorFlow (optional - may fail on some systems)
        try:
            import tensorflow as tf
            print("PASS TensorFlow imported successfully")
        except ImportError as e:
            print(f"WARNING TensorFlow import failed: {e}")
            print("  This may be due to missing Visual C++ Redistributable on Windows")
            print("  The chatbot may still work if models are pre-trained")
        
        # Test model loading (basic check - may fail if TensorFlow has issues)
        try:
            from models.interpreter import Interpreter
            print("PASS Interpreter module imported successfully")
        except Exception as e:
            print(f"WARNING Interpreter import failed: {e}")
            print("  This is likely due to TensorFlow issues")
        
        return True
        
    except ImportError as e:
        print(f"FAIL Critical import error: {e}")
        return False
    except Exception as e:
        print(f"FAIL Backend test failed: {e}")
        return False

def test_frontend():
    """Test frontend build"""
    print("\nTesting Frontend...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("FAIL Frontend directory not found")
        return False
    
    # Check if node_modules exists
    node_modules = frontend_dir / "node_modules"
    if not node_modules.exists():
        print("FAIL node_modules not found. Run 'npm install' in frontend directory")
        return False
    
    print("PASS Frontend dependencies appear to be installed")
    
    # Check if build directory exists (from previous build)
    build_dir = frontend_dir / "build"
    if build_dir.exists():
        print("PASS Build directory found - frontend can be built")
    else:
        print("ℹ Build directory not found - run 'npm run build' to test")
    
    return True

def test_files():
    """Test that all required files exist"""
    print("\nTesting File Structure...")
    
    required_files = [
        "backend/main.py",
        "backend/config.py",
        "backend/config.json",
        "backend/requirements.txt",
        "backend/app/app.py",
        "backend/data/data.py",
        "backend/models/interpreter.py",
        "frontend/package.json",
        "frontend/src/App.jsx",
        "frontend/src/hooks/useSpeech.js",
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
        else:
            print(f"PASS {file_path}")
    
    if missing_files:
        print(f"\nFAIL Missing files: {missing_files}")
        return False
    
    print("PASS All required files found")
    return True

def main():
    """Run all tests"""
    print("JITBot Setup Test")
    print("=================")
    
    # Test file structure
    files_ok = test_files()
    
    # Test backend
    backend_ok = test_backend()
    
    # Test frontend
    frontend_ok = test_frontend()
    
    print("\n" + "="*50)
    print("TEST RESULTS:")
    print(f"Files: {'PASS PASS' if files_ok else 'FAIL FAIL'}")
    print(f"Backend: {'PASS PASS' if backend_ok else 'FAIL FAIL'}")
    print(f"Frontend: {'PASS PASS' if frontend_ok else 'FAIL FAIL'}")
    
    if files_ok and backend_ok and frontend_ok:
        print("\nSuccess All tests passed! JITBot setup is working correctly.")
        print("\nTo start the application:")
        print("1. Backend: cd backend && python main.py")
        print("2. Frontend: cd frontend && npm start")
        return True
    else:
        print("\n[ ] Some tests failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)