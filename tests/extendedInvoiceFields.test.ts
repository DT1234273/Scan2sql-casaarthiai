import test from 'node:test';
import assert from 'node:assert/strict';
import type { NoSQLBillRecord } from '../src/App';
import { DEFAULT_CLIENT_ID, DEFAULT_TALLY_SETTINGS } from '../src/caWorkspaceTypes';
import {
  ALL_EXTENDED_INVOICE_FIELD_KEYS,
  EMPTY_EXTENDED_EDITOR_STATE,
  billRecordToExtendedEditorState,
  buildFirestoreBillRecordPayload,
  editorStateToBillExtendedFields,
  extractExtendedFieldsFromBackendResponse,
  filterBillsByClientWorkspace,
  mergeBillExtendedFieldsForDuplicate,
  mergeExtendedFieldsForEditor,
  parseEditorNumberInput,
  parseFirestoreBillDocument,
  parseSafeIsoDate,
} from '../src/extendedInvoiceFields';
import {
  generateTallyPrimeXml,
  validateBillsForTallyExport,
} from '../src/tallyAndExports';

// Purely synthetic placeholder fixture data (no real invoice or taxpayer records)
const SYNTHETIC_FULL_GEMINI_RESPONSE: Record<string, unknown> = {
  shopName: 'Synthetic Vendor Components Pvt Ltd',
  sellerGstin: '27AAAAA0000A1Z5',
  buyerName: 'Synthetic Buyer Manufacturing LLP',
  buyerGstin: '29BBBBB1111B1Z2',
  invoiceNumber: 'SYN-2026-0001',
  billDate: '2026-04-12',
  placeOfSupply: '29-Karnataka',
  subtotal: 10000,
  cgstAmount: 0,
  sgstAmount: 0,
  igstAmount: 1800,
  taxAmount: 1800,
  discountAmount: 0,
  grandTotal: 11850,
  // All 21 extended fields:
  irn: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  ewayBillNo: '191000000001',
  eInvoiceQr: 'SYNTHETIC_SIGNED_QR_TOKEN_001',
  supplierPan: 'aaaaa0000a',
  supplierAddress: 'Plot 101, Synthetic Industrial Estate, Pune 411001',
  supplierState: 'Maharashtra',
  buyerAddress: 'Unit 202, Example Tech Park, Bengaluru 560001',
  buyerState: 'Karnataka',
  poNumber: 'PO-SYN-2026-88',
  dueDate: '12/05/2026',
  paymentTerms: 'Net 30 Days',
  currency: 'inr',
  otherCharges: 50.25,
  roundOff: -0.25,
  bankName: 'Synthetic Commercial Bank',
  bankAccountNo: '0000111122223333',
  bankIfsc: 'synb0000123',
  isBillOfEntry: true,
  boeNumber: 'BOE-9900112',
  boeDate: '10-04-2026',
  portCode: 'innsa1',
};

function makeSyntheticBill(overrides: Partial<NoSQLBillRecord> = {}): NoSQLBillRecord {
  return {
    id: 'BILL-SYN-001',
    clientId: DEFAULT_CLIENT_ID,
    fileName: 'synthetic_invoice_001.pdf',
    shopName: 'Synthetic Vendor Components Pvt Ltd',
    sellerGstin: '27AAAAA0000A1Z5',
    buyerName: 'Synthetic Buyer Manufacturing LLP',
    buyerGstin: '29BBBBB1111B1Z2',
    invoiceNumber: 'SYN-2026-0001',
    billDate: '2026-04-12',
    placeOfSupply: '29-Karnataka',
    voucherType: 'Tax Invoice',
    paymentMode: 'Bank Transfer / NEFT',
    subtotal: 10000,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 1800,
    taxAmount: 1800,
    discountAmount: 0,
    grandTotal: 11850,
    confidence: 97.5,
    rawText: 'SYNTHETIC VERBATIM OCR TRANSCRIPT LINE 1\nINV SYN-2026-0001',
    createdAt: '2026-04-12 10:30',
    extraHeaderFields: { VehicleNo: 'MH12AB0001' },
    items: [
      {
        id: 'item-1',
        itemName: 'Synthetic Sensor Module',
        hsnSac: '8542',
        quantity: 10,
        unit: 'NOS',
        unitPrice: 1000,
        discount: 0,
        taxableValue: 10000,
        gstRate: 18,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 1800,
        lineTotal: 11800,
        extraColumns: {},
      },
    ],
    approvalStatus: 'Pending Review',
    needsReview: true,
    rejectionReason: '',
    auditTrail: [
      {
        action: 'Uploaded',
        byEmail: 'ca.synthetic@example.com',
        byRole: 'Staff',
        timestamp: '2026-04-12 10:30',
        note: 'Synthetic test entry',
      },
    ],
    ...overrides,
  };
}

