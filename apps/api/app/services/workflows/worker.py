"""Celery app configuration for background workflows."""

from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "openfuse-worker",
    broker=settings.redis_url,
    backend=settings.redis_url,
)

celery_app.conf.task_routes = {
    "app.services.workflows.tasks.*": {"queue": "workflows"}
}


@celery_app.task(name="app.services.workflows.tasks.example")
def example_task(name: str) -> str:
    """Example task to demonstrate background execution."""

    return f"Hello, {name}!"
