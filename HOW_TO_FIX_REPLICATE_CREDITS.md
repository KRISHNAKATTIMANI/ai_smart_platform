# How to Fix Replicate Credit Error

## Problem
Error: "Insufficient credit status: 402 - You have insufficient credit to run this model"

## This Means
Your Replicate account needs a payment method added to use the AI upscaling feature.

---

## ✅ Solution: Add Payment Method (5 minutes)

### Step 1: Go to Replicate Billing
Visit: https://replicate.com/account/billing

### Step 2: Sign In
- Use your existing Replicate account
- Or create a new free account

### Step 3: Add Payment Method
- Click "Add payment method"
- Enter your credit card details
- You won't be charged until you use the service

### Step 4: Try Again
- Return to your app
- Upload an image
- Click "Enhance Image"
- It should now work!

---

## 💰 Cost Information

### Pricing
- **Real-ESRGAN (2x upscale):** ~$0.001-0.002 per image
- **Real-ESRGAN (4x upscale):** ~$0.003-0.01 per image
- **GFPGAN (face enhance):** ~$0.001-0.005 per image

### Example Costs
- 100 images at 2x: ~$0.10-0.20
- 100 images at 4x: ~$0.30-1.00
- Very affordable for typical use!

### Free Tier
- New accounts get **$5 free credits**
- Enough for 500-5000 image enhancements

---

## 🔄 Alternative Solutions

### Option 1: Use Different API Key
If you have another Replicate account with credits:

1. Get your API key from: https://replicate.com/account/api-tokens
2. Update in `app.py` line 54:
   ```python
   REPLICATE_API_KEY = "your_new_api_key_here"
   ```
3. Restart the backend server

### Option 2: Disable Feature Temporarily
If you don't want to add payment:

1. Comment out the Image Enhancement page
2. Or use a simpler, local enhancement method
3. Focus on other features that don't require Replicate

### Option 3: Use Free Alternative
Consider these free alternatives:
- **waifu2x** - Free anime/photo upscaling
- **OpenCV** - Basic local upscaling
- **Pillow** - Python image library for basic enhancement

---

## 🎯 Quick Fix Command

To use a different Replicate API key:

```bash
# Get your API key from https://replicate.com/account/api-tokens
# Then update app.py line 54
```

Or set it as environment variable:
```powershell
$env:REPLICATE_API_TOKEN = "your_api_key_here"
```

---

## ✅ Recommended Action

**Add payment method to Replicate** - It's the easiest solution:
- ✅ Instant activation
- ✅ $5 free credits
- ✅ Pay only for what you use
- ✅ Very low cost per image
- ✅ High quality results

Visit: https://replicate.com/account/billing

---

## 📝 After Adding Payment

The error handling I just added will show you:
- ✅ Clear error messages
- ✅ Link to billing page
- ✅ Instructions on what to do
- ✅ Cost information

The React app will automatically reload with these improvements!

---

## 🆘 Still Having Issues?

1. **Check your Replicate account balance**
   - Visit: https://replicate.com/account
   - Ensure payment method is active

2. **Verify API key is correct**
   - Check `app.py` line 54
   - Get new key: https://replicate.com/account/api-tokens

3. **Restart servers**
   - Close both PowerShell windows
   - Start again with updated settings

4. **Check Replicate status**
   - Visit: https://status.replicate.com
   - Ensure service is operational

---

**Bottom Line:** Add a payment method to Replicate (free $5 credits) and you're good to go! 🚀
