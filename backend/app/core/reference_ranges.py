"""Medical reference ranges for common biomarkers."""

REFERENCE_RANGES = {
    "glucose_fasting": {
        "name": "Fasting Blood Glucose",
        "unit": "mg/dL",
        "normal_min": 70,
        "normal_max": 100,
        "prediabetic_max": 125,
        "category": "blood_sugar"
    },
    "glucose_pp": {
        "name": "Post-Prandial Glucose",
        "unit": "mg/dL",
        "normal_min": 70,
        "normal_max": 140,
        "prediabetic_max": 199,
        "category": "blood_sugar"
    },
    "hba1c": {
        "name": "HbA1c (Glycated Hemoglobin)",
        "unit": "%",
        "normal_min": 4.0,
        "normal_max": 5.6,
        "prediabetic_max": 6.4,
        "category": "blood_sugar"
    },
    "total_cholesterol": {
        "name": "Total Cholesterol",
        "unit": "mg/dL",
        "normal_min": 0,
        "normal_max": 200,
        "borderline_max": 239,
        "category": "lipid_profile"
    },
    "ldl_cholesterol": {
        "name": "LDL Cholesterol",
        "unit": "mg/dL",
        "normal_min": 0,
        "normal_max": 100,
        "borderline_max": 159,
        "category": "lipid_profile"
    },
    "hdl_cholesterol": {
        "name": "HDL Cholesterol",
        "unit": "mg/dL",
        "normal_min": 40,
        "normal_max": 60,
        "optimal_min": 60,
        "category": "lipid_profile"
    },
    "triglycerides": {
        "name": "Triglycerides",
        "unit": "mg/dL",
        "normal_min": 0,
        "normal_max": 150,
        "borderline_max": 199,
        "category": "lipid_profile"
    },
    "hemoglobin": {
        "name": "Hemoglobin",
        "unit": "g/dL",
        "normal_min_male": 13.5,
        "normal_max_male": 17.5,
        "normal_min_female": 12.0,
        "normal_max_female": 15.5,
        "category": "cbc"
    },
    "rbc": {
        "name": "Red Blood Cell Count",
        "unit": "million/µL",
        "normal_min_male": 4.5,
        "normal_max_male": 5.5,
        "normal_min_female": 4.0,
        "normal_max_female": 5.0,
        "category": "cbc"
    },
    "wbc": {
        "name": "White Blood Cell Count",
        "unit": "cells/µL",
        "normal_min": 4500,
        "normal_max": 11000,
        "category": "cbc"
    },
    "platelet_count": {
        "name": "Platelet Count",
        "unit": "cells/µL",
        "normal_min": 150000,
        "normal_max": 400000,
        "category": "cbc"
    },
    "tsh": {
        "name": "Thyroid Stimulating Hormone",
        "unit": "mIU/L",
        "normal_min": 0.4,
        "normal_max": 4.0,
        "category": "thyroid"
    },
    "t3": {
        "name": "Triiodothyronine (T3)",
        "unit": "ng/dL",
        "normal_min": 80,
        "normal_max": 200,
        "category": "thyroid"
    },
    "t4": {
        "name": "Thyroxine (T4)",
        "unit": "µg/dL",
        "normal_min": 4.5,
        "normal_max": 12.0,
        "category": "thyroid"
    },
    "creatinine": {
        "name": "Serum Creatinine",
        "unit": "mg/dL",
        "normal_min_male": 0.7,
        "normal_max_male": 1.3,
        "normal_min_female": 0.6,
        "normal_max_female": 1.1,
        "category": "kidney"
    },
    "bun": {
        "name": "Blood Urea Nitrogen",
        "unit": "mg/dL",
        "normal_min": 7,
        "normal_max": 20,
        "category": "kidney"
    },
    "uric_acid": {
        "name": "Uric Acid",
        "unit": "mg/dL",
        "normal_min_male": 3.4,
        "normal_max_male": 7.0,
        "normal_min_female": 2.4,
        "normal_max_female": 6.0,
        "category": "kidney"
    },
    "alt": {
        "name": "ALT (SGPT)",
        "unit": "U/L",
        "normal_min": 7,
        "normal_max": 56,
        "category": "liver"
    },
    "ast": {
        "name": "AST (SGOT)",
        "unit": "U/L",
        "normal_min": 10,
        "normal_max": 40,
        "category": "liver"
    },
    "bilirubin_total": {
        "name": "Total Bilirubin",
        "unit": "mg/dL",
        "normal_min": 0.1,
        "normal_max": 1.2,
        "category": "liver"
    },
    "albumin": {
        "name": "Serum Albumin",
        "unit": "g/dL",
        "normal_min": 3.5,
        "normal_max": 5.5,
        "category": "liver"
    },
    "vitamin_d": {
        "name": "Vitamin D (25-OH)",
        "unit": "ng/mL",
        "normal_min": 30,
        "normal_max": 100,
        "insufficient_min": 20,
        "category": "vitamins"
    },
    "vitamin_b12": {
        "name": "Vitamin B12",
        "unit": "pg/mL",
        "normal_min": 200,
        "normal_max": 900,
        "category": "vitamins"
    },
    "iron": {
        "name": "Serum Iron",
        "unit": "µg/dL",
        "normal_min_male": 65,
        "normal_max_male": 175,
        "normal_min_female": 50,
        "normal_max_female": 170,
        "category": "minerals"
    },
    "calcium": {
        "name": "Serum Calcium",
        "unit": "mg/dL",
        "normal_min": 8.5,
        "normal_max": 10.5,
        "category": "minerals"
    },
    "systolic_bp": {
        "name": "Systolic Blood Pressure",
        "unit": "mmHg",
        "normal_min": 90,
        "normal_max": 120,
        "elevated_max": 129,
        "category": "blood_pressure"
    },
    "diastolic_bp": {
        "name": "Diastolic Blood Pressure",
        "unit": "mmHg",
        "normal_min": 60,
        "normal_max": 80,
        "category": "blood_pressure"
    },
}


def get_status_for_value(biomarker_key: str, value: float, gender: str = "male") -> str:
    """Returns 'normal', 'borderline', 'high', 'low', or 'critical' for a biomarker value."""
    ref = REFERENCE_RANGES.get(biomarker_key)
    if not ref:
        return "unknown"

    # Get gender-specific ranges if available
    min_val = ref.get(f"normal_min_{gender}", ref.get("normal_min", 0))
    max_val = ref.get(f"normal_max_{gender}", ref.get("normal_max", float("inf")))

    if min_val <= value <= max_val:
        return "normal"

    borderline_max = ref.get("borderline_max") or ref.get("prediabetic_max")
    if borderline_max and max_val < value <= borderline_max:
        return "borderline"

    if value < min_val:
        return "low"
    if value > max_val:
        return "high"

    return "unknown"
