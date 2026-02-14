"""Versioned API routes for OpenFuse."""

from fastapi import APIRouter

from app.api.v1.endpoints import connectors, health, jobs, pipelines

router = APIRouter(prefix="/v1")
router.include_router(health.router)
router.include_router(connectors.router)
router.include_router(pipelines.router)
router.include_router(jobs.router)
