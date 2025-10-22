# AI Platform React Frontend - Installation Script
# Run this script in PowerShell to set up the React frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Platform React Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing React dependencies..." -ForegroundColor Yellow
Write-Host ""

# Navigate to react-app directory
Set-Location -Path "react-app"

# Install dependencies
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ Installation Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Start Flask Backend:" -ForegroundColor Yellow
    Write-Host "   cd .." -ForegroundColor White
    Write-Host "   python app.py" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Start React Frontend (in new terminal):" -ForegroundColor Yellow
    Write-Host "   cd react-app" -ForegroundColor White
    Write-Host "   npm start" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Open Browser:" -ForegroundColor Yellow
    Write-Host "   http://localhost:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Ask if user wants to start the dev server now
    $start = Read-Host "Do you want to start the React development server now? (y/n)"
    if ($start -eq "y" -or $start -eq "Y") {
        Write-Host ""
        Write-Host "Starting React development server..." -ForegroundColor Yellow
        Write-Host "The app will open in your browser at http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
        Write-Host ""
        npm start
    }
} else {
    Write-Host ""
    Write-Host "✗ Installation failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
    exit 1
}
