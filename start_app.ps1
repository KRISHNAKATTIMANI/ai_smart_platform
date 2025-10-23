# Start the Flask Application
Write-Host "Starting AI Assistant Web App..." -ForegroundColor Green

# Set environment variable
$env:GEMINI_API_KEY = 'AIzaSyBrapRjYmJIzjBrcqlffo_yxum5i6WEQWI'

# Change to project directory
Set-Location B:\gemini

# Activate virtual environment and start server
& B:/gemini/.venv/Scripts/python.exe app.py
