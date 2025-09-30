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

### Environment configuration

The repository ships with an `.env.example` file that mirrors the values expected by the Docker Compose stack. Copy it to `.env` to customise settings without touching version-controlled files:

```bash
cp .env.example .env
```

### Connector registry

Community connectors are implemented in `app/services/connectors`. They are automatically registered via the module import side-effect. To validate a connector configuration without running the worker you can call the `/api/v1/connectors/{name}/validate` endpoint. The FastAPI docs at http://localhost:8000/docs provide an interactive interface for this workflow.

## Testing

```bash
poetry run pytest
```
