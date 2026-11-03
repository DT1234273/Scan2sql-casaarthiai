# Scan2SQL — Project Development Progress (`PROGRESS.md`)

**Project Name:** Scan2SQL — Intelligent Document Scanner & Automated SQL Data Extraction System  
**Target Environment:** Local Windows 10 / 11 PC (Python 3.11+, FastAPI, PostgreSQL, OpenCV, Tesseract OCR `eng+hin`, PyMuPDF, OpenPyXL, Bootstrap 5)

---

## Phase 1: Project Setup and Database Foundation
- **Status:** Implemented & Ready for Review
- **Created Files:**
  - `requirements.txt` — Pinned Python 3.11+ dependencies (`fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary`, `pydantic`, `opencv-python`, `numpy`, `pytesseract`, `PyMuPDF`, `openpyxl`, `httpx`, `python-dotenv`, `jinja2`).
  - `.env.example` — Environment configuration template (no hardcoded credentials) for `DATABASE_URL`, `TESSERACT_CMD`, `TESSERACT_LANG`, and optional `OLLAMA_ENABLED` / `OLLAMA_BASE_URL` / `OLLAMA_MODEL`.
  - `run.py` — Local Windows entry point launching Uvicorn on `http://127.0.0.1:8000`.
  - `backend/__init__.py` — Backend package initializer.
  - `backend/config.py` — Environment variable reader and automatic creation of `uploads/original`, `uploads/processed`, and `exports` directories.
  - `backend/database.py` — SQLAlchemy 2.0 engine, `SessionLocal`, `get_db()` dependency, and live PostgreSQL connectivity check (`check_db_connection()`).
  - `backend/models.py` — Normalized PostgreSQL tables (`documents`, `bills`, `bill_items`) with primary keys, foreign keys, `Numeric(12, 2)` financial columns, and `ON DELETE CASCADE`.

---

## Phase 2: Document Upload and Computer Vision
- **Status:** Implemented & Ready for Review
- **Created Files:**
  - `backend/vision.py` — OpenCV preprocessing pipeline:
    - Safe upload storage preserving the original file in `uploads/original/`.
    - PDF first-page preview rendering via PyMuPDF (`fitz`).
    - 4-point contour boundary detection and perspective warp (`cv2.getPerspectiveTransform`, `cv2.warpPerspective`).
    - Automatic rotation deskew (`cv2.minAreaRect`, `cv2.warpAffine`).
    - Morphological shadow reduction and CLAHE contrast enhancement.
    - Bilateral noise removal (`cv2.bilateralFilter`) and adaptive / Otsu thresholding (`cv2.adaptiveThreshold`, `cv2.threshold`).

---

## Phase 3: OCR and Document Classification
- **Status:** Implemented & Ready for Review
- **Created Files:**
  - `backend/ocr.py` — Multi-language OCR & Document Classifier:
    - Tesseract OCR integration supporting English and Hindi (`eng+hin`) with clear Windows error guidance if `tesseract.exe` or `hin.traineddata` is missing.
    - Multi-page PDF processing using PyMuPDF direct text extraction when embedded text is available, with automatic fallback to 300 DPI OpenCV + Tesseract OCR for scanned PDF pages.
    - Heuristic Document Classifier distinguishing `normal_document` vs. `shop_bill` with confidence scoring and matched signal reporting.

---

## Phase 4: Hybrid Bill Extraction and SQL Storage
- **Status:** Implemented & Ready for Review
- **Created Files:**
  - `backend/extractor.py` — Hybrid Bill Extraction Engine:
    - Deterministic Python regular expressions extracting `shop_name`, `invoice_number`, `bill_date`, itemized `bill_items` (`item_name`, `quantity`, `unit_price`, `total_price`), `subtotal`, `tax_amount`, and `grand_total`.
    - Optional local Ollama AI integration (`http://localhost:11434/api/generate`) for ambiguous bills (gracefully skipped when disabled or unreachable; never fabricates missing fields).
    - Mathematical consistency validation (`sum(items) == subtotal` and `subtotal + tax_amount == grand_total`).
    - User verification and correction workflow prior to saving records into PostgreSQL.

---

## Phase 5: Dashboard, Search, Export and Final Integration
- **Status:** Implemented & Ready for Review
- **Created / Updated Files:**
  - `backend/exporter.py` — OpenPyXL multi-sheet Excel generator (`Bills Summary` + `Bill Line Items` joined with parent bill details) and formatted `.txt` document exporter.
  - `backend/schemas.py` — Complete Pydantic v2 request/response validation schemas across all 5 phases.
  - `backend/main.py` — Complete FastAPI REST API (`GET /api/health`, `GET /api/dashboard/stats`, `POST /api/upload-and-preprocess`, `POST /api/extract-ocr`, `POST /api/extract-bill`, `POST /api/documents/save`, `POST /api/bills/save`, `GET/DELETE /api/documents`, `GET/DELETE /api/bills`, and Excel/TXT export endpoints).
  - `templates/index.html`, `static/css/styles.css`, `static/js/app.js` — Responsive Bootstrap 5 frontend with Dashboard KPIs, CV/OCR/Bill Workbench, Search & Date Range filters, Delete Confirmation modal, and Excel/TXT exports.
  - `README.md` — Complete local Windows CMD & PowerShell installation, configuration, and manual verification guide.
