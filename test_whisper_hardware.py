#!/usr/bin/env python3
"""
Script de Prueba de Hardware para Whisper
Detecta automáticamente las capacidades de tu equipo
"""

import sys
import platform
import subprocess
import psutil
import os

def check_ram():
    """Verifica RAM disponible"""
    ram_gb = psutil.virtual_memory().total / (1024**3)
    ram_available_gb = psutil.virtual_memory().available / (1024**3)

    print("💾 RAM:")
    print(f"   Total: {ram_gb:.1f} GB")
    print(f"   Disponible: {ram_available_gb:.1f} GB")

    if ram_available_gb >= 4:
        print("   ✅ Excelente - Puedes usar modelo 'medium' o 'small'")
        return "medium"
    elif ram_available_gb >= 2:
        print("   ✅ Bien - Puedes usar modelo 'base'")
        return "base"
    elif ram_available_gb >= 1:
        print("   ⚠️  Justo - Usa modelo 'tiny'")
        return "tiny"
    else:
        print("   ❌ Insuficiente - Usa Whisper API en la nube")
        return None

def check_cpu():
    """Verifica CPU"""
    cpu_count = psutil.cpu_count(logical=False)
    cpu_freq = psutil.cpu_freq()

    print("\n💻 CPU:")
    print(f"   Procesador: {platform.processor()}")
    print(f"   Núcleos físicos: {cpu_count}")
    print(f"   Frecuencia: {cpu_freq.current:.0f} MHz" if cpu_freq else "   Frecuencia: Desconocida")

    if cpu_count >= 4:
        print("   ✅ Excelente - Modelos grandes funcionarán bien")
    elif cpu_count >= 2:
        print("   ✅ Bien - Modelo 'base' funcionará bien")
    else:
        print("   ⚠️  Básico - Considera modelo 'tiny'")

def check_gpu():
    """Verifica si hay GPU NVIDIA"""
    print("\n🎮 GPU:")
    try:
        result = subprocess.run(['nvidia-smi', '--query-gpu=name,memory.total', '--format=csv,noheader'],
                              capture_output=True, text=True, timeout=3)
        if result.returncode == 0:
            gpu_info = result.stdout.strip()
            print(f"   ✅ GPU detectada: {gpu_info}")
            print("   🚀 Puedes usar aceleración GPU (mucho más rápido)")
            return True
        else:
            print("   ℹ️  No se detectó GPU NVIDIA")
            return False
    except:
        print("   ℹ️  No se detectó GPU NVIDIA")
        return False

def check_disk():
    """Verifica espacio en disco"""
    disk = psutil.disk_usage('/')
    disk_free_gb = disk.free / (1024**3)

    print(f"\n💿 Disco:")
    print(f"   Espacio libre: {disk_free_gb:.1f} GB")

    if disk_free_gb >= 5:
        print("   ✅ Suficiente espacio para cualquier modelo")
    elif disk_free_gb >= 1:
        print("   ✅ Suficiente para modelos pequeños/medianos")
    else:
        print("   ⚠️  Poco espacio - Solo modelo 'tiny'")

def check_platform():
    """Verifica plataforma"""
    print("\n🖥️  Sistema:")
    print(f"   OS: {platform.system()} {platform.release()}")
    print(f"   Arquitectura: {platform.machine()}")

    if platform.machine().startswith('arm') or platform.machine().startswith('aarch'):
        print("   🍓 Sistema ARM detectado (Raspberry Pi?)")
        print("   💡 Recomendación: Usa whisper.cpp para mejor rendimiento")
        return "arm"
    else:
        print("   💻 Sistema x86_64")
        return "x86"

def estimate_speed(model, has_gpu=False, is_arm=False):
    """Estima velocidad de procesamiento"""
    speeds = {
        'tiny': {'cpu': '5-10s', 'gpu': '0.3-0.5s', 'arm': '8-15s'},
        'base': {'cpu': '3-5s', 'gpu': '0.5-1s', 'arm': '10-20s'},
        'small': {'cpu': '5-8s', 'gpu': '1-2s', 'arm': '20-40s'},
        'medium': {'cpu': '8-12s', 'gpu': '2-3s', 'arm': '-'},
    }

    if is_arm:
        return speeds[model]['arm']
    elif has_gpu:
        return speeds[model]['gpu']
    else:
        return speeds[model]['cpu']

