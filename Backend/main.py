from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from .database import schemas

from .routers import users, events, tasks, calendars, auth

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#create app
app = FastAPI()

app.include_router(users.router)
app.include_router(events.router)
app.include_router(tasks.router)
app.include_router(calendars.router)
app.include_router(auth.router)

#allows cross origin resource sharing (stuff is on dif ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)