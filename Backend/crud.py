from sqlalchemy.orm import Session
import bcrypt
from Backend import models, schemas, auth


##### USER CRUDS #####

#create user
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(firstname=user.firstname, 
                          lastname=user.lastname, 
                          email=user.email, 
                          hashed_password=hashed_password.decode('utf-8'))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#delete user
def delete_user(db: Session, userID: int):
    user = db.query(models.User).filter(models.User.id == userID).first()
    if not user:
        return None
    db.delete(user)
    db.commit()
    return user

#get single user by user id
def get_user(db: Session, userID: int):
    return db.query(models.User).filter(models.User.id == userID).first()

#get single user by email
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

#get all users
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

#to change password
def change_user_password(db: Session, userID: int, new_password: str):
    user = db.query(models.User).filter(models.User.id == userID).first()
    if not user:
        return None
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    user.hashedPassword = hashed_password.decode('utf-8')
    db.commit()
    db.refresh(user)
    return user

#update info
def update_user(db: Session, userID: int, user_update: schemas.UserUpdate):
    user = db.query(models.User).filter(models.User.id == userID).first()
    if not user:
        return None
    for key, value in user_update.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


##### EVENT CRUDS #####

def create_event(db: Session, event: schemas.EventCreate, userID: int):
    db_event = models.Event(title = event.title, start = event.start,
                                   end = event.end, description = event.description,
                                   category = event.category, frequency = event.frequency,
                                   location = event.location, userID=userID,
                                   calendarID = event.calendarID)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

#edit event
def edit_event(db: Session, eventID: int, event_update: schemas.EventUpdate):
    db_event = db.query(models.Event).filter(models.Event.id == eventID).first()
    if db_event is None:
        return None

    for key, value in event_update.model_dump(exclude_unset=True).items():
        setattr(db_event, key, value)

    db.commit()
    db.refresh(db_event)
    return db_event


#get event
def get_event(db: Session, eventID: int):
    return db.query(models.Event).filter(models.Event.id == eventID).first()

#delete event
def delete_event(db: Session, eventID: int):
    db_event = db.query(models.Event).filter(models.Event.id == eventID).first()
    if db_event is None:
        return None
    db.delete(db_event)
    db.commit()
    return db_event

#get a user's events
def get_events_by_user(db: Session, userID: int):
    return db.query(models.Event).filter(models.Event.userID == userID).all()


# CRUD operation to create a new calendar
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