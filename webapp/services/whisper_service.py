"""
Servicio de Whisper Local como Microservicio
API REST para reconocimiento de voz
"""

from flask import Flask, request, jsonify
from faster_whisper import WhisperModel
import tempfile
import os
import logging
from pathlib import Path

# Configuración
app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Variables de entorno
WHISPER_MODEL = os.getenv('WHISPER_MODEL', 'base')
DEVICE = os.getenv('DEVICE', 'cpu')
MAX_AUDIO_SIZE = int(os.getenv('MAX_AUDIO_SIZE', 25)) * 1024 * 1024  # MB to bytes

# Inicializar modelo
logger.info(f"Cargando modelo Whisper '{WHISPER_MODEL}' en {DEVICE}...")
model = None

def init_model():
    """Inicializa el modelo Whisper"""
    global model
    try:
        model = WhisperModel(WHISPER_MODEL, device=DEVICE, compute_type="int8")
        logger.info("✅ Modelo Whisper cargado correctamente")
        return True
    except Exception as e:
        logger.error(f"❌ Error cargando modelo: {e}")
        return False

# Cargar modelo al iniciar
init_model()

@app.route('/health', methods=['GET'])
def health():
    """Endpoint de salud"""
    return jsonify({
        'status': 'healthy' if model else 'unhealthy',
        'model': WHISPER_MODEL,
        'device': DEVICE,
        'service': 'whisper'
    }), 200 if model else 503

@app.route('/info', methods=['GET'])
def info():
    """Información del servicio"""
    return jsonify({
        'model': WHISPER_MODEL,
        'device': DEVICE,
        'max_audio_size_mb': MAX_AUDIO_SIZE / (1024 * 1024),
        'supported_formats': ['mp3', 'mp4', 'wav', 'webm', 'm4a', 'ogg'],
        'languages': ['es', 'en', 'fr', 'de', 'it', 'pt', 'etc'],
        'status': 'ready' if model else 'loading'
    })

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """
    Transcribe audio a texto

    Acepta: multipart/form-data con archivo de audio

    Parámetros opcionales:
    - language: Código de idioma (default: es)
    - task: transcribe o translate (default: transcribe)
    - temperature: 0.0-1.0 (default: 0.0)
    """
    if not model:
        return jsonify({'error': 'Modelo no disponible'}), 503

    # Verificar que hay un archivo
    if 'audio' not in request.files:
        return jsonify({'error': 'No se encontró archivo de audio'}), 400

    audio_file = request.files['audio']

    if audio_file.filename == '':
        return jsonify({'error': 'Archivo vacío'}), 400

    # Verificar tamaño
    audio_file.seek(0, os.SEEK_END)
    file_size = audio_file.tell()
    audio_file.seek(0)

    if file_size > MAX_AUDIO_SIZE:
        return jsonify({
            'error': f'Archivo muy grande. Máximo: {MAX_AUDIO_SIZE/(1024*1024)}MB'
        }), 413

    # Parámetros opcionales
    language = request.form.get('language', 'es')
    task = request.form.get('task', 'transcribe')
    temperature = float(request.form.get('temperature', 0.0))

    try:
        # Guardar archivo temporal
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(audio_file.filename).suffix) as tmp_file:
            audio_file.save(tmp_file.name)
            tmp_path = tmp_file.name

        logger.info(f"Transcribiendo audio: {audio_file.filename} ({file_size} bytes)")

        # Transcribir
        segments, info = model.transcribe(
            tmp_path,
            language=language,
            task=task,
            temperature=temperature,
            vad_filter=True,  # Filtrar silencios
            beam_size=5
        )

        # Recolectar segmentos
        result_segments = []
        full_text = []

        for segment in segments:
            result_segments.append({
                'start': segment.start,
                'end': segment.end,
                'text': segment.text.strip()
            })
            full_text.append(segment.text.strip())

        # Limpiar archivo temporal
        os.unlink(tmp_path)

        # Respuesta
        response = {
            'text': ' '.join(full_text),
            'segments': result_segments,
            'language': info.language,
            'language_probability': info.language_probability,
            'duration': info.duration,
            'model': WHISPER_MODEL
        }

        logger.info(f"✅ Transcripción exitosa: {len(full_text)} segmentos")
        return jsonify(response), 200

    except Exception as e:
        logger.error(f"❌ Error en transcripción: {e}")
        # Limpiar archivo temporal si existe
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.unlink(tmp_path)

        return jsonify({'error': str(e)}), 500

@app.route('/transcribe/stream', methods=['POST'])
def transcribe_stream():
    """
    Transcribe con timestamps detallados
    Útil para subtítulos o análisis temporal
    """
    if not model:
        return jsonify({'error': 'Modelo no disponible'}), 503

    if 'audio' not in request.files:
        return jsonify({'error': 'No se encontró archivo de audio'}), 400

    audio_file = request.files['audio']
    language = request.form.get('language', 'es')

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            audio_file.save(tmp_file.name)
            tmp_path = tmp_file.name

        segments, info = model.transcribe(
            tmp_path,
            language=language,
            word_timestamps=True
        )

        result = {
            'segments': [],
            'language': info.language,
            'duration': info.duration
        }

        for segment in segments:
            segment_data = {
                'start': segment.start,
                'end': segment.end,
                'text': segment.text,
                'words': []
            }

            if hasattr(segment, 'words') and segment.words:
                for word in segment.words:
                    segment_data['words'].append({
                        'word': word.word,
                        'start': word.start,
                        'end': word.end,
                        'probability': word.probability
                    })

            result['segments'].append(segment_data)

        os.unlink(tmp_path)
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error: {e}")
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.unlink(tmp_path)
        return jsonify({'error': str(e)}), 500

@app.route('/models', methods=['GET'])
def list_models():
    """Lista modelos disponibles"""
    return jsonify({
        'current': WHISPER_MODEL,
        'available': ['tiny', 'base', 'small', 'medium', 'large'],
        'sizes': {
            'tiny': '75 MB',
            'base': '145 MB',
            'small': '466 MB',
            'medium': '1.5 GB',
            'large': '3 GB'
        },
        'precision': {
            'tiny': '~80%',
            'base': '~90%',
            'small': '~93%',
            'medium': '~96%',
            'large': '~98%'
        }
    })

if __name__ == '__main__':
    # Ejecutar servidor
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
