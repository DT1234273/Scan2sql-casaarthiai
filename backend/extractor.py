"""
Scan2SQL — Phase 4: Hybrid Bill Extraction & Mathematical Validation Engine
Extraction Sequence:
1. Raw or user-edited OCR text input.
2. Deterministic Python Rule & Regular Expression Extraction:
   - Identifies shop_name, invoice_number, bill_date, line items (item_name, quantity,
     unit_price, total_price), subtotal, tax_amount (CGST/SGST/IGST/GST/VAT), and grand_total.
   - Never fabricates missing values (leaves missing fields as None).
3. Optional Local AI Fallback via Ollama (http://localhost:11434):
   - Only invoked if enabled/requested for ambiguous bills; gracefully bypassed if Ollama is offline.
4. Mathematical & Structural Validation:
   - Cross-checks item quantities * unit_price == total_price, sum(items) == subtotal,
     and subtotal + tax_amount == grand_total.
"""
import json
import re
from datetime import datetime, date
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from typing import Dict, Any, List, Optional

import httpx

from backend.config import settings

# Header/footer words that should never be mistaken for a shop name or line item
NON_SHOP_NAME_PATTERNS = re.compile(
    r"^(?:tax\s*invoice|invoice|cash\s*memo|receipt|bill\s*of\s*supply|estimate|"
    r"original\s*for\s*recipient|gstin|phone|mob|tel|date|time|page\s*\d+|---|\*\*\*|===)",
    re.IGNORECASE,
)

SUMMARY_LINE_PATTERNS = re.compile(
    r"\b(?:sub\s*total|subtotal|grand\s*total|total\s*amount|net\s*amount|amount\s*payable|"
    r"cgst|sgst|igst|utgst|gst|vat|tax\s*amount|discount|round\s*off|cash\s*tendered|"
    r"change\s*due|thank\s*you|visit\s*again|धन्यवाद|कुल\s*योग|जीएसटी)\b",
    re.IGNORECASE,
)


def to_decimal(value: Any, places: str = "0.01") -> Optional[Decimal]:
    """Safely convert numeric string or float to Decimal rounded to specified places."""
    if value is None or value == "":
        return None
    if isinstance(value, Decimal):
        return value.quantize(Decimal(places), rounding=ROUND_HALF_UP)
    cleaned = re.sub(r"[^\d.-]", "", str(value))
    if not cleaned or cleaned in ("-", ".", "-."):
        return None
    try:
        return Decimal(cleaned).quantize(Decimal(places), rounding=ROUND_HALF_UP)
    except (InvalidOperation, ValueError):
        return None


def extract_shop_name(lines: List[str]) -> Optional[str]:
    """
    Identify shop name from the top non-empty lines of the receipt.
    Does not fabricate a shop name if none is present.
    """
    for line in lines[:6]:
        cleaned = line.strip(" -_*=#|:")
        if not cleaned or len(cleaned) < 3:
            continue
        # Skip page markers added by multi-page combiner
        if cleaned.startswith("[Page") or "Direct PDF Text" in cleaned or "Tesseract OCR" in cleaned:
            continue
        if NON_SHOP_NAME_PATTERNS.search(cleaned):
            continue
        # Skip lines that are mostly digits/dates/symbols
        alpha_chars = sum(1 for ch in cleaned if ch.isalpha())
        if alpha_chars >= 3:
            return cleaned[:255]
    return None


def extract_invoice_number(text: str) -> Optional[str]:
    """
    Extract invoice / bill / receipt number using common Indian & international receipt patterns.
    """
    patterns = [
        r"(?:invoice|inv|bill|receipt|memo)\s*(?:no\.?|number|#)?\s*[:\-]\s*([A-Za-z0-9\/_-]{2,40})",
        r"(?:tax\s*invoice|invoice|bill)\s*#\s*([A-Za-z0-9\/_-]{2,40})",
        r"(?:बीजक|बिल|रसीद)\s*(?:संख्या|नं\.?|क्र\.?)?\s*[:\-]?\s*([A-Za-z0-9\/_-]{2,40})",
    ]
    for pat in patterns:
        match = re.search(pat, text, flags=re.IGNORECASE)
        if match:
            candidate = match.group(1).strip(" .,:;")
            if candidate.lower() not in ("date", "no", "number", "nil", "na"):
                return candidate[:100]
    return None


