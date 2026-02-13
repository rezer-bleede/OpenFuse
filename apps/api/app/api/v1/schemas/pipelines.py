"""Pydantic schemas for pipeline API endpoints."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from app.db.models import JobStatus, PipelineStatus, ReplicationMode


class PipelineBase(BaseModel):
    """Base pipeline schema."""

    name: str = Field(max_length=255)
    description: str | None = None
    source_connector: str
    source_config: dict[str, Any] = {}
    destination_connector: str
    destination_config: dict[str, Any] = {}
    schedule_cron: str | None = None
    replication_mode: ReplicationMode = ReplicationMode.FULL_TABLE
    incremental_key: str | None = None
    batch_size: int = 10000


class PipelineCreate(PipelineBase):
    """Schema for creating a pipeline."""
    pass


class PipelineUpdate(BaseModel):
    """Schema for updating a pipeline."""

    name: str | None = None
    description: str | None = None
    source_config: dict[str, Any] | None = None
    destination_config: dict[str, Any] | None = None
    schedule_cron: str | None = None
    status: PipelineStatus | None = None
    replication_mode: ReplicationMode | None = None
    incremental_key: str | None = None
    batch_size: int | None = None


class PipelineResponse(PipelineBase):
    """Pipeline response schema."""

    id: int
    status: PipelineStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PipelineListResponse(BaseModel):
    """List of pipelines."""

    pipelines: list[PipelineResponse]
    total: int


class JobBase(BaseModel):
    """Base job schema."""

    pipeline_id: int
    status: JobStatus = JobStatus.PENDING


class JobResponse(JobBase):
    """Job response schema."""

    id: int
    rows_synced: int
    error_message: str | None
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True


class JobListResponse(BaseModel):
    """List of jobs."""

    jobs: list[JobResponse]
    total: int


class PipelineRunRequest(BaseModel):
    """Request to run a pipeline manually."""

    backfill: bool = False
    start_date: datetime | None = None
    end_date: datetime | None = None


class PipelineValidateRequest(BaseModel):
    """Request to validate a pipeline configuration."""

    source_config: dict[str, Any]
    destination_config: dict[str, Any]
