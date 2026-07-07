"""MedicalReport ORM model."""

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class MedicalReport(Base):
    __tablename__ = "medical_reports"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)

    # File info
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    file_type: Mapped[str] = mapped_column(String(50), nullable=False)  # pdf, jpg, png

    # OCR output
    extracted_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    report_type: Mapped[str | None] = mapped_column(String(100), nullable=True)  # blood_test, prescription, etc.

    # Timestamps
    report_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)  # Date on the report itself
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="reports")
    analysis: Mapped["ReportAnalysis"] = relationship(back_populates="report", uselist=False, cascade="all, delete-orphan")
