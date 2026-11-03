"""
Scan2SQL — FastAPI Main Application (Complete Phases 1–5)
Intelligent Document Scanner & Automated SQL Data Extraction System
Features:
- Phase 1: PostgreSQL + SQLAlchemy 2.0 normalized 3NF schema (documents, bills, bill_items)
- Phase 2: Safe file uploads (JPG, JPEG, PNG, PDF) + OpenCV preprocessing pipeline
- Phase 3: English + Hindi Tesseract OCR, PyMuPDF direct text extraction & Document Classification
- Phase 4: Hybrid Bill Extraction (Python Regex Rules + Optional Ollama), Validation & SQL Save
- Phase 5: Dashboard Statistics, Search & Date Filtering, Confirmation Deletion,
           OpenPyXL Multi-Sheet Excel Export (.xlsx), and TXT Export (.txt)
"""
from contextlib import asynccontextmanager
from datetime import date, datetime, time as dt_time
from decimal import Decimal
from typing import Dict, Any, List, Optional

from fastapi import FastAPI, Request, Depends, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from backend.config import settings, BASE_DIR
from backend.database import init_db, check_database_connection, get_db
from backend.models import Document, Bill, BillItem
from backend.schemas import (
    HealthCheckResponse,
    DocumentResponse,
    DocumentUploadResponse,
    OpenCVOptionsSchema,
    OCRResultSchema,
    OCROptionsSchema,
    DocumentTextUpdateSchema,
    BillExtractionRequestSchema,
    BillExtractionResultSchema,
    BillSaveRequestSchema,
    BillResponse,
    BillDetailResponseSchema,
    DocumentDetailResponseSchema,
    DashboardStatsResponseSchema,
    DeleteResponseSchema,
)
from backend.vision import (
    sanitize_filename,
    validate_upload_file,
    generate_storage_token,
    process_uploaded_document,
    decode_qr_from_image_bytes,
    parse_receipt_qr_payload,
)
from backend.ocr import extract_text_from_document
from backend.extractor import extract_bill_from_text
from backend.exporter import generate_bills_excel, generate_document_txt

TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"
ORIGINALS_DIR = settings.UPLOAD_DIR / "originals"
PROCESSED_DIR = settings.UPLOAD_DIR / "processed"

