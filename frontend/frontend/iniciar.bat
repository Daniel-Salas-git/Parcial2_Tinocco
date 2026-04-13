@echo off
title Ticket de Turno - Frontend
color 0B
echo ====================================
echo   TICKET DE TURNO - FRONTEND
echo ====================================
echo.

cd /d "%~dp0"

echo [1/2] Instalando dependencias...
npm install

echo.
echo [2/2] Iniciando servidor de desarrollo...
echo.
echo ====================================
echo   Abrir en navegador:
echo   http://localhost:5173
echo ====================================
echo.
npm run dev
