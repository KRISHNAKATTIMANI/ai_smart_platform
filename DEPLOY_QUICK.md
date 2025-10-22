# 🚀 Deploy to Render.com - Quick Start

## ⚡ 3-Step Deployment

### 1️⃣ Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2️⃣ Connect to Render.com
1. Go to [render.com](https://render.com) and login with GitHub
2. Click **"New +"** → **"Blueprint"**
3. Select your repository: `ai-assistant`
4. Render automatically reads `render.yaml`

### 3️⃣ Add Environment Variables

**Backend Service (`ai-assistant-api`):**
```
GEMINI_API_KEY = AIzaSyDLMefj6yMHr_odtzNY-FThA-IHUewxaCk
PYTHON_VERSION = 3.11.0
```

**Frontend Service (`ai-assistant-frontend`):**
```
REACT_APP_API_URL = https://ai-assistant-api.onrender.com
```
*(Update with your actual backend URL after it deploys)*

---

## ✅ Auto-Deploy is Enabled!

Every `git push` to GitHub will automatically deploy to Render! 🎉

---

## 📚 Full Guide

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for complete instructions.

---

## 🔗 After Deployment

Your app will be live at:
- **Frontend:** `https://ai-assistant-frontend.onrender.com`
- **Backend:** `https://ai-assistant-api.onrender.com`

**Note:** Free tier services may spin down after inactivity. First request may take 30-60 seconds.

---

## 🆘 Troubleshooting

**Build fails?**
- Check Render logs in dashboard
- Verify all dependencies in requirements.txt and package.json

**API not working?**
- Verify GEMINI_API_KEY is set correctly
- Check CORS is enabled (already done in app.py)

**Frontend can't connect to backend?**
- Update REACT_APP_API_URL with actual backend URL
- Rebuild frontend service

---

## 💡 Development Workflow

```bash
# 1. Make changes locally
code .

# 2. Test locally
python app.py  # Backend
cd react-app && npm start  # Frontend

# 3. Commit and push
git add .
git commit -m "Your changes"
git push origin main

# 4. Render auto-deploys! ✨
```

---

**Happy Coding! 🚀**
