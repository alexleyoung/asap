from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime


#users table
class User(Base):
    __tablename__ = 'users'

    id = Column("id", Integer, primary_key = True, index = True)
    hashed_password = Column("hashedPassword", String, nullable=False)
    firstname = Column("firstName", String(20), nullable=False) 
    lastname = Column("lastName", String(20), nullable=False)
    email = Column("email", String(50), unique = True, nullable=False)
    avatar = Column("avatar", String)

    # Relationships
    calendars = relationship("Calendar", back_populates="owner")
    events = relationship("Event", back_populates="user")
    tasks = relationship("Task", back_populates="user")




#calendars table
class Calendar(Base):
    __tablename__ = "calendars"
    id = Column("id", Integer, primary_key = True, index = True, unique = True) 
    name = Column("name", String)
    description = Column("description", String)
    timezone = Column("timezone", String)

    #foreign key
    userID = Column("ownerID", Integer, ForeignKey('users.id'))

    # Relationship with User and Events/Tasks
    owner = relationship("User", back_populates="calendars")
    events = relationship("Event", back_populates="calendar")
    tasks = relationship("Task", back_populates="calendar")
    
# Events table
class Event(Base):
    __tablename__ = "events"
    id = Column("id", Integer, primary_key = True, index = True, unique = True)
    title = Column("title", String)
    start = Column("start", DateTime)
    end = Column("end", DateTime)
    description = Column("description", String)
    category = Column("category", String)
    frequency = Column("frequency", String)
    location = Column("location", String)

    #foreign keys 
    userID = Column("userID", Integer, ForeignKey('users.id'))
    calendarID = Column("calendarID", Integer, ForeignKey('calendars.id'))

    # Relationships with User and Calendar
    user = relationship("User", back_populates="events")
    calendar = relationship("Calendar", back_populates="events")

# Tasks table
class Task(Base):
    __tablename__ = "tasks"
    id = Column("id", Integer, primary_key = True, index = True, unique = True)
    title = Column("title", String)
    start = Column("start", DateTime)
    end = Column("end", DateTime)
    description = Column("description", String)
    category = Column("category", String)
    frequency = Column("frequency", String)
    dueDate = Column("dueDate", DateTime)
    priority = Column("priority", String)
    difficulty = Column("difficulty", String)
    duration = Column("duration", Integer)
    flexibility = Column("flexibility", Boolean)

    #foreign keys
    userID = Column("userID", Integer, ForeignKey('users.id'))
    calendarID = Column("calendarID", Integer, ForeignKey('calendars.id'))

    # Relationships with User and Calendar
    user = relationship("User", back_populates="tasks")
    calendar = relationship("Calendar", back_populates="tasks")
