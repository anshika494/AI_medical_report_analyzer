"""Authentication service — registration, login, Google OAuth."""

import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User, UserProfile
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token


async def register_user(db: AsyncSession, email: str, password: str, full_name: str) -> dict:
    """Register a new user with email/password."""
    # Check if email exists
    result = await db.execute(select(User).where(User.email == email))
    existing = result.scalar_one_or_none()
    if existing:
        raise ValueError("Email already registered")

    user = User(
        email=email,
        full_name=full_name,
        hashed_password=hash_password(password),
    )
    db.add(user)
    await db.flush()

    # Create empty profile
    profile = UserProfile(user_id=user.id)
    db.add(profile)
    await db.flush()

    tokens = _generate_tokens(user)
    return {
        "user": {"id": str(user.id), "email": user.email, "full_name": user.full_name},
        **tokens,
    }


async def login_user(db: AsyncSession, email: str, password: str) -> dict:
    """Authenticate user with email/password."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user or not user.hashed_password:
        raise ValueError("Invalid email or password")

    if not verify_password(password, user.hashed_password):
        raise ValueError("Invalid email or password")

    tokens = _generate_tokens(user)
    return {
        "user": {"id": str(user.id), "email": user.email, "full_name": user.full_name, "avatar_url": user.avatar_url},
        **tokens,
    }


async def google_oauth_login(db: AsyncSession, google_id: str, email: str, full_name: str, avatar_url: str | None = None) -> dict:
    """Handle Google OAuth login/registration."""
    # Check if user exists by google_id
    result = await db.execute(select(User).where(User.google_id == google_id))
    user = result.scalar_one_or_none()

    if not user:
        # Check by email
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if user:
            # Link Google account to existing user
            user.google_id = google_id
            user.is_oauth_user = True
            if avatar_url:
                user.avatar_url = avatar_url
        else:
            # Create new user
            user = User(
                email=email,
                full_name=full_name,
                google_id=google_id,
                is_oauth_user=True,
                avatar_url=avatar_url,
            )
            db.add(user)
            await db.flush()

            profile = UserProfile(user_id=user.id)
            db.add(profile)
            await db.flush()

    tokens = _generate_tokens(user)
    return {
        "user": {"id": str(user.id), "email": user.email, "full_name": user.full_name, "avatar_url": user.avatar_url},
        **tokens,
    }


async def refresh_tokens(db: AsyncSession, refresh_token_str: str) -> dict:
    """Refresh access token using a valid refresh token."""
    payload = decode_token(refresh_token_str)
    if not payload or payload.get("type") != "refresh":
        raise ValueError("Invalid refresh token")

    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise ValueError("User not found or inactive")

    return _generate_tokens(user)


def _generate_tokens(user: User) -> dict:
    """Generate access and refresh tokens for a user."""
    token_data = {"sub": str(user.id)}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
    }
