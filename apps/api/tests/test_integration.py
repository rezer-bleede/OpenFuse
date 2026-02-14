"""Integration tests for API endpoints with real database."""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import get_session
from app.db.models import Pipeline, Job, PipelineStatus

client = TestClient(app)


@pytest.mark.asyncio
class TestAPIIntegration:
    """Test API endpoints with real database."""

    def test_create_pipeline_persists_to_db(self):
        """Pipeline created via API exists in database."""
        response = client.post("/api/v1/pipelines", json={
            "name": "Integration Test Pipeline",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })

        assert response.status_code == 201

        # Verify in database
        session = next(get_session())
        pipeline = session.exec(
            "SELECT * FROM pipelines WHERE name = 'Integration Test Pipeline'"
        ).first()

        assert pipeline is not None
        assert pipeline["source_connector"] == "slack"
        assert pipeline["destination_connector"] == "snowflake"

    def test_update_pipeline_reflects_in_db(self):
        """Pipeline update via API reflects in database."""
        # Create pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "To Update",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]

        # Update via API
        response = client.patch(f"/api/v1/pipelines/{pipeline_id}", json={
            "name": "Updated Name",
            "status": "active"
        })

        assert response.status_code == 200

        # Verify in database
        session = next(get_session())
        pipeline = session.get(Pipeline, pipeline_id)

        assert pipeline.name == "Updated Name"
        assert pipeline.status == "active"

    def test_delete_pipeline_soft_deletes_in_db(self):
        """Pipeline soft delete via API reflects in database."""
        # Create pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "To Delete",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]

        # Delete via API
        response = client.delete(f"/api/v1/pipelines/{pipeline_id}")
        assert response.status_code == 204

        # Verify soft delete in database
        session = next(get_session())
        pipeline = session.get(Pipeline, pipeline_id)

        assert pipeline is not None  # Still exists
        assert pipeline.status == "deleted"  # But marked as deleted

    def test_list_pipelines_filters_deleted(self):
        """Pipeline list does not include deleted pipelines."""
        # Create two pipelines
        client.post("/api/v1/pipelines", json={
            "name": "Active Pipeline",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })

        create_resp = client.post("/api/v1/pipelines", json={
            "name": "To Delete",
            "source_connector": "postgres",
            "destination_connector": "bigquery"
        })
        pipeline_id = create_resp.json()["id"]

        # Delete one
        client.delete(f"/api/v1/pipelines/{pipeline_id}")

        # List pipelines
        response = client.get("/api/v1/pipelines")
        data = response.json()

        assert data["total"] == 1
        assert len(data["pipelines"]) == 1
        assert data["pipelines"][0]["name"] == "Active Pipeline"

    def test_create_job_persists_to_db(self):
        """Job created via API exists in database."""
        # Create and activate pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Job Test",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]
        client.patch(f"/api/v1/pipelines/{pipeline_id}", json={"status": "active"})

        # Create job via API
        response = client.post(f"/api/v1/pipelines/{pipeline_id}/run")
        assert response.status_code == 200
        job_id = response.json()["id"]

        # Verify in database
        session = next(get_session())
        job = session.get(Job, job_id)

        assert job is not None
        assert job.pipeline_id == pipeline_id
        assert job.status == "pending"

    def test_pipeline_status_transitions_in_db(self):
        """Pipeline status transitions persist to database."""
        # Create pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Status Test",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]

        # Check initial status
        session = next(get_session())
        pipeline = session.get(Pipeline, pipeline_id)
        assert pipeline.status == PipelineStatus.DRAFT

        # Update to active
        client.patch(f"/api/v1/pipelines/{pipeline_id}", json={"status": "active"})

        # Verify in database
        session = next(get_session())
        pipeline = session.get(Pipeline, pipeline_id)
        assert pipeline.status == PipelineStatus.ACTIVE

    def test_multiple_pipelines_in_db(self):
        """Multiple pipelines can be created and listed."""
        # Create 5 pipelines
        for i in range(5):
            client.post("/api/v1/pipelines", json={
                "name": f"Pipeline {i}",
                "source_connector": "slack",
                "destination_connector": "snowflake"
            })

        # List all
        response = client.get("/api/v1/pipelines")
        data = response.json()

        assert data["total"] == 5
        assert len(data["pipelines"]) == 5

    def test_pipeline_with_config_persists(self):
        """Pipeline configuration persists to database."""
        config = {"api_key": "secret_key_123", "channel": "#general"}
        response = client.post("/api/v1/pipelines", json={
            "name": "Config Test",
            "source_connector": "slack",
            "destination_connector": "snowflake",
            "source_config": config,
            "destination_config": config
        })

        assert response.status_code == 201
        pipeline_id = response.json()["id"]

        # Verify in database
        session = next(get_session())
        pipeline = session.get(Pipeline, pipeline_id)

        assert pipeline.source_config == config
        assert pipeline.destination_config == config


@pytest.mark.asyncio
class TestAPIValidationIntegration:
    """Test API validation with database."""

    def test_duplicate_pipeline_names_allowed(self):
        """Multiple pipelines with same name are allowed."""
        # Create first pipeline
        client.post("/api/v1/pipelines", json={
            "name": "Same Name",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })

        # Create second with same name
        response = client.post("/api/v1/pipelines", json={
            "name": "Same Name",
            "source_connector": "postgres",
            "destination_connector": "bigquery"
        })

        # Should succeed (names are not unique)
        assert response.status_code == 201

    def test_get_deleted_pipeline_via_api(self):
        """Getting deleted pipeline via API returns 404."""
        # Create and delete pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Deleted Test",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]
        client.delete(f"/api/v1/pipelines/{pipeline_id}")

        # Try to get via API
        response = client.get(f"/api/v1/pipelines/{pipeline_id}")
        assert response.status_code == 404

    def test_update_deleted_pipeline_fails(self):
        """Updating deleted pipeline returns 404."""
        # Create and delete pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Deleted Test",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]
        client.delete(f"/api/v1/pipelines/{pipeline_id}")

        # Try to update
        response = client.patch(f"/api/v1/pipelines/{pipeline_id}", json={
            "name": "New Name"
        })
        assert response.status_code == 404
