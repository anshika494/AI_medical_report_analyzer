"""FoodAnalysis ORM model — stores AI-generated food image analysis."""

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base


class FoodAnalysis(Base):
    __tablename__ = "food_analyses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)

    # Image info
    image_path: Mapped[str] = mapped_column(String(500), nullable=False)
    image_name: Mapped[str] = mapped_column(String(255), nullable=False)

    # AI analysis results
    identified_foods: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    nutrition_info: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    is_healthy: Mapped[bool | None] = mapped_column(nullable=True)
    verdict: Mapped[str | None] = mapped_column(Text, nullable=True)
    healthier_alternatives: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    raw_ai_response: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="food_analyses")
