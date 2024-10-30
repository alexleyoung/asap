from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import users as controller
from ..utils.auth import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


# to create user (doesn't need to be protected)
@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = controller.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="email taken!")
    return controller.create_user(db=db, user=user)


# to delete user
@router.delete("/{userID}/delete", response_model=schemas.User)
def delete_user_endpoint(userID: int, db: Session = Depends(get_db)):
    user = controller.delete_user(db, userID)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# to get users
@router.get("/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = controller.get_users(db, skip=skip, limit=limit)
    return users


# to get user by user id
@router.get("/{userID}", response_model=schemas.User)
def read_user(userID: int, db: Session = Depends(get_db)):
    db_user = controller.get_user(db, userID=userID)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# to get user by email
@router.get("/email/{email}", response_model=schemas.User)
def get_user_by_email_endpoint(email: str, db: Session = Depends(get_db)):
    user = controller.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# change password
@router.put("/{userID}/password", response_model=schemas.User)
def change_user_password_endpoint(
    userID: int, new_password: str, db: Session = Depends(get_db)
):
    user = controller.change_user_password(db, userID, new_password)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# to update user
@router.put("/{userID}", response_model=schemas.User)
def update_user_endpoint(
    userID: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)
):
    user = controller.update_user(db, userID, user_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