test('1. Gemini extraction response with all 21 extended fields populates every editor field', () => {
  const extracted = extractExtendedFieldsFromBackendResponse(SYNTHETIC_FULL_GEMINI_RESPONSE);
  const editorState = mergeExtendedFieldsForEditor({
    extracted,
    current: EMPTY_EXTENDED_EDITOR_STATE,
    isSameDraftRescan: false,
  });

  assert.equal(ALL_EXTENDED_INVOICE_FIELD_KEYS.length, 21);
  assert.equal(editorState.irn, SYNTHETIC_FULL_GEMINI_RESPONSE.irn);
  assert.equal(editorState.ewayBillNo, '191000000001');
  assert.equal(editorState.eInvoiceQr, 'SYNTHETIC_SIGNED_QR_TOKEN_001');
  assert.equal(editorState.supplierPan, 'AAAAA0000A');
  assert.equal(editorState.supplierAddress, 'Plot 101, Synthetic Industrial Estate, Pune 411001');
  assert.equal(editorState.supplierState, 'Maharashtra');
  assert.equal(editorState.buyerAddress, 'Unit 202, Example Tech Park, Bengaluru 560001');
  assert.equal(editorState.buyerState, 'Karnataka');
  assert.equal(editorState.poNumber, 'PO-SYN-2026-88');
  assert.equal(editorState.dueDate, '2026-05-12');
  assert.equal(editorState.paymentTerms, 'Net 30 Days');
  assert.equal(editorState.currency, 'INR');
  assert.equal(editorState.otherCharges, 50.25);
  assert.equal(editorState.roundOff, -0.25);
  assert.equal(editorState.bankName, 'Synthetic Commercial Bank');
  assert.equal(editorState.bankAccountNo, '0000111122223333');
  assert.equal(editorState.bankIfsc, 'SYNB0000123');
  assert.equal(editorState.isBillOfEntry, true);
  assert.equal(editorState.boeNumber, 'BOE-9900112');
  assert.equal(editorState.boeDate, '2026-04-10');
  assert.equal(editorState.portCode, 'INNSA1');
});

test('2. Numeric zero, negative roundOff, and boolean false are preserved without truthiness loss', () => {
  const extracted = extractExtendedFieldsFromBackendResponse({
    otherCharges: 0,
    roundOff: -0.45,
    isBillOfEntry: false,
  });
  assert.strictEqual(extracted.otherCharges, 0);
  assert.strictEqual(extracted.roundOff, -0.45);
  assert.strictEqual(extracted.isBillOfEntry, false);

  const editorState = mergeExtendedFieldsForEditor({
    extracted,
    current: EMPTY_EXTENDED_EDITOR_STATE,
    isSameDraftRescan: false,
  });
  assert.strictEqual(editorState.otherCharges, 0);
  assert.strictEqual(editorState.roundOff, -0.45);
  assert.strictEqual(editorState.isBillOfEntry, false);

  const persisted = editorStateToBillExtendedFields(editorState);
  assert.strictEqual(persisted.otherCharges, 0);
  assert.strictEqual(persisted.roundOff, -0.45);
  assert.strictEqual(persisted.isBillOfEntry, false);

  // Also test zero for roundOff and string numeric inputs
  const extractedZeroStrings = extractExtendedFieldsFromBackendResponse({
    otherCharges: '0',
    roundOff: '0.00',
    isBillOfEntry: 'false',
  });
  assert.strictEqual(extractedZeroStrings.otherCharges, 0);
  assert.strictEqual(extractedZeroStrings.roundOff, 0);
  assert.strictEqual(extractedZeroStrings.isBillOfEntry, false);

  // Editor numeric input parser
  assert.strictEqual(parseEditorNumberInput('0'), 0);
  assert.strictEqual(parseEditorNumberInput('-0.45'), -0.45);
  assert.strictEqual(parseEditorNumberInput(''), undefined);
  assert.strictEqual(parseEditorNumberInput('abc'), undefined);
});

