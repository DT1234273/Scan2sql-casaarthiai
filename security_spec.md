# LedgerSutra — Firestore Security Specification

## 1. Zero-Trust Architecture & Ownership Invariants
- **Global Default Deny**: `match /{document=**} { allow read, write: if false; }`
- **Verified Google Identity**: Every read/write requires `request.auth != null && request.auth.token.email_verified == true`.
- **Strict Tenant Isolation**: All data lives under `/users/{userId}` where `request.auth.uid == userId`.

## 2. Firestore Paths & Schema Validation
1. `/users/{userId}` (`UserProfile`):
   - Fields: `uid`, `email`, `displayName`, `photoURL`, `userMode`, `firmRole`, `selectedColumnsJson`, `tallySettingsJson`, `updatedAt`.
   - Enforces `hasAll` and `hasOnly` allowlist, string length limits, and `updatedAt == request.time`.
2. `/users/{userId}/clients/{clientId}` (`ClientProfile`):
   - Fields: `id`, `ownerId`, `name`, `gstin`, `pan`, `financialYear`, `notes`, `archived`, `createdAt`, `updatedAt`.
3. `/users/{userId}/clients/{clientId}/bills/{billId}` (`UserBill`):
   - Fields: `id`, `ownerId`, `clientId`, `approvalStatus` (`draft` | `pending_review` | `approved` | `rejected`), `fileName`, `shopName`, `sellerGstin`, `buyerName`, `buyerGstin`, `invoiceNumber`, `billDate`, `placeOfSupply`, `voucherType`, `paymentMode`, `subtotal`, `cgstAmount`, `sgstAmount`, `igstAmount`, `taxAmount`, `discountAmount`, `grandTotal`, `confidence`, `rawText`, `createdAt`, `extraHeaderFieldsJson`, `itemsJson`, `syncedAt`.
   - **Role Enforcement**: `canApproveOrReject(userId, approvalStatus)` verifies that if `approvalStatus` is `'approved'` or `'rejected'`, the user's `firmRole` must be `'owner'` or `'reviewer'`. `'staff'` role can only write `'draft'` or `'pending_review'`.
4. `/users/{userId}/clients/{clientId}/documents/{docId}` (`UserDocument`):
   - Stores client-scoped verbatim OCR text documents.
5. `/users/{userId}/teamMembers/{memberId}` (`TeamMember`):
   - Restricted to `userFirmRole(userId) == 'owner'`.
6. `/users/{userId}/apiKeys/{keyId}` (`UserApiKey`):
   - Restricted to `userFirmRole(userId) == 'owner'`. Stores only SHA-256 `keyHash` and `keyPrefix`, never plaintext keys.
