import subprocess
import sys
import os

def install_requirements():
    """Install packages from requirements.txt"""
    requirements_path = os.path.join(os.path.dirname(__file__), 'requirements.txt')
    
    if os.path.exists(requirements_path):
        print("Installing packages from requirements.txt...")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', requirements_path])
    else:
        print("requirements.txt not found!")
        return False
    
    # Install NLTK data
    try:
        import nltk
        print("Downloading NLTK data...")
        nltk.download('punkt', quiet=True)
        nltk.download('wordnet', quiet=True)
        nltk.download('omw-1.4', quiet=True)
        nltk.download('stopwords', quiet=True)
        print("NLTK data downloaded successfully!")
    except ImportError:
        print("NLTK not installed. Please install requirements first.")
        return False
    
    return True

if __name__ == "__main__":
    success = install_requirements()
    if success:
        print("All dependencies installed successfully!")
    else:
        print("Failed to install some dependencies.")