test('3. Missing, null, empty, or invalid AI values do not overwrite manual edits on same-draft re-scan and never invent dates or fields', () => {
  const manuallyCorrected = mergeExtendedFieldsForEditor({
    extracted: extractExtendedFieldsFromBackendResponse(SYNTHETIC_FULL_GEMINI_RESPONSE),
    current: EMPTY_EXTENDED_EDITOR_STATE,
    isSameDraftRescan: false,
  });

  // Simulate a same-draft re-scan returning nulls, empty strings, impossible dates, and invalid numbers
  const partialRescanPayload: Record<string, unknown> = {
    sellerGstin: '27AAAAA0000A1Z5',
    placeOfSupply: '27-Maharashtra',
    irn: null,
    ewayBillNo: '',
    eInvoiceQr: '   ',
    supplierPan: undefined,
    supplierState: '',
    poNumber: 'PO-UPDATED-99',
    dueDate: '2026-02-30', // impossible calendar date -> must be rejected
    boeDate: 'Within 15 days', // non-date text -> must be rejected
    otherCharges: 'N/A', // invalid number -> must be rejected
    roundOff: null,
    isBillOfEntry: '',
  };

  // Standalone date validation sanity checks
  assert.strictEqual(parseSafeIsoDate('2026-02-30'), undefined);
  assert.strictEqual(parseSafeIsoDate('31/04/2026'), undefined);
  assert.strictEqual(parseSafeIsoDate('Not Available'), undefined);
  assert.strictEqual(parseSafeIsoDate('28 Feb 2026'), '2026-02-28');

  const extractedRescan = extractExtendedFieldsFromBackendResponse(partialRescanPayload);
  // Must NOT derive supplierPan from sellerGstin or supplierState from placeOfSupply or default currency
  assert.strictEqual(extractedRescan.supplierPan, undefined);
  assert.strictEqual(extractedRescan.supplierState, undefined);
  assert.strictEqual(extractedRescan.currency, undefined);
  assert.strictEqual(extractedRescan.dueDate, undefined);
  assert.strictEqual(extractedRescan.boeDate, undefined);
  assert.strictEqual(extractedRescan.otherCharges, undefined);
  assert.strictEqual(extractedRescan.roundOff, undefined);
  assert.strictEqual(extractedRescan.isBillOfEntry, undefined);

  const afterRescan = mergeExtendedFieldsForEditor({
    extracted: extractedRescan,
    current: manuallyCorrected,
    isSameDraftRescan: true,
  });

  // Explicitly returned valid field updates cleanly
  assert.equal(afterRescan.poNumber, 'PO-UPDATED-99');
  // All manually edited fields where AI returned null/empty/invalid remain intact
  assert.equal(afterRescan.irn, manuallyCorrected.irn);
  assert.equal(afterRescan.ewayBillNo, manuallyCorrected.ewayBillNo);
  assert.equal(afterRescan.eInvoiceQr, manuallyCorrected.eInvoiceQr);
  assert.equal(afterRescan.supplierPan, manuallyCorrected.supplierPan);
  assert.equal(afterRescan.supplierState, manuallyCorrected.supplierState);
  assert.equal(afterRescan.dueDate, '2026-05-12');
  assert.equal(afterRescan.boeDate, '2026-04-10');
  assert.strictEqual(afterRescan.otherCharges, 50.25);
  assert.strictEqual(afterRescan.roundOff, -0.25);
  assert.strictEqual(afterRescan.isBillOfEntry, true);
});

