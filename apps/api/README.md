# OpenFuse API Service

The OpenFuse API exposes orchestration controls, metadata, and pipeline configuration for the platform. It is designed to be extended by enterprise plugins without modifying community code.

## Features

- FastAPI application with modular routers under `app/api`.
- SQLModel ORM with Postgres backend for metadata.
- Celery + Redis for asynchronous pipeline execution.
- Settings management via environment variables and `.env` files.

## Local development

```bash
poetry install
poetry run uvicorn app.main:app --reload
```

The API automatically loads configuration from `app/core/config.py`. Override values using environment variables prefixed with `OPENFUSE_`.

## Testing

```bash
poetry run pytest
```
