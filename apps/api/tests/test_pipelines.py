"""Tests for pipeline and job API contracts."""


def create_pipeline(client, **overrides):
    payload = {
        "name": "Test Pipeline",
        "source_connector": "slack",
        "destination_connector": "snowflake",
        "source_config": {"token": "xoxb-test-token"},
        "destination_config": {
            "account": "acct",
            "user": "user",
            "password": "password",
            "database": "db",
        },
    }
    payload.update(overrides)
    response = client.post("/api/v1/pipelines", json=payload)
    return response


def test_create_pipeline_success(client):
    response = create_pipeline(client)
    assert response.status_code == 201
    payload = response.json()
    assert payload["status"] == "draft"
    assert payload["source_connector"] == "slack"
    assert payload["destination_connector"] == "snowflake"


def test_create_pipeline_rejects_destination_as_source(client):
    response = create_pipeline(client, source_connector="snowflake")
    assert response.status_code == 422
    assert "source" in response.json()["detail"]


def test_create_pipeline_rejects_source_as_destination(client):
    response = create_pipeline(client, destination_connector="slack")
    assert response.status_code == 422
    assert "destination" in response.json()["detail"]


def test_list_and_get_pipeline(client):
    created = create_pipeline(client).json()

    list_response = client.get("/api/v1/pipelines")
    assert list_response.status_code == 200
    listed = list_response.json()
    assert listed["total"] == 1
    assert listed["pipelines"][0]["id"] == created["id"]

    get_response = client.get(f"/api/v1/pipelines/{created['id']}")
    assert get_response.status_code == 200
    assert get_response.json()["name"] == "Test Pipeline"


def test_update_pipeline_status_and_name(client):
    created = create_pipeline(client).json()
    response = client.patch(
        f"/api/v1/pipelines/{created['id']}",
        json={"status": "active", "name": "Updated Pipeline"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "active"
    assert payload["name"] == "Updated Pipeline"


def test_run_pipeline_accepts_empty_body(client):
    created = create_pipeline(client).json()
    client.patch(f"/api/v1/pipelines/{created['id']}", json={"status": "active"})

    response = client.post(f"/api/v1/pipelines/{created['id']}/run")
    assert response.status_code == 200
    payload = response.json()
    assert payload["pipeline_id"] == created["id"]
    assert payload["status"] == "pending"


def test_run_pipeline_rejects_draft(client):
    created = create_pipeline(client).json()
    response = client.post(f"/api/v1/pipelines/{created['id']}/run")
    assert response.status_code == 422
    assert "active" in response.json()["detail"]


def test_global_jobs_endpoint(client):
    created = create_pipeline(client).json()
    client.patch(f"/api/v1/pipelines/{created['id']}", json={"status": "active"})
    client.post(f"/api/v1/pipelines/{created['id']}/run")

    response = client.get("/api/v1/jobs")
    assert response.status_code == 200
    payload = response.json()
    assert payload["total"] == 1
    assert payload["jobs"][0]["pipeline_id"] == created["id"]


def test_pipeline_jobs_endpoint(client):
    created = create_pipeline(client).json()
    client.patch(f"/api/v1/pipelines/{created['id']}", json={"status": "active"})
    client.post(f"/api/v1/pipelines/{created['id']}/run")

    response = client.get(f"/api/v1/pipelines/{created['id']}/jobs")
    assert response.status_code == 200
    payload = response.json()
    assert payload["total"] == 1
    assert payload["jobs"][0]["pipeline_id"] == created["id"]
