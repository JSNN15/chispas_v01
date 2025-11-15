# 🤖 Chispas - Robot Interactivo para Amanda

> *"Dedicado a Amandita, el amor de mi vida. Te amo hija."* ❤️

## 📱 Descripción

**Chispas** es un robot interactivo basado en web diseñado especialmente para Amanda. Cuenta con una cara animada expresiva, reconocimiento de voz, síntesis de voz y juegos educativos divertidos.

La aplicación puede ejecutarse en cualquier dispositivo con navegador web (computadora, tablet, celular) y está optimizada para interacción táctil y por voz.

## ✨ Características

### 🎨 Cara Animada
- **Múltiples expresiones faciales**: feliz, emocionado, triste, sorprendido, amoroso, dormido, curioso
- **Animaciones suaves** con Canvas HTML5
- **Diseño responsivo** que se adapta a cualquier tamaño de pantalla
- **Parpadeo automático** y efectos especiales

### 🎤 Interacción por Voz
- **Reconocimiento de voz** en español (Web Speech API)
- **Síntesis de voz** con voz infantil personalizada
- **Conversación natural** con detección de intenciones
- **Comandos por voz** para juegos y expresiones

### 🎮 Juegos Interactivos
1. **🎨 Colores**: Aprende y adivina colores
2. **🐶 Animales**: Identifica animales por sus sonidos
3. **🎵 Canciones**: Escucha canciones infantiles
4. **🔢 Números**: Practica sumas sencillas

### 💬 Comunicación en Tiempo Real
- **WebSocket** para comunicación instantánea
- **Respuestas inteligentes** basadas en palabras clave
- **Estado del robot** sincronizado en tiempo real

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.8+**
- **Flask**: Framework web
- **Flask-SocketIO**: WebSocket para comunicación en tiempo real
- **Eventlet**: Servidor WSGI asíncrono

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno y responsivo con gradientes y animaciones
- **JavaScript ES6+**: Lógica de la aplicación
- **Canvas API**: Renderizado de la cara del robot
- **Web Speech API**: Reconocimiento y síntesis de voz
- **Socket.IO Client**: Comunicación WebSocket

## 📋 Requisitos

- Python 3.8 o superior
- Navegador moderno con soporte para:
  - Canvas API
  - Web Speech API (Chrome/Edge recomendados)
  - WebSocket
- Conexión a Internet (solo para CDN de Socket.IO)

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
cd chispas_v01
```

### 2. Crear entorno virtual (recomendado)
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

## ▶️ Ejecución

### Modo Local
```bash
cd webapp
python app.py
```

Luego abre tu navegador en: `http://localhost:5000`

### Modo Red Local (para acceder desde celular)
```bash
cd webapp
python app.py
```

El servidor se iniciará en `0.0.0.0:5000`. Para acceder desde tu celular:

1. Asegúrate de que tu celular y computadora estén en la misma red WiFi
2. Obtén la IP de tu computadora:
   - **Windows**: `ipconfig` (busca "Dirección IPv4")
   - **Linux/Mac**: `ifconfig` o `ip addr`
3. En el celular, abre el navegador y ve a: `http://<tu-ip>:5000`

**Ejemplo**: Si tu IP es `192.168.1.100`, accede a `http://192.168.1.100:5000`

## 📱 Uso

### Interacción por Voz
1. Toca el botón del **micrófono** 🎤
2. Permite el acceso al micrófono cuando el navegador lo solicite
3. Habla claramente en español
4. Chispas responderá con voz y cambiará su expresión

### Interacción por Texto
1. Escribe en el campo de texto
2. Presiona **Enviar** o pulsa Enter
3. Chispas responderá automáticamente

### Cambiar Expresiones
- Toca cualquiera de los botones de expresión para cambiar la cara de Chispas
- Expresiones disponibles: 😊 😢 😲 😍 🤩 😴

### Jugar
1. Toca un botón de juego en la sección "🎮 Juegos"
2. Sigue las instrucciones de Chispas
3. Responde usando voz o texto

## 🎯 Comandos de Ejemplo

Prueba decir o escribir:
- "Hola Chispas"
- "¿Cómo te llamas?"
- "Vamos a jugar"
- "Canta una canción"
- "Te quiero"
- "¿Cuál es tu color favorito?"
- "Háblame de animales"

## 📂 Estructura del Proyecto

```
chispas_v01/
├── webapp/
│   ├── app.py                 # Backend Flask
│   ├── templates/
│   │   └── index.html         # Interfaz principal
│   └── static/
│       ├── css/
│       │   └── style.css      # Estilos
│       └── js/
│           ├── app.js         # Lógica principal
│           └── robot-face.js  # Animación de cara
├── face.py                    # Versión original Pygame
├── requirements.txt           # Dependencias
└── README_WEBAPP.md          # Esta documentación
```

## 🎨 Personalización

### Agregar Nuevas Expresiones
Edita `webapp/static/js/robot-face.js` y agrega métodos `draw[NombreExpresion]Eyes()` y `draw[NombreExpresion]Mouth()`

### Agregar Nuevas Respuestas
Edita `webapp/app.py` en las secciones `responses` y `keywords` para agregar nuevas intenciones

### Cambiar Colores
Edita `webapp/static/css/style.css` en la sección `:root` para modificar la paleta de colores

### Agregar Nuevos Juegos
Edita `webapp/static/js/app.js` y agrega funciones `start[NombreJuego]Game()`

## 🔧 Solución de Problemas

### El micrófono no funciona
- Asegúrate de dar permisos de micrófono al navegador
- Usa Chrome o Edge (mejor soporte para Web Speech API)
- Verifica que tu micrófono esté conectado y funcionando

### No se conecta desde el celular
- Verifica que estés en la misma red WiFi
- Desactiva temporalmente el firewall
- Verifica la IP correcta con `ipconfig` o `ifconfig`

### La voz no suena
- Verifica el volumen del dispositivo
- Algunas voces en español requieren descarga (en Android)
- Prueba diferentes navegadores

### Error al instalar dependencias
```bash
# Actualiza pip primero
pip install --upgrade pip

# Instala de nuevo
pip install -r requirements.txt
```

## 🚀 Próximas Mejoras

- [ ] Integración con IA (OpenAI/Anthropic) para conversaciones más naturales
- [ ] Más juegos educativos (formas, letras, números)
- [ ] Sistema de recompensas y logros
- [ ] Modo oscuro
- [ ] Guardado de preferencias
- [ ] Integración con hardware (Raspberry Pi, servomotores)
- [ ] Control de movimiento físico
- [ ] Cámara para reconocimiento facial
- [ ] Historias interactivas

## 📄 Licencia

MIT License - Copyright (c) 2024 Julian Neira Nova

## ❤️ Dedicatoria

Este proyecto fue creado con amor para **Amanda**, para que pueda tener un amigo robot que la acompañe, la haga reír y aprenda con ella.

---

**Hecho con ❤️ por papá**

*"La tecnología es más hermosa cuando sirve para hacer sonreír a quienes amamos"*
