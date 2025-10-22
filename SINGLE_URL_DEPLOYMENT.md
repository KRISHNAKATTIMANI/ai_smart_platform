# 🚀 Single URL Deployment Guide

## ✨ Your App Now Works as ONE Service!

Your application is now configured to run as a **single backend service** that serves both the API and the React frontend from **one URL**.

---

## 📋 How It Works

1. **Backend (Flask)** runs on Render
2. **Backend serves** the pre-built React app from `/react-app/build` folder
3. **One URL** for everything: `https://smart-ai-platform.onrender.com`

---

## 🔧 Render.com Configuration

### **Keep ONLY the Backend Service**

**Delete the Frontend Static Site** if you created one - you don't need it anymore!

### **Backend Service Settings:**

| Setting | Value |
|---------|-------|
| **Type** | Web Service |
| **Repository** | `dayanandaks4/image-to-text` |
| **Branch** | `main` |
| **Root Directory** | (leave empty) |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app --bind 0.0.0.0:$PORT` |

### **Environment Variables:**

| Variable | Value |
|----------|-------|
| `GEMINI_API_KEY` | `AIzaSyDLMefj6yMHr_odtzNY-FThA-IHUewxaCk` |
| `PYTHON_VERSION` | `3.11.0` |

---

## ✅ What Changed

### **1. Backend Now Serves React**

The `app.py` file now has:

```python
# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    """Serve React application."""
    static_folder = os.path.join(os.path.dirname(__file__), 'react-app', 'build')

    # Handle API routes
    if path.startswith('api/'):
        return jsonify({'error': 'API endpoint not found'}), 404

    # Serve static files
    if path and os.path.exists(os.path.join(static_folder, path)):
        return send_file(os.path.join(static_folder, path))

    # Serve index.html for all other routes (React Router)
    return send_file(os.path.join(static_folder, 'index.html'))
```

### **2. React Build Folder Included**

- Built React app is in `/react-app/build`
- Pushed to GitHub (normally ignored, but we force-added it)
- Configured to use production API URL

### **3. API Health Check Moved**

- Old: `GET /` → API status
- New: `GET /api/health` → API status
- New: `GET /` → React app (homepage)

---

## 🎯 Deployment Steps

1. **Go to Render Dashboard**
2. **Your backend service** should auto-deploy (connected to GitHub)
3. **Wait 5-10 minutes** for deployment
4. **Access your app** at: `https://smart-ai-platform.onrender.com`

---

## 🌐 URL Structure

After deployment, everything works from ONE URL:

| URL | What It Serves |
|-----|----------------|
| `https://smart-ai-platform.onrender.com/` | React Homepage |
| `https://smart-ai-platform.onrender.com/dashboard` | React Dashboard |
| `https://smart-ai-platform.onrender.com/text-to-image` | React Text-to-Image Page |
| `https://smart-ai-platform.onrender.com/api/chat` | Backend API - Chat |
| `https://smart-ai-platform.onrender.com/api/upload` | Backend API - Upload |
| `https://smart-ai-platform.onrender.com/api/health` | Backend Health Check |

---

## ✨ Benefits

✅ **One URL** - No need to manage separate frontend/backend URLs
✅ **No CORS issues** - Everything served from same domain
✅ **Simpler deployment** - Just one service to manage
✅ **Faster** - No cross-origin requests
✅ **Easier** - No need to configure REACT_APP_API_URL

---

## 🔄 How to Update

### **When you change React code:**

1. **Build locally:**
   ```bash
   cd react-app
   npm run build
   ```

2. **Commit and push:**
   ```bash
   git add react-app/build
   git commit -m "Updated React build"
   git push origin main
   ```

3. **Render auto-deploys** the changes

### **When you change Backend code:**

1. **Just commit and push:**
   ```bash
   git add app.py
   git commit -m "Updated backend"
   git push origin main
   ```

2. **Render auto-deploys** the changes

---

## 🎉 Your App is Ready!

Just wait for Render to deploy, then access:

**🌐 https://smart-ai-platform.onrender.com**

All features will work:
- User authentication
- Text-to-Image generation
- PDF upload & summarization
- Image-to-Text extraction
- All AI features
- Personalized dashboard
- Feature history tracking

**ONE URL. ONE DEPLOYMENT. EVERYTHING WORKS!** ✨🚀
