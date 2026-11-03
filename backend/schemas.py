"""
Scan2SQL — Pydantic v2 Schemas for Request Validation and API Responses (Complete Phases 1–5)
"""
from datetime import datetime, date
from decimal import Decimal
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


# ============================================================================
# Document Schemas
# ============================================================================
class DocumentBase(BaseModel):
    filename: str = Field(..., max_length=255, description="Original uploaded file name")
    file_type: str = Field(..., max_length=20, description="File extension: jpg, jpeg, png, pdf")
    document_type: str = Field(
        default="normal_document",
        description="Workflow type: 'normal_document' or 'shop_bill'",
    )
    extracted_text: Optional[str] = Field(
        default=None, description="Extracted and user-verified OCR text"
    )


class DocumentCreate(DocumentBase):
    pass


class DocumentResponse(DocumentBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Phase 2: Computer Vision & Upload Schemas
# ============================================================================
class OpenCVOptionsSchema(BaseModel):
    perspective_correction: bool = Field(
        default=True, description="Detect document boundary and apply 4-point warp"
    )
    rotation_correction: bool = Field(
        default=True, description="Detect text skew angle and deskew"
    )
    shadow_removal: bool = Field(
        default=True, description="Remove uneven lighting and shadows via background estimation"
    )
    denoise: bool = Field(
        default=True, description="Apply Fast Non-Local Means noise reduction"
    )
    threshold_mode: str = Field(
        default="adaptive",
        pattern="^(adaptive|otsu|grayscale)$",
        description="Thresholding mode: 'adaptive', 'otsu', or 'grayscale'",
    )


class PagePreviewSchema(BaseModel):
    page_number: int
    original_preview_url: str
    processed_preview_url: str
    cv_metrics: Dict[str, Any]


# ============================================================================
# Phase 3: OCR & Document Classification Schemas
# ============================================================================
class DocumentClassificationSchema(BaseModel):
    detected_type: str = Field(
        ..., description="Detected document type: 'normal_document' or 'shop_bill'"
    )
    confidence: float = Field(..., ge=0.0, le=1.0)
    score_points: int = Field(default=0)
    matched_signals: List[str] = Field(default_factory=list)


class PageOCRResultSchema(BaseModel):
    page_number: int
    extraction_method: str = Field(
        ..., description="'pymupdf_direct' or 'tesseract_ocr'"
    )
    language_used: str
    character_count: int
    word_count: int
    text: str


class OCRResultSchema(BaseModel):
    extracted_text: str
    page_count: int
    pages_ocr: List[PageOCRResultSchema] = Field(default_factory=list)
    classification: DocumentClassificationSchema
    total_characters: int
    total_words: int
    processing_time_ms: float
    warnings: List[str] = Field(default_factory=list)


class OCROptionsSchema(BaseModel):
    lang: str = Field(
        default="eng+hin",
        pattern="^(eng\\+hin|eng|hin)$",
        description="Tesseract OCR language: 'eng+hin', 'eng', or 'hin'",
    )
    psm: int = Field(
        default=6,
        ge=3,
        le=13,
        description="Tesseract Page Segmentation Mode (default 6: uniform block of text)",
    )


class DocumentTextUpdateSchema(BaseModel):
    extracted_text: str = Field(..., description="User-edited and verified OCR text")
    document_type: str = Field(
        default="normal_document",
        pattern="^(normal_document|shop_bill)$",
        description="Confirmed document type ('normal_document' or 'shop_bill')",
    )


# ============================================================================
# Phase 4: Hybrid Bill Extraction & SQL Storage Schemas
# ============================================================================
class BillItemBase(BaseModel):
    item_name: str = Field(..., min_length=1, max_length=255)
    quantity: Decimal = Field(default=Decimal("1.000"), ge=Decimal("0"))
    unit_price: Decimal = Field(default=Decimal("0.00"), ge=Decimal("0"))
    total_price: Decimal = Field(default=Decimal("0.00"), ge=Decimal("0"))


class BillItemCreate(BillItemBase):
    pass


class BillItemResponse(BillItemBase):
    id: int
    bill_id: int

    model_config = ConfigDict(from_attributes=True)


class BillValidationSchema(BaseModel):
    is_valid: bool
    calculated_items_sum: Optional[Decimal] = None
    calculated_grand_total: Optional[Decimal] = None
    checks_passed: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)


class BillExtractionRequestSchema(BaseModel):
    ocr_text: Optional[str] = Field(
        default=None,
        description="Optional override OCR text to parse; uses document.extracted_text if omitted",
    )
    use_ollama: bool = Field(
        default=False,
        description="Whether to invoke optional local Ollama model for ambiguous fields",
    )


class BillExtractionResultSchema(BaseModel):
    extraction_method: str
    ollama_attempted: bool = False
    ollama_used: bool = False
    shop_name: Optional[str] = None
    invoice_number: Optional[str] = None
    bill_date: Optional[date] = None
    subtotal: Optional[Decimal] = None
    tax_amount: Optional[Decimal] = None
    grand_total: Optional[Decimal] = None
    items: List[BillItemCreate] = Field(default_factory=list)
    validation: BillValidationSchema


class BillBase(BaseModel):
    shop_name: Optional[str] = Field(default=None, max_length=255)
    invoice_number: Optional[str] = Field(default=None, max_length=100)
    bill_date: Optional[date] = Field(default=None)
    subtotal: Optional[Decimal] = Field(default=None, ge=Decimal("0"))
    tax_amount: Optional[Decimal] = Field(default=None, ge=Decimal("0"))
    grand_total: Optional[Decimal] = Field(default=None, ge=Decimal("0"))


class BillSaveRequestSchema(BillBase):
    document_id: int
    extracted_text: Optional[str] = Field(
        default=None, description="Updated OCR text to persist alongside the bill"
    )
    items: List[BillItemCreate] = Field(default_factory=list)


class BillResponse(BillBase):
    id: int
    document_id: int
    created_at: datetime
    items: List[BillItemResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class BillDetailResponseSchema(BaseModel):
    bill: BillResponse
    document: DocumentResponse


class DocumentDetailResponseSchema(BaseModel):
    document: DocumentResponse
    bills: List[BillResponse] = Field(default_factory=list)


class DocumentUploadResponse(BaseModel):
    document: DocumentResponse
    file_size_bytes: int
    stored_original_filename: str
    page_count: int
    pages: List[PagePreviewSchema]
    ocr_result: Optional[OCRResultSchema] = None
    bill_draft: Optional[BillExtractionResultSchema] = None


# ============================================================================
# Phase 5: Dashboard Statistics, Search, Deletion & Export Schemas
# ============================================================================
class DashboardStatsResponseSchema(BaseModel):
    total_uploaded_documents: int
    total_processed_documents: int
    total_bills: int
    total_spending: Decimal
    recent_documents: List[DocumentResponse] = Field(default_factory=list)
    recent_bills: List[BillResponse] = Field(default_factory=list)


class DeleteResponseSchema(BaseModel):
    deleted_id: int
    entity: str
    message: str


# ============================================================================
# System & Database Health Schema
# ============================================================================
class HealthCheckResponse(BaseModel):
    app_name: str
    phase: str
    status: str
    database_connected: bool
    database_name: Optional[str] = None
    server_version: Optional[str] = None
    tables_detected: List[str] = Field(default_factory=list)
    record_counts: Dict[str, int] = Field(default_factory=dict)
    error: Optional[str] = None
