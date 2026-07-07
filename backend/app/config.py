"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://biobalance:biobalance_secret@localhost:5432/biobalance"

    # JWT
    JWT_SECRET_KEY: str = "super-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Google Gemini
    GEMINI_API_KEY: str = ""

    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None

    # App
    BACKEND_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:3000"
    UPLOAD_DIR: str = "./app/uploads"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
