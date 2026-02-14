"""Model-level persistence tests."""

from datetime import datetime

from app.db import get_session
from app.db.models import Job, JobStatus, Pipeline, PipelineStatus, ReplicationMode


def test_pipeline_defaults_and_timestamps():
    pipeline = Pipeline(
        name="Model Pipeline",
        source_connector="slack",
        destination_connector="snowflake",
    )
    session = next(get_session())
    session.add(pipeline)
    session.commit()
    session.refresh(pipeline)

    assert pipeline.id is not None
    assert pipeline.status == PipelineStatus.DRAFT
    assert pipeline.replication_mode == ReplicationMode.FULL_TABLE
    assert isinstance(pipeline.created_at, datetime)
    assert isinstance(pipeline.updated_at, datetime)


def test_pipeline_json_configs_are_persisted():
    config = {"token": "secret", "channel": "#ops"}
    pipeline = Pipeline(
        name="Config Pipeline",
        source_connector="slack",
        destination_connector="snowflake",
        source_config=config,
        destination_config=config,
    )
    session = next(get_session())
    session.add(pipeline)
    session.commit()
    session.refresh(pipeline)

    assert pipeline.source_config == config
    assert pipeline.destination_config == config


def test_job_belongs_to_pipeline():
    session = next(get_session())
    pipeline = Pipeline(
        name="Job Owner",
        source_connector="slack",
        destination_connector="snowflake",
    )
    session.add(pipeline)
    session.commit()
    session.refresh(pipeline)

    job = Job(pipeline_id=pipeline.id, status=JobStatus.PENDING)
    session.add(job)
    session.commit()
    session.refresh(job)

    assert job.id is not None
    assert job.pipeline_id == pipeline.id
    assert job.status == JobStatus.PENDING
