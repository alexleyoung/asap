from sqlalchemy.orm import Session
import bcrypt
from Backend import models, schemas, auth
from datetime import date


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

##### TASK CRUDS #####

def create_task(db: Session, Task: schemas.TaskCreate):
    db_task = models.Task(title = Task.title, start = date.today(),
                          end = date.today(), description = Task.description,
                          category = Task.category, frequency = "",
                          dueDate = Task.dueDate, priority = Task.priority,
                          difficulty = Task.difficulty, duration = Task.duration,
                          flexibility = Task.flexibility, userID=Task.userID, calendarID=Task.calendarID) # calendar TBD
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        return None
    db.delete(task)
    db.commit()
    return task

def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def get_tasks(db: Session, userID: int, limit: int = 10):
    return db.query(models.Task).filter(models.Task.userID == userID).limit(limit).all()

def update_task(db: Session, task_id: int, task_update: schemas.TaskCreate):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        return None
    for key, value in task_update.model_dump(exclude_unset=True).items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task


### CALENDARS ### 

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