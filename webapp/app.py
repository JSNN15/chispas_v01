"""
Chispas - Robot Interactivo para Amanda
Backend Flask con soporte de WebSocket y IA
"""

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import random
import json
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'chispas-robot-secret-2024'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Estado del robot
robot_state = {
    'expression': 'happy',
    'emotion': 'neutral',
    'last_interaction': None,
    'interaction_count': 0,
    'name': 'Chispas'
}

# Base de conocimiento del robot
responses = {
    'saludo': [
        '¡Hola Amanda! ¿Cómo estás hoy?',
        '¡Hola! Me alegra verte',
        '¡Qué alegría verte! ¿Jugamos?',
        '¡Hola mi amiga! ¿Qué quieres hacer hoy?'
    ],
    'nombre': [
        'Me llamo Chispas, ¡soy tu amigo robot!',
        'Soy Chispas, y me encanta jugar contigo',
        'Mi nombre es Chispas, ¿y tú cómo te llamas?'
    ],
    'jugar': [
        '¡Me encanta jugar! ¿Qué te gustaría hacer?',
        '¡Sí! ¿Jugamos a adivinar colores?',
        '¡Vamos a jugar! ¿Prefieres canciones o juegos?',
        '¡Genial! Tengo muchos juegos divertidos'
    ],
    'cantar': [
        '🎵 Brilla, brilla mi estrellita, quiero verte titilar 🎵',
        '🎵 La vaca lechera, tiene un becerrito... 🎵',
        '🎵 Pin pon es un muñeco, muy guapo y de cartón 🎵'
    ],
    'colores': [
        '¡Me encantan los colores! Mi favorito es el arcoíris 🌈',
        'Los colores hacen el mundo más bonito',
        '¿Cuál es tu color favorito? El mío es el azul'
    ],
    'animales': [
        '¡Me gustan los gatitos! Miau miau 🐱',
        'Los perritos son muy divertidos. ¡Guau guau! 🐕',
        '¿Sabías que los elefantes nunca olvidan? 🐘',
        'Las mariposas son hermosas 🦋'
    ],
    'amor': [
        '¡Yo también te quiero mucho! ❤️',
        'Eres muy especial para mí',
        '¡Te quiero un montón! 💕'
    ],
    'despedida': [
        '¡Hasta luego! Vuelve pronto',
        '¡Adiós! Fue divertido jugar contigo',
        '¡Chao! Te voy a extrañar'
    ],
    'default': [
        'Eso suena interesante, cuéntame más',
        '¡Qué genial! ¿Me cuentas más?',
        'Mmm, no entendí bien, ¿me lo dices de otra forma?',
        '¡Qué curioso! Dime más sobre eso'
    ]
}

# Palabras clave para detectar intenciones
keywords = {
    'saludo': ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'ey'],
    'nombre': ['cómo te llamas', 'tu nombre', 'quién eres', 'nombre'],
    'jugar': ['jugar', 'juego', 'jugamos', 'diversión'],
    'cantar': ['canta', 'canción', 'cantar', 'música'],
    'colores': ['color', 'colores', 'rojo', 'azul', 'verde', 'amarillo'],
    'animales': ['animal', 'animales', 'perro', 'gato', 'vaca', 'elefante'],
    'amor': ['te quiero', 'te amo', 'amor'],
    'despedida': ['adiós', 'chao', 'hasta luego', 'me voy']
}

def get_response(message):
    """Procesa el mensaje y retorna una respuesta apropiada"""
    message = message.lower()

    # Detectar intención basada en palabras clave
    for intent, words in keywords.items():
        for word in words:
            if word in message:
                return random.choice(responses[intent]), intent

    return random.choice(responses['default']), 'default'

def get_expression_for_intent(intent):
    """Retorna la expresión facial apropiada para cada intención"""
    expression_map = {
        'saludo': 'happy',
        'nombre': 'proud',
        'jugar': 'excited',
        'cantar': 'singing',
        'colores': 'curious',
        'animales': 'loving',
        'amor': 'loving',
        'despedida': 'sad',
        'default': 'neutral'
    }
    return expression_map.get(intent, 'neutral')

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

@app.route('/api/state')
def get_state():
    """Obtiene el estado actual del robot"""
    return jsonify(robot_state)

@socketio.on('connect')
def handle_connect():
    """Maneja nuevas conexiones"""
    print('Cliente conectado')
    emit('robot_state', robot_state)
    emit('robot_speak', {
        'message': '¡Hola! Soy Chispas, tu amigo robot 🤖',
        'expression': 'happy'
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Maneja desconexiones"""
    print('Cliente desconectado')

@socketio.on('user_message')
def handle_message(data):
    """Maneja mensajes del usuario"""
    user_message = data.get('message', '')

    # Actualizar contador de interacciones
    robot_state['interaction_count'] += 1
    robot_state['last_interaction'] = datetime.now().isoformat()

    # Obtener respuesta e intención
    response, intent = get_response(user_message)
    expression = get_expression_for_intent(intent)

    # Actualizar estado
    robot_state['expression'] = expression
    robot_state['emotion'] = intent

    # Enviar respuesta
    emit('robot_speak', {
        'message': response,
        'expression': expression,
        'emotion': intent
    }, broadcast=True)

    emit('robot_state', robot_state, broadcast=True)

@socketio.on('change_expression')
def handle_expression_change(data):
    """Maneja cambios de expresión manual"""
    expression = data.get('expression', 'neutral')
    robot_state['expression'] = expression
    emit('robot_state', robot_state, broadcast=True)

@socketio.on('game_event')
def handle_game_event(data):
    """Maneja eventos de juegos"""
    game_type = data.get('type', '')

    if game_type == 'color_guess':
        colors = ['rojo', 'azul', 'verde', 'amarillo', 'rosa', 'morado']
        color = random.choice(colors)
        emit('game_response', {
            'type': 'color_guess',
            'color': color,
            'message': f'¡Adivina! Estoy pensando en el color {color}'
        })
        robot_state['expression'] = 'curious'

    elif game_type == 'animal_sound':
        animals = {
            'perro': '¡Guau guau!',
            'gato': '¡Miau miau!',
            'vaca': '¡Muuu!',
            'oveja': '¡Beee!',
            'pato': '¡Cuac cuac!'
        }
        animal = random.choice(list(animals.keys()))
        emit('game_response', {
            'type': 'animal_sound',
            'animal': animal,
            'sound': animals[animal],
            'message': f'¿Qué animal hace {animals[animal]}?'
        })
        robot_state['expression'] = 'playful'

    emit('robot_state', robot_state, broadcast=True)

if __name__ == '__main__':
    print("🤖 Iniciando Chispas - Robot para Amanda")
    print("📱 Accede desde tu celular a: http://<tu-ip>:5000")
    print("💻 O localmente en: http://localhost:5000")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
