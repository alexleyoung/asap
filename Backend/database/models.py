from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey
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
    groups = relationship("GroupUser", back_populates = "user")  #is this naming confusing bc it's groupUser not groups?


# calendars table
class Calendar(Base):
    __tablename__ = "calendars"
    id = Column("id", Integer, primary_key=True, index=True, unique=True)
    name = Column("name", String)
    description = Column("description", String)
    timezone = Column("timezone", String)

    # foreign key
    userID = Column("ownerID", Integer, ForeignKey("users.id")) #multiple 
    groupID = Column("groupID", Integer, ForeignKey("groups.id")) #one

    # Relationship with User and Events/Tasks
    owner = relationship("User", back_populates="calendars")
    events = relationship("Event", back_populates="calendar")
    tasks = relationship("Task", back_populates="calendar")
    group = relationship("Group", back_populates="calendar")


# Events table
class Event(Base):
    __tablename__ = "events"
    id = Column("id", Integer, primary_key=True, index=True, unique=True)
    title = Column("title", String)
    start = Column("start", DateTime)
    end = Column("end", DateTime)
    description = Column("description", String)
    category = Column("category", String)
    frequency = Column("frequency", String)
    userID = Column("userID", Integer, ForeignKey("users.id"))
    calendarID = Column("calendarID", Integer, ForeignKey("calendars.id"))
    location = Column("location", String)

    # foreign keys
    userID = Column("userID", Integer, ForeignKey("users.id"))
    calendarID = Column("calendarID", Integer, ForeignKey("calendars.id"))

    # Relationships with User and Calendar
    user = relationship("User", back_populates="events")
    calendar = relationship("Calendar", back_populates="events")


# Tasks table
class Task(Base):
    __tablename__ = "tasks"
    id = Column("id", Integer, primary_key=True, index=True, unique=True)
    title = Column("title", String)
    start = Column("start", DateTime)
    end = Column("end", DateTime)
    description = Column("description", String)
    category = Column("category", String)
    frequency = Column("frequency", String)
    dueDate = Column("dueDate", DateTime)
    priority = Column("priority", String)
    auto = Column("auto", Boolean)
    completed = Column("completed", Boolean)
    difficulty = Column("difficulty", String)
    duration = Column("duration", Integer)
    flexible = Column("flexible", Boolean)

    # foreign keys
    userID = Column("userID", Integer, ForeignKey("users.id"))
    calendarID = Column("calendarID", Integer, ForeignKey("calendars.id"))

    # Relationships with User and Calendar
    user = relationship("User", back_populates="tasks")
    calendar = relationship("Calendar", back_populates="tasks")

# Groups table
class Group(Base):
    __tablename__ = "groups"
    id = Column("id", Integer, primary_key=True, index=True, unique=True)
    title = Column("title", String)
   
    #relationships
    group_member = relationship("GroupMember", back_populates = "groups")
    calendar = relationship("Calendar", back_populates="group")
    users = relationship("GroupUser", back_populates = "group")
    
    #foreign keys
    calendarID = Column("calendarID", Integer, ForeignKey("calendars.id"), nullable = False) # each group has one and only one calendar

# Group and User relationship table
class GroupUser(Base):
    __tablename__ = "group_user"
    id = Column(Integer, primary_key = True, index = True, unique = True)
    group_id = Column("group_id", Integer, ForeignKey(groups.id))
    user_id = Column("user_id", Integer, ForeignKey(users.id))
    permission = Column(Enum(PermissionLevel), nullable = False)

    #relationships
    user = relationship("User", back_populates="group")
    group = relationship("Group", back_populates = "user")

# Permissions enum
class PermissionLevel(enum.Enum):
    ADMIN = "admin" # can CRUD tasks and events
    VIEWER = "viewer" # can R tasks and events