#!/usr/bin/env python3
"""
Test script to check if the backend is working properly
"""

import requests
import json

def test_backend():
    base_url = "http://localhost:8000"
    
    print("Testing Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Chatbot Backend...")
    print("=" * 50)
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Health Check: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Health check failed: {e}")
    
    print("\n" + "-" * 30)
    
    # Test direct request (this should work)
    try:
        response = requests.get(f"{base_url}/direct/welcomegreeting")
        print(f"Direct Request Test: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Message: {data.get('message', 'No message')}")
            print(f"Related: {len(data.get('related', []))} items")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Direct request failed: {e}")
    
    print("\n" + "-" * 30)
    
    # Test query request (this might be failing)
    test_queries = [
        "hello",
        "about college",
        "computer engineering",
        "fees",
        "contact"
    ]
    
    for query in test_queries:
        try:
            encoded_query = requests.utils.quote(query)
            response = requests.get(f"{base_url}/query/{encoded_query}")
            print(f"Query '{query}': {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"  Intent: {data.get('intent', 'Unknown')}")
                print(f"  Message: {data.get('message', 'No message')[:100]}...")
            else:
                print(f"  Error: {response.text}")
        except Exception as e:
            print(f"Query '{query}' failed: {e}")
        print()

if __name__ == "__main__":
    test_backend()