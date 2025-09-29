"""HTTP client for interacting with the OpenFuse API."""

from __future__ import annotations

from typing import Any

import httpx
from pydantic import BaseModel, HttpUrl


class Health(BaseModel):
    """Schema for health check responses."""

    status: str
    service: str
    version: str


class OpenFuseClient:
    """Thin wrapper around httpx for interacting with OpenFuse services."""

    def __init__(self, base_url: str | HttpUrl, *, timeout: float = 5.0) -> None:
        self._client = httpx.Client(base_url=str(base_url), timeout=timeout)

    def health(self) -> Health:
        """Return the API health payload."""

        response = self._client.get("/api/v1/health")
        response.raise_for_status()
        return Health.model_validate(response.json())

    def request(self, method: str, url: str, **kwargs: Any) -> httpx.Response:
        """Make a raw request to the API."""

        return self._client.request(method, url, **kwargs)

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> "OpenFuseClient":
        return self

    def __exit__(self, *args: Any) -> None:
        self.close()
