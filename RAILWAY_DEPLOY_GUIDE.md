# 🚂 Guía de Despliegue en Railway.app

## ❌ Error que Obtuviste

Railway está viendo la rama `main` que solo tiene archivos antiguos (face.py básico). Necesitas desplegar desde la rama con el código completo.

---

## ✅ Solución: Mergear a Main

Railway necesita que el código esté en `main` o configurar la rama correcta.

### Opción 1: Mergear la Rama (RECOMENDADO)

```bash
# En tu computadora local
git checkout main
git merge claude/project-review-012oGQVfMMWcN8LEJ3pjnU6V
git push origin main
```

Luego en Railway:
1. Redeploy
2. ¡Listo!

---

### Opción 2: Configurar Railway para Usar la Rama Correcta

**En Railway Dashboard:**

1. Ve a tu proyecto
2. Settings → GitHub
3. Branch: Cambiar a `claude/project-review-012oGQVfMMWcN8LEJ3pjnU6V`
4. Deploy

---

## 🐳 Opción 3: Despliegue con Docker (Más Completo)

He creado `railway.toml` para configurar Docker.

**Pasos:**

1. **Asegúrate de estar en la rama correcta:**
```bash
git checkout claude/project-review-012oGQVfMMWcN8LEJ3pjnU6V
git push origin claude/project-review-012oGQVfMMWcN8LEJ3pjnU6V
```

2. **En Railway:**
   - Settings → Service
   - Build Command: (vacío, usa Docker)
   - Start Command: (vacío, usa Docker)
   - Root Directory: `/`

3. **Variables de entorno en Railway:**
```
WHISPER_MODEL=base
DEVICE=cpu
FLASK_ENV=production
PORT=5000
```

4. **Deploy**

---

## 📦 Opción 4: Despliegue Sin Docker (Más Simple)

Si Railway tiene problemas con Docker, usa esta configuración:

**1. Crea `railway.json`:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd webapp && python app.py",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**2. Variables de entorno:**
```
PYTHON_VERSION=3.11
PORT=5000
```

**3. Deploy**

---

## 🎯 Solución MÁS RÁPIDA (Sin Railway)

Si Railway te da problemas, usa **Render.com** que es más sencillo:

### Render.com (Alternativa más fácil)

**1. Cuenta:**
- https://render.com/register

**2. New → Web Service**
- Conecta GitHub
- Selecciona repositorio
- Rama: `claude/project-review-012oGQVfMMWcN8LEJ3pjnU6V`

**3. Configuración:**
```
Name: chispas
Environment: Docker
Branch: claude/project-review-012oGQVfMMWcN8LEJ3pjnU6V
Dockerfile Path: Dockerfile
Instance Type: Free
```

**4. Variables de entorno:**
```
WHISPER_MODEL=base
DEVICE=cpu
```

**5. Create Web Service**

**¡Listo!** Te dará una URL como:
```
https://chispas.onrender.com
```

---

## 🚀 Opción SUPER RÁPIDA: Fly.io

**1. Instalar CLI:**
```bash
# Mac/Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

**2. Login:**
```bash
flyctl auth login
```

**3. Navegar al proyecto:**
```bash
cd chispas_v01
git checkout claude/project-review-012oGQVfMMWcN8LEJ3pjnU6V
```

**4. Deploy:**
```bash
flyctl launch
# Preguntará configuración, acepta defaults
# Nombre: chispas-amanda (o el que quieras)

flyctl deploy
```

**5. URL:**
```
https://chispas-amanda.fly.dev
```

**✅ Ventajas de Fly.io:**
- Muy rápido
- Gratis (3 apps pequeñas)
- Excelente para Docker
- CLI muy simple

---

## 📊 Comparación de Opciones

| Plataforma | Dificultad | Tiempo | Gratis | Docker | Recomendación |
|------------|------------|--------|--------|--------|---------------|
| **Render** | ⭐ Fácil | 5 min | ✅ Sí | ✅ Sí | ⭐⭐⭐⭐⭐ Mejor opción |
| **Fly.io** | ⭐⭐ Media | 10 min | ✅ Sí | ✅ Sí | ⭐⭐⭐⭐ Muy bueno |
| **Railway** | ⭐⭐⭐ Media | 10 min | ✅ Sí | ⚠️ A veces | ⭐⭐⭐ Requiere config |
| **ngrok** | ⭐ Muy fácil | 2 min | ✅ Sí | ❌ No | ⭐⭐⭐⭐ Para pruebas |

---

## 🎯 Mi Recomendación AHORA

### Prueba con Render.com:

Es MÁS FÁCIL que Railway y funciona a la primera:

**1. Ve a:** https://render.com/register

**2. New → Web Service**

**3. Conecta GitHub**

**4. Selecciona:** `chispas_v01`

**5. Configuración:**
```
Branch: claude/project-review-012oGQVfMMWcN8LEJ3pjnU6V
Environment: Docker
Dockerfile Path: Dockerfile
Plan: Free
```

**6. Create**

**⏱️ En 5 minutos tendrás:**
```
https://chispas.onrender.com
```

---

## 🆘 Si Todo Falla: ngrok (Local pero Online)

La opción más confiable:

```bash
# 1. En tu computadora
cd chispas_v01
./deploy.sh

# 2. En otra terminal
./tunnel.sh

# 3. Te da URL pública instantánea
https://abc123.ngrok-free.app
```

---

## 📝 Archivos que He Creado

- **`railway.toml`** - Configuración para Railway
- **`Procfile`** - Para Heroku/Railway
- **`runtime.txt`** - Versión de Python
- **`RAILWAY_DEPLOY_GUIDE.md`** - Esta guía

---

## ✅ Próximos Pasos

**Opción A - Render (más fácil):**
1. Crea cuenta en Render.com
2. New Web Service
3. Selecciona rama correcta
4. Deploy
5. ¡Listo!

**Opción B - Fly.io (muy bueno):**
```bash
curl -L https://fly.io/install.sh | sh
flyctl auth login
cd chispas_v01
flyctl launch
```

**Opción C - ngrok (inmediato):**
```bash
./deploy.sh
./tunnel.sh
```

---

## 🤔 ¿Cuál Prefieres?

1. **Render.com** - Te guío paso a paso (5 min)
2. **Fly.io** - Comandos y listo (10 min)
3. **ngrok** - Inmediato pero temporal (2 min)

Dime cuál quieres y te ayudo específicamente con esa 🚀
