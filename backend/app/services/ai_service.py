"""Google Gemini AI service — direct API calls for report analysis and food recognition."""

import json
import logging
from typing import Optional
import google.generativeai as genai
from PIL import Image
from app.config import settings
from app.services.prompt_builder import (
    build_report_analysis_prompt,
    build_food_analysis_prompt,
    build_comparison_prompt,
    MEDICAL_DISCLAIMER,
)

logger = logging.getLogger(__name__)


def _configure_gemini():
    """Configure the Gemini API with the API key."""
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)


def _parse_json_response(text: str) -> dict:
    """Parse JSON from AI response, handling markdown code fences."""
    cleaned = text.strip()

    # Remove markdown code fences if present
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI JSON response: {e}")
        logger.debug(f"Raw response: {text[:500]}")
        return {"error": "Failed to parse AI response", "raw": text[:1000]}


async def analyze_report(
    extracted_text: str,
    biomarkers: dict,
    health_metrics: dict,
    user_profile: dict,
    previous_reports: list | None = None,
) -> dict:
    """Send structured data to Gemini for comprehensive health analysis."""
    _configure_gemini()

    prompt = build_report_analysis_prompt(
        extracted_text=extracted_text,
        biomarkers=biomarkers,
        health_metrics=health_metrics,
        user_profile=user_profile,
        previous_reports=previous_reports,
    )

    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.3,
                max_output_tokens=8000,
                response_mime_type="application/json",
            ),
        )

        result = _parse_json_response(response.text)
        result["disclaimer"] = MEDICAL_DISCLAIMER
        return result

    except Exception as e:
        logger.error(f"Gemini API error during report analysis: {e}")
        return {
            "error": str(e),
            "summary": "Unable to generate AI analysis at this time. Please try again later.",
            "disclaimer": MEDICAL_DISCLAIMER,
        }


async def analyze_food_image(image_path: str) -> dict:
    """Analyze a food image using Gemini Vision."""
    _configure_gemini()

    prompt = build_food_analysis_prompt()

    try:
        image = Image.open(image_path)
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(
            [prompt, image],
            generation_config=genai.GenerationConfig(
                temperature=0.3,
                max_output_tokens=4000,
                response_mime_type="application/json",
            ),
        )

        result = _parse_json_response(response.text)
        result["disclaimer"] = MEDICAL_DISCLAIMER
        return result

    except Exception as e:
        logger.error(f"Gemini API error during food analysis: {e}")
        return {
            "error": str(e),
            "verdict": "Unable to analyze food image at this time.",
            "disclaimer": MEDICAL_DISCLAIMER,
        }


async def compare_reports(report1_data: dict, report2_data: dict) -> dict:
    """Compare two reports using Gemini AI."""
    _configure_gemini()

    prompt = build_comparison_prompt(report1_data, report2_data)

    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.3,
                max_output_tokens=4000,
                response_mime_type="application/json",
            ),
        )

        result = _parse_json_response(response.text)
        result["disclaimer"] = MEDICAL_DISCLAIMER
        return result

    except Exception as e:
        logger.error(f"Gemini API error during comparison: {e}")
        return {"error": str(e), "disclaimer": MEDICAL_DISCLAIMER}
