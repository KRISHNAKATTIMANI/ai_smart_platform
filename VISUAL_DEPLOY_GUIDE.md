# 📸 Visual Setup Guide - Render.com Deployment

## 🎯 Step-by-Step with Screenshots Reference

This guide shows you exactly what to click and where on Render.com.

---

## Part 1: GitHub Setup

### Step 1.1: Push Your Code
```powershell
# Open PowerShell in your project folder (b:\gemini)
cd b:\gemini

# Check what will be committed
git status

# Add all files
git add .

# Commit with a message
git commit -m "Initial deployment to Render.com"

# Push to GitHub
git push origin main
```

**What you should see:**
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), XXX KB | XXX KB/s, done.
Total XX (delta X), reused X (delta X)
To https://github.com/YOUR_USERNAME/ai-assistant.git
   abc1234..def5678  main -> main
```

---

## Part 2: Render.com Setup

### Step 2.1: Login to Render

**URL:** https://render.com

**Click:** "Get Started" or "Login"
**Select:** "Sign in with GitHub"

**Result:** You'll be redirected to GitHub to authorize Render

---

### Step 2.2: Authorize Render

**On GitHub Authorization Page:**
- ✅ Review permissions (read repositories, deploy)
- ✅ Click "Authorize Render"

**Result:** Redirected back to Render dashboard

---

### Step 2.3: Create New Blueprint

**On Render Dashboard:**

1. **Click:** Blue "New +" button (top right)
2. **Select:** "Blueprint" from dropdown

**What is a Blueprint?**
A Blueprint automatically creates multiple services from your `render.yaml` file.

---

### Step 2.4: Connect Repository

**On "Create a new Blueprint" page:**

**If first time:**
- Click "Connect GitHub"
- Authorize Render to access your repositories

**Select Repository:**
- 🔍 Search for: `ai-assistant` (or your repo name)
- ✅ Click on your repository
- ✅ Click "Connect"

---

### Step 2.5: Configure Blueprint

**Render detects `render.yaml` automatically**

**You'll see:**
```
✓ render.yaml found
✓ 2 services detected:
  - ai-assistant-api (Web Service - Python)
  - ai-assistant-frontend (Static Site)
```

**What you see:**

| Service Name               | Type         | Region | Plan |
|---------------------------|--------------|--------|------|
| ai-assistant-api          | Web Service  | Oregon | Free |
| ai-assistant-frontend     | Static Site  | Oregon | Free |

**Review Settings:**
- ✅ Service names look good
- ✅ Plan is "Free" for both
- ✅ Region selected (Oregon recommended)

**Click:** "Apply" button (blue, bottom right)

---

### Step 2.6: Add Environment Variables

**IMPORTANT:** Before deployment starts, add environment variables!

#### For Backend Service (ai-assistant-api):

1. **Find the service** in the list
2. **Click:** "ai-assistant-api"
3. **Go to:** "Environment" tab (left sidebar)
4. **Click:** "Add Environment Variable"

**Add these variables:**

| Key                | Value                                          |
|-------------------|------------------------------------------------|
| `GEMINI_API_KEY`  | `AIzaSyDLMefj6yMHr_odtzNY-FThA-IHUewxaCk`    |
| `PYTHON_VERSION`  | `3.11.0`                                       |

**Important:**
- ⚠️ NO quotes around values
- ⚠️ NO spaces before/after
- ⚠️ Copy-paste the API key exactly

**Click:** "Save Changes"

---

#### For Frontend Service (ai-assistant-frontend):

**WAIT!** First, let backend deploy and get its URL.

**After backend deploys:**
1. Copy the backend URL (looks like: `https://ai-assistant-api.onrender.com`)
2. Go to frontend service settings
3. Add environment variable:

| Key                    | Value                                    |
|-----------------------|------------------------------------------|
| `REACT_APP_API_URL`   | `https://ai-assistant-api.onrender.com` |

*(Use your actual backend URL)*

**Click:** "Save Changes"

---

### Step 2.7: Watch Deployment

**You'll see the deployment log in real-time:**

```
==> Building... 
==> Downloading cached dependencies
==> Installing dependencies from requirements.txt
==> Collecting Flask==3.0.0
==> Collecting google-generativeai
==> Successfully installed Flask-3.0.0 ...
==> Build successful! 
==> Deploying...
==> Health check passed
==> Live at https://ai-assistant-api.onrender.com
```

**Timeline:**
- ⏱️ Backend: 3-7 minutes
- ⏱️ Frontend: 2-5 minutes

**Status Indicators:**
- 🔵 **Building** - Installing dependencies
- 🟡 **Deploying** - Starting services
- 🟢 **Live** - Successfully deployed!
- 🔴 **Failed** - Check logs for errors

---

## Part 3: Verify Deployment

### Step 3.1: Test Backend API

**Copy your backend URL** from Render dashboard.

**Visit in browser:**
```
https://ai-assistant-api.onrender.com
```

**Expected Response:**
```json
{
  "status": "running",
  "message": "Flask API running. Visit http://localhost:3000 for UI.",
  "api_key_configured": true,
  "endpoints": [...]
}
```

**If you see this:** ✅ Backend is working!

---

### Step 3.2: Test Frontend

**Visit your frontend URL:**
```
https://ai-assistant-frontend.onrender.com
```

**You should see:**
- ✅ Your React app homepage
- ✅ Navigation bar
- ✅ All page links work

**If you see this:** ✅ Frontend is working!

---

### Step 3.3: Test Full Integration

**On your deployed frontend:**

1. **Go to:** "Text to Text" page
2. **Type:** "Hello, how are you?"
3. **Click:** "Send" or "Generate"

