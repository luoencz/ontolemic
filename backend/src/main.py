"""
FastAPI backend for Inner Cosmos personal website.
Main entry point that sets up the application.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import api_router
from .database import init_db
from .scheduler import init_scheduler, shutdown_scheduler, schedule_session_end
from .api.stats import router as stats_router

# Create FastAPI app
app = FastAPI(title="Inner Cosmos API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "https://home.the-o.space",  # Canonical production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    """Initialize database and scheduler on startup."""
    await init_db()
    await init_scheduler()


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup scheduler on shutdown."""
    shutdown_scheduler()


# Update heartbeat endpoint to use scheduler
@app.middleware("http")
async def schedule_session_timeout(request, call_next):
    """Middleware to handle session scheduling after heartbeat."""
    response = await call_next(request)
    
    # Check if this was a heartbeat request
    if request.url.path == "/api/stats/heartbeat" and response.status_code == 200:
        # Get response body (this is a bit hacky but works for our use case)
        import json
        body = b""
        async for chunk in response.body_iterator:
            body += chunk
        
        try:
            data = json.loads(body)
            if "session_id" in data:
                schedule_session_end(data["session_id"])
        except:
            pass
        
        # Recreate response with the body
        from fastapi.responses import Response
        return Response(
            content=body,
            status_code=response.status_code,
            headers=dict(response.headers),
            media_type=response.media_type
        )
    
    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True) 