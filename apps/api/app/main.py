"""Entry point for the OpenFuse FastAPI application."""

from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import api_router
from app.core.config import settings
from app.db import create_db_and_tables


def create_application() -> FastAPI:
    """Instantiate the FastAPI application with global configuration."""
    app = FastAPI(
        title="OpenFuse API",
        version=settings.version,
        openapi_url="/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    @app.on_event("startup")
    def on_startup():
        """Create database tables on startup."""
        create_db_and_tables()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://host.docker.internal:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix=settings.api_prefix)

    @app.get("/health", tags=["system"])
    async def healthcheck() -> Dict[str, str]:
        """Liveness probe for the service."""
        return {"status": "ok"}

    return app


app = create_application()
