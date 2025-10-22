@echo off
echo ========================================
echo   AI Platform React Frontend Setup
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [OK] npm is installed
npm --version
echo.

echo Installing React dependencies...
echo.

:: Navigate to react-app directory
cd react-app

:: Install dependencies
call npm install

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Installation Complete!
    echo ========================================
    echo.
    echo Next Steps:
    echo.
    echo 1. Start Flask Backend:
    echo    cd ..
    echo    python app.py
    echo.
    echo 2. Start React Frontend (in new terminal):
    echo    cd react-app
    echo    npm start
    echo.
    echo 3. Open Browser:
    echo    http://localhost:3000
    echo.
    echo ========================================
    echo.
    
    set /p start="Do you want to start the React development server now? (y/n): "
    if /i "%start%"=="y" (
        echo.
        echo Starting React development server...
        echo The app will open in your browser at http://localhost:3000
        echo.
        echo Press Ctrl+C to stop the server
        echo.
        call npm start
    )
) else (
    echo.
    echo [ERROR] Installation failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

pause
