"""Tests for the OpenFuse Python SDK."""

from httpx import Request, Response

from openfuse_common.client import Health, OpenFuseClient


class DummyHTTPClient:
    """Test double that avoids HTTP calls."""

    def get(self, url: str) -> Response:  # type: ignore[override]
        request = Request("GET", url)
        return Response(status_code=200, request=request, json={"status": "ok", "service": "api", "version": "0.1.0"})

    def request(self, method: str, url: str, **kwargs) -> Response:  # type: ignore[override]
        return self.get(url)

    def close(self) -> None:  # type: ignore[override]
        return None


def test_health_model() -> None:
    payload = {"status": "ok", "service": "api", "version": "0.1.0"}
    health = Health.model_validate(payload)
    assert health.status == "ok"


def test_client_health() -> None:
    client = OpenFuseClient("http://test")
    client._client = DummyHTTPClient()  # type: ignore[assignment]
    health = client.health()
    assert health.status == "ok"
