"""WebSocket endpoints for real-time features."""
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..services import execute_python_code, compute_stats
from ..websockets import ConnectionManager

router = APIRouter()

# Create a global connection manager instance
manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time code execution."""
    await websocket.accept()
    
    try:
        while True:
            # Receive code from client
            data = await websocket.receive_json()
            code = data.get("code", "")
            
            if not code:
                await websocket.send_json({
                    "success": False,
                    "error": "No code provided"
                })
                continue
            
            # Execute and send results
            result = execute_python_code(code)
            
            await websocket.send_json({
                "success": result["success"],
                "output": result["output"],
                "error": result["error"]
            })
                
    except WebSocketDisconnect:
        pass


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