for directory in (TEMPLATES_DIR, STATIC_DIR, ORIGINALS_DIR, PROCESSED_DIR, settings.EXPORT_DIR):
    directory.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize PostgreSQL database tables on startup."""
    db_init_result = init_db()
    app.state.db_init_result = db_init_result
    yield


app = FastAPI(
    title="Scan2SQL — Intelligent Document Scanner & Automated SQL Data Extraction System",
    description=(
        "Complete Final-Year Engineering Project (Phases 1–5): OpenCV Preprocessing, "
        "English + Hindi Tesseract OCR, PyMuPDF, Hybrid Bill Extraction, PostgreSQL Storage, "
        "Dashboard Analytics, Search/Date Filters, and OpenPyXL Excel Export."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

templates = Jinja2Templates(directory=str(TEMPLATES_DIR))


@app.get("/", response_class=HTMLResponse, tags=["Frontend"])
async def index(request: Request):
    """Render the complete Scan2SQL Bootstrap 5 user interface."""
    db_status = check_database_connection()
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "app_name": settings.APP_NAME,
            "db_status": db_status,
            "phase": "Phase 5 — Complete Integrated Application",
        },
    )


@app.get("/api/health", response_model=HealthCheckResponse, tags=["System & Database"])
async def health_check() -> HealthCheckResponse:
    """Verify FastAPI status and live PostgreSQL connectivity."""
    init_db()
    db_info = check_database_connection()
    return HealthCheckResponse(
        app_name=settings.APP_NAME,
        phase="Phase 5: Complete Integrated Application",
        status="healthy" if db_info["connected"] else "database_unavailable",
        database_connected=db_info["connected"],
        database_name=db_info["database_name"],
        server_version=db_info["server_version"],
        tables_detected=db_info["tables_detected"],
        record_counts=db_info["record_counts"],
        error=db_info["error"],
    )


@app.get(
    "/api/dashboard/stats",
    response_model=DashboardStatsResponseSchema,
    tags=["Phase 5: Dashboard, Search & Export"],
)
async def get_dashboard_statistics(db: Session = Depends(get_db)) -> DashboardStatsResponseSchema:
    """
    Compute live dashboard statistics from PostgreSQL:
    - Total uploaded documents
    - Total processed documents (where extracted_text is non-empty)
    - Total bills
    - Total spending (SUM of bills.grand_total)
    - Recent 5 documents and recent 5 bills
    """
    total_uploaded = db.query(func.count(Document.id)).scalar() or 0
    total_processed = (
        db.query(func.count(Document.id))
        .filter(Document.extracted_text.isnot(None), Document.extracted_text != "")
        .scalar()
        or 0
    )
    total_bills = db.query(func.count(Bill.id)).scalar() or 0
    total_spending_raw = db.query(func.coalesce(func.sum(Bill.grand_total), 0)).scalar() or 0
    total_spending = Decimal(str(total_spending_raw)).quantize(Decimal("0.01"))

    recent_docs = (
        db.query(Document).order_by(Document.created_at.desc()).limit(5).all()
    )
    recent_bills = (
        db.query(Bill)
        .options(joinedload(Bill.items))
        .order_by(Bill.created_at.desc())
        .limit(5)
        .all()
    )

    return DashboardStatsResponseSchema(
        total_uploaded_documents=total_uploaded,
        total_processed_documents=total_processed,
        total_bills=total_bills,
        total_spending=total_spending,
        recent_documents=[DocumentResponse.model_validate(d) for d in recent_docs],
        recent_bills=[BillResponse.model_validate(b) for b in recent_bills],
    )


@app.post(
    "/api/documents/upload",
    response_model=DocumentUploadResponse,
    tags=["Phase 2, 3 & 4: Upload, OpenCV, OCR & Bill Draft"],
)
async def upload_preprocess_and_ocr_document(
    file: UploadFile = File(..., description="JPG, JPEG, PNG, or PDF file"),
    document_type: str = Form("auto", description="'auto', 'normal_document', or 'shop_bill'"),
    ocr_lang: str = Form("eng+hin", description="'eng+hin', 'eng', or 'hin'"),
    use_ollama: bool = Form(False, description="Use optional local Ollama model for bill parsing"),
    perspective_correction: bool = Form(True),
    rotation_correction: bool = Form(True),
    shadow_removal: bool = Form(True),
    denoise: bool = Form(True),
    threshold_mode: str = Form("adaptive"),
    db: Session = Depends(get_db),
) -> DocumentUploadResponse:
    """
    Validate file, preserve original in uploads/originals/, run OpenCV preprocessing,
    extract text via PyMuPDF / Tesseract (English + Hindi), classify document type,
    and prepare a validated structured bill draft.
    """
    content = await file.read()
    file_size = len(content)

    is_valid, error_msg, ext = validate_upload_file(
        file.filename or "", file.content_type, file_size
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    if threshold_mode not in ("adaptive", "otsu", "grayscale"):
        threshold_mode = "adaptive"

    if ocr_lang not in ("eng+hin", "eng", "hin"):
        ocr_lang = "eng+hin"

    safe_name = sanitize_filename(file.filename or f"upload.{ext}")
    token = generate_storage_token()
    stored_filename = f"{token}_{safe_name}"
    saved_original_path = ORIGINALS_DIR / stored_filename

    saved_original_path.write_bytes(content)

    cv_options = {
        "perspective_correction": perspective_correction,
        "rotation_correction": rotation_correction,
        "shadow_removal": shadow_removal,
        "denoise": denoise,
        "threshold_mode": threshold_mode,
    }

    try:
        vision_result = process_uploaded_document(
            saved_original_path=saved_original_path,
            file_type=ext,
            file_token=token,
            options=cv_options,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"OpenCV image preprocessing failed: {str(exc)}",
        ) from exc

    try:
        ocr_data = extract_text_from_document(
            saved_original_path=saved_original_path,
            file_type=ext,
            file_token=token,
            lang=ocr_lang,
            psm=6,
        )
    except Exception as exc:
        ocr_data = {
            "extracted_text": "",
            "page_count": vision_result["page_count"],
            "pages_ocr": [],
            "classification": {
                "detected_type": (
                    document_type
                    if document_type in ("normal_document", "shop_bill")
                    else "normal_document"
                ),
                "confidence": 0.0,
                "score_points": 0,
                "matched_signals": [str(exc)],
            },
            "total_characters": 0,
            "total_words": 0,
            "processing_time_ms": 0.0,
            "warnings": [str(exc)],
        }

    detected_doc_type = ocr_data["classification"]["detected_type"]
    final_doc_type = (
        detected_doc_type
        if document_type == "auto"
        else (
            document_type
            if document_type in ("normal_document", "shop_bill")
            else detected_doc_type
        )
    )

    db_doc = Document(
        filename=stored_filename,
        file_type=ext,
        document_type=final_doc_type,
        extracted_text=ocr_data["extracted_text"],
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)

    bill_draft_dict = extract_bill_from_text(
        ocr_text=ocr_data["extracted_text"],
        use_ollama=use_ollama,
    )

    return DocumentUploadResponse(
        document=DocumentResponse.model_validate(db_doc),
        file_size_bytes=file_size,
        stored_original_filename=stored_filename,
        page_count=vision_result["page_count"],
        pages=vision_result["pages"],
        ocr_result=OCRResultSchema.model_validate(ocr_data),
        bill_draft=BillExtractionResultSchema.model_validate(bill_draft_dict),
    )


@app.post(
    "/api/documents/{document_id}/reprocess",
    response_model=DocumentUploadResponse,
    tags=["Phase 2, 3 & 4: Upload, OpenCV, OCR & Bill Draft"],
)
async def reprocess_existing_document(
    document_id: int,
    options: OpenCVOptionsSchema,
    ocr_lang: str = "eng+hin",
    use_ollama: bool = False,
    db: Session = Depends(get_db),
) -> DocumentUploadResponse:
    """Re-run OpenCV, OCR, Classification, and Bill Extraction on a preserved original file."""
    db_doc = db.query(Document).filter(Document.id == document_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail=f"Document #{document_id} not found.")

    saved_original_path = ORIGINALS_DIR / db_doc.filename
    if not saved_original_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Original file '{db_doc.filename}' not found on disk.",
        )

    token = db_doc.filename.split("_", 1)[0]
    try:
        vision_result = process_uploaded_document(
            saved_original_path=saved_original_path,
            file_type=db_doc.file_type,
            file_token=token,
            options=options.model_dump(),
        )
        ocr_data = extract_text_from_document(
            saved_original_path=saved_original_path,
            file_type=db_doc.file_type,
            file_token=token,
            lang=ocr_lang if ocr_lang in ("eng+hin", "eng", "hin") else "eng+hin",
            psm=6,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to reprocess document: {str(exc)}",
        ) from exc

    db_doc.extracted_text = ocr_data["extracted_text"]
    db_doc.document_type = ocr_data["classification"]["detected_type"]
    db.commit()
    db.refresh(db_doc)

    bill_draft_dict = extract_bill_from_text(
        ocr_text=ocr_data["extracted_text"],
        use_ollama=use_ollama,
    )

    return DocumentUploadResponse(
        document=DocumentResponse.model_validate(db_doc),
        file_size_bytes=saved_original_path.stat().st_size,
        stored_original_filename=db_doc.filename,
        page_count=vision_result["page_count"],
        pages=vision_result["pages"],
        ocr_result=OCRResultSchema.model_validate(ocr_data),
        bill_draft=BillExtractionResultSchema.model_validate(bill_draft_dict),
    )


@app.post(
    "/api/documents/{document_id}/ocr",
    response_model=OCRResultSchema,
    tags=["Phase 3: OCR & Classification"],
)
async def rerun_document_ocr(
    document_id: int,
    options: OCROptionsSchema,
    db: Session = Depends(get_db),
) -> OCRResultSchema:
    """Re-run OCR and Document Classification on an existing document."""
    db_doc = db.query(Document).filter(Document.id == document_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail=f"Document #{document_id} not found.")

    saved_original_path = ORIGINALS_DIR / db_doc.filename
    if not saved_original_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Original file '{db_doc.filename}' not found on disk.",
        )

    token = db_doc.filename.split("_", 1)[0]
    try:
        ocr_data = extract_text_from_document(
            saved_original_path=saved_original_path,
            file_type=db_doc.file_type,
            file_token=token,
            lang=options.lang,
            psm=options.psm,
        )
    except Exception as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    db_doc.extracted_text = ocr_data["extracted_text"]
    db_doc.document_type = ocr_data["classification"]["detected_type"]
    db.commit()

    return OCRResultSchema.model_validate(ocr_data)


@app.put(
    "/api/documents/{document_id}/text",
    response_model=DocumentResponse,
    tags=["Phase 3: OCR & Classification"],
)
async def update_extracted_text(
    document_id: int,
    payload: DocumentTextUpdateSchema,
    db: Session = Depends(get_db),
) -> DocumentResponse:
    """Save user-edited OCR text and confirmed document classification to PostgreSQL."""
    db_doc = db.query(Document).filter(Document.id == document_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail=f"Document #{document_id} not found.")

    db_doc.extracted_text = payload.extracted_text
    db_doc.document_type = payload.document_type
    db.commit()
    db.refresh(db_doc)
    return DocumentResponse.model_validate(db_doc)


@app.post(
    "/api/documents/{document_id}/extract-bill",
    response_model=BillExtractionResultSchema,
    tags=["Phase 4: Hybrid Bill Extraction & SQL Storage"],
)
async def extract_structured_bill_fields(
    document_id: int,
    payload: BillExtractionRequestSchema,
    db: Session = Depends(get_db),
) -> BillExtractionResultSchema:
    """Run Hybrid Bill Extraction on the document's OCR text and return validated draft."""
    db_doc = db.query(Document).filter(Document.id == document_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail=f"Document #{document_id} not found.")

    source_text = (
        payload.ocr_text if payload.ocr_text is not None else (db_doc.extracted_text or "")
    )
    if payload.ocr_text is not None and payload.ocr_text != db_doc.extracted_text:
        db_doc.extracted_text = payload.ocr_text
        db.commit()

    extracted = extract_bill_from_text(
        ocr_text=source_text,
        use_ollama=payload.use_ollama,
    )
    return BillExtractionResultSchema.model_validate(extracted)


