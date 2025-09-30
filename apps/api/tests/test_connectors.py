"""Tests for connector registry and API endpoints."""

from fastapi.testclient import TestClient
import pytest

from app.main import app
from app.services.connectors import registry


def test_registry_lists_example_connector() -> None:
    connectors = registry.list()
    assert "example" in connectors


def test_registry_describe_returns_metadata() -> None:
    definitions = registry.describe()
    assert any(d.name == "example" and "JSON" in d.title for d in definitions)


def test_registry_missing_connector() -> None:
    with pytest.raises(LookupError):
        registry.get("unknown")


def test_list_connectors_endpoint() -> None:
    client = TestClient(app)
    response = client.get("/api/v1/connectors")

    assert response.status_code == 200
    payload = response.json()
    assert any(connector["name"] == "example" for connector in payload["connectors"])


def test_validate_connector_success() -> None:
    client = TestClient(app)
    response = client.post(
        "/api/v1/connectors/example/validate",
        json={"config": {"endpoint": "https://api.example.com"}},
    )

    assert response.status_code == 200
    assert response.json()["valid"] is True


def test_validate_connector_missing_field() -> None:
    client = TestClient(app)
    response = client.post("/api/v1/connectors/example/validate", json={"config": {}})

    assert response.status_code == 422
