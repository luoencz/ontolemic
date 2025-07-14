from fastapi import APIRouter
from .code import router as code_router
from .health import router as health_router
from .stats import router as stats_router
from .websockets import router as ws_router

# Create main API router
api_router = APIRouter()

# Include sub-routers
api_router.include_router(health_router, tags=["health"])
api_router.include_router(code_router, prefix="/code", tags=["code"])
api_router.include_router(stats_router, prefix="/stats", tags=["stats"])
api_router.include_router(ws_router, tags=["websockets"])

__all__ = ['api_router'] 