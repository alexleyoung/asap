from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

# For logging
import logging
from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from .database.db import init_db

from .routers import users, events, tasks, calendars, auth, groups, memberships
from contextlib import asynccontextmanager  # Import asynccontextmanager

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Define lifespan event for setup tasks
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Perform setup tasks on startup
    init_db()  # Create tables if they don't exist
    yield  # Let the app run
    # Perform teardown tasks on shutdown, if needed


# create app
app = FastAPI()
init_db()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(events.router)
app.include_router(events.newRouter)
app.include_router(tasks.router)
app.include_router(calendars.router)
app.include_router(groups.router)
app.include_router(memberships.router)


# Unprocessable Entity error handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f"{exc}".replace("\n", " ").replace("   ", " ")
    logging.error(f"{request}: {exc_str}")
    content = {"status_code": 10422, "message": exc_str, "data": None}
    return JSONResponse(
        content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
    )


# allows cross origin resource sharing (stuff is on dif ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
