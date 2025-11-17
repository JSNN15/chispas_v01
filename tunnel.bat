@echo off
REM Script de tunel automatico con ngrok
REM Ejecuta Chispas y crea un tunel publico

echo ========================================
echo    CHISPAS - Tunel Publico con ngrok
echo ========================================
echo.

REM Verificar si ngrok esta instalado
where ngrok >nul 2>&1
if errorlevel 1 (
    echo ERROR: ngrok no esta instalado
    echo.
    echo Descarga ngrok desde:
    echo    https://ngrok.com/download
    echo.
    pause
    exit /b 1
)

echo OK: ngrok encontrado
echo.

REM Verificar si Chispas esta corriendo
curl -s http://localhost:5000 >nul 2>&1
if errorlevel 1 (
    echo Iniciando Chispas con Docker...
    docker-compose up -d
    echo Esperando a que Chispas inicie...
    timeout /t 10 /nobreak >nul
) else (
    echo OK: Chispas ya esta corriendo en http://localhost:5000
)

echo.
echo Creando tunel publico...
echo.
echo ========================================
echo  La URL publica aparecera abajo
echo  Comparte esa URL para acceder desde cualquier lugar
echo  Presiona Ctrl+C para detener el tunel
echo ========================================
echo.

REM Crear tunel
ngrok http 5000
