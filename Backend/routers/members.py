from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import members as controller
from ..utils.auth import get_current_user
from ..database import models
from typing import List

router = APIRouter(
    prefix="/members",
    tags=["members"],
)


# get user's memberships
@router.get("/", response_model=List[schemas.Membership])
def get_memberships(
    current_userID: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return controller.get_memberships(db, current_userID)
