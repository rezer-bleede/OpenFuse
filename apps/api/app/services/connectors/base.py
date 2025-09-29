"""Base connector contracts."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class Connector(ABC):
    """Abstract base class for data connectors."""

    name: str

    def __init__(self, **config: Any) -> None:
        self.config = config

    @abstractmethod
    def validate(self) -> None:
        """Validate connector configuration."""

    @abstractmethod
    async def run(self) -> None:
        """Execute the connector pipeline."""


class ConnectorRegistry:
    """In-memory registry for connector implementations."""

    def __init__(self) -> None:
        self._registry: dict[str, type[Connector]] = {}

    def register(self, connector: type[Connector]) -> None:
        self._registry[connector.__name__] = connector

    def get(self, name: str) -> type[Connector]:
        try:
            return self._registry[name]
        except KeyError as exc:
            raise LookupError(f"Connector '{name}' is not registered") from exc

    def list(self) -> list[str]:
        return sorted(self._registry.keys())


registry = ConnectorRegistry()
