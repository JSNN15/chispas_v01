#!/bin/bash

# Script de túnel automático con ngrok
# Ejecuta Chispas y crea un túnel público

echo "🤖 ======================================"
echo "   CHISPAS - Túnel Público con ngrok"
echo "======================================"
echo ""

# Verificar si ngrok está instalado
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok no está instalado"
    echo ""
    echo "📥 Descarga ngrok desde:"
    echo "   https://ngrok.com/download"
    echo ""
    echo "O instala con:"
    echo "   brew install ngrok  # Mac"
    echo "   snap install ngrok  # Linux"
    echo ""
    exit 1
fi

echo "✅ ngrok encontrado"
echo ""

# Verificar si Chispas está corriendo
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo "✅ Chispas ya está corriendo en http://localhost:5000"
else
    echo "🚀 Iniciando Chispas con Docker..."
    docker-compose up -d
    echo "⏳ Esperando a que Chispas inicie..."
    sleep 10
fi

echo ""
echo "🌐 Creando túnel público..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 La URL pública aparecerá abajo"
echo "📱 Comparte esa URL para acceder desde cualquier lugar"
echo "🛑 Presiona Ctrl+C para detener el túnel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Crear túnel
ngrok http 5000
