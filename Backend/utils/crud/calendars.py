from sqlalchemy.orm import Session
from ...database import schemas, models


# create a new calendar
def create_calendar(db: Session, calendar: schemas.CalendarCreate):
    db_calendar = models.Calendar(
        name=calendar.name,
        description=calendar.description,
        timezone=calendar.timezone,
        color=calendar.color,
        userID=calendar.userID,  # Linking the calendar to the user who owns it
    )
    db.add(db_calendar)
    db.commit()
    db.refresh(db_calendar)
    return db_calendar


# Get calendar by ID
def get_calendar(db: Session, calendar_id: int) -> models.Calendar:
    return db.query(models.Calendar).filter(models.Calendar.id == calendar_id).first()


# Edit calendar details
def edit_calendar(
    db: Session, calendar_id: int, calendar_update: schemas.CalendarUpdate
) -> models.Calendar:
    calendar = (
        db.query(models.Calendar).filter(models.Calendar.id == calendar_id).first()
    )
    if not calendar:
        return None

    # Update calendar fields
    if calendar_update.name is not None:
        calendar.name = calendar_update.name
    if calendar_update.description is not None:
        calendar.description = calendar_update.description
    if calendar_update.timezone is not None:
        calendar.timezone = calendar_update.timezone
    if calendar_update.color is not None:
        calendar.color = calendar_update.color

    db.commit()
    db.refresh(calendar)
    return calendar


# get calendars for user
def get_calendars_by_user(db: Session, userID: int):
    return db.query(models.Calendar).filter(models.Calendar.userID == userID).all()


# delete a calendar
def delete_calendar(db: Session, calendarID: int) -> bool:
    # First, delete all associated events
    db.query(models.Event).filter(models.Event.calendarID == calendarID).delete(
        synchronize_session=False
    )

    # Then delete the calendar
    calendar = (
        db.query(models.Calendar).filter(models.Calendar.id == calendarID).first()
    )
    if not calendar:
        return False

    db.delete(calendar)
    db.commit()
    return True
