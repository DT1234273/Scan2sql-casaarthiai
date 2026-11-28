import type { NoSQLBillItem, NoSQLBillRecord } from './App';
import {
  DEFAULT_CLIENT_ID,
  type BillApprovalStatus,
  type BillAuditTrailEntry,
  type ExtendedInvoiceFields,
} from './caWorkspaceTypes';

export const EXTENDED_STRING_FIELD_KEYS = [
  'irn',
  'ewayBillNo',
  'eInvoiceQr',
  'supplierPan',
  'supplierAddress',
  'supplierState',
  'buyerAddress',
  'buyerState',
  'poNumber',
  'dueDate',
  'paymentTerms',
  'currency',
  'bankName',
  'bankAccountNo',
  'bankIfsc',
  'boeNumber',
  'boeDate',
  'portCode',
] as const;

export const EXTENDED_NUMBER_FIELD_KEYS = ['otherCharges', 'roundOff'] as const;
export const EXTENDED_BOOLEAN_FIELD_KEYS = ['isBillOfEntry'] as const;

export const ALL_EXTENDED_INVOICE_FIELD_KEYS = [
  ...EXTENDED_STRING_FIELD_KEYS,
  ...EXTENDED_NUMBER_FIELD_KEYS,
  ...EXTENDED_BOOLEAN_FIELD_KEYS,
] as const;

export type ExtendedInvoiceFieldKey = (typeof ALL_EXTENDED_INVOICE_FIELD_KEYS)[number];

export interface ExtendedInvoiceEditorState {
  irn: string;
  ewayBillNo: string;
  eInvoiceQr: string;
  supplierPan: string;
  supplierAddress: string;
  supplierState: string;
  buyerAddress: string;
  buyerState: string;
  poNumber: string;
  dueDate: string;
  paymentTerms: string;
  currency: string;
  otherCharges: number | undefined;
  roundOff: number | undefined;
  bankName: string;
  bankAccountNo: string;
  bankIfsc: string;
  isBillOfEntry: boolean | undefined;
  boeNumber: string;
  boeDate: string;
  portCode: string;
}

export const EMPTY_EXTENDED_EDITOR_STATE: ExtendedInvoiceEditorState = {
  irn: '',
  ewayBillNo: '',
  eInvoiceQr: '',
  supplierPan: '',
  supplierAddress: '',
  supplierState: '',
  buyerAddress: '',
  buyerState: '',
  poNumber: '',
  dueDate: '',
  paymentTerms: '',
  currency: '',
  otherCharges: undefined,
  roundOff: undefined,
  bankName: '',
  bankAccountNo: '',
  bankIfsc: '',
  isBillOfEntry: undefined,
  boeNumber: '',
  boeDate: '',
  portCode: '',
};

const MONTH_NAME_MAP: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

function formatValidCalendarDate(year: number, month: number, day: number): string | undefined {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    year < 1900 ||
    year > 2100 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return undefined;
  }
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (
    dt.getUTCFullYear() !== year ||
    dt.getUTCMonth() !== month - 1 ||
    dt.getUTCDate() !== day
  ) {
    return undefined;
  }
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Safely parses common invoice date strings into canonical YYYY-MM-DD.
 * Rejects impossible calendar dates (e.g. 2026-02-30) and non-date text
 * rather than converting invalid values into plausible-looking dates.
 */
export function parseSafeIsoDate(val: unknown): string | undefined {
  if (typeof val !== 'string') return undefined;
  const raw = val.trim();
  if (!raw) return undefined;

  // YYYY-MM-DD or YYYY/MM/DD (optionally followed by ISO time)
  const isoMatch = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T\s].*)?$/);
  if (isoMatch) {
    return formatValidCalendarDate(
      Number(isoMatch[1]),
      Number(isoMatch[2]),
      Number(isoMatch[3])
    );
  }

  // DD-MM-YYYY, DD/MM/YYYY, or DD.MM.YYYY (Indian GST standard)
  const dmyMatch = raw.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmyMatch) {
    return formatValidCalendarDate(
      Number(dmyMatch[3]),
      Number(dmyMatch[2]),
      Number(dmyMatch[1])
    );
  }

  // DD Mon YYYY or DD-Mon-YYYY (e.g. "15 Mar 2026" or "15-Mar-2026")
  const namedMonthMatch = raw.match(/^(\d{1,2})[\s-]+([A-Za-z]+)[\s,-]+(\d{4})$/);
  if (namedMonthMatch) {
    const month = MONTH_NAME_MAP[namedMonthMatch[2].toLowerCase()];
    if (month) {
      return formatValidCalendarDate(
        Number(namedMonthMatch[3]),
        month,
        Number(namedMonthMatch[1])
      );
    }
  }

  return undefined;
}

