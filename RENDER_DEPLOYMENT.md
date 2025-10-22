# 🚀 Render.com Deployment Guide with Auto-Deploy from GitHub

This guide will help you deploy your AI Assistant app to Render.com with automatic deployments from GitHub.

## 📋 Prerequisites

1. ✅ GitHub account
2. ✅ Render.com account (free tier works)
3. ✅ Gemini API Key: `AIzaSyDLMefj6yMHr_odtzNY-FThA-IHUewxaCk`

---

## 🔧 Step 1: Push Code to GitHub

### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - AI Assistant App"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `ai-assistant` (or any name)
3. **Important:** Do NOT initialize with README, .gitignore, or license (we already have them)

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-assistant.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 2: Deploy to Render.com

### Option A: Deploy Using render.yaml (Recommended)

1. **Login to Render.com**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub

2. **Create New Blueprint**
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

3. **Configure Services**
   
   **Backend API Service:**
   - Name: `ai-assistant-api`
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`
   
   **Frontend Service:**
   - Name: `ai-assistant-frontend`
   - Environment: Static Site
   - Build Command: `cd react-app && npm install && npm run build`
   - Publish Directory: `react-app/build`

4. **Set Environment Variables**
   
   For `ai-assistant-api`:
   ```
   GEMINI_API_KEY = AIzaSyDLMefj6yMHr_odtzNY-FThA-IHUewxaCk
   PYTHON_VERSION = 3.11.0
   PORT = 10000
   ```
   
   For `ai-assistant-frontend`:
   ```
   REACT_APP_API_URL = https://ai-assistant-api.onrender.com
   ```
   
   **Note:** Replace `ai-assistant-api` with your actual backend service URL from Render

5. **Deploy**
   - Click **"Apply"**
   - Render will start building and deploying both services
   - Wait 5-10 minutes for first deployment

### Option B: Manual Service Creation

If you prefer manual setup:

#### Backend API:
1. New + → Web Service
2. Connect GitHub repo
3. Configure:
   - Name: `ai-assistant-api`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`
   - Add environment variables (see above)

#### Frontend:
1. New + → Static Site
2. Connect same GitHub repo
3. Configure:
   - Name: `ai-assistant-frontend`
   - Build Command: `cd react-app && npm install && npm run build`
   - Publish Directory: `react-app/build`
   - Add environment variable: `REACT_APP_API_URL`

---

## 🔄 Step 3: Enable Auto-Deploy

**Auto-deploy is AUTOMATIC** when you connect GitHub to Render!

### How it works:
1. You push code to GitHub
2. GitHub webhook notifies Render
3. Render automatically rebuilds and redeploys
4. New version is live in 5-10 minutes

### Configure Auto-Deploy Settings:
1. Go to your service in Render dashboard
2. **Settings** → **Build & Deploy**
3. Ensure **"Auto-Deploy"** is **ON**
4. Set branch to `main` (or your default branch)

### Test Auto-Deploy:
```bash
# Make a small change
echo "# Updated" >> README.md
git add .
git commit -m "Test auto-deploy"
git push origin main
```

Watch your Render dashboard - deployment will start automatically!

---

## 📝 Step 4: Update API URL After Deployment

After your backend deploys, Render will give you a URL like:
```
https://ai-assistant-api.onrender.com
```

### Update Frontend Environment Variable:
1. Go to `ai-assistant-frontend` service
2. **Environment** tab
3. Update `REACT_APP_API_URL` with your actual backend URL
4. Save and redeploy

---

## ✅ Step 5: Verify Deployment

### Check Backend:
Visit: `https://ai-assistant-api.onrender.com`

Should see:
```json
{
  "status": "running",
  "message": "Flask API running...",
  "api_key_configured": true
}
```

### Check Frontend:
Visit: `https://ai-assistant-frontend.onrender.com`

Should see your full React UI!

---

## 🔧 Troubleshooting

### Backend Issues:

**API Key Not Working:**
- Verify environment variable is set correctly
- No quotes around the key
- Restart service after adding variables