@app.post(
    "/api/bills",
    response_model=BillResponse,
    tags=["Phase 4: Hybrid Bill Extraction & SQL Storage"],
)
async def save_approved_bill_to_sql(
    payload: BillSaveRequestSchema,
    db: Session = Depends(get_db),
) -> BillResponse:
    """Save user-approved shop bill header fields and line items into PostgreSQL."""
    db_doc = db.query(Document).filter(Document.id == payload.document_id).first()
    if not db_doc:
        raise HTTPException(
            status_code=404,
            detail=f"Parent Document #{payload.document_id} not found in PostgreSQL.",
        )

    db_doc.document_type = "shop_bill"
    if payload.extracted_text is not None:
        db_doc.extracted_text = payload.extracted_text

    existing_bill: Optional[Bill] = (
        db.query(Bill).filter(Bill.document_id == payload.document_id).first()
    )

    if existing_bill:
        existing_bill.shop_name = payload.shop_name
        existing_bill.invoice_number = payload.invoice_number
        existing_bill.bill_date = payload.bill_date
        existing_bill.subtotal = payload.subtotal
        existing_bill.tax_amount = payload.tax_amount
        existing_bill.grand_total = payload.grand_total
        existing_bill.items.clear()
        db.flush()
        for item in payload.items:
            existing_bill.items.append(
                BillItem(
                    item_name=item.item_name,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    total_price=item.total_price,
                )
            )
        target_bill = existing_bill
    else:
        new_bill = Bill(
            document_id=payload.document_id,
            shop_name=payload.shop_name,
            invoice_number=payload.invoice_number,
            bill_date=payload.bill_date,
            subtotal=payload.subtotal,
            tax_amount=payload.tax_amount,
            grand_total=payload.grand_total,
        )
        for item in payload.items:
            new_bill.items.append(
                BillItem(
                    item_name=item.item_name,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    total_price=item.total_price,
                )
            )
        db.add(new_bill)
        target_bill = new_bill

    db.commit()
    db.refresh(target_bill)
    return BillResponse.model_validate(target_bill)


