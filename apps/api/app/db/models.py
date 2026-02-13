"""Database models for OpenFuse."""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional

from sqlalchemy.types import JSON
from sqlmodel import Field, SQLModel


class PipelineStatus(str, Enum):
    """Pipeline lifecycle states."""

    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    FAILED = "failed"
    DELETED = "deleted"


class ReplicationMode(str, Enum):
    """Data replication modes."""

    FULL_TABLE = "full_table"
    INCREMENTAL_KEY = "incremental_key"
    LOG_BASED = "log_based"


class JobStatus(str, Enum):
    """Pipeline job execution status."""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class PipelineBase(SQLModel):
    """Base pipeline model."""

    name: str = Field(max_length=255, description="Pipeline display name")
    description: Optional[str] = Field(default=None, max_length=1000)
    source_connector: str = Field(max_length=100, description="Source connector name")
    destination_connector: str = Field(max_length=100, description="Destination connector name")
    schedule_cron: Optional[str] = Field(default=None, description="Cron expression for scheduling")
    status: PipelineStatus = Field(default=PipelineStatus.DRAFT)
    replication_mode: ReplicationMode = Field(default=ReplicationMode.FULL_TABLE)
    incremental_key: Optional[str] = Field(default=None, description="Column for incremental replication")
    batch_size: int = Field(default=10000, description="Rows per batch")


class Pipeline(PipelineBase, table=True):
    """Pipeline table."""

    __tablename__ = "pipelines"

    id: Optional[int] = Field(default=None, primary_key=True)
    source_config: Dict[str, Any] = Field(default_factory=dict, sa_type=JSON())
    destination_config: Dict[str, Any] = Field(default_factory=dict, sa_type=JSON())
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})


class JobBase(SQLModel):
    """Base job model."""

    pipeline_id: int = Field(foreign_key="pipelines.id")
    status: JobStatus = Field(default=JobStatus.PENDING)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    rows_synced: int = 0
    error_message: Optional[str] = None


class Job(JobBase, table=True):
    """Job execution table."""

    __tablename__ = "jobs"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ConnectorInstanceBase(SQLModel):
    """Saved connector configuration."""

    name: str = Field(max_length=255, description="Instance display name")
    connector_type: str = Field(max_length=100, description="Connector type (e.g., postgres, snowflake)")
    is_active: bool = Field(default=True)


class ConnectorInstance(ConnectorInstanceBase, table=True):
    """Saved connector instances table."""

    __tablename__ = "connector_instances"

    id: Optional[int] = Field(default=None, primary_key=True)
    config: Dict[str, Any] = Field(default_factory=dict, sa_type=JSON())
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
