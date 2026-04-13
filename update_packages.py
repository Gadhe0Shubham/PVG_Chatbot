#!/usr/bin/env python3
"""
Package Update Script for JITBot
Updates both backend and frontend dependencies to their latest versions
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

def update_backend():
    """Update backend Python packages"""
    print("\n=== Updating Backend Packages ===")
    backend_dir = Path("backend")
    
    if not backend_dir.exists():
        print("Backend directory not found!")
        return False
    
    # Update pip first
    run_command([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
    
    # Update all packages
    success = run_command([sys.executable, "-m", "pip", "install", "--upgrade", "-r", "requirements.txt"], cwd=backend_dir)
    if not success:
        print("Failed to update Python packages")
        return False
    
    print("Backend packages updated successfully!")
    return True

def update_frontend():
    """Update frontend Node.js packages"""
    print("\n=== Updating Frontend Packages ===")
    frontend_dir = Path("frontend")
    
    if not frontend_dir.exists():
        print("Frontend directory not found!")
        return False
    
    # Check for package manager
    try:
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
        update_cmd = ["npm", "update"]
        audit_cmd = ["npm", "audit", "fix"]
    except (subprocess.CalledProcessError, FileNotFoundError):
        try:
            subprocess.run(["yarn", "--version"], check=True, capture_output=True)
            update_cmd = ["yarn", "upgrade"]
            audit_cmd = ["yarn", "audit", "--fix"]
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("Neither npm nor yarn found!")
            return False
    
    # Update packages
    success = run_command(update_cmd, cwd=frontend_dir)
    if not success:
        print("Failed to update frontend packages")
        return False
    
    # Fix security vulnerabilities
    print("Fixing security vulnerabilities...")
    run_command(audit_cmd, cwd=frontend_dir)
    
    print("Frontend packages updated successfully!")
    return True

def main():
    """Main update function"""
    print("JITBot Package Update Script")
    print("============================")
    
    # Update backend
    backend_success = update_backend()
    
    # Update frontend
    frontend_success = update_frontend()
    
    print("\n=== Update Summary ===")
    print(f"Backend: {'✓ Success' if backend_success else '✗ Failed'}")
    print(f"Frontend: {'✓ Success' if frontend_success else '✗ Failed'}")
    
    if backend_success and frontend_success:
        print("\n🎉 All packages updated successfully!")
    else:
        print("\n❌ Some updates failed. Please check the errors above.")

if __name__ == "__main__":
    main()