@app.get(
    "/api/documents",
    response_model=List[DocumentResponse],
    tags=["Phase 5: Dashboard, Search & Export"],
)
async def list_documents(
    q: Optional[str] = Query(default=None, description="Search by filename or extracted text"),
    document_type: Optional[str] = Query(default=None, description="Filter by document_type"),
    start_date: Optional[date] = Query(default=None, description="Filter created_at >= start_date"),
    end_date: Optional[date] = Query(default=None, description="Filter created_at <= end_date"),
    db: Session = Depends(get_db),
) -> List[DocumentResponse]:
    """List documents with optional keyword search, type filter, and date range filter."""
    query = db.query(Document)

    if q and q.strip():
        pattern = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Document.filename.ilike(pattern),
                Document.extracted_text.ilike(pattern),
            )
        )

    if document_type and document_type in ("normal_document", "shop_bill"):
        query = query.filter(Document.document_type == document_type)

    if start_date:
        start_dt = datetime.combine(start_date, dt_time.min)
        query = query.filter(Document.created_at >= start_dt)

    if end_date:
        end_dt = datetime.combine(end_date, dt_time.max)
        query = query.filter(Document.created_at <= end_dt)

    docs = query.order_by(Document.created_at.desc()).limit(200).all()
    return [DocumentResponse.model_validate(d) for d in docs]


