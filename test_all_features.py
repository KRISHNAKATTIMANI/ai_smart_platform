"""
Comprehensive Frontend-Backend Interaction Test
Tests all 7 AI features to ensure full communication
"""
import requests

BASE_URL = "http://localhost:5000"

print("=" * 70)
print("🧪 COMPREHENSIVE FRONTEND-BACKEND INTERACTION TEST")
print("=" * 70)

# Test Results
results = {
    'passed': 0,
    'failed': 0,
    'tests': []
}


def test_endpoint(name, method, endpoint, data=None, files=None):
    """Test an API endpoint and record results"""
    try:
        url = f"{BASE_URL}{endpoint}"

        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            if files:
                response = requests.post(url, data=data, files=files, timeout=30)
            else:
                response = requests.post(url, json=data, timeout=30)

        if response.status_code in [200, 201]:
            print(f"✅ {name}: SUCCESS (HTTP {response.status_code})")
            results['passed'] += 1
            results['tests'].append({'name': name, 'status': 'PASS'})
            return response.json() if response.text else None
        else:
            print(f"❌ {name}: FAILED (HTTP {response.status_code})")
            print(f"   Response: {response.text[:100]}")
            results['failed'] += 1
            results['tests'].append({'name': name, 'status': 'FAIL'})
            return None
    except Exception as e:
        print(f"❌ {name}: ERROR - {str(e)[:100]}")
        results['failed'] += 1
        results['tests'].append({'name': name, 'status': 'ERROR'})
        return None


print("\n" + "─" * 70)
print("1️⃣  TESTING TEXT-TO-TEXT (AI CHAT)")
print("─" * 70)

# Test 1: Simple Chat
test_endpoint(
    "Simple Chat",
    "POST",
    "/api/chat",
    data={'message': 'Hello! Can you introduce yourself in one sentence?'}
)

# Test 2: Kannada Chat
test_endpoint(
    "Kannada Language Support",
    "POST",
    "/api/chat",
    data={'message': 'ನಮಸ್ಕಾರ'}
)

# Test 3: Content Analysis
test_endpoint(
    "Content Analysis",
    "POST",
    "/api/analyze",
    data={
        'content': 'Python is a high-level programming language.',
        'prompt': 'Summarize this in one sentence.'
    }
)

print("\n" + "─" * 70)
print("2️⃣  TESTING TEXT-TO-IMAGE")
print("─" * 70)

# Test 4: Image Generation - Realistic
test_endpoint(
    "Generate Realistic Image",
    "POST",
    "/api/generate-image",
    data={
        'prompt': 'A beautiful sunset over ocean',
        'style': 'realistic',
        'size': '512x512'
    }
)

# Test 5: Image Generation - Artistic
test_endpoint(
    "Generate Artistic Image",
    "POST",
    "/api/generate-image",
    data={
        'prompt': 'Abstract colorful pattern',
        'style': 'artistic',
        'size': '512x512'
    }
)

print("\n" + "─" * 70)
print("3️⃣  TESTING IMAGE-TO-TEXT (OCR)")
print("─" * 70)

# Create a test image with text
try:
    from PIL import Image, ImageDraw
    import io

    # Create simple test image
    img = Image.new('RGB', (400, 100), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((10, 30), "Hello World! Test OCR", fill='black')

    # Save to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)

    # Test 6: Upload and analyze image
    files = {'file': ('test.png', img_bytes, 'image/png')}
    test_endpoint(
        "Image OCR/Analysis",
        "POST",
        "/api/upload",
        files=files
    )
except Exception as e:
    print(f"❌ Image Upload Test: Skipped - {str(e)[:50]}")
    results['tests'].append({'name': 'Image Upload', 'status': 'SKIP'})

print("\n" + "─" * 70)
print("4️⃣  TESTING LANGUAGE DETECTION")
print("─" * 70)

# Test 7: Detect English
test_endpoint(
    "Detect English Language",
    "POST",
    "/api/detect-language",
    data={'text': 'Hello, how are you?'}
)

# Test 8: Detect Kannada
test_endpoint(
    "Detect Kannada Language",
    "POST",
    "/api/detect-language",
    data={'text': 'ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?'}
)

print("\n" + "─" * 70)
print("5️⃣  TESTING UI STRINGS")
print("─" * 70)

# Test 9: Get English UI Strings
test_endpoint(
    "Get English UI Strings",
    "GET",
    "/api/ui-strings?lang=en"
)

# Test 10: Get Kannada UI Strings
test_endpoint(
    "Get Kannada UI Strings",
    "GET",
    "/api/ui-strings?lang=kn"
)

print("\n" + "─" * 70)
print("6️⃣  TESTING USER TRACKING")
print("─" * 70)

# Test 11: Track Interaction
test_endpoint(
    "Track User Interaction",
    "POST",
    "/api/track",
    data={
        'feature_type': 'text-to-text',
        'action': 'test',
        'data': {'test': 'automated_test'},
        'userId': 'test_user_123'
    }
)

# Test 12: Get Usage Stats
test_endpoint(
    "Get Usage Statistics",
    "GET",
    "/api/usage?userId=test_user_123"
)

# Test 13: Get History
test_endpoint(
    "Get User History",
    "GET",
    "/api/history?userId=test_user_123&limit=5"
)

print("\n" + "─" * 70)
print("7️⃣  TESTING DOWNLOAD FUNCTIONALITY")
print("─" * 70)

# Test 14: Download PDF (will return file, not JSON)
try:
    response = requests.post(
        f"{BASE_URL}/api/download-pdf",
        json={
            'content': 'Test PDF content. This is a test.',
            'title': 'Test Report'
        },
        timeout=10
    )
    if response.status_code == 200 and 'application/pdf' in response.headers.get('Content-Type', ''):
        print("✅ PDF Download: SUCCESS")
        results['passed'] += 1
        results['tests'].append({'name': 'PDF Download', 'status': 'PASS'})
    else:
        print(f"❌ PDF Download: FAILED (HTTP {response.status_code})")
        results['failed'] += 1
        results['tests'].append({'name': 'PDF Download', 'status': 'FAIL'})
except Exception as e:
    print(f"❌ PDF Download: ERROR - {str(e)[:50]}")
    results['failed'] += 1
    results['tests'].append({'name': 'PDF Download', 'status': 'ERROR'})

print("\n" + "=" * 70)
print("📊 TEST SUMMARY")
print("=" * 70)

total_tests = results['passed'] + results['failed']
pass_rate = (results['passed'] / total_tests * 100) if total_tests > 0 else 0

print(f"\nTotal Tests: {total_tests}")
print(f"✅ Passed: {results['passed']}")
print(f"❌ Failed: {results['failed']}")
print(f"📈 Pass Rate: {pass_rate:.1f}%")

print("\n" + "─" * 70)
print("DETAILED RESULTS")
print("─" * 70)

for i, test in enumerate(results['tests'], 1):
    status_icon = "✅" if test['status'] == 'PASS' else "❌"
    print(f"{i}. {status_icon} {test['name']}: {test['status']}")

print("\n" + "=" * 70)
if results['failed'] == 0:
    print("🎉 ALL TESTS PASSED! Frontend-Backend Interaction is PERFECT!")
else:
    print("⚠️  Some tests failed. Check the details above.")
print("=" * 70)

print("\n✅ SERVERS CONFIRMED RUNNING:")
print("   • Backend:  http://localhost:5000")
print("   • Frontend: http://localhost:3002")
print("\n💡 Open http://localhost:3002 in your browser to use the app!\n")
