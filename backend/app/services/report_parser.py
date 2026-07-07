"""Extract structured biomarker values from raw OCR text using regex patterns."""

import re
from typing import Optional
from app.core.reference_ranges import REFERENCE_RANGES, get_status_for_value


# Regex patterns for common biomarker names and their values
BIOMARKER_PATTERNS = {
    "glucose_fasting": [
        r"(?:fasting|fbg|fbs|fasting\s*blood\s*(?:glucose|sugar))\s*[:\-]?\s*([\d.]+)\s*(?:mg/dL)?",
    ],
    "glucose_pp": [
        r"(?:pp|post\s*prandial|ppbs|pp\s*blood\s*(?:glucose|sugar))\s*[:\-]?\s*([\d.]+)\s*(?:mg/dL)?",
    ],
    "hba1c": [
        r"(?:hba1c|hb\s*a1c|glycated\s*h[ae]moglobin|glycosylated)\s*[:\-]?\s*([\d.]+)\s*%?",
    ],
    "total_cholesterol": [
        r"(?:total\s*cholesterol)\s*[:\-]?\s*([\d.]+)\s*(?:mg/dL)?",
        r"cholesterol\s*(?:total)?\s*[:\-]?\s*([\d.]+)\s*(?:mg/dL)?",
    ],
    "ldl_cholesterol": [
        r"(?:ldl|ldl[\s\-]*c(?:holesterol)?|low\s*density)\s*[:\-]?\s*([\d.]+)\s*(?:mg/dL)?",
    ],
    "hdl_cholesterol": [
        r"(?:hdl|hdl[\s\-]*c(?:holesterol)?|high\s*density)\s*[:\-]?\s*([\d.]+)\s*(?:mg/dL)?",
    ],
    "triglycerides": [
        r"(?:triglycerides?|tg)\s*[:\-]?\s*([\d.]+)\s*(?:mg/dL)?",
    ],
    "hemoglobin": [
        r"(?:h[ae]moglobin|hgb|hb)\s*[:\-]?\s*([\d.]+)\s*(?:g/dL)?",
    ],
    "rbc": [
        r"(?:rbc|red\s*blood\s*cell)\s*(?:count)?\s*[:\-]?\s*([\d.]+)",
    ],
    "wbc": [
        r"(?:wbc|white\s*blood\s*cell|total\s*leucocyte)\s*(?:count)?\s*[:\-]?\s*([\d.]+)",
    ],
    "platelet_count": [
        r"(?:platelet|plt)\s*(?:count)?\s*[:\-]?\s*([\d.]+)",
    ],
    "tsh": [
        r"(?:tsh|thyroid\s*stimulating)\s*[:\-]?\s*([\d.]+)\s*(?:mIU/L|µIU/mL)?",
    ],
    "t3": [
        r"(?:t3|triiodothyronine)\s*(?:total)?\s*[:\-]?\s*([\d.]+)",
    ],
    "t4": [
        r"(?:t4|thyroxine)\s*(?:total)?\s*[:\-]?\s*([\d.]+)",
    ],
    "creatinine": [
        r"(?:creatinine|serum\s*creatinine)\s*[:\-]?\s*([\d.]+)\s*(?:mg/dL)?",
    ],
    "bun": [
        r"(?:bun|blood\s*urea\s*nitrogen|urea)\s*[:\-]?\s*([\d.]+)\s*(?:mg/dL)?",
    ],
    "uric_acid": [
        r"(?:uric\s*acid)\s*[:\-]?\s*([\d.]+)\s*(?:mg/dL)?",
    ],
    "alt": [
        r"(?:alt|sgpt|alanine\s*(?:amino)?transferase)\s*[:\-]?\s*([\d.]+)\s*(?:U/L)?",
    ],
    "ast": [
        r"(?:ast|sgot|aspartate\s*(?:amino)?transferase)\s*[:\-]?\s*([\d.]+)\s*(?:U/L)?",
    ],
    "bilirubin_total": [
        r"(?:total\s*bilirubin|bilirubin\s*total)\s*[:\-]?\s*([\d.]+)\s*(?:mg/dL)?",
    ],
    "albumin": [
        r"(?:albumin|serum\s*albumin)\s*[:\-]?\s*([\d.]+)\s*(?:g/dL)?",
    ],
    "vitamin_d": [
        r"(?:vitamin\s*d|25[\s\-]*(?:oh|hydroxy)[\s\-]*(?:vitamin\s*)?d)\s*[:\-]?\s*([\d.]+)\s*(?:ng/mL)?",
    ],
    "vitamin_b12": [
        r"(?:vitamin\s*b[\s\-]*12|b12|cobalamin)\s*[:\-]?\s*([\d.]+)\s*(?:pg/mL)?",
    ],
    "iron": [
        r"(?:serum\s*iron|iron)\s*[:\-]?\s*([\d.]+)\s*(?:µg/dL)?",
    ],
    "calcium": [
        r"(?:calcium|serum\s*calcium|ca)\s*[:\-]?\s*([\d.]+)\s*(?:mg/dL)?",
    ],
}


def parse_biomarkers(ocr_text: str, gender: str = "male") -> dict:
    """Parse OCR text and extract structured biomarker values."""
    text_lower = ocr_text.lower()
    results = {}

    for biomarker_key, patterns in BIOMARKER_PATTERNS.items():
        for pattern in patterns:
            match = re.search(pattern, text_lower)
            if match:
                try:
                    value = float(match.group(1))
                    ref = REFERENCE_RANGES.get(biomarker_key, {})
                    status = get_status_for_value(biomarker_key, value, gender)

                    results[biomarker_key] = {
                        "name": ref.get("name", biomarker_key),
                        "value": value,
                        "unit": ref.get("unit", ""),
                        "status": status,
                        "category": ref.get("category", "other"),
                        "reference_range": {
                            "min": ref.get(f"normal_min_{gender}", ref.get("normal_min", "")),
                            "max": ref.get(f"normal_max_{gender}", ref.get("normal_max", "")),
                        },
                    }
                    break  # Use first matching pattern
                except (ValueError, IndexError):
                    continue

    return results


def detect_report_type(ocr_text: str) -> str:
    """Attempt to detect the type of medical report from OCR text."""
    text_lower = ocr_text.lower()

    keywords = {
        "blood_test": ["cbc", "complete blood count", "hemoglobin", "rbc", "wbc", "platelet"],
        "lipid_profile": ["cholesterol", "ldl", "hdl", "triglycerides", "lipid"],
        "thyroid": ["tsh", "t3", "t4", "thyroid"],
        "kidney_function": ["creatinine", "bun", "uric acid", "kidney", "renal"],
        "liver_function": ["alt", "ast", "sgpt", "sgot", "bilirubin", "liver", "hepatic"],
        "diabetes": ["hba1c", "glucose", "fasting blood sugar", "diabetes"],
        "vitamin_panel": ["vitamin d", "vitamin b12", "b12", "folate"],
        "general_checkup": ["health checkup", "master health", "annual", "wellness"],
    }

    scores = {}
    for report_type, kws in keywords.items():
        score = sum(1 for kw in kws if kw in text_lower)
        if score > 0:
            scores[report_type] = score

    if scores:
        return max(scores, key=scores.get)
    return "general"
