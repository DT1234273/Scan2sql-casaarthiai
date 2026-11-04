import type { NoSQLBillRecord, NoSQLBillItem, ColumnDefinition } from './App';

export const INDIAN_GST_STATE_CODES: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '25': 'Daman & Diu',
  '26': 'Dadra & Nagar Haveli and Daman & Diu',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh (Old)',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
  '97': 'Other Territory',
};

const GSTIN_REGEX = /^(\d{2})([A-Z]{5}\d{4}[A-Z]{1})([1-9A-Z]{1})Z([0-9A-Z]{1})$/;

export interface GstinValidationResult {
  raw: string;
  normalized: string;
  isEmpty: boolean;
  isValid: boolean;
  stateCode: string | null;
  stateName: string | null;
  panEmbedded: string | null;
  message: string;
}

export function validateIndianGstin(input: string): GstinValidationResult {
  const normalized = (input || '').trim().toUpperCase().replace(/\s+/g, '');
  if (!normalized) {
    return {
      raw: input,
      normalized: '',
      isEmpty: true,
      isValid: false,
      stateCode: null,
      stateName: null,
      panEmbedded: null,
      message: 'GSTIN not provided (B2C / Unregistered Vendor)',
    };
  }

  if (normalized.length !== 15) {
    return {
      raw: input,
      normalized,
      isEmpty: false,
      isValid: false,
      stateCode: null,
      stateName: null,
      panEmbedded: null,
      message: `Invalid length (${normalized.length}/15 chars). Standard GSTIN requires 15 characters.`,
    };
  }

  const match = normalized.match(GSTIN_REGEX);
  if (!match) {
    return {
      raw: input,
      normalized,
      isEmpty: false,
      isValid: false,
      stateCode: normalized.slice(0, 2),
      stateName: INDIAN_GST_STATE_CODES[normalized.slice(0, 2)] || null,
      panEmbedded: null,
      message: 'Format mismatch. Expected 2-digit State Code + 10-char PAN + Entity Code + Z + Checksum.',
    };
  }

  const stateCode = match[1];
  const panEmbedded = match[2];
  const stateName = INDIAN_GST_STATE_CODES[stateCode] || null;

  if (!stateName) {
    return {
      raw: input,
      normalized,
      isEmpty: false,
      isValid: false,
      stateCode,
      stateName: null,
      panEmbedded,
      message: `Unrecognized GST State Code "${stateCode}".`,
    };
  }

  return {
    raw: input,
    normalized,
    isEmpty: false,
    isValid: true,
    stateCode,
    stateName,
    panEmbedded,
    message: `Valid GSTIN (${stateCode} - ${stateName} • PAN: ${panEmbedded})`,
  };
}

export interface BillAuditResult {
  status: 'VERIFIED' | 'NEEDS_REVIEW' | 'EXCEPTION';
  sellerGstinCheck: GstinValidationResult;
  buyerGstinCheck: GstinValidationResult;
  isDuplicateInvoice: boolean;
  duplicateBillId: string | null;
  isTaxMathConsistent: boolean;
  expectedGrandTotal: number;
  mathVariance: number;
  isLowConfidence: boolean;
  missingMandatoryFields: string[];
  flags: Array<{
    severity: 'ok' | 'warning' | 'error';
    label: string;
    detail: string;
  }>;
}

