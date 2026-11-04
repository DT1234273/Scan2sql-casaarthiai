# Phase 1: Technical Audit & LedgerSutra Transformation Plan

## 1. Complete Technical Audit of Existing Project (`https://casaarthiai.in`)

### A. Existing Framework & Runtime Architecture
- **Frontend Stack**: React 19 + TypeScript + Vite 8 + Tailwind CSS v4 (`@tailwindcss/vite`) + Lucide React icons + Motion (`motion/react`) + Recharts (`recharts`) + SheetJS (`xlsx`).
- **OCR & Document Processing Stack**:
  - **Server-Side AI Vision Engine** (`/api/extract-document` in `server.ts` and `api/index.ts`): Uses `@google/genai` (`gemini-3.1-flash-lite` / `gemini-3.8-flash` / `gemini-flash-latest`) to extract both verbatim raw text (`exactRawText`) and structured invoice fields + line items in a single pass.
  - **Client-Side Hybrid Fallback** (`src/App.tsx`):
    - **PDF.js (`pdfjs-dist`)**: Coordinate-aware horizontal baseline reconstruction (`extractCoordinateSortedTextFromPdfItems`) that preserves table column boundaries (`|`) and renders multi-page PDF previews.
    - **Adaptive Image Preprocessing** (`enhanceImageForSharpOcr`): Normalizes resolution (up to 1800px) and applies pixel-level contrast enhancement (`1.25x` contrast boost) for tilted/shadowed receipt photos.
    - **Tesseract.js v7 (`eng.traineddata` + `hin.traineddata`)**: Runs Page Segmentation Mode 4 (`tessedit_pageseg_mode: '4'`) for bilingual English + Hindi (`eng+hin`) OCR, paired with a mathematical self-healing parser (`parseFallbackBillFromRawText`) that reconciles `Quantity × Rate = Line Total`.
    - **QR Scanner (`jsqr`)**: Supports JSON and UPI (`upi://pay`) QR code parsing via camera or image upload.
- **Database & Persistence Layer**:
  - Dual-layer persistence: `localStorage` (`scan2sql_bills_v3`, `scan2sql_documents_v3`, `scan2sql_selected_columns_v3`) synced with backend JSON persistence (`nosql_store.json` via `GET/POST /api/nosql/store`).
  - Dynamic NoSQL schema (`NoSQLBillRecord`, `NoSQLBillItem`, `SavedDocumentRecord`) supporting standard GST invoice fields plus arbitrary dynamic header fields (`hdr:*`) and dynamic item columns (`itm:*`).
- **Deployment Setup**:
  - Local/Preview server via `tsx server.ts` on Port 3000.
  - Vercel production configuration via `vercel.json` + `api/index.ts` (legacy Python files that previously caused `psycopg2-binary` build failures have already been cleaned up).

---

### B. Current Pages, Routes & Working Features
Currently, the entire application lives inside a single-view React SPA (`src/App.tsx`) with **no URL-based routing** (`window.location.pathname` or router). It uses an internal 4-tab switcher:
1. **`scanner` Tab (`1. Scan Bill / PDF`)**:
   - Mode toggle between *Normal User Mode* and *CA / GST Audit Mode*.
   - Single and multi-file upload (`.jpg`, `.jpeg`, `.png`, `.pdf` up to 20 MB).
   - Append to existing Excel (`.xlsx`, `.xls`, `.csv`) import.
   - Multi-page document preview with laser scan animation.
   - Verbatim extracted text viewer with Copy & `.TXT` export.
   - Editable invoice header fields (`shopName`, `sellerGstin`, `buyerName`, `buyerGstin`, `invoiceNumber`, `billDate`, `placeOfSupply`, `voucherType`, `paymentMode`) + dynamic custom fields.
   - Editable line-item table (`itemName`, `hsnSac`, `quantity`, `unit`, `unitPrice`, `discount`, `taxableValue`, `gstRate`, `cgstAmount`, `sgstAmount`, `igstAmount`, `lineTotal`) with auto-calculated tax math.
2. **`master_sheet` Tab (`2. Merged Excel Sheet`)**:
   - Toggle between `1 Bill = 1 Row` summary mode (with auto-expanding `Product 1..N` columns for multi-item bills) and `CA Detailed Line-Item Rows` mode.
   - Dynamic column selector chips, live search, date filter, and animated row slide-in (`motion.tr`).
   - Multi-sheet `.xlsx` export (`SheetJS`) containing both the structured accounting sheet (with `GRAND TOTAL` sum footer) and the `Exact_Extracted_Text` audit sheet.
