"""
Scan2SQL — Phase 2: OpenCV Computer Vision & PDF Page Rendering Pipeline
Implements:
1. Safe filename sanitization and file validation (JPG, JPEG, PNG, PDF)
2. Multi-page PDF to image rendering via PyMuPDF (fitz)
3. OpenCV Preprocessing Pipeline:
   - Image resizing (optimal OCR scale normalization)
   - Document boundary detection & 4-point perspective correction
   - Rotation / skew angle detection & deskewing
   - Grayscale conversion
   - Shadow reduction & uneven illumination normalization (Division / CLAHE)
   - Noise removal (Fast Non-Local Means / Bilateral & Median filtering)
   - Adaptive Gaussian thresholding & Otsu binarization
"""
import json
import re
import time
import urllib.parse
import uuid
from pathlib import Path
from typing import Dict, Any, List, Tuple, Optional

import cv2
import fitz  # PyMuPDF
import numpy as np

from backend.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf"}
ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
}


def sanitize_filename(filename: str) -> str:
    """
    Sanitize user-supplied filename to prevent path traversal and invalid Windows characters.
    """
    name = Path(filename).name
    cleaned = re.sub(r"[^A-Za-z0-9._-]", "_", name)
    return cleaned or "document"


def validate_upload_file(filename: str, content_type: Optional[str], file_size_bytes: int) -> Tuple[bool, str, str]:
    """
    Validate file extension, MIME type, and file size against settings.MAX_UPLOAD_SIZE_MB.
    Returns (is_valid, error_message, normalized_extension_without_dot).
    """
    if not filename:
        return False, "No filename provided.", ""

    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        return (
            False,
            f"Unsupported file extension '{ext}'. Allowed formats: JPG, JPEG, PNG, PDF.",
            "",
        )

    if content_type and content_type.lower() not in ALLOWED_MIME_TYPES:
        return (
            False,
            f"Unsupported content type '{content_type}'. Allowed formats: JPG, JPEG, PNG, PDF.",
            "",
        )

    if file_size_bytes <= 0:
        return False, "Uploaded file is empty (0 bytes).", ""

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file_size_bytes > max_bytes:
        size_mb = round(file_size_bytes / (1024 * 1024), 2)
        return (
            False,
            f"File size ({size_mb} MB) exceeds the {settings.MAX_UPLOAD_SIZE_MB} MB limit.",
            "",
        )

    return True, "", ext.lstrip(".")


def order_quad_points(pts: np.ndarray) -> np.ndarray:
    """
    Order 4 contour points as: top-left, top-right, bottom-right, bottom-left.
    """
    rect = np.zeros((4, 2), dtype="float32")
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    return rect


def detect_and_warp_perspective(image_bgr: np.ndarray) -> Tuple[np.ndarray, bool]:
    """
    Detect document boundary contour in the image and apply 4-point perspective transform
    if a clear quadrilateral document region occupying >= 25% of the image area is found.
    """
    h, w = image_bgr.shape[:2]
    image_area = float(h * w)

    # Downscale for faster and cleaner contour edge detection
    ratio = h / 600.0
    resized = cv2.resize(image_bgr, (int(w / ratio), 600), interpolation=cv2.INTER_AREA)

    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 180)

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    edged = cv2.dilate(edged, kernel, iterations=1)

    contours, _ = cv2.findContours(edged, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]

    doc_cnt = None
    resized_area = float(resized.shape[0] * resized.shape[1])

    for c in contours:
        area = cv2.contourArea(c)
        # Ignore contours that are too small (< 25%) or practically the entire frame (> 97%)
        if area < 0.25 * resized_area or area > 0.97 * resized_area:
            continue

        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        if len(approx) == 4:
            doc_cnt = approx
            break

    if doc_cnt is None:
        return image_bgr, False

    pts = doc_cnt.reshape(4, 2) * ratio
    rect = order_quad_points(pts)
    (tl, tr, br, bl) = rect

    width_a = np.linalg.norm(br - bl)
    width_b = np.linalg.norm(tr - tl)
    max_width = max(int(width_a), int(width_b))

    height_a = np.linalg.norm(tr - br)
    height_b = np.linalg.norm(tl - bl)
    max_height = max(int(height_a), int(height_b))

    if max_width < 100 or max_height < 100 or (max_width * max_height) < 0.20 * image_area:
        return image_bgr, False

    dst = np.array(
        [
            [0, 0],
            [max_width - 1, 0],
            [max_width - 1, max_height - 1],
            [0, max_height - 1],
        ],
        dtype="float32",
    )

    matrix = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image_bgr, matrix, (max_width, max_height))
    return warped, True


