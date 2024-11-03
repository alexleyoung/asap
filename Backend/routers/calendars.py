from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import calendars as controller
from ..utils.auth import get_current_user
from ..database import models

router = APIRouter(
    dependencies=[Depends(get_current_user)], prefix="/calendars", tags=["calendars"]
)

# create calendar
@router.post("/", response_model=schemas.Calendar)
def create_calendar(Calendar: schemas.CalendarCreate, db: Session = Depends(get_db)):
    db_calendar = controller.create_calendar(db, Calendar)
    if not db_calendar:
        raise HTTPException(status_code=400, detail="Calendar creation failed")
    return db_calendar

# Get calendar details by ID
@router.get("/calendars/{calendar_id}", response_model=schemas.Calendar)
def get_calendar_endpoint(calendar_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    calendar = controller.get_calendar(db, calendar_id)
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")
    
    # Check if the user has at least viewer permissions for this calendar
    #controller.check_calendar_permission(current_user.id, calendar_id, "viewer", db)
    return calendar

# Edit calendar details
@router.put("/calendars/{calendar_id}", response_model=schemas.Calendar)
def edit_calendar_endpoint(
    calendar_id: int, 
    calendar_update: schemas.CalendarUpdate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    # Ensure the user has admin or editor permissions to update calendar details
    #controller.check_calendar_permission(current_user.id, calendar_id, "admin", db)
    
    updated_calendar = controller.edit_calendar(db, calendar_id, calendar_update)
    if not updated_calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")
    
    return updated_calendar

# get all of a users calendars
@router.get("/calendars/", response_model=list[schemas.calendar])
def get_calendars(user_id: int = Query(...), db: Session = Depends(get_db)):
    calendars = controller.get_calendars_by_user(db, user_id=user_id)
    if not calendars:
        raise HTTPException(status_code=404, detail="No calendars found for this user")
    return calendars