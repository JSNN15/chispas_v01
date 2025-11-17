"""
Whisper Local - Reconocimiento de voz GRATIS y OFFLINE
Usa whisper.cpp o faster-whisper para correr en tu computadora
"""

# Opción 1: faster-whisper (Python, más fácil)
# pip install faster-whisper

from faster_whisper import WhisperModel

class LocalWhisper:
    def __init__(self, model_size="base"):
        """
        Inicializa Whisper local

        Tamaños de modelo:
        - tiny: 75MB, rápido, menos preciso
        - base: 145MB, balanceado (RECOMENDADO)
        - small: 466MB, más preciso
        - medium: 1.5GB, muy preciso
        - large: 3GB, máxima precisión
        """
        print(f"Cargando modelo Whisper {model_size}...")
        self.model = WhisperModel(
            model_size,
            device="cpu",  # o "cuda" si tienes GPU
            compute_type="int8"  # Más rápido, usa menos RAM
        )
        print("✅ Modelo cargado")

    def transcribe(self, audio_file_path):
        """
        Transcribe audio a texto
        """
        segments, info = self.model.transcribe(
            audio_file_path,
            language="es",
            beam_size=5,
            vad_filter=True  # Filtra silencios
        )

        # Unir todos los segmentos
        text = " ".join([segment.text for segment in segments])
        return text.strip()

    def transcribe_with_timestamps(self, audio_file_path):
        """
        Transcribe con marcas de tiempo
        """
        segments, info = self.model.transcribe(
            audio_file_path,
            language="es",
            word_timestamps=True
        )

        result = []
        for segment in segments:
            result.append({
                'start': segment.start,
                'end': segment.end,
                'text': segment.text
            })

        return result

# Instancia global
whisper = None

def init_whisper(model_size="base"):
    """Inicializa Whisper al iniciar la app"""
    global whisper
    whisper = LocalWhisper(model_size)

def transcribe_local(audio_file):
    """Transcribe usando Whisper local"""
    if not whisper:
        init_whisper()

    return whisper.transcribe(audio_file)

# Ejemplo de uso
"""
# Al iniciar la app
init_whisper("base")

# Cuando Amanda habla
texto = transcribe_local("audio_amanda.wav")
print(f"Amanda dijo: {texto}")
"""

# Opción 2: whisper.cpp (C++, MÁS RÁPIDO)
# Para Raspberry Pi o dispositivos con poca RAM

import subprocess

def transcribe_whisper_cpp(audio_file, model_path="models/ggml-base.bin"):
    """
    Usa whisper.cpp (compilado en C++)
    Mucho más rápido que Python, ideal para Raspberry Pi
    """
    try:
        result = subprocess.run([
            './whisper.cpp/main',
            '-m', model_path,
            '-l', 'es',
            '-f', audio_file,
            '--no-timestamps'
        ], capture_output=True, text=True)

        return result.stdout.strip()

    except Exception as e:
        print(f"Error: {e}")
        return None

# Instalación de whisper.cpp:
"""
# Clonar repositorio
git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp

# Compilar
make

# Descargar modelo
bash ./models/download-ggml-model.sh base

# Usar
./main -m models/ggml-base.bin -f audio.wav -l es
"""

# Comparación de opciones:

"""
╔════════════════════╦═══════════╦══════════╦════════════╦═══════════╗
║ Sistema            ║ Precisión ║ Velocidad║ RAM Needed ║ Costo     ║
╠════════════════════╬═══════════╬══════════╬════════════╬═══════════╣
║ Web Speech API     ║ 70%       ║ Tiempo   ║ 0 MB       ║ Gratis    ║
║ (Actual)           ║           ║ real     ║            ║ (online)  ║
╠════════════════════╬═══════════╬══════════╬════════════╬═══════════╣
║ Whisper API        ║ 95%       ║ 1-2s     ║ 0 MB       ║ $0.006/min║
║ (OpenAI)           ║           ║          ║            ║           ║
╠════════════════════╬═══════════╬══════════╬════════════╬═══════════╣
║ faster-whisper     ║ 95%       ║ 3-5s     ║ 1-3 GB     ║ Gratis    ║
║ (Python local)     ║           ║          ║            ║ (offline) ║
╠════════════════════╬═══════════╬══════════╬════════════╬═══════════╣
║ whisper.cpp        ║ 95%       ║ 1-2s     ║ 500 MB     ║ Gratis    ║
║ (C++ local)        ║           ║          ║            ║ (offline) ║
╚════════════════════╩═══════════╩══════════╩════════════╩═══════════╝
"""

# Recomendaciones:

"""
🏠 Para PC/Laptop:
   → faster-whisper con modelo "base"
   → Gratis, offline, muy preciso

🍓 Para Raspberry Pi:
   → whisper.cpp con modelo "tiny" o "base"
   → Optimizado para ARM, usa poca RAM

☁️ Para producción web:
   → Whisper API de OpenAI
   → Muy barato, sin mantenimiento

💰 Para máxima precisión:
   → Whisper API con modelo "large"
   → O faster-whisper local con GPU
"""
