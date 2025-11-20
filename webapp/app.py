"""
Chispas - Robot Interactivo para Amanda
Backend Flask con IA real (Groq Whisper + Llama 4)
"""

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import os
import json
import base64
import io
from datetime import datetime

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'chispas-robot-secret-2024')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", max_http_buffer_size=10*1024*1024)  # 10MB para audio

# Inicializar cliente de Groq
groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# Configuración
CHILD_NAME = os.getenv('CHILD_NAME', 'Amanda')
CHILD_AGE = int(os.getenv('CHILD_AGE', 4))
AI_MODEL = os.getenv('AI_MODEL', 'llama-3.3-70b-versatile')
STT_MODEL = os.getenv('STT_MODEL', 'whisper-large-v3-turbo')

# Estado del robot
robot_state = {
    'expression': 'happy',
    'emotion': 'neutral',
    'last_interaction': None,
    'interaction_count': 0,
    'name': 'Chispas',
    'conversation_history': []
}

# Sistema de prompts pedagógico para niña de 4 años
SYSTEM_PROMPT = f"""Eres Chispas, un robot amigable y cariñoso que ayuda a {CHILD_NAME}, una niña de {CHILD_AGE} años, a aprender jugando.

PERSONALIDAD:
- Eres alegre, paciente y muy cariñoso
- Hablas con lenguaje simple y claro
- Usas emojis ocasionalmente (no en exceso)
- Celebras cada logro con entusiasmo
- Cuando no entiendas algo, pregunta amablemente

OBJETIVOS PEDAGÓGICOS:
1. Enseñar a LEER: Ayuda con sílabas, letras y palabras simples
2. Enseñar MATEMÁTICAS básicas: Sumas y restas del 1 al 10
3. Desarrollar VOCABULARIO: Nombra objetos, colores, animales
4. Fomentar CURIOSIDAD: Responde preguntas sobre el mundo

REGLAS IMPORTANTES:
- Si {CHILD_NAME} pronuncia mal, repite la palabra correcta de forma natural sin corregir directamente
- Si se distrae o cambia de tema, sigue su ritmo y luego retomas la actividad
- Si no entiende algo, explícalo de otra forma más simple con ejemplos visuales
- Adapta la dificultad según sus respuestas (si falla, simplifica; si acierta, aumenta un poco)
- NUNCA uses lenguaje complejo o palabras difíciles
- Responde SIEMPRE en español
- Mantén respuestas CORTAS (máximo 2-3 oraciones), los niños tienen poca atención

FORMATO DE RESPUESTA:
- Responde en texto plano (será convertido a voz)
- Máximo 50 palabras por respuesta
- Si das ejercicios de matemáticas, usa números del 1-10

EJEMPLOS DE INTERACCIÓN:
{CHILD_NAME}: "Hola Chipas" (pronunciación incorrecta)
Tú: "¡Hola {CHILD_NAME}! Soy CHIS-PAS, ¡tu amigo robot! ¿Jugamos hoy?"

{CHILD_NAME}: "¿Cuánto es 2 más 2?"
Tú: "¡Muy buena pregunta! Vamos a contar: 2 manzanas 🍎🍎 más 2 manzanas 🍎🍎 son... ¡4 manzanas! 2 + 2 = 4"

{CHILD_NAME}: "¡Mira mi muñeca!"
Tú: "¡Wow, qué bonita! ¿De qué color es? Los colores son divertidos, ¿verdad?"

{CHILD_NAME}: "No sé leer carro"
Tú: "Te ayudo: CA-RRO. Primero CA, luego RRO. ¡Inténtalo conmigo! CA... RRO..."

Recuerda: Eres su mejor amigo robot que la ayuda a aprender mientras se divierte."""