test('4. Scanning a new independent invoice clears previous invoice extended fields (zero leakage)', () => {
  const invoiceAEditor = mergeExtendedFieldsForEditor({
    extracted: extractExtendedFieldsFromBackendResponse(SYNTHETIC_FULL_GEMINI_RESPONSE),
    current: EMPTY_EXTENDED_EDITOR_STATE,
    isSameDraftRescan: false,
  });

  // Invoice B only provides poNumber and otherCharges: 0
  const invoiceBResponse = extractExtendedFieldsFromBackendResponse({
    poNumber: 'PO-INVOICE-B-02',
    otherCharges: 0,
  });

  const invoiceBEditor = mergeExtendedFieldsForEditor({
    extracted: invoiceBResponse,
    current: invoiceAEditor,
    isSameDraftRescan: false,
  });

  assert.equal(invoiceBEditor.poNumber, 'PO-INVOICE-B-02');
  assert.strictEqual(invoiceBEditor.otherCharges, 0);
  // None of Invoice A's other 19 extended fields may leak into Invoice B
  assert.equal(invoiceBEditor.irn, '');
  assert.equal(invoiceBEditor.ewayBillNo, '');
  assert.equal(invoiceBEditor.eInvoiceQr, '');
  assert.equal(invoiceBEditor.supplierPan, '');
  assert.equal(invoiceBEditor.supplierAddress, '');
  assert.equal(invoiceBEditor.supplierState, '');
  assert.equal(invoiceBEditor.buyerAddress, '');
  assert.equal(invoiceBEditor.buyerState, '');
  assert.equal(invoiceBEditor.dueDate, '');
  assert.equal(invoiceBEditor.paymentTerms, '');
  assert.equal(invoiceBEditor.currency, '');
  assert.strictEqual(invoiceBEditor.roundOff, undefined);
  assert.equal(invoiceBEditor.bankName, '');
  assert.equal(invoiceBEditor.bankAccountNo, '');
  assert.equal(invoiceBEditor.bankIfsc, '');
  assert.strictEqual(invoiceBEditor.isBillOfEntry, undefined);
  assert.equal(invoiceBEditor.boeNumber, '');
  assert.equal(invoiceBEditor.boeDate, '');
  assert.equal(invoiceBEditor.portCode, '');
});

test('5. Guest localStorage save and reload retains all 21 extended fields including 0 and false', () => {
  const extracted = extractExtendedFieldsFromBackendResponse({
    ...SYNTHETIC_FULL_GEMINI_RESPONSE,
    otherCharges: 0,
    roundOff: 0,
    isBillOfEntry: false,
  });
  const editorBeforeSave = mergeExtendedFieldsForEditor({
    extracted,
    current: EMPTY_EXTENDED_EDITOR_STATE,
    isSameDraftRescan: false,
  });

  const guestBill = makeSyntheticBill({
    ...editorStateToBillExtendedFields(editorBeforeSave),
  });

  // Simulate localStorage JSON persistence & reload
  const serialized = JSON.stringify([guestBill]);
  const reloadedBills = JSON.parse(serialized) as NoSQLBillRecord[];
  const reloadedEditor = billRecordToExtendedEditorState(reloadedBills[0]);

  assert.deepEqual(reloadedEditor, editorBeforeSave);
  assert.strictEqual(reloadedEditor.otherCharges, 0);
  assert.strictEqual(reloadedEditor.roundOff, 0);
  assert.strictEqual(reloadedEditor.isBillOfEntry, false);
});