def extract_bill_date(text: str) -> Optional[date]:
    """
    Extract and normalize bill date into ISO date (YYYY-MM-DD).
    Supports DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, DD.MM.YYYY, and DD Mon YYYY.
    """
    # Prioritize labeled date lines first
    labeled_match = re.search(
        r"(?:bill\s*date|invoice\s*date|date|दिनांक|तारीख)\s*[:\-]?\s*"
        r"(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})",
        text,
        flags=re.IGNORECASE,
    )
    candidates: List[str] = []
    if labeled_match:
        candidates.append(labeled_match.group(1).strip())

    # Fallback general date tokens in text
    general_matches = re.findall(
        r"\b(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}|\d{4}[\/\-\.]\d{2}[\/\-\.]\d{2}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b",
        text,
    )
    candidates.extend(general_matches)

    date_formats = [
        "%d-%m-%Y",
        "%d/%m/%Y",
        "%d.%m.%Y",
        "%Y-%m-%d",
        "%Y/%m/%d",
        "%d-%m-%y",
        "%d/%m/%y",
        "%d %b %Y",
        "%d %B %Y",
    ]
    for raw_date in candidates:
        normalized = re.sub(r"\s+", " ", raw_date.strip())
        for fmt in date_formats:
            try:
                parsed = datetime.strptime(normalized, fmt).date()
                if 2000 <= parsed.year <= 2100:
                    return parsed
            except ValueError:
                continue
    return None


def extract_line_items(lines: List[str]) -> List[Dict[str, Any]]:
    """
    Extract itemized rows (item_name, quantity, unit_price, total_price) from receipt lines.
    Supports:
      Pattern A: "Item Name    Qty    UnitPrice    TotalPrice"
      Pattern B: "1. Item Name   Qty: 4   450.00   1800.00" or "1. Item Name   Qty: 4   1800.00"
      Pattern C: "Item Name   2 x 160.00   320.00"
    """
    items: List[Dict[str, Any]] = []

    # Pattern A: Description followed by Qty, Rate, Total at end of line
    pat_tabular = re.compile(
        r"^(?:\d+[\.\)]\s*)?([A-Za-z\u0900-\u097F][A-Za-z0-9\u0900-\u097F\s\-\(\)\/\.%&]{2,60}?)\s+"
        r"(\d+(?:\.\d{1,3})?)\s+"
        r"(?:Rs\.?|₹|INR)?\s*(\d{1,6}(?:,\d{3})*(?:\.\d{2}))\s+"
        r"(?:Rs\.?|₹|INR)?\s*(\d{1,7}(?:,\d{3})*(?:\.\d{2}))\s*$",
        re.IGNORECASE,
    )

    # Pattern B: Explicit "Qty: <n>" with 1 or 2 trailing amounts
    pat_explicit_qty = re.compile(
        r"^(?:\d+[\.\)]\s*)?([A-Za-z\u0900-\u097F][A-Za-z0-9\u0900-\u097F\s\-\(\)\/\.%&]{2,60}?)\s+"
        r"Qty\s*[:\-]?\s*(\d+(?:\.\d{1,3})?)\s+"
        r"(?:(?:Rs\.?|₹|INR)?\s*(\d{1,6}(?:,\d{3})*(?:\.\d{2}))\s+)?"
        r"(?:Rs\.?|₹|INR)?\s*(\d{1,7}(?:,\d{3})*(?:\.\d{2}))\s*$",
        re.IGNORECASE,
    )

    # Pattern C: "Item Name   2 x 160.00   320.00"
    pat_mult = re.compile(
        r"^(?:\d+[\.\)]\s*)?([A-Za-z\u0900-\u097F][A-Za-z0-9\u0900-\u097F\s\-\(\)\/\.%&]{2,60}?)\s+"
        r"(\d+(?:\.\d{1,3})?)\s*[xX\*]\s*(?:Rs\.?|₹|INR)?\s*(\d{1,6}(?:,\d{3})*(?:\.\d{2}))\s+"
        r"(?:Rs\.?|₹|INR)?\s*(\d{1,7}(?:,\d{3})*(?:\.\d{2}))\s*$",
        re.IGNORECASE,
    )

    for raw_line in lines:
        line = raw_line.strip()
        if not line or len(line) < 6:
            continue
        if SUMMARY_LINE_PATTERNS.search(line):
            continue
        if re.match(r"^[-=_*#\.]{4,}$", line):
            continue
        if re.search(r"\b(?:item\s*description|particulars|hsn\s*code)\b", line, re.IGNORECASE):
            continue

        m_exp = pat_explicit_qty.match(line)
        if m_exp:
            name = m_exp.group(1).strip(" -:")
            qty = to_decimal(m_exp.group(2), "0.001") or Decimal("1.000")
            rate_raw = m_exp.group(3)
            total = to_decimal(m_exp.group(4), "0.01") or Decimal("0.00")
            if rate_raw:
                unit_price = to_decimal(rate_raw, "0.01") or Decimal("0.00")
            else:
                unit_price = (
                    (total / qty).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
                    if qty > 0
                    else total
                )
            items.append(
                {
                    "item_name": name,
                    "quantity": qty,
                    "unit_price": unit_price,
                    "total_price": total,
                }
            )
            continue

        m_mult = pat_mult.match(line)
        if m_mult:
            name = m_mult.group(1).strip(" -:")
            qty = to_decimal(m_mult.group(2), "0.001") or Decimal("1.000")
            unit_price = to_decimal(m_mult.group(3), "0.01") or Decimal("0.00")
            total = to_decimal(m_mult.group(4), "0.01") or Decimal("0.00")
            items.append(
                {
                    "item_name": name,
                    "quantity": qty,
                    "unit_price": unit_price,
                    "total_price": total,
                }
            )
            continue

        m_tab = pat_tabular.match(line)
        if m_tab:
            name = m_tab.group(1).strip(" -:")
            qty = to_decimal(m_tab.group(2), "0.001") or Decimal("1.000")
            unit_price = to_decimal(m_tab.group(3), "0.01") or Decimal("0.00")
            total = to_decimal(m_tab.group(4), "0.01") or Decimal("0.00")
            items.append(
                {
                    "item_name": name,
                    "quantity": qty,
                    "unit_price": unit_price,
                    "total_price": total,
                }
            )

    return items


