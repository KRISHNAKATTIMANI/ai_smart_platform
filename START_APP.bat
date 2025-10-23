@echo off
echo ========================================
echo   AI Assistant - Quick Start
echo ========================================
echo.

cd /d B:\gemini

echo Setting up environment...
set GEMINI_API_KEY=AIzaSyBrapRjYmJIzjBrcqlffo_yxum5i6WEQWI

echo Starting Flask server...
echo.
echo Application will be available at:
echo   http://localhost:5000
echo.
echo Press CTRL+C to stop the server
echo ========================================
echo.

B:\gemini\.venv\Scripts\python.exe app.py

pause
