@echo off
REM Script de despliegue rápido para Windows
REM Despliega Chispas con Docker Compose

echo ========================================
echo    CHISPAS - Despliegue con Docker
echo ========================================
echo.

REM Verificar Docker
echo Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker no esta instalado
    echo Instala Docker Desktop desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Compose no esta instalado
    pause
    exit /b 1
)

echo OK: Docker instalado correctamente
echo.

REM Configuración
echo Configuracion:
echo 1. Modelo Whisper a usar:
echo    [1] tiny   (75 MB,  rapido, 80%% precision)
echo    [2] base   (145 MB, medio,  90%% precision) [RECOMENDADO]
echo    [3] small  (466 MB, lento,  93%% precision)
echo    [4] medium (1.5 GB, muy lento, 96%% precision)
echo.
set /p modelo_opcion="Selecciona [1-4] (default: 2): "

if "%modelo_opcion%"=="1" (
    set WHISPER_MODEL=tiny
) else if "%modelo_opcion%"=="3" (
    set WHISPER_MODEL=small
) else if "%modelo_opcion%"=="4" (
    set WHISPER_MODEL=medium
) else (
    set WHISPER_MODEL=base
)

echo OK: Usando modelo %WHISPER_MODEL%
echo.

REM Crear archivo .env
echo Creando configuracion...
(
echo # Configuracion de Chispas
echo WHISPER_MODEL=%WHISPER_MODEL%
echo DEVICE=cpu
echo FLASK_ENV=production
) > .env

echo OK: Configuracion creada
echo.

REM Construir imágenes
echo Construyendo imagenes Docker...
echo Esto puede tardar varios minutos la primera vez...
docker-compose build

if errorlevel 1 (
    echo ERROR: Error construyendo imagenes
    pause
    exit /b 1
)

echo OK: Imagenes construidas correctamente
echo.

REM Iniciar servicios
echo Iniciando servicios...
docker-compose up -d

if errorlevel 1 (
    echo ERROR: Error iniciando servicios
    pause
    exit /b 1
)

echo OK: Servicios iniciados correctamente
echo.

REM Esperar a que los servicios estén listos
echo Esperando a que los servicios esten listos...
timeout /t 5 /nobreak >nul

REM Obtener IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

echo.
echo ========================================
echo    CHISPAS ESTA FUNCIONANDO
echo ========================================
echo.
echo Accede a Chispas desde:
echo.
echo    Local:      http://localhost:5000
if defined IP (
    echo    Red WiFi:   http://%IP%:5000
)
echo.
echo Panel de servicios:
echo    Whisper API:   http://localhost:5001/info
echo.
echo Ver logs:
echo    docker-compose logs -f webapp
echo    docker-compose logs -f whisper
echo.
echo Detener servicios:
echo    docker-compose down
echo.
echo Reiniciar servicios:
echo    docker-compose restart
echo.
echo ========================================
echo.

REM Verificar estado
echo Estado de los servicios:
docker-compose ps

echo.
echo Chispas esta listo para Amanda!
echo.
pause