def correct_rotation_skew(gray: np.ndarray) -> Tuple[np.ndarray, float]:
    """
    Estimate text skew angle using foreground pixel coordinates and rotate image to deskew.
    Only rotates if the detected skew angle is between 0.4 degrees and 25 degrees.
    """
    # Invert binary image so text pixels are white (foreground)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Connect horizontal text characters into lines to get reliable orientation
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 3))
    connected = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    coords = np.column_stack(np.where(connected > 0))
    if len(coords) < 200:
        return gray, 0.0

    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle

    # Normalize angles near 90/-90
    if abs(angle) > 45:
        angle = angle % 45

    if abs(angle) < 0.4 or abs(angle) > 25.0:
        return gray, 0.0

    (h, w) = gray.shape[:2]
    center = (w // 2, h // 2)
    rot_mat = cv2.getRotationMatrix2D(center, angle, 1.0)
    deskewed = cv2.warpAffine(
        gray,
        rot_mat,
        (w, h),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE,
    )
    return deskewed, round(float(angle), 2)


def remove_shadows_and_normalize_lighting(gray: np.ndarray) -> np.ndarray:
    """
    Remove uneven shadows on scanned pages or camera photos of shop bills
    by estimating the background illumination plane via morphological dilation + median blur.
    """
    dilated_img = cv2.dilate(gray, np.ones((7, 7), np.uint8))
    bg_img = cv2.medianBlur(dilated_img, 21)
    diff_img = 255 - cv2.absdiff(gray, bg_img)
    norm_img = cv2.normalize(
        diff_img, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8UC1
    )
    # Apply gentle CLAHE for local contrast enhancement
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    return clahe.apply(norm_img)


def resize_for_optimal_ocr(image: np.ndarray, target_min_width: int = 1200, target_max_width: int = 2400) -> Tuple[np.ndarray, float]:
    """
    Resize image so width is within [target_min_width, target_max_width] for high-accuracy OCR.
    """
    h, w = image.shape[:2]
    scale = 1.0
    if w < target_min_width:
        scale = target_min_width / float(w)
        resized = cv2.resize(
            image, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_CUBIC
        )
        return resized, round(scale, 2)
    if w > target_max_width:
        scale = target_max_width / float(w)
        resized = cv2.resize(
            image, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA
        )
        return resized, round(scale, 2)
    return image, 1.0


def preprocess_image_opencv(
    input_image_path: Path,
    output_image_path: Path,
    options: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Run the complete OpenCV document preprocessing pipeline on a single image while preserving
    the original file untouched.
    Options:
      - perspective_correction: bool (default True)
      - rotation_correction: bool (default True)
      - shadow_removal: bool (default True)
      - denoise: bool (default True)
      - threshold_mode: 'adaptive' | 'otsu' | 'grayscale' (default 'adaptive')
    """
    start_time = time.perf_counter()
    opts = {
        "perspective_correction": True,
        "rotation_correction": True,
        "shadow_removal": True,
        "denoise": True,
        "threshold_mode": "adaptive",
    }
    if options:
        opts.update(options)

    # Read image safely supporting Unicode Windows paths via numpy.fromfile
    raw_bytes = np.fromfile(str(input_image_path), dtype=np.uint8)
    img_bgr = cv2.imdecode(raw_bytes, cv2.IMREAD_COLOR)
    if img_bgr is None:
        raise ValueError(f"OpenCV could not decode image: {input_image_path.name}")

    orig_h, orig_w = img_bgr.shape[:2]
    steps_applied: List[str] = []

    # 1. Perspective Correction / Document Boundary Detection
    perspective_warped = False
    if opts.get("perspective_correction", True):
        img_bgr, perspective_warped = detect_and_warp_perspective(img_bgr)
        if perspective_warped:
            steps_applied.append("Document Boundary Detection & 4-Point Perspective Warp")

    # 2. Optimal Resolution Resizing
    img_bgr, scale_factor = resize_for_optimal_ocr(img_bgr)
    if scale_factor != 1.0:
        steps_applied.append(f"Resolution Scaling ({scale_factor}x)")

    # 3. Grayscale Conversion
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    steps_applied.append("Grayscale Conversion")

    # 4. Shadow Reduction & Illumination Normalization
    if opts.get("shadow_removal", True):
        gray = remove_shadows_and_normalize_lighting(gray)
        steps_applied.append("Shadow Reduction & CLAHE Lighting Normalization")

    # 5. Rotation / Skew Correction
    skew_angle = 0.0
    if opts.get("rotation_correction", True):
        gray, skew_angle = correct_rotation_skew(gray)
        if skew_angle != 0.0:
            steps_applied.append(f"Rotation Deskew ({skew_angle}°)")

    # 6. Noise Removal
    if opts.get("denoise", True):
        gray = cv2.fastNlMeansDenoising(gray, None, h=10, templateWindowSize=7, searchWindowSize=21)
        steps_applied.append("Fast Non-Local Means Denoising")

    # 7. Thresholding
    threshold_mode = opts.get("threshold_mode", "adaptive")
    if threshold_mode == "adaptive":
        processed = cv2.adaptiveThreshold(
            gray,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            31,
            12,
        )
        steps_applied.append("Adaptive Gaussian Thresholding")
    elif threshold_mode == "otsu":
        _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        steps_applied.append("Otsu Binarization Thresholding")
    else:
        processed = gray
        steps_applied.append("Enhanced High-Contrast Grayscale")

    # Encode and write processed image supporting Unicode Windows paths
    output_image_path.parent.mkdir(parents=True, exist_ok=True)
    success, encoded_img = cv2.imencode(".png", processed)
    if not success:
        raise RuntimeError("Failed to encode processed OpenCV image to PNG.")
    encoded_img.tofile(str(output_image_path))

    proc_h, proc_w = processed.shape[:2]
    elapsed_ms = round((time.perf_counter() - start_time) * 1000, 1)

    return {
        "original_dimensions": {"width": orig_w, "height": orig_h},
        "processed_dimensions": {"width": proc_w, "height": proc_h},
        "scale_factor": scale_factor,
        "perspective_warped": perspective_warped,
        "skew_angle_deg": skew_angle,
        "threshold_mode": threshold_mode,
        "steps_applied": steps_applied,
        "processing_time_ms": elapsed_ms,
    }


def render_pdf_to_images(pdf_path: Path, output_dir: Path, file_token: str, dpi: int = 200) -> List[Path]:
    """
    Render every page of an uploaded PDF into high-resolution PNG images using PyMuPDF
    so each page can be previewed and processed by OpenCV.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    rendered_paths: List[Path] = []

    doc = fitz.open(str(pdf_path))
    try:
        zoom = dpi / 72.0
        matrix = fitz.Matrix(zoom, zoom)
        for page_index in range(len(doc)):
            page = doc.load_page(page_index)
            pix = page.get_pixmap(matrix=matrix, alpha=False)
            page_img_path = output_dir / f"{file_token}_page_{page_index + 1}_orig.png"
            pix.save(str(page_img_path))
            rendered_paths.append(page_img_path)
    finally:
        doc.close()

    return rendered_paths


def process_uploaded_document(
    saved_original_path: Path,
    file_type: str,
    file_token: str,
    options: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Coordinate preview generation and OpenCV preprocessing for both image files (JPG/JPEG/PNG)
    and multi-page PDF documents. Preserves the original uploaded file untouched.
    """
    originals_dir = settings.UPLOAD_DIR / "originals"
    processed_dir = settings.UPLOAD_DIR / "processed"
    originals_dir.mkdir(parents=True, exist_ok=True)
    processed_dir.mkdir(parents=True, exist_ok=True)

    pages_metadata: List[Dict[str, Any]] = []

    if file_type.lower() == "pdf":
        rendered_page_originals = render_pdf_to_images(
            saved_original_path, processed_dir, file_token, dpi=200
        )
        for idx, orig_page_path in enumerate(rendered_page_originals, start=1):
            proc_page_path = processed_dir / f"{file_token}_page_{idx}_proc.png"
            cv_metrics = preprocess_image_opencv(orig_page_path, proc_page_path, options=options)
            pages_metadata.append(
                {
                    "page_number": idx,
                    "original_preview_url": f"/uploads/processed/{orig_page_path.name}",
                    "processed_preview_url": f"/uploads/processed/{proc_page_path.name}",
                    "cv_metrics": cv_metrics,
                }
            )
    else:
        proc_img_path = processed_dir / f"{file_token}_page_1_proc.png"
        cv_metrics = preprocess_image_opencv(saved_original_path, proc_img_path, options=options)
        pages_metadata.append(
            {
                "page_number": 1,
                "original_preview_url": f"/uploads/originals/{saved_original_path.name}",
                "processed_preview_url": f"/uploads/processed/{proc_img_path.name}",
                "cv_metrics": cv_metrics,
            }
        )

    return {
        "file_token": file_token,
        "page_count": len(pages_metadata),
        "pages": pages_metadata,
    }


def generate_storage_token() -> str:
    """Generate a collision-safe prefix token for stored files."""
    return uuid.uuid4().hex[:10]


def parse_receipt_qr_payload(raw_qr: str) -> Dict[str, Any]:
    """
    Parse a decoded QR string from a receipt or invoice (UPI URI, JSON e-Invoice, or Key-Value text)
    into pre-filled structured bill fields.
    """
    text = (raw_qr or "").strip()
    result: Dict[str, Any] = {
        "raw_qr": text,
        "format": "text",
        "shop_name": None,
        "invoice_number": None,
        "bill_date": None,
        "subtotal": None,
        "tax_amount": None,
        "grand_total": None,
        "items": [],
    }
    if not text:
        return result

    # 1. UPI Payment URI (upi://pay?pa=...&pn=ShopName&am=720.30&tr=INV-2025-0892)
    if text.lower().startswith("upi://"):
        result["format"] = "upi_uri"
        parsed_url = urllib.parse.urlparse(text)
        params = urllib.parse.parse_qs(parsed_url.query)
        pn = params.get("pn", [None])[0]
        am = params.get("am", [None])[0]
        tr = params.get("tr", params.get("tn", [None]))[0]
        if pn:
            result["shop_name"] = urllib.parse.unquote(pn).strip()
        if tr:
            result["invoice_number"] = urllib.parse.unquote(tr).strip()
        if am:
            try:
                amt = round(float(am), 2)
                result["grand_total"] = amt
                result["subtotal"] = amt
                result["tax_amount"] = 0.0
            except ValueError:
                pass
        return result

    # 2. JSON Receipt / GST e-Invoice Payload
    if text.startswith("{") and text.endswith("}"):
        try:
            data = json.loads(text)
            if isinstance(data, dict):
                result["format"] = "json_einvoice"
                result["shop_name"] = (
                    data.get("shop_name")
                    or data.get("shopName")
                    or data.get("seller_name")
                    or data.get("merchant")
                )
                result["invoice_number"] = (
                    data.get("invoice_number")
                    or data.get("invoiceNumber")
                    or data.get("inv_no")
                    or data.get("doc_no")
                )
                result["bill_date"] = (
                    data.get("bill_date")
                    or data.get("billDate")
                    or data.get("date")
                )
                if data.get("subtotal") is not None:
                    result["subtotal"] = float(data["subtotal"])
                if data.get("tax_amount") is not None or data.get("taxAmount") is not None:
                    result["tax_amount"] = float(data.get("tax_amount") or data.get("taxAmount") or 0)
                if data.get("grand_total") is not None or data.get("grandTotal") is not None or data.get("total") is not None:
                    result["grand_total"] = float(
                        data.get("grand_total") or data.get("grandTotal") or data.get("total") or 0
                    )
                if isinstance(data.get("items"), list):
                    result["items"] = data["items"]
                return result
        except Exception:
            pass

    # 3. Key-Value / Pipe / Line-Separated Receipt QR
    shop_match = re.search(r"(?:shop|merchant|seller|store)\s*[:=]\s*([^\n|;]+)", text, re.I)
    inv_match = re.search(r"(?:inv(?:oice)?|bill(?:\s*no)?|ref)\s*[:=]\s*([A-Za-z0-9\-\/]+)", text, re.I)
    date_match = re.search(r"\b(\d{4}-\d{2}-\d{2}|\d{2}[\/\-]\d{2}[\/\-]\d{4})\b", text)
    total_match = re.search(r"(?:total|amount|amt)\s*[:=]\s*(?:Rs\.?|INR|₹)?\s*(\d+(?:\.\d{1,2})?)", text, re.I)

    if shop_match:
        result["shop_name"] = shop_match.group(1).strip()
    if inv_match:
        result["invoice_number"] = inv_match.group(1).strip()
    if date_match:
        raw_d = date_match.group(1)
        if "/" in raw_d or (raw_d.count("-") == 2 and len(raw_d.split("-")[0]) == 2):
            parts = re.split(r"[\/\-]", raw_d)
            result["bill_date"] = f"{parts[2]}-{parts[1]}-{parts[0]}"
        else:
            result["bill_date"] = raw_d
    if total_match:
        result["grand_total"] = round(float(total_match.group(1)), 2)

    return result


def decode_qr_from_image_bytes(image_bytes: bytes) -> Dict[str, Any]:
    """
    Decode QR code from raw image bytes using OpenCV's built-in QRCodeDetector
    and parse extracted receipt/invoice fields.
    """
    arr = np.frombuffer(image_bytes, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Unable to decode image frame for QR scanning.")

    detector = cv2.QRCodeDetector()
    decoded_text, points, _ = detector.detectAndDecode(img)

    # Fallback: try grayscale + Otsu threshold if initial pass didn't catch low-contrast QR
    if not decoded_text:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        decoded_text, points, _ = detector.detectAndDecode(thresh)

    if not decoded_text:
        return {
            "detected": False,
            "message": "No QR code detected in the frame.",
            "parsed": None,
        }

    parsed = parse_receipt_qr_payload(decoded_text)
    return {
        "detected": True,
        "message": "QR code decoded successfully.",
        "parsed": parsed,
    }

