"""OCR service for extracting text from medical reports (PDF and images)."""

import os
import logging
from pathlib import Path
from typing import Optional
from PIL import Image
import numpy as np

logger = logging.getLogger(__name__)


def preprocess_image_for_ocr(image: Image.Image) -> Image.Image:
    """Preprocess an image for better OCR accuracy."""
    try:
        import cv2

        img_array = np.array(image)

        # Convert to grayscale
        if len(img_array.shape) == 3:
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        else:
            gray = img_array

        # Apply adaptive thresholding
        processed = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )

        # Denoise
        processed = cv2.fastNlMeansDenoising(processed, None, 10, 7, 21)

        return Image.fromarray(processed)
    except ImportError:
        logger.warning("OpenCV not available, using raw image for OCR")
        return image.convert("L")


def extract_text_from_image(image_path: str) -> str:
    """Extract text from a single image file using Tesseract OCR."""
    try:
        import pytesseract

        image = Image.open(image_path)

        # Ensure minimum resolution
        if image.size[0] < 1000:
            ratio = 1500 / image.size[0]
            new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
            image = image.resize(new_size, Image.LANCZOS)

        processed = preprocess_image_for_ocr(image)
        text = pytesseract.image_to_string(processed, config="--psm 6 --oem 3")
        return text.strip()
    except Exception as e:
        logger.error(f"OCR failed for image {image_path}: {e}")
        return ""


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from all pages of a PDF file."""
    try:
        from pdf2image import convert_from_path
        import pytesseract

        pages = convert_from_path(pdf_path, dpi=300)
        all_text = []

        for i, page in enumerate(pages):
            processed = preprocess_image_for_ocr(page)
            text = pytesseract.image_to_string(processed, config="--psm 6 --oem 3")
            if text.strip():
                all_text.append(f"--- Page {i + 1} ---\n{text.strip()}")

        return "\n\n".join(all_text)
    except Exception as e:
        logger.error(f"OCR failed for PDF {pdf_path}: {e}")
        return ""


def extract_text(file_path: str, file_type: str) -> str:
    """Main entry point — extract text from any supported file type."""
    if file_type.lower() in ["pdf"]:
        return extract_text_from_pdf(file_path)
    elif file_type.lower() in ["jpg", "jpeg", "png", "bmp", "tiff"]:
        return extract_text_from_image(file_path)
    else:
        logger.warning(f"Unsupported file type: {file_type}")
        return ""


def clean_extracted_text(raw_text: str) -> str:
    """Clean and normalize OCR-extracted text."""
    import re

    # Remove excessive whitespace
    text = re.sub(r'\n{3,}', '\n\n', raw_text)
    text = re.sub(r' {2,}', ' ', text)

    # Fix common OCR mistakes in medical context
    replacements = {
        "mg/dl": "mg/dL",
        "mg/DL": "mg/dL",
        "g/dl": "g/dL",
        "u/l": "U/L",
        "u/L": "U/L",
        "miu/l": "mIU/L",
        "ng/ml": "ng/mL",
        "pg/ml": "pg/mL",
        "µg/dl": "µg/dL",
        "mmhg": "mmHg",
    }
    for old, new in replacements.items():
        text = re.sub(re.escape(old), new, text, flags=re.IGNORECASE)

    return text.strip()
