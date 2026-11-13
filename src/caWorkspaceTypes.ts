export type FirmRole = 'Owner/CA' | 'Reviewer' | 'Staff' | 'owner' | 'reviewer' | 'staff';

export type BillApprovalStatus =
  | 'Draft'
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected';

export interface BillAuditTrailEntry {
  id?: string;
  action: string;
  actorEmail?: string;
  actorName?: string;
  actorRole?: FirmRole;
  byEmail?: string;
  byRole?: FirmRole;
  timestamp: string;
  note?: string;
}

export interface ExtendedInvoiceFields {
  irn?: string;
  ewayBillNo?: string;
  eInvoiceQr?: string;
  supplierAddress?: string;
  supplierState?: string;
  buyerAddress?: string;
  buyerState?: string;
  supplierPan?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  poNumber?: string;
  dueDate?: string;
  paymentTerms?: string;
  currency?: string;
  otherCharges?: number;
  roundOff?: number;
  isBillOfEntry?: boolean;
  boeNumber?: string;
  boeDate?: string;
  portCode?: string;
  assessableValue?: number;
  bcdAmount?: number;
}

export interface CAClientProfile {
  id: string;
  ownerId?: string;
  name: string;
  gstin: string;
  pan: string;
  financialYear: string;
  notes: string;
  archived: boolean;
  createdAt: string;
  updatedAt?: string;
}

export const DEFAULT_CLIENT_ID = 'client_default';

export const DEFAULT_CA_CLIENT: CAClientProfile = {
  id: DEFAULT_CLIENT_ID,
  ownerId: 'local',
  name: 'Default Client',
  gstin: '',
  pan: '',
  financialYear: '2026-27',
  notes: 'Auto-created default client workspace for migrated and general bills.',
  archived: false,
  createdAt: '2026-04-01 09:00',
};

export const DEFAULT_CLIENT_PROFILE: CAClientProfile = DEFAULT_CA_CLIENT;

export interface TallySettings {
  companyName: string;
  purchaseLedgerName: string;
  cgstLedgerName: string;
  sgstLedgerName: string;
  igstLedgerName: string;
  roundOffLedgerName: string;
  otherChargesLedgerName: string;
  discountLedgerName: string;
  defaultVoucherType: string;
  autoCreateMissingPartyLedgers: boolean;
  onlyExportApprovedBills: boolean;
}

export const DEFAULT_TALLY_SETTINGS: TallySettings = {
  companyName: 'LedgerSutra Client Books',
  purchaseLedgerName: 'Purchase Account',
  cgstLedgerName: 'Input CGST',
  sgstLedgerName: 'Input SGST',
  igstLedgerName: 'Input IGST',
  roundOffLedgerName: 'Round Off',
  otherChargesLedgerName: 'Freight & Other Charges',
  discountLedgerName: 'Discount Received',
  defaultVoucherType: 'Purchase',
  autoCreateMissingPartyLedgers: true,
  onlyExportApprovedBills: false,
};

export interface TeamMemberRecord {
  id: string;
  ownerId?: string;
  email: string;
  name: string;
  role: FirmRole;
  assignedClientIds: string[];
  invitedAt: string;
  status: 'active' | 'invited' | 'Active' | 'Invited';
}

export interface UserApiKeyRecord {
  id: string;
  ownerId?: string;
  label: string;
  name?: string;
  keyPrefix: string;
  keyHash: string;
  createdAt: string;
  lastUsedAt?: string;
  revoked: boolean;
  status?: 'active' | 'revoked';
}

export type ReconciliationStatus =
  | 'MATCHED'
  | 'AMOUNT_MISMATCH'
  | 'DATE_MISMATCH'
  | 'INVOICE_NO_MISMATCH'
  | 'IN_BOOKS_NOT_2B'
  | 'IN_2B_NOT_BOOKS';

export interface Gstr2bPortalInvoice {
  id: string;
  supplierGstin: string;
  tradeName: string;
  invoiceNumber: string;
  invoiceDate: string;
  placeOfSupply: string;
  invoiceType: string;
  reverseCharge: 'Y' | 'N';
  taxableValue: number;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  cessAmount: number;
  totalTaxAmount: number;
  invoiceValue: number;
  itcAvailable: 'YES' | 'NO' | 'PARTIAL';
  filingPeriod: string;
}

export interface ReconciliationRow {
  id: string;
  status: ReconciliationStatus;
  manualOverrideStatus?: ReconciliationStatus;
  bookBillId: string | null;
  portalInvoiceId: string | null;
  supplierGstin: string;
  supplierName: string;
  bookInvoiceNo: string;
  portalInvoiceNo: string;
  bookDate: string;
  portalDate: string;
  bookTaxable: number;
  portalTaxable: number;
  bookCgst: number;
  portalCgst: number;
  bookSgst: number;
  portalSgst: number;
  bookIgst: number;
  portalIgst: number;
  bookTotalTax: number;
  portalTotalTax: number;
  bookGrandTotal: number;
  portalGrandTotal: number;
  taxableDiff: number;
  taxDiff: number;
  totalDiff: number;
  itcAvailable: 'YES' | 'NO' | 'PARTIAL';
  note: string;
  matchReason: string;
}

export interface ReconciliationSummary {
  totalRows: number;
  countsByStatus: Record<ReconciliationStatus, number>;
  amountsByStatus: Record<ReconciliationStatus, number>;
  totalItcBooks: number;
  totalItc2b: number;
  eligibleItc2b: number;
  itcAtRisk: number;
}

export interface AccuracyGroundTruthRow {
  fileName: string;
  invoiceNumber: string;
  billDate: string;
  sellerGstin: string;
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
}

export interface AccuracyComparisonRow {
  fileName: string;
  matchedBillFound: boolean;
  fields: {
    invoiceNumber: { expected: string; actual: string; match: boolean };
    billDate: { expected: string; actual: string; match: boolean };
    sellerGstin: { expected: string; actual: string; match: boolean };
    subtotal: { expected: number; actual: number; match: boolean };
    taxAmount: { expected: number; actual: number; match: boolean };
    grandTotal: { expected: number; actual: number; match: boolean };
  };
  rowScorePercent: number;
}