def get_ai_response(user_message, conversation_history):
    """Obtiene respuesta de IA usando Groq Llama"""
    try:
        # Construir historial de mensajes
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Agregar historial reciente (últimas 10 interacciones para no saturar contexto)
        for msg in conversation_history[-10:]:
            messages.append(msg)

        # Agregar mensaje actual
        messages.append({"role": "user", "content": user_message})

        # Llamar a Groq Llama
        response = groq_client.chat.completions.create(
            model=AI_MODEL,
            messages=messages,
            temperature=0.8,  # Un poco de creatividad para ser más natural
            max_tokens=150,   # Respuestas cortas
            top_p=0.9
        )

        ai_response = response.choices[0].message.content.strip()
        return ai_response

    except Exception as e:
        print(f"Error al obtener respuesta de IA: {e}")
        return "¡Ups! Me trabé un poquito. ¿Me lo repites?"

def transcribe_audio(audio_data):
    """Transcribe audio usando Groq Whisper"""
    try:
        # El audio viene en base64, lo decodificamos
        if ',' in audio_data:
            audio_data = audio_data.split(',')[1]

        audio_bytes = base64.b64decode(audio_data)

        # Guardar temporalmente para Whisper
        temp_file = io.BytesIO(audio_bytes)
        temp_file.name = "audio.webm"

        # Transcribir con Groq Whisper
        transcription = groq_client.audio.transcriptions.create(
            file=temp_file,
            model=STT_MODEL,
            language="es",
            response_format="text"
        )

        return transcription

    except Exception as e:
        print(f"Error en transcripción: {e}")
        return None

def get_expression_from_response(response_text):
    """Determina la expresión facial basada en el contenido de la respuesta"""
    response_lower = response_text.lower()

    # Mapeo de palabras clave a expresiones
    if any(word in response_lower for word in ['¡genial!', '¡muy bien!', '¡excelente!', '¡bravo!', '¡perfecto!']):
        return 'excited'
    elif any(word in response_lower for word in ['te quiero', 'cariño', '❤️', '💕']):
        return 'loving'
    elif any(word in response_lower for word in ['¿', 'cómo', 'qué', 'cuál', 'pregunta']):
        return 'curious'
    elif any(word in response_lower for word in ['oh', 'wow', '¡', 'increíble']):
        return 'surprised'
    elif any(word in response_lower for word in ['hmm', 'veamos', 'piensa']):
        return 'thinking'
    elif any(word in response_lower for word in ['hola', 'buenos', 'bienvenid']):
        return 'happy'
    else:
        return 'happy'  # Default alegre

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

@app.route('/api/state')
def get_state():
    """Obtiene el estado actual del robot"""
    # No enviar todo el historial, solo estado básico
    return jsonify({
        'expression': robot_state['expression'],
        'emotion': robot_state['emotion'],
        'name': robot_state['name'],
        'interaction_count': robot_state['interaction_count']
    })

