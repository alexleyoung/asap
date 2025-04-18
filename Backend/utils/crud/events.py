from sqlalchemy.orm import Session
from ...database import schemas, models


async def create_event(db: Session, event: schemas.EventCreate, userID: int):
    db_event = models.Event(
        title=event.title,
        start=event.start,
        end=event.end,
        description=event.description,
        category=event.category,
        frequency=event.frequency,
        location=event.location,
        userID=event.userID,
        calendarID=event.calendarID,
        color=event.color,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    # manager.broadcast(db_event)
    return db_event


# get event
def get_event(db: Session, eventID: int):
    return db.query(models.Event).filter(models.Event.id == eventID).first()


# delete event
async def delete_event(db: Session, eventID: int):
    db_event = db.query(models.Event).filter(models.Event.id == eventID).first()
    if db_event is None:
        return None
    db.delete(db_event)
    db.commit()
    # manager.broadcast(eventID)
    return db_event


# get a user's events
def get_events_by_user(db: Session, userID: int):
    return db.query(models.Event).filter(models.Event.userID == userID).all()


# get a user's events by calendar
def get_events_by_calendar(db: Session, calendarID: int) -> list[models.Event]:
    return db.query(models.Event).filter(models.Event.calendarID == calendarID).all()


def get_calendar_events(db: Session, calendarID: int) -> list[models.Event]:
    return db.query(models.Event).filter(models.Event.calendarID == calendarID).all()


# edit event
async def edit_event(db: Session, eventID: int, event_update: schemas.EventUpdate):
    db_event = db.query(models.Event).filter(models.Event.id == eventID).first()
    if db_event is None:
        return None

    # Update the event fields
    for key, value in event_update.model_dump(exclude_unset=True).items():
        setattr(db_event, key, value)

    db.commit()
    db.refresh(db_event)

    return db_event
