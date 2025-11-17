"""
Cliente para conectar con el servicio de Whisper
Usado desde la app principal
"""

import requests
import os
from typing import Optional

class WhisperClient:
    """Cliente para el servicio de Whisper"""

    def __init__(self, service_url: str = None):
        """
        Inicializa el cliente

        Args:
            service_url: URL del servicio Whisper (default: desde variable de entorno)
        """
        self.service_url = service_url or os.getenv('WHISPER_SERVICE_URL', 'http://localhost:5001')
        self.timeout = 30  # segundos

    def health_check(self) -> bool:
        """
        Verifica si el servicio está disponible

        Returns:
            bool: True si está disponible
        """
        try:
            response = requests.get(f'{self.service_url}/health', timeout=5)
            return response.status_code == 200
        except:
            return False

    def transcribe(self, audio_file, language: str = 'es') -> Optional[dict]:
        """
        Transcribe un archivo de audio

        Args:
            audio_file: Archivo de audio (file object o path)
            language: Código de idioma (default: español)

        Returns:
            dict: Resultado de la transcripción o None si falla
        """
        try:
            # Si es una ruta, abrir el archivo
            if isinstance(audio_file, str):
                with open(audio_file, 'rb') as f:
                    files = {'audio': f}
                    data = {'language': language}
                    response = requests.post(
                        f'{self.service_url}/transcribe',
                        files=files,
                        data=data,
                        timeout=self.timeout
                    )
            else:
                # Es un file object
                files = {'audio': audio_file}
                data = {'language': language}
                response = requests.post(
                    f'{self.service_url}/transcribe',
                    files=files,
                    data=data,
                    timeout=self.timeout
                )

            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error en transcripción: {response.status_code}")
                return None

        except Exception as e:
            print(f"Error llamando a Whisper: {e}")
            return None

    def transcribe_stream(self, audio_file, language: str = 'es') -> Optional[dict]:
        """
        Transcribe con timestamps detallados

        Args:
            audio_file: Archivo de audio
            language: Código de idioma

        Returns:
            dict: Resultado con timestamps o None
        """
        try:
            if isinstance(audio_file, str):
                with open(audio_file, 'rb') as f:
                    files = {'audio': f}
                    data = {'language': language}
                    response = requests.post(
                        f'{self.service_url}/transcribe/stream',
                        files=files,
                        data=data,
                        timeout=self.timeout
                    )
            else:
                files = {'audio': audio_file}
                data = {'language': language}
                response = requests.post(
                    f'{self.service_url}/transcribe/stream',
                    files=files,
                    data=data,
                    timeout=self.timeout
                )

            if response.status_code == 200:
                return response.json()
            else:
                return None

        except Exception as e:
            print(f"Error: {e}")
            return None

    def get_info(self) -> Optional[dict]:
        """
        Obtiene información del servicio

        Returns:
            dict: Información del servicio
        """
        try:
            response = requests.get(f'{self.service_url}/info', timeout=5)
            if response.status_code == 200:
                return response.json()
            return None
        except:
            return None

# Ejemplo de uso
"""
# En app.py
from services.whisper_client import WhisperClient

whisper = WhisperClient()

# Verificar disponibilidad
if whisper.health_check():
    print("Whisper está disponible")

# Transcribir audio
resultado = whisper.transcribe('audio.wav', language='es')
if resultado:
    print(f"Texto: {resultado['text']}")
    print(f"Idioma detectado: {resultado['language']}")
    print(f"Duración: {resultado['duration']}s")
"""