@app.get(
    "/api/bills",
    response_model=List[BillResponse],
    tags=["Phase 5: Dashboard, Search & Export"],
)
async def list_saved_bills(
    q: Optional[str] = Query(
        default=None, description="Search by shop name, invoice number, filename, or OCR text"
    ),
    start_date: Optional[date] = Query(default=None, description="Filter bill_date >= start_date"),
    end_date: Optional[date] = Query(default=None, description="Filter bill_date <= end_date"),
    db: Session = Depends(get_db),
) -> List[BillResponse]:
    """List saved shop bills with optional search and date filters."""
    query = db.query(Bill).join(Document, Bill.document_id == Document.id).options(joinedload(Bill.items))

    if q and q.strip():
        pattern = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Bill.shop_name.ilike(pattern),
                Bill.invoice_number.ilike(pattern),
                Document.filename.ilike(pattern),
                Document.extracted_text.ilike(pattern),
            )
        )

    if start_date:
        query = query.filter(Bill.bill_date >= start_date)

    if end_date:
        query = query.filter(Bill.bill_date <= end_date)

    bills = query.order_by(Bill.created_at.desc()).limit(200).all()
    return [BillResponse.model_validate(b) for b in bills]


@app.get(
    "/api/bills/{bill_id}",
    response_model=BillDetailResponseSchema,
    tags=["Phase 4: Hybrid Bill Extraction & SQL Storage"],
)
async def get_bill_detail(
    bill_id: int,
    db: Session = Depends(get_db),
) -> BillDetailResponseSchema:
    """Return complete Bill details, line items, and parent Document record."""
    bill = (
        db.query(Bill)
        .options(joinedload(Bill.items), joinedload(Bill.document))
        .filter(Bill.id == bill_id)
        .first()
    )
    if not bill:
        raise HTTPException(status_code=404, detail=f"Bill #{bill_id} not found.")

    return BillDetailResponseSchema(
        bill=BillResponse.model_validate(bill),
        document=DocumentResponse.model_validate(bill.document),
    )


@app.get(
    "/api/documents/{document_id}",
    response_model=DocumentDetailResponseSchema,
    tags=["Phase 4: Hybrid Bill Extraction & SQL Storage"],
)
async def get_document_detail(
    document_id: int,
    db: Session = Depends(get_db),
) -> DocumentDetailResponseSchema:
    """Return complete Document record and any linked Bill + BillItem records."""
    doc = (
        db.query(Document)
        .options(joinedload(Document.bills).joinedload(Bill.items))
        .filter(Document.id == document_id)
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document #{document_id} not found.")

    return DocumentDetailResponseSchema(
        document=DocumentResponse.model_validate(doc),
        bills=[BillResponse.model_validate(b) for b in doc.bills],
    )


@app.delete(
    "/api/documents/{document_id}",
    response_model=DeleteResponseSchema,
    tags=["Phase 5: Dashboard, Search & Export"],
)
async def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
) -> DeleteResponseSchema:
    """
    Delete a document and cascade-delete any linked bills and bill_items in PostgreSQL.
    Also removes stored original and processed preview files from disk if present.
    """
    db_doc = db.query(Document).filter(Document.id == document_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail=f"Document #{document_id} not found.")

    stored_filename = db_doc.filename
    token = stored_filename.split("_", 1)[0]

    db.delete(db_doc)
    db.commit()

    # Clean up stored files safely
    orig_file = ORIGINALS_DIR / stored_filename
    if orig_file.exists():
        orig_file.unlink(missing_ok=True)
    for proc_file in PROCESSED_DIR.glob(f"{token}_*"):
        proc_file.unlink(missing_ok=True)

    return DeleteResponseSchema(
        deleted_id=document_id,
        entity="document",
        message=f"Document #{document_id} ({stored_filename}) and any linked bills were deleted.",
    )


