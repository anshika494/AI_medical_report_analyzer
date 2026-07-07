"""Pydantic schemas for reports and analysis."""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReportUploadResponse(BaseModel):
    id: str
    file_name: str
    file_type: str
    report_type: Optional[str] = None
    uploaded_at: str
    status: str = "processing"


class BiomarkerItem(BaseModel):
    name: str
    value: float
    unit: str
    status: str  # normal, high, low, borderline
    category: str
    reference_range: dict


class AnalysisResponse(BaseModel):
    report_id: str
    biomarkers: dict
    health_metrics: dict
    scores: dict
    summary: str
    abnormal_values: list
    recommendations: dict
    workout_plan: dict
    lifestyle_advice: dict
    meal_plan: dict
    trend_analysis: Optional[str] = None
    disclaimer: str
    created_at: str


class ReportListItem(BaseModel):
    id: str
    file_name: str
    report_type: Optional[str] = None
    uploaded_at: str
    overall_score: Optional[float] = None
    has_analysis: bool = False
