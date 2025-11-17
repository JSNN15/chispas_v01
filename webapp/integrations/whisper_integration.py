"""
Integración con OpenAI Whisper - Reconocimiento de Voz Avanzado
El mejor sistema de conversión de audio a texto
"""

import openai
import os
from pathlib import Path

# Configurar OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

def transcribe_audio_whisper(audio_file_path):
    """
    Convierte audio a texto usando Whisper de OpenAI

    Soporta formatos: mp3, mp4, mpeg, mpga, m4a, wav, webm
    Máximo 25MB por archivo

    Args:
        audio_file_path: Ruta al archivo de audio

    Returns:
        str: Texto transcrito
    """
    try:
        with open(audio_file_path, 'rb') as audio_file:
            transcript = openai.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="es",  # Español
                response_format="text",
                temperature=0.2  # Más preciso, menos creativo
            )

        return transcript

    except Exception as e:
        print(f"Error en Whisper: {e}")
        return None

def transcribe_audio_with_timestamps(audio_file_path):
    """
    Transcribe con timestamps (útil para subtítulos)
    """
    try:
        with open(audio_file_path, 'rb') as audio_file:
            transcript = openai.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="es",
                response_format="verbose_json",
                timestamp_granularities=["word"]
            )

        return transcript

    except Exception as e:
        print(f"Error: {e}")
        return None

def translate_audio_to_spanish(audio_file_path):
    """
    Traduce cualquier idioma a español
    """
    try:
        with open(audio_file_path, 'rb') as audio_file:
            translation = openai.audio.translations.create(
                model="whisper-1",
                file=audio_file
            )

        return translation.text

    except Exception as e:
        print(f"Error: {e}")
        return None

# Ejemplo de uso
"""
# Transcribir archivo de audio
texto = transcribe_audio_whisper("amanda_hablando.mp3")
print(f"Amanda dijo: {texto}")

# Con timestamps
resultado = transcribe_audio_with_timestamps("amanda_hablando.mp3")
print(f"Texto: {resultado.text}")
for word in resultado.words:
    print(f"{word.start}s - {word.end}s: {word.word}")
"""

# Integración con Flask
from flask import request, jsonify

@app.route('/api/transcribe', methods=['POST'])
def transcribe_audio():
    """
    Endpoint para recibir audio del navegador y transcribirlo
    """
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file'}), 400

    audio_file = request.files['audio']

    # Guardar temporalmente
    temp_path = f"/tmp/{audio_file.filename}"
    audio_file.save(temp_path)

    # Transcribir
    text = transcribe_audio_whisper(temp_path)

    # Eliminar archivo temporal
    os.remove(temp_path)

    return jsonify({'text': text})

# Características de Whisper:
"""
✅ Precisión: 95%+ (mucho mejor que Web Speech API)
✅ Idiomas: 99+ idiomas (no solo español)
✅ Ruido: Funciona bien con ruido de fondo
✅ Acentos: Entiende diferentes acentos
✅ Offline: Puede correr localmente con whisper.cpp
✅ Formatos: mp3, wav, m4a, webm, etc.

💰 Costo: $0.006 por minuto (~$0.36 por hora)
   - 1 conversación de 30 segundos = $0.003 (muy barato)
"""
