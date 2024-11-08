from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import groups as controller
from ..utils.auth import get_current_user
from ..database import models
from ..utils.crud import users
from typing import List


router = APIRouter(prefix="/groups", tags=["groups"])


# create group
@router.post("/", response_model=schemas.Group)
def create_group_endpoint(
    group: schemas.GroupCreate,
    current_userID: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return controller.create_group(db, group, current_userID)


# delete group
@router.delete("/{groupID}")
def delete_group_endpoint(
    groupID: int,
    current_userID: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return controller.delete_group(db, groupID, current_userID)


@router.post("/{groupID}/members", response_model=schemas.Membership)
def add_member_endpoint(
    groupID: int,
    membership: schemas.MembershipCreate,
    current_userID: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return controller.add_member(db, groupID, membership, current_userID)


@router.put("/{groupID}/members/{memberID}", response_model=schemas.Membership)
def update_member_endpoint(
    groupID: int,
    memberID: int,
    permission_update: schemas.MembershipUpdate,
    current_userID: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return controller.update_member_permission(
        db, groupID, memberID, permission_update, current_userID
    )


@router.delete("/{groupID}/members/{memberID}")
def remove_member_endpoint(
    groupID: int,
    memberID: int,
    current_userID: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return controller.remove_member(db, groupID, memberID, current_userID)


@router.get("/{groupID}/members", response_model=List[schemas.Membership])
def get_group_members(groupID: int, db: Session = Depends(get_db)):
    members = (
        db.query(models.Membership).filter(models.Membership.groupID == groupID).all()
    )
    if not members:
        raise HTTPException(status_code=404, detail="Group not found or has no members")
    return members
