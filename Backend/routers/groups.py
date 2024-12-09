from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from ..database import schemas
from ..database.db import get_db
from ..utils.crud import groups as controller
from ..utils.auth import get_current_user
from ..database import models
from typing import List
from fastapi import status
from ..utils.websocket_manager import manager
import json


router = APIRouter(
    prefix="/groups", tags=["groups"], dependencies=[Depends(get_current_user)]
)

newRouter = APIRouter(tags=["groups"])

# websocket endpoint for real-time invitations
@newRouter.websocket("/invitations")
async def websocket_invitations(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            message = await websocket.receive_text()  # Keep connection alive
            data = json.loads(message)
            if data["action"] == "add_member":
                data["type"] = "member_added"
                # response = {"status": "success", "message": "Event edited successfully"}
                await websocket.send_text(json.dumps(data))
            if data["action"] == "accept_invitation":
                data["type"] = "invitation_accepted"
                # response = {"status": "success", "message": "Event deleted successfully"}
                await websocket.send_text(json.dumps(data))
            if data["action"] == "reject_invitation":
                data["type"] = "invitation_rejected"
                # response = {"status": "success", "message": "Event created successfully"}
                await websocket.send_text(json.dumps(data))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"Error occurred: {e}")


# get group by id
@router.get("/{groupID}", response_model=schemas.Group)
def get_group_endpoint(groupID: int, db: Session = Depends(get_db)):
    return controller.get_group(db, groupID)


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


# add member
@router.post("/{groupID}/members", response_model=schemas.Membership)
async def add_member_endpoint(
    groupID: int,
    membership: schemas.MembershipCreate,
    current_userID: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
            
    await manager.broadcast(json.dumps({"type": "member_added", "groupID": groupID, "userID": membership.userID}))

    return controller.add_member(db, groupID, membership, current_userID)


# update member
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


# get group members
@router.get("/{groupID}/members", response_model=List[schemas.Membership])
def get_group_members(groupID: int, db: Session = Depends(get_db)):
    members = (
        db.query(models.Membership).filter(models.Membership.groupID == groupID).all()
    )
    if not members:
        raise HTTPException(status_code=404, detail="Group not found or has no members")
    return members

# get group by calendarID
@router.get("/", response_model=schemas.Group)
def get_group_by_calendar(
    calendarID: int,
    db: Session = Depends(get_db)
):
    # Build query based on whether members should be included
    query = db.query(models.Group)
    
    # Get the group
    group = query.filter(models.Group.calendarID == calendarID).first()
    
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No group found for calendar ID: {calendarID}"
        )
    
    return group


