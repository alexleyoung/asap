from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import events as controller
from ..utils.crud import users
from ..utils.auth import get_current_user, verify_token
from ..utils.websocket_manager import manager
import json
from typing import Dict, List, Annotated
from ..database import models


router = APIRouter(dependencies=[Depends(get_current_user)], tags=["events"])


@router.websocket("/ws/notifications")
async def websocket_endpoint(
    websocket: WebSocket,
    db: Session = Depends(get_db)
):
    # Get token from query parameters
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4000)
        return

    # Verify the token
    user_id, email = await verify_token(token)
    if not user_id:
        await websocket.close(code=4001)
        return

    # Verify user exists in database
    user = users.get_user_by_email(db, email)
    if not user:
        await websocket.close(code=4001)
        return

    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle any incoming messages if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

# Modified event creation endpoint
@router.post("/users/{userID}/events", response_model=schemas.Event)
async def create_event_endpoint(
    userID: int, 
    event: schemas.EventCreate, 
    current_user: Annotated[models.User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    db_user = users.get_user(db, userID=userID)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_event = controller.create_event(db=db, event=event, userID=userID)
    
    # Create notification payload
    notification = {
        "type": "event_created",
        "data": {
            "id": db_event.id,
            "title": db_event.title,
            "start_time": str(db_event.start_time),
            "calendar_id": db_event.calendar_id,
            "created_by": userID
        }
    }
    
    # Broadcast to all connected users except the creator
    await manager.broadcast(
        json.dumps(notification),
        exclude_user=userID
    )

    return db_event


# edit event
@router.put("/events/{eventID}", response_model=schemas.Event)
def edit_event_endpoint(
    eventID: int, event_update: schemas.EventUpdate, db: Session = Depends(get_db)
):
    db_event = controller.edit_event(db=db, eventID=eventID, event_update=event_update)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event


# get event
@router.get("/events/{eventID}", response_model=schemas.Event)
def get_event_endpoint(eventID: int, db: Session = Depends(get_db)):
    db_event = controller.get_event(db=db, eventID=eventID)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    return db_event


# delete event
@router.delete("/events/{eventID}/delete", response_model=schemas.Event)
def delete_event_endpoint(eventID: int, db: Session = Depends(get_db)):
    db_event = controller.delete_event(db=db, eventID=eventID)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event


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
        raise HTTPException(status_code=404, detail="No events found for this user")
    return events

# # get a user's events
# @router.get("/users/{userID}/events", response_model=list[schemas.Event])
# def get_user_events(userID: int, db: Session = Depends(get_db)):
#     events = controller.get_events_by_user(db, userID)
#     if not events:
#         raise HTTPException(status_code=404, detail="No events found for this user")
#     return events


# # Endpoint to create a new calendar
# @router.post("/users/{userID}/calendars", response_model=schemas.Calendar)
# def create_calendar_endpoint(
#     userID: int, calendar: schemas.CalendarCreate, db: Session = Depends(get_db)
# ):
#     db_user = users.get_user(db, userID=userID)
#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found")

#     db_calendar = controller.create_calendar(db=db, calendar=calendar, userID=userID)
#     return db_calendar
