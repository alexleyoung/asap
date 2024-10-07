from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Annotated
from Backend import models
from .database import engine, SessionLocal
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy import DateTime

# For JWT token response
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None


#create User schemas
class UserBase(BaseModel):
    firstName: str
    lastName: str
    email: str

class UserInDB(UserBase):
    hashed_password: str

#for creating a user
class UserCreate(UserBase):
    password: str

#for updating a user
class UserUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[str] = None

#main class
class User(UserBase):
    id: int

    class Config:
        from_attributes = True




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
        from_attributes = True

###
#ScheduleItem
class ScheduleItemBase(BaseModel):
    title: str
    start: DateTime
    end: DateTime
    description: Optional[str] = None  # Optional
    category: Optional[str] = None  # Optional
    frequency: Optional[str] = None  # Optional

#to create
class ScheduleItemCreate(ScheduleItemBase):
    pass

#to update
class ScheduleItemUpdate(BaseModel):
    title: Optional[str] = None
    start: Optional[DateTime] = None
    end: Optional[DateTime] = None
    description: Optional[str] = None
    category: Optional[str] = None
    frequency: Optional[str] = None
    userID: Optional[int] = None
    calendarID: Optional[int] = None

    class Config:
        orm_mode = True

#main class
class ScheduleItem(ScheduleItemBase):
    id: int
    userID: int
    calendarID: int

    class Config:
        from_attributes = True

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
        from_attributes = True

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
        from_attributes = True

