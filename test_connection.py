"""Quick test to verify API and Gemini connection"""
import os
from dotenv import load_dotenv
import google.generativeai as genai
import requests

# Load environment variables
load_dotenv()

print("=" * 60)
print("🔍 Testing API Connection")
print("=" * 60)

# Test 1: Check environment variable
gemini_key = os.getenv('GEMINI_API_KEY')
print(f"\n1. GEMINI_API_KEY: {'✓ Set' if gemini_key else '✗ Not Set'}")
if gemini_key:
    print(f"   Key: {gemini_key[:20]}...")

# Test 2: Test Gemini API
if gemini_key:
    try:
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model.generate_content("Say 'Hello! API is working!' in one sentence.")
        print("\n2. Gemini API Test: ✓ Success")
        print(f"   Response: {response.text.strip()[:100]}")
    except Exception as e:
        print("\n2. Gemini API Test: ✗ Failed")
        print(f"   Error: {str(e)}")

# Test 3: Test Flask Backend
try:
    response = requests.get('http://localhost:5000/api/health', timeout=5)
    if response.status_code == 200:
        data = response.json()
        print("\n3. Flask Backend: ✓ Running")
        print(f"   Status: {data.get('status')}")
        print(f"   API Key Configured: {data.get('api_key_configured')}")
    else:
        print(f"\n3. Flask Backend: ✗ Error {response.status_code}")
except Exception as e:
    print("\n3. Flask Backend: ✗ Not Running")
    print(f"   Error: {str(e)}")

# Test 4: Test Chat Endpoint
try:
    response = requests.post(
        'http://localhost:5000/api/chat',
        json={'message': 'Hello, can you hear me?'},
        timeout=10
    )
    if response.status_code == 200:
        data = response.json()
        print("\n4. Chat Endpoint: ✓ Working")
        print(f"   Response: {data.get('response', '')[:100]}...")
    else:
        print(f"\n4. Chat Endpoint: ✗ Error {response.status_code}")
        print(f"   Message: {response.text}")
except Exception as e:
    print("\n4. Chat Endpoint: ✗ Failed")
    print(f"   Error: {str(e)}")

print("\n" + "=" * 60)
print("✓ Test Complete!")
print("=" * 60)
print("\n📍 Frontend: http://localhost:3002")
print("📍 Backend: http://localhost:5000")
print("\n")
