#!/usr/bin/env python3
"""
Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Chatbot Setup Script
Automates the setup process for both backend and frontend
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, cwd=None):
    """Run a command and return success status"""
    try:
        print(f"Running: {' '.join(command)}")
        result = subprocess.run(command, cwd=cwd, check=True, capture_output=True, text=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        print(f"Output: {e.stdout}")
        print(f"Error: {e.stderr}")
        return False

def setup_backend():
    """Setup backend dependencies"""
    print("\n=== Setting up Backend ===")
    backend_dir = Path("backend")
    
    if not backend_dir.exists():
        print("Backend directory not found!")
        return False
    
    # Install Python requirements
    success = run_command([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], cwd=backend_dir)
    if not success:
        print("Failed to install Python requirements")
        return False
    
    # Run the requirements script to download NLTK data
    success = run_command([sys.executable, "requirements.py"], cwd=backend_dir)
    if not success:
        print("Failed to setup NLTK data")
        return False
    
    print("Backend setup completed successfully!")
    return True

def setup_frontend():
    """Setup frontend dependencies"""
    print("\n=== Setting up Frontend ===")
    frontend_dir = Path("frontend")
    
    if not frontend_dir.exists():
        print("Frontend directory not found!")
        return False
    
    # Check if npm is available
    try:
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
        package_manager = "npm"
        install_cmd = ["npm", "install"]
    except (subprocess.CalledProcessError, FileNotFoundError):
        try:
            subprocess.run(["yarn", "--version"], check=True, capture_output=True)
            package_manager = "yarn"
            install_cmd = ["yarn", "install"]
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("Neither npm nor yarn found. Please install Node.js and npm.")
            return False
    
    print(f"Using {package_manager} to install dependencies...")
    success = run_command(install_cmd, cwd=frontend_dir)
    if not success:
        print("Failed to install frontend dependencies")
        return False
    
    print("Frontend setup completed successfully!")
    return True

def main():
    """Main setup function"""
    print("Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Chatbot Setup Script")
    print("==================")
    
    # Setup backend
    backend_success = setup_backend()
    
    # Setup frontend
    frontend_success = setup_frontend()
    
    print("\n=== Setup Summary ===")
    print(f"Backend: {'✓ Success' if backend_success else '✗ Failed'}")
    print(f"Frontend: {'✓ Success' if frontend_success else '✗ Failed'}")
    
    if backend_success and frontend_success:
        print("\n🎉 Setup completed successfully!")
        print("\nTo start the application:")
        print("1. Backend: cd backend && python main.py")
        print("2. Frontend: cd frontend && npm start")
    else:
        print("\n❌ Setup failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()