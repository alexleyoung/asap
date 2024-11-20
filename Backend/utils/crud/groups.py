from sqlalchemy.orm import Session
from ...database import schemas, models
from fastapi import HTTPException, status

def create_group(db: Session, group: schemas.GroupCreate, owner: models.User):  # Changed parameter name for clarity
    # First verify the calendar exists and user has permission
    calendar = (
        db.query(models.Calendar).filter(models.Calendar.id == group.calendarID).first()
    )
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")

    # Create the group
    db_group = models.Group(**group.model_dump(exclude={"members"}))
    db.add(db_group)
    db.flush()  # Flush to get the group ID

    try:
        # Create admin membership for the creator - use owner.id instead of the User object
        owner_membership = models.Membership(
            groupID=db_group.id,
            userID=owner.id,  # Extract the ID from the User object
            permission=schemas.PermissionLevel.ADMIN.value,
        )
        db.add(owner_membership)

        db.commit()
        db.refresh(db_group)
        return db_group

    except Exception as e:
        db.rollback()
        print(f"Error: {str(e)}")  # For debugging
        raise HTTPException(status_code=500, detail=str(e))


# update group
def update_group(
    db: Session, groupID: int, group_update: schemas.GroupUpdate, adminID: models.User
):
    # Verify admin permission
    admin_membership = (
        db.query(models.Membership)
        .filter(
            models.Membership.groupID == groupID,
            models.Membership.userID == adminID.id,
            models.Membership.permission == schemas.PermissionLevel.ADMIN.value,
        )
        .first()
    )

    if not admin_membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only group admins can update the group",
        )

    # Get the group
    db_group = db.query(models.Group).filter(models.Group.id == groupID).first()
    if not db_group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Update title if provided
    update_data = group_update.model_dump(exclude_unset=True)
    if "title" in update_data:
        db_group.title = update_data["title"]

    # Update members if provided
    if "members" in update_data and update_data["members"] is not None:
        # Remove existing members except admin
        db.query(models.Membership).filter(
            models.Membership.groupID == groupID, models.Membership.userID != adminID.id
        ).delete()

        # Add new members
        for member in update_data["members"]:
            if member.userID != adminID:  # Skip if trying to modify admin
                membership = models.Membership(
                    groupID=groupID,
                    userID=member.userID,
                    permission=member.permission.value,
                )
                db.add(membership)

    db.commit()
    db.refresh(db_group)

    return db_group


# delete group
def delete_group(db: Session, groupID: int, user: models.User):
    # Check if group exists and user is admin
    membership = (
        db.query(models.Membership)
        .filter(
            models.Membership.groupID == groupID,
            models.Membership.userID == user.id,
            models.Membership.permission == schemas.PermissionLevel.ADMIN.value,
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this group",
        )

    # Delete all memberships first
    db.query(models.Membership).filter(models.Membership.groupID == groupID).delete()

    # Delete the group
    group = db.query(models.Group).filter(models.Group.id == groupID).first()
    db.delete(group)
    db.commit()

    return {"message": "Group deleted successfully"}


# Membership CRUD Operations
def add_member(
    db: Session, groupID: int, membership: schemas.MembershipCreate, admin: models.User
):
    # Verify admin permission
    admin_membership = (
        db.query(models.Membership)
        .filter(
            models.Membership.groupID == groupID,
            models.Membership.userID == admin.id,
            models.Membership.permission == schemas.PermissionLevel.ADMIN.value,
        )
        .first()
    )

    if not admin_membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only group admins can add members",
        )

    # Check if user exists
    user = db.query(models.User).filter(models.User.id == membership.userID).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if membership already exists
    existing_membership = (
        db.query(models.Membership)
        .filter(
            models.Membership.groupID == groupID,
            models.Membership.userID == membership.userID,
        )
        .first()
    )

    if existing_membership:
        raise HTTPException(
            status_code=400, detail="User is already a member of this group"
        )

    # Create new membership
    new_membership = models.Membership(
        groupID=groupID,
        userID=membership.userID,
        permission=membership.permission.value,
    )
    db.add(new_membership)
    db.commit()
    db.refresh(new_membership)

    return new_membership


# update member permission
def update_member_permission(
    db: Session,
    groupID: int,
    memberID: int,
    permission_update: schemas.MembershipUpdate,
    admin: models.User,
):
    # Verify admin permission
    admin_membership = (
        db.query(models.Membership)
        .filter(
            models.Membership.groupID == groupID,
            models.Membership.userID == admin.id,
            models.Membership.permission == schemas.PermissionLevel.ADMIN.value,
        )
        .first()
    )

    if not admin_membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only group admins can modify permissions",
        )

    # Update member's permission
    membership = (
        db.query(models.Membership)
        .filter(
            models.Membership.groupID == groupID, models.Membership.userID == memberID
        )
        .first()
    )

    if not membership:
        raise HTTPException(status_code=404, detail="Member not found in group")

    membership.permission = permission_update.permission.value
    db.commit()
    db.refresh(membership)

    return membership


# remove member
def remove_member(db: Session, groupID: int, memberID: int, admin: models.User):
    # Verify admin permission
    admin_membership = (
        db.query(models.Membership)
        .filter(
            models.Membership.groupID == groupID,
            models.Membership.userID == admin.id,
            models.Membership.permission == schemas.PermissionLevel.ADMIN.value,
        )
        .first()
    )

    if not admin_membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only group admins can remove members",
        )

    # Prevent removing the last admin
    if memberID == admin.id:
        admin_count = (
            db.query(models.Membership)
            .filter(
                models.Membership.groupID == groupID,
                models.Membership.permission == schemas.PermissionLevel.ADMIN.value,
            )
            .count()
        )

        if admin_count <= 1:
            raise HTTPException(
                status_code=400, detail="Cannot remove the last admin from the group"
            )

    # Remove membership
    result = (
        db.query(models.Membership)
        .filter(
            models.Membership.groupID == groupID, models.Membership.userID == memberID
        )
        .delete()
    )

    if result == 0:
        raise HTTPException(status_code=404, detail="Member not found in group")

    db.commit()
    return {"message": "Member removed successfully"}
