"""ReportAnalysis ORM model — stores AI-generated analysis for a medical report."""

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Text, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base


class ReportAnalysis(Base):
    __tablename__ = "report_analyses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("medical_reports.id"), unique=True)

    # Extracted biomarkers (structured JSON)
    biomarkers: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # Computed health metrics (backend-calculated)
    health_metrics: Mapped[dict | None] = mapped_column(JSONB, nullable=True)  # BMI, BMR, TDEE, etc.

    # Health Scores (0-100)
    overall_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    nutrition_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    fitness_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    sleep_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    hydration_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    mental_wellness_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    heart_health_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    lifestyle_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    risk_score: Mapped[float | None] = mapped_column(Float, nullable=True)

    # AI-generated content (full JSON response)
    ai_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_recommendations: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    ai_scores_explanation: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    ai_abnormal_values: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    ai_meal_plan: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    ai_workout_plan: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    ai_lifestyle_advice: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # Full raw AI response
    raw_ai_response: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    report: Mapped["MedicalReport"] = relationship(back_populates="analysis")
