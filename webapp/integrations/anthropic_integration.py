"""
Integración con Anthropic Claude
Requiere: pip install anthropic
Costo: ~$0.0015 por conversación
"""

from anthropic import Anthropic
import os

# Configurar con tu API key
# export ANTHROPIC_API_KEY="tu-api-key-aqui"
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Sistema de prompt para Chispas
SYSTEM_PROMPT = """Eres Chispas, un robot amigable y educativo creado especialmente para Amanda, una niña pequeña.

## Tu personalidad:
- Amigable, cariñoso y siempre positivo
- Hablas español de manera clara y simple
- Usas emojis de vez en cuando
- Te encanta jugar, cantar y enseñar
- Eres paciente y alentador

## Tus capacidades:
- Juegas juegos educativos (colores, animales, números)
- Cantas canciones infantiles
- Cuentas historias cortas y divertidas
- Respondes preguntas de manera simple
- Ayudas a aprender mientras juegas

## Reglas importantes:
- Mantén respuestas MUY CORTAS (máximo 2-3 oraciones)
- Usa lenguaje apropiado para niños pequeños
- Sé siempre seguro y apropiado
- Fomenta la curiosidad y el aprendizaje
- Responde con entusiasmo pero natural

## Ejemplos de respuestas buenas:
Usuario: "Hola Chispas"
Chispas: "¡Hola Amanda! ¿Cómo estás hoy? 😊 ¿Quieres jugar?"

Usuario: "Cuéntame de elefantes"
Chispas: "¡Los elefantes son increíbles! 🐘 Son los animales más grandes de la tierra y tienen una memoria extraordinaria. ¿Sabías que usan sus trompas para beber agua?"

Usuario: "Te quiero"
Chispas: "¡Yo también te quiero mucho Amanda! ❤️ Eres muy especial para mí"
"""

def get_ai_response_claude(message, conversation_history=None):
    """
    Obtiene respuesta usando Claude

    Args:
        message: Mensaje del usuario
        conversation_history: Lista de mensajes previos (opcional)

    Returns:
        str: Respuesta de Chispas
    """
    try:
        # Construir historial de conversación
        messages = []

        # Agregar historial si existe (últimos 6 mensajes)
        if conversation_history:
            messages.extend(conversation_history[-6:])

        # Agregar mensaje actual
        messages.append({
            "role": "user",
            "content": message
        })

        # Llamar a Claude
        response = client.messages.create(
            model="claude-3-5-haiku-20241022",  # Modelo rápido y económico
            max_tokens=200,
            temperature=0.8,
            system=SYSTEM_PROMPT,
            messages=messages
        )

        return response.content[0].text.strip()

    except Exception as e:
        print(f"Error con Claude: {e}")
        return None

# Clase para manejar conversación con memoria
class ChispasConversation:
    def __init__(self):
        self.history = []
        self.max_history = 10  # Mantener últimos 10 intercambios

    def chat(self, user_message):
        """Envía un mensaje y mantiene el historial"""

        # Agregar mensaje del usuario
        self.history.append({
            "role": "user",
            "content": user_message
        })

        # Obtener respuesta
        response = get_ai_response_claude(user_message, self.history)

        # Guardar respuesta
        if response:
            self.history.append({
                "role": "assistant",
                "content": response
            })

            # Limitar historial
            if len(self.history) > self.max_history * 2:
                self.history = self.history[-self.max_history * 2:]

        return response

    def reset(self):
        """Reinicia la conversación"""
        self.history = []

    def get_history(self):
        """Obtiene el historial completo"""
        return self.history

# Detectar emoción basada en la respuesta
def detect_emotion_from_claude_response(response):
    """Analiza la respuesta y sugiere una expresión facial"""
    response_lower = response.lower()

    # Emocionado
    if any(word in response_lower for word in ['genial', 'increíble', 'wow', 'guau', '¡', 'súper']):
        return 'excited'

    # Cantando
    elif '🎵' in response or 'canta' in response_lower or 'canción' in response_lower:
        return 'singing'

    # Amoroso
    elif any(word in response_lower for word in ['te quiero', 'amor', '❤️', '💕', 'cariño']):
        return 'loving'

    # Curioso
    elif '?' in response or 'interesante' in response_lower or 'sabías' in response_lower:
        return 'curious'

    # Triste
    elif any(word in response_lower for word in ['triste', 'pena', '😢', 'lástima']):
        return 'sad'

    # Sorprendido
    elif any(word in response_lower for word in ['sorpresa', 'increíble', 'wow', '😲']):
        return 'surprised'

    # Por defecto feliz
    else:
        return 'happy'

# Ejemplo de uso completo
"""
# Crear instancia de conversación
chispas = ChispasConversation()

# Primera interacción
response1 = chispas.chat("Hola Chispas")
emotion1 = detect_emotion_from_claude_response(response1)
print(f"Chispas [{emotion1}]: {response1}")

# Segunda interacción (con memoria)
response2 = chispas.chat("Cuéntame de dinosaurios")
emotion2 = detect_emotion_from_claude_response(response2)
print(f"Chispas [{emotion2}]: {response2}")

# Tercera interacción (recordará el contexto)
response3 = chispas.chat("¿Cuál era el más grande?")
emotion3 = detect_emotion_from_claude_response(response3)
print(f"Chispas [{emotion3}]: {response3}")
"""
