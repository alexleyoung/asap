from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import events as controller
from ..utils.crud import users
from ..utils.auth import get_current_user
from ..utils.websocket_manager import manager
import json


router = APIRouter(dependencies=[Depends(get_current_user)], tags=["events"])


# websocket endpoint for real-time notifications
@router.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keeps the connection open
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# to create an event
@router.post("/users/{userID}/events", response_model=schemas.Event)
async def create_event_endpoint(
    userID: int, event: schemas.EventCreate, db: Session = Depends(get_db)
):
    db_user = users.get_user(db, userID=userID)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_event = controller.create_event(db=db, event=event, userID=userID)
    
    await manager.broadcast(f"New event created: {db_event.title}")

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
