"""Test all pipeline endpoints."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


@pytest.mark.asyncio
class TestPipelinesList:
    """Test pipeline listing endpoint."""

    def test_list_pipelines_empty(self):
        """GET /pipelines - empty list."""
        response = client.get("/api/v1/pipelines")
        assert response.status_code == 200
        data = response.json()
        assert "pipelines" in data
        assert data["total"] == 0
        assert data["pipelines"] == []

    def test_list_pipelines_with_data(self):
        """GET /pipelines - with existing pipelines."""
        # Create multiple pipelines
        for i in range(3):
            client.post("/api/v1/pipelines", json={
                "name": f"Pipeline {i}",
                "source_connector": "slack",
                "destination_connector": "snowflake"
            })

        # List all
        response = client.get("/api/v1/pipelines")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 3
        assert len(data["pipelines"]) == 3

    def test_list_pipelines_with_pagination(self):
        """GET /pipelines - with pagination."""
        # Create 5 pipelines
        for i in range(5):
            client.post("/api/v1/pipelines", json={
                "name": f"Pipeline {i}",
                "source_connector": "slack",
                "destination_connector": "snowflake"
            })

        # Get first page
        response = client.get("/api/v1/pipelines?skip=0&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 5
        assert len(data["pipelines"]) == 2

    def test_list_pipelines_with_status_filter(self):
        """GET /pipelines - filter by status."""
        # Create pipelines with different statuses
        resp1 = client.post("/api/v1/pipelines", json={
            "name": "Draft Pipeline",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id_1 = resp1.json()["id"]

        resp2 = client.post("/api/v1/pipelines", json={
            "name": "Active Pipeline",
            "source_connector": "postgres",
            "destination_connector": "bigquery"
        })
        pipeline_id_2 = resp2.json()["id"]

        # Activate second pipeline
        client.patch(f"/api/v1/pipelines/{pipeline_id_2}", json={"status": "active"})

        # Filter by active status
        response = client.get("/api/v1/pipelines?status_filter=active")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["pipelines"][0]["name"] == "Active Pipeline"


@pytest.mark.asyncio
class TestPipelinesCreate:
    """Test pipeline creation endpoint."""

    def test_create_pipeline_success(self):
        """POST /pipelines - successful creation."""
        pipeline_data = {
            "name": "Test Pipeline",
            "source_connector": "slack",
            "destination_connector": "snowflake",
            "source_config": {},
            "destination_config": {}
        }
        response = client.post("/api/v1/pipelines", json=pipeline_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test Pipeline"
        assert data["source_connector"] == "slack"
        assert data["destination_connector"] == "snowflake"
        assert data["status"] == "draft"
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data

    def test_create_pipeline_with_all_fields(self):
        """POST /pipelines - with all optional fields."""
        pipeline_data = {
            "name": "Full Pipeline",
            "description": "Test description",
            "source_connector": "postgres",
            "destination_connector": "bigquery",
            "source_config": {"host": "localhost", "database": "test"},
            "destination_config": {"project_id": "test", "dataset": "test"},
            "schedule_cron": "0 0 * * *",
            "replication_mode": "full_table",
            "incremental_key": "updated_at",
            "batch_size": 5000
        }
        response = client.post("/api/v1/pipelines", json=pipeline_data)
        assert response.status_code == 201
        data = response.json()
        assert data["description"] == "Test description"
        assert data["schedule_cron"] == "0 0 * * *"
        assert data["replication_mode"] == "full_table"
        assert data["incremental_key"] == "updated_at"
        assert data["batch_size"] == 5000

    def test_create_pipeline_invalid_source(self):
        """POST /pipelines - invalid source connector."""
        pipeline_data = {
            "name": "Test",
            "source_connector": "invalid_connector",
            "destination_connector": "snowflake"
        }
        response = client.post("/api/v1/pipelines", json=pipeline_data)
        assert response.status_code == 422
        assert "not found" in response.json()["detail"].lower()

    def test_create_pipeline_invalid_destination(self):
        """POST /pipelines - invalid destination connector."""
        pipeline_data = {
            "name": "Test",
            "source_connector": "slack",
            "destination_connector": "invalid_connector"
        }
        response = client.post("/api/v1/pipelines", json=pipeline_data)
        assert response.status_code == 422
        assert "not found" in response.json()["detail"].lower()

    def test_create_pipeline_missing_name(self):
        """POST /pipelines - missing required name field."""
        pipeline_data = {
            "source_connector": "slack",
            "destination_connector": "snowflake"
        }
        response = client.post("/api/v1/pipelines", json=pipeline_data)
        assert response.status_code == 422

    def test_create_pipeline_missing_source(self):
        """POST /pipelines - missing required source_connector field."""
        pipeline_data = {
            "name": "Test",
            "destination_connector": "snowflake"
        }
        response = client.post("/api/v1/pipelines", json=pipeline_data)
        assert response.status_code == 422


@pytest.mark.asyncio
class TestPipelinesGet:
    """Test get specific pipeline endpoint."""

    def test_get_pipeline_by_id(self):
        """GET /pipelines/{id} - get specific pipeline."""
        # First create a pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Test",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]

        # Now get it
        response = client.get(f"/api/v1/pipelines/{pipeline_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == pipeline_id
        assert data["name"] == "Test"

    def test_get_nonexistent_pipeline(self):
        """GET /pipelines/{id} - pipeline not found."""
        response = client.get("/api/v1/pipelines/99999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_get_deleted_pipeline(self):
        """GET /pipelines/{id} - deleted pipeline."""
        # Create and delete pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "To Delete",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]
        client.delete(f"/api/v1/pipelines/{pipeline_id}")

        # Try to get deleted pipeline
        response = client.get(f"/api/v1/pipelines/{pipeline_id}")
        assert response.status_code == 404


@pytest.mark.asyncio
class TestPipelinesUpdate:
    """Test pipeline update endpoint."""

    def test_update_pipeline_name(self):
        """PATCH /pipelines/{id} - update name."""
        # Create pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Original Name",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]

        # Update name
        response = client.patch(f"/api/v1/pipelines/{pipeline_id}", json={
            "name": "Updated Name"
        })
        assert response.status_code == 200
        assert response.json()["name"] == "Updated Name"

    def test_update_pipeline_status(self):
        """PATCH /pipelines/{id} - update status."""
        # Create pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "To Activate",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]

        # Activate it
        response = client.patch(f"/api/v1/pipelines/{pipeline_id}", json={
            "status": "active"
        })
        assert response.status_code == 200
        assert response.json()["status"] == "active"

    def test_update_pipeline_multiple_fields(self):
        """PATCH /pipelines/{id} - update multiple fields."""
        # Create pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Multi Update",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]

        # Update multiple fields
        response = client.patch(f"/api/v1/pipelines/{pipeline_id}", json={
            "name": "Updated Name",
            "description": "Updated description",
            "batch_size": 20000
        })
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name"
        assert data["description"] == "Updated description"
        assert data["batch_size"] == 20000

    def test_update_nonexistent_pipeline(self):
        """PATCH /pipelines/{id} - pipeline not found."""
        response = client.patch("/api/v1/pipelines/99999", json={"name": "Test"})
        assert response.status_code == 404


@pytest.mark.asyncio
class TestPipelinesDelete:
    """Test pipeline deletion endpoint."""

    def test_delete_pipeline(self):
        """DELETE /pipelines/{id} - soft delete."""
        # Create pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "To Delete",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]

        # Delete it
        response = client.delete(f"/api/v1/pipelines/{pipeline_id}")
        assert response.status_code == 204

        # Verify it's marked as deleted
        get_resp = client.get(f"/api/v1/pipelines/{pipeline_id}")
        assert get_resp.status_code == 404

    def test_delete_nonexistent_pipeline(self):
        """DELETE /pipelines/{id} - pipeline not found."""
        response = client.delete("/api/v1/pipelines/99999")
        assert response.status_code == 404


@pytest.mark.asyncio
class TestPipelinesRun:
    """Test pipeline run endpoint."""

    def test_run_pipeline(self):
        """POST /pipelines/{id}/run - trigger pipeline run."""
        # Create active pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Runnable",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]

        # Activate it
        client.patch(f"/api/v1/pipelines/{pipeline_id}", json={"status": "active"})

        # Run it
        response = client.post(f"/api/v1/pipelines/{pipeline_id}/run")
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["status"] == "pending"

    def test_run_draft_pipeline_fails(self):
        """POST /pipelines/{id}/run - draft pipelines can't run."""
        # Create draft pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Draft Pipeline",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]

        # Try to run draft pipeline
        response = client.post(f"/api/v1/pipelines/{pipeline_id}/run")
        assert response.status_code == 422
        assert "must be active" in response.json()["detail"].lower()

    def test_run_pipeline_with_options(self):
        """POST /pipelines/{id}/run - with backfill options."""
        # Create and activate pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Backfill Test",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]
        client.patch(f"/api/v1/pipelines/{pipeline_id}", json={"status": "active"})

        # Run with backfill
        response = client.post(f"/api/v1/pipelines/{pipeline_id}/run", json={
            "backfill": True,
            "start_date": "2024-01-01T00:00:00Z",
            "end_date": "2024-01-31T23:59:59Z"
        })
        assert response.status_code == 200