/**
 * Safely parses numeric fields without discarding 0 or negative round-off values.
 * Rejects null, undefined, empty strings, booleans, NaN, Infinity, and malformed strings.
 */
export function parseSafeFiniteNumber(val: unknown): number | undefined {
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) return undefined;
    return Object.is(val, -0) ? 0 : val;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return undefined;
    const normalized = trimmed.replace(/,/g, '');
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(normalized)) {
      return undefined;
    }
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) return undefined;
    return Object.is(parsed, -0) ? 0 : parsed;
  }
  return undefined;
}

/**
 * Parses an HTML numeric input string for editor state:
 * empty string -> undefined; valid number (including 0 and negatives) -> number.
 */
export function parseEditorNumberInput(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  return parseSafeFiniteNumber(trimmed);
}

/**
 * Safely parses boolean values without inventing false/true from empty or unrelated inputs.
 */
export function parseSafeBoolean(val: unknown): boolean | undefined {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const lower = val.trim().toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
  }
  return undefined;
}

/**
 * Safely extracts a trimmed non-empty string value.
 */
export function parseSafeNonEmptyString(val: unknown): string | undefined {
  if (typeof val === 'string') {
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof val === 'number' && Number.isFinite(val)) {
    return String(val);
  }
  return undefined;
}

function assignIfDefined<K extends keyof ExtendedInvoiceFields>(
  target: Partial<ExtendedInvoiceFields>,
  key: K,
  value: ExtendedInvoiceFields[K] | undefined
): void {
  if (value !== undefined) {
    target[key] = value;
  }
}

/**
 * Extracts ONLY valid, explicitly present extended invoice fields from the backend
 * Gemini Vision JSON payload. Never invents or derives missing values (e.g. does not
 * derive supplierPan from sellerGstin, supplierState from placeOfSupply, or default currency).
 */
export function extractExtendedFieldsFromBackendResponse(
  raw: Record<string, unknown> | null | undefined
): Partial<ExtendedInvoiceFields> {
  if (!raw || typeof raw !== 'object') return {};

  const out: Partial<ExtendedInvoiceFields> = {};

  assignIfDefined(out, 'irn', parseSafeNonEmptyString(raw.irn));
  assignIfDefined(out, 'ewayBillNo', parseSafeNonEmptyString(raw.ewayBillNo));
  assignIfDefined(out, 'eInvoiceQr', parseSafeNonEmptyString(raw.eInvoiceQr));
  const pan = parseSafeNonEmptyString(raw.supplierPan);
  assignIfDefined(out, 'supplierPan', pan ? pan.toUpperCase() : undefined);

  assignIfDefined(out, 'supplierAddress', parseSafeNonEmptyString(raw.supplierAddress));
  assignIfDefined(out, 'supplierState', parseSafeNonEmptyString(raw.supplierState));
  assignIfDefined(out, 'buyerAddress', parseSafeNonEmptyString(raw.buyerAddress));
  assignIfDefined(out, 'buyerState', parseSafeNonEmptyString(raw.buyerState));

  assignIfDefined(out, 'poNumber', parseSafeNonEmptyString(raw.poNumber));
  assignIfDefined(out, 'dueDate', parseSafeIsoDate(raw.dueDate));
  assignIfDefined(out, 'paymentTerms', parseSafeNonEmptyString(raw.paymentTerms));
  const curr = parseSafeNonEmptyString(raw.currency);
  assignIfDefined(out, 'currency', curr ? curr.toUpperCase() : undefined);
  assignIfDefined(out, 'otherCharges', parseSafeFiniteNumber(raw.otherCharges));
  assignIfDefined(out, 'roundOff', parseSafeFiniteNumber(raw.roundOff));

  assignIfDefined(out, 'bankName', parseSafeNonEmptyString(raw.bankName));
  assignIfDefined(out, 'bankAccountNo', parseSafeNonEmptyString(raw.bankAccountNo));
  const ifsc = parseSafeNonEmptyString(raw.bankIfsc);
  assignIfDefined(out, 'bankIfsc', ifsc ? ifsc.toUpperCase() : undefined);

  assignIfDefined(out, 'isBillOfEntry', parseSafeBoolean(raw.isBillOfEntry));
  assignIfDefined(out, 'boeNumber', parseSafeNonEmptyString(raw.boeNumber));
  assignIfDefined(out, 'boeDate', parseSafeIsoDate(raw.boeDate));
  const port = parseSafeNonEmptyString(raw.portCode);
  assignIfDefined(out, 'portCode', port ? port.toUpperCase() : undefined);

  return out;
}

