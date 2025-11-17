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

// ========== JUEGOS EDUCATIVOS ==========
function startGame(gameType) {
    robotFace.setExpression('excited');

    switch (gameType) {
        case 'reading':
            startReadingGame();
            break;
        case 'addition':
            startAdditionGame();
            break;
        case 'subtraction':
            startSubtractionGame();
            break;
        default:
            updateMessage('¡Vamos a aprender!');
    }
}

// Juego de Lectura
function startReadingGame() {
    const words = [
        { word: 'CASA', syllables: 'ca-sa', meaning: '🏠' },
        { word: 'GATO', syllables: 'ga-to', meaning: '🐱' },
        { word: 'SOL', syllables: 'sol', meaning: '☀️' },
        { word: 'LUNA', syllables: 'lu-na', meaning: '🌙' },
        { word: 'FLOR', syllables: 'flor', meaning: '🌸' },
        { word: 'AGUA', syllables: 'a-gua', meaning: '💧' },
        { word: 'NIÑA', syllables: 'ni-ña', meaning: '👧' },
        { word: 'PERRO', syllables: 'pe-rro', meaning: '🐕' },
        { word: 'LIBRO', syllables: 'li-bro', meaning: '📖' },
        { word: 'PELOTA', syllables: 'pe-lo-ta', meaning: '⚽' }
    ];

    const randomWord = words[Math.floor(Math.random() * words.length)];

    updateMessage(`📖 Lee esta palabra:\n\n✨ ${randomWord.word} ✨\n\n(${randomWord.syllables})`);
    speak(`Lee esta palabra. ${randomWord.word}. ${randomWord.syllables}`);

    robotFace.setExpression('curious');

    setTimeout(() => {
        updateMessage(`¡Muy bien! ${randomWord.word} es ${randomWord.meaning}`);
        speak(`¡Muy bien! ${randomWord.word}`);
        robotFace.setExpression('happy');
    }, 8000);
}

// Juego de Sumas
function startAdditionGame() {
    // Números pequeños y fáciles para niños
    const num1 = Math.floor(Math.random() * 5) + 1; // 1-5
    const num2 = Math.floor(Math.random() * 5) + 1; // 1-5
    const sum = num1 + num2;

    // Crear representación visual con emojis
    const emoji1 = '⭐'.repeat(num1);
    const emoji2 = '⭐'.repeat(num2);

    updateMessage(`➕ Suma:\n\n${emoji1} + ${emoji2}\n\n${num1} + ${num2} = ?`);
    speak(`¿Cuánto es ${num1} más ${num2}?`);

    robotFace.setExpression('curious');

    setTimeout(() => {
        const emojiTotal = '⭐'.repeat(sum);
        updateMessage(`¡Correcto! 🎉\n\n${emojiTotal}\n\n${num1} + ${num2} = ${sum}`);
        speak(`¡Muy bien! ${num1} más ${num2} es ${sum}`);
        robotFace.setExpression('excited');
    }, 10000);
}

// Juego de Restas
function startSubtractionGame() {
    // Para restas, aseguramos que el resultado sea positivo
    const num1 = Math.floor(Math.random() * 5) + 3; // 3-8
    const num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // 1 a (num1-1)
    const diff = num1 - num2;

    // Crear representación visual con emojis
    const emoji1 = '🍎'.repeat(num1);
    const emoji2 = '❌'.repeat(num2);

    updateMessage(`➖ Resta:\n\n${emoji1}\n\nQuita ${num2}:\n${emoji2}\n\n${num1} - ${num2} = ?`);
    speak(`Tienes ${num1} manzanas. Si quitas ${num2}, ¿cuántas quedan?`);

    robotFace.setExpression('curious');

    setTimeout(() => {
        const emojiResult = '🍎'.repeat(diff);
        updateMessage(`¡Excelente! 🎉\n\n${emojiResult}\n\n${num1} - ${num2} = ${diff}`);
        speak(`¡Muy bien! ${num1} menos ${num2} es ${diff}`);
        robotFace.setExpression('excited');
    }, 10000);
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
