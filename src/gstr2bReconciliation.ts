import * as XLSX from 'xlsx';
import type { NoSQLBillRecord } from './App';
import type {
  Gstr2bPortalInvoice,
  ReconciliationRow,
  ReconciliationStatus,
  ReconciliationSummary,
  AccuracyGroundTruthRow,
  AccuracyComparisonRow,
} from './caWorkspaceTypes';

export function normalizeInvoiceNoForRecon(raw: string): string {
  return String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/[\s/\\\-_.,#]+/g, '')
    .replace(/^0+/, '');
}

export function normalizeDateToYYYYMMDD(raw: string): string {
  const s = String(raw || '').trim();
  if (!s) return '';
  const iso = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (iso) {
    return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`;
  }
  const dmy = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  }
  return s;
}

/**
 * Parses official GST Portal GSTR-2B JSON download (or array of B2B records).
 * Handles both standard portal structure (`data.docdata.b2b` or `docdata.b2b` or `b2b`)
 * and flat JSON arrays.
 */
export function parseGstr2bJsonString(rawJson: string): {
  invoices: Gstr2bPortalInvoice[];
  filingPeriod: string;
  gstin: string;
  error?: string;
} {
  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err) {
    return {
      invoices: [],
      filingPeriod: '',
      gstin: '',
      error: `Invalid JSON file: ${err instanceof Error ? err.message : 'Unable to parse JSON syntax.'}`,
    };
  }

  const root = parsed?.data || parsed;
  const filingPeriod = String(root?.rtnprd || root?.fp || parsed?.rtnprd || '');
  const buyerGstin = String(root?.gstin || parsed?.gstin || '');
  const b2bList = root?.docdata?.b2b || root?.b2b || (Array.isArray(root) ? root : null);

  if (!Array.isArray(b2bList)) {
    return {
      invoices: [],
      filingPeriod,
      gstin: buyerGstin,
      error:
        'Unrecognized GSTR-2B JSON structure: Could not locate the "b2b" (or "data.docdata.b2b") supplier array.',
    };
  }

  const invoices: Gstr2bPortalInvoice[] = [];

  b2bList.forEach((supplierEntry: any, sIdx: number) => {
    // Support both nested supplier->inv[] and flat invoice objects
    if (Array.isArray(supplierEntry?.inv)) {
      const ctin = String(supplierEntry.ctin || supplierEntry.supplierGstin || '')
        .trim()
        .toUpperCase();
      const trdnm = String(supplierEntry.trdnm || supplierEntry.tradeName || 'Registered Supplier').trim();

      supplierEntry.inv.forEach((inv: any, iIdx: number) => {
        let txval = Number(inv.txval ?? 0);
        let igst = Number(inv.igst ?? 0);
        let cgst = Number(inv.cgst ?? 0);
        let sgst = Number(inv.sgst ?? 0);
        let cess = Number(inv.cess ?? 0);

        if (Array.isArray(inv.items) && inv.items.length > 0 && txval === 0) {
          txval = inv.items.reduce((s: number, it: any) => s + (Number(it.txval) || 0), 0);
          igst = inv.items.reduce((s: number, it: any) => s + (Number(it.igst) || 0), 0);
          cgst = inv.items.reduce((s: number, it: any) => s + (Number(it.cgst) || 0), 0);
          sgst = inv.items.reduce((s: number, it: any) => s + (Number(it.sgst) || 0), 0);
          cess = inv.items.reduce((s: number, it: any) => s + (Number(it.cess) || 0), 0);
        }

        const totalTax = Number((igst + cgst + sgst + cess).toFixed(2));
        const val = Number(inv.val ?? Number((txval + totalTax).toFixed(2)));
        const rawItc = String(inv.itcavl ?? inv.itcAvailable ?? 'Y').toUpperCase();
        const itcAvailable: 'YES' | 'NO' | 'PARTIAL' =
          rawItc === 'N' || rawItc === 'NO' ? 'NO' : rawItc === 'P' || rawItc === 'PARTIAL' ? 'PARTIAL' : 'YES';

        invoices.push({
          id: `2B-${sIdx + 1}-${iIdx + 1}-${String(inv.inum || '')}`,
          supplierGstin: ctin,
          tradeName: trdnm,
          invoiceNumber: String(inv.inum || inv.invoiceNumber || '').trim(),
          invoiceDate: normalizeDateToYYYYMMDD(String(inv.idt || inv.dt || inv.invoiceDate || '')),
          placeOfSupply: String(inv.pos || ''),
          invoiceType: String(inv.typ || 'R'),
          reverseCharge: String(inv.rev || 'N').toUpperCase() === 'Y' ? 'Y' : 'N',
          taxableValue: Number(txval.toFixed(2)),
          igstAmount: Number(igst.toFixed(2)),
          cgstAmount: Number(cgst.toFixed(2)),
          sgstAmount: Number(sgst.toFixed(2)),
          cessAmount: Number(cess.toFixed(2)),
          totalTaxAmount: totalTax,
          invoiceValue: Number(val.toFixed(2)),
          itcAvailable,
          filingPeriod: String(supplierEntry.supfildt || filingPeriod || ''),
        });
      });
    } else if (supplierEntry && (supplierEntry.inum || supplierEntry.invoiceNumber)) {
      const ctin = String(supplierEntry.ctin || supplierEntry.supplierGstin || '')
        .trim()
        .toUpperCase();
      const txval = Number(supplierEntry.txval ?? supplierEntry.taxableValue ?? 0);
      const igst = Number(supplierEntry.igst ?? supplierEntry.igstAmount ?? 0);
      const cgst = Number(supplierEntry.cgst ?? supplierEntry.cgstAmount ?? 0);
      const sgst = Number(supplierEntry.sgst ?? supplierEntry.sgstAmount ?? 0);
      const cess = Number(supplierEntry.cess ?? supplierEntry.cessAmount ?? 0);
      const totalTax = Number((igst + cgst + sgst + cess).toFixed(2));
      const val = Number(supplierEntry.val ?? supplierEntry.invoiceValue ?? txval + totalTax);

      invoices.push({
        id: `2B-FLAT-${sIdx + 1}`,
        supplierGstin: ctin,
        tradeName: String(supplierEntry.trdnm || supplierEntry.tradeName || 'Supplier'),
        invoiceNumber: String(supplierEntry.inum || supplierEntry.invoiceNumber || '').trim(),
        invoiceDate: normalizeDateToYYYYMMDD(String(supplierEntry.idt || supplierEntry.invoiceDate || '')),
        placeOfSupply: String(supplierEntry.pos || ''),
        invoiceType: 'R',
        reverseCharge: 'N',
        taxableValue: Number(txval.toFixed(2)),
        igstAmount: Number(igst.toFixed(2)),
        cgstAmount: Number(cgst.toFixed(2)),
        sgstAmount: Number(sgst.toFixed(2)),
        cessAmount: Number(cess.toFixed(2)),
        totalTaxAmount: totalTax,
        invoiceValue: Number(val.toFixed(2)),
        itcAvailable: String(supplierEntry.itcavl || 'Y').toUpperCase().startsWith('N') ? 'NO' : 'YES',
        filingPeriod,
      });
    }
  });

  if (invoices.length === 0) {
    return {
      invoices: [],
      filingPeriod,
      gstin: buyerGstin,
      error: 'No B2B invoices found in the uploaded GSTR-2B JSON file.',
    };
  }

  return { invoices, filingPeriod, gstin: buyerGstin };
}

/**
 * Parses GST Portal GSTR-2B Excel (.xlsx/.xls/.csv) workbook buffer
 */
export function parseGstr2bExcelBuffer(buffer: ArrayBuffer): {
  invoices: Gstr2bPortalInvoice[];
  error?: string;
} {
  try {
    const wb = XLSX.read(buffer, { type: 'array' });
    // Prefer a sheet named "B2B" or containing "B2B"
    const b2bSheetName =
      wb.SheetNames.find((n) => n.toUpperCase() === 'B2B') ||
      wb.SheetNames.find((n) => n.toUpperCase().includes('B2B')) ||
      wb.SheetNames[0];

    if (!b2bSheetName) {
      return { invoices: [], error: 'Excel workbook contains no sheets.' };
    }

    const sheet = wb.Sheets[b2bSheetName];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (rows.length < 2) {
      return { invoices: [], error: `Sheet "${b2bSheetName}" is empty or has no data rows.` };
    }

    // Locate header row containing GSTIN and Invoice Number
    let headerRowIdx = 0;
    for (let i = 0; i < Math.min(12, rows.length); i++) {
      const joined = rows[i].map((c) => String(c || '').toUpperCase()).join(' | ');
      if (joined.includes('GSTIN') && (joined.includes('INVOICE') || joined.includes('INUM') || joined.includes('TAXABLE'))) {
        headerRowIdx = i;
        break;
      }
    }

    const headers = rows[headerRowIdx].map((h) => String(h || '').trim().toUpperCase());
    const findCol = (keywords: string[], fallback = -1): number => {
      for (const kw of keywords) {
        const idx = headers.findIndex((h) => h.includes(kw));
        if (idx !== -1) return idx;
      }
      return fallback;
    };

    const gstinCol = findCol(['GSTIN OF SUPPLIER', 'SUPPLIER GSTIN', 'GSTIN', 'CTIN'], 0);
    const nameCol = findCol(['TRADE/LEGAL NAME', 'TRADE NAME', 'SUPPLIER NAME', 'PARTY NAME', 'LEGAL NAME'], 1);
    const invNoCol = findCol(['INVOICE NUMBER', 'INVOICE NO', 'BILL NO', 'INUM'], 2);
    const invDateCol = findCol(['INVOICE DATE', 'BILL DATE', 'IDT', 'DATE'], 4);
    const invValCol = findCol(['INVOICE VALUE', 'GRAND TOTAL', 'TOTAL VALUE', 'VAL'], 5);
    const posCol = findCol(['PLACE OF SUPPLY', 'POS'], 6);
    const taxableCol = findCol(['TAXABLE VALUE', 'TAXABLE', 'TXVAL'], 8);
    const igstCol = findCol(['INTEGRATED TAX', 'IGST'], 9);
    const cgstCol = findCol(['CENTRAL TAX', 'CGST'], 10);
    const sgstCol = findCol(['STATE/UT TAX', 'SGST', 'UTGST'], 11);
    const cessCol = findCol(['CESS'], 12);
    const itcCol = findCol(['ITC AVAILABILITY', 'ITC AVAILABLE', 'ITC'], -1);

    const invoices: Gstr2bPortalInvoice[] = [];

    for (let r = headerRowIdx + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!Array.isArray(row) || row.length === 0) continue;
      const gstin = String(row[gstinCol] || '').trim().toUpperCase();
      const invNo = String(row[invNoCol] || '').trim();
      if (!gstin && !invNo) continue;
      if (gstin.includes('TOTAL') || invNo.toUpperCase().includes('TOTAL')) continue;

      const parseNum = (v: any): number => {
        const cleaned = String(v ?? '').replace(/[₹,\s]/g, '');
        const n = parseFloat(cleaned);
        return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
      };

      const taxable = parseNum(row[taxableCol]);
      const igst = igstCol >= 0 ? parseNum(row[igstCol]) : 0;
      const cgst = cgstCol >= 0 ? parseNum(row[cgstCol]) : 0;
      const sgst = sgstCol >= 0 ? parseNum(row[sgstCol]) : 0;
      const cess = cessCol >= 0 ? parseNum(row[cessCol]) : 0;
      const totalTax = Number((igst + cgst + sgst + cess).toFixed(2));
      const invVal = invValCol >= 0 && parseNum(row[invValCol]) > 0 ? parseNum(row[invValCol]) : Number((taxable + totalTax).toFixed(2));
      const rawItc = itcCol >= 0 ? String(row[itcCol] || 'YES').toUpperCase() : 'YES';

      invoices.push({
        id: `2B-XLS-${r}`,
        supplierGstin: gstin,
        tradeName: String(row[nameCol] || 'Supplier').trim(),
        invoiceNumber: invNo,
        invoiceDate: normalizeDateToYYYYMMDD(String(row[invDateCol] || '')),
        placeOfSupply: posCol >= 0 ? String(row[posCol] || '') : '',
        invoiceType: 'R',
        reverseCharge: 'N',
        taxableValue: taxable,
        igstAmount: igst,
        cgstAmount: cgst,
        sgstAmount: sgst,
        cessAmount: cess,
        totalTaxAmount: totalTax,
        invoiceValue: invVal,
        itcAvailable: rawItc.startsWith('N') ? 'NO' : 'YES',
        filingPeriod: '',
      });
    }

    if (invoices.length === 0) {
      return {
        invoices: [],
        error: `Could not extract any B2B invoice rows from sheet "${b2bSheetName}". Please verify GSTIN and Invoice Number columns.`,
      };
    }

    return { invoices };
  } catch (err) {
    return {
      invoices: [],
      error: `Failed to parse GSTR-2B Excel file: ${err instanceof Error ? err.message : 'Corrupted workbook'}`,
    };
  }
}

/**
 * Generates sample GSTR-2B portal data based on existing saved bills (plus realistic edge cases:
 * Matched, Amount Mismatch, Date Mismatch, Invoice Number Mismatch, and In 2B but Not in Books)
 * so CAs can also test the reconciliation engine with 1 click.
 */
export function buildSampleGstr2bFromBooks(bookBills: NoSQLBillRecord[]): Gstr2bPortalInvoice[] {
  const samplePortal: Gstr2bPortalInvoice[] = [];

  bookBills.forEach((b, idx) => {
    const gstin = (b.sellerGstin || '24AAACS1234F1Z5').trim().toUpperCase();
    if (idx === 0) {
      // Exact Match
      samplePortal.push({
        id: `2B-DEMO-${idx + 1}`,
        supplierGstin: gstin,
        tradeName: b.shopName,
        invoiceNumber: b.invoiceNumber,
        invoiceDate: normalizeDateToYYYYMMDD(b.billDate),
        placeOfSupply: b.placeOfSupply || '24-Gujarat',
        invoiceType: 'R',
        reverseCharge: 'N',
        taxableValue: b.subtotal,
        igstAmount: b.igstAmount,
        cgstAmount: b.cgstAmount,
        sgstAmount: b.sgstAmount,
        cessAmount: 0,
        totalTaxAmount: b.taxAmount,
        invoiceValue: b.grandTotal,
        itcAvailable: 'YES',
        filingPeriod: '102026',
      });
    } else if (idx === 1) {
      // Amount Mismatch
      const delta = 145;
      samplePortal.push({
        id: `2B-DEMO-${idx + 1}`,
        supplierGstin: gstin,
        tradeName: b.shopName,
        invoiceNumber: b.invoiceNumber,
        invoiceDate: normalizeDateToYYYYMMDD(b.billDate),
        placeOfSupply: b.placeOfSupply || '27-Maharashtra',
        invoiceType: 'R',
        reverseCharge: 'N',
        taxableValue: Math.max(0, Number((b.subtotal - delta).toFixed(2))),
        igstAmount: b.igstAmount,
        cgstAmount: b.cgstAmount,
        sgstAmount: b.sgstAmount,
        cessAmount: 0,
        totalTaxAmount: b.taxAmount,
        invoiceValue: Math.max(0, Number((b.grandTotal - delta).toFixed(2))),
        itcAvailable: 'YES',
        filingPeriod: '102026',
      });
    } else if (idx === 2) {
      // Probable Invoice Number Mismatch (same GSTIN, date, amount, slightly different invoice number)
      samplePortal.push({
        id: `2B-DEMO-${idx + 1}`,
        supplierGstin: gstin,
        tradeName: b.shopName,
        invoiceNumber: `FY26/${b.invoiceNumber}A`,
        invoiceDate: normalizeDateToYYYYMMDD(b.billDate),
        placeOfSupply: b.placeOfSupply || '24-Gujarat',
        invoiceType: 'R',
        reverseCharge: 'N',
        taxableValue: b.subtotal,
        igstAmount: b.igstAmount,
        cgstAmount: b.cgstAmount,
        sgstAmount: b.sgstAmount,
        cessAmount: 0,
        totalTaxAmount: b.taxAmount,
        invoiceValue: b.grandTotal,
        itcAvailable: 'YES',
        filingPeriod: '102026',
      });
    }
  });

  // Always include at least one "In 2B but Not in Books" supplier invoice
  samplePortal.push({
    id: '2B-DEMO-PORTAL-ONLY-1',
    supplierGstin: '27AABCU9603R1ZM',
    tradeName: 'MAHARASHTRA INDUSTRIAL PACKAGING PVT LTD',
    invoiceNumber: 'MIP/26-27/4419',
    invoiceDate: new Date().toISOString().slice(0, 10),
    placeOfSupply: '27-Maharashtra',
    invoiceType: 'R',
    reverseCharge: 'N',
    taxableValue: 28500,
    igstAmount: 5130,
    cgstAmount: 0,
    sgstAmount: 0,
    cessAmount: 0,
    totalTaxAmount: 5130,
    invoiceValue: 33630,
    itcAvailable: 'YES',
    filingPeriod: '102026',
  });

  return samplePortal;
}

export function reconcileBooksWithGstr2b(
  bookBills: NoSQLBillRecord[],
  portalInvoices: Gstr2bPortalInvoice[],
  amountToleranceRs = 1.0,
  manualOverrides: Record<string, { status?: ReconciliationStatus; note?: string }> = {}
): {
  rows: ReconciliationRow[];
  summary: ReconciliationSummary;
} {
  const matchedBookIds = new Set<string>();
  const matchedPortalIds = new Set<string>();
  const rows: ReconciliationRow[] = [];

  // Pass 1: Match by Supplier GSTIN + Normalized Invoice Number (strip spaces, slashes, leading zeros, case-insensitive)
  for (const book of bookBills) {
    const bookGstin = (book.sellerGstin || '').trim().toUpperCase();
    const bookNormInv = normalizeInvoiceNoForRecon(book.invoiceNumber);
    const bookNormDate = normalizeDateToYYYYMMDD(book.billDate);

    if (!bookNormInv) continue;

    const exactPortal = portalInvoices.find((p) => {
      if (matchedPortalIds.has(p.id)) return false;
      const pGstin = (p.supplierGstin || '').trim().toUpperCase();
      const pNormInv = normalizeInvoiceNoForRecon(p.invoiceNumber);
      if (bookGstin && pGstin && bookGstin !== pGstin) return false;
      return pNormInv === bookNormInv;
    });

    if (exactPortal) {
      matchedBookIds.add(book.id);
      matchedPortalIds.add(exactPortal.id);

      const bookTax = Number(book.taxAmount) || Number((book.cgstAmount + book.sgstAmount + book.igstAmount).toFixed(2));
      const taxableDiff = Number((book.subtotal - exactPortal.taxableValue).toFixed(2));
      const taxDiff = Number((bookTax - exactPortal.totalTaxAmount).toFixed(2));
      const totalDiff = Number((book.grandTotal - exactPortal.invoiceValue).toFixed(2));
      const portalNormDate = normalizeDateToYYYYMMDD(exactPortal.invoiceDate);

      let status: ReconciliationStatus = 'MATCHED';
      let matchReason = 'Exact GSTIN + Normalized Invoice No, Date & Amount within tolerance';

      if (Math.abs(taxableDiff) > amountToleranceRs || Math.abs(taxDiff) > amountToleranceRs || Math.abs(totalDiff) > amountToleranceRs) {
        status = 'AMOUNT_MISMATCH';
        matchReason = `Amount variance exceeds ₹${amountToleranceRs.toFixed(2)} (Tax Diff: ₹${taxDiff.toFixed(2)}, Total Diff: ₹${totalDiff.toFixed(2)})`;
      } else if (bookNormDate && portalNormDate && bookNormDate !== portalNormDate) {
        status = 'DATE_MISMATCH';
        matchReason = `Books Date (${bookNormDate}) differs from GSTR-2B Date (${portalNormDate})`;
      }

      const rowId = `RECON_${book.id}_${exactPortal.id}`;
      const override = manualOverrides[rowId];

      rows.push({
        id: rowId,
        status: override?.status || status,
        manualOverrideStatus: override?.status,
        bookBillId: book.id,
        portalInvoiceId: exactPortal.id,
        supplierGstin: exactPortal.supplierGstin || bookGstin,
        supplierName: book.shopName || exactPortal.tradeName,
        bookInvoiceNo: book.invoiceNumber,
        portalInvoiceNo: exactPortal.invoiceNumber,
        bookDate: bookNormDate,
        portalDate: portalNormDate,
        bookTaxable: book.subtotal,
        portalTaxable: exactPortal.taxableValue,
        bookCgst: book.cgstAmount,
        portalCgst: exactPortal.cgstAmount,
        bookSgst: book.sgstAmount,
        portalSgst: exactPortal.sgstAmount,
        bookIgst: book.igstAmount,
        portalIgst: exactPortal.igstAmount,
        bookTotalTax: bookTax,
        portalTotalTax: exactPortal.totalTaxAmount,
        bookGrandTotal: book.grandTotal,
        portalGrandTotal: exactPortal.invoiceValue,
        taxableDiff,
        taxDiff,
        totalDiff,
        itcAvailable: exactPortal.itcAvailable,
        note: override?.note || '',
        matchReason,
      });
    }
  }

  // Pass 2: Fuzzy Fallback on Supplier GSTIN + Amount (within tolerance) + Date -> INVOICE_NO_MISMATCH (probable)
  for (const book of bookBills) {
    if (matchedBookIds.has(book.id)) continue;
    const bookGstin = (book.sellerGstin || '').trim().toUpperCase();
    const bookNormDate = normalizeDateToYYYYMMDD(book.billDate);
    const bookTax = Number(book.taxAmount) || Number((book.cgstAmount + book.sgstAmount + book.igstAmount).toFixed(2));

    const fuzzyPortal = portalInvoices.find((p) => {
      if (matchedPortalIds.has(p.id)) return false;
      const pGstin = (p.supplierGstin || '').trim().toUpperCase();
      if (bookGstin && pGstin && bookGstin !== pGstin) return false;
      const totalClose = Math.abs(book.grandTotal - p.invoiceValue) <= Math.max(amountToleranceRs, 2);
      const taxableClose = Math.abs(book.subtotal - p.taxableValue) <= Math.max(amountToleranceRs, 2);
      const pDate = normalizeDateToYYYYMMDD(p.invoiceDate);
      const dateMatch = !bookNormDate || !pDate || bookNormDate === pDate;
      return (totalClose || taxableClose) && dateMatch;
    });

    if (fuzzyPortal) {
      matchedBookIds.add(book.id);
      matchedPortalIds.add(fuzzyPortal.id);

      const taxableDiff = Number((book.subtotal - fuzzyPortal.taxableValue).toFixed(2));
      const taxDiff = Number((bookTax - fuzzyPortal.totalTaxAmount).toFixed(2));
      const totalDiff = Number((book.grandTotal - fuzzyPortal.invoiceValue).toFixed(2));
      const rowId = `RECON_FUZZY_${book.id}_${fuzzyPortal.id}`;
      const override = manualOverrides[rowId];

      rows.push({
        id: rowId,
        status: override?.status || 'INVOICE_NO_MISMATCH',
        manualOverrideStatus: override?.status,
        bookBillId: book.id,
        portalInvoiceId: fuzzyPortal.id,
        supplierGstin: fuzzyPortal.supplierGstin || bookGstin,
        supplierName: book.shopName || fuzzyPortal.tradeName,
        bookInvoiceNo: book.invoiceNumber,
        portalInvoiceNo: fuzzyPortal.invoiceNumber,
        bookDate: bookNormDate,
        portalDate: normalizeDateToYYYYMMDD(fuzzyPortal.invoiceDate),
        bookTaxable: book.subtotal,
        portalTaxable: fuzzyPortal.taxableValue,
        bookCgst: book.cgstAmount,
        portalCgst: fuzzyPortal.cgstAmount,
        bookSgst: book.sgstAmount,
        portalSgst: fuzzyPortal.sgstAmount,
        bookIgst: book.igstAmount,
        portalIgst: fuzzyPortal.igstAmount,
        bookTotalTax: bookTax,
        portalTotalTax: fuzzyPortal.totalTaxAmount,
        bookGrandTotal: book.grandTotal,
        portalGrandTotal: fuzzyPortal.invoiceValue,
        taxableDiff,
        taxDiff,
        totalDiff,
        itcAvailable: fuzzyPortal.itcAvailable,
        note: override?.note || '',
        matchReason: `Probable Match: Same Supplier GSTIN, Date & Amount, but Invoice No differs ("${book.invoiceNumber}" vs "${fuzzyPortal.invoiceNumber}")`,
      });
    }
  }

  // Pass 3: Remaining Unmatched Book Bills -> IN_BOOKS_NOT_2B
  for (const book of bookBills) {
    if (matchedBookIds.has(book.id)) continue;
    const bookTax = Number(book.taxAmount) || Number((book.cgstAmount + book.sgstAmount + book.igstAmount).toFixed(2));
    const rowId = `RECON_BOOK_ONLY_${book.id}`;
    const override = manualOverrides[rowId];

    rows.push({
      id: rowId,
      status: override?.status || 'IN_BOOKS_NOT_2B',
      manualOverrideStatus: override?.status,
      bookBillId: book.id,
      portalInvoiceId: null,
      supplierGstin: (book.sellerGstin || '').trim().toUpperCase(),
      supplierName: book.shopName,
      bookInvoiceNo: book.invoiceNumber,
      portalInvoiceNo: '-',
      bookDate: normalizeDateToYYYYMMDD(book.billDate),
      portalDate: '-',
      bookTaxable: book.subtotal,
      portalTaxable: 0,
      bookCgst: book.cgstAmount,
      portalCgst: 0,
      bookSgst: book.sgstAmount,
      portalSgst: 0,
      bookIgst: book.igstAmount,
      portalIgst: 0,
      bookTotalTax: bookTax,
      portalTotalTax: 0,
      bookGrandTotal: book.grandTotal,
      portalGrandTotal: 0,
      taxableDiff: book.subtotal,
      taxDiff: bookTax,
      totalDiff: book.grandTotal,
      itcAvailable: 'NO',
      note: override?.note || '',
      matchReason: 'Present in Purchase Books, missing in uploaded GSTR-2B statement (Supplier not filed / GSTR-1 pending)',
    });
  }

  // Pass 4: Remaining Unmatched Portal Invoices -> IN_2B_NOT_BOOKS
  for (const portal of portalInvoices) {
    if (matchedPortalIds.has(portal.id)) continue;
    const rowId = `RECON_2B_ONLY_${portal.id}`;
    const override = manualOverrides[rowId];

    rows.push({
      id: rowId,
      status: override?.status || 'IN_2B_NOT_BOOKS',
      manualOverrideStatus: override?.status,
      bookBillId: null,
      portalInvoiceId: portal.id,
      supplierGstin: portal.supplierGstin,
      supplierName: portal.tradeName,
      bookInvoiceNo: '-',
      portalInvoiceNo: portal.invoiceNumber,
      bookDate: '-',
      portalDate: normalizeDateToYYYYMMDD(portal.invoiceDate),
      bookTaxable: 0,
      portalTaxable: portal.taxableValue,
      bookCgst: 0,
      portalCgst: portal.cgstAmount,
      bookSgst: 0,
      portalSgst: portal.sgstAmount,
      bookIgst: 0,
      portalIgst: portal.igstAmount,
      bookTotalTax: 0,
      portalTotalTax: portal.totalTaxAmount,
      bookGrandTotal: 0,
      portalGrandTotal: portal.invoiceValue,
      taxableDiff: -portal.taxableValue,
      taxDiff: -portal.totalTaxAmount,
      totalDiff: -portal.invoiceValue,
      itcAvailable: portal.itcAvailable,
      note: override?.note || '',
      matchReason: 'Present in GSTR-2B portal, but not recorded in Purchase Register (Unbooked invoice)',
    });
  }

  const countsByStatus: Record<ReconciliationStatus, number> = {
    MATCHED: 0,
    AMOUNT_MISMATCH: 0,
    DATE_MISMATCH: 0,
    INVOICE_NO_MISMATCH: 0,
    IN_BOOKS_NOT_2B: 0,
    IN_2B_NOT_BOOKS: 0,
  };

  const amountsByStatus: Record<ReconciliationStatus, number> = {
    MATCHED: 0,
    AMOUNT_MISMATCH: 0,
    DATE_MISMATCH: 0,
    INVOICE_NO_MISMATCH: 0,
    IN_BOOKS_NOT_2B: 0,
    IN_2B_NOT_BOOKS: 0,
  };

  let totalItcBooks = 0;
  let totalItc2b = 0;
  let eligibleItc2b = 0;
  let itcAtRisk = 0;

  for (const r of rows) {
    countsByStatus[r.status] += 1;
    const refAmount = r.bookGrandTotal > 0 ? r.bookGrandTotal : r.portalGrandTotal;
    amountsByStatus[r.status] = Number((amountsByStatus[r.status] + refAmount).toFixed(2));

    totalItcBooks = Number((totalItcBooks + r.bookTotalTax).toFixed(2));
    totalItc2b = Number((totalItc2b + r.portalTotalTax).toFixed(2));
    if (r.itcAvailable === 'YES') {
      eligibleItc2b = Number((eligibleItc2b + r.portalTotalTax).toFixed(2));
    }

    if (r.status === 'IN_BOOKS_NOT_2B') {
      itcAtRisk = Number((itcAtRisk + r.bookTotalTax).toFixed(2));
    } else if (r.status === 'AMOUNT_MISMATCH' && r.taxDiff > 0) {
      itcAtRisk = Number((itcAtRisk + r.taxDiff).toFixed(2));
    }
  }

  return {
    rows,
    summary: {
      totalRows: rows.length,
      countsByStatus,
      amountsByStatus,
      totalItcBooks,
      totalItc2b,
      eligibleItc2b,
      itcAtRisk,
    },
  };
}

export function exportReconciliationReportToExcel(
  rows: ReconciliationRow[],
  summary: ReconciliationSummary,
  clientName = 'Client',
  filename = `LedgerSutra_GSTR2B_Reconciliation_${new Date().toISOString().slice(0, 10)}.xlsx`
): void {
  const wb = XLSX.utils.book_new();

  // 1. Summary Sheet
  const summaryRows = [
    { Metric: 'Client Name', Count: '', 'Amount / Value (₹)': clientName },
    { Metric: 'Total Invoices Evaluated', Count: summary.totalRows, 'Amount / Value (₹)': '' },
    { Metric: 'Total Input Tax Credit (ITC) as per Books', Count: '', 'Amount / Value (₹)': summary.totalItcBooks },
    { Metric: 'Total ITC as per GSTR-2B Portal', Count: '', 'Amount / Value (₹)': summary.totalItc2b },
    { Metric: 'Eligible ITC in GSTR-2B', Count: '', 'Amount / Value (₹)': summary.eligibleItc2b },
    { Metric: 'ITC at Risk (In Books Not in 2B + Excess Tax)', Count: '', 'Amount / Value (₹)': summary.itcAtRisk },
    { Metric: '--- STATUS BREAKDOWN ---', Count: '', 'Amount / Value (₹)': '' },
    { Metric: '1. Matched', Count: summary.countsByStatus.MATCHED, 'Amount / Value (₹)': summary.amountsByStatus.MATCHED },
    {
      Metric: '2. Amount Mismatch',
      Count: summary.countsByStatus.AMOUNT_MISMATCH,
      'Amount / Value (₹)': summary.amountsByStatus.AMOUNT_MISMATCH,
    },
    {
      Metric: '3. Date Mismatch',
      Count: summary.countsByStatus.DATE_MISMATCH,
      'Amount / Value (₹)': summary.amountsByStatus.DATE_MISMATCH,
    },
    {
      Metric: '4. Invoice Number Mismatch (Probable)',
      Count: summary.countsByStatus.INVOICE_NO_MISMATCH,
      'Amount / Value (₹)': summary.amountsByStatus.INVOICE_NO_MISMATCH,
    },
    {
      Metric: '5. In Books but Not in GSTR-2B',
      Count: summary.countsByStatus.IN_BOOKS_NOT_2B,
      'Amount / Value (₹)': summary.amountsByStatus.IN_BOOKS_NOT_2B,
    },
    {
      Metric: '6. In GSTR-2B but Not in Books',
      Count: summary.countsByStatus.IN_2B_NOT_BOOKS,
      'Amount / Value (₹)': summary.amountsByStatus.IN_2B_NOT_BOOKS,
    },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  const formatRowForSheet = (r: ReconciliationRow) => ({
    Status: r.status,
    'Supplier GSTIN': r.supplierGstin,
    'Supplier Name': r.supplierName,
    'Books Inv No': r.bookInvoiceNo,
    '2B Inv No': r.portalInvoiceNo,
    'Books Date': r.bookDate,
    '2B Date': r.portalDate,
    'Books Taxable (₹)': r.bookTaxable,
    '2B Taxable (₹)': r.portalTaxable,
    'Taxable Diff (₹)': r.taxableDiff,
    'Books Total GST (₹)': r.bookTotalTax,
    '2B Total GST (₹)': r.portalTotalTax,
    'GST Diff (₹)': r.taxDiff,
    'Books Grand Total (₹)': r.bookGrandTotal,
    '2B Invoice Value (₹)': r.portalGrandTotal,
    'Total Diff (₹)': r.totalDiff,
    'ITC Available in 2B': r.itcAvailable,
    'Audit Note': r.note,
    'Match Analysis': r.matchReason,
  });

  const statusSheets: Array<{ status: ReconciliationStatus; sheetName: string }> = [
    { status: 'MATCHED', sheetName: 'Matched' },
    { status: 'AMOUNT_MISMATCH', sheetName: 'Amount_Mismatch' },
    { status: 'DATE_MISMATCH', sheetName: 'Date_Mismatch' },
    { status: 'INVOICE_NO_MISMATCH', sheetName: 'Inv_No_Mismatch' },
    { status: 'IN_BOOKS_NOT_2B', sheetName: 'In_Books_Not_2B' },
    { status: 'IN_2B_NOT_BOOKS', sheetName: 'In_2B_Not_Books' },
  ];

  for (const st of statusSheets) {
    const filtered = rows.filter((r) => r.status === st.status).map(formatRowForSheet);
    const ws = XLSX.utils.json_to_sheet(
      filtered.length > 0 ? filtered : [{ Status: st.status, Note: 'No records in this status category' }]
    );
    XLSX.utils.book_append_sheet(wb, ws, st.sheetName);
  }

  XLSX.writeFile(wb, filename);
}

// ---------------------------------------------------------------------------
// PART 5.5: Accuracy Test Benchmark Evaluator (Ground Truth Excel vs Extracted)
// ---------------------------------------------------------------------------
export function parseGroundTruthExcel(buffer: ArrayBuffer): {
  rows: AccuracyGroundTruthRow[];
  error?: string;
} {
  try {
    const wb = XLSX.read(buffer, { type: 'array' });
    const firstSheet = wb.Sheets[wb.SheetNames[0]];
    const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
    if (rawRows.length === 0) {
      return { rows: [], error: 'Ground truth Excel sheet is empty.' };
    }

    const result: AccuracyGroundTruthRow[] = rawRows.map((r) => {
      const getVal = (keys: string[]): string => {
        for (const k of Object.keys(r)) {
          const upper = k.trim().toUpperCase();
          if (keys.some((kw) => upper.includes(kw))) {
            return String(r[k] ?? '').trim();
          }
        }
        return '';
      };
      const parseNum = (s: string): number => {
        const n = parseFloat(s.replace(/[₹,\s]/g, ''));
        return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
      };

      return {
        fileName: getVal(['FILE', 'DOCUMENT', 'BILL / FILE']),
        invoiceNumber: getVal(['INVOICE', 'BILL NO', 'INV NO']),
        billDate: normalizeDateToYYYYMMDD(getVal(['DATE', 'BILL DATE'])),
        sellerGstin: getVal(['SELLER GSTIN', 'SUPPLIER GSTIN', 'GSTIN']).toUpperCase(),
        subtotal: parseNum(getVal(['TAXABLE', 'SUBTOTAL', 'NET'])),
        taxAmount: parseNum(getVal(['TAX', 'GST AMT', 'TOTAL GST'])),
        grandTotal: parseNum(getVal(['GRAND TOTAL', 'TOTAL COST', 'INVOICE VALUE', 'TOTAL'])),
      };
    });

    return { rows: result.filter((r) => r.fileName || r.invoiceNumber) };
  } catch (err) {
    return {
      rows: [],
      error: `Failed to parse Ground Truth Excel: ${err instanceof Error ? err.message : 'Invalid file'}`,
    };
  }
}

export function evaluateExtractionAccuracy(
  groundTruth: AccuracyGroundTruthRow[],
  extractedBills: NoSQLBillRecord[]
): {
  rows: AccuracyComparisonRow[];
  fieldAccuracy: {
    invoiceNumber: number;
    billDate: number;
    sellerGstin: number;
    subtotal: number;
    taxAmount: number;
    grandTotal: number;
    overall: number;
  };
} {
  const rows: AccuracyComparisonRow[] = [];
  let invHits = 0;
  let dateHits = 0;
  let gstinHits = 0;
  let subHits = 0;
  let taxHits = 0;
  let totalHits = 0;

  for (const gt of groundTruth) {
    const matchedBill = extractedBills.find(
      (b) =>
        (gt.fileName && b.fileName.toLowerCase().includes(gt.fileName.toLowerCase())) ||
        (gt.invoiceNumber &&
          normalizeInvoiceNoForRecon(b.invoiceNumber) === normalizeInvoiceNoForRecon(gt.invoiceNumber))
    );

    const actualInv = matchedBill?.invoiceNumber || '';
    const actualDate = matchedBill ? normalizeDateToYYYYMMDD(matchedBill.billDate) : '';
    const actualGstin = (matchedBill?.sellerGstin || '').trim().toUpperCase();
    const actualSub = matchedBill?.subtotal ?? 0;
    const actualTax = matchedBill?.taxAmount ?? 0;
    const actualTotal = matchedBill?.grandTotal ?? 0;

    const invMatch =
      Boolean(matchedBill) &&
      normalizeInvoiceNoForRecon(gt.invoiceNumber) === normalizeInvoiceNoForRecon(actualInv);
    const dateMatch = Boolean(matchedBill) && gt.billDate === actualDate;
    const gstinMatch = Boolean(matchedBill) && gt.sellerGstin.trim().toUpperCase() === actualGstin;
    const subMatch = Boolean(matchedBill) && Math.abs(gt.subtotal - actualSub) <= 1.0;
    const taxMatch = Boolean(matchedBill) && Math.abs(gt.taxAmount - actualTax) <= 1.0;
    const totalMatch = Boolean(matchedBill) && Math.abs(gt.grandTotal - actualTotal) <= 1.0;

    if (invMatch) invHits++;
    if (dateMatch) dateHits++;
    if (gstinMatch) gstinHits++;
    if (subMatch) subHits++;
    if (taxMatch) taxHits++;
    if (totalMatch) totalHits++;

    const hits = [invMatch, dateMatch, gstinMatch, subMatch, taxMatch, totalMatch].filter(Boolean).length;

    rows.push({
      fileName: gt.fileName || gt.invoiceNumber,
      matchedBillFound: Boolean(matchedBill),
      fields: {
        invoiceNumber: { expected: gt.invoiceNumber, actual: actualInv, match: invMatch },
        billDate: { expected: gt.billDate, actual: actualDate, match: dateMatch },
        sellerGstin: { expected: gt.sellerGstin, actual: actualGstin, match: gstinMatch },
        subtotal: { expected: gt.subtotal, actual: actualSub, match: subMatch },
        taxAmount: { expected: gt.taxAmount, actual: actualTax, match: taxMatch },
        grandTotal: { expected: gt.grandTotal, actual: actualTotal, match: totalMatch },
      },
      rowScorePercent: Number(((hits / 6) * 100).toFixed(1)),
    });
  }

  const n = Math.max(1, groundTruth.length);
  const pct = (hits: number) => Number(((hits / n) * 100).toFixed(1));
  const overall = Number((((invHits + dateHits + gstinHits + subHits + taxHits + totalHits) / (n * 6)) * 100).toFixed(1));

  return {
    rows,
    fieldAccuracy: {
      invoiceNumber: pct(invHits),
      billDate: pct(dateHits),
      sellerGstin: pct(gstinHits),
      subtotal: pct(subHits),
      taxAmount: pct(taxHits),
      grandTotal: pct(totalHits),
      overall: groundTruth.length === 0 ? 0 : overall,
    },
  };
}

export function exportAccuracyReportToExcel(
  comparisonRows: AccuracyComparisonRow[],
  fieldAccuracy: {
    invoiceNumber: number;
    billDate: number;
    sellerGstin: number;
    subtotal: number;
    taxAmount: number;
    grandTotal: number;
    overall: number;
  },
  filename = `LedgerSutra_Accuracy_Test_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
): void {
  const wb = XLSX.utils.book_new();
  const summarySheet = XLSX.utils.json_to_sheet([
    { Field: 'Invoice Number', 'Accuracy (%)': fieldAccuracy.invoiceNumber },
    { Field: 'Invoice Date', 'Accuracy (%)': fieldAccuracy.billDate },
    { Field: 'Seller GSTIN', 'Accuracy (%)': fieldAccuracy.sellerGstin },
    { Field: 'Taxable Subtotal', 'Accuracy (%)': fieldAccuracy.subtotal },
    { Field: 'Total GST / Tax', 'Accuracy (%)': fieldAccuracy.taxAmount },
    { Field: 'Grand Total', 'Accuracy (%)': fieldAccuracy.grandTotal },
    { Field: 'OVERALL FIELD ACCURACY', 'Accuracy (%)': fieldAccuracy.overall },
  ]);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Accuracy_Summary');

  const detailSheet = XLSX.utils.json_to_sheet(
    comparisonRows.map((r) => ({
      'File / Bill': r.fileName,
      'Bill Matched': r.matchedBillFound ? 'YES' : 'NO',
      'Expected Inv No': r.fields.invoiceNumber.expected,
      'Extracted Inv No': r.fields.invoiceNumber.actual,
      'Inv No Match': r.fields.invoiceNumber.match ? 'PASS' : 'FAIL',
      'Expected Date': r.fields.billDate.expected,
      'Extracted Date': r.fields.billDate.actual,
      'Date Match': r.fields.billDate.match ? 'PASS' : 'FAIL',
      'Expected GSTIN': r.fields.sellerGstin.expected,
      'Extracted GSTIN': r.fields.sellerGstin.actual,
      'GSTIN Match': r.fields.sellerGstin.match ? 'PASS' : 'FAIL',
      'Expected Taxable': r.fields.subtotal.expected,
      'Extracted Taxable': r.fields.subtotal.actual,
      'Taxable Match': r.fields.subtotal.match ? 'PASS' : 'FAIL',
      'Expected Tax': r.fields.taxAmount.expected,
      'Extracted Tax': r.fields.taxAmount.actual,
      'Tax Match': r.fields.taxAmount.match ? 'PASS' : 'FAIL',
      'Expected Total': r.fields.grandTotal.expected,
      'Extracted Total': r.fields.grandTotal.actual,
      'Total Match': r.fields.grandTotal.match ? 'PASS' : 'FAIL',
      'Row Score (%)': r.rowScorePercent,
    }))
  );
  XLSX.utils.book_append_sheet(wb, detailSheet, 'Invoice_Level_Results');
  XLSX.writeFile(wb, filename);
}
