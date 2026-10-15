@echo off
:: ========================================================
:: Maxim Agri IT Ticket System - Auto-Start Installer
:: ========================================================
title Maxim Agri IT Support Desk - Auto-Start Setup

:: Check for administrative rights and self-elevate if not admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~dpnx0\"\"' -Verb RunAs"
    exit /b
)

set "TICKET_DIR=%~dp0"
set "START_SCRIPT=%TICKET_DIR%start_server.bat"
set "SILENT_SCRIPT=%TICKET_DIR%start_server_silent.vbs"
set "TASK_NAME=MaximAgri_ITTicket_Server"

echo.
echo  ======================================================
echo   Maxim Agri IT Service Desk - Auto-Start Setup (Port 4000)
echo  ======================================================
echo.
echo  [INFO] IT Ticket directory : %TICKET_DIR%
echo.

:: 1. Open Windows Firewall Port 4000
echo  [1/3] Configuring Windows Firewall for Port 4000...
netsh advfirewall firewall delete rule name="Maxim IT Ticket System (Port 3000)" >nul 2>&1
netsh advfirewall firewall delete rule name="Maxim IT Ticket System (Port 4000)" >nul 2>&1
netsh advfirewall firewall add rule name="Maxim IT Ticket System (Port 4000)" dir=in action=allow protocol=TCP localport=4000 profile=any >nul 2>&1

:: 2. Register Startup Folder Entry
echo  [2/3] Adding shortcut to Windows User Startup folder...
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut(\"$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\MaximAgri_ITTicket_Server.lnk\"); $s.TargetPath = 'wscript.exe'; $s.Arguments = \"`\"%SILENT_SCRIPT%`\"\"; $s.WorkingDirectory = \"`\"%TICKET_DIR%`\"\"; $s.WindowStyle = 7; $s.Save()" >nul 2>&1

:: 3. Register Task Scheduler
echo  [3/3] Creating Windows Task Scheduler task (%TASK_NAME%)...
schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1
schtasks /create /tn "%TASK_NAME%" /tr "wscript.exe \"%SILENT_SCRIPT%\"" /sc onlogon /rl HIGHEST /f >nul 2>&1

echo.
echo  ======================================================
echo   [SUCCESS] Auto-Start Configured Successfully!
echo  ======================================================
echo.
echo  The IT Support Desk will automatically turn on:
echo    - Port 4000 is open in Windows Firewall
echo    - Starts automatically on Windows boot / logon
echo    - Local Network URL : http://192.168.88.33:4000
echo    - Localhost URL     : http://localhost:4000
echo.
echo  To remove auto-start at any time, run remove_autostart.bat
echo.
pause
