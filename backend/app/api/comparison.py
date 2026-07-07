"""Report comparison API endpoint."""

import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.report import MedicalReport
from app.services.ai_service import compare_reports

router = APIRouter(prefix="/comparison", tags=["Comparison"])


@router.get("/{report_id_1}/{report_id_2}")
async def compare_two_reports(
    report_id_1: str,
    report_id_2: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Compare two reports and get AI-powered trend insights."""
    try:
        rid1 = uuid.UUID(report_id_1)
        rid2 = uuid.UUID(report_id_2)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid report IDs")

    # Fetch both reports
    result1 = await db.execute(
        select(MedicalReport)
        .options(selectinload(MedicalReport.analysis))
        .where(MedicalReport.id == rid1, MedicalReport.user_id == user.id)
    )
    report1 = result1.scalar_one_or_none()

    result2 = await db.execute(
        select(MedicalReport)
        .options(selectinload(MedicalReport.analysis))
        .where(MedicalReport.id == rid2, MedicalReport.user_id == user.id)
    )
    report2 = result2.scalar_one_or_none()

    if not report1 or not report2:
        raise HTTPException(status_code=404, detail="One or both reports not found")

    if not report1.analysis or not report2.analysis:
        raise HTTPException(status_code=400, detail="Both reports must have completed analysis")

    # Build comparison data
    report1_data = {
        "date": report1.uploaded_at.isoformat(),
        "biomarkers": report1.analysis.biomarkers or {},
        "scores": report1.analysis.ai_scores_explanation or {},
    }
    report2_data = {
        "date": report2.uploaded_at.isoformat(),
        "biomarkers": report2.analysis.biomarkers or {},
        "scores": report2.analysis.ai_scores_explanation or {},
    }

    # AI comparison
    comparison = await compare_reports(report1_data, report2_data)

    # Add score deltas
    score_fields = ["overall_score", "nutrition_score", "fitness_score", "sleep_score",
                    "hydration_score", "heart_health_score", "lifestyle_score"]
    score_changes = {}
    for field in score_fields:
        old_val = getattr(report1.analysis, field, None)
        new_val = getattr(report2.analysis, field, None)
        if old_val is not None and new_val is not None:
            delta = round(new_val - old_val, 1)
            score_changes[field] = {
                "old": old_val,
                "new": new_val,
                "delta": delta,
                "trend": "improved" if delta > 0 else "declined" if delta < 0 else "stable",
            }

    return {
        "report1": {"id": str(report1.id), "date": report1.uploaded_at.isoformat()},
        "report2": {"id": str(report2.id), "date": report2.uploaded_at.isoformat()},
        "score_changes": score_changes,
        "ai_analysis": comparison,
    }
