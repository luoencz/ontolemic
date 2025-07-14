"""WebSocket connection management."""
from typing import List
from fastapi import WebSocket


class ConnectionManager:
    """Manages WebSocket connections for broadcasting updates."""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accept and track a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection from tracking."""
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """Broadcast a message to all active connections."""
        for connection in self.active_connections:
            await connection.send_json(message) 