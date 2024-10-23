from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import users as controller
from ..utils import auth
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta


router = APIRouter()


@router.post("/token", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = controller.get_user_by_email(
        db, email=form_data.username
    )  # Use form_data.username for email
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
