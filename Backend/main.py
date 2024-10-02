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
    allow_origins=["*"],  # Or specify your frontend URL here like "http://localhost:3000"
    allow_credentials=True,
    allow_methods=["*"],  # This allows POST, GET, etc.
    allow_headers=["*"],
)

#dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="email taken!")
    return crud.create_user(db=db, user=user)



@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{userID}", response_model=schemas.User)
def read_user(userID: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, userID=userID)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user