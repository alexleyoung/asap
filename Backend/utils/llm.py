from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..database.db import get_db
from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone
import crud
from .crud import users


#to pass schedule items to LLM
def get_user_context(user_id: int, db: Session = Depends(get_db)): #send more information with fetch statements?
    db_user = crud.get_user(db, userID=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    tasks = crud.get_tasks(db, userID=user_id)
    events = crud.get_events(db, userID = user_id)
    
    # Format data and write to .txt file
    file_content = f"User: {db_user.firstName}{db_user.lastName}\n\nTasks:\n"
    for task in tasks:
        file_content += f"- {task.title}: {task.description}. This task is currently scheduled to start at {task.start} and end at {task.end} although these values are not necessary to respect. The task is categorized as {task.category} and recurs with frequency {task.frequency}. It is due (non-negotiable) at {task.dueDate}, with a priority of {task.priority}, a difficulty of {task.difficulty}, a duration of {task.duration}, and it is {task.flexibility} that it is flexible.\n"
    
    file_content += f"Events:\n"
    for event in events:
        file_content += f"- {event.title}: {event.description}. Event starts at {event.start} and ends at {event.end}. It is categorized as {event.category} and recurs every {event.frequency} at location {event.location}\n"

    #write information ^^
    file_path = f"RAG_test_data/user_{db_user.firstName}_context.txt"
    with open(file_path, "w") as f:
        f.write(file_content)
    #return {"file": file_path}

def query_llm():
    pass

def return_task():
    #query_with_file{file_path, } #this will get task data from the LLM, specifically the time when it needs to be.

    #assume this is a new with llm information
    task_data = schemas.TaskCreate(
        title="Hardcoded Task",
        description="This is a hardcoded task description",
        category="Work",
        dueDate=date.today(),
        priority="high",
        difficulty="medium",
        duration=60,
        flexibility=True,
        userID=1,  # Replace with a valid user ID
        calendarID= null  # Replace with a valid calendar ID
    )

    scheduled_task = crud.create_task(db, task_data);
    return scheduled_task