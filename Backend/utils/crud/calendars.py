from sqlalchemy.orm import Session
from ...database import schemas, models


# create a new calendar
def create_calendar(db: Session, calendar: schemas.CalendarCreate, userID: int):
    db_calendar = models.Calendar(
        name=calendar.name,
        description=calendar.description,
        timezone=calendar.timezone,
        userID=userID,  # Linking the calendar to the user who owns it
    )
    db.add(db_calendar)
    db.commit()
    db.refresh(db_calendar)
    return db_calendar

# Get calendar by ID
def get_calendar(db: Session, calendar_id: int) -> models.Calendar:
    return db.query(models.Calendar).filter(models.Calendar.id == calendar_id).first()

# Edit calendar details
def edit_calendar(db: Session, calendar_id: int, calendar_update: schemas.CalendarUpdate) -> models.Calendar:
    calendar = db.query(models.Calendar).filter(models.Calendar.id == calendar_id).first()
    if not calendar:
        return None
    
    # Update calendar fields
    if calendar_update.name is not None:
        calendar.name = calendar_update.name
    if calendar_update.description is not None:
        calendar.description = calendar_update.description

    db.commit()
    db.refresh(calendar)
    return calendar

# get calendars for user
def get_calendars_by_user(db: Session, user_id: int):
    return db.query(models.Calendar).filter(models.Calendar.userID == user_id).all()