def extract_financial_totals(text: str, items: List[Dict[str, Any]]) -> Dict[str, Optional[Decimal]]:
    """
    Extract subtotal, tax_amount (including summing CGST + SGST if listed separately),
    and grand_total from receipt text.
    """
    subtotal: Optional[Decimal] = None
    tax_amount: Optional[Decimal] = None
    grand_total: Optional[Decimal] = None

    # 1. Subtotal
    sub_match = re.search(
        r"(?:sub\s*total|subtotal|taxable\s*(?:value|amount)|उप\s*योग)\s*[:\-]?\s*(?:Rs\.?|₹|INR)?\s*(\d{1,7}(?:,\d{3})*(?:\.\d{2}))",
        text,
        flags=re.IGNORECASE,
    )
    if sub_match:
        subtotal = to_decimal(sub_match.group(1), "0.01")

    # 2. Tax / GST (Sum all distinct tax lines such as CGST + SGST or single IGST/GST line)
    tax_lines = re.findall(
        r"^(?:.*?\b(?:cgst|sgst|igst|utgst|gst|vat|tax)\b.*?)(\d{1,6}(?:,\d{3})*(?:\.\d{2}))\s*$",
        text,
        flags=re.IGNORECASE | re.MULTILINE,
    )
    if tax_lines:
        tax_sum = Decimal("0.00")
        valid_tax_found = False
        for raw_val in tax_lines:
            dec_val = to_decimal(raw_val, "0.01")
            if dec_val is not None:
                tax_sum += dec_val
                valid_tax_found = True
        if valid_tax_found:
            tax_amount = tax_sum.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    # 3. Grand Total
    grand_patterns = [
        r"(?:grand\s*total|total\s*payable|net\s*payable|amount\s*payable|कुल\s*योग)\s*[:\-]?\s*(?:Rs\.?|₹|INR)?\s*(\d{1,8}(?:,\d{3})*(?:\.\d{2}))",
        r"^(?:total|net\s*amount)\s*[:\-]?\s*(?:Rs\.?|₹|INR)?\s*(\d{1,8}(?:,\d{3})*(?:\.\d{2}))\s*$",
    ]
    for pat in grand_patterns:
        g_match = re.search(pat, text, flags=re.IGNORECASE | re.MULTILINE)
        if g_match:
            grand_total = to_decimal(g_match.group(1), "0.01")
            break

    # If subtotal was not explicitly printed but line items exist, derive subtotal from items sum
    if subtotal is None and items:
        subtotal = sum(
            (item["total_price"] for item in items if item.get("total_price") is not None),
            Decimal("0.00"),
        ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    return {
        "subtotal": subtotal,
        "tax_amount": tax_amount,
        "grand_total": grand_total,
    }


def parse_bill_with_ollama(ocr_text: str) -> Optional[Dict[str, Any]]:
    """
    Optional Local AI bill extraction helper using Ollama (http://localhost:11434).
    Strictly instructs the local model not to fabricate missing values.
    Returns None gracefully if Ollama is not running or unreachable.
    """
    prompt = f"""You are a precise receipt parser. Extract structured bill fields from the OCR text below.
Return ONLY valid JSON with this exact structure (use null for missing fields, never invent values):
{{
  "shop_name": string or null,
  "invoice_number": string or null,
  "bill_date": "YYYY-MM-DD" or null,
  "subtotal": number or null,
  "tax_amount": number or null,
  "grand_total": number or null,
  "items": [
    {{
      "item_name": string,
      "quantity": number,
      "unit_price": number,
      "total_price": number
    }}
  ]
}}

OCR TEXT:
{ocr_text}
"""
    try:
        with httpx.Client(timeout=8.0) as client:
            response = client.post(
                f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json",
                },
            )
            if response.status_code != 200:
                return None
            payload = response.json()
            raw_json = payload.get("response", "")
            return json.loads(raw_json)
    except Exception:
        return None


