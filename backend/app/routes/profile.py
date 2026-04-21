from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserProfile
from app.schemas import UserProfileResponse, UserProfileCreate, UserProfileWithUser
from app.security import get_current_user

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("", response_model=UserProfileWithUser)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return profile

@router.put("", response_model=UserProfileResponse)
def update_profile(
    profile_update: UserProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        db.flush()

    update_data = profile_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile
