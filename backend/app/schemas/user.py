"""Pydantic schemas for user profile."""

from pydantic import BaseModel, Field
from typing import Optional


class UserProfileUpdate(BaseModel):
    age: Optional[int] = Field(None, ge=1, le=120)
    gender: Optional[str] = None
    height_cm: Optional[float] = Field(None, ge=50, le=300)
    weight_kg: Optional[float] = Field(None, ge=10, le=500)
    activity_level: Optional[str] = None
    health_conditions: Optional[str] = None
    allergies: Optional[str] = None
    dietary_preferences: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    profile: Optional[dict] = None

    class Config:
        from_attributes = True
