"""
Scan2SQL — Phase 3: OCR Processing (Tesseract English + Hindi & PyMuPDF) and Document Classification
Implements:
1. Tesseract OCR integration with Windows binary auto-detection and English + Hindi ('eng+hin') support.
2. Hybrid PDF text extraction:
   - Direct text extraction via PyMuPDF (fitz) for digital text-based PDF pages.
   - Automatic fallback to Tesseract OCR on OpenCV-preprocessed page images for scanned PDF pages.
3. Multi-page text combination in strict page order.
4. Automatic Document Type Classification ('normal_document' vs 'shop_bill') with matched evidence signals.
"""
import os
import re
import shutil
import time
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

import cv2
import fitz  # PyMuPDF
import numpy as np
import pytesseract
from PIL import Image

from backend.config import settings

# Minimum non-whitespace characters on a PDF page to consider it a native text PDF page
MIN_DIRECT_PDF_CHARS = 35

# Bilingual (English + Hindi) lexical indicators for Shop Bill / Receipt classification
BILL_KEYWORDS_STRONG = [
    (r"\bgstin\b", "GSTIN tax identifier"),
    (r"\btax\s*invoice\b", "Tax Invoice header"),
    (r"\bcash\s*memo\b", "Cash Memo header"),
    (r"\bgrand\s*total\b", "Grand Total line"),
    (r"\bsub\s*total\b|\bsubtotal\b", "Subtotal line"),
    (r"\bcgst\b|\bsgst\b|\bigst\b", "CGST/SGST/IGST tax split"),
    (r"\binvoice\s*(?:no|number|#)\b", "Invoice Number label"),
    (r"\bbill\s*(?:no|number|#)\b", "Bill Number label"),
    (r"जीएसटी|रसीद|कुल\s*योग|बीजक", "Hindi Bill/GST keyword"),
]

BILL_KEYWORDS_MODERATE = [
    (r"\breceipt\b", "Receipt keyword"),
    (r"\bqty\b|\bquantity\b", "Quantity column header"),
    (r"\bunit\s*price\b|\brate\b|\bmrp\b", "Rate / MRP column header"),
    (r"\bnet\s*amount\b|\btotal\s*amount\b|\bpayable\b", "Total Payable label"),
    (r"(?:rs\.?|inr|₹)\s*\d+(?:,\d{3})*(?:\.\d{2})?", "Currency amount (Rs./₹)"),
    (r"धन्यवाद|मात्रा|मूल्य", "Hindi receipt term"),
]


def resolve_tesseract_binary() -> Tuple[Optional[str], bool]:
    """
    Locate the Tesseract executable on Windows or PATH and configure pytesseract.
    Returns (resolved_path, is_available).
    """
    configured_path = settings.TESSERACT_CMD
    candidates = [
        configured_path,
        shutil.which("tesseract"),
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe"),
    ]

    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            pytesseract.pytesseract.tesseract_cmd = str(candidate)
            return str(candidate), True

    return configured_path, False


def get_available_tesseract_languages() -> List[str]:
    """Return list of installed Tesseract language codes (e.g. ['eng', 'hin', 'osd'])."""
    _, available = resolve_tesseract_binary()
    if not available:
        return []
    try:
        return pytesseract.get_languages(config="")
    except Exception:
        return ["eng"]


