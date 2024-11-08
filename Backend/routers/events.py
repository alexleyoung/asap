from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
)
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import events as controller
from ..utils.auth import get_current_user
from ..utils.websocket_manager import manager
import json
from datetime import datetime


router = APIRouter(
    dependencies=[Depends(get_current_user)], tags=["events"], prefix="/events"
)



newRouter = APIRouter(tags=["events"])

# websocket endpoint for real-time notifications
@router.websocket("/notifications")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            message = await websocket.receive_text()  # Keep connection alive
            data = json.loads(message)
            if data["action"] == "edit_event":
                data["type"] = "event_updated"
                # response = {"status": "success", "message": "Event edited successfully"}
                await websocket.send_text(json.dumps(data))
            if data["action"] == "delete_event":
                data["type"] = "event_deleted"
                # response = {"status": "success", "message": "Event deleted successfully"}
                await websocket.send_text(json.dumps(data))
            if data["action"] == "create_event":
                data["type"] = "event_created"
                # response = {"status": "success", "message": "Event created successfully"}
                await websocket.send_text(json.dumps(data))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"Error occurred: {e}")

# create event
@newRouter.post("/users/{userID}/events", response_model=schemas.Event)
async def create_event_endpoint(
    userID: int,
    event: schemas.EventCreate,
    db: Session = Depends(get_db)
):
    db_user = users.get_user(db, userID=userID)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        db_event = await controller.create_event(db=db, event=event, userID=userID)
        
        # Helper function to safely convert event values to JSON-serializable format
        def format_event_value(value):
            if isinstance(value, datetime):
                return value.isoformat()
            return value

        # Prepare notification with properly formatted data
        notification = {
            "type": "event_created",
            "data": {
                "siid": db_event.id,
                "title": db_event.title,
                "start": db_event.start.isoformat() if db_event.start else None,
                "end": db_event.end.isoformat() if db_event.end else None,
                "description": db_event.description,
                "category": db_event.category,
                "frequency": db_event.frequency,
                "location": db_event.location,
                "calendarID": db_event.calendarID,
                "created_fields": {
                    key: format_event_value(getattr(db_event, key))
                    for key, value in event.model_dump().items()
                }
            }
        }
        print("Broadcasting creation:", notification)

        # Broadcast the creation to all connected clients
        await manager.broadcast(json.dumps(notification))
        print("Broadcasted creation")
        
        return db_event
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# edit event
@newRouter.put("/events/{eventID}", response_model=schemas.Event)
async def edit_event_endpoint(
    eventID: int, 
    event_update: schemas.EventUpdate, 
    db: Session = Depends(get_db)
):
    db_event = await controller.edit_event(db=db, eventID=eventID, event_update=event_update)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    try:
        # Helper function to safely convert event values to JSON-serializable format
        def format_event_value(value):
            if isinstance(value, datetime):
                return value.isoformat()
            return value

        # Prepare notification with properly formatted data
        notification = {
            "type": "event_updated",
            "data": {
                "siid": db_event.id,
                "title": db_event.title,
                "start": db_event.start.isoformat() if db_event.start else None,
                "end": db_event.end.isoformat() if db_event.end else None,
                "description": db_event.description,
                "category": db_event.category,
                "frequency": db_event.frequency,
                "location": db_event.location,
                # "userID": db_event.userID,
                "calendarID": db_event.calendarID,
                "updated_fields": {
                    key: format_event_value(getattr(db_event, key))
                    for key, value in event_update.model_dump(exclude_unset=True).items()
                }
            }
        }
        print("Broadcasting update:", notification)

        # Broadcast the update to all connected clients
        await manager.broadcast(json.dumps(notification))
        print("Broadcasted update")
        
        return db_event
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# get event
@router.get("/{eventID}", response_model=schemas.Event)
def get_event_endpoint(eventID: int, db: Session = Depends(get_db)):
    db_event = controller.get_event(db=db, eventID=eventID)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    return db_event


# delete event
@newRouter.delete("/events/{eventID}/delete", response_model=schemas.Event)
async def delete_event_endpoint(
    eventID: int,
    db: Session = Depends(get_db)
):
    db_event = await controller.delete_event(db=db, eventID=eventID)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    try:
        # Prepare notification for deletion
        notification = {
            "type": "event_deleted",
            "data": {
                "siid": db_event.id,
                "title": db_event.title,
                "start": db_event.start.isoformat() if db_event.start else None,
                "end": db_event.end.isoformat() if db_event.end else None,
                "description": db_event.description,
                "category": db_event.category,
                "frequency": db_event.frequency,
                "location": db_event.location,
                "calendarID": db_event.calendarID
            }
        }
        print("Broadcasting deletion:", notification)

        # Broadcast the deletion to all connected clients
        await manager.broadcast(json.dumps(notification))
        print("Broadcasted deletion")
        
        return db_event
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# get a user's events
@router.get("/", response_model=list[schemas.Event])
def get_user_events(userID: int, calendarID: Optional[int] = None, db: Session = Depends(get_db)):
    if not userID:
        raise HTTPException(status_code=400, detail="User ID is required")
    if calendarID:
        events = controller.get_events_by_calendar(db, userID, calendarID)
    else:
        events = controller.get_events_by_user(db, userID)
    if not events:
        return []
    return events
