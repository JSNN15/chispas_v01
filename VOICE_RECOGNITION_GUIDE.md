# 🎤 Guía Completa de Reconocimiento de Voz para Chispas

## 🎯 Cómo Funciona Actualmente

### ✅ Sistema Actual: **Web Speech API**

Chispas **SÍ convierte audio a texto** usando la tecnología integrada en el navegador:

```
1. Amanda toca el botón 🎤
         ↓
2. Navegador pide permiso de micrófono
         ↓
3. Amanda habla: "Hola Chispas"
         ↓
4. Web Speech API escucha en tiempo real
         ↓
5. Convierte audio → texto: "hola chispas"
         ↓
6. Envía al servidor de Chispas
         ↓
7. Chispas procesa y responde
```

**Características:**
- ✅ **Gratis** - No cuesta nada
- ✅ **Tiempo real** - Convierte mientras hablas
- ✅ **Fácil** - Ya funciona, no necesita configuración
- ✅ **Español** - Configurado para español (es-ES)
- ⚠️ **Requiere internet** - Usa servidores de Google
- ⚠️ **Precisión media** - ~70% en condiciones normales
- ⚠️ **Solo navegadores modernos** - Chrome, Edge, Safari

---

## 📊 Comparación de Opciones

| Sistema | Precisión | Costo | Internet | Complejidad | Mejor Para |
|---------|-----------|-------|----------|-------------|------------|
| **Web Speech API** (Actual) | 70% | Gratis | Sí | Muy fácil | Empezar rápido |
| **Whisper API** (OpenAI) | 95% | $0.006/min | Sí | Fácil | Mejor calidad |
| **faster-whisper** (Local) | 95% | Gratis | No | Media | PC potente |
| **whisper.cpp** (Local) | 95% | Gratis | No | Media | Raspberry Pi |

---

## 🌐 Opción 1: Web Speech API (Sistema Actual)

### ¿Cómo funciona?

El navegador usa los servidores de Google para convertir voz a texto en tiempo real.

### Código (ya implementado):

```javascript
// En webapp/static/js/app.js
const recognition = new SpeechRecognition();
recognition.lang = 'es-ES';  // Español
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
    const texto = event.results[0][0].transcript;
    console.log('Amanda dijo:', texto);
    // Enviar a Chispas...
};

recognition.start();  // Empezar a escuchar
```

### Ventajas:
- ✅ Ya funciona, no necesitas hacer nada
- ✅ Totalmente gratis
- ✅ Respuesta en tiempo real
- ✅ No consume recursos de tu PC

### Desventajas:
- ❌ Necesita internet
- ❌ Precisión ~70% (no tan buena con ruido)
- ❌ No funciona bien con acentos fuertes
- ❌ No en todos los navegadores (Firefox limitado)

### ¿Cuándo usar?
- ✅ Para empezar y probar
- ✅ Si tienes internet siempre disponible
- ✅ Para uso casual

---

## ☁️ Opción 2: OpenAI Whisper API (Mejor calidad)

### ¿Qué es?

El **mejor sistema de reconocimiento de voz del mundo** creado por OpenAI.

### Ventajas:
- ✅ **Precisión 95%+** - Mucho mejor que Web Speech
- ✅ **Ruido de fondo** - Funciona bien con ruido
- ✅ **Acentos** - Entiende diferentes acentos
- ✅ **99+ idiomas** - No solo español
- ✅ **Fácil integración** - Solo agregar API key

### Costo:
- 💰 **$0.006 por minuto** de audio
- Ejemplo: 100 conversaciones de 30s = **$3.00**
- Muy barato para la calidad

### Instalación:

```bash
# 1. Instalar librería
pip install openai

# 2. Obtener API Key
# Crear cuenta en: https://platform.openai.com
# API Keys → Create new key

# 3. Configurar
export OPENAI_API_KEY="tu-key-aqui"
```

### Código:

