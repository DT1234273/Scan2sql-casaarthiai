# LedgerSutra Firestore Security Specification (Phase 0)

## 1. Data Invariants & Access Model
- **Strict Per-User Isolation**: Every document lives under `/users/{userId}`, `/users/{userId}/bills/{billId}`, or `/users/{userId}/documents/{docId}`.
- **Authentication & Verified Email**: All reads and writes require `request.auth != null && request.auth.token.email_verified == true && request.auth.uid == userId`.
- **Wildcard ID Validation**: `userId`, `billId`, and `docId` must satisfy `isValidId` (`id is string && id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`).
- **Immutability**:
  - `/users/{userId}`: `uid` must equal `userId` on create and cannot change on update (`request.resource.data.uid == resource.data.uid`).
  - `/users/{userId}/bills/{billId}`: `id` must equal `billId`, `ownerId` must equal `userId`, and both `id` and `ownerId` are immutable on update.
  - `/users/{userId}/documents/{docId}`: `id` must equal `docId`, `ownerId` must equal `userId`, and both `id` and `ownerId` are immutable on update.
- **Server Timestamp Enforcement**:
  - `updatedAt` in `UserProfile` and `syncedAt` in `UserBill` / `UserDocument` must equal `request.time`.

## 2. "Dirty Dozen" Attack Payloads to Reject
1. **Unauthenticated read/write**: `auth == null` attempting to read or write `/users/user_1/bills/bill_1`.
2. **Unverified email token**: `auth.token.email_verified == false` attempting to create a profile or bill.
3. **Cross-tenant horizontal privilege escalation**: `user_2` attempting to read, update, or delete `/users/user_1/bills/bill_1`.
4. **Unexpected extra keys (Schema Pollution)**: Payload containing `isAdmin: true` or `extraField: "hack"` not in `hasOnly([...])`.
5. **Missing required keys**: Payload omitting `ownerId`, `grandTotal`, or `syncedAt`.
6. **Type confusion**: Passing a string `"100"` for `grandTotal` instead of a `number`, or a float `1.5` for `pageCount` instead of an `int`.
7. **Out-of-bounds strings**: `rawText` or `extractedText` exceeding 50,000 characters or `shopName` with 0 characters.
8. **Negative or astronomical monetary values**: `grandTotal < 0` or `grandTotal > 10000000000`.
9. **Forged timestamps**: `syncedAt` set to a past or future timestamp instead of `request.time`.
10. **Ownership hijacking on update**: Updating `ownerId` or `id` on an existing bill document.
11. **Invalid enum values**: `userMode` set to `"superadmin"` instead of `"normal_user"` or `"ca_mode"`, or `docType` set to `"INVOICE"`.
12. **Malformed wildcard ID**: Document ID containing spaces or special characters outside `^[a-zA-Z0-9_\-]+$`.
