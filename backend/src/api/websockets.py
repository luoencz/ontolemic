"""WebSocket endpoints for real-time features."""
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..services import compute_stats
from ..websockets import ConnectionManager

router = APIRouter()

# Create a global connection manager instance
manager = ConnectionManager()


@router.websocket("/live-stats")
async def live_stats(websocket: WebSocket):
    """WebSocket endpoint for live statistics updates."""
    await manager.connect(websocket)
    
    # Send initial stats
    stats = await compute_stats()
    await websocket.send_json({
        'type': 'stats-update', 
        'data': stats, 
        'timestamp': datetime.utcnow().isoformat()
    })
    
    try:
        while True:
            await websocket.receive_text()  # Keep connection open
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# Export manager for use in other modules
__all__ = ['router', 'manager'] 