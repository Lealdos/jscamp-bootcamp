# Tarea 7: microservicio Flask que consume Docker Model Runner
FROM python:3.12-slim

WORKDIR /app

# Primero solo requirements.txt: si no cambia, Docker reutiliza la capa de pip
COPY requirements.txt .

# --no-cache-dir evita que pip guarde la cache de descargas en la imagen
RUN pip install --no-cache-dir -r requirements.txt

# Ahora el codigo
COPY app.py .

EXPOSE 5000

# app.py apunta por defecto a http://model-runner.docker.internal/v1/, un DNS que
# solo existe en Docker Desktop. En OrbStack ese nombre no resuelve, pero el
# runner se alcanza por host.docker.internal:12434. Se puede sobreescribir con:
#   docker run -e LLM_URL="http://host.docker.internal:12434/v1/" ...

CMD ["python", "app.py"]