**Expected:**
- ✅ AI response appears
- ✅ No errors in browser console (F12)

**If this works:** 🎉 Full deployment successful!

---

## Part 4: Enable Auto-Deploy

### Step 4.1: Check Auto-Deploy Status

**For each service:**

1. **Go to:** Service dashboard
2. **Click:** "Settings" (left sidebar)
3. **Find:** "Build & Deploy" section
4. **Verify:** "Auto-Deploy" is **ON** (should be by default)

**Settings should show:**
```
Auto-Deploy: ON
Branch: main
Deploy Hook: https://api.render.com/deploy/srv-xxx...
```

---

### Step 4.2: Test Auto-Deploy

**On your local machine:**

```powershell
# Make a small change
echo "# Test auto-deploy" >> README.md

# Commit and push
git add README.md
git commit -m "Test auto-deploy"
git push origin main
```

**Watch Render Dashboard:**
- ⏱️ Within 10-30 seconds, you should see:
  - "Building" status
  - New deployment starting
  - Logs streaming

**If deployment starts automatically:** ✅ Auto-deploy is working!

---

## Part 5: Troubleshooting Visual Guide

### Issue: Build Fails

**What you see:**
```
🔴 Build failed
==> Error: Could not find requirements.txt
```

**Where to look:**
1. Click on the failed deployment
2. Read the full log
3. Find the error line (usually in red)

**Common fixes:**
- Missing file → Check GitHub repo
- Wrong path → Check build command
- Dependency error → Check requirements.txt

**How to fix:**
1. Fix locally
2. Commit and push
3. Render auto-deploys with fix

---

### Issue: API Key Not Working

**What you see in logs:**
```
GEMINI_API_KEY not configured
```

**Where to check:**
1. Service → "Environment" tab
2. Verify `GEMINI_API_KEY` exists
3. Check value (no quotes, no spaces)

**How to fix:**
1. Add/update the environment variable
2. Click "Save Changes"
3. Render will automatically redeploy

---

### Issue: Frontend Can't Connect to Backend

**What you see:**
- Frontend loads
- API calls fail
- Console error: "Failed to fetch"

**Where to check:**
1. Frontend service → "Environment" tab
2. Check `REACT_APP_API_URL` value
3. Should match backend URL exactly

**How to fix:**
1. Copy exact backend URL
2. Update frontend environment variable
3. Manual redeploy: Dashboard → "Manual Deploy" → "Deploy latest commit"

---

## Part 6: Dashboard Navigation

### Main Dashboard

**URL:** https://dashboard.render.com

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ Render Logo    [Search]              [New +]  [👤] │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Services                                            │
│  ┌──────────────────────────────────────────────┐  │
│  │ 🟢 ai-assistant-api          Web Service     │  │
│  │    https://ai-assistant-api.onrender.com    │  │
│  │    Last deploy: 5 minutes ago                │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ 🟢 ai-assistant-frontend     Static Site     │  │
│  │    https://ai-assistant-frontend...         │  │
│  │    Last deploy: 5 minutes ago                │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

### Service Detail View

**Click on a service to see:**

**Left Sidebar:**
- 📊 Overview (default)
- 📝 Logs
- ⚙️ Environment
- 🔧 Settings
- 📈 Metrics
- 🚀 Deploys

**Main Area:**
- Service URL (clickable)
- Health status
- Last deployment info
- Quick actions

---

### Logs View

**Most important for debugging!**

**What you see:**
```
2024-10-22 10:30:15 Starting service...
2024-10-22 10:30:16 Installing dependencies
2024-10-22 10:30:45 Build successful
2024-10-22 10:30:46 Service is live
2024-10-22 10:31:00 GET / - 200 OK
2024-10-22 10:31:05 POST /api/chat - 200 OK
```

**Features:**
- 🔍 Search logs
- ⏸️ Pause auto-scroll
- 📥 Download logs
- 🔄 Real-time updates

---

## Part 7: Final Checklist

### ✅ Deployment Complete When:

- [ ] Both services show 🟢 "Live" status
- [ ] Backend URL returns JSON response
- [ ] Frontend URL loads your React app
- [ ] AI features work end-to-end
- [ ] No errors in logs
- [ ] Auto-deploy is enabled
- [ ] Environment variables are set
- [ ] First test deployment worked

---

## Part 8: Next Steps

### After Successful Deployment:

1. **Save Your URLs:**
   - Backend: `https://ai-assistant-api.onrender.com`
   - Frontend: `https://ai-assistant-frontend.onrender.com`

2. **Share Your App:**
   - Send frontend URL to users
   - Add to your portfolio
   - Share on social media

3. **Monitor Performance:**
   - Check logs regularly
   - Watch for errors
   - Monitor usage

4. **Keep Developing:**
   - Make local changes
   - Push to GitHub
   - Render auto-deploys! 🚀

---

## 🎉 Congratulations!

You've successfully deployed your AI Assistant to Render.com with auto-deploy!

**Every time you push to GitHub, Render automatically deploys the latest version.** ✨

---

## Quick Reference Card

```
┌──────────────────────────────────────────────────┐
│           RENDER.COM QUICK REFERENCE              │
├──────────────────────────────────────────────────┤
│                                                   │
│ Dashboard:  https://dashboard.render.com         │
│                                                   │
│ Your Services:                                    │
│ • Backend:  ai-assistant-api                     │
│ • Frontend: ai-assistant-frontend                │
│                                                   │
│ Deploy:     git push origin main (automatic!)    │
│                                                   │
│ Logs:       Dashboard → Service → Logs           │
│                                                   │
│ Settings:   Dashboard → Service → Settings       │
│                                                   │
│ Support:    https://render.com/docs              │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

**Happy Deploying! 🚀**
