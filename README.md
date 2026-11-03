# Scan2SQL — Intelligent Document Scanner & Automated SQL Data Extraction System

**Complete Final-Year Engineering Project (All 5 Phases Integrated)**  
Built with **Python 3.11+**, **FastAPI**, **SQLAlchemy 2.0**, **PostgreSQL**, **OpenCV**, **Tesseract OCR (English + Hindi)**, **PyMuPDF**, **OpenPyXL**, and **Bootstrap 5**.

---

## 1. Project Overview & Core Workflows

**Scan2SQL** converts scanned documents, camera photos, multi-page PDFs, and shop receipts/invoices into clean editable text and normalized PostgreSQL records:

- **Workflow A — Normal Document Processing**:
  1. Upload a book page, handwritten/printed notes, document scan (`.jpg`, `.jpeg`, `.png`), or `.pdf`.
  2. Automatically improve image quality using OpenCV (`backend/vision.py`): document boundary detection & 4-point perspective warp, rotation/skew correction, grayscale conversion, shadow reduction via morphological background estimation + CLAHE, Fast Non-Local Means denoising, and adaptive Gaussian thresholding.
  3. Extract text in **English + Hindi (`eng+hin`)** using PyMuPDF direct text extraction for digital PDF pages and Tesseract OCR for scanned pages (`backend/ocr.py`).
  4. Review/edit extracted text, copy to clipboard, download as `.txt`, and save to the PostgreSQL `documents` table.

- **Workflow B — Shop Bill / Invoice Processing to SQL**:
  1. Upload a retail shop receipt or GST invoice image/PDF.
  2. Automatic Document Classifier (`classify_document_text`) identifies the upload as a `shop_bill` using bilingual lexical and structural signals.
  3. Hybrid Bill Extractor (`backend/extractor.py`) parses `shop_name`, `invoice_number`, `bill_date`, itemized rows (`item_name`, `quantity`, `unit_price`, `total_price`), `subtotal`, `tax_amount` (CGST/SGST/IGST/VAT), and `grand_total` using Python regex rules (with optional local AI fallback via Ollama on `http://localhost:11434`).
  4. Mathematical Validator checks `Qty × Unit Price = Line Total`, `Sum(Items) = Subtotal`, and `Subtotal + Tax = Grand Total`.
  5. Review/correct extracted fields in an editable table, commit approved records into normalized PostgreSQL tables (`bills` and `bill_items`), filter/search history, and export multi-sheet reports to Microsoft Excel (`.xlsx`) via OpenPyXL (`backend/exporter.py`).

---

## 2. Complete Project Structure

```text
Scan2SQL/
├── backend/
│   ├── __init__.py          # Package marker
│   ├── config.py            # Environment settings & Windows local paths
│   ├── database.py          # SQLAlchemy 2.0 PostgreSQL engine, session & health checks
│   ├── models.py            # Normalized 3NF models: Document, Bill, BillItem
│   ├── schemas.py           # Pydantic v2 request/response validation schemas
│   ├── vision.py            # Phase 2: OpenCV preprocessing & PyMuPDF page rendering
│   ├── ocr.py               # Phase 3: Tesseract (eng+hin), PyMuPDF & Document Classifier
│   ├── extractor.py         # Phase 4: Hybrid Bill Extractor (Python rules + optional Ollama)
│   ├── exporter.py          # Phase 5: OpenPyXL multi-sheet Excel (.xlsx) & TXT exporter
│   └── main.py              # Complete FastAPI application & REST API routes
├── templates/
│   └── index.html           # Responsive Bootstrap 5 single-page application
├── static/
│   ├── css/
│   │   └── styles.css       # Custom CSS3 styles & tabular typography
│   └── js/
│       └── app.js           # Complete frontend controller (Phases 1–5)
├── uploads/                 # Auto-created storage for originals/ and processed/
├── exports/                 # Auto-created storage for generated .xlsx and .txt files
├── .env.example             # Sample Windows environment configuration
├── requirements.txt         # Compatible Python 3.11+ package dependencies
├── run.py                   # Local Windows startup script
└── README.md                # Windows setup & viva demonstration guide
```

---

## 3. Step-by-Step Windows 10 / 11 Local Installation Guide

### Step 1: Install Prerequisites on Windows

1. **Python 3.11 or 3.12 (64-bit)**
   - Download from [https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/)
   - Check **"Add python.exe to PATH"** during installation.

2. **PostgreSQL (Version 15, 16, or 17)**
   - Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
   - Keep port `5432` and note the password set for the `postgres` user.

3. **Tesseract OCR for Windows (with Hindi Language Data)**
   - Download the UB-Mannheim installer from [https://github.com/UB-Mannheim/tesseract/wiki](https://github.com/UB-Mannheim/tesseract/wiki)
   - During setup, expand **"Additional language data"** and select **Hindi (`hin`)** so both `eng.traineddata` and `hin.traineddata` are installed in `C:\Program Files\Tesseract-OCR\tessdata`.

4. **Optional: Ollama for Local AI Fallback (Not Required)**
   - The application works 100% offline using Python regex rules without Ollama.
   - If you wish to test the optional local LLM fallback for unstructured bills, install Ollama from [https://ollama.com/download/windows](https://ollama.com/download/windows) and run `ollama pull llama3.2`.

---

### Step 2: Create the PostgreSQL Database

Open **pgAdmin 4** or **SQL Shell (psql)** and execute:

```sql
CREATE DATABASE scan2sql_db ENCODING 'UTF8';
```

Or from PowerShell / Command Prompt:

```powershell
psql -U postgres -c "CREATE DATABASE scan2sql_db ENCODING 'UTF8';"
```

---

### Step 3: Create Virtual Environment & Install Python Dependencies

Open **PowerShell** inside the `Scan2SQL` project folder:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

### Step 4: Configure `.env`

Copy `.env.example` to `.env` and update your PostgreSQL password:

```powershell
copy .env.example .env
```

```env
DATABASE_URL="postgresql+psycopg2://postgres:your_postgres_password@localhost:5432/scan2sql_db"
TESSERACT_CMD="C:\\Program Files\\Tesseract-OCR\\tesseract.exe"
DEFAULT_OCR_LANG="eng+hin"
USE_OLLAMA="False"
```

---

### Step 5: Run Scan2SQL Locally

```powershell
python run.py
```

Open **[http://127.0.0.1:8000](http://127.0.0.1:8000)** in your browser (or **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)** for Swagger UI).
