/**
 * Chispas Robot - Aplicación principal
 * Maneja la interacción, voz, WebSocket y juegos
 */

// Variables globales
let socket;
let robotFace;
let recognition;
let synthesis = window.speechSynthesis;
let isListening = false;

// Elementos del DOM
const voiceBtn = document.getElementById('voiceBtn');
const voiceBtnText = document.getElementById('voiceBtnText');
const voiceStatus = document.getElementById('voiceStatus');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');
const robotMessage = document.getElementById('robotMessage');
const statusText = document.getElementById('statusText');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 Inicializando Chispas...');

    // Inicializar cara del robot
    robotFace = new RobotFace('robotFace');

    // Inicializar WebSocket
    initWebSocket();

    // Inicializar reconocimiento de voz
    initSpeechRecognition();

    // Inicializar event listeners
    initEventListeners();

    // Mensaje de bienvenida
    speak('¡Hola! Soy Chispas, tu amigo robot. ¿Cómo estás hoy?');
});

// ========== WEBSOCKET ==========
function initWebSocket() {
    socket = io();

    socket.on('connect', () => {
        console.log('✅ Conectado al servidor');
        statusText.textContent = 'Conectado';
        updateMessage('¡Conectado! Estoy listo para jugar 😊');
    });

    socket.on('disconnect', () => {
        console.log('❌ Desconectado del servidor');
        statusText.textContent = 'Desconectado';
        updateMessage('Ups, perdí la conexión 😕');
    });

    socket.on('robot_state', (state) => {
        console.log('Estado del robot:', state);
        if (state.expression) {
            robotFace.setExpression(state.expression);
        }
    });

    socket.on('robot_speak', (data) => {
        console.log('Robot habla:', data);
        updateMessage(data.message);
        if (data.expression) {
            robotFace.setExpression(data.expression);
        }
        speak(data.message);
    });

    socket.on('game_response', (data) => {
        console.log('Respuesta de juego:', data);
        handleGameResponse(data);
    });
}

// ========== RECONOCIMIENTO DE VOZ ==========
function initSpeechRecognition() {
    // Verificar soporte de navegador
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn('⚠️ Reconocimiento de voz no soportado');
        voiceStatus.textContent = 'Reconocimiento de voz no disponible en este navegador';
        voiceBtn.disabled = true;
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        console.log('🎤 Escuchando...');
        isListening = true;
        voiceBtn.classList.add('listening');
        voiceBtnText.textContent = 'Escuchando...';
        voiceStatus.textContent = '🎤 Te estoy escuchando...';
        robotFace.setExpression('curious');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Reconocido:', transcript);
        textInput.value = transcript;
        sendMessage(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
        let errorMsg = 'Error al escuchar';

        switch (event.error) {
            case 'no-speech':
                errorMsg = 'No escuché nada, intenta de nuevo';
                break;
            case 'audio-capture':
                errorMsg = 'No se puede acceder al micrófono';
                break;
            case 'not-allowed':
                errorMsg = 'Permiso de micrófono denegado';
                break;
            default:
                errorMsg = `Error: ${event.error}`;
        }

        voiceStatus.textContent = errorMsg;
        stopListening();
    };

    recognition.onend = () => {
        console.log('🎤 Dejé de escuchar');
        stopListening();
    };
}

function startListening() {
    if (!recognition) {
        alert('Reconocimiento de voz no disponible');
        return;
    }

    try {
        recognition.start();
    } catch (e) {
        console.error('Error al iniciar reconocimiento:', e);
    }
}

function stopListening() {
    isListening = false;
    voiceBtn.classList.remove('listening');
    voiceBtnText.textContent = 'Hablar';
    voiceStatus.textContent = 'Toca el micrófono para hablar';
}

// ========== SÍNTESIS DE VOZ ==========
function speak(text) {
    // Cancelar cualquier voz anterior
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9; // Velocidad un poco más lenta para niños
    utterance.pitch = 1.2; // Tono más agudo (voz más infantil)

    // Intentar usar una voz femenina española si está disponible
    const voices = synthesis.getVoices();
    const spanishVoice = voices.find(voice =>
        voice.lang.startsWith('es') && voice.name.includes('Female')
    ) || voices.find(voice => voice.lang.startsWith('es'));

    if (spanishVoice) {
        utterance.voice = spanishVoice;
    }

    utterance.onstart = () => {
        console.log('🗣️ Hablando...');
    };

    utterance.onend = () => {
        console.log('✅ Terminé de hablar');
    };

    utterance.onerror = (event) => {
        console.error('Error al hablar:', event);
    };

    synthesis.speak(utterance);
}

// ========== MENSAJERÍA ==========
function sendMessage(message) {
    if (!message || message.trim() === '') return;

    console.log('📤 Enviando mensaje:', message);
    socket.emit('user_message', { message: message });

    // Limpiar input
    textInput.value = '';

    // Actualizar UI
    updateMessage('Déjame pensar...');
    robotFace.setExpression('curious');
}

function updateMessage(text) {
    robotMessage.textContent = text;

    // Agregar animación
    const bubble = document.getElementById('speechBubble');
    bubble.style.animation = 'none';
    setTimeout(() => {
        bubble.style.animation = 'fadeIn 0.5s ease-out';
    }, 10);
}

