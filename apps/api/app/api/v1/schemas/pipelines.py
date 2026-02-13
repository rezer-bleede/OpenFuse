"""Pydantic schemas for pipeline API endpoints."""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.db.models import JobStatus, PipelineStatus, ReplicationMode


class PipelineBase(BaseModel):
    """Base pipeline schema."""

    name: str = Field(max_length=255)
    description: Optional[str] = None
    source_connector: str
    source_config: Dict[str, Any] = Field(default_factory=dict)
    destination_connector: str
    destination_config: Dict[str, Any] = Field(default_factory=dict)
    schedule_cron: Optional[str] = None
    replication_mode: ReplicationMode = ReplicationMode.FULL_TABLE
    incremental_key: str | None = None
    batch_size: int = 10000


class PipelineCreate(PipelineBase):
    """Schema for creating a pipeline."""
    pass


class PipelineUpdate(BaseModel):
    """Schema for updating a pipeline."""

    name: Optional[str] = None
    description: Optional[str] = None
    source_config: Optional[Dict[str, Any]] = None
    destination_config: Optional[Dict[str, Any]] = None
    schedule_cron: Optional[str] = None
    status: Optional[PipelineStatus] = None
    replication_mode: Optional[ReplicationMode] = None
    incremental_key: Optional[str] = None
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

    pipelines: List[PipelineResponse]
    total: int


class JobBase(BaseModel):
    """Base job schema."""

    pipeline_id: int
    status: JobStatus = JobStatus.PENDING


class JobResponse(JobBase):
    """Job response schema."""

    id: int
    rows_synced: int
    error_message: Optional[str]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class JobListResponse(BaseModel):
    """List of jobs."""

    jobs: List[JobResponse]
    total: int


class PipelineRunRequest(BaseModel):
    """Request to run a pipeline manually."""

    backfill: bool = False
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class PipelineValidateRequest(BaseModel):
    """Request to validate a pipeline configuration."""

    source_config: Dict[str, Any]
    destination_config: Dict[str, Any]
