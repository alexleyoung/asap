from sqlalchemy.orm import Session
import bcrypt
from Backend import models, schemas

def get_user(db: Session, userID: int):
    return db.query(models.User).filter(models.User.id == userID).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    db_user = models.User(firstName=user.firstName, 
                          lastName=user.lastName, 
                          email=user.email, 
                          hashedPassword=hashed_password.decode('utf-8'))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

