from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import tasks as controller
from ..utils.auth import get_current_user
from ..utils.llm import get_user_context, query_with_file

router = APIRouter(
    dependencies=[Depends(get_current_user)], prefix="/tasks", tags=["tasks"]
)


@router.post("/", response_model=schemas.Task)
def create_task_endpoint(
    task: schemas.TaskCreate,
    auto: Optional[bool] = False,
    db: Session = Depends(get_db),
):
    if auto:
        user = task.userID
        context = get_user_context(user, db)
        # print(context)
        # query_with_file(context, task)
        new_task = query_with_file(context, task)  # do the rest
        print(new_task.description)
        if not new_task:
            raise HTTPException(status_code=400, detail="Task creation failed")
        return controller.create_task(db, new_task)

    db_task = controller.create_task(db, task)
    if not db_task:
        raise HTTPException(status_code=400, detail="Task creation failed")
    return db_task


@router.delete("/{task_id}", response_model=schemas.Task)
def delete_task_endpoint(task_id: int, db: Session = Depends(get_db)):
    task = controller.delete_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.get("/{task_id}", response_model=schemas.Task)
def read_task_endpoint(task_id: int, db: Session = Depends(get_db)):
    task = controller.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.get("/")
def read_user_endpoint(
    userID: int, db: Session = Depends(get_db), limit: int = 100, offset: int = 0
):
    if not userID:
        raise HTTPException(status_code=400, detail="User ID is required")
    tasks = controller.get_tasks(db, userID, limit, offset)
    total = controller.count_tasks(db, userID)
    # handle errors here ...
    return {"tasks": tasks, "total": total}


# takes entire TaskCreate instead of partial
@router.put("/{task_id}", response_model=schemas.Task)
def update_task_endpoint(
    task_id: int, task_update: schemas.TaskCreate, db: Session = Depends(get_db)
):
    task = controller.update_task(db, task_id, task_update)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
