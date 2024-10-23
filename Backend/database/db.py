from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# URL_DATABASE = 'postgresql://postgres:toor!234@localhost:5433/CalendarTest' #caiti

URL_DATABASE = "postgresql://postgres:4618@localhost:5432"  # alex

# URL_DATABASE = 'postgresql://postgres:Jacob1214@localhost:5433/CalendarTest' #kaylee

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
