/**
 * @file firestore.rules.test.ts
 * Specification test suite verifying LedgerSutra Firestore security invariants
 * and "Dirty Dozen" negative test payloads.
 */

export interface SecurityTestCase {
  description: string;
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedAllow: boolean;
}

export const SECURITY_RULE_TEST_CASES: SecurityTestCase[] = [
  {
    description: '1. Reject unauthenticated read on user bills',
    path: '/users/user_123/bills/BILL-1001',
    operation: 'get',
    auth: null,
    expectedAllow: false,
  },
  {
    description: '2. Reject unverified email user creating profile',
    path: '/users/user_123',
    operation: 'create',
    auth: { uid: 'user_123', email_verified: false },
    expectedAllow: false,
  },
  {
    description: '3. Reject cross-user read on another user bill history',
    path: '/users/user_123/bills/BILL-1001',
    operation: 'get',
    auth: { uid: 'attacker_999', email_verified: true },
    expectedAllow: false,
  },
  {
    description: '4. Reject extra undeclared properties (schema pollution)',
    path: '/users/user_123',
    operation: 'create',
    auth: { uid: 'user_123', email_verified: true },
    payload: {
      uid: 'user_123',
      email: 'ca@firm.in',
      displayName: 'CA Rajesh',
      photoURL: '',
      userMode: 'ca_mode',
      selectedColumnsJson: '["fileName","grandTotal"]',
      updatedAt: 'SERVER_TIMESTAMP',
      isAdmin: true,
    },
    expectedAllow: false,
  },
  {
    description: '5. Allow owner with verified email to create valid bill history item',
    path: '/users/user_123/bills/BILL-1001',
    operation: 'create',
    auth: { uid: 'user_123', email_verified: true },
    payload: {
      id: 'BILL-1001',
      ownerId: 'user_123',
      fileName: 'Invoice_101.pdf',
      shopName: 'Shree Traders',
      sellerGstin: '24AAACS1234F1Z5',
      buyerName: 'Mehta & Co',
      buyerGstin: '',
      invoiceNumber: 'INV-101',
      billDate: '2026-10-15',
      placeOfSupply: '24-Gujarat',
      voucherType: 'Tax Invoice',
      paymentMode: 'NEFT',
      subtotal: 1000,
      cgstAmount: 90,
      sgstAmount: 90,
      igstAmount: 0,
      taxAmount: 180,
      discountAmount: 0,
      grandTotal: 1180,
      confidence: 99,
      rawText: 'Tax Invoice Shree Traders',
      createdAt: '2026-10-15 10:30',
      extraHeaderFieldsJson: '{}',
      itemsJson: '[]',
      syncedAt: 'SERVER_TIMESTAMP',
    },
    expectedAllow: true,
  },
];
