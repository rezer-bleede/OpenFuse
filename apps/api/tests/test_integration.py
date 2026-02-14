"""Integration tests across API and persistence layers."""

from app.db import get_session
from app.db.models import Job, Pipeline, PipelineStatus


def create_active_pipeline(client):
    response = client.post(
        "/api/v1/pipelines",
        json={
            "name": "Integration Pipeline",
            "source_connector": "slack",
            "destination_connector": "snowflake",
            "source_config": {"token": "xoxb-test-token"},
            "destination_config": {
                "account": "acct",
                "user": "user",
                "password": "password",
                "database": "db",
            },
        },
    )
    assert response.status_code == 201
    pipeline_id = response.json()["id"]
    client.patch(f"/api/v1/pipelines/{pipeline_id}", json={"status": "active"})
    return pipeline_id


def test_pipeline_persists_to_database(client):
    pipeline_id = create_active_pipeline(client)
    session = next(get_session())
    pipeline = session.get(Pipeline, pipeline_id)
    assert pipeline is not None
    assert pipeline.status == PipelineStatus.ACTIVE
    assert pipeline.source_connector == "slack"


def test_running_pipeline_creates_job_record(client):
    pipeline_id = create_active_pipeline(client)
    run_response = client.post(f"/api/v1/pipelines/{pipeline_id}/run")
    assert run_response.status_code == 200
    job_id = run_response.json()["id"]

    session = next(get_session())
    job = session.get(Job, job_id)
    assert job is not None
    assert job.pipeline_id == pipeline_id


def test_soft_delete_hides_pipeline_from_list(client):
    pipeline_id = create_active_pipeline(client)
    delete_response = client.delete(f"/api/v1/pipelines/{pipeline_id}")
    assert delete_response.status_code == 204

    list_response = client.get("/api/v1/pipelines")
    assert list_response.status_code == 200
    payload = list_response.json()
    assert payload["total"] == 0
