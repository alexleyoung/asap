from sqlalchemy.orm import Session
from ...database import models


# get user's memberships
def get_memberships(db: Session, userID: int):
    return db.query(models.Membership).filter(models.Membership.userID == userID).all()
