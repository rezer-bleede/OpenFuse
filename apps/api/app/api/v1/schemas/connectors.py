"""Pydantic models for connector related API responses."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from app.services.connectors import ConnectorDefinition


class ConnectorBase(BaseModel):
    """Shared fields for connector representations."""

    name: str = Field(..., description="Machine-readable identifier")
    title: str = Field(..., description="Display name presented in UIs")
    description: str = Field(..., description="Short summary of the connector")
    tags: list[str] = Field(default_factory=list, description="Free-form labels for grouping")

    @classmethod
    def from_definition(cls, definition: ConnectorDefinition) -> "ConnectorBase":
        return cls(
            name=definition.name,
            title=definition.title,
            description=definition.description,
            tags=definition.tags,
        )


class ConnectorDetailResponse(ConnectorBase):
    """Detailed connector response including configuration schema."""

    config_schema: dict[str, Any]

    @classmethod
    def from_definition(cls, definition: ConnectorDefinition) -> "ConnectorDetailResponse":
        return cls(
            name=definition.name,
            title=definition.title,
            description=definition.description,
            tags=definition.tags,
            config_schema=definition.config_schema,
        )


class ConnectorListResponse(BaseModel):
    """List of available connectors."""

    connectors: list[ConnectorDetailResponse]

    @classmethod
    def from_definitions(cls, definitions: list[ConnectorDefinition]) -> "ConnectorListResponse":
        return cls(connectors=[ConnectorDetailResponse.from_definition(d) for d in definitions])


class ConnectorValidationRequest(BaseModel):
    """Request body for validating a connector configuration."""

    config: dict[str, Any] = Field(default_factory=dict)


class ConnectorValidationResponse(BaseModel):
    """Simple validation response."""

    name: str
    valid: bool