3. **`dashboard` Tab (`3. Dashboard`)**:
   - 4 KPI summary cards (Total Bills Scanned, Total Taxable/Net, Total GST/Tax, Grand Total Spend).
   - Interactive Recharts visualization (`AreaChart` and `BarChart`) showing monthly spending trends + monthly breakdown table.
4. **`history` Tab (`4. Exact Text History`)**:
   - Verbatim text archive of all scanned documents with one-click Copy and `.TXT` download.

*Note on Unrelated Finance-Advisory Functionality*: No unrelated personal finance advisory or chatbot modules exist in the active React codebase; all existing features are directly centered on document OCR, bill extraction, and spreadsheet/database consolidation.

---

### C. Identified Brand, UX, Workflow & Technical SEO Gaps

1. **Brand & Positioning Gaps**:
   - Still branded everywhere as **Scan2SQL** (`index.html`, `metadata.json`, `server.ts`, header, exported Excel filenames).
   - Lacks a dedicated, conversion-focused **CA SaaS Homepage** explaining the value proposition for Indian Chartered Accountants before or alongside the workspace.
2. **CA Workflow & Validation Gaps**:
   - While GSTIN extraction exists, there is **no visual GSTIN checksum/format validator badge** (15-character Indian GSTIN structure check: 2-digit State Code + 10-char PAN + Entity Code + `Z` + Checksum) in the review UI.
   - **No Duplicate Invoice Detection**: Uploading the same `Seller GSTIN + Invoice Number + Financial Year` twice does not flag a duplicate warning for the CA.
   - **No Tax Consistency Alert**: If extracted `Taxable Value + CGST + SGST + IGST ≠ Grand Total` (due to rounding or blurred print), the UI does not highlight the discrepancy for human review.
   - **No Missing-Field / Low-Confidence Highlight**: Missing GSTIN, missing Invoice Date, or low-confidence OCR fields are not visually badged in the editor.
   - **Missing Export Formats**: Currently exports `.xlsx` and `.txt`. Needs **CSV**, **JSON**, and **SQL (`INSERT INTO` statements)** exports, plus **Supplier-Wise / GSTIN-Wise Summary Views** for GSTR-2B / Purchase Register preparation.
3. **Critical SEO & Content Architecture Gaps**:
   - **Zero Multi-Page URL Routing**: All content is trapped behind a single root URL (`/`), with no crawlable routes for `/features`, `/pricing`, `/how-it-works`, `/about`, `/contact`, or high-intent CA landing pages (`/invoice-ocr-for-ca`, `/gst-invoice-data-extraction`, `/pdf-invoice-to-excel`, etc.).
   - **Outdated Metadata**: `<title>` and `<meta name="description">` still reference *"Scan2SQL — Python FastAPI, OpenCV, PostgreSQL"* instead of **LedgerSutra** for Indian CAs.
   - **Missing `robots.txt` & `sitemap.xml`**: No `/public/robots.txt` or `/public/sitemap.xml` targeting `https://casaarthiai.in`.
   - **Missing Schema.org JSON-LD**: No `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, or `Article` structured data.
   - **No CA Resource Center**: No educational guides on GST invoice fields, GSTR-2B reconciliation workflows, or Tally/Excel import preparation.

---

## 2. Controlled 5-Phase Implementation Plan

### Phase 2 — Brand & UI Transformation (`LedgerSutra`)
1. **Global Rebranding to LedgerSutra**:
   - Update `metadata.json`, `index.html`, header lockup, footer, and export filenames to **LedgerSutra** (*"AI-Powered Invoice & Document Automation for CA Firms"*).
   - Apply the **60-30-10 Financial SaaS Palette**:
     - **60% Canvas**: Crisp warm alabaster (`#F8FAFC`) in Light Mode / Deep obsidian navy (`#090D16`) in Dark Mode.
     - **30% Surface & Structure**: Deep Navy/Slate (`#0F172A` / `#1E293B`) with 1px hairline borders (`#E2E8F0` / `#1E293B`).
     - **10% Primary Accent**: Emerald Accounting Green (`#059669` / `#10B981`) for financial precision & verified states + Royal Navy/Indigo (`#1E40AF` / `#3B82F6`) for primary CTAs + Amber (`#D97706`) for audit review warnings.
   - Enforce `font-variant-numeric: tabular-nums` (`JetBrains Mono`) on all GSTINs, HSN codes, invoice numbers, tax rates, and INR (`₹`) amounts.
