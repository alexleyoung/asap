import enum as py_enum
from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy import Enum as sql_enum
from sqlalchemy.orm import relationship
from .db import Base


# users table
class User(Base):
    __tablename__ = "users"

    id = Column("id", Integer, primary_key=True, index=True)
    hashed_password = Column("hashedPassword", String, nullable=False)
    firstname = Column("firstName", String(20), nullable=False)
    lastname = Column("lastName", String(20), nullable=False)
    email = Column("email", String(50), unique=True, nullable=False)
    avatar = Column("avatar", String)

    # Relationships
    calendars = relationship("Calendar", back_populates="owner")
    events = relationship("Event", back_populates="user")
    tasks = relationship("Task", back_populates="user")
    memberships = relationship("Membership", back_populates="user")  # Changed from membership to memberships

# calendars table
class Calendar(Base):
    __tablename__ = "calendars"
    id = Column("id", Integer, primary_key=True, index=True, unique=True)
    name = Column("name", String)
    description = Column("description", String)
    timezone = Column("timezone", String)

    # foreign key
    userID = Column("ownerID", Integer, ForeignKey("users.id"))

    # Relationships
    owner = relationship("User", back_populates="calendars")
    events = relationship("Event", back_populates="calendar")
    tasks = relationship("Task", back_populates="calendar")
    group = relationship("Group", back_populates="calendar", uselist=False)  # One-to-one relationship


# Events table
class Event(Base):
    __tablename__ = "events"
    id = Column("id", Integer, primary_key=True, index=True, unique=True)
    title = Column("title", String)
    start = Column("start", DateTime(timezone=True))
    end = Column("end", DateTime(timezone=True))
    description = Column("description", String)
    category = Column("category", String)
    frequency = Column("frequency", String)
    location = Column("location", String)

    # foreign keys
    userID = Column("userID", Integer, ForeignKey("users.id"))
    calendarID = Column("calendarID", Integer, ForeignKey("calendars.id"))

    # Relationships
    user = relationship("User", back_populates="events")
    calendar = relationship("Calendar", back_populates="events")


# Tasks table
class Task(Base):
    __tablename__ = "tasks"
    id = Column("id", Integer, primary_key=True, index=True, unique=True)
    title = Column("title", String)
    start = Column("start", DateTime(timezone=True), nullable=True)
    end = Column("end", DateTime(timezone=True), nullable=True)
    description = Column("description", String)
    category = Column("category", String)
    frequency = Column("frequency", String)
    dueDate = Column("dueDate", DateTime(timezone=True))
    priority = Column("priority", String)
    auto = Column("auto", Boolean)
    completed = Column("completed", Boolean)
    difficulty = Column("difficulty", String)
    duration = Column("duration", Integer)
    flexible = Column("flexible", Boolean)

    # foreign keys
    userID = Column("userID", Integer, ForeignKey("users.id"))
    calendarID = Column("calendarID", Integer, ForeignKey("calendars.id"))

    # Relationships
    user = relationship("User", back_populates="tasks")
    calendar = relationship("Calendar", back_populates="tasks")

# Groups table
class Group(Base):
    __tablename__ = "groups"
    id = Column("id", Integer, primary_key=True, index=True, unique=True)
    title = Column("title", String)
   
    # relationships
    calendar = relationship("Calendar", back_populates="group")
    memberships = relationship("Membership", back_populates="group")  # Changed from membership to memberships
    
    # foreign keys
    calendarID = Column("calendarID", Integer, ForeignKey("calendars.id"), nullable=False)

# Permissions enum
class PermissionLevel(py_enum.Enum):
    ADMIN = "ADMIN"
    EDITOR = "EDITOR"
    VIEWER = "VIEWER"

# Group and User relationship table
class Membership(Base):
    __tablename__ = "group_user"
    id = Column(Integer, primary_key=True, index=True, unique=True)
    groupID = Column("groupID", Integer, ForeignKey("groups.id"))
    userID = Column("userID", Integer, ForeignKey("users.id"))
    permission = Column(sql_enum(PermissionLevel), nullable=False)

    # relationships
    user = relationship("User", back_populates="memberships")
    group = relationship("Group", back_populates="memberships")