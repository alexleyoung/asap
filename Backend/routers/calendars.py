from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import calendars as controller
from ..utils.auth import get_current_user
from ..database import models
from ..utils.crud import users

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
@router.get("/{calendar_id}", response_model=schemas.Calendar)
def get_calendar_endpoint(
    calendar_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    calendar = controller.get_calendar(db, calendar_id)
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")

    # Check if the user has at least viewer permissions for this calendar
    # controller.check_calendar_permission(current_user.id, calendar_id, "viewer", db)
    return calendar


# Edit calendar details
@router.put("/{calendar_id}", response_model=schemas.Calendar)
def edit_calendar_endpoint(
    calendar_id: int,
    calendar_update: schemas.CalendarUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Ensure the user has admin or editor permissions to update calendar details
    # controller.check_calendar_permission(current_user.id, calendar_id, "admin", db)

    updated_calendar = controller.edit_calendar(db, calendar_id, calendar_update)
    if not updated_calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")
    return updated_calendar


# get all of a users calendars
@router.get("/", response_model=list[schemas.Calendar])
def get_calendars(userID: int, db: Session = Depends(get_db)):
    calendars = controller.get_calendars_by_user(db, userID=userID)
    if not calendars:
        raise HTTPException(status_code=404, detail="No calendars found for this user")
    return calendars


# Endpoint to create a new calendar
@router.post("/", response_model=schemas.Calendar)
def create_calendar_endpoint(
    calendar: schemas.CalendarCreate, db: Session = Depends(get_db)
):
    db_user = users.get_user(db, userID=calendar.userID)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_calendar = controller.create_calendar(
        db=db, calendar=calendar, userID=calendar.userID
    )
    return db_calendar


# delete calendar
@router.delete("/{calendarID}", status_code=204)
def delete_calendar_endpoint(
    calendarID: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # controller.check_calendar_permission(current_user.id, calendar_id, "admin", db)

    try:
        # Attempt to delete the calendar and its events
        result = controller.delete_calendar(db, calendarID)
        if not result:
            raise HTTPException(status_code=404, detail="Calendar not found")

        return None  # 204 No Content response

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while deleting the calendar and its events",
        )
