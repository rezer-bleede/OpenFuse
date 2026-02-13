"""Community workflow task definitions."""

import logging
from datetime import datetime

from sqlalchemy import update

from app.services.workflows.worker import celery_app
from app.db import get_session
from app.db.models import Job, JobStatus, Pipeline

logger = logging.getLogger(__name__)


@celery_app.task(name="app.services.workflows.tasks.refresh_connector")
def refresh_connector(connector_id: str) -> str:
    """Placeholder task for refreshing connector metadata."""

    return f"refreshed:{connector_id}"


@celery_app.task(name="app.services.workflows.tasks.run_pipeline")
def run_pipeline_task(job_id: int) -> dict:
    """Execute a pipeline job."""

    session = next(get_session())

    job = session.get(Job, job_id)
    if not job:
        logger.error(f"Job {job_id} not found")
        return {"status": "error", "message": "Job not found"}

    pipeline = session.get(Pipeline, job.pipeline_id)
    if not pipeline:
        logger.error(f"Pipeline {job.pipeline_id} not found for job {job_id}")
        job.status = JobStatus.FAILED
        job.error_message = "Pipeline not found"
        session.commit()
        return {"status": "error", "message": "Pipeline not found"}

    job.status = JobStatus.RUNNING
    job.started_at = datetime.utcnow()
    session.commit()

    try:
        from app.services.connectors import registry

        source = registry.create(pipeline.source_connector, **pipeline.source_config)
        dest = registry.create(pipeline.destination_connector, **pipeline.destination_config)

        import asyncio
        asyncio.run(source.run())

        job.status = JobStatus.COMPLETED
        job.completed_at = datetime.utcnow()
        job.rows_synced = 0

    except Exception as e:
        logger.exception(f"Pipeline {pipeline.id} failed")
        job.status = JobStatus.FAILED
        job.completed_at = datetime.utcnow()
        job.error_message = str(e)

    session.commit()

    return {
        "status": job.status.value,
        "job_id": job_id,
        "pipeline_id": pipeline.id,
        "rows_synced": job.rows_synced,
    }
