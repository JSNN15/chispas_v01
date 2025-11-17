# 🐳 Guía de Despliegue con Docker - Chispas Robot

## 🎯 Arquitectura Modular

Chispas ahora usa una arquitectura de **microservicios con Docker**:

```
┌─────────────────────────────────────────┐
│         CHISPAS ROBOT                   │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │   Web App    │  │  Whisper Local  │ │
│  │   (Flask)    │◄─┤   (Microservicio)││
│  │   Puerto     │  │   Puerto 5001   │ │
│  │   5000       │  └─────────────────┘ │
│  └──────────────┘                      │
│         │                              │
│         ▼                              │
│  ┌──────────────┐                      │
│  │    Redis     │                      │
│  │   (Cache)    │                      │
│  │   Puerto     │                      │
│  │   6379       │                      │
│  └──────────────┘                      │
└─────────────────────────────────────────┘
```

### Ventajas:

- ✅ **Modular**: Cada servicio es independiente
- ✅ **Escalable**: Puedes correr múltiples instancias
- ✅ **Portable**: Funciona igual en Linux, Windows, Mac
- ✅ **Fácil actualización**: Actualiza solo lo que necesites
- ✅ **Aislado**: No contamina tu sistema
- ✅ **Reproducible**: Mismo ambiente en todos lados

---

## 🚀 Instalación Rápida

### Requisitos Previos:

**Instalar Docker:**

- **Windows/Mac**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**:
  ```bash
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker $USER
  ```

**Verificar instalación:**
```bash
docker --version
docker-compose --version
```

---

## ⚡ Despliegue en 1 Comando

### Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

### Windows:
```cmd
deploy.bat
```

**¡Eso es todo!** El script:
1. Verifica Docker
2. Te pregunta qué modelo Whisper usar
3. Construye las imágenes
4. Inicia todos los servicios
5. Te muestra las URLs de acceso

---

## 🎮 Uso Manual (Paso a Paso)

### 1. Configurar modelo Whisper:

Edita `.env`:
```bash
WHISPER_MODEL=base    # tiny, base, small, medium
DEVICE=cpu            # cpu o cuda (si tienes GPU)
FLASK_ENV=production
```

### 2. Construir imágenes:
```bash
docker-compose build
```

### 3. Iniciar servicios:
```bash
docker-compose up -d
```

### 4. Verificar estado:
```bash
docker-compose ps
```

### 5. Ver logs:
```bash
# Todos los servicios
docker-compose logs -f

# Solo webapp
docker-compose logs -f webapp

# Solo whisper
docker-compose logs -f whisper
```

### 6. Detener servicios:
```bash
docker-compose down
```

---

## 🔧 Configuración Avanzada

### Cambiar modelo Whisper sin reconstruir:

```bash
# Edita .env
WHISPER_MODEL=small

# Reinicia solo el servicio de Whisper
docker-compose restart whisper
```

### Usar GPU (NVIDIA):

