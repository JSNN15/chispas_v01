/**
 * Chispas Robot - Aplicación principal con IA
 * Maneja la interacción, voz con Groq Whisper, WebSocket y juegos con IA
 */

// Variables globales
let socket;
let robotFace;
let mediaRecorder;
let audioChunks = [];
let synthesis = window.speechSynthesis;
let isRecording = false;

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
    console.log('🤖 Inicializando Chispas con IA...');

    // Inicializar cara del robot
    robotFace = new RobotFace('robotFace');

    // Inicializar WebSocket
    initWebSocket();

    // Inicializar grabadora de audio
    initAudioRecorder();

    // Inicializar event listeners
    initEventListeners();
});

// ========== WEBSOCKET ==========
function initWebSocket() {
    socket = io();

    socket.on('connect', () => {
        console.log('✅ Conectado al servidor con IA');
        statusText.textContent = 'Conectado ✨';
        updateMessage('¡Hola! Estoy lista para aprender contigo 😊');
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
        console.log('🤖 Chispas:', data.message);
        updateMessage(data.message);
        if (data.expression) {
            robotFace.setExpression(data.expression);
        }
        speak(data.message);
    });

    socket.on('transcription', (data) => {
        console.log('📝 Transcripción:', data.text);
        textInput.value = data.text;
    });
}

// ========== GRABACIÓN DE AUDIO (para Groq Whisper) ==========
async function initAudioRecorder() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            audioChunks = [];

            // Convertir a base64 para enviar por WebSocket
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const base64Audio = reader.result;
                console.log('🎤 Enviando audio al servidor...');
                socket.emit('audio_message', { audio: base64Audio });
            };
        };

        console.log('✅ Grabadora de audio lista');
        voiceStatus.textContent = 'Toca el micrófono para hablar';
    } catch (error) {
        console.error('❌ Error al inicializar micrófono:', error);
        voiceStatus.textContent = 'No se pudo acceder al micrófono';
        voiceBtn.disabled = true;
    }
}

function startRecording() {
    if (!mediaRecorder) {
        alert('Micrófono no disponible');
        return;
    }

    audioChunks = [];
    mediaRecorder.start();
    isRecording = true;

    voiceBtn.classList.add('listening');
    voiceBtnText.textContent = 'Grabando...';
    voiceStatus.textContent = '🎤 Escuchando...';
    robotFace.setExpression('curious');

    console.log('🎤 Grabando audio...');
}

function stopRecording() {
    if (!mediaRecorder || !isRecording) return;

    mediaRecorder.stop();
    isRecording = false;

    voiceBtn.classList.remove('listening');
    voiceBtnText.textContent = 'Hablar';
    voiceStatus.textContent = 'Procesando...';
    robotFace.setExpression('thinking');

    console.log('⏹️ Deteniendo grabación...');
}

// ========== SÍNTESIS DE VOZ MEJORADA ==========
function speak(text) {
    // Cancelar cualquier voz anterior
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.8; // Más lento y pausado para niños
    utterance.pitch = 1.5; // Tono más agudo (voz suave infantil)
    utterance.volume = 0.9; // Volumen suave

    // Buscar la mejor voz para niños (prioridad: femenina, infantil, española)
    const voices = synthesis.getVoices();

    // Intentar encontrar voces específicas buenas para niños
    let selectedVoice = voices.find(voice =>
        voice.lang.startsWith('es') &&
        (voice.name.includes('Mónica') || voice.name.includes('Monica') ||
         voice.name.includes('Paulina') || voice.name.includes('Lucía') ||
         voice.name.includes('Lucia'))
    );

    // Si no encuentra esas, buscar cualquier voz femenina
    if (!selectedVoice) {
        selectedVoice = voices.find(voice =>
            voice.lang.startsWith('es') &&
            (voice.name.toLowerCase().includes('female') ||
             voice.name.toLowerCase().includes('woman') ||
             voice.name.toLowerCase().includes('mujer'))
        );
    }

    // Si aún no encuentra, usar cualquier voz española
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('es'));
    }

    if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('🗣️ Usando voz:', selectedVoice.name);
    }

    utterance.onstart = () => {
        console.log('🗣️ Hablando...');
    };

    utterance.onend = () => {
        console.log('✅ Terminé de hablar');
        voiceStatus.textContent = 'Toca el micrófono para hablar';
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
    updateMessage('Déjame pensar... 🤔');
    robotFace.setExpression('thinking');
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
    // Botón de voz (presionar y mantener)
    voiceBtn.addEventListener('mousedown', () => {
        if (!isRecording) {
            startRecording();
        }
    });

    voiceBtn.addEventListener('mouseup', () => {
        if (isRecording) {
            stopRecording();
        }
    });

    voiceBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!isRecording) {
            startRecording();
        }
    });

    voiceBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (isRecording) {
            stopRecording();
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
                sleepy: 'Tengo sueño... 😴',
                curious: '¿Qué será? 🤔'
            };
            updateMessage(messages[expression] || 'Nueva expresión');
        });
    });

    // Botones de juegos (ahora con IA)
    document.querySelectorAll('.btn-game').forEach(btn => {
        btn.addEventListener('click', () => {
            const game = btn.dataset.game;
            console.log('Iniciando juego con IA:', game);
            startAIGame(game);
        });
    });
}

// ========== JUEGOS EDUCATIVOS CON IA ==========
function startAIGame(gameType) {
    robotFace.setExpression('excited');

    // Enviar al servidor para que la IA genere el juego
    socket.emit('start_game', { game: gameType });

    // Mostrar mensaje de carga
    updateMessage('Preparando un juego divertido... 🎮');
}

// ========== UTILIDADES ==========

// Cargar voces cuando estén disponibles
if (synthesis) {
    synthesis.onvoiceschanged = () => {
        console.log('✅ Voces disponibles:', synthesis.getVoices().length);
    };
}

// Mantener la conexión activa
setInterval(() => {
    if (socket && socket.connected) {
        console.log('💓 Conexión IA activa');
    }
}, 30000);

console.log('✅ Chispas con IA iniciada correctamente');
