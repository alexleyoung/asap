from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.ext.declarative import declarative_base


#users table
class User(Base):
    __tablename__ = 'users'

    id = Column("id", Integer, primary_key = True, index = True)
    username = Column("username", String, nullable = False)
    hashedPassword = Column("hashedPassword", String, nullable=False)
    firstName = Column("firstName", String(20), nullable=False)
    lastName = Column("lastName", String(20), nullable=False)
    email = Column("email", String(50), unique = True, nullable=False)
    occupation = Column("occupation", String(30))

    #not sure if we need this
    #init function
    def __init__(self, id, username, hashedPassword, firstName, lastName, email, occupation):
        self.id = id
        self.username = username
        self.hashedPassword = hashedPassword
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.occupation = occupation

    def __repr__(self):
        return f"User id: {self.id}\n Username: {self.username}\n Name: {self.firstName} {self.lastName}\n Email: {self.email}\n Occupation: {self.occupation}"





#calendars table
class Calendar(Base):
    __tablename__ = "calendars"
    id = Column("id", Integer, primary_key = True, index = True, unique = True)
    ownerID = Column("ownerID", Integer, ForeignKey('users.id')) 
    name = Column("name", String)
    description = Column("description", String)
    timezone = Column("timezone", String)

    #not sure about this
    owner = relationship("User", back_populates="calendars")
    
#scheduleItems table
class scheduleItem(Base):
    __tablename__ = 'schedule'

    id = Column("id", Integer, primary_key = True, index = True, unique = True)
    title = Column("title", String)
    Start = Column("start", Integer) #???? DATE OBJECT
    end = Column("end", Integer)
    description = Column("description", String)
    category = Column("category", String)
    frequency = Column("frequency", String) #?????
    userID = Column("userID", Integer, ForeignKey('users.id'))
    calendarID = Column("calendarID", Integer, ForeignKey('calendars.id'))


class Event(Base):
    __tablename__ = "events"
    id = Column("id", Integer, primary_key = True, index = True, unique = True)
    location = Column("location", String)

class Task(Base):
    __tablename__ = "tasks"
    id = Column("id", Integer, primary_key = True, index = True, unique = True)
    dueDate = Column("dueDate", Integer)
    priority = Column("priority", Integer)
    difficulty = Column("difficulty", Integer)
    duration = Column("duration", Integer) #in minutes??
    flexibility = Column("flexibility", Integer)


