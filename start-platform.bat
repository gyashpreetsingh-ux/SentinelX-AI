@echo off
title SentinelX AI Platform Starter
echo ========================================================
echo   Starting SentinelX AI - Autonomous Cyber Defense Platform
echo   Author: Yashpreet Singh (2026)
echo ========================================================

echo [1/2] Starting FastAPI Backend on http://localhost:8088...
start "SentinelX Backend (Port 8088)" cmd /k ".\backend\venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8088"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React + Vite Frontend on http://localhost:5188...
cd frontend
start "SentinelX Frontend (Port 5188)" cmd /k "npm run dev -- --host 127.0.0.1 --port 5188"
cd ..

timeout /t 3 /nobreak >nul

echo ========================================================
echo   SentinelX AI is now running!
echo   Local Dashboard: http://localhost:5188
echo   Backend API:     http://localhost:8088/docs
echo ========================================================
pause