test('6. Signed-in Firestore save and reload retains all 21 extended fields while strictly conforming to firestore.rules schema', () => {
  const extracted = extractExtendedFieldsFromBackendResponse(SYNTHETIC_FULL_GEMINI_RESPONSE);
  const editorState = mergeExtendedFieldsForEditor({
    extracted,
    current: EMPTY_EXTENDED_EDITOR_STATE,
    isSameDraftRescan: false,
  });
  const bill = makeSyntheticBill({
    clientId: 'client_alpha_01',
    ...editorStateToBillExtendedFields(editorState),
  });

  const { billId, payload } = buildFirestoreBillRecordPayload(
    'uid_synthetic_ca_01',
    'client_alpha_01',
    bill,
    'MOCK_SERVER_TIMESTAMP'
  );

  // Verify exact 27-key allowlist required by firestore.rules `isValidClientBill`
  const expectedKeys = [
    'id',
    'ownerId',
    'clientId',
    'approvalStatus',
    'fileName',
    'shopName',
    'sellerGstin',
    'buyerName',
    'buyerGstin',
    'invoiceNumber',
    'billDate',
    'placeOfSupply',
    'voucherType',
    'paymentMode',
    'subtotal',
    'cgstAmount',
    'sgstAmount',
    'igstAmount',
    'taxAmount',
    'discountAmount',
    'grandTotal',
    'confidence',
    'rawText',
    'createdAt',
    'extraHeaderFieldsJson',
    'itemsJson',
    'syncedAt',
  ].sort();

  assert.deepEqual(Object.keys(payload).sort(), expectedKeys);
  assert.equal(payload.id, billId);
  assert.equal(payload.ownerId, 'uid_synthetic_ca_01');
  assert.equal(payload.clientId, 'client_alpha_01');
  assert.equal(payload.approvalStatus, 'pending_review');
  assert.ok(payload.extraHeaderFieldsJson.length >= 2 && payload.extraHeaderFieldsJson.length <= 10000);
  assert.ok(payload.itemsJson.length >= 2 && payload.itemsJson.length <= 100000);

  // Round-trip hydration back into NoSQLBillRecord & scanner editor
  const hydrated = parseFirestoreBillDocument(
    billId,
    payload as unknown as Record<string, unknown>
  );

  assert.equal(hydrated.clientId, 'client_alpha_01');
  assert.equal(hydrated.approvalStatus, 'Pending Review');
  assert.strictEqual(hydrated.needsReview, true);
  assert.deepEqual(hydrated.extraHeaderFields, { VehicleNo: 'MH12AB0001' });
  assert.equal(hydrated.auditTrail?.length, 1);

  const hydratedEditor = billRecordToExtendedEditorState(hydrated);
  assert.deepEqual(hydratedEditor, editorState);

  // Also test zero/false preservation through Firestore codec
  const zeroBill = makeSyntheticBill({
    id: 'BILL-SYN-ZERO',
    otherCharges: 0,
    roundOff: 0,
    isBillOfEntry: false,
  });
  const zeroEncoded = buildFirestoreBillRecordPayload(
    'uid_synthetic_ca_01',
    'client_alpha_01',
    zeroBill,
    'MOCK_SERVER_TIMESTAMP'
  );
  const zeroHydrated = parseFirestoreBillDocument(
    zeroEncoded.billId,
    zeroEncoded.payload as unknown as Record<string, unknown>
  );
  assert.strictEqual(zeroHydrated.otherCharges, 0);
  assert.strictEqual(zeroHydrated.roundOff, 0);
  assert.strictEqual(zeroHydrated.isBillOfEntry, false);

  // Also verify oversized QR / extra headers stays within 10,000 char Firestore limit without losing extended fields
  const hugeQrBill = makeSyntheticBill({
    id: 'BILL-SYN-HUGE-QR',
    ...editorStateToBillExtendedFields(editorState),
    eInvoiceQr: 'Q'.repeat(12000),
  });
  const hugeEncoded = buildFirestoreBillRecordPayload(
    'uid_synthetic_ca_01',
    'client_alpha_01',
    hugeQrBill,
    'MOCK_SERVER_TIMESTAMP'
  );
  assert.ok(hugeEncoded.payload.extraHeaderFieldsJson.length <= 10000);
  const hugeHydrated = parseFirestoreBillDocument(
    hugeEncoded.billId,
    hugeEncoded.payload as unknown as Record<string, unknown>
  );
  assert.equal(hugeHydrated.irn, editorState.irn);
  assert.equal(hugeHydrated.bankIfsc, editorState.bankIfsc);
  assert.equal(hugeHydrated.portCode, editorState.portCode);
  assert.ok((hugeHydrated.eInvoiceQr || '').length > 0);
});

test('7. Switching client workspaces isolates saved bills and resets active editor state', () => {
  const clientABill = makeSyntheticBill({
    id: 'BILL-CLIENT-A',
    clientId: 'client_a',
    irn: 'IRN-CLIENT-A-SECRET',
    poNumber: 'PO-CLIENT-A',
  });
  const legacyDefaultBill = makeSyntheticBill({
    id: 'BILL-LEGACY-DEFAULT',
    clientId: undefined,
    irn: 'IRN-DEFAULT-CLIENT',
  });
  const clientBBill = makeSyntheticBill({
    id: 'BILL-CLIENT-B',
    clientId: 'client_b',
    irn: 'IRN-CLIENT-B-SECRET',
    poNumber: 'PO-CLIENT-B',
  });

  const allBills = [clientABill, legacyDefaultBill, clientBBill];

  const visibleInClientA = filterBillsByClientWorkspace(allBills, 'client_a');
  const visibleInClientB = filterBillsByClientWorkspace(allBills, 'client_b');
  const visibleInDefault = filterBillsByClientWorkspace(allBills, DEFAULT_CLIENT_ID);

  assert.deepEqual(
    visibleInClientA.map((b) => b.id),
    ['BILL-CLIENT-A']
  );
  assert.deepEqual(
    visibleInClientB.map((b) => b.id),
    ['BILL-CLIENT-B']
  );
  assert.deepEqual(
    visibleInDefault.map((b) => b.id),
    ['BILL-LEGACY-DEFAULT']
  );

  // Verify Client B never sees Client A's or Default's extended fields
  assert.ok(visibleInClientB.every((b) => b.irn !== 'IRN-CLIENT-A-SECRET'));
  assert.ok(visibleInClientB.every((b) => b.irn !== 'IRN-DEFAULT-CLIENT'));

  // Verify active editor draft reset clears all 21 extended fields on workspace switch
  const clearedEditor = { ...EMPTY_EXTENDED_EDITOR_STATE };
  assert.equal(clearedEditor.irn, '');
  assert.equal(clearedEditor.poNumber, '');
  assert.strictEqual(clearedEditor.otherCharges, undefined);
  assert.strictEqual(clearedEditor.isBillOfEntry, undefined);
});

