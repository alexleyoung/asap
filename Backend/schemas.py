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

class User(UserBase):
    id: int

#create Calendar schemas
class Calendar(BaseModel):


class schedule(BaseModel):
    event: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.post("/users/", status_code = status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user