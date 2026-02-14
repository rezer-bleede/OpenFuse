"""Test database models and CRUD operations."""

import pytest
from datetime import datetime
from app.db.models import Pipeline, Job, PipelineStatus, JobStatus
from app.db import get_session


@pytest.mark.asyncio
class TestPipelineModel:
    """Test Pipeline model CRUD operations."""

    def test_create_pipeline(self):
        """Create pipeline in database."""
        pipeline = Pipeline(
            name="Test Pipeline",
            source_connector="slack",
            destination_connector="snowflake",
            status=PipelineStatus.DRAFT
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        assert pipeline.id is not None
        assert pipeline.created_at is not None
        assert pipeline.updated_at is not None
        assert pipeline.status == PipelineStatus.DRAFT

    def test_pipeline_with_description(self):
        """Pipeline with optional description field."""
        pipeline = Pipeline(
            name="Test Pipeline",
            description="This is a test pipeline",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        assert pipeline.description == "This is a test pipeline"

    def test_pipeline_timestamps(self):
        """Pipeline has proper timestamps."""
        before_creation = datetime.utcnow()

        pipeline = Pipeline(
            name="Test",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        assert pipeline.created_at >= before_creation
        assert pipeline.updated_at >= before_creation

    def test_pipeline_config_json_storage(self):
        """Pipeline configs stored as JSON."""
        config = {"api_key": "secret", "workspace": "123"}
        pipeline = Pipeline(
            name="Test",
            source_connector="slack",
            destination_connector="snowflake",
            source_config=config,
            destination_config=config
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        assert pipeline.source_config == config
        assert pipeline.destination_config == config

    def test_pipeline_schedule_cron(self):
        """Pipeline with cron schedule."""
        pipeline = Pipeline(
            name="Scheduled Pipeline",
            source_connector="slack",
            destination_connector="snowflake",
            schedule_cron="0 0 * * *"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        assert pipeline.schedule_cron == "0 0 * * *"

    def test_pipeline_replication_mode(self):
        """Pipeline with different replication modes."""
        pipeline = Pipeline(
            name="Incremental Pipeline",
            source_connector="slack",
            destination_connector="snowflake",
            replication_mode="incremental_key",
            incremental_key="updated_at"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        assert pipeline.replication_mode == "incremental_key"
        assert pipeline.incremental_key == "updated_at"

    def test_pipeline_batch_size(self):
        """Pipeline with custom batch size."""
        pipeline = Pipeline(
            name="Batch Pipeline",
            source_connector="slack",
            destination_connector="snowflake",
            batch_size=50000
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        assert pipeline.batch_size == 50000

    def test_pipeline_default_status(self):
        """Pipeline defaults to draft status."""
        pipeline = Pipeline(
            name="Default Status Pipeline",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        assert pipeline.status == PipelineStatus.DRAFT


@pytest.mark.asyncio
class TestPipelineUpdate:
    """Test Pipeline model updates."""

    def test_update_pipeline_status(self):
        """Update pipeline status."""
        pipeline = Pipeline(
            name="To Update",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()

        # Update status
        pipeline.status = PipelineStatus.ACTIVE
        pipeline.updated_at = datetime.utcnow()
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        assert pipeline.status == PipelineStatus.ACTIVE

    def test_update_pipeline_name(self):
        """Update pipeline name."""
        pipeline = Pipeline(
            name="Original Name",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()

        # Update name
        pipeline.name = "Updated Name"
        pipeline.updated_at = datetime.utcnow()
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        assert pipeline.name == "Updated Name"


@pytest.mark.asyncio
class TestJobModel:
    """Test Job model CRUD operations."""

    def test_create_job(self):
        """Create job in database."""
        # First create a pipeline
        pipeline = Pipeline(
            name="Test Pipeline",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        # Now create a job
        job = Job(
            pipeline_id=pipeline.id,
            status=JobStatus.PENDING
        )
        session.add(job)
        session.commit()
        session.refresh(job)

        assert job.id is not None
        assert job.created_at is not None
        assert job.status == JobStatus.PENDING

    def test_job_timestamps(self):
        """Job has proper timestamps."""
        # Create pipeline
        pipeline = Pipeline(
            name="Test Pipeline",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        before_creation = datetime.utcnow()

        # Create job
        job = Job(pipeline_id=pipeline.id)
        session.add(job)
        session.commit()
        session.refresh(job)

        assert job.created_at >= before_creation

    def test_job_with_rows_synced(self):
        """Job with rows synced count."""
        # Create pipeline
        pipeline = Pipeline(
            name="Test Pipeline",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        # Create job with rows synced
        job = Job(
            pipeline_id=pipeline.id,
            status=JobStatus.COMPLETED,
            rows_synced=1000
        )
        session.add(job)
        session.commit()
        session.refresh(job)

        assert job.rows_synced == 1000

    def test_job_with_error_message(self):
        """Job with error message."""
        # Create pipeline
        pipeline = Pipeline(
            name="Test Pipeline",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        # Create failed job
        job = Job(
            pipeline_id=pipeline.id,
            status=JobStatus.FAILED,
            error_message="Connection timeout"
        )
        session.add(job)
        session.commit()
        session.refresh(job)

        assert job.error_message == "Connection timeout"

    def test_job_with_execution_times(self):
        """Job with start and completion times."""
        # Create pipeline
        pipeline = Pipeline(
            name="Test Pipeline",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        now = datetime.utcnow()
        job = Job(
            pipeline_id=pipeline.id,
            status=JobStatus.COMPLETED,
            started_at=now,
            completed_at=now
        )
        session.add(job)
        session.commit()
        session.refresh(job)

        assert job.started_at == now
        assert job.completed_at == now


@pytest.mark.asyncio
class TestJobStatusTransitions:
    """Test Job status transitions."""

    def test_job_pending_to_running(self):
        """Transition job from pending to running."""
        # Create pipeline and job
        pipeline = Pipeline(
            name="Test Pipeline",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        job = Job(pipeline_id=pipeline.id, status=JobStatus.PENDING)
        session.add(job)
        session.commit()

        # Update to running
        job.status = JobStatus.RUNNING
        job.started_at = datetime.utcnow()
        session.add(job)
        session.commit()
        session.refresh(job)

        assert job.status == JobStatus.RUNNING
        assert job.started_at is not None

    def test_job_running_to_completed(self):
        """Transition job from running to completed."""
        # Create pipeline and job
        pipeline = Pipeline(
            name="Test Pipeline",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        now = datetime.utcnow()
        job = Job(
            pipeline_id=pipeline.id,
            status=JobStatus.RUNNING,
            started_at=now
        )
        session.add(job)
        session.commit()

        # Complete the job
        job.status = JobStatus.COMPLETED
        job.completed_at = datetime.utcnow()
        job.rows_synced=500
        session.add(job)
        session.commit()
        session.refresh(job)

        assert job.status == JobStatus.COMPLETED
        assert job.completed_at is not None
        assert job.rows_synced == 500

    def test_job_failed(self):
        """Mark job as failed."""
        # Create pipeline and job
        pipeline = Pipeline(
            name="Test Pipeline",
            source_connector="slack",
            destination_connector="snowflake"
        )
        session = next(get_session())
        session.add(pipeline)
        session.commit()
        session.refresh(pipeline)

        now = datetime.utcnow()
        job = Job(
            pipeline_id=pipeline.id,
            status=JobStatus.RUNNING,
            started_at=now
        )
        session.add(job)
        session.commit()

        # Mark as failed
        job.status = JobStatus.FAILED
        job.completed_at = datetime.utcnow()
        job.error_message = "API rate limit exceeded"
        session.add(job)
        session.commit()
        session.refresh(job)

        assert job.status == JobStatus.FAILED
        assert job.error_message == "API rate limit exceeded"
