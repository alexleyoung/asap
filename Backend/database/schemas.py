from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import enum as py_enum


# For JWT token response
class Token(BaseModel):
    access_token: str
    token_type: str


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
# Calendar
class CalendarBase(BaseModel):
    name: str
    description: str
    timezone: str
    color: Optional[str] = None


# for creating a calendar
class CalendarCreate(CalendarBase):
    userID: int


# for editing a calendar
class CalendarUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    timezone: Optional[str] = None
    color: Optional[str] = None


# main class
class Calendar(CalendarBase):
    id: int
    userID: int

    class Config:
        from_attributes = True


class PermissionLevel(str, py_enum.Enum):
    ADMIN = "ADMIN"  # can CRUD tasks and events
    EDITOR = "EDITOR"  # can CRU tasks and events
    VIEWER = "VIEWER"  # can R tasks and events


###
# Membership
class MembershipBase(BaseModel):
    userID: int
    permission: PermissionLevel


class MembershipCreate(MembershipBase):
    pass


class MembershipUpdate(BaseModel):
    permission: PermissionLevel


class Membership(MembershipBase):
    id: int
    groupID: int

    class Config:
        from_attributes = True


###
# Group
class GroupBase(BaseModel):
    title: str
    calendarID: int


# to create
class GroupCreate(GroupBase):
    pass
    # members: Optional[List[MembershipCreate]] = None


# to update
class GroupUpdate(BaseModel):
    title: Optional[str] = None


# members: Optional[List[MembershipCreate]] = None


# main class
class Group(GroupBase):
    id: int

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
    color: Optional[str] = None


# to create
class EventCreate(EventBase):
    userID: int
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
    calendarID: Optional[int] = None


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
    start: Optional[datetime] = None
    end: Optional[datetime] = None
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
    color: Optional[str] = None


# to create
class TaskCreate(BaseModel):
    title: str
    description: str
    start: Optional[datetime] = None
    end: Optional[datetime] = None
    duration: int
    dueDate: datetime
    category: str
    difficulty: str
    frequency: str
    priority: str
    auto: bool
    flexible: bool
    completed: bool
    userID: int
    calendarID: int
    color: Optional[str] = None


# main class
class Task(TaskBase):
    id: int

    class Config:
        from_attributes = True
