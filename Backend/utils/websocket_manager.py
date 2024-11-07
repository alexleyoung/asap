from typing import Dict, List
from fastapi import WebSocket, WebSocketDisconnect, Depends
import jwt
from jwt import InvalidTokenError
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}  # userID -> connections

    async def connect(self, websocket: WebSocket, userID: int):
        await websocket.accept()
        if userID not in self.active_connections:
            self.active_connections[userID] = []
        self.active_connections[userID].append(websocket)

    def disconnect(self, websocket: WebSocket, userID: int):
        if userID in self.active_connections:
            self.active_connections[userID].remove(websocket)
            if not self.active_connections[userID]:
                del self.active_connections[userID]

    async def broadcast(self, message: str, exclude_user: int = None):
        for userID, connections in self.active_connections.items():
            if userID != exclude_user:
                disconnected = []
                for connection in connections:
                    try:
                        await connection.send_text(message)
                    except:
                        disconnected.append(connection)
                
                # Clean up any disconnected websockets
                for conn in disconnected:
                    self.disconnect(conn, userID)

manager = ConnectionManager()