// ========== EVENT LISTENERS ==========
function initEventListeners() {
    // Botón de voz
    voiceBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            startListening();
        }
    });

    // Botón enviar
    sendBtn.addEventListener('click', () => {
        const message = textInput.value;
        sendMessage(message);
    });

    // Enter en input de texto
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = textInput.value;
            sendMessage(message);
        }
    });

    // Botones de expresión
    document.querySelectorAll('.btn-expression').forEach(btn => {
        btn.addEventListener('click', () => {
            const expression = btn.dataset.expression;
            console.log('Cambio de expresión:', expression);
            robotFace.setExpression(expression);
            socket.emit('change_expression', { expression: expression });

            // Mensaje según expresión
            const messages = {
                happy: '¡Estoy muy feliz! 😊',
                excited: '¡Qué emoción! 🤩',
                sad: 'Me siento triste... 😢',
                surprised: '¡Wow, qué sorpresa! 😲',
                loving: '¡Te quiero mucho! 😍',
                sleepy: 'Tengo sueño... 😴'
            };
            updateMessage(messages[expression] || 'Nueva expresión');
        });
    });

    // Botones de juegos
    document.querySelectorAll('.btn-game').forEach(btn => {
        btn.addEventListener('click', () => {
            const game = btn.dataset.game;
            console.log('Iniciando juego:', game);
            startGame(game);
        });
    });
}

// ========== JUEGOS ==========
function startGame(gameType) {
    robotFace.setExpression('excited');

    switch (gameType) {
        case 'colors':
            startColorGame();
            break;
        case 'animals':
            startAnimalGame();
            break;
        case 'songs':
            startSongGame();
            break;
        case 'numbers':
            startNumberGame();
            break;
        default:
            updateMessage('¡Juguemos!');
    }
}

function startColorGame() {
    const colors = [
        { name: 'rojo', emoji: '🔴' },
        { name: 'azul', emoji: '🔵' },
        { name: 'verde', emoji: '🟢' },
        { name: 'amarillo', emoji: '🟡' },
        { name: 'rosa', emoji: '🌸' },
        { name: 'morado', emoji: '🟣' }
    ];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    updateMessage(`🎨 ¿De qué color es esto? ${randomColor.emoji}`);
    speak(`¿De qué color es esto? ${randomColor.emoji}`);

    // Dar tiempo para responder
    setTimeout(() => {
        updateMessage(`¡Es ${randomColor.name}! ${randomColor.emoji}`);
        speak(`¡Es ${randomColor.name}!`);
    }, 5000);
}

function startAnimalGame() {
    const animals = [
        { name: 'perro', sound: '¡Guau guau!', emoji: '🐕' },
        { name: 'gato', sound: '¡Miau miau!', emoji: '🐱' },
        { name: 'vaca', sound: '¡Muuu!', emoji: '🐄' },
        { name: 'oveja', sound: '¡Beee!', emoji: '🐑' },
        { name: 'pato', sound: '¡Cuac cuac!', emoji: '🦆' },
        { name: 'león', sound: '¡Grrr!', emoji: '🦁' }
    ];

    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    updateMessage(`${randomAnimal.emoji} ¿Qué animal hace ${randomAnimal.sound}?`);
    speak(`¿Qué animal hace ${randomAnimal.sound}?`);

    setTimeout(() => {
        updateMessage(`¡Es un ${randomAnimal.name}! ${randomAnimal.emoji}`);
        speak(`¡Es un ${randomAnimal.name}!`);
        robotFace.setExpression('happy');
    }, 5000);
}

function startSongGame() {
    const songs = [
        '🎵 Brilla, brilla mi estrellita, quiero verte titilar 🎵',
        '🎵 La vaca lechera, tiene un becerrito, que le da las leches y le da quesito 🎵',
        '🎵 Pin pon es un muñeco, muy guapo y de cartón 🎵',
        '🎵 Cinco lobitos tiene la loba, cinco lobitos detrás de la escoba 🎵',
        '🎵 Tengo una muñeca vestida de azul 🎵'
    ];

    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    updateMessage(randomSong);
    speak(randomSong);
    robotFace.setExpression('singing');
}

function startNumberGame() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const sum = num1 + num2;

    updateMessage(`🔢 ¿Cuánto es ${num1} + ${num2}?`);
    speak(`¿Cuánto es ${num1} más ${num2}?`);

    setTimeout(() => {
        updateMessage(`¡La respuesta es ${sum}! 🎉`);
        speak(`¡La respuesta es ${sum}!`);
        robotFace.setExpression('excited');
    }, 6000);
}

function handleGameResponse(data) {
    updateMessage(data.message);
    speak(data.message);

    if (data.type === 'color_guess') {
        robotFace.setExpression('curious');
    } else if (data.type === 'animal_sound') {
        robotFace.setExpression('playful');
    }
}

// ========== UTILIDADES ==========

// Cargar voces cuando estén disponibles
if (synthesis) {
    synthesis.onvoiceschanged = () => {
        console.log('Voces disponibles:', synthesis.getVoices().length);
    };
}

// Mantener la conexión activa
setInterval(() => {
    if (socket.connected) {
        console.log('💓 Conexión activa');
    }
}, 30000);

console.log('✅ Aplicación Chispas iniciada correctamente');
