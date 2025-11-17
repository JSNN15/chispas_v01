@echo off
REM Script de inicio para Chispas Robot
REM Para Windows

echo.
echo 🤖 Iniciando Chispas Robot...
echo.

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python no está instalado
    echo Por favor instala Python 3.8 o superior desde https://www.python.org
    pause
    exit /b 1
)

echo ✅ Python encontrado
python --version
echo.

REM Verificar si existe el entorno virtual
if not exist "venv" (
    echo 📦 Creando entorno virtual...
    python -m venv venv
    echo ✅ Entorno virtual creado
    echo.
)

REM Activar entorno virtual
echo 🔧 Activando entorno virtual...
call venv\Scripts\activate.bat

REM Instalar dependencias
echo 📥 Instalando/verificando dependencias...
pip install -q -r requirements.txt

if errorlevel 1 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas
echo.

REM Obtener IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

echo 🌐 Información de Acceso:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📱 Local:          http://localhost:5000
if defined IP (
    echo 📱 Red Local:      http://%IP%:5000
    echo.
    echo 💡 Para acceder desde tu celular:
    echo    1. Conéctate a la misma WiFi
    echo    2. Abre el navegador
    echo    3. Visita: http://%IP%:5000
)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🚀 Iniciando servidor...
echo.

REM Iniciar la aplicación
cd webapp
python app.py

pause
