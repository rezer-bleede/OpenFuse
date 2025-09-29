"""Community workflow task definitions."""

from app.services.workflows.worker import celery_app


@celery_app.task(name="app.services.workflows.tasks.refresh_connector")
def refresh_connector(connector_id: str) -> str:
    """Placeholder task for refreshing connector metadata."""

    return f"refreshed:{connector_id}"
