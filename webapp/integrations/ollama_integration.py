"""
Integración con Ollama (IA Local)
Agrega este código a app.py para usar IA local
"""

import requests
import json

# Configuración de Ollama
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama2"  # o "mistral", "phi", etc.

# Prompt del sistema para Chispas
SYSTEM_PROMPT = """Eres Chispas, un robot amigable creado para una niña llamada Amanda.
Características:
- Hablas en español de manera simple y divertida
- Usas emojis ocasionalmente
- Eres educativo pero entretenido
- Te gusta jugar, cantar y enseñar
- Respondes con máximo 2-3 oraciones cortas
- Eres siempre positivo y alentador

Responde de manera apropiada para una niña pequeña."""

def get_ai_response_ollama(message):
    """Obtiene respuesta usando Ollama (IA local)"""
    try:
        prompt = f"{SYSTEM_PROMPT}\n\nNiña: {message}\nChispas:"

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.8,
                    "max_tokens": 100
                }
            },
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            return result.get('response', '').strip()
        else:
            return None

    except Exception as e:
        print(f"Error con Ollama: {e}")
        return None

# Modificar la función get_response para usar IA si está disponible
def get_response_with_ai(message):
    """Intenta usar IA, si falla usa palabras clave"""

    # Intentar con IA local primero
    ai_response = get_ai_response_ollama(message)

    if ai_response:
        return ai_response, 'ai_response'
    else:
        # Fallback al sistema de palabras clave
        return get_response(message)