test('8. Existing core fields, duplicate merge, Maker-Checker status, and Tally XML export continue working', () => {
  const baseBill = makeSyntheticBill({
    id: 'BILL-DUP-BASE',
    subtotal: 10000,
    igstAmount: 1800,
    taxAmount: 1800,
    grandTotal: 11850,
    approvalStatus: 'approved',
    otherCharges: 50,
    roundOff: 0,
    irn: 'IRN-EXISTING-001',
    poNumber: 'PO-EXISTING-001',
  });

  const incomingBill = makeSyntheticBill({
    id: 'BILL-DUP-INCOMING',
    ewayBillNo: '191000000999',
    otherCharges: 0,
    bankIfsc: 'SYNB0000999',
  });

  const mergedExtended = mergeBillExtendedFieldsForDuplicate(baseBill, incomingBill);
  assert.equal(mergedExtended.irn, 'IRN-EXISTING-001');
  assert.equal(mergedExtended.poNumber, 'PO-EXISTING-001');
  assert.equal(mergedExtended.ewayBillNo, '191000000999');
  assert.equal(mergedExtended.bankIfsc, 'SYNB0000999');
  assert.strictEqual(mergedExtended.otherCharges, 0);
  assert.strictEqual(mergedExtended.roundOff, 0);

  // Tally validation & XML generation with extended fields hydrated
  const tallyResult = validateBillsForTallyExport([baseBill], DEFAULT_TALLY_SETTINGS);
  assert.equal(tallyResult.blockedIssues.length, 0);
  assert.equal(tallyResult.validBills.length, 1);

  const xml = generateTallyPrimeXml(tallyResult.validBills, DEFAULT_TALLY_SETTINGS);
  assert.ok(xml.includes('<ENVELOPE>'));
  assert.ok(xml.includes('SYN-2026-0001'));
  assert.ok(xml.includes('Freight &amp; Other Charges'));
});

test('9. Local Tesseract fallback does not invent extended AI-only fields when they were not extracted', () => {
  // Fresh invoice falling back to local Tesseract OCR passes extendedFields: {}
  const freshFallbackEditor = mergeExtendedFieldsForEditor({
    extracted: {},
    current: mergeExtendedFieldsForEditor({
      extracted: extractExtendedFieldsFromBackendResponse(SYNTHETIC_FULL_GEMINI_RESPONSE),
      current: EMPTY_EXTENDED_EDITOR_STATE,
      isSameDraftRescan: false,
    }),
    isSameDraftRescan: false,
  });

  // Previous invoice's AI fields are cleared and ZERO extended AI-only fields are invented
  assert.deepEqual(freshFallbackEditor, EMPTY_EXTENDED_EDITOR_STATE);
  assert.deepEqual(editorStateToBillExtendedFields(freshFallbackEditor), {});

  // Same-draft local Tesseract re-scan preserves manual extended edits without inventing missing ones
  const partialManual = mergeExtendedFieldsForEditor({
    extracted: { poNumber: 'PO-MANUAL-ONLY' },
    current: EMPTY_EXTENDED_EDITOR_STATE,
    isSameDraftRescan: false,
  });
  const afterLocalRescan = mergeExtendedFieldsForEditor({
    extracted: {},
    current: partialManual,
    isSameDraftRescan: true,
  });
  assert.equal(afterLocalRescan.poNumber, 'PO-MANUAL-ONLY');
  assert.equal(afterLocalRescan.irn, '');
  assert.equal(afterLocalRescan.supplierPan, '');
  assert.equal(afterLocalRescan.currency, '');
  assert.strictEqual(afterLocalRescan.otherCharges, undefined);
  assert.strictEqual(afterLocalRescan.isBillOfEntry, undefined);
});
