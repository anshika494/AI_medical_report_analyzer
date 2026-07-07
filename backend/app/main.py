"""BioBalance API — FastAPI application entry point."""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — create tables on startup."""
    # Import all models to ensure they're registered with Base
    from app.models import User, UserProfile, MedicalReport, ReportAnalysis, FoodAnalysis  # noqa

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Ensure upload directories exist
    os.makedirs(os.path.join(settings.UPLOAD_DIR, "reports"), exist_ok=True)
    os.makedirs(os.path.join(settings.UPLOAD_DIR, "food_images"), exist_ok=True)

    yield

    await engine.dispose()


app = FastAPI(
    title="BioBalance API",
    description="AI-powered medical report analyzer and health recommendation engine",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.reports import router as reports_router
from app.api.health import router as health_router
from app.api.food import router as food_router
from app.api.comparison import router as comparison_router

app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(health_router, prefix="/api")
app.include_router(food_router, prefix="/api")
app.include_router(comparison_router, prefix="/api")


@app.get("/api/health-check")
async def health_check():
    return {"status": "healthy", "app": "BioBalance API", "version": "1.0.0"}
