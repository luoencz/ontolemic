"""
Production entry point for the FastAPI application.
This module exports the app instance for use with ASGI servers like uvicorn.
"""
from .main import app

# Export the app instance
__all__ = ['app'] 