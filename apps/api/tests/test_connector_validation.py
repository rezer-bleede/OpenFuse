"""Tests for connector validation and metadata contracts."""

from app.services.connectors import derive_capabilities, registry


def test_registry_contains_expected_connectors() -> None:
    connectors = registry.list()
    assert "slack" in connectors
    assert "snowflake" in connectors
    assert "airtable" in connectors


def test_connector_definitions_have_schemas() -> None:
    definitions = registry.describe()
    assert definitions
    for definition in definitions:
        assert "type" in definition.config_schema
        assert "properties" in definition.config_schema


def test_derive_capabilities_from_tags() -> None:
    assert derive_capabilities(["source", "database"]) == ["source"]
    assert derive_capabilities(["destination", "warehouse"]) == ["destination"]
    assert derive_capabilities(["source", "destination"]) == ["source", "destination"]


def test_validate_connector_success(client) -> None:
    response = client.post(
        "/api/v1/connectors/slack/validate",
        json={"config": {"token": "xoxb-test-token"}},
    )
    assert response.status_code == 200
    assert response.json()["valid"] is True


def test_validate_connector_missing_required_config_returns_422(client) -> None:
    response = client.post("/api/v1/connectors/slack/validate", json={"config": {}})
    assert response.status_code == 422


def test_get_connector_contains_capabilities(client) -> None:
    response = client.get("/api/v1/connectors/snowflake")
    assert response.status_code == 200
    payload = response.json()
    assert payload["name"] == "snowflake"
    assert "destination" in payload["capabilities"]