export function auditBillDraftOrRecord(
  draft: {
    id?: string;
    shopName: string;
    sellerGstin: string;
    buyerGstin: string;
    invoiceNumber: string;
    billDate: string;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    grandTotal: number;
    confidence: number;
  },
  existingBills: NoSQLBillRecord[]
): BillAuditResult {
  const sellerGstinCheck = validateIndianGstin(draft.sellerGstin);
  const buyerGstinCheck = validateIndianGstin(draft.buyerGstin);

  const normInv = (draft.invoiceNumber || '').trim().toUpperCase();
  const normGstin = sellerGstinCheck.normalized;
  const normShop = (draft.shopName || '').trim().toLowerCase();

  let duplicateBillId: string | null = null;
  if (normInv && normInv.length >= 2) {
    const foundDup = existingBills.find((b) => {
      if (draft.id && b.id === draft.id) return false;
      const bInv = (b.invoiceNumber || '').trim().toUpperCase();
      if (bInv !== normInv) return false;
      const bGstin = (b.sellerGstin || '').trim().toUpperCase();
      const bShop = (b.shopName || '').trim().toLowerCase();
      if (normGstin && bGstin && normGstin === bGstin) return true;
      if (normShop && bShop && normShop === bShop) return true;
      return false;
    });
    if (foundDup) {
      duplicateBillId = foundDup.id;
    }
  }

  const isDuplicateInvoice = Boolean(duplicateBillId);

  const sub = Number(draft.subtotal) || 0;
  const tax = Number(draft.taxAmount) || 0;
  const disc = Number(draft.discountAmount) || 0;
  const grand = Number(draft.grandTotal) || 0;
  const expectedGrandTotal = Number((sub + tax - disc).toFixed(2));
  const mathVariance = Number(Math.abs(expectedGrandTotal - grand).toFixed(2));
  // Allow ₹1.50 rounding tolerance for Indian retail/GST rounding off
  const isTaxMathConsistent = grand === 0 || mathVariance <= 1.5;

  const isLowConfidence = Number(draft.confidence) > 0 && Number(draft.confidence) < 80;

  const missingMandatoryFields: string[] = [];
  if (!draft.shopName?.trim()) missingMandatoryFields.push('Supplier / Shop Name');
  if (!draft.invoiceNumber?.trim()) missingMandatoryFields.push('Invoice Number');
  if (!draft.billDate?.trim()) missingMandatoryFields.push('Invoice Date');
  if (sellerGstinCheck.isEmpty) missingMandatoryFields.push('Seller GSTIN');

  const flags: BillAuditResult['flags'] = [];

  if (sellerGstinCheck.isValid) {
    flags.push({
      severity: 'ok',
      label: `GSTIN Verified (${sellerGstinCheck.stateName})`,
      detail: sellerGstinCheck.message,
    });
  } else if (!sellerGstinCheck.isEmpty) {
    flags.push({
      severity: 'error',
      label: 'Invalid Seller GSTIN Format',
      detail: sellerGstinCheck.message,
    });
  } else {
    flags.push({
      severity: 'warning',
      label: 'Unregistered / Missing GSTIN',
      detail: 'No Seller GSTIN found. Classify as B2C/Unregistered purchase or enter 15-char GSTIN.',
    });
  }

  if (isDuplicateInvoice) {
    flags.push({
      severity: 'error',
      label: 'Duplicate Invoice Detected',
      detail: `Invoice No "${draft.invoiceNumber}" from this supplier already exists in the sheet.`,
    });
  }

  if (!isTaxMathConsistent) {
    flags.push({
      severity: 'warning',
      label: `Tax Math Variance (₹${mathVariance.toFixed(2)})`,
      detail: `Taxable (₹${sub.toFixed(2)}) + Tax (₹${tax.toFixed(2)}) = ₹${expectedGrandTotal.toFixed(2)}, vs Grand Total ₹${grand.toFixed(2)}.`,
    });
  } else if (grand > 0) {
    flags.push({
      severity: 'ok',
      label: 'Tax & Total Math Verified',
      detail: `Subtotal + GST matches Grand Total (₹${grand.toFixed(2)}) within rounding tolerance.`,
    });
  }

  if (isLowConfidence) {
    flags.push({
      severity: 'warning',
      label: `Low OCR Confidence (${Number(draft.confidence).toFixed(0)}%)`,
      detail: 'Scan quality is below 80%. Please verify invoice number and tax amounts manually.',
    });
  }

  let status: BillAuditResult['status'] = 'VERIFIED';
  if (flags.some((f) => f.severity === 'error')) {
    status = 'EXCEPTION';
  } else if (flags.some((f) => f.severity === 'warning')) {
    status = 'NEEDS_REVIEW';
  }

  return {
    status,
    sellerGstinCheck,
    buyerGstinCheck,
    isDuplicateInvoice,
    duplicateBillId,
    isTaxMathConsistent,
    expectedGrandTotal,
    mathVariance,
    isLowConfidence,
    missingMandatoryFields,
    flags,
  };
}

export interface SupplierSummaryRow {
  supplierKey: string;
  shopName: string;
  sellerGstin: string;
  gstinValid: boolean;
  stateName: string;
  invoiceCount: number;
  totalTaxable: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  totalGrand: number;
  lastBillDate: string;
}

