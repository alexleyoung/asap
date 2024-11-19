from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..utils.crud import memberships as controller
from ..utils.auth import get_current_user
from ..database import models, schemas
from typing import List

router = APIRouter(
    prefix="/members",
    tags=["members"],
    dependencies=[Depends(get_current_user)],
)


# get user's memberships
@router.get("/", response_model=List[schemas.Membership])
def get_memberships(
    userID: int,
    db: Session = Depends(get_db),
):
    return controller.get_memberships(db, userID)
