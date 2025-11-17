"""
Crear túnel público con pyngrok
"""
from pyngrok import ngrok
import time

# Crear túnel público para el puerto 5000
public_url = ngrok.connect(5000, bind_tls=True)

print("=" * 60)
print("🌐 TÚNEL PÚBLICO CREADO")
print("=" * 60)
print(f"\n✅ URL Pública: {public_url}")
print(f"\n📱 Comparte esta URL para acceder a Chispas desde cualquier lugar")
print(f"\n⚠️  Este túnel permanecerá activo hasta que cierres el programa")
print("\n" + "=" * 60)

# Mantener el túnel activo
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\n\n🛑 Cerrando túnel...")
    ngrok.disconnect(public_url)
    print("✅ Túnel cerrado")
