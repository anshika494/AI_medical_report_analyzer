"""Food image analysis API endpoint."""

import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.food_analysis import FoodAnalysis
from app.config import settings
from app.services.ai_service import analyze_food_image

router = APIRouter(prefix="/food", tags=["Food Analysis"])


@router.post("/analyze")
async def analyze_food(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a food image and get AI-powered nutritional analysis."""
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in {"jpg", "jpeg", "png", "webp"}:
        raise HTTPException(status_code=400, detail="Only image files are supported (jpg, png, webp)")

    # Save image
    upload_dir = os.path.join(settings.UPLOAD_DIR, "food_images", str(user.id))
    os.makedirs(upload_dir, exist_ok=True)
    file_id = str(uuid.uuid4())
    file_path = os.path.join(upload_dir, f"{file_id}.{ext}")

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # AI analysis
    result = await analyze_food_image(file_path)

    # Save to DB
    food_record = FoodAnalysis(
        user_id=user.id,
        image_path=file_path,
        image_name=file.filename,
        identified_foods=result.get("identified_foods"),
        nutrition_info=result.get("nutrition"),
        is_healthy=result.get("is_healthy"),
        verdict=result.get("verdict"),
        healthier_alternatives=result.get("healthier_alternatives"),
        raw_ai_response=str(result),
    )
    db.add(food_record)
    await db.flush()

    return {
        "id": str(food_record.id),
        "identified_foods": result.get("identified_foods", []),
        "nutrition": result.get("nutrition", {}),
        "is_healthy": result.get("is_healthy"),
        "verdict": result.get("verdict", ""),
        "healthier_alternatives": result.get("healthier_alternatives", []),
        "meal_score": result.get("meal_score"),
        "tips": result.get("tips", []),
        "disclaimer": result.get("disclaimer", ""),
    }


@router.get("/history")
async def food_history(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get food analysis history."""
    result = await db.execute(
        select(FoodAnalysis)
        .where(FoodAnalysis.user_id == user.id)
        .order_by(desc(FoodAnalysis.created_at))
        .limit(20)
    )
    analyses = result.scalars().all()

    return [
        {
            "id": str(a.id),
            "image_name": a.image_name,
            "identified_foods": a.identified_foods,
            "is_healthy": a.is_healthy,
            "verdict": a.verdict,
            "created_at": a.created_at.isoformat(),
        }
        for a in analyses
    ]