export function computeSupplierSummary(bills: NoSQLBillRecord[]): SupplierSummaryRow[] {
  const map = new Map<string, SupplierSummaryRow>();

  for (const bill of bills) {
    const gstinCheck = validateIndianGstin(bill.sellerGstin);
    const key = gstinCheck.normalized || (bill.shopName || 'UNKNOWN_VENDOR').trim().toUpperCase();
    const existing = map.get(key) || {
      supplierKey: key,
      shopName: bill.shopName || 'Unnamed Supplier',
      sellerGstin: gstinCheck.normalized || 'Unregistered / B2C',
      gstinValid: gstinCheck.isValid,
      stateName: gstinCheck.stateName || (bill.placeOfSupply || 'N/A'),
      invoiceCount: 0,
      totalTaxable: 0,
      totalCgst: 0,
      totalSgst: 0,
      totalIgst: 0,
      totalTax: 0,
      totalGrand: 0,
      lastBillDate: bill.billDate || '',
    };

    existing.invoiceCount += 1;
    existing.totalTaxable = Number((existing.totalTaxable + (Number(bill.subtotal) || 0)).toFixed(2));
    existing.totalCgst = Number((existing.totalCgst + (Number(bill.cgstAmount) || 0)).toFixed(2));
    existing.totalSgst = Number((existing.totalSgst + (Number(bill.sgstAmount) || 0)).toFixed(2));
    existing.totalIgst = Number((existing.totalIgst + (Number(bill.igstAmount) || 0)).toFixed(2));
    existing.totalTax = Number((existing.totalTax + (Number(bill.taxAmount) || 0)).toFixed(2));
    existing.totalGrand = Number((existing.totalGrand + (Number(bill.grandTotal) || 0)).toFixed(2));
    if (bill.billDate && (!existing.lastBillDate || bill.billDate > existing.lastBillDate)) {
      existing.lastBillDate = bill.billDate;
    }

    map.set(key, existing);
  }

  return Array.from(map.values()).sort((a, b) => b.totalGrand - a.totalGrand);
}

