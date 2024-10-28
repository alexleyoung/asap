from sqlalchemy.orm import Session
from ...database import schemas, models
from .. import auth


# create user
def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        firstname=user.firstname,
        lastname=user.lastname,
        email=user.email,
        hashed_password=auth.bcrypt_context.hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# delete user
def delete_user(db: Session, userID: int):
    user = db.query(models.User).filter(models.User.id == userID).first()
    if not user:
        return None
    db.delete(user)
    db.commit()
    return user


# get single user by user id
def get_user(db: Session, userID: int):
    return db.query(models.User).filter(models.User.id == userID).first()


# get single user by email
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# get all users
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


# to change password
def change_user_password(db: Session, userID: int, new_password: str):
    user = db.query(models.User).filter(models.User.id == userID).first()
    if not user:
        return None
    user.hashedPassword = auth.hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user


# update info
def update_user(db: Session, userID: int, user_update: schemas.UserUpdate):
    user = db.query(models.User).filter(models.User.id == userID).first()
    if not user:
        return None
    for key, value in user_update.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user
