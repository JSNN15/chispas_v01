# 🚀 Guía de Instalación Rápida

## El servidor está corriendo, pero necesitas acceder desde tu computadora

Este código está corriendo en un servidor remoto. Para usar Chispas con Amanda, necesitas ejecutarlo en tu computadora local o en tu red.

## 📥 Pasos para Instalar en tu Computadora

### Opción A: Descargar desde GitHub

1. **Clona o descarga el repositorio:**
   ```bash
   git clone https://github.com/JSNN15/chispas_v01.git
   cd chispas_v01
   ```

2. **Instala las dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Inicia el servidor:**

   **Linux/Mac:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

   **Windows:**
   ```cmd
   start.bat
   ```

   **O manualmente:**
   ```bash
   cd webapp
   python app.py
   ```

4. **Abre tu navegador:**
   - En la computadora: `http://localhost:5000`
   - En el celular (misma WiFi): `http://<tu-ip>:5000`

### Opción B: Descarga Directa (sin Git)

Si no tienes Git instalado:

1. Ve a tu repositorio en GitHub
2. Haz clic en el botón verde "Code"
3. Selecciona "Download ZIP"
4. Descomprime el archivo
5. Sigue los pasos 2-4 de la Opción A

## 🌐 ¿Cómo Obtener tu IP Local?

### Windows:
```cmd
ipconfig
```
Busca "Dirección IPv4" (ejemplo: 192.168.1.100)

### Linux/Mac:
```bash
ifconfig
# o
ip addr show
```
Busca "inet" (ejemplo: 192.168.1.100)

## 📱 Acceso desde Celular

1. Asegúrate de que tu celular y computadora estén en la **misma red WiFi**
2. Obtén la IP de tu computadora (ver arriba)
3. En el celular, abre el navegador
4. Ve a: `http://<tu-ip>:5000`
   - Ejemplo: `http://192.168.1.100:5000`

## 🔥 Solución de Problemas

### "No puedo conectarme"
- Verifica que estés en la misma red WiFi
- Desactiva temporalmente el firewall
- Asegúrate de usar la IP correcta

### "El micrófono no funciona"
- Usa Chrome o Edge (mejor soporte)
- Da permisos de micrófono cuando te lo pida
- En móvil, puede que necesites HTTPS (usa ngrok para tunnel)

### "No escucho la voz"
- Verifica el volumen del dispositivo
- Algunas voces en español requieren descarga
- Prueba en diferentes navegadores

## 🎮 Una vez que esté funcionando:

1. Toca el **micrófono 🎤** y di "Hola Chispas"
2. O escribe en el campo de texto
3. Cambia expresiones con los botones
4. Juega los 4 juegos diferentes

## ❤️ ¡Disfruta jugando con Chispas!

---

**Nota:** Si necesitas que el servidor sea accesible desde Internet (no solo tu red local), puedes usar servicios como:
- ngrok: `ngrok http 5000`
- localtunnel: `lt --port 5000`
- serveo: `ssh -R 80:localhost:5000 serveo.net`
