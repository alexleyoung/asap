from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import tasks as controller
from ..utils.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])


@router.post("/tasks/", response_model=schemas.Task)
def create_task_endpoint(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = controller.create_task(db, task)
    if not db_task:
        raise HTTPException(status_code=400, detail="Task creation failed")
    return db_task


@router.delete("/tasks/{task_id}", response_model=schemas.Task)
def delete_task_endpoint(task_id: int, db: Session = Depends(get_db)):
    task = controller.delete_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.get("/tasks/{task_id}", response_model=schemas.Task)
def read_task_endpoint(task_id: int, db: Session = Depends(get_db)):
    task = controller.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.get("/tasks/", response_model=list[schemas.Task])
def read_user_tasks_endpoint(
    userID: int, db: Session = Depends(get_db), limit: int = 10
):
    if not userID:
        raise HTTPException(status_code=400, detail="User ID is required")
    tasks = controller.get_tasks(db, userID, limit)
    # handle errors here ...
    return tasks


# takes entire TaskCreate instead of partial
@router.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task_endpoint(
    task_id: int, task_update: schemas.TaskCreate, db: Session = Depends(get_db)
):
    task = controller.update_task(db, task_id, task_update)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
