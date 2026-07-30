# ─── Backend Dockerfile ───────────────────────────────────────────────────────
# python:3.12-slim — minimal image, smaller than full python image
FROM python:3.12-slim

# Prevent .pyc files and enable unbuffered logs in Docker
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Django settings module — must match project structure
ENV DJANGO_SETTINGS_MODULE=config.settings

# Add apps/ to PYTHONPATH so Django can find the custom apps
# (config/settings.py also does sys.path.insert — this is the Docker-safe way)
ENV PYTHONPATH=/app:/app/apps

# Set working directory
WORKDIR /app

# Install system dependencies required by psycopg2 (PostgreSQL adapter)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first for better layer caching.
# This layer only re-runs when requirements.txt changes.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the full project
COPY . .

# Expose Django development server port
EXPOSE 8000

# Default command — overridden by docker-compose.yml
# docker-compose runs: migrate && runserver
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