@pytest.mark.asyncio
class TestPipelineJobs:
    """Test pipeline jobs listing endpoint."""

    def test_list_jobs_empty(self):
        """GET /pipelines/{id}/jobs - empty list."""
        # Create pipeline
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Job Test",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]

        # List jobs
        response = client.get(f"/api/v1/pipelines/{pipeline_id}/jobs")
        assert response.status_code == 200
        data = response.json()
        assert "jobs" in data
        assert data["total"] == 0
        assert data["jobs"] == []

    def test_list_jobs_with_data(self):
        """GET /pipelines/{id}/jobs - with existing jobs."""
        # Create pipeline and run it
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Job Test",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]
        client.patch(f"/api/v1/pipelines/{pipeline_id}", json={"status": "active"})
        client.post(f"/api/v1/pipelines/{pipeline_id}/run")

        # List jobs
        response = client.get(f"/api/v1/pipelines/{pipeline_id}/jobs")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert len(data["jobs"]) == 1

    def test_list_jobs_with_pagination(self):
        """GET /pipelines/{id}/jobs - with pagination."""
        # Create pipeline and run multiple jobs
        create_resp = client.post("/api/v1/pipelines", json={
            "name": "Job Test",
            "source_connector": "slack",
            "destination_connector": "snowflake"
        })
        pipeline_id = create_resp.json()["id"]
        client.patch(f"/api/v1/pipelines/{pipeline_id}", json={"status": "active"})

        # Create multiple jobs
        for _ in range(3):
            client.post(f"/api/v1/pipelines/{pipeline_id}/run")

        # List with pagination
        response = client.get(f"/api/v1/pipelines/{pipeline_id}/jobs?skip=0&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 3
        assert len(data["jobs"]) == 2
