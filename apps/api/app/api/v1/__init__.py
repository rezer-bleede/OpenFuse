"""Version 1 of the OpenFuse API."""

from fastapi import APIRouter

from .routes import router as v1_router

api_router = APIRouter()
api_router.include_router(v1_router)

__all__ = ["api_router", "v1_router"]
