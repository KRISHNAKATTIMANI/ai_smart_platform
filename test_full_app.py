"""
Full Application Test Suite
Tests all major API endpoints
"""
import requests
import time

BASE_URL = 'http://localhost:5000'


def test_health():
    """Test health check endpoint."""
    print("\n🔍 Testing /api/health...")
    try:
        resp = requests.get(f"{BASE_URL}/api/health", timeout=5)
        print(f"✅ Status: {resp.status_code}")
        data = resp.json()
        print(f"✅ API Status: {data['status']}")
        print(f"✅ API Key Configured: {data['api_key_configured']}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_chat():
    """Test chat endpoint."""
    print("\n🔍 Testing /api/chat...")
    try:
        payload = {
            'message': 'What is artificial intelligence?'
        }
        resp = requests.post(f"{BASE_URL}/api/chat", json=payload, timeout=10)
        print(f"✅ Status: {resp.status_code}")
        data = resp.json()
        print(f"✅ Response length: {len(data['response'])} characters")
        print(f"✅ Language detected: {data['language']}")
        print(f"✅ Response preview: {data['response'][:100]}...")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_generate_image():
    """Test image generation endpoint."""
    print("\n🔍 Testing /api/generate-image...")
    try:
        payload = {
            'prompt': 'A beautiful sunset over mountains',
            'style': 'realistic',
            'size': '1024x1024'
        }
        resp = requests.post(f"{BASE_URL}/api/generate-image", json=payload, timeout=15)
        print(f"✅ Status: {resp.status_code}")
        data = resp.json()
        print(f"✅ Image URL generated: {data['image_url'][:80]}...")
        print(f"✅ Enhanced prompt: {data['enhanced_prompt'][:100]}...")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_usage():
    """Test usage statistics endpoint."""
    print("\n🔍 Testing /api/usage...")
    try:
        resp = requests.get(f"{BASE_URL}/api/usage", timeout=5)
        print(f"✅ Status: {resp.status_code}")
        data = resp.json()
        print(f"✅ Usage data received: {data}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_ui_strings():
    """Test UI strings endpoint."""
    print("\n🔍 Testing /api/ui-strings...")
    try:
        resp = requests.get(f"{BASE_URL}/api/ui-strings?lang=en", timeout=5)
        print(f"✅ Status: {resp.status_code}")
        data = resp.json()
        print(f"✅ Language: {data['language']}")
        print(f"✅ Strings count: {len(data['strings'])}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    """Run all tests."""
    print("=" * 60)
    print("🚀 FULL APPLICATION TEST SUITE")
    print("=" * 60)

    # Wait for server to be ready
    print("\n⏳ Waiting for server to be ready...")
    time.sleep(2)

    results = []

    # Run tests
    results.append(("Health Check", test_health()))
    results.append(("Chat API", test_chat()))
    results.append(("Image Generation", test_generate_image()))
    results.append(("Usage Statistics", test_usage()))
    results.append(("UI Strings", test_ui_strings()))

    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:20} {status}")

    print("\n" + "=" * 60)
    print(f"Results: {passed}/{total} tests passed")
    print("=" * 60)

    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Application is fully functional!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please check the errors above.")


if __name__ == '__main__':
    main()
