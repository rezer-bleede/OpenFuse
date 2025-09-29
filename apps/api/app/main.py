"""Entry point for the OpenFuse FastAPI application."""

from fastapi import FastAPI

from app.api.v1 import api_router
from app.core.config import settings


def create_application() -> FastAPI:
    """Instantiate the FastAPI application with global configuration."""
    app = FastAPI(
        title="OpenFuse API",
        version=settings.version,
        openapi_url="/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.include_router(api_router, prefix=settings.api_prefix)

    @app.get("/health", tags=["system"])
    async def healthcheck() -> dict[str, str]:
        """Liveness probe for the service."""
        return {"status": "ok"}

    return app


app = create_application()
