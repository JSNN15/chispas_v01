#!/bin/bash

# Script de inicio para Chispas Robot
# Para Linux/Mac

echo "🤖 Iniciando Chispas Robot..."
echo ""

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado"
    echo "Por favor instala Python 3.8 o superior"
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"
echo ""

# Verificar si existe el entorno virtual
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
    echo "✅ Entorno virtual creado"
    echo ""
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Verificar e instalar dependencias
echo "📥 Instalando/verificando dependencias..."
pip install -q -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas"
echo ""

# Obtener IP local
IP=$(hostname -I | awk '{print $1}')
if [ -z "$IP" ]; then
    IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n1)
fi

echo "🌐 Información de Acceso:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Local:          http://localhost:5000"
if [ ! -z "$IP" ]; then
    echo "📱 Red Local:      http://$IP:5000"
    echo ""
    echo "💡 Para acceder desde tu celular:"
    echo "   1. Conéctate a la misma WiFi"
    echo "   2. Abre el navegador"
    echo "   3. Visita: http://$IP:5000"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Iniciando servidor..."
echo ""

# Iniciar la aplicación
cd webapp
python3 app.py
