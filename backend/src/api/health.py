"""Health check endpoints."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Inner Cosmos API is running"} 