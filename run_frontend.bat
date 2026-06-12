@echo off
echo ===================================================
echo   Find My Shop - Frontend Dependency Installer & Runner
echo ===================================================
echo.
echo Installing React.js frontend libraries (react, vite, lucide-react, etc.)...
echo Please wait, this may take a moment depending on your network connection...
echo.
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Installation failed! Please check your internet connection.
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo ===================================================
echo   Starting Vite React.js Frontend on Port 5173...
echo ===================================================
echo.
call npm run dev
pause
