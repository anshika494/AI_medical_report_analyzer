"""Authentication API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, GoogleOAuthRequest, RefreshRequest
from app.services.auth_service import register_user, login_user, google_oauth_login, refresh_tokens

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user with email and password."""
    try:
        result = await register_user(db, request.email, request.password, request.full_name)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login")
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login with email and password."""
    try:
        result = await login_user(db, request.email, request.password)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/google")
async def google_login(request: GoogleOAuthRequest, db: AsyncSession = Depends(get_db)):
    """Login or register via Google OAuth."""
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests
        from app.config import settings

        idinfo = id_token.verify_oauth2_token(
            request.credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

        result = await google_oauth_login(
            db,
            google_id=idinfo["sub"],
            email=idinfo["email"],
            full_name=idinfo.get("name", ""),
            avatar_url=idinfo.get("picture"),
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid Google token: {e}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/refresh")
async def refresh(request: RefreshRequest, db: AsyncSession = Depends(get_db)):
    """Refresh access token."""
    try:
        result = await refresh_tokens(db, request.refresh_token)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
