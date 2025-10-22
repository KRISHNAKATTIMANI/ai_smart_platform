# ✅ Render.com Deployment Checklist

## Before You Start
- [ ] GitHub account created
- [ ] Render.com account created (free tier is fine)
- [ ] Gemini API Key ready: `AIzaSyDLMefj6yMHr_odtzNY-FThA-IHUewxaCk`

---

## 📦 Step 1: Prepare Code

- [x] `render.yaml` configured with both backend and frontend services
- [x] `requirements.txt` includes all Python dependencies
- [x] `Procfile` configured for gunicorn
- [x] `.gitignore` prevents sensitive files from being committed
- [x] React app configured with environment variables
- [x] API URL configuration updated for production
- [ ] All code tested locally

---

## 🐙 Step 2: Push to GitHub

```powershell
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Render deployment"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-assistant.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Checklist:**
- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] All files visible on GitHub (except .gitignore items)

---

## 🌐 Step 3: Deploy on Render.com

### 3.1 Connect GitHub
- [ ] Login to [Render.com](https://render.com)
- [ ] Connect GitHub account
- [ ] Authorize Render to access your repositories

### 3.2 Create Blueprint
- [ ] Click **"New +"** → **"Blueprint"**
- [ ] Select your repository: `ai-assistant`
- [ ] Render detects `render.yaml`
- [ ] Click **"Apply"**

### 3.3 Configure Backend Service
Service name: `ai-assistant-api`

**Environment Variables:**
- [ ] `GEMINI_API_KEY` = `AIzaSyDLMefj6yMHr_odtzNY-FThA-IHUewxaCk`
- [ ] `PYTHON_VERSION` = `3.11.0`
- [ ] `PORT` = `10000` (auto-set by Render)

**Settings:**
- [ ] Region: Oregon (or closest to you)
- [ ] Plan: Free
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`

### 3.4 Configure Frontend Service
Service name: `ai-assistant-frontend`

**Get Backend URL First:**
- [ ] Wait for backend to deploy
- [ ] Copy backend URL: `https://ai-assistant-api.onrender.com`

**Environment Variables:**
- [ ] `REACT_APP_API_URL` = `https://ai-assistant-api.onrender.com`
  *(Use your actual backend URL)*

**Settings:**
- [ ] Type: Static Site
- [ ] Build Command: `cd react-app && npm install && npm run build`
- [ ] Publish Directory: `react-app/build`

---

## 🔄 Step 4: Enable Auto-Deploy

- [ ] Go to each service in Render dashboard
- [ ] **Settings** → **Build & Deploy**
- [ ] Verify **Auto-Deploy** is **ON**
- [ ] Branch: `main`

**Test Auto-Deploy:**
```powershell
# Make a small change
echo "# Test" >> README.md
git add .
git commit -m "Test auto-deploy"
git push origin main
```
- [ ] Check Render dashboard - should start deploying automatically

---

## ✅ Step 5: Verify Deployment

### Backend Health Check
- [ ] Visit: `https://ai-assistant-api.onrender.com`
- [ ] Should see JSON response:
  ```json
  {
    "status": "running",
    "message": "Flask API running...",
    "api_key_configured": true
  }
  ```

### Frontend Check
- [ ] Visit: `https://ai-assistant-frontend.onrender.com`
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] All pages accessible

### Full Integration Test
- [ ] Text to Text works
- [ ] Image to Text works (upload image)
- [ ] File upload functions correctly
- [ ] AI responses are generated
- [ ] Download PDF works
- [ ] No console errors in browser

---

## 🐛 Troubleshooting

### Backend Issues

**Build Fails:**
- [ ] Check `requirements.txt` is present and valid
- [ ] Verify Python version is 3.11.0
- [ ] Check Render logs for specific error
- [ ] Ensure gunicorn is in requirements.txt

**API Key Error:**
- [ ] Verify `GEMINI_API_KEY` is set in Render dashboard
- [ ] No quotes around the key
- [ ] No extra spaces
- [ ] Restart service after setting

**Service Won't Start:**
- [ ] Check start command: `gunicorn app:app --bind 0.0.0.0:$PORT`
- [ ] Verify `app.py` has Flask app named `app`
- [ ] Check logs for Python errors

### Frontend Issues

**Build Fails:**
- [ ] Check `package.json` exists in `react-app/`
- [ ] Verify all dependencies are listed
- [ ] Check build command: `cd react-app && npm install && npm run build`
- [ ] Try building locally first

**Can't Connect to Backend:**
- [ ] Verify `REACT_APP_API_URL` is set correctly
- [ ] URL should be: `https://ai-assistant-api.onrender.com` (your actual URL)
- [ ] Rebuild frontend after setting environment variable
- [ ] Check browser console for CORS errors

**404 Errors:**
- [ ] Verify publish directory is `react-app/build`
- [ ] Check build completed successfully
- [ ] Ensure SPA routing is configured in render.yaml

### Performance Issues

**Slow First Load:**
- [ ] Normal on free tier - services spin down after inactivity
- [ ] First request takes 30-60 seconds
- [ ] Subsequent requests are fast

**Keep Services Awake (Optional):**
- [ ] Use UptimeRobot or similar to ping every 5 minutes
- [ ] Upgrade to paid plan for always-on services

---

## 📝 Post-Deployment

### Update Documentation
- [ ] Update README with live URLs
- [ ] Document any custom configuration
- [ ] Add deployment date

### Monitor
- [ ] Check Render dashboard regularly
- [ ] Review logs for errors
- [ ] Monitor API usage
- [ ] Set up email alerts in Render

### Security
- [ ] Never commit `.env` files to Git
- [ ] Rotate API keys periodically
- [ ] Use Render secret files for sensitive data
- [ ] Enable HTTPS (automatic on Render)

### Custom Domain (Optional)
- [ ] Purchase domain
- [ ] Add CNAME record
- [ ] Configure in Render dashboard
- [ ] Wait for SSL certificate

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Backend API responds at `https://ai-assistant-api.onrender.com`
- ✅ Frontend loads at `https://ai-assistant-frontend.onrender.com`
- ✅ All features work (upload, analyze, chat, download)
- ✅ No errors in browser console
- ✅ Auto-deploy works on `git push`
- ✅ Services stay running (green status in Render)

---

## 📚 Resources

- **Render Docs:** https://render.com/docs
- **Flask Deployment:** https://render.com/docs/deploy-flask
- **Static Sites:** https://render.com/docs/static-sites
- **Environment Variables:** https://render.com/docs/environment-variables
- **Auto-Deploy:** https://render.com/docs/deploys

---

## 🆘 Need Help?

1. Check [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed guide
2. Review Render logs in dashboard
3. Search Render community forum
4. Check GitHub Issues
5. Contact Render support

---

## 🚀 You're Ready!

Once all items are checked, your app will be live and automatically deploy on every push to GitHub!

**Happy Deploying! 🎉**
