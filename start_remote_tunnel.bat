@echo off
title Maxim IT Support Desk - Remote URL (maximagritticket)
:: ========================================================
:: Maxim Agri IT Ticket System - Remote Public Tunnel
:: ========================================================
cd /d "%~dp0"
echo.
echo  ======================================================
echo   Maxim Agri IT Support Desk - Remote Access Service
echo  ======================================================
echo.
echo  Starting remote tunnel for URL: https://maximagritticket.loca.lt
echo.

call npm run tunnel

pause
