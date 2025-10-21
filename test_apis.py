"""
Simple test script to verify the APIs are working
"""
import os

print("=" * 60)
print("API CONNECTION TEST")
print("=" * 60)

# Check API keys
gemini_key = os.getenv('GEMINI_API_KEY')
openai_key = os.getenv('OPENAI_API_KEY')

print(f"\nGemini API Key: {'✓ Set' if gemini_key else '✗ Not set'}")
print(f"OpenAI API Key: {'✓ Set' if openai_key else '✗ Not set'}")

if gemini_key:
    print(f"Gemini Key (first 20 chars): {gemini_key[:20]}...")

if openai_key:
    print(f"OpenAI Key (first 20 chars): {openai_key[:20]}...")

print("\n" + "=" * 60)
print("TESTING GEMINI API...")
print("=" * 60)

if gemini_key:
    try:
        import google.generativeai as genai
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content("Say 'Hello, Gemini is working!'")
        print(f"✓ SUCCESS: {response.text}")
    except Exception as e:
        print(f"✗ FAILED: {str(e)}")
else:
    print("✗ SKIPPED: No API key set")

print("\n" + "=" * 60)
print("TESTING OPENAI API...")
print("=" * 60)

if openai_key:
    try:
        import requests
        url = "https://api.openai.com/v1/chat/completions"
        payload = {
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": "Say 'Hello'"}],
            "max_tokens": 20
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {openai_key}"
        }
        response = requests.post(
            url, json=payload, headers=headers, timeout=10
        )
        response.raise_for_status()
        result = response.json()
        msg = result['choices'][0]['message']['content']
        print(f"✓ SUCCESS: {msg}")
    except Exception as e:
        print(f"✗ FAILED: {str(e)}")
else:
    print("✗ SKIPPED: No API key set")

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)
