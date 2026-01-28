@echo off
REM Script de instalación para LA JICARADAS POS (Windows)

echo.
echo ==========================================
echo    LA JICARADAS - POS Installation
echo ==========================================
echo.

REM 1. Verificar Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo OK Node.js %NODE_VERSION% detected

REM 2. Instalar dependencias
echo.
echo Installing dependencies...
call npm install

if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM 3. Crear carpeta de datos
if not exist "data" mkdir data

REM 4. Inicializar BD
echo.
echo Initializing database...
call npm run init:db

echo.
echo ==========================================
echo   Installation completed successfully!
echo ==========================================
echo.
echo To start development, run:
echo   npm run dev
echo.
echo Default credentials:
echo   Username: admin
echo   PIN: 1234
echo.
pause