/**
 * Merges extracted extended fields into scanner editor state according to draft identity:
 * - New independent invoice (`isSameDraftRescan === false`): resets to EMPTY_EXTENDED_EDITOR_STATE
 *   first so zero fields leak from the previous invoice, then populates valid extracted fields.
 * - Same-draft re-scan (`isSameDraftRescan === true`): preserves manually edited values whenever
 *   the extraction response omits or returns null/empty/invalid for a field.
 */
export function mergeExtendedFieldsForEditor(params: {
  extracted: Partial<ExtendedInvoiceFields>;
  current: ExtendedInvoiceEditorState;
  isSameDraftRescan: boolean;
}): ExtendedInvoiceEditorState {
  const { extracted, current, isSameDraftRescan } = params;
  const base: ExtendedInvoiceEditorState = isSameDraftRescan
    ? { ...current }
    : { ...EMPTY_EXTENDED_EDITOR_STATE };

  for (const key of EXTENDED_STRING_FIELD_KEYS) {
    const val = extracted[key];
    if (typeof val === 'string' && val.trim().length > 0) {
      base[key] = val.trim();
    }
  }

  for (const key of EXTENDED_NUMBER_FIELD_KEYS) {
    const val = extracted[key];
    if (typeof val === 'number' && Number.isFinite(val)) {
      base[key] = Object.is(val, -0) ? 0 : val;
    }
  }

  if (typeof extracted.isBillOfEntry === 'boolean') {
    base.isBillOfEntry = extracted.isBillOfEntry;
  }

  return base;
}

/**
 * Converts editor state into the Partial<ExtendedInvoiceFields> stored on NoSQLBillRecord.
 * Preserves numeric 0 and boolean false while omitting empty/unset fields.
 */
export function editorStateToBillExtendedFields(
  state: ExtendedInvoiceEditorState
): Partial<ExtendedInvoiceFields> {
  const out: Partial<ExtendedInvoiceFields> = {};

  for (const key of EXTENDED_STRING_FIELD_KEYS) {
    const trimmed = state[key].trim();
    if (trimmed.length > 0) {
      if (key === 'dueDate' || key === 'boeDate') {
        const parsed = parseSafeIsoDate(trimmed);
        if (parsed) out[key] = parsed;
      } else if (key === 'supplierPan' || key === 'bankIfsc' || key === 'currency' || key === 'portCode') {
        out[key] = trimmed.toUpperCase();
      } else {
        out[key] = trimmed;
      }
    }
  }

  for (const key of EXTENDED_NUMBER_FIELD_KEYS) {
    const val = state[key];
    if (typeof val === 'number' && Number.isFinite(val)) {
      out[key] = Object.is(val, -0) ? 0 : val;
    }
  }

  if (typeof state.isBillOfEntry === 'boolean') {
    out.isBillOfEntry = state.isBillOfEntry;
  }

  return out;
}

/**
 * Hydrates scanner editor state from a saved NoSQLBillRecord (guest localStorage or Firestore).
 */
export function billRecordToExtendedEditorState(
  bill: Partial<NoSQLBillRecord> | null | undefined
): ExtendedInvoiceEditorState {
  if (!bill) return { ...EMPTY_EXTENDED_EDITOR_STATE };
  const extracted = extractExtendedFieldsFromBackendResponse(
    bill as unknown as Record<string, unknown>
  );
  return mergeExtendedFieldsForEditor({
    extracted,
    current: EMPTY_EXTENDED_EDITOR_STATE,
    isSameDraftRescan: false,
  });
}