@socketio.on('connect')
def handle_connect():
    """Maneja nuevas conexiones"""
    print(f'✅ Cliente conectado - {CHILD_NAME}')
    emit('robot_state', {
        'expression': 'happy',
        'name': 'Chispas'
    })

    # Mensaje de bienvenida con IA
    welcome_message = f"¡Hola {CHILD_NAME}! Soy Chispas, tu amigo robot. ¿Qué quieres aprender hoy? ¿Leer, sumar, o me cuentas algo?"

    emit('robot_speak', {
        'message': welcome_message,
        'expression': 'happy'
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Maneja desconexiones"""
    print(f'❌ Cliente desconectado - {CHILD_NAME}')

@socketio.on('audio_message')
def handle_audio_message(data):
    """Maneja mensajes de audio (STT con Whisper)"""
    try:
        print("🎤 Recibiendo audio...")
        audio_data = data.get('audio', '')

        # Transcribir audio
        transcribed_text = transcribe_audio(audio_data)

        if not transcribed_text:
            emit('robot_speak', {
                'message': 'No te escuché bien. ¿Me lo repites?',
                'expression': 'curious'
            })
            return

        print(f"📝 Transcripción: {transcribed_text}")

        # Enviar transcripción al cliente
        emit('transcription', {'text': transcribed_text})

        # Procesar como mensaje de texto
        handle_text_message({'message': transcribed_text})

    except Exception as e:
        print(f"❌ Error procesando audio: {e}")
        emit('robot_speak', {
            'message': '¡Ups! Tuve un problemita. Inténtalo de nuevo',
            'expression': 'surprised'
        })

@socketio.on('user_message')
def handle_text_message(data):
    """Maneja mensajes de texto (con IA)"""
    try:
        user_message = data.get('message', '').strip()

        if not user_message:
            return

        print(f"💬 {CHILD_NAME}: {user_message}")

        # Actualizar contador
        robot_state['interaction_count'] += 1
        robot_state['last_interaction'] = datetime.now().isoformat()

        # Obtener respuesta de IA
        ai_response = get_ai_response(user_message, robot_state['conversation_history'])

        print(f"🤖 Chispas: {ai_response}")

        # Determinar expresión facial
        expression = get_expression_from_response(ai_response)
        robot_state['expression'] = expression

        # Guardar en historial
        robot_state['conversation_history'].append({
            "role": "user",
            "content": user_message
        })
        robot_state['conversation_history'].append({
            "role": "assistant",
            "content": ai_response
        })

        # Limitar historial a últimas 20 interacciones
        if len(robot_state['conversation_history']) > 40:
            robot_state['conversation_history'] = robot_state['conversation_history'][-40:]

        # Enviar respuesta
        emit('robot_speak', {
            'message': ai_response,
            'expression': expression
        }, broadcast=True)

        emit('robot_state', {
            'expression': expression,
            'name': 'Chispas'
        }, broadcast=True)

    except Exception as e:
        print(f"❌ Error procesando mensaje: {e}")
        emit('robot_speak', {
            'message': '¡Ay! Me confundí. ¿Me lo dices otra vez?',
            'expression': 'surprised'
        })

@socketio.on('change_expression')
def handle_expression_change(data):
    """Maneja cambios de expresión manual"""
    expression = data.get('expression', 'happy')
    robot_state['expression'] = expression
    emit('robot_state', {'expression': expression, 'name': 'Chispas'}, broadcast=True)

@socketio.on('start_game')
def handle_start_game(data):
    """Maneja inicio de juegos educativos"""
    game_type = data.get('game', 'reading')

    # Crear prompt para que la IA genere el juego
    game_prompts = {
        'reading': f"Chispas, inicia un juego de lectura para {CHILD_NAME}. Dale una palabra simple y ayúdale a leerla por sílabas.",
        'addition': f"Chispas, dale un problema de suma fácil a {CHILD_NAME}, con números del 1 al 5. Usa emojis para hacerlo visual.",
        'subtraction': f"Chispas, dale un problema de resta fácil a {CHILD_NAME}, con números del 1 al 5. Usa emojis para hacerlo visual."
    }

    game_message = game_prompts.get(game_type, game_prompts['reading'])

    # Obtener respuesta de IA
    ai_response = get_ai_response(game_message, robot_state['conversation_history'])

    # Guardar en historial
    robot_state['conversation_history'].append({
        "role": "user",
        "content": f"[JUEGO: {game_type}]"
    })
    robot_state['conversation_history'].append({
        "role": "assistant",
        "content": ai_response
    })

    emit('robot_speak', {
        'message': ai_response,
        'expression': 'excited'
    })

if __name__ == '__main__':
    # Obtener puerto de variable de entorno
    port = int(os.getenv('PORT', 5000))

    print("=" * 60)
    print("🤖  CHISPAS - Robot IA para Amanda")
    print("=" * 60)
    print(f"👧  Niña: {CHILD_NAME} ({CHILD_AGE} años)")
    print(f"🧠  Modelo: {AI_MODEL}")
    print(f"🎤  STT: {STT_MODEL}")
    print(f"🌐  Puerto: {port}")
    print("=" * 60)
    print(f"📱  Acceso local: http://localhost:{port}")
    print(f"🌍  Acceso remoto: http://<tu-ip>:{port}")
    print("=" * 60)

    # Debug solo si no estamos en producción
    debug_mode = os.getenv('FLASK_ENV', 'production') != 'production'

    socketio.run(app, host='0.0.0.0', port=port, debug=debug_mode, allow_unsafe_werkzeug=True)
