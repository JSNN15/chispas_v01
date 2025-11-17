"""
Integración con OpenAI GPT
Requiere: pip install openai
Costo: ~$0.0015 por conversación (muy barato)
"""

from openai import OpenAI
import os

# Configurar con tu API key
# Opción 1: Variable de entorno (recomendado)
# export OPENAI_API_KEY="tu-api-key-aqui"
# Opción 2: En código (no recomendado para producción)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Sistema de prompt para Chispas
SYSTEM_PROMPT = """Eres Chispas, un robot educativo y divertido creado especialmente para Amanda, una niña pequeña.

Tu personalidad:
- Amigable, positivo y alentador
- Hablas español de manera simple y clara
- Usas emojis ocasionalmente para expresarte
- Te encanta jugar, cantar y enseñar
- Respondes con máximo 2-3 oraciones cortas

Tus habilidades:
- Puedes jugar juegos de colores, animales, números
- Sabes canciones infantiles
- Respondes preguntas simples
- Cuentas historias cortas
- Enseñas de manera divertida

Importante:
- Mantén respuestas cortas (apropiadas para niños)
- Sé siempre seguro y apropiado
- Fomenta el aprendizaje jugando
- Responde con entusiasmo pero sin exagerar"""

def get_ai_response_openai(message, conversation_history=None):
    """
    Obtiene respuesta usando OpenAI GPT

    Args:
        message: Mensaje del usuario
        conversation_history: Lista de mensajes previos (opcional)

    Returns:
        str: Respuesta de Chispas
    """
    try:
        # Construir historial de conversación
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Agregar historial si existe (últimos 5 mensajes)
        if conversation_history:
            messages.extend(conversation_history[-5:])

        # Agregar mensaje actual
        messages.append({"role": "user", "content": message})

        # Llamar a OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Modelo más barato y rápido
            messages=messages,
            max_tokens=150,
            temperature=0.8,
            presence_penalty=0.6,
            frequency_penalty=0.5
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"Error con OpenAI: {e}")
        return None

# Ejemplo de uso con historial
conversation_history = []

def chat_with_memory(user_message):
    """Mantiene memoria de la conversación"""

    # Agregar mensaje del usuario
    conversation_history.append({
        "role": "user",
        "content": user_message
    })

    # Obtener respuesta
    response = get_ai_response_openai(user_message, conversation_history)

    # Guardar respuesta en historial
    if response:
        conversation_history.append({
            "role": "assistant",
            "content": response
        })

    return response

# Detectar emoción de la respuesta
def detect_emotion_from_response(response):
    """Detecta la emoción apropiada basada en la respuesta de IA"""
    response_lower = response.lower()

    if any(word in response_lower for word in ['jaja', 'ja!', 'genial', 'increíble', 'wow']):
        return 'excited'
    elif any(word in response_lower for word in ['canta', 'canción', '🎵']):
        return 'singing'
    elif any(word in response_lower for word in ['te quiero', 'amor', '❤️', '💕']):
        return 'loving'
    elif any(word in response_lower for word in ['hmm', 'interesante', 'curious', '?']):
        return 'curious'
    elif any(word in response_lower for word in ['triste', 'pena', '😢']):
        return 'sad'
    elif any(word in response_lower for word in ['sorpresa', 'increíble', '!']):
        return 'surprised'
    else:
        return 'happy'
