from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session



#create app
app = FastAPI()

models.Base.metadata.create_all(bind=engine)

#create User schemas
class UserBase(BaseModel):
    username: str
    firstName: str
    lastName: str
    email: str
    occupation: str

#for creating a user
class UserCreate(UserBase):
    password: str

#main class
class User(UserBase):
    id: int

    class Config:
        orm_mode = True

###
#create Calendar schemas
class CalendarBase(BaseModel):
    name: str
    description: str
    timezone: str

#for creating a calendar
class CalendarCreate(CalendarBase):
    pass #nothing just to create that you cannot read

#main class
class Calendar(BaseModel):
    id: int
    ownerID: int

    class Config:
        orm_mode = True

###
#ScheduleItem
class ScheduleItemBase(BaseModel):
    title: str
    start: int
    end: int
    description: str
    category: str
    frequency: str

#to create
class ScheduleItemCreate(ScheduleItemBase):
    pass

#main class
class ScheduleItem(ScheduleItemBase):
    id: int
    userID: int
    calendarID: int

    class Config:
        orm_mode = True

###
#Event
class EventBase(BaseModel):
    location: str

#to create
class EventCreate(EventBase):
    pass

#main class
class Event(EventBase):
    id: int

    class Config:
        orm_mode = True

###
#Task
class TaskBase(BaseModel):
    dueDate: int
    priority: int
    difficulty: int
    duration: int 
    flexibility: int

#to create
class TaskCreate(TaskBase):
    pass

#main class
class Task(TaskBase):
    id: int

    class Config:
        orm_mode = True





#run database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#update 
@app.post("/users/", status_code = status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user