@app.delete(
    "/api/bills/{bill_id}",
    response_model=DeleteResponseSchema,
    tags=["Phase 5: Dashboard, Search & Export"],
)
async def delete_bill(
    bill_id: int,
    db: Session = Depends(get_db),
) -> DeleteResponseSchema:
    """Delete a shop bill and cascade-delete its bill_items in PostgreSQL."""
    db_bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not db_bill:
        raise HTTPException(status_code=404, detail=f"Bill #{bill_id} not found.")

    shop_label = db_bill.shop_name or f"Bill #{bill_id}"
    db.delete(db_bill)
    db.commit()

    return DeleteResponseSchema(
        deleted_id=bill_id,
        entity="bill",
        message=f"Bill #{bill_id} ({shop_label}) and its line items were deleted.",
    )


@app.get(
    "/api/export/bills/excel",
    tags=["Phase 5: Dashboard, Search & Export"],
)
async def export_bills_to_excel(
    q: Optional[str] = Query(default=None),
    start_date: Optional[date] = Query(default=None),
    end_date: Optional[date] = Query(default=None),
    db: Session = Depends(get_db),
) -> FileResponse:
    """
    Export all (or filtered) bill records and their corresponding bill items to a
    multi-sheet Microsoft Excel (.xlsx) workbook using OpenPyXL.
    """
    query = (
        db.query(Bill)
        .join(Document, Bill.document_id == Document.id)
        .options(joinedload(Bill.items), joinedload(Bill.document))
    )

    if q and q.strip():
        pattern = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Bill.shop_name.ilike(pattern),
                Bill.invoice_number.ilike(pattern),
                Document.filename.ilike(pattern),
                Document.extracted_text.ilike(pattern),
            )
        )
    if start_date:
        query = query.filter(Bill.bill_date >= start_date)
    if end_date:
        query = query.filter(Bill.bill_date <= end_date)

    bills = query.order_by(Bill.created_at.desc()).all()
    excel_path = generate_bills_excel(bills, filename_prefix="scan2sql_bills_export")

    return FileResponse(
        path=str(excel_path),
        filename=excel_path.name,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


@app.get(
    "/api/export/bills/{bill_id}/excel",
    tags=["Phase 5: Dashboard, Search & Export"],
)
async def export_single_bill_to_excel(
    bill_id: int,
    db: Session = Depends(get_db),
) -> FileResponse:
    """Export a single shop bill and its line items to an Excel (.xlsx) file."""
    bill = (
        db.query(Bill)
        .options(joinedload(Bill.items), joinedload(Bill.document))
        .filter(Bill.id == bill_id)
        .first()
    )
    if not bill:
        raise HTTPException(status_code=404, detail=f"Bill #{bill_id} not found.")

    prefix = f"scan2sql_bill_{bill.id}_{bill.shop_name or 'receipt'}"
    excel_path = generate_bills_excel([bill], filename_prefix=prefix)

    return FileResponse(
        path=str(excel_path),
        filename=excel_path.name,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


@app.get(
    "/api/documents/{document_id}/export-txt",
    tags=["Phase 5: Dashboard, Search & Export"],
)
async def export_document_text_file(
    document_id: int,
    db: Session = Depends(get_db),
) -> FileResponse:
    """Download a document's extracted text as a formatted .txt file."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document #{document_id} not found.")

    txt_path = generate_document_txt(doc)
    return FileResponse(
        path=str(txt_path),
        filename=txt_path.name,
        media_type="text/plain; charset=utf-8",
    )


@app.get("/api/schema", tags=["System & Database"])
async def get_database_schema(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Return normalized SQLAlchemy table definitions."""
    return {
        "normalized_tables": [
            {
                "table_name": "documents",
                "primary_key": "id (SERIAL PRIMARY KEY)",
                "columns": [
                    {"name": "id", "type": "INTEGER", "nullable": False, "notes": "Primary Key"},
                    {"name": "filename", "type": "VARCHAR(255)", "nullable": False, "notes": "Indexed"},
                    {"name": "file_type", "type": "VARCHAR(20)", "nullable": False, "notes": "jpg, jpeg, png, pdf"},
                    {"name": "document_type", "type": "VARCHAR(50)", "nullable": False, "notes": "normal_document | shop_bill"},
                    {"name": "extracted_text", "type": "TEXT", "nullable": True, "notes": "OCR output text"},
                    {"name": "created_at", "type": "TIMESTAMPTZ", "nullable": False, "notes": "DEFAULT NOW()"},
                ],
            },
            {
                "table_name": "bills",
                "primary_key": "id (SERIAL PRIMARY KEY)",
                "foreign_keys": ["document_id -> documents.id (ON DELETE CASCADE)"],
                "columns": [
                    {"name": "id", "type": "INTEGER", "nullable": False, "notes": "Primary Key"},
                    {"name": "document_id", "type": "INTEGER", "nullable": False, "notes": "FK -> documents.id"},
                    {"name": "shop_name", "type": "VARCHAR(255)", "nullable": True, "notes": "Indexed"},
                    {"name": "invoice_number", "type": "VARCHAR(100)", "nullable": True, "notes": "Indexed"},
                    {"name": "bill_date", "type": "DATE", "nullable": True, "notes": "Indexed"},
                    {"name": "subtotal", "type": "NUMERIC(12, 2)", "nullable": True, "notes": "Pre-tax amount"},
                    {"name": "tax_amount", "type": "NUMERIC(12, 2)", "nullable": True, "notes": "GST / VAT amount"},
                    {"name": "grand_total", "type": "NUMERIC(12, 2)", "nullable": True, "notes": "Final payable total"},
                    {"name": "created_at", "type": "TIMESTAMPTZ", "nullable": False, "notes": "DEFAULT NOW()"},
                ],
            },
            {
                "table_name": "bill_items",
                "primary_key": "id (SERIAL PRIMARY KEY)",
                "foreign_keys": ["bill_id -> bills.id (ON DELETE CASCADE)"],
                "columns": [
                    {"name": "id", "type": "INTEGER", "nullable": False, "notes": "Primary Key"},
                    {"name": "bill_id", "type": "INTEGER", "nullable": False, "notes": "FK -> bills.id"},
                    {"name": "item_name", "type": "VARCHAR(255)", "nullable": False, "notes": "Purchased item description"},
                    {"name": "quantity", "type": "NUMERIC(10, 3)", "nullable": False, "notes": "Default 1.000"},
                    {"name": "unit_price", "type": "NUMERIC(12, 2)", "nullable": False, "notes": "Price per unit"},
                    {"name": "total_price", "type": "NUMERIC(12, 2)", "nullable": False, "notes": "quantity * unit_price"},
                ],
            },
        ]
    }


@app.post("/api/scan-qr", tags=["QR Code Receipt Scanner"])
async def scan_receipt_qr_code(
    file: Optional[UploadFile] = File(None),
    raw_qr: Optional[str] = Form(None),
) -> Dict[str, Any]:
    """
    Decode a QR code from a captured webcam frame / image upload (using OpenCV QRCodeDetector)
    or parse a raw QR payload string to pre-fill structured bill fields.
    """
    if raw_qr and raw_qr.strip():
        parsed = parse_receipt_qr_payload(raw_qr.strip())
        return {
            "detected": True,
            "message": "QR payload parsed successfully.",
            "parsed": parsed,
        }

    if file is None:
        raise HTTPException(status_code=400, detail="Provide either an image file frame or raw_qr payload.")

    image_bytes = await file.read()
    try:
        return decode_qr_from_image_bytes(image_bytes)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

