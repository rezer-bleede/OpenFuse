"""REST endpoints for global pipeline job listing."""

from fastapi import APIRouter, Depends
from sqlmodel import desc, func, select

from app.api.v1.schemas.pipelines import JobListResponse, JobResponse
from app.db import get_session
from app.db.models import Job, JobStatus

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=JobListResponse)
async def list_jobs(
    skip: int = 0,
    limit: int = 50,
    status_filter: JobStatus | None = None,
    pipeline_id: int | None = None,
    session=Depends(get_session),
) -> JobListResponse:
    """List jobs across all pipelines with optional filtering."""

    query = select(Job)
    if status_filter is not None:
        query = query.where(Job.status == status_filter)
    if pipeline_id is not None:
        query = query.where(Job.pipeline_id == pipeline_id)

    count_query = select(func.count()).select_from(query.subquery())
    total = session.exec(count_query).one()

    query = query.offset(skip).limit(limit).order_by(desc(Job.created_at))
    jobs = session.exec(query).all()

    return JobListResponse(
        jobs=[JobResponse.model_validate(job) for job in jobs],
        total=total,
    )
