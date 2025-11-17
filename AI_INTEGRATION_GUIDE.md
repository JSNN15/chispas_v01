# 🧠 Guía de Integración de IA para Chispas

## 📊 Comparación de Opciones

| Característica | Actual (Keywords) | Ollama (Local) | OpenAI GPT | Anthropic Claude |
|----------------|-------------------|----------------|------------|------------------|
| **Costo** | Gratis | Gratis | ~$0.002/msg | ~$0.002/msg |
| **Velocidad** | Instantáneo | 1-3s | 0.5-2s | 0.5-2s |
| **Internet** | No necesita | No necesita | Necesita | Necesita |
| **Inteligencia** | Básica | Buena | Excelente | Excelente |
| **Memoria** | No | Sí | Sí | Sí |
| **Privacidad** | Total | Total | Datos en OpenAI | Datos en Anthropic |
| **Configuración** | Ya funciona | Media | Fácil | Fácil |

---

## 🎯 Cómo Funciona Actualmente (Sin IA)

### Sistema de Palabras Clave

Chispas usa un sistema simple de **detección de palabras clave**:

```python
# Ejemplo interno:
Usuario: "Hola Chispas, ¿cómo estás?"
              ↓
Sistema busca palabra clave: "hola"
              ↓
Identifica intención: "saludo"
              ↓
Selecciona respuesta aleatoria: "¡Hola Amanda! ¿Cómo estás hoy?"
              ↓
Cambia expresión: "happy"
              ↓
Habla con voz
```

**Ventajas:**
- ✅ Funciona offline
- ✅ Respuestas instantáneas
- ✅ Totalmente gratis
- ✅ Seguro para niños (respuestas controladas)
- ✅ No envía datos a terceros

**Limitaciones:**
- ❌ Solo reconoce palabras específicas
- ❌ No entiende contexto
- ❌ Respuestas limitadas y repetitivas
- ❌ No puede responder preguntas complejas

---

## 🚀 Opción 1: Ollama (IA Local - GRATIS)

### ¿Qué es Ollama?
Es como tener ChatGPT en tu computadora, completamente **gratis y privado**.

### Ventajas:
- ✅ **Gratis** - No pagas nada
- ✅ **Privado** - Todo queda en tu PC
- ✅ **Offline** - No necesita internet
- ✅ **Ilimitado** - Sin límites de uso

### Desventajas:
- ⚠️ Requiere una PC/Raspberry Pi con 8GB+ RAM
- ⚠️ Un poco más lento que servicios en la nube
- ⚠️ Necesita configuración inicial

### Instalación:

**1. Instalar Ollama:**
```bash
# Linux/Mac
curl -fsSL https://ollama.com/install.sh | sh

# Windows: Descargar de https://ollama.com/download
```

**2. Descargar un modelo (elige uno):**
```bash
# Pequeño y rápido (2GB RAM) - Español regular
ollama pull phi3

# Mediano (4GB RAM) - Buen español
ollama pull mistral

# Grande (8GB RAM) - Mejor español
ollama pull llama2
```

**3. Probar que funciona:**
```bash
ollama run mistral "Hola, ¿cómo estás?"
```

**4. Integrar con Chispas:**

Modifica `webapp/app.py`, agrega al inicio:
```python
from integrations.ollama_integration import get_response_with_ai
```

Y reemplaza en la función `handle_message`:
```python
# Antes:
response, intent = get_response(user_message)

# Después:
response, intent = get_response_with_ai(user_message)
```

---

## 💰 Opción 2: OpenAI GPT (De pago)

### ¿Qué es?
El mismo ChatGPT que conoces, pero integrado en Chispas.

### Ventajas:
- ✅ **Muy inteligente** - Conversaciones naturales
- ✅ **Rápido** - Respuestas en < 1 segundo
- ✅ **Memoria** - Recuerda la conversación
- ✅ **Multiidioma** - Perfecto español

### Costo:
- **GPT-4o-mini**: ~$0.0015 por conversación (100 conversaciones = $0.15)
- **GPT-4o**: ~$0.015 por conversación (más inteligente pero más caro)

### Instalación:

**1. Crear cuenta en OpenAI:**
- Ve a https://platform.openai.com
- Crea una cuenta
- Agrega método de pago (mínimo $5)

**2. Obtener API Key:**
- Ve a https://platform.openai.com/api-keys
- Crea una nueva key
- Cópiala (la verás solo una vez)

**3. Instalar librería:**
```bash
pip install openai
```