/**
 * Merges extended fields when combining a duplicate bill into an existing saved bill.
 * Incoming valid values take precedence while preserving existing values for omitted fields
 * and preserving numeric 0 / boolean false.
 */
export function mergeBillExtendedFieldsForDuplicate(
  existingBill: Partial<NoSQLBillRecord>,
  incomingBill: Partial<NoSQLBillRecord>
): Partial<ExtendedInvoiceFields> {
  const existingState = billRecordToExtendedEditorState(existingBill);
  const incomingExtracted = extractExtendedFieldsFromBackendResponse(
    incomingBill as unknown as Record<string, unknown>
  );
  const mergedState = mergeExtendedFieldsForEditor({
    extracted: incomingExtracted,
    current: existingState,
    isSameDraftRescan: true,
  });
  return editorStateToBillExtendedFields(mergedState);
}

// ---------------------------------------------------------------------------
// Firestore Strict-Schema Persistence Helpers
// Encodes all 21 extended fields + audit metadata inside `extraHeaderFieldsJson`
// (strictly <= 10,000 chars) so existing Firestore paths & firestore.rules
// remain 100% unchanged.
// ---------------------------------------------------------------------------

const INTERNAL_EXTRA_META_KEYS = new Set([
  'clientId',
  'approvalStatus',
  'rejectionReason',
  'auditTrailJson',
  '__uiApprovalStatus',
  '__needsReview',
  '__ext',
]);

export function normalizeApprovalStatusForFirestore(
  status: BillApprovalStatus | string | undefined
): 'draft' | 'pending_review' | 'approved' | 'rejected' {
  const lower = String(status || '').trim().toLowerCase();
  if (lower === 'draft') return 'draft';
  if (lower === 'pending_review' || lower === 'pending review') return 'pending_review';
  if (lower === 'rejected') return 'rejected';
  return 'approved';
}

export function restoreUiApprovalStatus(
  uiStatusRaw: unknown,
  firestoreStatusRaw: unknown
): BillApprovalStatus {
  const ui = typeof uiStatusRaw === 'string' ? uiStatusRaw.trim() : '';
  if (
    ui === 'Draft' ||
    ui === 'Pending Review' ||
    ui === 'Approved' ||
    ui === 'Rejected' ||
    ui === 'draft' ||
    ui === 'pending_review' ||
    ui === 'approved' ||
    ui === 'rejected'
  ) {
    return ui;
  }
  const lower = String(firestoreStatusRaw || '').trim().toLowerCase();
  if (lower === 'draft') return 'Draft';
  if (lower === 'pending_review' || lower === 'pending review') return 'Pending Review';
  if (lower === 'rejected') return 'Rejected';
  return 'Approved';
}

function clampStringForCodec(val: unknown, maxLen: number, minLen = 0, fallback = ''): string {
  const str = typeof val === 'string' ? val.trim() : '';
  if (str.length < minLen) return fallback;
  return str.length > maxLen ? str.slice(0, maxLen) : str;
}

function clampCurrencyForCodec(val: unknown): number {
  const num = Number(val);
  if (!Number.isFinite(num)) return 0;
  return Math.max(-1000000000, Math.min(1000000000, Number(num.toFixed(2))));
}

function clampConfidenceForCodec(val: unknown): number {
  const num = Number(val);
  if (!Number.isFinite(num)) return 100;
  return Math.max(0, Math.min(100, Number(num.toFixed(2))));
}