// ---------------------------------------------------------------------------
// Export Helpers: CSV (.csv), Structured JSON (.json), and SQL (.sql)
// ---------------------------------------------------------------------------
export function exportMasterRowsToCsv(
  rows: Array<{ id: string; billId: string; cells: Record<string, string | number> }>,
  columns: ColumnDefinition[],
  columnTotals: Record<string, number>,
  filename: string
): void {
  const headers = ['Sr. No', ...columns.map((c) => c.label.replace(' (Extra)', ''))];

  const escapeCsvCell = (val: string | number | undefined): string => {
    const str = val === undefined || val === null ? '' : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines: string[] = [headers.map(escapeCsvCell).join(',')];

  rows.forEach((row, idx) => {
    const lineCells: (string | number)[] = [idx + 1];
    columns.forEach((col) => {
      lineCells.push(row.cells[col.key] ?? '');
    });
    lines.push(lineCells.map(escapeCsvCell).join(','));
  });

  // Append Totals Row
  const totalCells: (string | number)[] = ['TOTAL'];
  columns.forEach((col, i) => {
    if (col.isNumeric) {
      totalCells.push(columnTotals[col.key] ?? 0);
    } else if (i === 0) {
      totalCells.push(`GRAND TOTAL (${rows.length} Bills)`);
    } else {
      totalCells.push('');
    }
  });
  lines.push(totalCells.map(escapeCsvCell).join(','));

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportBillsToJsonFile(bills: NoSQLBillRecord[], filename: string): void {
  const payload = {
    platform: 'LedgerSutra — AI Invoice & Document Automation for CA Firms',
    domain: 'https://casaarthiai.in',
    exportedAt: new Date().toISOString(),
    totalInvoices: bills.length,
    summary: {
      totalTaxableValue: Number(bills.reduce((s, b) => s + (Number(b.subtotal) || 0), 0).toFixed(2)),
      totalGstAmount: Number(bills.reduce((s, b) => s + (Number(b.taxAmount) || 0), 0).toFixed(2)),
      totalGrandAmount: Number(bills.reduce((s, b) => s + (Number(b.grandTotal) || 0), 0).toFixed(2)),
    },
    invoices: bills,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportBillsToSqlFile(bills: NoSQLBillRecord[], filename: string): void {
  const sqlEscape = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return 'NULL';
    if (typeof val === 'number') return Number.isFinite(val) ? String(val) : '0';
    return `'${String(val).replace(/'/g, "''")}'`;
  };

  const lines: string[] = [
    '-- ============================================================================',
    '-- LedgerSutra (https://casaarthiai.in) — Automated Accounting SQL Dump',
    `-- Generated At: ${new Date().toISOString()}`,
    `-- Total Invoices: ${bills.length}`,
    '-- Compatible with PostgreSQL, MySQL, MariaDB, SQLite & SQL Server',
    '-- ============================================================================',
    '',
    'CREATE TABLE IF NOT EXISTS ledgersutra_invoices (',
    '  id VARCHAR(64) PRIMARY KEY,',
    '  file_name VARCHAR(255),',
    '  bill_date DATE,',
    '  invoice_number VARCHAR(100),',
    '  supplier_name VARCHAR(255),',
    '  seller_gstin VARCHAR(20),',
    '  buyer_name VARCHAR(255),',
    '  buyer_gstin VARCHAR(20),',
    '  place_of_supply VARCHAR(100),',
    '  voucher_type VARCHAR(64),',
    '  payment_mode VARCHAR(64),',
    '  taxable_subtotal DECIMAL(14, 2) DEFAULT 0.00,',
    '  cgst_amount DECIMAL(14, 2) DEFAULT 0.00,',
    '  sgst_amount DECIMAL(14, 2) DEFAULT 0.00,',
    '  igst_amount DECIMAL(14, 2) DEFAULT 0.00,',
    '  total_tax_amount DECIMAL(14, 2) DEFAULT 0.00,',
    '  discount_amount DECIMAL(14, 2) DEFAULT 0.00,',
    '  grand_total DECIMAL(14, 2) DEFAULT 0.00,',
    '  ocr_confidence DECIMAL(5, 2) DEFAULT 0.00,',
    '  created_at VARCHAR(32)',
    ');',
    '',
    'CREATE TABLE IF NOT EXISTS ledgersutra_invoice_items (',
    '  item_id VARCHAR(64) PRIMARY KEY,',
    '  invoice_id VARCHAR(64) REFERENCES ledgersutra_invoices(id),',
    '  item_name VARCHAR(255),',
    '  hsn_sac VARCHAR(32),',
    '  quantity DECIMAL(12, 3) DEFAULT 1.000,',
    '  unit VARCHAR(32),',
    '  unit_price DECIMAL(14, 2) DEFAULT 0.00,',
    '  taxable_value DECIMAL(14, 2) DEFAULT 0.00,',
    '  gst_rate DECIMAL(5, 2) DEFAULT 0.00,',
    '  cgst_amount DECIMAL(14, 2) DEFAULT 0.00,',
    '  sgst_amount DECIMAL(14, 2) DEFAULT 0.00,',
    '  igst_amount DECIMAL(14, 2) DEFAULT 0.00,',
    '  line_total DECIMAL(14, 2) DEFAULT 0.00',
    ');',
    '',
  ];

  bills.forEach((b) => {
    lines.push(
      `INSERT INTO ledgersutra_invoices (id, file_name, bill_date, invoice_number, supplier_name, seller_gstin, buyer_name, buyer_gstin, place_of_supply, voucher_type, payment_mode, taxable_subtotal, cgst_amount, sgst_amount, igst_amount, total_tax_amount, discount_amount, grand_total, ocr_confidence, created_at) VALUES (${sqlEscape(
        b.id
      )}, ${sqlEscape(b.fileName)}, ${sqlEscape(b.billDate || null)}, ${sqlEscape(
        b.invoiceNumber
      )}, ${sqlEscape(b.shopName)}, ${sqlEscape(b.sellerGstin)}, ${sqlEscape(
        b.buyerName
      )}, ${sqlEscape(b.buyerGstin)}, ${sqlEscape(b.placeOfSupply)}, ${sqlEscape(
        b.voucherType
      )}, ${sqlEscape(b.paymentMode)}, ${sqlEscape(Number(b.subtotal) || 0)}, ${sqlEscape(
        Number(b.cgstAmount) || 0
      )}, ${sqlEscape(Number(b.sgstAmount) || 0)}, ${sqlEscape(
        Number(b.igstAmount) || 0
      )}, ${sqlEscape(Number(b.taxAmount) || 0)}, ${sqlEscape(
        Number(b.discountAmount) || 0
      )}, ${sqlEscape(Number(b.grandTotal) || 0)}, ${sqlEscape(
        Number(b.confidence) || 95
      )}, ${sqlEscape(b.createdAt)});`
    );

    (b.items || []).forEach((item: NoSQLBillItem) => {
      lines.push(
        `INSERT INTO ledgersutra_invoice_items (item_id, invoice_id, item_name, hsn_sac, quantity, unit, unit_price, taxable_value, gst_rate, cgst_amount, sgst_amount, igst_amount, line_total) VALUES (${sqlEscape(
          item.id
        )}, ${sqlEscape(b.id)}, ${sqlEscape(item.itemName)}, ${sqlEscape(
          item.hsnSac
        )}, ${sqlEscape(Number(item.quantity) || 1)}, ${sqlEscape(item.unit)}, ${sqlEscape(
          Number(item.unitPrice) || 0
        )}, ${sqlEscape(Number(item.taxableValue) || 0)}, ${sqlEscape(
          Number(item.gstRate) || 0
        )}, ${sqlEscape(Number(item.cgstAmount) || 0)}, ${sqlEscape(
          Number(item.sgstAmount) || 0
        )}, ${sqlEscape(Number(item.igstAmount) || 0)}, ${sqlEscape(
          Number(item.lineTotal) || 0
        )});`
      );
    });
    lines.push('');
  });

  const blob = new Blob([lines.join('\n')], { type: 'application/sql;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
