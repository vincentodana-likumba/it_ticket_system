@echo off
:: ========================================================
:: Maxim Agri IT Ticket System - Remove Auto-Start
:: ========================================================
title Maxim Agri IT Support Desk - Remove Auto-Start

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~dpnx0\"\"' -Verb RunAs"
    exit /b
)

set "TASK_NAME=MaximAgri_ITTicket_Server"

echo.
echo  ======================================================
echo   Maxim Agri IT Ticket Desk - Remove Auto-Start
echo  ======================================================
echo.

:: 1. Remove Startup Folder shortcut
echo  [1/2] Removing Windows Startup shortcut...
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\MaximAgri_ITTicket_Server.lnk" >nul 2>&1

:: 2. Remove Task Scheduler task
echo  [2/2] Removing scheduled task (%TASK_NAME%)...
schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1

echo.
echo  [SUCCESS] Auto-start has been completely removed.
echo.
pause
