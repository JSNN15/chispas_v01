#!/bin/bash

# Script de despliegue rápido para Linux/Mac
# Despliega Chispas con Docker Compose

set -e

echo "🤖 ======================================"
echo "   CHISPAS - Despliegue con Docker"
echo "======================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Docker
echo "🔍 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    echo "Instala Docker desde: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    echo "Instala Docker Compose desde: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker instalado correctamente${NC}"
echo ""

# Configuración
echo "⚙️  Configuración:"
echo "1. Modelo Whisper a usar:"
echo "   [1] tiny   (75 MB,  rápido, 80% precisión)"
echo "   [2] base   (145 MB, medio,  90% precisión) [RECOMENDADO]"
echo "   [3] small  (466 MB, lento,  93% precisión)"
echo "   [4] medium (1.5 GB, muy lento, 96% precisión)"
echo ""
read -p "Selecciona [1-4] (default: 2): " modelo_opcion

case $modelo_opcion in
    1) WHISPER_MODEL="tiny" ;;
    3) WHISPER_MODEL="small" ;;
    4) WHISPER_MODEL="medium" ;;
    *) WHISPER_MODEL="base" ;;
esac

echo -e "${GREEN}✅ Usando modelo: $WHISPER_MODEL${NC}"
echo ""

# Crear archivo .env
echo "📝 Creando configuración..."
cat > .env <<EOF
# Configuración de Chispas
WHISPER_MODEL=$WHISPER_MODEL
DEVICE=cpu
FLASK_ENV=production
EOF

echo -e "${GREEN}✅ Configuración creada${NC}"
echo ""

# Construir imágenes
echo "🏗️  Construyendo imágenes Docker..."
echo "   Esto puede tardar varios minutos la primera vez..."
docker-compose build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Imágenes construidas correctamente${NC}"
else
    echo -e "${RED}❌ Error construyendo imágenes${NC}"
    exit 1
fi
echo ""

# Iniciar servicios
echo "🚀 Iniciando servicios..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Servicios iniciados correctamente${NC}"
else
    echo -e "${RED}❌ Error iniciando servicios${NC}"
    exit 1
fi
echo ""

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 5

# Obtener IP local
IP=$(hostname -I | awk '{print $1}')
if [ -z "$IP" ]; then
    IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n1)
fi

echo ""
echo "🎉 ======================================"
echo "   CHISPAS ESTÁ FUNCIONANDO"
echo "======================================"
echo ""
echo "📱 Accede a Chispas desde:"
echo ""
echo "   💻 Local:      http://localhost:5000"
if [ ! -z "$IP" ]; then
    echo "   📱 Red WiFi:   http://$IP:5000"
fi
echo ""
echo "🔧 Panel de servicios:"
echo "   Whisper API:   http://localhost:5001/info"
echo ""
echo "📊 Ver logs:"
echo "   docker-compose logs -f webapp"
echo "   docker-compose logs -f whisper"
echo ""
echo "🛑 Detener servicios:"
echo "   docker-compose down"
echo ""
echo "🔄 Reiniciar servicios:"
echo "   docker-compose restart"
echo ""
echo "======================================"
echo ""

# Verificar estado
echo "✅ Estado de los servicios:"
docker-compose ps

echo ""
echo -e "${GREEN}🤖 Chispas está listo para Amanda ❤️${NC}"
