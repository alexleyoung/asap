from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

#users table
class User(Base):
    __tablename__ = 'users'

    id = Column("id", Integer, primary_key = True, index = True)
    firstName = Column("firstName", String(20))
    lastName = Column("lastName", String(20))
    email = Column("email", String(50), unique = True)
    occupation = Column("occupation", String(30))

#scheduleItems table
class scheduleItem(Base):
    __tablename__ = 'Schedule'

    id = Column("id", Integer, primary_key = True, index = True, unique = True)
    title = Column("title", String)
    Start = Column("start", Integer) #????
    end = Column("end", Integer)
    description = Column("description", String)
    category = Column("category", String)
    frequency = Column("frequency", String)
    userID = Column("userID", Integer, ForeignKey('users.id'))
    calendarID = Column("calendarID", Integer, ForeignKey('calendars.id'))

#calendars table
class Calendar(Base):
    __tablename__ = "Calendars"
    id = Column("id", Integer, primary_key = True, index = True, unique = True)
    ownerID = Column("ownerID", Integer, ForeignKey('owners.id')) #doesnt exist yet but it will
    name = Column("name", String)
    description = Column("description", String)
    timezone = Column("timezone", String)

class Event(Base):
    __tablename__ = "Events"
    id = Column("id", Integer, primary_key = True, index = True, unique = True)
    location = Column("location", String)

class Task(Base):
    __tablename__ = "Tasks"
    id = Column("id", Integer, primary_key = True, index = True, unique = True)
    dueDate = Column("dueDate", )


