# LedgerSutra — Changelog

## v2.0.0 — Complete CA Firm & GST Practitioner Suite Upgrade

### Global Brand & Architecture Standardization
- **Single Brand Unification**: Standardized all visible UI copy, page titles, OpenGraph metadata, JSON-LD structured data, exported filenames, and sample test files to **LedgerSutra** (`https://www.ledgersutra.in`). Removed all legacy `Scan2SQL` and `casaarthiai` references.
- **Firestore-First Persistence**: All user profiles, client workspaces, bills, documents, Tally ledger settings, team members, and hashed API keys are stored exclusively in Firebase Cloud Firestore.

### Part 1: TallyPrime XML, Zoho Books CSV & Busy Accounting Excel Export
- **TallyPrime XML Generator (`src/tallyAndExports.ts`)**: Generates valid TallyPrime `ENVELOPE > HEADER > BODY > IMPORTDATA > REQUESTDESC > REQUESTDATA > TALLYMESSAGE` XML containing `VOUCHER VCHTYPE="Purchase" ACTION="Create"`.
- **Full Accounting Entries**: Populates `DATE` (`YYYYMMDD`), `VOUCHERNUMBER`, `REFERENCE`, `PARTYLEDGERNAME`, `PARTYGSTIN`, `NARRATION`, Credit Party Ledger entry, Debit Purchase Ledger entry, CGST, SGST, IGST, and Round-Off ledger entries with accurate `ISDEEMEDPOSITIVE` and XML character escaping.
- **Auto-Create Missing Party Ledgers**: Optional `<LEDGER ACTION="Create">` master blocks under `Sundry Creditors` with GSTIN and state registration.
- **Tally Settings Panel**: Per-user/client configuration persisted in Firestore (`companyName`, `purchaseLedgerName`, `cgstLedgerName`, `sgstLedgerName`, `igstLedgerName`, `roundOffLedgerName`, `defaultVoucherType`, `autoCreatePartyLedgers`).
- **Pre-Export Validation Screen**: Inspects bills for missing invoice number, invalid 15-char GSTIN/checksum, missing date, or tax math mismatch, with **"Fix now"** jump-to-editor action and **"Skip blocked bills"** toggle.
- **Zoho Books & Busy Exports**: Added Zoho Books Purchase Bill CSV export and Busy Accounting Standard Purchase Voucher Excel export with documented column mappings.

### Part 2: GSTR-2B Reconciliation Engine
- **GSTR-2B Reconciliation Tab (`src/gstr2bReconciliation.ts`)**: Upload portal GSTR-2B JSON or Excel files and parse `data.docdata.b2b` invoices.
- **Two-Pass Matching**: Pass 1 matches Supplier GSTIN + normalized invoice number; Pass 2 performs fuzzy matching on Supplier GSTIN + taxable/invoice amount within configurable ₹ tolerance (default ₹1) and date proximity.
- **6 Reconciliation Statuses**: `Matched`, `Amount Mismatch`, `Date Mismatch`, `Invoice Number Mismatch (probable)`, `In Books but Not in 2B`, `In 2B but Not in Books`.
- **Interactive Controls & Multi-Sheet Export**: Summary KPI cards (Total ITC Books vs 2B, ITC at Risk), side-by-side difference highlighting, manual match/unmatch override, per-row CA audit notes, financial year/month filter, and multi-sheet Excel report export.

### Part 3: Client-Wise Workspace for CA Firms
- **Client Entity & Subcollections**: Added `/users/{uid}/clients/{clientId}` (`name`, `gstin`, `pan`, `financialYear`, `notes`, `archived`) with client-scoped `bills` and `documents`.
- **Header Client Switcher & Overview**: Instant client switching in the top header, Add/Edit/Archive client modal, Clients Overview metrics (bill count, taxable value, total GST, pending review count), and automatic migration of existing bills into `Default Client`.

### Part 4: Team Access & Approval Workflow
- **Firm RBAC Roles**: `Owner/CA`, `Reviewer`, and `Staff (upload-only)`. Owners can invite team members by Google email and assign specific clients.
- **Bill Approval Lifecycle**: `Draft`, `Pending Review`, `Approved`, and `Rejected` (with reason). Staff uploads default to `Pending Review`; only `Owner/CA` and `Reviewer` can approve or reject.
- **Approved-Only Export & Recon Filter**: Tally XML export and GSTR-2B reconciliation include only `Approved` bills by default, with a toggle to include all bills.
- **Per-Bill Audit Trail**: Tracks every upload, edit, and approval/rejection with user email, role, timestamp, and note.
- **Firestore Security Rules & Tests**: Enforced ownership, client workspace paths, and role-based approval permissions in `firestore.rules` and verified in `firestore.rules.test.ts`.

### Part 5: Extraction & Validation Improvements
- **18+ Extended Invoice & BOE Fields**: Extracts and edits `IRN`, `e-Way Bill No`, `e-Invoice QR data`, `Supplier/Buyer Address & State`, `Supplier PAN`, `Bank Name / A/C No / IFSC`, `PO Number`, `Due Date`, `Payment Terms`, `Currency`, `Discount`, `Other Charges`, `Round-Off`, and `Bill of Entry (BOE) No`.
- **Multi-Page PDF & Bill of Entry Support**: Processes multi-page PDFs and import Bills of Entry through the hybrid Vision + Tesseract OCR pipeline.
- **GSTIN Checksum & Live Verification**: Full 15-character format + Indian GST Mod-36 checksum validation, plus a pluggable server-side **"Verify GSTIN status"** button (`GST_VERIFY_API_URL`, `GST_VERIFY_API_KEY`).
- **Needs Review Queue & Accuracy Benchmark Page**: Automatic `needsReview` flag + filter bar, plus an internal **Accuracy Test** tool comparing extracted bills against a ground-truth Excel sheet across 6 fields.

### Part 6: Public REST API (`/api/v1/extract`)
- **Authenticated Extraction Endpoint**: `POST /api/v1/extract` (multipart file or base64 JSON) protected by SHA-256 hashed per-user API keys (`X-API-Key`), rate limiting (30 req/min), and 15 MB size limit.
- **API Key Manager & `/api-docs` Page**: Generate/revoke hashed keys in the workspace and view complete cURL/JSON documentation at `/api-docs`.

### Part 7 & Part 8: Public Website, Content Pages & Technical SEO
- **11-Section Public Landing Page**: Hero, No-Login Live Demo (3 built-in samples + custom upload, Table + JSON tabs, 3 scans/day browser limit), Problem/Solution comparison, Features Grid, Fields We Extract, 3-Step Workflow, Product Preview, Security & Privacy, Pricing Plans, 12-Question FAQ, and Footer.
- **Dedicated Public & SEO Routes**: `/privacy`, `/terms`, `/security`, `/pricing`, `/faq`, `/blog` (3 starter articles), `/api-docs`, `/gst-invoice-to-tally`, `/gstr-2b-reconciliation-excel`, and `/bulk-invoice-processing-for-ca` (400+ words each).
- **Server-Side Prerendering & Technical SEO**: `server.ts` injects route-specific `<title>`, `<meta name="description">`, canonical URLs, OpenGraph/Twitter tags, JSON-LD (`Organization`, `SoftwareApplication`, `FAQPage`), and prerendered semantic HTML into the initial response for crawlers, alongside `/sitemap.xml`, `/robots.txt`, and canonical host redirect via `PUBLIC_SITE_URL`.

### Part 9: Security Hardening
- **Environment Variable Config**: Reads Firebase settings from `VITE_FIREBASE_*` env vars with `.env.example` template and `.gitignore` protection.
- **Privacy Controls & Resilience**: Added **"Delete my data"** account wipe in the workspace and wrapped the application in `AppErrorBoundary`.