1. Instala [NVIDIA Container Toolkit](https://github.com/NVIDIA/nvidia-docker)

2. Modifica `docker-compose.yml`:
```yaml
whisper:
  environment:
    - DEVICE=cuda
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

3. Reinicia:
```bash
docker-compose up -d
```

### Limitar recursos:

En `docker-compose.yml`:
```yaml
whisper:
  deploy:
    resources:
      limits:
        cpus: '2'      # Máximo 2 CPUs
        memory: 4G     # Máximo 4GB RAM
      reservations:
        memory: 2G     # Reservar mínimo 2GB
```

---

## 📊 Endpoints Disponibles

### Web App (Puerto 5000):
- **http://localhost:5000** - Interfaz principal
- **http://localhost:5000/api/state** - Estado del robot

### Whisper API (Puerto 5001):
- **http://localhost:5001/health** - Estado del servicio
- **http://localhost:5001/info** - Información del modelo
- **http://localhost:5001/transcribe** - Transcribir audio (POST)
- **http://localhost:5001/models** - Modelos disponibles

### Ejemplo de uso del API:

```bash
# Transcribir audio
curl -X POST http://localhost:5001/transcribe \
  -F "audio=@audio.wav" \
  -F "language=es"

# Respuesta:
{
  "text": "Hola Chispas, ¿cómo estás?",
  "language": "es",
  "duration": 2.5,
  "segments": [...]
}
```

---

## 🛠️ Comandos Útiles

### Gestión de servicios:

```bash
# Iniciar todo
docker-compose up -d

# Detener todo
docker-compose down

# Reiniciar todo
docker-compose restart

# Reiniciar solo webapp
docker-compose restart webapp

# Ver logs en tiempo real
docker-compose logs -f

# Ver estado
docker-compose ps

# Reconstruir imágenes
docker-compose build --no-cache
```

### Gestión de datos:

```bash
# Ver volúmenes
docker volume ls

# Limpiar volúmenes (¡cuidado! elimina modelos descargados)
docker-compose down -v

# Hacer backup del volumen de modelos
docker run --rm -v chispas_v01_whisper-models:/data -v $(pwd):/backup \
  alpine tar czf /backup/whisper-models-backup.tar.gz -C /data .

# Restaurar backup
docker run --rm -v chispas_v01_whisper-models:/data -v $(pwd):/backup \
  alpine tar xzf /backup/whisper-models-backup.tar.gz -C /data
```

### Monitoreo:

```bash
# Ver uso de recursos
docker stats

# Inspeccionar contenedor
docker inspect chispas-webapp
docker inspect chispas-whisper

# Ejecutar comando dentro del contenedor
docker exec -it chispas-webapp bash
docker exec -it chispas-whisper python -c "from faster_whisper import WhisperModel; print('OK')"
```

---

## 🌐 Acceso Remoto

### Opción 1: Túnel con ngrok (más fácil)

```bash
# Instalar ngrok
# Descargar de: https://ngrok.com/download

# Crear túnel
ngrok http 5000

# Te da una URL pública:
# https://abc123.ngrok.io → http://localhost:5000
```

### Opción 2: Túnel SSH

```bash
# En servidor con IP pública
ssh -R 80:localhost:5000 serveo.net

# Te da una URL pública
```

### Opción 3: Configurar puerto en router

1. En tu router, abre el puerto 5000
2. Redirige a la IP local de tu PC
3. Accede con tu IP pública: `http://TU_IP_PUBLICA:5000`

---

## 🔐 Seguridad

### Variables de entorno sensibles:

Crea `.env.local` (no lo subas a git):
```bash
# Claves API
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Secretos
FLASK_SECRET_KEY=tu-secreto-aqui
```

Modifica `docker-compose.yml`:
```yaml
webapp:
  env_file:
    - .env
    - .env.local  # Secretos locales
```

### HTTPS con certificados:

Usa un reverse proxy como Nginx:

```yaml
# docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - webapp
```

---

## 📦 Despliegue en Producción

### En un servidor Linux:

```bash
# 1. Clonar repositorio
git clone https://github.com/JSNN15/chispas_v01.git
cd chispas_v01

# 2. Configurar
cp .env.example .env
nano .env  # Editar configuración

# 3. Desplegar
./deploy.sh

# 4. Verificar
curl http://localhost:5000
```

### En Raspberry Pi:

```bash
# 1. Instalar Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker pi

# 2. Clonar y configurar
git clone https://github.com/JSNN15/chispas_v01.git
cd chispas_v01

# 3. Usar modelo pequeño (importante en RPi)
echo "WHISPER_MODEL=tiny" > .env

# 4. Desplegar
./deploy.sh
```

### En la nube (AWS, DigitalOcean, etc.):

```bash
# 1. SSH al servidor
ssh user@tu-servidor.com

# 2. Instalar Docker
curl -fsSL https://get.docker.com | sh

# 3. Clonar y desplegar
git clone https://github.com/JSNN15/chispas_v01.git
cd chispas_v01
./deploy.sh

# 4. Configurar firewall
sudo ufw allow 5000/tcp
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to Docker daemon"
```bash
# Linux: Agregar usuario al grupo docker
sudo usermod -aG docker $USER
# Cerrar sesión y volver a entrar
```

### Error: "Port already in use"
```bash
# Ver qué está usando el puerto
sudo lsof -i :5000
# O cambiar puerto en docker-compose.yml
ports:
  - "8080:5000"  # Usa puerto 8080 en vez de 5000
```

### Error: "Out of memory"
```bash
# Verificar memoria disponible
free -h

# Usar modelo más pequeño
echo "WHISPER_MODEL=tiny" > .env
docker-compose restart whisper
```

### Whisper no descarga el modelo:
```bash
# Entrar al contenedor y descargarlo manualmente
docker exec -it chispas-whisper bash
python -c "from faster_whisper import WhisperModel; WhisperModel('base')"
exit
```

### Limpiar y empezar de cero:
```bash
# Detener todo
docker-compose down -v

# Limpiar imágenes viejas
docker system prune -a

# Reconstruir
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Monitoreo con Portainer (Opcional)

Panel visual para gestionar Docker:

```bash
docker volume create portainer_data

docker run -d -p 9000:9000 \
  --name=portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce

# Accede a: http://localhost:9000
```

---

## 🎯 Resumen de Comandos

| Acción | Comando |
|--------|---------|
| **Despliegue rápido** | `./deploy.sh` o `deploy.bat` |
| **Iniciar** | `docker-compose up -d` |
| **Detener** | `docker-compose down` |
| **Ver logs** | `docker-compose logs -f` |
| **Ver estado** | `docker-compose ps` |
| **Reiniciar** | `docker-compose restart` |
| **Reconstruir** | `docker-compose build` |
| **Limpiar todo** | `docker-compose down -v && docker system prune -a` |

---

## ✅ Checklist Post-Despliegue

- [ ] ¿Accedes a http://localhost:5000?
- [ ] ¿Funciona el reconocimiento de voz?
- [ ] ¿Whisper responde en http://localhost:5001/health?
- [ ] ¿Los logs no muestran errores?
- [ ] ¿Puedes acceder desde el celular (misma WiFi)?
- [ ] ¿Los servicios se reinician automáticamente?

---

## 🚀 Próximos Pasos

1. ✅ Despliega con `./deploy.sh`
2. ✅ Prueba desde el navegador
3. ✅ Prueba desde el celular
4. ⏭️ Considera agregar IA (OpenAI/Claude)
5. ⏭️ Despliega en Raspberry Pi
6. ⏭️ Configura acceso remoto

---

**¡Chispas ahora es completamente modular y portable!** 🎉

Funciona igual en:
- 💻 Windows
- 🐧 Linux
- 🍎 macOS
- 🍓 Raspberry Pi
- ☁️ Servidores en la nube
