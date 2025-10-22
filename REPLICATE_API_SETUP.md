# 🔑 Replicate API Setup Guide

## ⚠️ Important: Why You're Seeing Rate Limit Errors

The **Image Enhancement** feature uses Replicate's AI models, which require:
1. A Replicate account with a **payment method** added
2. Credits to process images (very affordable: ~$0.001-0.01 per image)

The error you're seeing:
```
Error 429: Your rate limit for creating predictions is reduced to 6 requests per minute 
with a burst of 1 requests until you add a payment method.
```

This means you need to set up your own Replicate API key with billing enabled.

---

## 🚀 How to Fix This (5-Minute Setup)

### Step 1: Create a Replicate Account
1. Go to [replicate.com](https://replicate.com)
2. Click **Sign Up** and create a free account
3. Verify your email address

### Step 2: Add Payment Method
1. Go to [replicate.com/account/billing](https://replicate.com/account/billing)
2. Click **Add payment method**
3. Enter your credit/debit card details
4. You'll get **$5 in free credits** to start!

### Step 3: Get Your API Token
1. Go to [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Click **Create token** or copy your existing token
3. Copy the token (starts with `r8_...`)

### Step 4: Configure Your Application

**For Local Development (Windows PowerShell):**
```powershell
# Set the environment variable
$env:REPLICATE_API_KEY = "your_token_here"

# Then run your app
cd B:\gemini
$env:GEMINI_API_KEY = "AIzaSyDLMefj6yMHr_odtzNY-FThA-IHUewxaCk"
python app.py
```

**For Permanent Setup:**
Create a `.env` file in your project root:
```env
GEMINI_API_KEY=AIzaSyDLMefj6yMHr_odtzNY-FThA-IHUewxaCk
REPLICATE_API_KEY=r8_your_actual_token_here
```

Then update your `app.py` to load from `.env` (install `python-dotenv`):
```bash
pip install python-dotenv
```

Add to the top of `app.py`:
```python
from dotenv import load_dotenv
load_dotenv()
```

---

## 💰 Pricing Information

Replicate is **very affordable**:
- **Image Enhancement (Real-ESRGAN):** ~$0.001-0.01 per image
- **4x upscaling:** ~$0.01 per image
- **2x upscaling:** ~$0.005 per image

**Example Costs:**
- Process 100 images: ~$0.50-$1.00
- Process 1000 images: ~$5-$10

Your **$5 free credit** can process approximately:
- 500-5000 images depending on settings!

---

## 🔒 Security Best Practices

### ❌ Don't Do This:
```python
# Don't hardcode API keys in your code
REPLICATE_API_KEY = "r8_abc123..."  # BAD!
```

### ✅ Do This Instead:
```python
# Use environment variables
REPLICATE_API_KEY = os.getenv('REPLICATE_API_KEY')  # GOOD!
```

**Why?** This prevents accidentally committing your API key to GitHub!

---

## 🧪 Testing Your Setup

After setting up your API key, test it:

```powershell
# Test in PowerShell
cd B:\gemini
$env:REPLICATE_API_KEY = "your_token_here"
$env:GEMINI_API_KEY = "AIzaSyDLMefj6yMHr_odtzNY-FThA-IHUewxaCk"
python -c "import os; print('Replicate Key:', 'SET' if os.getenv('REPLICATE_API_KEY') else 'NOT SET')"
```

Then try enhancing an image through the web interface at `http://localhost:3001`

---

## 🐛 Troubleshooting

### Error: "Rate limit exceeded"
- **Solution:** Your Replicate account doesn't have a payment method. Add one at [replicate.com/account/billing](https://replicate.com/account/billing)

### Error: "Insufficient credits"
- **Solution:** Add more credits to your Replicate account. They're very cheap!

### Error: "Invalid API token"
- **Solution:** Check that you copied the full token (starts with `r8_`)
- Make sure you're setting the environment variable correctly

### Key Not Being Read
```powershell
# Verify environment variable is set
$env:REPLICATE_API_KEY
# Should output your key, not blank

# Restart PowerShell if needed
```

---

## 🌐 For Deployment (Render, Heroku, etc.)

Add your Replicate API key as an environment variable:

**Render.com:**
1. Go to your service dashboard
2. Click **Environment**
3. Add new environment variable:
   - Key: `REPLICATE_API_KEY`
   - Value: `r8_your_token_here`

**Heroku:**
```bash
heroku config:set REPLICATE_API_KEY=r8_your_token_here
```

---

## 📊 Monitoring Usage

Track your Replicate usage at:
- [replicate.com/account/usage](https://replicate.com/account/usage)
- See detailed costs per prediction
- Set up billing alerts

---

## ✅ Quick Start Command

Run this complete setup in one go:

```powershell
# Windows PowerShell - Complete Setup
cd B:\gemini

# Set both API keys
$env:GEMINI_API_KEY = "AIzaSyDLMefj6yMHr_odtzNY-FThA-IHUewxaCk"
$env:REPLICATE_API_KEY = "r8_YOUR_TOKEN_HERE"

# Start backend
python app.py

# In another terminal, start frontend:
cd B:\gemini\react-app
npm start
```

---

## 📚 Additional Resources

- [Replicate Documentation](https://replicate.com/docs)
- [Real-ESRGAN Model Page](https://replicate.com/nightmareai/real-esrgan)
- [Replicate Pricing](https://replicate.com/pricing)
- [API Reference](https://replicate.com/docs/reference/http)

---

## 💡 Alternative: Use Without Payment Method

If you don't want to add a payment method right now, you can:
1. **Wait 1 minute** between enhancement requests (free tier limit)
2. Use other features that don't require Replicate (text-to-text, image analysis, etc.)
3. Come back later when ready to add payment

The default key in the code will work but has strict rate limits (6 requests/minute, burst of 1).

---

Need help? Check the error message in your browser console or backend terminal for specific details!