**Build Fails:**
```bash
# Check requirements.txt is present
# Check Python version (3.11.0)
# Check gunicorn is in requirements.txt
```

**Service Won't Start:**
- Check logs in Render dashboard
- Verify start command: `gunicorn app:app --bind 0.0.0.0:$PORT`
- Ensure Flask app is named `app` in `app.py`

### Frontend Issues:

**Build Fails:**
```bash
# Verify package.json exists in react-app/
# Check Node version compatibility
# Clear cache and rebuild
```

**API Calls Failing:**
- Check CORS settings in Flask app (already configured)
- Verify `REACT_APP_API_URL` points to backend URL
- Check browser console for errors

**404 on Refresh:**
- Ensure `routes` section in render.yaml redirects to index.html
- This is already configured in our render.yaml

---

## 🚀 Deployment Workflow

```
┌─────────────────┐
│  Local Changes  │
└────────┬────────┘
         │ git push
         ▼
┌─────────────────┐
│     GitHub      │
└────────┬────────┘
         │ webhook
         ▼
┌─────────────────┐
│   Render.com    │
│                 │
│  Auto-Deploy:   │
│  ✓ Build        │
│  ✓ Test         │
│  ✓ Deploy       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   LIVE APP! 🎉  │
└─────────────────┘
```

---

## 💡 Pro Tips

### Faster Deployments:
1. Use Render's paid plan (faster builds)
2. Minimize dependencies
3. Use build caching

### Better Performance:
1. Enable CDN for static assets
2. Use Redis for session management
3. Optimize images before upload

### Security:
1. **Never commit API keys to Git**
2. Use Render's secret files for sensitive data
3. Enable HTTPS (automatic on Render)
4. Rotate API keys regularly

### Monitoring:
1. Check Render dashboard for deployment status
2. Monitor logs for errors
3. Set up email alerts for failed deploys
4. Use health check endpoints

---

## 📦 Project Structure

```
ai-assistant/
├── app.py                  # Flask backend
├── requirements.txt        # Python dependencies
├── render.yaml            # Render configuration
├── Procfile              # Process configuration
├── runtime.txt           # Python version
├── .gitignore           # Git ignore rules
├── react-app/           # Frontend application
│   ├── package.json
│   ├── public/
│   ├── src/
│   └── build/          # Production build (generated)
└── uploads/            # Temporary file uploads
```

---

## 🎯 Quick Commands Reference

### Local Development:
```bash
# Backend (Flask)
python app.py

# Frontend (React)
cd react-app
npm start
```

### Git Workflow:
```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "Your message"

# Push (triggers auto-deploy)
git push origin main
```

### Render CLI (Optional):
```bash
# Install
npm install -g render-cli

# Login
render login

# List services
render services list

# View logs
render logs -s ai-assistant-api
```

---

## 🔗 Important URLs

After deployment, save these URLs:

- **Frontend:** `https://ai-assistant-frontend.onrender.com`
- **Backend API:** `https://ai-assistant-api.onrender.com`
- **GitHub Repo:** `https://github.com/YOUR_USERNAME/ai-assistant`
- **Render Dashboard:** `https://dashboard.render.com`

---

## 📞 Support

### Render.com:
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### GitHub:
- Documentation: https://docs.github.com
- Support: https://support.github.com

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Backend service created and deployed
- [ ] Frontend service created and deployed
- [ ] Environment variables configured
- [ ] API key added to backend
- [ ] Backend URL updated in frontend
- [ ] Auto-deploy enabled
- [ ] Services are healthy (green status)
- [ ] Frontend loads correctly
- [ ] API calls work end-to-end
- [ ] Test all features (upload, analyze, chat)
- [ ] Custom domain added (optional)

---

## 🎉 You're Live!

Once deployed, your app will be accessible at:
`https://your-app-name.onrender.com`

Every time you push to GitHub, Render will automatically deploy the changes!

**Happy Coding! 🚀**
