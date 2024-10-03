from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from Backend import crud, models, schemas
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


##### USER ENDPOINTS #####

#to create user
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="email taken!")
    return crud.create_user(db=db, user=user)

#to delete user
@app.delete("/users/{user_id}", response_model=schemas.User)
def delete_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    user = crud.delete_user(db, user_id)
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

#change password
@app.put("/users/{user_id}/password", response_model=schemas.User)
def change_user_password_endpoint(user_id: int, new_password: str, db: Session = Depends(get_db)):
    user = crud.change_user_password(db, user_id, new_password)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

#to update user
@app.put("/users/{user_id}", response_model=schemas.User)
def update_user_endpoint(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = crud. update_user(db, user_id, user_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user