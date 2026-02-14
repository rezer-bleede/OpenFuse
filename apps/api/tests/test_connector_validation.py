"""Test connector registry and validation."""

import pytest
from app.services.connectors import registry


@pytest.mark.asyncio
class TestConnectorRegistry:
    """Test connector registry functionality."""

    def test_registry_contains_all_connectors(self):
        """Registry contains all expected connectors."""
        connectors = registry.list()
        expected = [
            "slack", "snowflake", "postgres", "mysql", "bigquery",
            "salesforce", "redshift", "mongodb", "google_analytics",
            "stripe", "github", "shopify", "sqlserver",
            "google_sheets", "zendesk", "mailchimp", "gcs",
            "intercom", "quickbooks", "twilio", "asana", "jira",
            "facebook_ads", "airtable", "hubspot", "example"
        ]
        for name in expected:
            assert name in connectors, f"Connector '{name}' not found in registry"

    def test_get_connector_by_name(self):
        """Get specific connector from registry."""
        connector = registry.get("slack")
        assert connector is not None
        assert connector.name == "slack"

    def test_get_snowflake_connector(self):
        """Get Snowflake connector from registry."""
        connector = registry.get("snowflake")
        assert connector is not None
        assert connector.name == "snowflake"

    def test_get_postgres_connector(self):
        """Get PostgreSQL connector from registry."""
        connector = registry.get("postgres")
        assert connector is not None
        assert connector.name == "postgres"

    def test_get_nonexistent_connector_raises(self):
        """Getting non-existent connector raises error."""
        with pytest.raises(LookupError):
            registry.get("nonexistent_connector")

    def test_registry_list_returns_dict(self):
        """Registry list returns dictionary of connectors."""
        connectors = registry.list()
        assert isinstance(connectors, dict)
        assert len(connectors) > 0

    def test_connector_has_title(self):
        """Connectors have titles."""
        connector = registry.get("slack")
        assert hasattr(connector, "title")
        assert connector.title is not None
        assert len(connector.title) > 0

    def test_connector_has_description(self):
        """Connectors have descriptions."""
        connector = registry.get("slack")
        assert hasattr(connector, "description")
        assert connector.description is not None
        assert len(connector.description) > 0

    def test_connector_has_tags(self):
        """Connectors have tags."""
        connector = registry.get("slack")
        assert hasattr(connector, "tags")
        assert isinstance(connector.tags, list)
        assert len(connector.tags) > 0

    def test_connector_has_config_schema(self):
        """Connectors have config schema."""
        connector = registry.get("slack")
        assert hasattr(connector, "config_schema")
        assert connector.config_schema is not None


@pytest.mark.asyncio
class TestConnectorValidation:
    """Test connector validation via API."""

    def test_validate_slack_connector_success(self, client):
        """Validate Slack connector with valid config."""
        response = client.post("/api/v1/connectors/slack/validate", json={
            "config": {"token": "test-token"}
        })
        assert response.status_code == 200
        assert response.json()["valid"] == True

    def test_validate_snowflake_connector_success(self, client):
        """Validate Snowflake connector with valid config."""
        response = client.post("/api/v1/connectors/snowflake/validate", json={
            "config": {
                "account": "test_account",
                "user": "test_user",
                "password": "test_password",
                "database": "test_db"
            }
        })
        assert response.status_code == 200
        assert response.json()["valid"] == True

    def test_validate_postgres_connector_success(self, client):
        """Validate PostgreSQL connector with valid config."""
        response = client.post("/api/v1/connectors/postgres/validate", json={
            "config": {
                "host": "localhost",
                "port": 5432,
                "database": "test_db",
                "username": "test_user",
                "password": "test_pass"
            }
        })
        assert response.status_code == 200
        assert response.json()["valid"] == True

    def test_validate_invalid_config_fails(self, client):
        """Invalid connector config fails validation."""
        response = client.post("/api/v1/connectors/slack/validate", json={
            "config": {}  # Missing required token
        })
        assert response.status_code == 200
        assert response.json()["valid"] == False
        assert len(response.json()["errors"]) > 0

    def test_validate_nonexistent_connector(self, client):
        """Validating non-existent connector returns 404."""
        response = client.post("/api/v1/connectors/nonexistent/validate", json={
            "config": {}
        })
        assert response.status_code == 404


@pytest.mark.asyncio
class TestConnectorConfigSchema:
    """Test connector config schemas."""

    def test_slack_config_schema(self):
        """Slack connector has required fields."""
        connector = registry.get("slack")
        schema = connector.config_schema
        assert schema is not None
        assert "type" in schema
        assert "properties" in schema
        assert "required" in schema
        assert "token" in schema["properties"]

    def test_snowflake_config_schema(self):
        """Snowflake connector has required fields."""
        connector = registry.get("snowflake")
        schema = connector.config_schema
        assert schema is not None
        assert "account" in schema["properties"]
        assert "user" in schema["properties"]
        assert "password" in schema["properties"]
        assert "database" in schema["properties"]

    def test_postgres_config_schema(self):
        """PostgreSQL connector has required fields."""
        connector = registry.get("postgres")
        schema = connector.config_schema
        assert schema is not None
        assert "host" in schema["properties"]
        assert "port" in schema["properties"]
        assert "database" in schema["properties"]
        assert "username" in schema["properties"]
        assert "password" in schema["properties"]


@pytest.mark.asyncio
class TestConnectorDescribe:
    """Test connector description endpoint."""

    def test_describe_slack_connector(self, client):
        """Get Slack connector description."""
        response = client.get("/api/v1/connectors/slack")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "slack"
        assert "title" in data
        assert "description" in data
        assert "tags" in data
        assert "config_schema" in data

    def test_describe_snowflake_connector(self, client):
        """Get Snowflake connector description."""
        response = client.get("/api/v1/connectors/snowflake")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "snowflake"
        assert "title" in data
        assert "description" in data

    def test_describe_nonexistent_connector(self, client):
        """Get non-existent connector returns 404."""
        response = client.get("/api/v1/connectors/nonexistent")
        assert response.status_code == 404


@pytest.mark.asyncio
class TestConnectorList:
    """Test connectors list endpoint."""

    def test_list_all_connectors(self, client):
        """GET /connectors returns all connectors."""
        response = client.get("/api/v1/connectors")
        assert response.status_code == 200
        data = response.json()
        assert "connectors" in data
        assert len(data["connectors"]) > 20  # Should have many connectors

    def test_connectors_list_structure(self, client):
        """Connectors list has proper structure."""
        response = client.get("/api/v1/connectors")
        data = response.json()
        assert isinstance(data["connectors"], list)

        # Check first connector has required fields
        first = data["connectors"][0]
        assert "name" in first
        assert "title" in first
        assert "description" in first
        assert "tags" in first
        assert "config_schema" in first
