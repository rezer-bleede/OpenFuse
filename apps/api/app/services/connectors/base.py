"""Base connector contracts and in-memory registry implementation."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, ClassVar, Literal

Capability = Literal["source", "destination"]


def derive_capabilities(tags: list[str]) -> list[Capability]:
    """Infer connector capabilities from tags."""

    capabilities: list[Capability] = []
    lowered_tags = {tag.lower() for tag in tags}
    if "source" in lowered_tags:
        capabilities.append("source")
    if "destination" in lowered_tags:
        capabilities.append("destination")
    return capabilities


class Connector(ABC):
    """Abstract base class for data connectors."""

    #: Machine-friendly identifier for the connector. Must be unique.
    name: ClassVar[str]
    #: Human-friendly title that can be rendered in UIs.
    title: ClassVar[str]
    #: Short description summarising what the connector does.
    description: ClassVar[str] = ""
    #: Optional tags used for categorisation in dashboards.
    tags: ClassVar[list[str]] = []
    #: JSON-serialisable schema describing the expected configuration payload.
    config_schema: ClassVar[dict[str, Any]] = {
        "type": "object",
        "properties": {},
        "additionalProperties": True,
    }

    def __init__(self, **config: Any) -> None:
        self.config = config

    @abstractmethod
    def validate(self) -> None:
        """Validate connector configuration."""

    @abstractmethod
    async def run(self) -> dict[str, Any] | None:
        """Execute the connector pipeline."""

    @classmethod
    def to_definition(cls) -> "ConnectorDefinition":
        """Return a definition object that can be serialised via the API."""

        return ConnectorDefinition(
            name=cls.name,
            title=cls.title,
            description=cls.description,
            tags=list(cls.tags),
            config_schema=cls.config_schema,
        )


@dataclass(slots=True)
class ConnectorDefinition:
    """Serializable metadata about a connector implementation."""

    name: str
    title: str
    description: str
    tags: list[str]
    config_schema: dict[str, Any]


class ConnectorRegistry:
    """In-memory registry for connector implementations."""

    def __init__(self) -> None:
        self._registry: dict[str, type[Connector]] = {}

    def register(self, connector: type[Connector]) -> None:
        identifier = connector.name
        if identifier in self._registry:
            raise ValueError(f"Connector '{identifier}' is already registered")

        self._registry[identifier] = connector

    def get(self, name: str) -> type[Connector]:
        try:
            return self._registry[name]
        except KeyError as exc:
            raise LookupError(f"Connector '{name}' is not registered") from exc

    def list(self) -> list[str]:
        return sorted(self._registry.keys())

    def describe(self) -> list[ConnectorDefinition]:
        """Return metadata for all registered connectors."""

        return [self._registry[name].to_definition() for name in self.list()]

    def create(self, name: str, **config: Any) -> Connector:
        """Instantiate a registered connector with the provided configuration."""

        connector_cls = self.get(name)
        return connector_cls(**config)


registry = ConnectorRegistry()
