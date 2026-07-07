"""Health metric calculations using scientifically accepted formulas.

All calculations are performed server-side, NOT by the AI.
"""

from typing import Optional


def calculate_bmi(weight_kg: float, height_cm: float) -> dict:
    """Calculate BMI and classify category."""
    height_m = height_cm / 100
    bmi = round(weight_kg / (height_m ** 2), 1)

    if bmi < 18.5:
        category = "Underweight"
        risk = "Increased risk of nutritional deficiency"
    elif 18.5 <= bmi < 25:
        category = "Normal"
        risk = "Low health risk"
    elif 25 <= bmi < 30:
        category = "Overweight"
        risk = "Moderate health risk"
    elif 30 <= bmi < 35:
        category = "Obese Class I"
        risk = "High health risk"
    elif 35 <= bmi < 40:
        category = "Obese Class II"
        risk = "Very high health risk"
    else:
        category = "Obese Class III"
        risk = "Extremely high health risk"

    return {"value": bmi, "category": category, "risk": risk, "unit": "kg/m²"}


def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> dict:
    """Calculate Basal Metabolic Rate using Mifflin-St Jeor equation."""
    if gender == "male":
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    else:
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161

    return {"value": round(bmr, 0), "unit": "kcal/day", "formula": "Mifflin-St Jeor"}


def calculate_tdee(bmr: float, activity_level: str) -> dict:
    """Calculate Total Daily Energy Expenditure."""
    activity_multipliers = {
        "sedentary": 1.2,
        "lightly_active": 1.375,
        "moderately_active": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9,
    }
    multiplier = activity_multipliers.get(activity_level, 1.2)
    tdee = round(bmr * multiplier, 0)

    return {
        "value": tdee,
        "unit": "kcal/day",
        "activity_level": activity_level,
        "multiplier": multiplier,
    }


def calculate_macros(tdee: float, weight_kg: float, goal: str = "maintain") -> dict:
    """Calculate recommended macronutrient intake."""
    # Protein: 1.6-2.2 g/kg based on activity
    protein_g = round(weight_kg * 1.8, 0)
    protein_calories = protein_g * 4

    # Fats: 25-30% of total calories
    fat_calories = tdee * 0.27
    fat_g = round(fat_calories / 9, 0)

    # Carbs: remaining calories
    carb_calories = tdee - protein_calories - fat_calories
    carb_g = round(carb_calories / 4, 0)

    return {
        "protein": {"grams": protein_g, "calories": protein_calories, "percentage": round(protein_calories / tdee * 100, 1)},
        "carbohydrates": {"grams": carb_g, "calories": carb_calories, "percentage": round(carb_calories / tdee * 100, 1)},
        "fats": {"grams": fat_g, "calories": fat_calories, "percentage": round(fat_calories / tdee * 100, 1)},
        "total_calories": tdee,
    }


def calculate_water_intake(weight_kg: float, activity_level: str = "sedentary") -> dict:
    """Calculate daily water intake recommendation."""
    base_ml = weight_kg * 33
    activity_bonus = {
        "sedentary": 0,
        "lightly_active": 350,
        "moderately_active": 500,
        "very_active": 700,
        "extra_active": 1000,
    }
    total_ml = base_ml + activity_bonus.get(activity_level, 0)
    glasses = round(total_ml / 250)

    return {
        "ml": round(total_ml, 0),
        "liters": round(total_ml / 1000, 1),
        "glasses": glasses,
        "unit": "mL/day",
    }


def calculate_ideal_sleep(age: int) -> dict:
    """Calculate recommended sleep duration by age group."""
    if age < 18:
        hours_min, hours_max = 8, 10
    elif 18 <= age <= 64:
        hours_min, hours_max = 7, 9
    else:
        hours_min, hours_max = 7, 8

    return {
        "recommended_min": hours_min,
        "recommended_max": hours_max,
        "ideal": round((hours_min + hours_max) / 2, 1),
        "unit": "hours/night",
    }


def calculate_ideal_weight(height_cm: float, gender: str) -> dict:
    """Calculate ideal weight range using Devine formula."""
    height_inches = height_cm / 2.54
    inches_over_5ft = max(0, height_inches - 60)

    if gender == "male":
        ideal_kg = 50 + 2.3 * inches_over_5ft
    else:
        ideal_kg = 45.5 + 2.3 * inches_over_5ft

    return {
        "ideal_weight_kg": round(ideal_kg, 1),
        "healthy_range_min": round(ideal_kg * 0.9, 1),
        "healthy_range_max": round(ideal_kg * 1.1, 1),
        "unit": "kg",
    }


def calculate_body_fat_estimate(bmi: float, age: int, gender: str) -> dict:
    """Estimate body fat percentage from BMI (Deurenberg formula)."""
    if gender == "male":
        body_fat = (1.20 * bmi) + (0.23 * age) - 16.2
    else:
        body_fat = (1.20 * bmi) + (0.23 * age) - 5.4

    body_fat = max(3, min(body_fat, 60))  # Clamp to reasonable range

    if gender == "male":
        category = "Athletic" if body_fat < 14 else "Fit" if body_fat < 18 else "Average" if body_fat < 25 else "Overweight"
    else:
        category = "Athletic" if body_fat < 21 else "Fit" if body_fat < 25 else "Average" if body_fat < 32 else "Overweight"

    return {
        "percentage": round(body_fat, 1),
        "category": category,
        "unit": "%",
        "formula": "Deurenberg",
    }


def compute_all_metrics(
    weight_kg: float,
    height_cm: float,
    age: int,
    gender: str,
    activity_level: str = "sedentary",
) -> dict:
    """Compute all health metrics from user profile data."""
    bmi_data = calculate_bmi(weight_kg, height_cm)
    bmr_data = calculate_bmr(weight_kg, height_cm, age, gender)
    tdee_data = calculate_tdee(bmr_data["value"], activity_level)
    macros_data = calculate_macros(tdee_data["value"], weight_kg)
    water_data = calculate_water_intake(weight_kg, activity_level)
    sleep_data = calculate_ideal_sleep(age)
    ideal_weight_data = calculate_ideal_weight(height_cm, gender)
    body_fat_data = calculate_body_fat_estimate(bmi_data["value"], age, gender)

    return {
        "bmi": bmi_data,
        "bmr": bmr_data,
        "tdee": tdee_data,
        "macros": macros_data,
        "water_intake": water_data,
        "sleep": sleep_data,
        "ideal_weight": ideal_weight_data,
        "body_fat_estimate": body_fat_data,
    }
