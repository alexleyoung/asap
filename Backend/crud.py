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
def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
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
def change_user_password(db: Session, user_id: int, new_password: str):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return None
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    user.hashedPassword = hashed_password.decode('utf-8')
    db.commit()
    db.refresh(user)
    return user

#update info
def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return None
    for key, value in user_update.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


##### EVENT CRUDS #####

def create_schedule_item(db: Session, Event: schemas.EventCreate):
    db_event = models.scheduleItem(title = Event.title, start = Event.start,
                                   end = Event.end, description = Event.description,
                                   category = Event.category, frequency = Event.frequency,
                                   location = Event.location)
    db.add(db_event)
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

def create_calendar(db: Session, Calendar: schemas.CalendarCreate):
    db_calendar = models.Calendar(name = Calendar.name, description = Calendar.description,
                                  timezone = Calendar.timezone, ownerID = Calendar.ownerID)
    db.add(db_calendar)
    db.commit()
    db.refresh(db_calendar)
    return db_calendar