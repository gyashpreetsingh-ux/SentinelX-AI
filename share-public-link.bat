@echo off
title SentinelX AI Public Tunnel
echo ========================================================
echo   SentinelX AI - Public Cloudflare Tunnel Generator
echo   Author: Yashpreet Singh (2026)
echo ========================================================
echo.
echo Connecting local port 5188 to Cloudflare Global Network...
echo Keep this window OPEN as long as you want the public link to work!
echo.
.\cloudflared.exe tunnel --url http://127.0.0.1:5188
pause