def validate_extracted_bill(bill_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate extracted bill fields and mathematical consistency across line items,
    subtotal, tax_amount, and grand_total.
    """
    checks: List[str] = []
    warnings: List[str] = []

    items = bill_data.get("items") or []
    subtotal = to_decimal(bill_data.get("subtotal"), "0.01")
    tax_amount = to_decimal(bill_data.get("tax_amount"), "0.01") or Decimal("0.00")
    grand_total = to_decimal(bill_data.get("grand_total"), "0.01")

    if bill_data.get("shop_name"):
        checks.append(f"Shop name identified: {bill_data['shop_name']}")
    else:
        warnings.append("Shop name was not detected in OCR text (left blank for manual entry).")

    if bill_data.get("invoice_number"):
        checks.append(f"Invoice number identified: {bill_data['invoice_number']}")
    else:
        warnings.append("Invoice number was not detected in OCR text.")

    if bill_data.get("bill_date"):
        checks.append(f"Bill date normalized: {bill_data['bill_date']}")
    else:
        warnings.append("Bill date was not detected in OCR text.")

    calculated_items_sum = Decimal("0.00")
    for idx, item in enumerate(items, start=1):
        qty = to_decimal(item.get("quantity"), "0.001") or Decimal("1.000")
        unit = to_decimal(item.get("unit_price"), "0.01") or Decimal("0.00")
        total = to_decimal(item.get("total_price"), "0.01") or Decimal("0.00")
        expected_line_total = (qty * unit).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        calculated_items_sum += total

        if abs(expected_line_total - total) > Decimal("0.05"):
            warnings.append(
                f"Row #{idx} ({item.get('item_name')}): {qty} × {unit} = {expected_line_total}, "
                f"but line total is {total}."
            )

    if items:
        checks.append(
            f"Extracted {len(items)} line item(s) with sum = {calculated_items_sum:.2f}"
        )
        if subtotal is not None and abs(calculated_items_sum - subtotal) <= Decimal("0.05"):
            checks.append(f"Line items sum ({calculated_items_sum:.2f}) matches Subtotal ({subtotal:.2f}).")
        elif subtotal is not None:
            warnings.append(
                f"Line items sum ({calculated_items_sum:.2f}) differs from extracted Subtotal ({subtotal:.2f})."
            )
    else:
        warnings.append("No structured line items were matched automatically. You can add rows below.")

    calculated_grand_total = (
        ((subtotal or calculated_items_sum) + tax_amount).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        if (subtotal is not None or items)
        else grand_total
    )

    if (
        grand_total is not None
        and calculated_grand_total is not None
        and abs(calculated_grand_total - grand_total) <= Decimal("0.05")
    ):
        checks.append(
            f"Subtotal + Tax ({calculated_grand_total:.2f}) matches Grand Total ({grand_total:.2f})."
        )
    elif grand_total is not None and calculated_grand_total is not None:
        warnings.append(
            f"Subtotal + Tax ({calculated_grand_total:.2f}) differs from extracted Grand Total ({grand_total:.2f})."
        )

    return {
        "is_valid": len(warnings) == 0,
        "calculated_items_sum": calculated_items_sum,
        "calculated_grand_total": calculated_grand_total,
        "checks_passed": checks,
        "warnings": warnings,
    }


def extract_bill_from_text(
    ocr_text: str,
    use_ollama: Optional[bool] = None,
) -> Dict[str, Any]:
    """
    Execute the hybrid bill extraction workflow:
    1. Run deterministic Python rule & regex extraction.
    2. Optionally query local Ollama model if requested or if key fields are missing.
    3. Validate mathematical consistency and return structured draft for user review.
    """
    lines = [line.strip() for line in (ocr_text or "").replace("\r\n", "\n").split("\n") if line.strip()]

    shop_name = extract_shop_name(lines)
    invoice_number = extract_invoice_number(ocr_text or "")
    bill_date = extract_bill_date(ocr_text or "")
    items = extract_line_items(lines)
    totals = extract_financial_totals(ocr_text or "", items)

    extraction_method = "python_rules"
    ollama_attempted = False
    ollama_used = False

    should_try_ollama = use_ollama if use_ollama is not None else settings.USE_OLLAMA
    if should_try_ollama:
        ollama_attempted = True
        ollama_res = parse_bill_with_ollama(ocr_text)
        if ollama_res:
            ollama_used = True
            extraction_method = "hybrid_rules_plus_ollama"
            if not shop_name and ollama_res.get("shop_name"):
                shop_name = str(ollama_res["shop_name"])[:255]
            if not invoice_number and ollama_res.get("invoice_number"):
                invoice_number = str(ollama_res["invoice_number"])[:100]
            if not bill_date and ollama_res.get("bill_date"):
                bill_date = extract_bill_date(str(ollama_res["bill_date"]))
            if not items and isinstance(ollama_res.get("items"), list):
                for raw_item in ollama_res["items"]:
                    if isinstance(raw_item, dict) and raw_item.get("item_name"):
                        qty = to_decimal(raw_item.get("quantity"), "0.001") or Decimal("1.000")
                        unit = to_decimal(raw_item.get("unit_price"), "0.01") or Decimal("0.00")
                        tot = to_decimal(raw_item.get("total_price"), "0.01") or (qty * unit).quantize(
                            Decimal("0.01"), rounding=ROUND_HALF_UP
                        )
                        items.append(
                            {
                                "item_name": str(raw_item["item_name"])[:255],
                                "quantity": qty,
                                "unit_price": unit,
                                "total_price": tot,
                            }
                        )
            if totals["subtotal"] is None and ollama_res.get("subtotal") is not None:
                totals["subtotal"] = to_decimal(ollama_res.get("subtotal"), "0.01")
            if totals["tax_amount"] is None and ollama_res.get("tax_amount") is not None:
                totals["tax_amount"] = to_decimal(ollama_res.get("tax_amount"), "0.01")
            if totals["grand_total"] is None and ollama_res.get("grand_total") is not None:
                totals["grand_total"] = to_decimal(ollama_res.get("grand_total"), "0.01")

    draft = {
        "shop_name": shop_name,
        "invoice_number": invoice_number,
        "bill_date": bill_date,
        "subtotal": totals["subtotal"],
        "tax_amount": totals["tax_amount"],
        "grand_total": totals["grand_total"],
        "items": items,
    }
    validation = validate_extracted_bill(draft)

    return {
        "extraction_method": extraction_method,
        "ollama_attempted": ollama_attempted,
        "ollama_used": ollama_used,
        "shop_name": shop_name,
        "invoice_number": invoice_number,
        "bill_date": bill_date,
        "subtotal": totals["subtotal"],
        "tax_amount": totals["tax_amount"],
        "grand_total": totals["grand_total"],
        "items": items,
        "validation": validation,
    }