def run_tesseract_on_image(
    image_path: Path,
    lang: str = "eng+hin",
    psm: int = 6,
) -> Dict[str, Any]:
    """
    Execute Tesseract OCR on a preprocessed or original image path.
    Supports English ('eng'), Hindi ('hin'), or Bilingual ('eng+hin').
    Automatically falls back to 'eng' with a clear notice if 'hin.traineddata' is missing.
    """
    t0 = time.perf_counter()
    resolved_bin, available = resolve_tesseract_binary()
    if not available:
        raise RuntimeError(
            f"Tesseract OCR executable was not found at '{resolved_bin}'. "
            "Please install UB-Mannheim Tesseract OCR on Windows or verify TESSERACT_CMD in .env."
        )

    if not image_path.exists():
        raise FileNotFoundError(f"Image file not found for OCR: {image_path}")

    # Load image via numpy + OpenCV to support Unicode filenames on Windows
    raw_bytes = np.fromfile(str(image_path), dtype=np.uint8)
    img_np = cv2.imdecode(raw_bytes, cv2.IMREAD_UNCHANGED)
    if img_np is None:
        raise ValueError(f"Unable to decode image for OCR: {image_path.name}")

    if len(img_np.shape) == 3 and img_np.shape[2] == 3:
        img_rgb = cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(img_rgb)
    else:
        pil_img = Image.fromarray(img_np)

    installed_langs = get_available_tesseract_languages()
    effective_lang = lang
    fallback_warning: Optional[str] = None

    if "hin" in lang and installed_langs and "hin" not in installed_langs:
        effective_lang = "eng"
        fallback_warning = (
            "Hindi language data ('hin.traineddata') was not found in Tesseract tessdata; "
            "processed using English ('eng'). Install Hindi data in Tesseract for Devanagari OCR."
        )

    custom_config = f"--oem 3 --psm {psm}"
    try:
        raw_text = pytesseract.image_to_string(
            pil_img, lang=effective_lang, config=custom_config
        )
    except pytesseract.TesseractError as exc:
        if "hin" in effective_lang:
            effective_lang = "eng"
            fallback_warning = (
                "Fell back to English ('eng') because 'hin' language data was unavailable."
            )
            raw_text = pytesseract.image_to_string(
                pil_img, lang="eng", config=custom_config
            )
        else:
            raise RuntimeError(f"Tesseract OCR engine failed: {str(exc)}") from exc

    cleaned_text = normalize_extracted_text(raw_text)
    elapsed_ms = round((time.perf_counter() - t0) * 1000, 1)

    return {
        "text": cleaned_text,
        "language_used": effective_lang,
        "extraction_method": "tesseract_ocr",
        "character_count": len(cleaned_text),
        "word_count": len(cleaned_text.split()) if cleaned_text else 0,
        "processing_time_ms": elapsed_ms,
        "warning": fallback_warning,
    }


def normalize_extracted_text(raw_text: str) -> str:
    """
    Clean excessive blank lines and trailing whitespace while preserving tabular receipt alignment.
    """
    if not raw_text:
        return ""
    lines = [line.rstrip() for line in raw_text.replace("\r\n", "\n").split("\n")]
    cleaned_lines: List[str] = []
    blank_streak = 0
    for line in lines:
        if not line.strip():
            blank_streak += 1
            if blank_streak <= 1:
                cleaned_lines.append("")
        else:
            blank_streak = 0
            cleaned_lines.append(line)
    return "\n".join(cleaned_lines).strip()


def classify_document_text(extracted_text: str) -> Dict[str, Any]:
    """
    Analyze OCR-extracted text to classify the document as either:
      - 'shop_bill' (Shop Bill / Receipt / Tax Invoice)
      - 'normal_document' (Book page, notes, article, general document)
    Returns classification result, confidence score (0.0 - 1.0), and matched evidence signals.
    """
    if not extracted_text or not extracted_text.strip():
        return {
            "detected_type": "normal_document",
            "confidence": 0.0,
            "score_points": 0,
            "matched_signals": ["No text extracted yet"],
        }

    text_lower = extracted_text.lower()
    score = 0
    matched_signals: List[str] = []

    # 1. Check strong bill indicators (+25 points each)
    for pattern, label in BILL_KEYWORDS_STRONG:
        if re.search(pattern, text_lower, flags=re.IGNORECASE):
            score += 25
            matched_signals.append(f"Matched strong bill indicator: {label}")

    # 2. Check moderate bill indicators (+12 points each)
    for pattern, label in BILL_KEYWORDS_MODERATE:
        if re.search(pattern, text_lower, flags=re.IGNORECASE):
            score += 12
            matched_signals.append(f"Matched receipt indicator: {label}")

    # 3. Count decimal price lines (e.g. "265.00", "1,287.30") typical of itemized bills
    price_line_matches = re.findall(r"\b\d{1,6}\.\d{2}\b", extracted_text)
    if len(price_line_matches) >= 3:
        score += 25
        matched_signals.append(
            f"Detected {len(price_line_matches)} formatted decimal price values"
        )
    elif len(price_line_matches) >= 1:
        score += 10
        matched_signals.append(
            f"Detected {len(price_line_matches)} decimal price value(s)"
        )

    # Determine classification threshold (score >= 40 => shop_bill)
    if score >= 40:
        detected_type = "shop_bill"
        confidence = min(0.99, round(0.50 + (score / 160.0), 2))
    else:
        detected_type = "normal_document"
        confidence = round(max(0.60, 1.0 - (score / 60.0)), 2)
        if not matched_signals:
            matched_signals.append(
                "Continuous prose / paragraph structure without invoice or tax totals"
            )

    return {
        "detected_type": detected_type,
        "confidence": confidence,
        "score_points": score,
        "matched_signals": matched_signals[:6],
    }