**4. Configurar la key:**
```bash
# Linux/Mac
export OPENAI_API_KEY="tu-key-aqui"

# Windows
set OPENAI_API_KEY=tu-key-aqui

# O crear archivo .env
echo "OPENAI_API_KEY=tu-key-aqui" > webapp/.env
```

**5. Integrar con Chispas:**

Modifica `webapp/app.py`:
```python
# Agregar al inicio
from integrations.openai_integration import get_ai_response_openai, detect_emotion_from_response

# Crear historial global
conversation_history = []

# En handle_message, reemplazar:
# Antes:
response, intent = get_response(user_message)

# Después:
conversation_history.append({"role": "user", "content": user_message})
response = get_ai_response_openai(user_message, conversation_history)
conversation_history.append({"role": "assistant", "content": response})
emotion = detect_emotion_from_response(response)
expression = get_expression_for_intent(emotion)
```

---

## 🎓 Opción 3: Anthropic Claude (De pago)

### ¿Qué es?
Claude es la IA de Anthropic, excelente con niños y muy segura.

### Ventajas:
- ✅ **Muy inteligente** - A veces mejor que GPT
- ✅ **Seguro** - Entrenado para ser apropiado
- ✅ **Contexto largo** - Recuerda más conversación
- ✅ **Español nativo** - Excelente español

### Costo:
- **Claude Haiku**: ~$0.0008 por conversación (MUY barato)
- **Claude Sonnet**: ~$0.006 por conversación (más inteligente)

### Instalación:

**1. Crear cuenta:**
- Ve a https://console.anthropic.com
- Crea cuenta
- Agrega método de pago (mínimo $5)

**2. Obtener API Key:**
- Ve a Settings > API Keys
- Crea nueva key
- Cópiala

**3. Instalar librería:**
```bash
pip install anthropic
```

**4. Configurar:**
```bash
export ANTHROPIC_API_KEY="tu-key-aqui"
```

**5. Integrar:**

Modifica `webapp/app.py`:
```python
from integrations.anthropic_integration import ChispasConversation, detect_emotion_from_claude_response

# Crear instancia global
chispas_ai = ChispasConversation()

# En handle_message:
response = chispas_ai.chat(user_message)
emotion = detect_emotion_from_claude_response(response)
expression = get_expression_for_intent(emotion)
```

---

## 🔀 Sistema Híbrido (Recomendado)

Combina lo mejor de ambos mundos:

```python
def get_smart_response(message):
    """Usa IA si está disponible, sino keywords"""

    # Intentar con IA (Ollama, OpenAI o Claude)
    try:
        if OLLAMA_ENABLED:
            response = get_ai_response_ollama(message)
            if response:
                return response, detect_emotion(response)
    except:
        pass

    try:
        if OPENAI_ENABLED:
            response = get_ai_response_openai(message)
            if response:
                return response, detect_emotion(response)
    except:
        pass

    # Fallback a keywords si IA falla
    return get_response(message)
```

**Ventajas:**
- Si tienes internet → usa IA en la nube
- Si estás offline → usa Ollama o keywords
- Si se acaban los créditos → fallback automático

---

## 📝 Resumen y Recomendaciones

### Para empezar (ahora):
✅ **Usa el sistema actual** - Ya funciona bien para niños pequeños

### Si quieres IA gratis:
✅ **Usa Ollama** - Si tienes una PC decente

### Si quieres la mejor experiencia:
✅ **Usa Claude Haiku** - Muy barato (~$0.08 por 100 conversaciones)
✅ **Usa GPT-4o-mini** - También muy barato

### Para producción:
✅ **Sistema Híbrido** - Lo mejor de todo

---

## 🎯 Próximos Pasos

1. **Prueba el sistema actual** - Funciona bien sin IA
2. **Si quieres IA gratis** - Instala Ollama
3. **Si quieres la mejor IA** - Usa Claude Haiku ($0.001/msg)
4. **Agrega memoria** - Para que recuerde conversaciones
5. **Personaliza prompts** - Ajusta la personalidad de Chispas

---

## ❓ FAQ

**P: ¿Cuánto cuesta usar IA en la nube?**
R: ~$0.10-0.20 al mes para uso normal de una niña

**P: ¿Es seguro para niños?**
R: Sí, los prompts están diseñados para respuestas apropiadas

**P: ¿Funciona offline?**
R: Solo con Ollama o el sistema de keywords actual

**P: ¿Cuál es mejor para Amanda?**
R: Empieza sin IA. Si le gusta, agrega Claude Haiku (muy barato)

**P: ¿Necesito saber programar?**
R: No, solo copia/pega el código que te di

---

¿Necesitas ayuda para integrar alguna opción? ¡Dime cuál te interesa! 🚀
