# 🌐 Guía para Ver Chispas Online

## Problema Actual
Este es un entorno de desarrollo sin acceso directo a internet público. Pero cuando despliegues Chispas en tu computadora, tienes varias opciones para acceso online.

---

## 🚀 Opción 1: ngrok (MÁS FÁCIL - Gratis) ⭐

### Pasos:

**1. Instalar ngrok:**
- Ve a: https://ngrok.com/download
- Descarga para tu sistema operativo
- Descomprime el archivo

**2. Iniciar Chispas:**
```bash
cd chispas_v01
./deploy.sh  # O deploy.bat en Windows
```

**3. Crear túnel público:**
```bash
# En otra terminal
ngrok http 5000
```

**4. Obtener URL:**
```
ngrok by @inconshreveable

Session Status                online
Account                       Free (Plan)
Version                       3.3.0
Region                        United States (us)
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:5000

🌐 Comparte esta URL: https://abc123.ngrok-free.app
```

**✅ Ventajas:**
- Gratis
- HTTPS automático
- Muy fácil de usar
- Funciona en Windows, Mac, Linux

**⚠️ Limitaciones (versión gratis):**
- URL cambia cada vez que reinicias
- Máximo 1 sesión activa
- Banner de ngrok en la página

---

## 🚀 Opción 2: Cloudflare Tunnel (Gratis, Sin límites)

### Pasos:

**1. Crear cuenta gratis en Cloudflare:**
- https://dash.cloudflare.com/sign-up

**2. Instalar cloudflared:**

**Windows:**
```powershell
# Descargar de: https://github.com/cloudflare/cloudflared/releases
# Instalar ejecutable
```

**Linux/Mac:**
```bash
# Linux
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared

# Mac (con Homebrew)
brew install cloudflare/cloudflare/cloudflared
```

**3. Autenticar:**
```bash
cloudflared tunnel login
```

**4. Crear túnel:**
```bash
cloudflared tunnel --url http://localhost:5000
```

**5. Obtener URL:**
```
INF |  https://random-words-123.trycloudflare.com
```

**✅ Ventajas:**
- Totalmente gratis
- Sin banner ni publicidad
- HTTPS automático
- Túneles ilimitados
- URL más estable

---

## 🚀 Opción 3: Desplegar en la Nube (Gratis)

### A. Railway.app (Recomendado - Simple)

**1. Crear cuenta gratis:**
- https://railway.app

**2. Conectar GitHub:**
- Sube tu código a GitHub
- Conecta el repositorio en Railway

**3. Desplegar:**
- Railway detecta Docker automáticamente
- Despliega con 1 clic

**4. Obtener URL:**
```
https://chispas-production.up.railway.app
```

**✅ Ventajas:**
- Gratis ($5 crédito/mes)
- Siempre online
- URL permanente
- SSL automático
- No necesitas tu PC encendida

---

### B. Render.com (También gratis)

**1. Cuenta:**
- https://render.com

**2. Nuevo Web Service:**
- Conecta GitHub
- Selecciona repositorio

**3. Configuración:**
- Docker: Detectado automáticamente
- Plan: Free

**4. Deploy:**
- URL: `https://chispas.onrender.com`

**✅ Ventajas:**
- Gratis ilimitado
- Siempre online
- SSL gratis

**⚠️ Limitación:**
- Se duerme después de 15 min sin uso
- Tarda 30s en despertar

---

### C. Fly.io (Rápido)

```bash
# Instalar flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Desplegar
cd chispas_v01
flyctl launch

# URL: https://chispas.fly.dev
```

---

## 📱 Opción 4: En tu Red WiFi (Acceso Local)

**Más simple si solo necesitas que Amanda acceda desde el celular:**

**1. Iniciar Chispas:**
```bash
./deploy.sh
```

**2. Obtener tu IP:**

**Windows:**
```cmd
ipconfig
# Busca "Dirección IPv4": 192.168.1.100
```

**Linux/Mac:**
```bash
ifconfig
# o
ip addr show
```

**3. Acceder desde celular:**
```
http://192.168.1.100:5000
```

**✅ Funciona si:**
- Celular y PC en misma WiFi
- Solo necesitas acceso local

---

## 🎯 Mi Recomendación

### Para Probar Rápido:
**✅ Usa ngrok** (5 minutos)
```bash
# 1. Descarga ngrok
# 2. ./deploy.sh
# 3. ngrok http 5000
# ¡Listo!
```

### Para Producción (Amanda siempre):
**✅ Despliega en Railway.app**
- Gratis
- Siempre disponible
- URL bonita
- No necesitas PC encendida

### Para Desarrollo:
**✅ Cloudflare Tunnel**
- Gratis
- Sin límites
- Fácil de usar

---

## 📝 Script para ngrok

He creado un script automático:

**`tunnel.sh` (Linux/Mac):**
```bash
#!/bin/bash
echo "🚀 Iniciando Chispas y creando túnel público..."

# Iniciar Chispas
./deploy.sh &

# Esperar a que inicie
sleep 10

# Crear túnel
echo "🌐 Creando túnel público con ngrok..."
ngrok http 5000
```

**`tunnel.bat` (Windows):**
```batch
@echo off
echo Iniciando Chispas y creando tunel publico...

start /B deploy.bat
timeout /t 10

echo Creando tunel publico con ngrok...
ngrok http 5000
```

---

## 🎬 Demo en Video

También puedes grabar un video de la interfaz y funcionamiento para mostrárselo a alguien sin necesidad de desplegar.

---

## ❓ Próximo Paso

**¿Qué prefieres?**

1. **Ver tutorial de ngrok** - Te guío paso a paso
2. **Desplegar en Railway** - Siempre online, gratis
3. **Solo acceso WiFi local** - Más simple

Dime cuál opción te interesa y te ayudo a configurarla 🚀