def extract_text_from_document(
    saved_original_path: Path,
    file_type: str,
    file_token: str,
    lang: str = "eng+hin",
    psm: int = 6,
) -> Dict[str, Any]:
    """
    Complete Phase 3 multi-page OCR and PDF text extraction orchestrator:
    - For PDF files:
        Iterates over every page in page order (1..N) using PyMuPDF.
        Uses direct embedded text extraction when the page contains digital text (>= 35 chars).
        Uses Tesseract OCR on the OpenCV-preprocessed page image when the page is scanned.
    - For JPG/JPEG/PNG images:
        Runs Tesseract OCR on the OpenCV-preprocessed image (or falls back to original image).
    - Combines multi-page text in exact page order and runs automatic Document Type Classification.
    """
    t0 = time.perf_counter()
    processed_dir = settings.UPLOAD_DIR / "processed"
    page_results: List[Dict[str, Any]] = []
    combined_pages_text: List[str] = []
    warnings: List[str] = []

    if file_type.lower() == "pdf":
        doc = fitz.open(str(saved_original_path))
        try:
            total_pages = len(doc)
            for idx in range(total_pages):
                page_num = idx + 1
                page = doc.load_page(idx)
                direct_text = normalize_extracted_text(page.get_text("text") or "")
                non_ws_chars = len(re.sub(r"\s+", "", direct_text))

                if non_ws_chars >= MIN_DIRECT_PDF_CHARS:
                    page_results.append(
                        {
                            "page_number": page_num,
                            "extraction_method": "pymupdf_direct",
                            "language_used": "native_pdf",
                            "character_count": len(direct_text),
                            "word_count": len(direct_text.split()),
                            "text": direct_text,
                        }
                    )
                    if total_pages > 1:
                        combined_pages_text.append(
                            f"--- [Page {page_num} · Direct PDF Text] ---\n{direct_text}"
                        )
                    else:
                        combined_pages_text.append(direct_text)
                else:
                    # Scanned PDF page -> run Tesseract OCR on the OpenCV processed page image
                    proc_page_path = processed_dir / f"{file_token}_page_{page_num}_proc.png"
                    orig_page_path = processed_dir / f"{file_token}_page_{page_num}_orig.png"
                    target_img_path = (
                        proc_page_path if proc_page_path.exists() else orig_page_path
                    )

                    ocr_res = run_tesseract_on_image(target_img_path, lang=lang, psm=psm)
                    if ocr_res.get("warning"):
                        warnings.append(ocr_res["warning"])

                    page_text = ocr_res["text"]
                    page_results.append(
                        {
                            "page_number": page_num,
                            "extraction_method": "tesseract_ocr",
                            "language_used": ocr_res["language_used"],
                            "character_count": ocr_res["character_count"],
                            "word_count": ocr_res["word_count"],
                            "text": page_text,
                        }
                    )
                    if total_pages > 1:
                        combined_pages_text.append(
                            f"--- [Page {page_num} · Tesseract OCR] ---\n{page_text}"
                        )
                    else:
                        combined_pages_text.append(page_text)
        finally:
            doc.close()
    else:
        proc_img_path = processed_dir / f"{file_token}_page_1_proc.png"
        target_img_path = proc_img_path if proc_img_path.exists() else saved_original_path
        ocr_res = run_tesseract_on_image(target_img_path, lang=lang, psm=psm)
        if ocr_res.get("warning"):
            warnings.append(ocr_res["warning"])

        page_text = ocr_res["text"]
        page_results.append(
            {
                "page_number": 1,
                "extraction_method": "tesseract_ocr",
                "language_used": ocr_res["language_used"],
                "character_count": ocr_res["character_count"],
                "word_count": ocr_res["word_count"],
                "text": page_text,
            }
        )
        combined_pages_text.append(page_text)

    full_text = "\n\n".join(part for part in combined_pages_text if part).strip()
    classification = classify_document_text(full_text)
    total_elapsed_ms = round((time.perf_counter() - t0) * 1000, 1)

    if not full_text:
        warnings.append(
            "No readable text was detected in the document. Try switching Thresholding Mode to "
            "'Enhanced High-Contrast Grayscale' or 'Otsu' and re-running OCR."
        )

    return {
        "extracted_text": full_text,
        "page_count": len(page_results),
        "pages_ocr": page_results,
        "classification": classification,
        "total_characters": len(full_text),
        "total_words": len(full_text.split()) if full_text else 0,
        "processing_time_ms": total_elapsed_ms,
        "warnings": list(dict.fromkeys(warnings)),
    }
