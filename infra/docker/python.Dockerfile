FROM python:3.11-slim

ENV POETRY_VERSION=1.7.1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

RUN pip install "poetry==${POETRY_VERSION}"

WORKDIR /app
COPY apps/api/pyproject.toml /app/apps/api/pyproject.toml
RUN cd /app/apps/api && poetry config virtualenvs.create false && poetry install --no-root

COPY apps/api /app/apps/api

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
