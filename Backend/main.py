from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from Backend import crud, models, schemas, auth
from .database import SessionLocal, engine



#create app
app = FastAPI()

models.Base.metadata.create_all(bind=engine)

#allows cross origin resource sharing (stuff is on dif ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


##### TOKEN ENDPOINT #####

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)  # Use form_data.username for email
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
    return {"access_token": access_token, "token_type": "bearer"}


##### USER ENDPOINTS #####

#to create user (doesn't need to be protected)
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="email taken!")
    return crud.create_user(db=db, user=user)

#to delete user
@app.delete("/users/{userID}/delete", response_model=schemas.User)
def delete_user_endpoint(userID: int, db: Session = Depends(get_db)):
    user = crud.delete_user(db, userID)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

#to get users
@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

#to get user by user id
@app.get("/users/{userID}", response_model=schemas.User)
def read_user(userID: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, userID=userID)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

#to get user by email
@app.get("/users/email/{email}", response_model=schemas.User)
def get_user_by_email_endpoint(email: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

#change password
@app.put("/users/{userID}/password", response_model=schemas.User)
def change_user_password_endpoint(userID: int, new_password: str, db: Session = Depends(get_db)):
    user = crud.change_user_password(db, userID, new_password)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

#to update user
@app.put("/users/{userID}", response_model=schemas.User)
def update_user_endpoint(userID: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = crud. update_user(db, userID, user_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


##### EVENT ENDPOINTS #####

#to create an event
@app.post("/events/", response_model=schemas.Event)
def create_event_endpoint(event: schemas.EventCreate, db: Session = Depends(get_db)):
    db_event = crud.create_event(db=db, event=event)
    if not db_event:
        raise HTTPException(status_code=400, detail="Event creation failed")
    return db_event


##### TASK ENDPOINTS #####

@app.post("/tasks/", response_model=schemas.Task)
def create_task_endpoint(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = crud.create_task(db, task)
    if not db_task:
        raise HTTPException(status_code=400, detail="Task creation failed")
    return db_task

@app.delete("/tasks/{task_id}", response_model=schemas.Task)
def delete_task_endpoint(task_id: int, db: Session = Depends(get_db)):
    task = crud.delete_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.get("/tasks/{task_id}", response_model=schemas.Task)
def read_task_endpoint(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.get("/tasks/", response_model=list[schemas.Task])
def read_user_tasks_endpoint(userID: int, db: Session = Depends(get_db), limit: int = 10):
    if not userID:
        raise HTTPException(status_code=400, detail="User ID is required")
    tasks = crud.get_tasks(db, userID, limit)
    # handle errors here ...
    return tasks

# takes entire TaskCreate instead of partial
@app.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task_endpoint(task_id: int, task_update: schemas.TaskCreate, db: Session = Depends(get_db)):
    task = crud.update_task(db, task_id, task_update)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


##### CALENDAR ENDPOINTS #####

@app.post("/calendars/", response_model=schemas.Calendar)
def create_calendar( Calendar: schemas.CalendarCreate, db: Session = Depends(get_db)):
    db_calendar = crud.create_calendar(db, Calendar)
    if not db_calendar:
        raise HTTPException(status_code=400, detail="Calendar creation failed")
    return db_calendar