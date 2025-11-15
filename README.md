# 🤖 Chispas - Robot Interactivo

> *"Dedicado a Amandita, el amor de mi vida. Te amo hija."* ❤️

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 Descripción

**Chispas** es un robot interactivo diseñado para entretener, educar y maravillar. Su objetivo es hacer feliz a mi hija Amanda a través de una experiencia interactiva, amigable y educativa.

## 🎯 Versiones del Proyecto

Este proyecto incluye **dos versiones** de Chispas:

### 1. 🖥️ Versión Pygame (Original)
La versión original con animación de cara usando Pygame, diseñada para ejecutarse directamente en una Raspberry Pi con pantalla.

**Archivo**: `face.py`

**Características**:
- Animación de cara de gato
- Expresiones: feliz, sorprendido
- 30 FPS
- Ventana de 400x300 píxeles

**Ejecutar**:
```bash
pip install pygame
python face.py
```

### 2. 🌐 Versión Web App (Nueva - Recomendada)
Versión completa basada en web con múltiples características interactivas. **¡Úsala desde cualquier celular!**

**Directorio**: `webapp/`

**Características**:
- ✅ Cara animada con 8+ expresiones
- ✅ Reconocimiento de voz en español
- ✅ Síntesis de voz con voz infantil
- ✅ 4 juegos educativos interactivos
- ✅ Interfaz responsive para móviles
- ✅ Comunicación en tiempo real (WebSocket)
- ✅ Conversación con IA básica
- ✅ Diseño colorido y amigable para niños

**Inicio rápido**:
```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

Luego abre tu navegador en `http://localhost:5000` o accede desde tu celular usando la IP mostrada.

📚 **[Ver documentación completa de la Web App](README_WEBAPP.md)**

## 🚀 Inicio Rápido (Web App)

### Instalación
```bash
# 1. Instalar dependencias
pip install -r requirements.txt

# 2. Ejecutar la aplicación
cd webapp
python app.py
```

### Acceso desde Celular
1. Asegúrate de estar en la misma red WiFi
2. Ejecuta el script de inicio (`./start.sh` o `start.bat`)
3. Anota la IP mostrada (ej: `192.168.1.100`)
4. En tu celular, abre el navegador y ve a `http://192.168.1.100:5000`

## 📱 Capturas

La interfaz incluye:
- 🎨 Cara animada del robot con expresiones
- 🎤 Botón de micrófono para hablar
- ⌨️ Campo de texto para escribir
- 😊 Botones de expresiones faciales
- 🎮 Juegos: Colores, Animales, Canciones, Números

## 🛠️ Tecnologías

### Backend
- **Python 3.8+**
- **Flask** - Framework web
- **Flask-SocketIO** - WebSocket en tiempo real
- **Eventlet** - Servidor asíncrono

### Frontend
- **HTML5/CSS3** - Interfaz moderna y responsiva
- **JavaScript ES6+** - Lógica de aplicación
- **Canvas API** - Renderizado de cara
- **Web Speech API** - Voz
- **Socket.IO** - Comunicación en tiempo real

## 📂 Estructura del Proyecto

```
chispas_v01/
├── webapp/                    # ⭐ Nueva versión web
│   ├── app.py                # Backend Flask + WebSocket
│   ├── templates/
│   │   └── index.html        # Interfaz principal
│   └── static/
│       ├── css/
│       │   └── style.css     # Estilos responsivos
│       └── js/
│           ├── app.js        # Lógica principal
│           └── robot-face.js # Animación de cara
├── face.py                    # Versión original Pygame
├── requirements.txt           # Dependencias Python
├── start.sh                   # Script de inicio Linux/Mac
├── start.bat                  # Script de inicio Windows
├── README.md                  # Este archivo
├── README_WEBAPP.md          # Documentación detallada web app
└── LICENSE                    # Licencia MIT
```

## 🎮 Características Principales

### Expresiones Faciales
- 😊 Feliz
- 🤩 Emocionado
- 😢 Triste
- 😲 Sorprendido
- 😍 Amoroso
- 😴 Dormido
- 🤔 Curioso
- 😐 Neutral

### Juegos Educativos
1. **🎨 Colores**: Aprende colores con emojis coloridos
2. **🐶 Animales**: Identifica animales por sus sonidos
3. **🎵 Canciones**: Escucha canciones infantiles
4. **🔢 Números**: Practica sumas sencillas

### Interacción
- Habla con Chispas usando voz o texto
- Chispas responde con voz y cambia su expresión
- Detección de intenciones (saludos, preguntas, juegos, etc.)
- Comunicación en tiempo real

## 🔮 Roadmap Futuro

### Hardware (Raspberry Pi)
- [ ] Integración con Raspberry Pi 3B
- [ ] Pantalla táctil
- [ ] Ruedas motorizadas para movimiento
- [ ] ROS para control robótico
- [ ] Cámara para reconocimiento facial
- [ ] Servomotores para movimientos expresivos

### Software
- [ ] Integración con LLM (OpenAI/Anthropic/Local)
- [ ] Whisper para mejor reconocimiento de voz
- [ ] Más juegos educativos
- [ ] Sistema de recompensas
- [ ] Historias interactivas
- [ ] Modo offline completo

## 🤝 Contribuir

Este es un proyecto personal para mi hija, pero si tienes ideas o mejoras, son bienvenidas.

## 📄 Licencia

MIT License - Copyright (c) 2024 Julian Neira Nova

Ver el archivo [LICENSE](LICENSE) para más detalles.

## ❤️ Dedicatoria

Este proyecto fue creado con todo el amor para **Amanda**, para que pueda tener un amigo robot que la acompañe, la haga reír y aprenda con ella.

---

**Hecho con ❤️ por papá**

*"La tecnología es más hermosa cuando sirve para hacer sonreír a quienes amamos"* 

