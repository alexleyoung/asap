# websocket_manager.py
from typing import List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

    async def broadcast_add_event(self, event_data: dict):
        message = {"action": "add_event", "data": event_data}
        await self.broadcast_json(message)

    async def broadcast_update_event(self, event_data: dict):
        message = {"action": "update_event", "data": event_data}
        await self.broadcast_json(message)

    async def broadcast_delete_event(self, event_id: str):
        message = {"action": "delete_event", "data": {"id": event_id}}
        await self.broadcast_json(message)

    async def broadcast_json(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

# Instantiate the manager
manager = ConnectionManager()
