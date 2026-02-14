"""Pytest configuration for the API service."""

from __future__ import annotations

import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel

# Ensure the application package is importable when tests are executed via Poetry without installation.
ROOT = Path(__file__).resolve().parents[1]
APP_PATH = ROOT / "app"

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(APP_PATH) not in sys.path:
    sys.path.insert(0, str(APP_PATH))

# Ensure local tests run without external postgres/redis dependencies.
os.environ.setdefault("OPENFUSE_DATABASE_URL", f"sqlite:///{ROOT / 'test.db'}")
os.environ.setdefault("OPENFUSE_REDIS_URL", "redis://localhost:6379/15")
os.environ.setdefault("OPENFUSE_ENVIRONMENT", "test")

from app.db import engine
from app.main import app
from app.services.workflows.tasks import run_pipeline_task


@pytest.fixture(autouse=True)
def reset_database() -> None:
    """Reset the sqlite database between tests."""

    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    yield


@pytest.fixture(autouse=True)
def disable_celery_dispatch(monkeypatch: pytest.MonkeyPatch) -> None:
    """Prevent broker calls during tests."""

    monkeypatch.setattr(run_pipeline_task, "delay", lambda *_args, **_kwargs: None)


@pytest.fixture
def client() -> TestClient:
    """Shared API client fixture."""

    with TestClient(app) as test_client:
        yield test_client
