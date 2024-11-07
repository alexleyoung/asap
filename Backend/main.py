from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from .routers import users, events, tasks, calendars, auth
from .database import models
from .database.db import init_db  # Import init_db from database module
from contextlib import asynccontextmanager  # Import asynccontextmanager

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Define lifespan event for setup tasks
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Perform setup tasks on startup
    init_db()  # Create tables if they don't exist
    yield  # Let the app run
    # Perform teardown tasks on shutdown, if needed

# Initialize FastAPI app with lifespan
app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(events.router)
app.include_router(events.newRouter) 
app.include_router(tasks.router)
app.include_router(calendars.router)

# allows cross origin resource sharing (stuff is on dif ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
