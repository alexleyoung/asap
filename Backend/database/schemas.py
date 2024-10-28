from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# For JWT token response
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


##### USER #####


# create User schemas
class UserBase(BaseModel):
    firstname: str
    lastname: str
    email: str


class UserInDB(UserBase):
    hashed_password: str


# for creating a user
class UserCreate(UserBase):
    password: str


# for updating a user
class UserUpdate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None


# main class
class User(UserBase):
    id: int

    class Config:
        from_attributes = True


###
# create Calendar schemas
class CalendarBase(BaseModel):
    name: str
    description: str
    timezone: str


# for creating a calendar
class CalendarCreate(CalendarBase):
    pass


# main class
class Calendar(BaseModel):
    id: int
    userID: int

    class Config:
        from_attributes = True


###
# Event
class EventBase(BaseModel):
    title: str
    start: datetime
    end: datetime
    description: str
    category: str
    frequency: str
    location: str


# to create
class EventCreate(EventBase):
    calendarID: int  # Foreign key


# to update
class EventUpdate(EventBase):
    title: Optional[str] = None
    start: Optional[datetime] = None
    end: Optional[datetime] = None
    description: Optional[str] = None
    category: Optional[str] = None
    frequency: Optional[str] = None
    location: Optional[str] = None


# main class
class Event(EventBase):
    id: int
    userID: int  # Foreign key
    calendarID: int  # Foreign key

    class Config:
        from_attributes = True


###
# Task
class TaskBase(BaseModel):
    title: str
    start: datetime
    end: datetime
    description: str
    category: str
    frequency: str
    dueDate: datetime
    priority: str
    difficulty: str
    duration: int
    auto: bool
    completed: bool
    flexible: bool
    userID: int
    calendarID: int


# to create
class TaskCreate(BaseModel):
    auto: bool
    calendarID: int
    category: str
    description: str
    difficulty: str
    dueDate: datetime
    duration: int
    flexible: bool
    frequency: str
    completed: bool
    priority: str
    title: str
    userID: int


# main class
class Task(TaskBase):
    id: int

    class Config:
        from_attributes = True
