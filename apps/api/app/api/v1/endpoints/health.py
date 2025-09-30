"""System level API endpoints."""

from fastapi import APIRouter

from app.api.v1.schemas.health import HealthResponse
from app.core.config import settings

router = APIRouter(prefix="/health")


@router.get("", response_model=HealthResponse, tags=["system"])
async def get_health() -> HealthResponse:
    """API-level health endpoint."""

    return HealthResponse(status="ok", service="api", version=settings.version)