def get_recommendation(model, has_gpu, arch):
    """Genera recomendación personalizada"""
    print("\n" + "="*60)
    print("🎯 RECOMENDACIÓN PERSONALIZADA")
    print("="*60)

    if model is None:
        print("\n❌ RAM insuficiente para Whisper local")
        print("\n✅ OPCIÓN RECOMENDADA: Whisper API (OpenAI)")
        print("   - Costo: ~$0.003 por conversación")
        print("   - Precisión: 95%+")
        print("   - Velocidad: 1-2 segundos")
        print("   - No requiere recursos locales")
        print("\n📚 Ver: AI_INTEGRATION_GUIDE.md")
        return

    if arch == 'arm':
        print("\n✅ OPCIÓN RECOMENDADA: whisper.cpp")
        print(f"   - Modelo: {model}")
        print(f"   - Velocidad estimada: {estimate_speed(model, False, True)}")
        print("   - Optimizado para ARM/Raspberry Pi")
        print("   - Instalación:")
        print("     git clone https://github.com/ggerganov/whisper.cpp")
        print("     cd whisper.cpp && make")
        print(f"     bash ./models/download-ggml-model.sh {model}")
    elif has_gpu:
        print("\n✅ OPCIÓN RECOMENDADA: faster-whisper con GPU")
        print(f"   - Modelo: {model}")
        print(f"   - Velocidad estimada: {estimate_speed(model, True, False)} ⚡")
        print("   - Instalación:")
        print("     pip install faster-whisper[cuda]")
        print(f"""
   - Código Python:
     from faster_whisper import WhisperModel
     model = WhisperModel("{model}", device="cuda")
     segments, info = model.transcribe("audio.wav", language="es")
     texto = " ".join([s.text for s in segments])
""")
    else:
        print("\n✅ OPCIÓN RECOMENDADA: faster-whisper")
        print(f"   - Modelo: {model}")
        print(f"   - Velocidad estimada: {estimate_speed(model, False, False)}")
        print("   - Instalación:")
        print("     pip install faster-whisper")
        print(f"""
   - Código Python:
     from faster_whisper import WhisperModel
     model = WhisperModel("{model}", device="cpu")
     segments, info = model.transcribe("audio.wav", language="es")
     texto = " ".join([s.text for s in segments])
""")

    # Precisión esperada
    precision = {'tiny': '80%', 'base': '90%', 'small': '93%', 'medium': '96%'}
    print(f"\n📊 Precisión esperada: {precision.get(model, 'N/A')}")

    # Memoria requerida
    memory = {'tiny': '500 MB', 'base': '800 MB - 2 GB', 'small': '1.5 - 3 GB', 'medium': '2.5 - 5 GB'}
    print(f"💾 RAM que usará: {memory.get(model, 'N/A')}")

def test_installation():
    """Prueba si faster-whisper está instalado"""
    print("\n" + "="*60)
    print("🧪 PRUEBA DE INSTALACIÓN")
    print("="*60)

    try:
        import faster_whisper
        print("\n✅ faster-whisper ya está instalado")
        print(f"   Versión: {faster_whisper.__version__}")

        print("\n¿Quieres hacer una prueba rápida? (s/n): ", end='')
        response = input().strip().lower()

        if response == 's':
            print("\nDescargando y probando modelo 'tiny' (75 MB)...")
            print("Esto puede tardar un minuto la primera vez...")

            try:
                from faster_whisper import WhisperModel
                import time

                model = WhisperModel("tiny", device="cpu")
                print("✅ Modelo cargado correctamente")
                print("\n🎉 ¡Tu equipo es compatible con Whisper local!")
                print("\nPuedes empezar a usarlo inmediatamente.")

            except Exception as e:
                print(f"❌ Error al cargar modelo: {e}")

    except ImportError:
        print("\nℹ️  faster-whisper no está instalado")
        print("\n📦 Para instalar, ejecuta:")
        print("   pip install faster-whisper")

def main():
    print("="*60)
    print("🔍 ANÁLISIS DE HARDWARE PARA WHISPER LOCAL")
    print("="*60)

    # Verificaciones
    model = check_ram()
    check_cpu()
    has_gpu = check_gpu()
    check_disk()
    arch = check_platform()

    # Recomendación
    is_arm = arch == 'arm'
    get_recommendation(model, has_gpu, arch)

    # Test de instalación
    test_installation()

    print("\n" + "="*60)
    print("📚 Documentación completa en:")
    print("   - WHISPER_HARDWARE_REQUIREMENTS.md")
    print("   - VOICE_RECOGNITION_GUIDE.md")
    print("   - AI_INTEGRATION_GUIDE.md")
    print("="*60)

if __name__ == "__main__":
    try:
        import psutil
    except ImportError:
        print("❌ Este script requiere 'psutil'")
        print("Instala con: pip install psutil")
        sys.exit(1)

    main()
