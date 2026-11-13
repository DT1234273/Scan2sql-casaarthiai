# LedgerSutra — GST Invoice to TallyPrime XML, GSTR-2B Reconciliation & Excel Automation for Indian CA Firms

**LedgerSutra** is a full-stack accounting automation platform built for Indian Chartered Accountants (CAs), GST practitioners, tax consultants, and finance teams. It extracts structured invoice headers, 15-character GSTINs, HSN/SAC line items, CGST/SGST/IGST splits, and e-Invoice metadata from PDFs and camera photos, validates GST math and Mod-36 checksums, reconciles purchase registers against GSTR-2B, and exports directly to **TallyPrime XML**, **Zoho Books CSV**, **Busy Accounting Excel**, and multi-sheet `.XLSX`.

---

## Key Capabilities

1. **TallyPrime XML, Zoho Books & Busy Exports (Part 1)**
   - Generates TallyPrime-importable Purchase Voucher XML (`ENVELOPE > HEADER > BODY > IMPORTDATA > REQUESTDESC > REQUESTDATA > TALLYMESSAGE > VOUCHER VCHTYPE="Purchase"`).
   - Configurable **Tally Settings** per user/client (Company Name, Purchase Ledger, CGST/SGST/IGST Ledgers, Round-Off Ledger, Auto-create missing party ledgers).
   - Pre-export validation modal blocking invoices with missing invoice numbers, invalid GSTINs, missing dates, or tax mismatches—with one-click **"Fix now"** or **"Skip blocked bills"**.
   - Built-in **Zoho Books CSV** and **Busy Accounting Excel** exports with documented column mappings.

2. **GSTR-2B Reconciliation Engine (Part 2)**
   - Upload GSTR-2B JSON or Excel files downloaded from the GST portal.
   - Two-pass matching: exact normalized Supplier GSTIN + Invoice Number, followed by fuzzy fallback on Supplier GSTIN + Taxable/Total Amount (configurable ₹ tolerance, default ₹1) + Date proximity.
   - Classifies invoices into 6 audit statuses: `Matched`, `Amount Mismatch`, `Date Mismatch`, `Invoice Number Mismatch (probable)`, `In Books but Not in 2B`, and `In 2B but Not in Books`.
   - Manual match/unmatch overrides, per-row CA notes, period filter, and multi-sheet Excel report export.

3. **Client-Wise Workspace & Team Approval Workflow (Parts 3 & 4)**
   - Manage multiple client GSTINs under `/users/{uid}/clients/{clientId}` with a header Client Switcher and Clients Overview dashboard.
   - Role-based access control (`Owner/CA`, `Reviewer`, `Staff`) and bill approval statuses (`Draft`, `Pending Review`, `Approved`, `Rejected`) with per-bill audit trails enforced in `firestore.rules`.

4. **Extended GST Extraction, Live GSTIN Verification & Accuracy Benchmark (Part 5)**
   - Extracts 18+ additional fields: `IRN`, `e-Way Bill No`, `e-Invoice QR`, `Supplier/Buyer Address & State`, `PAN`, `Bank Name / Account / IFSC`, `PO Number`, `Due Date`, `Payment Terms`, `Currency`, `Discount`, `Other Charges`, `Round-Off`, and `Bill of Entry (BOE) No`.
   - Pluggable server-side GSTIN status verification (`GST_VERIFY_API_URL`, `GST_VERIFY_API_KEY`) and an internal **Accuracy Test** page to benchmark extraction against a ground-truth Excel file.

5. **Public REST API (`/api/v1/extract`) & Crawlable Public Website (Parts 6, 7 & 8)**
   - `POST /api/v1/extract` protected by SHA-256 hashed per-user API keys (`X-API-Key`), rate limiting, and size limits.
   - Server-side prerendered public marketing pages (`/`, `/pricing`, `/faq`, `/blog`, `/api-docs`, `/privacy`, `/terms`, `/security`, `/gst-invoice-to-tally`, `/gstr-2b-reconciliation-excel`, `/bulk-invoice-processing-for-ca`) with JSON-LD schema, `/sitemap.xml`, and `/robots.txt`.

---

## Environment Variables (`.env.example`)

Copy `.env.example` to `.env` and configure:

```bash
# Gemini Vision Extraction API Key (server-side only)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Canonical Public Site URL (used for canonical redirects, sitemap, and OpenGraph URLs)
PUBLIC_SITE_URL="https://www.ledgersutra.in"

# Optional Live GSTIN Verification Service (server-side only)
# If omitted, the UI hides the live button and shows "GSTIN verification available when API is configured"
GST_VERIFY_API_URL=""
GST_VERIFY_API_KEY=""

# Firebase Client Configuration
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
VITE_FIREBASE_FIRESTORE_DATABASE_ID=""
```

---

## Development & Build Commands

```bash
# Install dependencies
npm install

# Start full-stack Express + Vite development server on port 3000
npm run dev

# Type-check with TypeScript
npm run lint

# Build production bundle
npm run build
```
