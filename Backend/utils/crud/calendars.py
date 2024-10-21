from sqlalchemy.orm import Session
from ...database import schemas, models

# create a new calendar
def create_calendar(db: Session, calendar: schemas.CalendarCreate, userID: int):
    db_calendar = models.Calendar(
        name=calendar.name,
        description=calendar.description,
        timezone=calendar.timezone,
        userID=userID  # Linking the calendar to the user who owns it
    )
    db.add(db_calendar)
    db.commit()
    db.refresh(db_calendar)
    return db_calendar