2. **Conversion-Focused CA Homepage (`/`)**:
   - Build all **11 required sections** in logical conversion order:
     1. **Hero Section**: Headline *"Stop Entering Invoices Manually. Let AI Do the Heavy Lifting."*, supporting CA subcopy, primary CTA (*"Explore Invoice Automation"* -> opens live workspace/scrolls to interactive scanner), secondary CTA (*"See How It Works"*), and an interactive live preview of the LedgerSutra extraction workbench.
     2. **CA Industry Problems**: Addressing manual purchase register entry during GST filing peaks, multi-format client bills (tilted mobile photos, thermal receipts, multi-page PDFs), missing GSTIN/HSN errors, and repetitive Excel formatting.
     3. **LedgerSutra Solution**: How AI Vision + Bilingual OCR + CA validation rules bridge raw client documents and clean accounting sheets.
     4. **How the Platform Works**: 4-step editorial workflow (`01. Upload Client Bills` -> `02. AI OCR & GST Field Extraction` -> `03. CA Review & Exception Check` -> `04. Export to Excel / CSV / SQL / JSON`).
     5. **Core Product Features**: Asymmetric bento grid highlighting Smart Invoice OCR (English + Hindi), GST Data Extraction, Line-Item & HSN Table Reconstruction, and Multi-Format Export.
     6. **Designed for CA Workflows**: Purchase voucher preparation, client-wise/supplier-wise sorting, tax breakdown verification, and audit trail preservation.
     7. **Supported Documents & Formats**: JPG, JPEG, PNG, Digital & Scanned PDFs, thermal receipts, B2B GST tax invoices, retail cash memos.
     8. **Security & Data Privacy**: Transparent explanation of file handling, local/workspace storage control, record deletion, and zero unauthorized sharing (no invented ISO/SOC2 claims).
     9. **Frequently Asked Questions**: Real CA questions (GSTIN accuracy, Hindi/regional bills, multi-page PDFs, Tally/Excel compatibility, data privacy) wired to `FAQPage` JSON-LD.
     10. **Strong Final CTA**: Direct transition into the live **LedgerSutra Workspace** (`/app` or interactive tab).
     11. **Professional Footer**: Brand identity, quick links to all 11 SEO pages, 8 CA Resource Center guides, workspace launcher, and legal/compliance disclaimer (*"LedgerSutra is an AI-assisted document automation tool designed to assist Chartered Accountants and finance professionals; all extracted tax figures should be reviewed before statutory filing."*).

---

### Phase 3 — Product & CA Workflow Enhancements (Preserving 100% of Existing Features)
All existing Scanner, Master Excel Sheet, Recharts Dashboard, QR Scanner, and Verbatim Text History features will be preserved and upgraded with dedicated **CA Audit & Validation Controls**:
1. **CA Validation & Exception Engine**:
   - **GSTIN Format & State-Code Validator**: Real-time check against the 15-character Indian GSTIN regex (`^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`) with automatic State Name lookup (e.g., `24` -> Gujarat, `27` -> Maharashtra, `07` -> Delhi).
   - **Duplicate Invoice Detector**: Automatically flags if an uploaded or edited bill shares the same `Invoice Number` + `Seller GSTIN / Shop Name` with an already saved record in the Master Sheet.
   - **Tax Math & Consistency Alert**: Compares `Subtotal (Taxable) + CGST + SGST + IGST - Discount` against `Grand Total` and displays a clear `Verified Math` (Emerald) or `Review Rounding / Tax Delta` (Amber) status indicator.
   - **Missing-Field & Low-Confidence Review Badges**: Highlights bills missing `Seller GSTIN`, `Invoice Number`, or `Bill Date`, or where OCR confidence is `< 80%`.
2. **Supplier-Wise / Party-Wise Summary View**:
   - New sub-view in the Master Sheet & Dashboard grouping saved invoices by **Supplier Name & Seller GSTIN** (showing Invoice Count, Total Taxable Value, Total CGST, Total SGST, Total IGST, and Total Payable per vendor) for effortless GSTR-2B and Purchase Register reconciliation.
3. **Complete Multi-Format Accounting Export Suite**:
   - **Excel (`.xlsx`)**: Upgraded multi-sheet workbook (`LedgerSutra_Purchase_Register`, `Supplier_Summary`, `Exact_OCR_Audit_Trail`).
   - **CSV (`.csv`)**: Clean RFC-4180 CSV export of the active sheet view.
   - **JSON (`.json`)**: Structured schema export for ERP/API ingestion.
   - **SQL (`.sql`)**: Ready-to-run `CREATE TABLE` + `INSERT INTO ledger_invoices` and `ledger_invoice_items` SQL script export.

