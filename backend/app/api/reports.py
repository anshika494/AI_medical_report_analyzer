"""Medical report upload and analysis API endpoints."""

import os
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User, UserProfile
from app.models.report import MedicalReport
from app.models.analysis import ReportAnalysis
from app.config import settings
from app.services.ocr_service import extract_text, clean_extracted_text
from app.services.report_parser import parse_biomarkers, detect_report_type
from app.services.health_calculator import compute_all_metrics
from app.services.ai_service import analyze_report

router = APIRouter(prefix="/reports", tags=["Reports"])

ALLOWED_EXTENSIONS = {"pdf", "jpg", "jpeg", "png", "bmp", "tiff"}


@router.post("/upload")
async def upload_report(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a medical report file, process with OCR, and generate AI analysis."""

    # Validate file type
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: .{ext}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Save file
    upload_dir = os.path.join(settings.UPLOAD_DIR, "reports", str(user.id))
    os.makedirs(upload_dir, exist_ok=True)
    file_id = str(uuid.uuid4())
    file_path = os.path.join(upload_dir, f"{file_id}.{ext}")

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Step 1: OCR extraction
    raw_text = extract_text(file_path, ext)
    cleaned_text = clean_extracted_text(raw_text)

    # Step 2: Parse biomarkers
    # Get user profile for gender-specific ranges
    profile_result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == user.id)
    )
    profile = profile_result.scalar_one_or_none()
    gender = profile.gender if profile and profile.gender else "male"
    biomarkers = parse_biomarkers(cleaned_text, gender)
    report_type = detect_report_type(cleaned_text)

    # Save report record
    report = MedicalReport(
        user_id=user.id,
        file_name=file.filename,
        file_path=file_path,
        file_type=ext,
        extracted_text=cleaned_text,
        report_type=report_type,
        report_date=datetime.utcnow(),
    )
    db.add(report)
    await db.flush()

    # Step 3: Calculate health metrics (if profile exists)
    health_metrics = {}
    user_profile_data = {}
    if profile and profile.weight_kg and profile.height_cm and profile.age:
        health_metrics = compute_all_metrics(
            weight_kg=profile.weight_kg,
            height_cm=profile.height_cm,
            age=profile.age,
            gender=gender,
            activity_level=profile.activity_level or "sedentary",
        )
        user_profile_data = {
            "age": profile.age,
            "gender": profile.gender,
            "height_cm": profile.height_cm,
            "weight_kg": profile.weight_kg,
            "activity_level": profile.activity_level,
            "health_conditions": profile.health_conditions,
            "allergies": profile.allergies,
            "dietary_preferences": profile.dietary_preferences,
        }

    # Step 4: Fetch previous reports for trend context
    prev_result = await db.execute(
        select(MedicalReport)
        .options(selectinload(MedicalReport.analysis))
        .where(MedicalReport.user_id == user.id, MedicalReport.id != report.id)
        .order_by(desc(MedicalReport.uploaded_at))
        .limit(3)
    )
    prev_reports = prev_result.scalars().all()
    previous_reports_data = []
    for pr in prev_reports:
        if pr.analysis:
            previous_reports_data.append({
                "date": pr.uploaded_at.isoformat() if pr.uploaded_at else "Unknown",
                "biomarkers": pr.analysis.biomarkers or {},
                "overall_score": pr.analysis.overall_score,
            })

    # Step 5: AI analysis
    ai_result = await analyze_report(
        extracted_text=cleaned_text,
        biomarkers=biomarkers,
        health_metrics=health_metrics,
        user_profile=user_profile_data,
        previous_reports=previous_reports_data if previous_reports_data else None,
    )

    # Step 6: Save analysis
    scores = ai_result.get("scores", {})
    analysis = ReportAnalysis(
        report_id=report.id,
        biomarkers=biomarkers,
        health_metrics=health_metrics,
        overall_score=scores.get("overall", {}).get("score"),
        nutrition_score=scores.get("nutrition", {}).get("score"),
        fitness_score=scores.get("fitness", {}).get("score"),
        sleep_score=scores.get("sleep", {}).get("score"),
        hydration_score=scores.get("hydration", {}).get("score"),
        mental_wellness_score=scores.get("mental_wellness", {}).get("score"),
        heart_health_score=scores.get("heart_health", {}).get("score"),
        lifestyle_score=scores.get("lifestyle", {}).get("score"),
        risk_score=scores.get("risk_assessment", {}).get("score"),
        ai_summary=ai_result.get("summary", ""),
        ai_recommendations=ai_result.get("recommendations", {}),
        ai_scores_explanation=scores,
        ai_abnormal_values=ai_result.get("abnormal_values", []),
        ai_meal_plan=ai_result.get("recommendations", {}).get("daily_meal_plan", {}),
        ai_workout_plan=ai_result.get("workout_plan", {}),
        ai_lifestyle_advice=ai_result.get("lifestyle_advice", {}),
        raw_ai_response=str(ai_result),
    )
    db.add(analysis)
    await db.flush()

    return {
        "id": str(report.id),
        "file_name": report.file_name,
        "report_type": report_type,
        "uploaded_at": report.uploaded_at.isoformat(),
        "analysis_id": str(analysis.id),
        "overall_score": analysis.overall_score,
        "status": "completed",
    }


@router.get("/")
async def list_reports(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all reports for the current user."""
    result = await db.execute(
        select(MedicalReport)
        .options(selectinload(MedicalReport.analysis))
        .where(MedicalReport.user_id == user.id)
        .order_by(desc(MedicalReport.uploaded_at))
    )
    reports = result.scalars().all()

    return [
        {
            "id": str(r.id),
            "file_name": r.file_name,
            "report_type": r.report_type,
            "uploaded_at": r.uploaded_at.isoformat(),
            "overall_score": r.analysis.overall_score if r.analysis else None,
            "has_analysis": r.analysis is not None,
        }
        for r in reports
    ]


@router.get("/{report_id}")
async def get_report_detail(
    report_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get full report detail with analysis."""
    try:
        rid = uuid.UUID(report_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid report ID")

    result = await db.execute(
        select(MedicalReport)
        .options(selectinload(MedicalReport.analysis))
        .where(MedicalReport.id == rid, MedicalReport.user_id == user.id)
    )
    report = result.scalar_one_or_none()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    analysis_data = None
    if report.analysis:
        a = report.analysis
        analysis_data = {
            "biomarkers": a.biomarkers,
            "health_metrics": a.health_metrics,
            "scores": a.ai_scores_explanation,
            "overall_score": a.overall_score,
            "summary": a.ai_summary,
            "abnormal_values": a.ai_abnormal_values,
            "recommendations": a.ai_recommendations,
            "workout_plan": a.ai_workout_plan,
            "lifestyle_advice": a.ai_lifestyle_advice,
            "meal_plan": a.ai_meal_plan,
            "disclaimer": "⚕️ This analysis is for educational purposes only. Consult a healthcare professional.",
            "created_at": a.created_at.isoformat(),
        }

    return {
        "id": str(report.id),
        "file_name": report.file_name,
        "file_type": report.file_type,
        "report_type": report.report_type,
        "extracted_text": report.extracted_text,
        "uploaded_at": report.uploaded_at.isoformat(),
        "analysis": analysis_data,
    }
