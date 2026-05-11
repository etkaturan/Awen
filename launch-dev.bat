@echo off
title Awen Dev Launcher

echo Starting Awen in development mode...
echo.

:: Terminal 1 - Backend
start "Awen Backend" cmd /k "cd /d %~dp0backend && .venv\Scripts\activate && python main.py"

:: Wait for backend
timeout /t 3 /nobreak > nul

:: Terminal 2 - Frontend
start "Awen Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

:: Wait for frontend
timeout /t 3 /nobreak > nul

:: Terminal 3 - Tauri
start "Awen Tauri" cmd /k "cd /d %~dp0 && cargo tauri dev"

echo All services started. Check the terminal windows.