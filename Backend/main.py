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

#to change password
@app.put("/users/{userID}/password", response_model=schemas.User)
def change_user_password_endpoint(user_id: int, new_password: str, db: Session = Depends(get_db)):
    user = crud.change_user_password(db, user_id, new_password)
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