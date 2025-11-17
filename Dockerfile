# Dockerfile principal para Chispas Web App
FROM python:3.11-slim

# Metadatos
LABEL maintainer="Julian Neira Nova"
LABEL description="Chispas Robot - Main Web Application"

# Variables de entorno
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar requirements
COPY requirements.txt .

# Instalar dependencias Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar aplicación
COPY webapp/ .

# Crear usuario no-root
RUN useradd -m -u 1000 chispas && \
    chown -R chispas:chispas /app

USER chispas

# Exponer puerto (Railway usa PORT como variable de entorno)
EXPOSE ${PORT:-5000}

# Healthcheck - Deshabilitado para Railway (Railway maneja su propio healthcheck)
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#     CMD python -c "import requests; requests.get('http://localhost:${PORT:-5000}')" || exit 1

# Comando de inicio
CMD ["python", "app.py"]
