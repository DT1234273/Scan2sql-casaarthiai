"""
Scan2SQL — Phase 5: Excel (.xlsx) & Text (.txt) Export Module
Uses OpenPyXL to generate multi-sheet Excel workbooks containing:
- Sheet 1 ("Bills Summary"): All bill headers and financial totals (Subtotal, Tax/GST, Grand Total).
- Sheet 2 ("Bill Line Items"): Every extracted bill item joined with its parent bill's
  Shop Name, Invoice Number, and Bill Date.
"""
import re
from datetime import datetime
from decimal import Decimal
from pathlib import Path
from typing import List

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

from backend.config import settings
from backend.models import Bill, Document


def clean_export_filename(raw_name: str, suffix: str) -> str:
    """Create a clean, timestamped Windows-safe filename for exported files."""
    stem = Path(raw_name).stem if raw_name else "scan2sql"
    safe_stem = re.sub(r"[^A-Za-z0-9_-]", "_", stem).strip("_") or "scan2sql"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{safe_stem}_{timestamp}{suffix}"


def _auto_fit_columns(ws) -> None:
    """Auto-adjust worksheet column widths for clean readability in Microsoft Excel."""
    for col in ws.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            val_str = str(cell.value or "")
            if len(val_str) > max_len:
                max_len = len(val_str)
        ws.column_dimensions[col_letter].width = min(max(max_len + 4, 12), 48)


def generate_bills_excel(bills: List[Bill], filename_prefix: str = "scan2sql_bills_report") -> Path:
    """
    Build a formatted 2-sheet Excel (.xlsx) workbook using OpenPyXL:
      1. Bills Summary
      2. Bill Line Items (with corresponding Bill Details)
    Saves the file inside exports/ and returns its Path.
    """
    settings.EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    export_filename = clean_export_filename(filename_prefix, ".xlsx")
    export_path = settings.EXPORT_DIR / export_filename

    wb = Workbook()

    # Styling definitions
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
    total_font = Font(name="Calibri", size=11, bold=True, color="0F172A")
    total_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
    thin_border = Border(
        left=Side(style="thin", color="CBD5E1"),
        right=Side(style="thin", color="CBD5E1"),
        top=Side(style="thin", color="CBD5E1"),
        bottom=Side(style="thin", color="CBD5E1"),
    )

    # ========================================================================
    # SHEET 1: Bills Summary
    # ========================================================================
    ws_summary = wb.active
    ws_summary.title = "Bills Summary"

    summary_headers = [
        "Bill ID",
        "Document ID",
        "Source Filename",
        "Shop Name",
        "Invoice Number",
        "Bill Date",
        "Line Items Count",
        "Subtotal (Rs.)",
        "Tax / GST (Rs.)",
        "Grand Total (Rs.)",
        "Saved Timestamp",
    ]
    ws_summary.append(summary_headers)

    for col_idx in range(1, len(summary_headers) + 1):
        cell = ws_summary.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = thin_border

    total_subtotal = Decimal("0.00")
    total_tax = Decimal("0.00")
    total_grand = Decimal("0.00")

    for bill in bills:
        sub_val = Decimal(str(bill.subtotal or "0.00"))
        tax_val = Decimal(str(bill.tax_amount or "0.00"))
        grand_val = Decimal(str(bill.grand_total or "0.00"))

        total_subtotal += sub_val
        total_tax += tax_val
        total_grand += grand_val

        source_filename = bill.document.filename if bill.document else f"doc_{bill.document_id}"
        row_values = [
            bill.id,
            bill.document_id,
            source_filename,
            bill.shop_name or "—",
            bill.invoice_number or "—",
            bill.bill_date.isoformat() if bill.bill_date else "—",
            len(bill.items or []),
            float(sub_val),
            float(tax_val),
            float(grand_val),
            bill.created_at.strftime("%Y-%m-%d %H:%M:%S") if bill.created_at else "—",
        ]
        ws_summary.append(row_values)

        curr_row = ws_summary.max_row
        for c_idx in range(1, len(summary_headers) + 1):
            c = ws_summary.cell(row=curr_row, column=c_idx)
            c.border = thin_border
            if c_idx in (8, 9, 10):
                c.number_format = "#,##0.00"
                c.alignment = Alignment(horizontal="right")

    # Summary Footer Row
    if bills:
        ws_summary.append(
            [
                "TOTAL",
                "",
                "",
                f"{len(bills)} Bill(s)",
                "",
                "",
                sum(len(b.items or []) for b in bills),
                float(total_subtotal),
                float(total_tax),
                float(total_grand),
                "",
            ]
        )
        footer_row = ws_summary.max_row
        for c_idx in range(1, len(summary_headers) + 1):
            c = ws_summary.cell(row=footer_row, column=c_idx)
            c.font = total_font
            c.fill = total_fill
            c.border = thin_border
            if c_idx in (8, 9, 10):
                c.number_format = "#,##0.00"
                c.alignment = Alignment(horizontal="right")

    _auto_fit_columns(ws_summary)

    # ========================================================================
    # SHEET 2: Bill Line Items (Joined with Corresponding Bill Details)
    # ========================================================================
    ws_items = wb.create_sheet(title="Bill Line Items")

    item_headers = [
        "Item ID",
        "Bill ID",
        "Shop Name",
        "Invoice Number",
        "Bill Date",
        "Item Name",
        "Quantity",
        "Unit Price (Rs.)",
        "Line Total (Rs.)",
        "Bill Grand Total (Rs.)",
    ]
    ws_items.append(item_headers)

    for col_idx in range(1, len(item_headers) + 1):
        cell = ws_items.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = thin_border

    for bill in bills:
        bill_date_str = bill.bill_date.isoformat() if bill.bill_date else "—"
        bill_grand_float = float(Decimal(str(bill.grand_total or "0.00")))
        for item in bill.items or []:
            ws_items.append(
                [
                    item.id,
                    bill.id,
                    bill.shop_name or "—",
                    bill.invoice_number or "—",
                    bill_date_str,
                    item.item_name,
                    float(Decimal(str(item.quantity or "1.000"))),
                    float(Decimal(str(item.unit_price or "0.00"))),
                    float(Decimal(str(item.total_price or "0.00"))),
                    bill_grand_float,
                ]
            )
            curr_row = ws_items.max_row
            for c_idx in range(1, len(item_headers) + 1):
                c = ws_items.cell(row=curr_row, column=c_idx)
                c.border = thin_border
                if c_idx in (8, 9, 10):
                    c.number_format = "#,##0.00"
                    c.alignment = Alignment(horizontal="right")
                elif c_idx == 7:
                    c.number_format = "0.000"
                    c.alignment = Alignment(horizontal="right")

    _auto_fit_columns(ws_items)

    wb.save(str(export_path))
    return export_path


def generate_document_txt(document: Document) -> Path:
    """
    Save a document's extracted OCR text into a properly named .txt file in exports/.
    """
    settings.EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    export_filename = clean_export_filename(document.filename, "_extracted.txt")
    export_path = settings.EXPORT_DIR / export_filename

    header = (
        f"Scan2SQL — Extracted Document Text\n"
        f"Document ID   : #{document.id}\n"
        f"Source File   : {document.filename}\n"
        f"Document Type : {document.document_type}\n"
        f"Exported At   : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        f"{'=' * 64}\n\n"
    )
    export_path.write_text(header + (document.extracted_text or ""), encoding="utf-8")
    return export_path
