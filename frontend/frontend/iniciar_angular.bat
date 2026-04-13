@echo off
title Ticket de Turno - Frontend Angular
color 0B
echo ====================================
echo   TICKET DE TURNO - FRONTEND (Angular)
echo ====================================
echo.

cd /d "%~dp0"

echo [1/2] Instalando dependencias...
call npm install

echo.
echo [2/2] Iniciando servidor...
echo.
echo ====================================
echo   Abrir en navegador: http://localhost:4200
echo ====================================
echo.
ng serve --host 0.0.0.0
