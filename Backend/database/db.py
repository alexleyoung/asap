from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

# URL_DATABASE = 'postgresql://postgres:dslidder1@localhost:5432/divya' # divya

# URL_DATABASE = 'postgresql://postgres:toor!234@localhost:5433/groups' # caiti

load_dotenv()
URL_DATABASE = os.getenv("DATABASE_URL")

# URL_DATABASE = 'postgresql://postgres:Jacob1214@localhost:5433/CalendarDB' # kaylee

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def init_db():
    from . import models  # Import your models here to create tables

    models

    Base.metadata.create_all(bind=engine)


# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