export function sanitizeFirestoreDocId(rawId: string | undefined, prefix: string): string {
  const cleaned = (rawId || '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 100);
  if (cleaned.length >= 2) return cleaned;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Serializes user extraHeaderFields, Maker-Checker metadata, and all 21 extended fields
 * into a compact JSON string strictly within Firestore's [2..10000] byte limit.
 */
export function serializeExtraHeaderFieldsJson(
  clientId: string,
  bill: NoSQLBillRecord
): string {
  const extendedFields = extractExtendedFieldsFromBackendResponse(
    bill as unknown as Record<string, unknown>
  );

  // Strip any previously leaked internal keys from user extraHeaderFields
  const cleanUserExtras: Record<string, string> = {};
  if (bill.extraHeaderFields && typeof bill.extraHeaderFields === 'object') {
    for (const [k, v] of Object.entries(bill.extraHeaderFields)) {
      if (!INTERNAL_EXTRA_META_KEYS.has(k) && typeof v === 'string') {
        cleanUserExtras[k] = v;
      }
    }
  }

  const normalizedFirestoreStatus = normalizeApprovalStatusForFirestore(bill.approvalStatus);
  const uiStatus = bill.approvalStatus || restoreUiApprovalStatus(undefined, normalizedFirestoreStatus);
  const auditArray = Array.isArray(bill.auditTrail) ? bill.auditTrail : [];

  const buildCandidate = (
    userExtras: Record<string, string>,
    ext: Partial<ExtendedInvoiceFields>,
    auditEntries: BillAuditTrailEntry[]
  ): Record<string, unknown> => {
    const obj: Record<string, unknown> = {
      ...userExtras,
      clientId,
      approvalStatus: normalizedFirestoreStatus,
      __uiApprovalStatus: uiStatus,
      rejectionReason: String(bill.rejectionReason || ''),
      auditTrailJson: JSON.stringify(auditEntries),
    };
    if (typeof bill.needsReview === 'boolean') {
      obj.__needsReview = bill.needsReview;
    }
    if (Object.keys(ext).length > 0) {
      obj.__ext = ext;
    }
    return obj;
  };

  const tryStringify = (obj: Record<string, unknown>): string | null => {
    try {
      const str = JSON.stringify(obj);
      if (str.length >= 2 && str.length <= 10000) return str;
    } catch {
      // fall through
    }
    return null;
  };

  // Attempt 1: Full fidelity payload
  const attempt1 = tryStringify(buildCandidate(cleanUserExtras, extendedFields, auditArray));
  if (attempt1) return attempt1;

  // Attempt 2: Trim audit trail to latest 10 entries
  const trimmedAudit = auditArray.slice(-10);
  const attempt2 = tryStringify(buildCandidate(cleanUserExtras, extendedFields, trimmedAudit));
  if (attempt2) return attempt2;

  // Attempt 3: Clamp verbose QR / address text while keeping all 21 extended fields present
  const compactExt: Partial<ExtendedInvoiceFields> = { ...extendedFields };
  if (typeof compactExt.eInvoiceQr === 'string' && compactExt.eInvoiceQr.length > 1500) {
    compactExt.eInvoiceQr = compactExt.eInvoiceQr.slice(0, 1500);
  }
  if (typeof compactExt.supplierAddress === 'string' && compactExt.supplierAddress.length > 500) {
    compactExt.supplierAddress = compactExt.supplierAddress.slice(0, 500);
  }
  if (typeof compactExt.buyerAddress === 'string' && compactExt.buyerAddress.length > 500) {
    compactExt.buyerAddress = compactExt.buyerAddress.slice(0, 500);
  }
  const attempt3 = tryStringify(buildCandidate(cleanUserExtras, compactExt, trimmedAudit.slice(-3)));
  if (attempt3) return attempt3;

  // Attempt 4: Preserve extended fields & core metadata over oversized custom headers
  const attempt4 = tryStringify(buildCandidate({}, compactExt, []));
  if (attempt4) return attempt4;

  return '{}';
}

export interface FirestoreBillDocumentPayload {
  id: string;
  ownerId: string;
  clientId: string;
  approvalStatus: 'draft' | 'pending_review' | 'approved' | 'rejected';
  fileName: string;
  shopName: string;
  sellerGstin: string;
  buyerName: string;
  buyerGstin: string;
  invoiceNumber: string;
  billDate: string;
  placeOfSupply: string;
  voucherType: string;
  paymentMode: string;
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  confidence: number;
  rawText: string;
  createdAt: string;
  extraHeaderFieldsJson: string;
  itemsJson: string;
  syncedAt: unknown;
}

/**
 * Pure builder producing the exact 27-key Firestore bill document validated by
 * `isValidClientBill` in `firestore.rules`.
 */
export function buildFirestoreBillRecordPayload(
  uid: string,
  clientId: string,
  bill: NoSQLBillRecord,
  syncedAtValue: unknown
): { billId: string; payload: FirestoreBillDocumentPayload } {
  const billId = sanitizeFirestoreDocId(bill.id, 'BILL');
  const clampedClientId = clampStringForCodec(clientId, 120, 1, DEFAULT_CLIENT_ID);
  const extraHeaderFieldsJson = serializeExtraHeaderFieldsJson(clampedClientId, bill);

  let itemsJson = '[]';
  try {
    const str = JSON.stringify(Array.isArray(bill.items) ? bill.items.slice(0, 100) : []);
    if (str.length >= 2 && str.length <= 100000) {
      itemsJson = str;
    }
  } catch {
    itemsJson = '[]';
  }

  const approvalStatus = normalizeApprovalStatusForFirestore(
    bill.approvalStatus || bill.extraHeaderFields?.approvalStatus
  );

  return {
    billId,
    payload: {
      id: billId,
      ownerId: uid,
      clientId: clampedClientId,
      approvalStatus,
      fileName: clampStringForCodec(bill.fileName, 250, 1, 'Uploaded_Bill.pdf'),
      shopName: clampStringForCodec(bill.shopName, 250, 1, 'Vendor / Shop'),
      sellerGstin: clampStringForCodec(bill.sellerGstin, 30, 0, ''),
      buyerName: clampStringForCodec(bill.buyerName, 250, 0, ''),
      buyerGstin: clampStringForCodec(bill.buyerGstin, 30, 0, ''),
      invoiceNumber: clampStringForCodec(bill.invoiceNumber, 120, 1, 'INV-001'),
      billDate: clampStringForCodec(bill.billDate, 40, 1, new Date().toISOString().slice(0, 10)),
      placeOfSupply: clampStringForCodec(bill.placeOfSupply, 120, 0, ''),
      voucherType: clampStringForCodec(bill.voucherType, 80, 1, 'Tax Invoice'),
      paymentMode: clampStringForCodec(bill.paymentMode, 80, 1, 'Cash / UPI'),
      subtotal: clampCurrencyForCodec(bill.subtotal),
      cgstAmount: clampCurrencyForCodec(bill.cgstAmount),
      sgstAmount: clampCurrencyForCodec(bill.sgstAmount),
      igstAmount: clampCurrencyForCodec(bill.igstAmount),
      taxAmount: clampCurrencyForCodec(bill.taxAmount),
      discountAmount: clampCurrencyForCodec(bill.discountAmount),
      grandTotal: clampCurrencyForCodec(bill.grandTotal),
      confidence: clampConfidenceForCodec(bill.confidence),
      rawText: clampStringForCodec(bill.rawText, 50000, 0, ''),
      createdAt: clampStringForCodec(
        bill.createdAt,
        40,
        1,
        new Date().toISOString().slice(0, 16).replace('T', ' ')
      ),
      extraHeaderFieldsJson,
      itemsJson,
      syncedAt: syncedAtValue,
    },
  };
}

/**
 * Pure parser hydrating a Firestore bill document snapshot back into a full
 * NoSQLBillRecord including all 21 extended fields, clientId, approvalStatus,
 * needsReview, rejectionReason, auditTrail, and clean user extraHeaderFields.
 */
export function parseFirestoreBillDocument(
  docId: string,
  d: Record<string, unknown>
): NoSQLBillRecord {
  let rawExtraObj: Record<string, unknown> = {};
  if (typeof d.extraHeaderFieldsJson === 'string') {
    try {
      const parsed = JSON.parse(d.extraHeaderFieldsJson);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        rawExtraObj = parsed as Record<string, unknown>;
      }
    } catch {
      // ignore malformed json
    }
  } else if (d.extraHeaderFields && typeof d.extraHeaderFields === 'object') {
    rawExtraObj = { ...(d.extraHeaderFields as Record<string, unknown>) };
  }

  // Extract clean user-facing custom header fields (excluding internal codec metadata)
  const extraHeaderFields: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawExtraObj)) {
    if (!INTERNAL_EXTRA_META_KEYS.has(k) && typeof v === 'string') {
      extraHeaderFields[k] = v;
    }
  }

  // Hydrate extended fields from __ext payload (with fallback to direct properties on `d` if present)
  const embeddedExt =
    rawExtraObj.__ext && typeof rawExtraObj.__ext === 'object' && !Array.isArray(rawExtraObj.__ext)
      ? (rawExtraObj.__ext as Record<string, unknown>)
      : {};
  const extendedFields = extractExtendedFieldsFromBackendResponse({
    ...d,
    ...embeddedExt,
  });

  let auditTrail: BillAuditTrailEntry[] | undefined;
  if (typeof rawExtraObj.auditTrailJson === 'string') {
    try {
      const parsedTrail = JSON.parse(rawExtraObj.auditTrailJson);
      if (Array.isArray(parsedTrail)) {
        auditTrail = parsedTrail as BillAuditTrailEntry[];
      }
    } catch {
      // ignore
    }
  } else if (Array.isArray(d.auditTrail)) {
    auditTrail = d.auditTrail as BillAuditTrailEntry[];
  }

  let items: NoSQLBillItem[] = [];
  if (typeof d.itemsJson === 'string') {
    try {
      const parsed = JSON.parse(d.itemsJson);
      if (Array.isArray(parsed)) {
        items = parsed as NoSQLBillItem[];
      }
    } catch {
      // ignore
    }
  } else if (Array.isArray(d.items)) {
    items = d.items as NoSQLBillItem[];
  }

  const resolvedClientId =
    parseSafeNonEmptyString(d.clientId) ||
    parseSafeNonEmptyString(rawExtraObj.clientId) ||
    DEFAULT_CLIENT_ID;

  const resolvedApprovalStatus = restoreUiApprovalStatus(
    rawExtraObj.__uiApprovalStatus,
    d.approvalStatus || rawExtraObj.approvalStatus
  );

  const resolvedRejectionReason =
    parseSafeNonEmptyString(rawExtraObj.rejectionReason) ||
    parseSafeNonEmptyString(d.rejectionReason);

  const resolvedNeedsReview =
    typeof rawExtraObj.__needsReview === 'boolean'
      ? rawExtraObj.__needsReview
      : typeof d.needsReview === 'boolean'
      ? d.needsReview
      : undefined;

  return {
    id: String(d.id || docId),
    clientId: resolvedClientId,
    fileName: String(d.fileName || 'Uploaded_Bill.pdf'),
    shopName: String(d.shopName || 'Vendor'),
    sellerGstin: String(d.sellerGstin || ''),
    buyerName: String(d.buyerName || ''),
    buyerGstin: String(d.buyerGstin || ''),
    invoiceNumber: String(d.invoiceNumber || ''),
    billDate: String(d.billDate || ''),
    placeOfSupply: String(d.placeOfSupply || ''),
    voucherType: String(d.voucherType || 'Tax Invoice'),
    paymentMode: String(d.paymentMode || 'Cash / UPI'),
    subtotal: parseSafeFiniteNumber(d.subtotal) ?? 0,
    cgstAmount: parseSafeFiniteNumber(d.cgstAmount) ?? 0,
    sgstAmount: parseSafeFiniteNumber(d.sgstAmount) ?? 0,
    igstAmount: parseSafeFiniteNumber(d.igstAmount) ?? 0,
    taxAmount: parseSafeFiniteNumber(d.taxAmount) ?? 0,
    discountAmount: parseSafeFiniteNumber(d.discountAmount) ?? 0,
    grandTotal: parseSafeFiniteNumber(d.grandTotal) ?? 0,
    confidence: parseSafeFiniteNumber(d.confidence) ?? 100,
    rawText: String(d.rawText || ''),
    createdAt: String(d.createdAt || ''),
    extraHeaderFields,
    items,
    approvalStatus: resolvedApprovalStatus,
    ...(resolvedRejectionReason !== undefined ? { rejectionReason: resolvedRejectionReason } : {}),
    ...(resolvedNeedsReview !== undefined ? { needsReview: resolvedNeedsReview } : {}),
    ...(auditTrail !== undefined ? { auditTrail } : {}),
    ...extendedFields,
  };
}

/**
 * Enforces strict client workspace isolation for saved bills.
 * Legacy guest records without an explicit `clientId` belong strictly to `DEFAULT_CLIENT_ID`
 * so switching to another client workspace never exposes them.
 */
export function filterBillsByClientWorkspace(
  bills: NoSQLBillRecord[],
  activeClientId: string
): NoSQLBillRecord[] {
  const targetClientId = (activeClientId || DEFAULT_CLIENT_ID).trim() || DEFAULT_CLIENT_ID;
  return bills.filter((bill) => {
    const billClientId = (bill.clientId || DEFAULT_CLIENT_ID).trim() || DEFAULT_CLIENT_ID;
    return billClientId === targetClientId;
  });
}
