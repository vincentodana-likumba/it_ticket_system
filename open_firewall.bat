@echo off
:: ========================================================
:: Maxim Agri IT Ticket System - Open Windows Firewall
:: ========================================================

:: Check for administrative rights and self-elevate if not admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~dpnx0\"\"' -Verb RunAs"
    exit /b
)

echo ========================================================
echo  Maxim Agri IT Support Desk - Firewall Port 4000
echo ========================================================
echo.
echo Opening Windows Firewall port 4000 for incoming network traffic...
echo.

netsh advfirewall firewall add rule name="Maxim IT Ticket System (Port 4000)" dir=in action=allow protocol=TCP localport=4000 profile=any

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Windows Firewall rule added successfully!
    echo Port 4000 is now open across all network profiles (Domain, Private, Public).
) else (
    echo.
    echo [ERROR] Failed to add firewall rule.
)

echo.
pause
