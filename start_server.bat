@echo off
title Maxim Agri IT Support Desk Server
:: ================================================
:: Maxim Agri IT Ticket System - Start Server
:: ================================================
echo.
echo  =============================================
echo   Maxim Agri IT Service Desk - Server Startup
echo  =============================================
echo.

cd /d "%~dp0"

echo  Checking Node.js environment...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not found in PATH. Please install Node.js.
    pause
    exit /b 1
)

echo  Local Network IP   : http://192.168.88.33:4000
echo  Localhost URL      : http://localhost:4000
echo  Helpdesk Call Line : 0704488632
echo.
echo  Starting Next.js Server on port 4000...
echo  Press Ctrl+C to stop the server.
echo.

call npm run dev
pause
