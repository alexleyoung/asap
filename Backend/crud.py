from sqlalchemy.orm import Session

from Backend import models, schemas

def get_user(db: Session, userID: int):
    return db.query(models.User).filter(models.User.id == userID).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed = user.password + "notHashedLOL"
    db_user = models.User(username=user.username, firstName=user.firstName, lastName=user.lastName, occupation = user.occupation, email=user.email, hashedPassword=fake_hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

