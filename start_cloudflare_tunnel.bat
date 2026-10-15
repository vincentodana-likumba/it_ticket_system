@echo off
title Maxim Agri IT Support Desk - Cloudflare Remote Access
:: ========================================================
:: Maxim Agri IT Ticket System - Cloudflare Remote Tunnel
:: ========================================================
cd /d "%~dp0"
echo.
echo  ======================================================
echo   Maxim Agri IT Support Desk - Cloudflare Remote Tunnel
echo  ======================================================
echo.
echo  Starting secure encrypted remote tunnel for port 4000...
echo.

.\cloudflared.exe tunnel --url http://localhost:4000

pause
