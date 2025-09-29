"""Tests for connector registry."""

import pytest

from app.services.connectors import registry


def test_registry_lists_example_connector() -> None:
    connectors = registry.list()
    assert "ExampleConnector" in connectors


def test_registry_missing_connector() -> None:
    with pytest.raises(LookupError):
        registry.get("UnknownConnector")
