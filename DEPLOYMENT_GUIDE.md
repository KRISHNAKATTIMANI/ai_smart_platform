# 🚀 Deployment Guide - AI Assistant

## ✅ Deployment Files Added

Your repository now includes everything needed for deployment:

- ✅ `Procfile` - Tells deployment platform how to run the app
- ✅ `runtime.txt` - Specifies Python version
- ✅ `render.yaml` - Render.com configuration
- ✅ `requirements.txt` - All dependencies including gunicorn

---

## 🌐 Deploy to Render.com (Recommended - Free Tier Available)

### Step 1: Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub (easiest option)
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `dayanandaks4/image-to-text`
3. Render will auto-detect the configuration from `render.yaml`

### Step 3: Configure Environment Variables
**Important:** Add your API key
- Key: `GEMINI_API_KEY`
- Value: Your Gemini API key

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Render will:
   - Install dependencies
   - Build the application
   - Deploy to a live URL
3. Wait 2-3 minutes for deployment

### Step 5: Get Your Live URL
You'll get a URL like: `https://your-app-name.onrender.com`

---

## 🔧 Manual Deployment (If Auto-Detect Fails)

If Render doesn't auto-detect, configure manually:

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn app:app
```

**Environment Variables:**
- `GEMINI_API_KEY` = your_api_key_here

---

## 🌍 Alternative Deployment Options

### Option 2: Railway.app
1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select `dayanandaks4/image-to-text`
5. Add `GEMINI_API_KEY` environment variable
6. Deploy!

### Option 3: Heroku
1. Install Heroku CLI
2. Run:
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set GEMINI_API_KEY=your_key
```

### Option 4: Google Cloud Run
1. Install Google Cloud SDK
2. Run:
```bash
gcloud run deploy --source .
```

### Option 5: AWS Elastic Beanstalk
1. Install AWS CLI and EB CLI
2. Run:
```bash
eb init -p python-3.11 ai-assistant
eb create ai-assistant-env
eb deploy
```

---

## ⚙️ Render Configuration Explained

### render.yaml
```yaml
services:
  - type: web                    # Web service type
    name: ai-assistant           # Your app name
    env: python                  # Python environment
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: GEMINI_API_KEY     # Environment variable
        sync: false             # Don't sync (for security)
```

### Procfile
```
web: gunicorn app:app
```
- Tells platform to run gunicorn
- `app:app` means `app.py` file, `app` Flask instance

### runtime.txt
```
python-3.11.0
```
- Specifies Python version
- Ensures compatibility

---

## 🔒 Security Best Practices

### Environment Variables
✅ **Always use environment variables for API keys**
❌ **Never hardcode API keys in code**

### In Production:
- Set `debug=False` in app.py (already done for production)
- Use HTTPS (automatic on Render/Railway)
- Keep dependencies updated

---

## 🐛 Troubleshooting Deployment

### Error: "gunicorn: command not found"
**Fix:** Already fixed! Added gunicorn to requirements.txt

### Error: "Failed to bind to port"
**Fix:** Make sure app.py uses `PORT` environment variable:
```python
port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port=port)
```

### Error: "Module not found"
**Fix:** Check all dependencies in requirements.txt
```bash
pip freeze > requirements.txt
```

### Error: "Application timeout"
**Fix:** Increase timeout in Render settings or add to render.yaml:
```yaml
healthCheckPath: /
```

---

## 📊 Free Tier Limits

### Render.com Free Tier:
- ✅ 750 hours/month
- ✅ 512MB RAM
- ✅ Automatic HTTPS
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Cold starts ~30 seconds

### Railway.app Free Tier:
- ✅ $5 free credit/month
- ✅ 512MB RAM
- ✅ Custom domains

---

## 🎯 Post-Deployment Checklist

After deployment:
- ✅ Test file upload
- ✅ Test image analysis
- ✅ Test PDF download
- ✅ Test chat history
- ✅ Check mobile responsiveness
- ✅ Monitor error logs

---

## 📈 Monitoring

### On Render:
1. Go to your service dashboard
2. Check "Logs" tab for errors
3. Monitor "Metrics" for usage

### Log Common Issues:
```python
import logging
logging.basicConfig(level=logging.INFO)
```

---

## 🔄 Updating Your Deployed App

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push
```

Render/Railway will auto-deploy from GitHub!

---

## 💡 Pro Tips

1. **Use GitHub Actions** for CI/CD
2. **Add health check endpoint** in app.py:
```python
@app.route('/health')
def health():
    return {'status': 'healthy'}, 200
```

3. **Enable auto-deploy** on push to main branch
4. **Set up custom domain** (available on all platforms)
5. **Use Redis** for session storage (optional)

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **Heroku Docs**: https://devcenter.heroku.com

---

## 🎉 Your App is Ready!

**Your GitHub Repo:** https://github.com/dayanandaks4/image-to-text

**Ready to deploy:** All configuration files committed and pushed!

**Next:** Go to Render.com and deploy in 3 clicks! 🚀
