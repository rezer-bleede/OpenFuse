"""REST endpoints for connector metadata and validation."""

from fastapi import APIRouter, HTTPException, status

from app.api.v1.schemas.connectors import (
    ConnectorDetailResponse,
    ConnectorListResponse,
    ConnectorValidationRequest,
    ConnectorValidationResponse,
)
from app.services.connectors import registry

router = APIRouter(prefix="/connectors", tags=["connectors"])


@router.get("", response_model=ConnectorListResponse)
async def list_connectors() -> ConnectorListResponse:
    """Return all registered connectors and their metadata."""

    definitions = registry.describe()
    return ConnectorListResponse.from_definitions(definitions)


@router.get("/{name}", response_model=ConnectorDetailResponse)
async def get_connector(name: str) -> ConnectorDetailResponse:
    """Return metadata for a specific connector."""

    try:
        definition = registry.get(name).to_definition()
    except LookupError as exc:  # pragma: no cover - defensive branch
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return ConnectorDetailResponse.from_definition(definition)


@router.post("/{name}/validate", response_model=ConnectorValidationResponse)
async def validate_connector(
    name: str, request: ConnectorValidationRequest
) -> ConnectorValidationResponse:
    """Validate a connector configuration without executing the pipeline."""

    try:
        connector = registry.create(name, **request.config)
    except LookupError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    try:
        connector.validate()
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    return ConnectorValidationResponse(name=name, valid=True)
