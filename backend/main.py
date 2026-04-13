from config import config_file
from app.app import run_app
import multiprocessing

if __name__ == "__main__":
    # Fix for Windows multiprocessing issue
    multiprocessing.freeze_support()
    
    testing = config_file["testing"]
    
    if testing:
        import unittest
        from tests import interpreter_test
        runner = unittest.TextTestRunner()
        runner.run(interpreter_test.get_suite())
    else: 
        run_app()
