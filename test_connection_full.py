"""
Test Full Stack Connection
Verify Frontend and Backend are connected
"""
import requests
import time

print("=" * 60)
print("🔗 TESTING FULL STACK CONNECTION")
print("=" * 60)

# Test Backend
print("\n📡 Testing Backend (Flask)...")
try:
    resp = requests.get('http://localhost:5000/', timeout=5)
    if resp.status_code == 200:
        data = resp.json()
        print(f"✅ Backend: RUNNING on port 5000")
        print(f"✅ API Status: {data.get('status', 'N/A')}")
        print(f"✅ API Key: {'Configured' if data.get('api_key_configured') else 'Missing'}")
        backend_ok = True
    else:
        print(f"⚠️ Backend returned status: {resp.status_code}")
        backend_ok = False
except Exception as e:
    print(f"❌ Backend: NOT RUNNING")
    print(f"   Error: {e}")
    backend_ok = False

# Test Frontend
print("\n🎨 Testing Frontend (React)...")
try:
    resp = requests.get('http://localhost:3002', timeout=5)
    if resp.status_code == 200:
        print(f"✅ Frontend: RUNNING on port 3002")
        print(f"✅ Content Length: {len(resp.text)} bytes")
        frontend_ok = True
    else:
        print(f"⚠️ Frontend returned status: {resp.status_code}")
        frontend_ok = False
except Exception as e:
    print(f"❌ Frontend: NOT RUNNING")
    print(f"   Error: {e}")
    frontend_ok = False

# Test API Connection through Frontend Proxy
print("\n🔌 Testing Frontend → Backend Connection...")
try:
    # The React proxy should forward /api requests to the backend
    resp = requests.get('http://localhost:3002/api/usage', timeout=5)
    if resp.status_code == 200:
        print(f"✅ Proxy Connection: WORKING")
        print(f"✅ API Response: {resp.json()}")
        proxy_ok = True
    else:
        print(f"⚠️ Proxy returned status: {resp.status_code}")
        proxy_ok = False
except Exception as e:
    print(f"❌ Proxy Connection: FAILED")
    print(f"   Error: {e}")
    proxy_ok = False

# Summary
print("\n" + "=" * 60)
print("📊 CONNECTION TEST SUMMARY")
print("=" * 60)

results = [
    ("Backend (Flask)", backend_ok),
    ("Frontend (React)", frontend_ok),
    ("Proxy Connection", proxy_ok)
]

for name, status in results:
    symbol = "✅" if status else "❌"
    status_text = "CONNECTED" if status else "DISCONNECTED"
    print(f"{symbol} {name:25} {status_text}")

print("\n" + "=" * 60)

if all(status for _, status in results):
    print("🎉 SUCCESS! Full stack is connected and working!")
    print("\n🌐 Access Points:")
    print("   Frontend: http://localhost:3002")
    print("   Backend:  http://localhost:5000")
    print("   API:      http://localhost:5000/api")
else:
    print("⚠️ Some components are not connected properly.")
    if not backend_ok:
        print("   → Start backend: python app.py")
    if not frontend_ok:
        print("   → Start frontend: cd react-app && npm start")

print("=" * 60)
