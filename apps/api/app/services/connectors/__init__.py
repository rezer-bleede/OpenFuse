"""Connector registry and abstractions.

Community connectors live here. Enterprise connectors can be loaded dynamically via entry points
without modifying this package.
"""

from .base import Connector, ConnectorDefinition, ConnectorRegistry, registry

# Register built-in community connectors.
from . import example as _example  # noqa: F401

__all__ = ["Connector", "ConnectorDefinition", "ConnectorRegistry", "registry"]
