from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import calendars as controller

router = APIRouter(
    dependencies=[Depends(get_current_user)]
)

@router.post("/calendars/", response_model=schemas.Calendar)
def create_calendar( Calendar: schemas.CalendarCreate, db: Session = Depends(get_db)):
    db_calendar = controller.create_calendar(db, Calendar)
    if not db_calendar:
        raise HTTPException(status_code=400, detail="Calendar creation failed")
    return db_calendar