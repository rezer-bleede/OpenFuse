"""REST endpoints for pipeline management."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select, func, desc

from app.api.v1.schemas.pipelines import (
    PipelineCreate,
    PipelineListResponse,
    PipelineResponse,
    PipelineUpdate,
    JobListResponse,
    JobResponse,
    PipelineRunRequest,
)
from app.db import get_session
from app.db.models import Pipeline, Job, JobStatus, PipelineStatus
from app.services.connectors import derive_capabilities, registry

router = APIRouter(prefix="/pipelines", tags=["pipelines"])


def _require_connector_capability(name: str, required: str) -> None:
    """Ensure a connector supports the required role."""

    try:
        connector_cls = registry.get(name)
    except LookupError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Connector '{name}' not found",
        )

    capabilities = derive_capabilities(list(getattr(connector_cls, "tags", [])))
    if required not in capabilities:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Connector '{name}' does not support '{required}' capability",
        )


@router.get("", response_model=PipelineListResponse)
async def list_pipelines(
    skip: int = 0,
    limit: int = 50,
    status_filter: PipelineStatus | None = None,
    session=Depends(get_session),
) -> PipelineListResponse:
    """List all pipelines with pagination."""

    query = select(Pipeline).where(Pipeline.status != PipelineStatus.DELETED)
    if status_filter:
        query = query.where(Pipeline.status == status_filter)

    count_query = select(func.count()).select_from(query.subquery())
    total = session.exec(count_query).one()

    query = query.offset(skip).limit(limit).order_by(desc(Pipeline.created_at))
    pipelines = session.exec(query).all()

    return PipelineListResponse(
        pipelines=[PipelineResponse.model_validate(p) for p in pipelines],
        total=total,
    )


@router.post("", response_model=PipelineResponse, status_code=status.HTTP_201_CREATED)
async def create_pipeline(
    pipeline: PipelineCreate,
    session=Depends(get_session),
) -> PipelineResponse:
    """Create a new pipeline."""

    _require_connector_capability(pipeline.source_connector, "source")
    _require_connector_capability(pipeline.destination_connector, "destination")

    db_pipeline = Pipeline(
        name=pipeline.name,
        description=pipeline.description,
        source_connector=pipeline.source_connector,
        source_config=pipeline.source_config,
        destination_connector=pipeline.destination_connector,
        destination_config=pipeline.destination_config,
        schedule_cron=pipeline.schedule_cron,
        replication_mode=pipeline.replication_mode,
        incremental_key=pipeline.incremental_key,
        batch_size=pipeline.batch_size,
        status=PipelineStatus.DRAFT,
    )

    session.add(db_pipeline)
    session.commit()
    session.refresh(db_pipeline)

    return PipelineResponse.model_validate(db_pipeline)


@router.get("/{pipeline_id}", response_model=PipelineResponse)
async def get_pipeline(
    pipeline_id: int,
    session=Depends(get_session),
) -> PipelineResponse:
    """Get a specific pipeline."""

    pipeline = session.get(Pipeline, pipeline_id)
    if not pipeline or pipeline.status == PipelineStatus.DELETED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline {pipeline_id} not found",
        )

    return PipelineResponse.model_validate(pipeline)


@router.patch("/{pipeline_id}", response_model=PipelineResponse)
async def update_pipeline(
    pipeline_id: int,
    update: PipelineUpdate,
    session=Depends(get_session),
) -> PipelineResponse:
    """Update a pipeline."""

    pipeline = session.get(Pipeline, pipeline_id)
    if not pipeline or pipeline.status == PipelineStatus.DELETED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline {pipeline_id} not found",
        )

    update_data = update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(pipeline, field, value)

    pipeline.updated_at = datetime.utcnow()
    session.add(pipeline)
    session.commit()
    session.refresh(pipeline)

    return PipelineResponse.model_validate(pipeline)


@router.delete("/{pipeline_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pipeline(
    pipeline_id: int,
    session=Depends(get_session),
) -> None:
    """Soft delete a pipeline."""

    pipeline = session.get(Pipeline, pipeline_id)
    if not pipeline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline {pipeline_id} not found",
        )

    pipeline.status = PipelineStatus.DELETED
    pipeline.updated_at = datetime.utcnow()
    session.commit()


@router.post("/{pipeline_id}/run", response_model=JobResponse)
async def run_pipeline(
    pipeline_id: int,
    request: PipelineRunRequest | None = None,
    session=Depends(get_session),
) -> JobResponse:
    """Trigger a pipeline run."""

    pipeline = session.get(Pipeline, pipeline_id)
    if not pipeline or pipeline.status == PipelineStatus.DELETED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline {pipeline_id} not found",
        )

    if pipeline.status != PipelineStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Pipeline must be active to run",
        )

    job = Job(
        pipeline_id=pipeline_id,
        status=JobStatus.PENDING,
    )
    session.add(job)
    session.commit()
    session.refresh(job)

    from app.services.workflows.tasks import run_pipeline_task
    try:
        run_pipeline_task.delay(job.id)
    except Exception:
        # Keep API responsive in environments where the broker is unavailable.
        # The job remains pending and can be retried by a worker later.
        pass

    return JobResponse.model_validate(job)


@router.get("/{pipeline_id}/jobs", response_model=JobListResponse)
async def list_pipeline_jobs(
    pipeline_id: int,
    skip: int = 0,
    limit: int = 20,
    session=Depends(get_session),
) -> JobListResponse:
    """List jobs for a pipeline."""

    pipeline = session.get(Pipeline, pipeline_id)
    if not pipeline or pipeline.status == PipelineStatus.DELETED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline {pipeline_id} not found",
        )

    query = select(Job).where(Job.pipeline_id == pipeline_id)
    count_query = select(func.count()).select_from(query.subquery())
    total = session.exec(count_query).one()

    query = query.offset(skip).limit(limit).order_by(desc(Job.created_at))
    jobs = session.exec(query).all()

    return JobListResponse(
        jobs=[JobResponse.model_validate(j) for j in jobs],
        total=total,
    )


@router.get("/{pipeline_id}/validate")
async def validate_pipeline(
    pipeline_id: int,
    session=Depends(get_session),
) -> dict:
    """Validate pipeline configuration."""

    pipeline = session.get(Pipeline, pipeline_id)
    if not pipeline or pipeline.status == PipelineStatus.DELETED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline {pipeline_id} not found",
        )

    errors = []

    try:
        source = registry.create(pipeline.source_connector, **pipeline.source_config)
        source.validate()
    except Exception as e:
        errors.append(f"Source: {str(e)}")

    try:
        dest = registry.create(pipeline.destination_connector, **pipeline.destination_config)
        dest.validate()
    except Exception as e:
        errors.append(f"Destination: {str(e)}")

    return {"valid": len(errors) == 0, "errors": errors}
