"""Smoke tests for the health endpoints."""

from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app


def test_health_endpoint() -> None:
    """The API health endpoint should return an OK status."""

    client = TestClient(app)
    response = client.get(f"{settings.api_prefix}/v1/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
