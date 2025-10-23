import requests

BASE = 'http://localhost:5000'

payload = {
    'prompt': 'Elon Musk',
    'style': 'realistic',
    'size': '1024x1024'
}

resp = requests.post(f"{BASE}/api/generate-image", json=payload, timeout=20)
print('Status:', resp.status_code)
try:
    print(resp.json())
except Exception:
    print(resp.text)
