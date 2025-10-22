# Quick Deploy to Render.com
# Run this after setting up Render.com services

Write-Host "🚀 Render.com Deployment Helper" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Step 1: Check Git Status
Write-Host "📋 Step 1: Checking Git Status..." -ForegroundColor Yellow
git status

Write-Host "`n"

# Step 2: Commit Changes
$commit = Read-Host "Do you want to commit current changes? (y/n)"
if ($commit -eq "y") {
    $message = Read-Host "Enter commit message"
    git add .
    git commit -m "$message"
    Write-Host "✅ Changes committed!" -ForegroundColor Green
}

Write-Host "`n"

# Step 3: Push to GitHub
$push = Read-Host "Push to GitHub? This will trigger auto-deploy on Render (y/n)"
if ($push -eq "y") {
    git push origin main
    Write-Host "✅ Pushed to GitHub! Render will auto-deploy..." -ForegroundColor Green
    Write-Host "`n⏳ Check your Render dashboard for deployment status" -ForegroundColor Cyan
    Write-Host "   https://dashboard.render.com`n" -ForegroundColor Blue
}

Write-Host "`n"

# Step 4: Show URLs
Write-Host "🔗 Your App URLs:" -ForegroundColor Yellow
Write-Host "   Backend API: https://ai-assistant-api.onrender.com" -ForegroundColor Blue
Write-Host "   Frontend: https://ai-assistant-frontend.onrender.com`n" -ForegroundColor Blue

# Step 5: Environment Variables Reminder
Write-Host "⚙️  Environment Variables Required:" -ForegroundColor Yellow
Write-Host "   Backend Service:" -ForegroundColor White
Write-Host "   - GEMINI_API_KEY = AIzaSyDLMefj6yMHr_odtzNY-FThA-IHUewxaCk" -ForegroundColor Gray
Write-Host "   - PYTHON_VERSION = 3.11.0" -ForegroundColor Gray
Write-Host "   - PORT = 10000`n" -ForegroundColor Gray

Write-Host "   Frontend Service:" -ForegroundColor White
Write-Host "   - REACT_APP_API_URL = https://ai-assistant-api.onrender.com`n" -ForegroundColor Gray

Write-Host "✅ Done! Check Render dashboard for deployment status" -ForegroundColor Green
