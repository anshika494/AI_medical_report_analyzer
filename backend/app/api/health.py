"""Health metrics and scores API endpoint."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User, UserProfile
from app.models.report import MedicalReport
from app.services.health_calculator import compute_all_metrics

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/metrics")
async def get_health_metrics(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Calculate and return current health metrics from user profile."""
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == user.id)
    )
    profile = result.scalar_one_or_none()

    if not profile or not all([profile.weight_kg, profile.height_cm, profile.age]):
        raise HTTPException(
            status_code=400,
            detail="Complete your profile (age, height, weight) to see health metrics",
        )

    metrics = compute_all_metrics(
        weight_kg=profile.weight_kg,
        height_cm=profile.height_cm,
        age=profile.age,
        gender=profile.gender or "male",
        activity_level=profile.activity_level or "sedentary",
    )

    return metrics


@router.get("/scores/latest")
async def get_latest_scores(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the most recent health scores from the latest analyzed report."""
    result = await db.execute(
        select(MedicalReport)
        .options(selectinload(MedicalReport.analysis))
        .where(MedicalReport.user_id == user.id)
        .order_by(desc(MedicalReport.uploaded_at))
        .limit(1)
    )
    report = result.scalar_one_or_none()

    if not report or not report.analysis:
        return {"message": "No analyzed reports found. Upload a report to get your health scores."}

    a = report.analysis
    return {
        "report_id": str(report.id),
        "report_date": report.uploaded_at.isoformat(),
        "scores": {
            "overall": {"score": a.overall_score, "explanation": (a.ai_scores_explanation or {}).get("overall", {}).get("explanation", "")},
            "nutrition": {"score": a.nutrition_score, "explanation": (a.ai_scores_explanation or {}).get("nutrition", {}).get("explanation", "")},
            "fitness": {"score": a.fitness_score, "explanation": (a.ai_scores_explanation or {}).get("fitness", {}).get("explanation", "")},
            "sleep": {"score": a.sleep_score, "explanation": (a.ai_scores_explanation or {}).get("sleep", {}).get("explanation", "")},
            "hydration": {"score": a.hydration_score, "explanation": (a.ai_scores_explanation or {}).get("hydration", {}).get("explanation", "")},
            "mental_wellness": {"score": a.mental_wellness_score, "explanation": (a.ai_scores_explanation or {}).get("mental_wellness", {}).get("explanation", "")},
            "heart_health": {"score": a.heart_health_score, "explanation": (a.ai_scores_explanation or {}).get("heart_health", {}).get("explanation", "")},
            "lifestyle": {"score": a.lifestyle_score, "explanation": (a.ai_scores_explanation or {}).get("lifestyle", {}).get("explanation", "")},
            "risk_assessment": {"score": a.risk_score, "explanation": (a.ai_scores_explanation or {}).get("risk_assessment", {}).get("explanation", "")},
        },
    }


@router.get("/trends")
async def get_score_trends(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get historical score trends across all reports."""
    result = await db.execute(
        select(MedicalReport)
        .options(selectinload(MedicalReport.analysis))
        .where(MedicalReport.user_id == user.id)
        .order_by(MedicalReport.uploaded_at)
    )
    reports = result.scalars().all()

    trends = []
    for r in reports:
        if r.analysis:
            trends.append({
                "date": r.uploaded_at.isoformat(),
                "report_id": str(r.id),
                "overall": r.analysis.overall_score,
                "nutrition": r.analysis.nutrition_score,
                "fitness": r.analysis.fitness_score,
                "sleep": r.analysis.sleep_score,
                "hydration": r.analysis.hydration_score,
                "heart_health": r.analysis.heart_health_score,
                "lifestyle": r.analysis.lifestyle_score,
            })

    return {"trends": trends, "total_reports": len(trends)}
