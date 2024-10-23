from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated
from ..database.db import get_db
from ..utils.crud import users
from ..utils.auth import (
    authenticate_user,
    create_access_token,
)
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from ..database.schemas import Token


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user"
        )

    token = create_access_token(user.email, user.id)

    return {"access_token": token, "token_type": "bearer"}
