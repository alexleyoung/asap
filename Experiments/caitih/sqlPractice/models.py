from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key = True, index = True)
    firstName = Column(String(20))
    lastName = Column(String(20))
    email = Column(String(50), unique = True)
    occupation = Column(String(30))