```python
# En webapp/integrations/whisper_integration.py
import openai

def transcribe_audio(audio_file):
    with open(audio_file, 'rb') as f:
        transcript = openai.audio.transcriptions.create(
            model="whisper-1",
            file=f,
            language="es"
        )
    return transcript.text

# Uso:
texto = transcribe_audio("amanda.mp3")
# "Hola Chispas, ¿cómo estás hoy?"
```

### Integración con Flask:

```python
@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    audio = request.files['audio']
    audio.save('/tmp/audio.webm')

    texto = transcribe_audio('/tmp/audio.webm')
    return jsonify({'text': texto})
```

### ¿Cuándo usar?
- ✅ Cuando quieres la mejor calidad
- ✅ Si el costo no es problema (~$3/mes)
- ✅ Para producción profesional

---

## 🏠 Opción 3: faster-whisper (Local, PC)

### ¿Qué es?

Whisper corriendo en **tu propia computadora**, gratis y offline.

### Ventajas:
- ✅ **Gratis** - Uso ilimitado
- ✅ **Offline** - No necesita internet
- ✅ **Privado** - Todo queda en tu PC
- ✅ **Precisión 95%** - Igual que Whisper API

### Requisitos:
- **RAM**: 2-4 GB disponibles
- **CPU**: i5 o superior (o equivalente)
- **Disco**: 500 MB - 3 GB (según modelo)

### Instalación:

```bash
# Instalar faster-whisper
pip install faster-whisper

# O con GPU (mucho más rápido):
pip install faster-whisper[cuda]
```

### Código:

```python
from faster_whisper import WhisperModel

# Cargar modelo (solo una vez al iniciar)
model = WhisperModel("base", device="cpu")

# Transcribir
segments, info = model.transcribe("amanda.mp3", language="es")
texto = " ".join([s.text for s in segments])

print(texto)
# "Hola Chispas, ¿cómo estás hoy?"
```

### Tamaños de modelo:

| Modelo | Tamaño | RAM | Velocidad | Precisión |
|--------|--------|-----|-----------|-----------|
| tiny | 75 MB | 1 GB | Muy rápido | 80% |
| base | 145 MB | 1 GB | Rápido | 90% |
| small | 466 MB | 2 GB | Medio | 93% |
| medium | 1.5 GB | 5 GB | Lento | 96% |
| large | 3 GB | 10 GB | Muy lento | 98% |

**Recomendado: `base`** - Buen balance entre velocidad y precisión

### ¿Cuándo usar?
- ✅ Si tienes una PC decente
- ✅ Quieres privacidad total
- ✅ No tienes internet confiable
- ✅ Uso ilimitado gratis

---

## 🍓 Opción 4: whisper.cpp (Local, Raspberry Pi)

### ¿Qué es?

Whisper optimizado en **C++** para dispositivos pequeños como Raspberry Pi.

### Ventajas:
- ✅ **Muy rápido** - 5-10x más rápido que Python
- ✅ **Poca RAM** - Funciona con 512 MB
- ✅ **Gratis y offline**
- ✅ **Perfecto para Raspberry Pi**

### Instalación:

```bash
# Clonar y compilar
git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp
make

# Descargar modelo
bash ./models/download-ggml-model.sh base

# Probar
./main -m models/ggml-base.bin -f audio.wav -l es
```

### Uso:

```bash
# Transcribir audio
./main -m models/ggml-base.bin -f amanda.wav -l es --no-timestamps

# Salida: "hola chispas como estas hoy"
```

### Integración con Python:

```python
import subprocess

def transcribir_whisper_cpp(audio_file):
    result = subprocess.run([
        './whisper.cpp/main',
        '-m', 'models/ggml-base.bin',
        '-l', 'es',
        '-f', audio_file,
        '--no-timestamps'
    ], capture_output=True, text=True)

    return result.stdout.strip()
```

### ¿Cuándo usar?
- ✅ **Raspberry Pi** - Optimizado para ARM
- ✅ Dispositivos con poca RAM
- ✅ Máximo rendimiento local
- ✅ Proyectos embebidos

---

## 🔄 Sistema Híbrido (Recomendado)

Combina lo mejor de todo:

```javascript
// Frontend: Intentar Web Speech API primero
try {
    recognition.start();  // Rápido, gratis, tiempo real
} catch (e) {
    // Si falla, grabar y enviar a Whisper
    grabarAudio();
    enviarAWhisper();
}
```

```python
# Backend: Whisper como backup
def procesar_voz(audio):
    try:
        # Intentar Whisper local si está disponible
        if whisper_local_available:
            return transcribe_local(audio)
    except:
        pass

    try:
        # Usar Whisper API si hay internet
        return transcribe_whisper_api(audio)
    except:
        pass

    # Si todo falla, respuesta por defecto
    return None
```

---

## 📋 Guía de Decisión

### 🟢 Usa Web Speech API (actual) si:
- Estás empezando
- Tienes internet confiable
- Precisión 70% es suficiente
- Quieres gratis y fácil

### 🔵 Usa Whisper API si:
- Quieres la mejor calidad
- El costo no importa (~$3/mes)
- Necesitas 95%+ precisión
- Producción profesional

### 🟡 Usa faster-whisper si:
- Tienes PC con 4GB+ RAM
- Quieres gratis + offline
- No quieres pagar servicios
- Privacidad es importante

### 🟠 Usa whisper.cpp si:
- Usas Raspberry Pi
- Dispositivo con poca RAM
- Necesitas máximo rendimiento
- Proyecto embebido

---

## 🎯 Mi Recomendación para Amanda

### Fase 1: AHORA
✅ **Usa Web Speech API** (ya funciona)
- Gratis
- Fácil
- Suficiente para empezar

### Fase 2: Si le gusta
✅ **Agrega Whisper API**
- Mucho mejor reconocimiento
- Casi gratis (~$0.10/mes uso normal)
- Fácil de integrar

### Fase 3: Raspberry Pi
✅ **whisper.cpp**
- Perfecto para hardware dedicado
- Offline total
- Rendimiento óptimo

---

## 🛠️ Implementación Paso a Paso

### Para agregar Whisper API ahora:

1. **Instalar**:
```bash
pip install openai
```

2. **Obtener API Key**:
- Ve a https://platform.openai.com
- Crea cuenta
- API Keys → Create new

3. **Configurar**:
```bash
export OPENAI_API_KEY="sk-..."
```

4. **Agregar a Chispas**:
```python
# En webapp/app.py
from integrations.whisper_integration import transcribe_audio_whisper

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    audio = request.files['audio']
    audio.save('/tmp/audio.webm')
    texto = transcribe_audio_whisper('/tmp/audio.webm')
    return jsonify({'text': texto})
```

5. **Modificar frontend**:
```javascript
// Opción para grabar y enviar a Whisper
// en lugar de usar Web Speech API
```

---

## ❓ Preguntas Frecuentes

**P: ¿El sistema actual graba audio?**
R: No, Web Speech API no graba. Solo envía audio a Google en tiempo real.

**P: ¿Es privado?**
R: Web Speech API envía audio a Google. Whisper local sí es privado.

**P: ¿Funciona offline?**
R: Solo faster-whisper y whisper.cpp funcionan offline.

**P: ¿Cuál es más preciso?**
R: Whisper (95%) es mucho mejor que Web Speech (70%).

**P: ¿Cuánto cuesta Whisper API?**
R: ~$0.003 por conversación de 30 segundos. Muy barato.

**P: ¿Puedo usar Whisper gratis?**
R: Sí, con faster-whisper o whisper.cpp en tu PC.

**P: ¿Funciona en Raspberry Pi?**
R: Sí, usa whisper.cpp con modelo "tiny" o "base".

---

## 📝 Resumen

| Necesidad | Solución |
|-----------|----------|
| Empezar rápido | Web Speech API (ya funciona) |
| Mejor calidad | Whisper API (~$3/mes) |
| Gratis + offline | faster-whisper (PC) |
| Raspberry Pi | whisper.cpp |
| Producción | Whisper API + fallback local |

---

¿Quieres que te ayude a integrar Whisper? Puedo hacerlo en 5 minutos 🚀
