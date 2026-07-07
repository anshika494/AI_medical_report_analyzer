"""User profile API endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User, UserProfile
from app.schemas.user import UserProfileUpdate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
async def get_current_user_profile(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user profile."""
    result = await db.execute(
        select(User).options(selectinload(User.profile)).where(User.id == user.id)
    )
    user_with_profile = result.scalar_one()

    profile_data = None
    if user_with_profile.profile:
        p = user_with_profile.profile
        profile_data = {
            "age": p.age,
            "gender": p.gender,
            "height_cm": p.height_cm,
            "weight_kg": p.weight_kg,
            "activity_level": p.activity_level,
            "health_conditions": p.health_conditions,
            "allergies": p.allergies,
            "dietary_preferences": p.dietary_preferences,
        }

    return {
        "id": str(user_with_profile.id),
        "email": user_with_profile.email,
        "full_name": user_with_profile.full_name,
        "avatar_url": user_with_profile.avatar_url,
        "profile": profile_data,
    }


@router.put("/profile")
async def update_profile(
    profile_data: UserProfileUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update user health profile."""
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == user.id)
    )
    profile = result.scalar_one_or_none()

    if not profile:
        profile = UserProfile(user_id=user.id)
        db.add(profile)

    update_data = profile_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)

    await db.flush()

    return {
        "message": "Profile updated successfully",
        "profile": {
            "age": profile.age,
            "gender": profile.gender,
            "height_cm": profile.height_cm,
            "weight_kg": profile.weight_kg,
            "activity_level": profile.activity_level,
            "health_conditions": profile.health_conditions,
            "allergies": profile.allergies,
            "dietary_preferences": profile.dietary_preferences,
        },
    }