---

### Phase 4 — Technical SEO, 11 Landing Pages & 8-Article CA Resource Center
1. **Clean Client + Server SPA Routing**:
   - Implement clean URL routing (`window.history.pushState` + `popstate` + direct route rendering) so every page has a real, crawlable path (`https://casaarthiai.in/...`), dynamic `<title>`, `<meta name="description">`, `<link rel="canonical">`, OpenGraph, Twitter Card, and dynamic route-specific JSON-LD structured data.
2. **11 Dedicated SEO & Product Pages**:
   - **Core SaaS Pages**:
     - `/features` — Deep dive into OCR, GST extraction, line-item parsing, and exports.
     - `/how-it-works` — Step-by-step technical & CA workflow guide.
     - `/pricing` — Transparent, honest usage tiers for solo practitioners, mid-size CA firms, and enterprise audit teams.
     - `/about` — Mission, Indian accounting automation focus, and ethical AI commitment.
     - `/contact` — Validated inquiry & CA firm onboarding form with instant confirmation state.
   - **6 High-Intent CA SEO Landing Pages** (each with unique H1/H2 hierarchy, workflow diagrams, CA use cases, internal links, and page-specific FAQs):
     - `/invoice-ocr-for-ca` — *Invoice OCR Software for Chartered Accountants in India*
     - `/gst-invoice-data-extraction` — *Automated GST Invoice Data Extraction (GSTIN, HSN, CGST, SGST, IGST)*
     - `/pdf-invoice-to-excel` — *Convert PDF & Scanned Invoices to Structured Excel Sheets*
     - `/bulk-invoice-processing` — *Bulk Invoice Processing & Multi-Bill Merger for CA Firms*
     - `/invoice-automation-for-accountants` — *AI Invoice Automation for Accountants & Tax Consultants*
     - `/document-scanning-software` — *Intelligent Financial Document & Receipt Scanning Software*
3. **CA Resource Center (`/resources` + 8 Full-Length Educational Guides)**:
   - Each article (800–1,200+ words of genuine, practical Indian accounting utility, structured tables, checklists, and `Article` JSON-LD):
     1. `/resources/automate-invoice-data-entry-ca-firms` — *How CA Firms Can Automate Invoice Data Entry Without Losing Audit Control*
     2. `/resources/ocr-for-gst-invoices-complete-guide` — *OCR for GST Invoices: Complete Guide for Indian Accountants*
     3. `/resources/convert-purchase-bills-to-excel-accounting` — *How to Convert Purchase Bills & PDFs into Clean Excel Sheets for Accounting*
     4. `/resources/common-errors-manual-invoice-entry` — *7 Common Errors in Manual Invoice Data Entry & How Automation Prevents Them*
     5. `/resources/digital-document-workflow-chartered-accountants` — *Designing a Paperless Digital Document Workflow for Modern CA Practices*
     6. `/resources/gst-invoice-fields-checklist-verification` — *Mandatory GST Invoice Fields Under Rule 46: Checklist for Input Tax Credit (ITC) Verification*
     7. `/resources/ai-document-processing-for-tax-consultants` — *How AI Document Processing Helps Tax Consultants During Peak Audit Season*
     8. `/resources/organize-client-bills-monthly-gst-compliance` — *Best Practices to Organize Client Bills for Monthly GSTR-1 & GSTR-3B Compliance*
4. **Static Crawl & Indexing Infrastructure**:
   - Generate `/public/robots.txt` pointing to `https://casaarthiai.in/sitemap.xml`.
   - Generate `/public/sitemap.xml` listing all 21 canonical URLs (`/`, `/app`, 11 SEO/product pages, `/resources`, and 8 resource articles).
   - Ensure `server.ts` and `vercel.json` serve `robots.txt` and `sitemap.xml` with proper MIME types and route all SPA paths cleanly with `200 OK`.

---

### Phase 5 — Performance, Accessibility & Final Deployment Verification
1. **Core Web Vitals & UX Polish**:
   - Responsive layout audit across 375px mobile, 768px tablet, and 1440px desktop viewports.
   - Keyboard accessibility, ARIA labels on icon buttons, high-contrast light/dark theme parity.
2. **Build & Deployment Verification**:
   - Run `compile_applet` (`tsc --noEmit` and `vite build`) to verify zero TypeScript or bundler errors.
   - Provide clear git/Vercel deployment instructions for `https://casaarthiai.in`.
