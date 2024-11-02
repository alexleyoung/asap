from sqlalchemy.orm import Session
from datetime import date
from ...database import schemas, models


def create_task(db: Session, Task: schemas.TaskCreate):
    db_task = models.Task(
        title=Task.title,
        start=Task.start,
        end=Task.end,
        description=Task.description,
        category=Task.category,
        frequency=Task.frequency,
        dueDate=Task.dueDate,
        auto=Task.auto,
        priority=Task.priority,
        difficulty=Task.difficulty,
        duration=Task.duration,
        completed=Task.completed,
        flexible=Task.flexible,
        userID=Task.userID,
        calendarID=Task.calendarID,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        return None
    db.delete(task)
    db.commit()
    return task


def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def get_tasks(db: Session, userID: int, limit: int = 10):
    return db.query(models.Task).filter(models.Task.userID == userID).limit(limit).all()


def update_task(db: Session, task_id: int, task_update: schemas.TaskCreate):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        return None
    for key, value in task_update.model_dump(exclude_unset=True).items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task
