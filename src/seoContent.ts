export const SITE_DOMAIN = 'https://www.casaarthiai.in';
export const BRAND_NAME = 'LedgerSutra';
export const BRAND_TAGLINE = 'GST Invoice OCR, TallyPrime XML & GSTR-2B Reconciliation for Indian CA Firms';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoLandingPageSpec {
  slug: string;
  path: string;
  badge: string;
  h1: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeywords: string[];
  problemStatement: string;
  longFormParagraphs?: string[];
  workflowSteps: Array<{ title: string; detail: string }>;
  keyCapabilities: Array<{ title: string; description: string }>;
  extractedFields: string[];
  caUseCases: string[];
  faqs: FaqItem[];
}

export interface ResourceArticleSpec {
  slug: string;
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  readTime: string;
  publishedDate: string;
  summary: string;
  keyTakeaways: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
    checklist?: string[];
  }>;
  faqs: FaqItem[];
}

export const HOMEPAGE_FAQS: FaqItem[] = [
  {
    question: 'What is the extraction accuracy on Indian GST invoices?',
    answer:
      'Extraction accuracy depends on invoice print and scan quality (digital PDF vs. low-light WhatsApp photo). Rather than publishing fixed marketing percentages, LedgerSutra provides a built-in Accuracy Test tool where you can upload your own client invoices and a ground-truth Excel sheet to measure field-level accuracy on your real documents.',
  },
  {
    question: 'What document formats are supported?',
    answer:
      'LedgerSutra supports single-page and multi-page PDFs (both digital ERP PDFs and scanned PDFs), mobile camera photos (JPG, JPEG, PNG, WEBP), Bill of Entry import documents, and e-invoice QR images.',
  },
  {
    question: 'Does LedgerSutra work on handwritten or faded thermal invoices?',
    answer:
      'Accuracy depends on handwriting legibility and ink contrast. Printed, computer-generated, and clear thermal GST invoices extract reliably, while handwritten or heavily smudged bills are automatically flagged with a "Needs Review" status so your staff can verify fields side-by-side.',
  },
  {
    question: 'Is the XML export directly compatible with TallyPrime?',
    answer:
      'Yes. LedgerSutra generates TallyPrime-importable XML using the standard ENVELOPE > IMPORTDATA > Vouchers schema with configurable Purchase, CGST, SGST, IGST, and Round-Off ledger names, plus an option to auto-create missing supplier ledgers.',
  },
  {
    question: 'How does the GSTR-2B reconciliation engine work?',
    answer:
      'Upload the GSTR-2B JSON or Excel file downloaded from the GST portal. LedgerSutra matches portal B2B invoices against your scanned purchase register by Supplier GSTIN and normalized invoice number, then falls back to fuzzy amount + date matching with a configurable tolerance (default ₹1).',
  },
  {
    question: 'How is client financial data secured and stored?',
    answer:
      'Authentication uses Google Sign-In via Firebase Authentication. All client workspaces, bills, and audit logs are isolated per authenticated user in Firestore over HTTPS encryption in transit. You can delete any client workspace or your entire account data at any time.',
  },
  {
    question: 'What are the pricing plans and is there a CA-firm pilot?',
    answer:
      'We offer three structured practice tiers: Starter / Trial (₹0 / month), CA Practice Pro (₹1,499 / month), and Firm / Enterprise (₹3,999 / month). Early-access pricing — locked for pilot firms.',
  },
  {
    question: 'How many invoices can I upload in a single batch?',
    answer:
      'The batch processing queue lets you select and process dozens of PDFs and images sequentially with per-file progress bars, retry controls, and automatic Master Sheet insertion without reloading the browser.',
  },
  {
    question: 'Can I manage multiple clients separately for my CA practice?',
    answer:
      'Yes. You can create separate Client profiles (Name, GSTIN, PAN, Financial Year, Notes) and switch between clients from the header. All scanning, Master Sheet views, GSTR-2B reconciliation, and Tally XML exports stay strictly scoped to the active client.',
  },
  {
    question: 'Do you support team access and maker-checker approval workflows?',
    answer:
      'Yes. Firm owners can assign Owner/CA, Reviewer, and Staff (upload-only) roles. Staff can scan and submit bills for review, while only Owners and Reviewers can mark bills as Approved or Rejected, with a per-bill audit trail.',
  },
  {
    question: 'Is there an API for integrating invoice extraction into our own ERP or practice tool?',
    answer:
      'Yes. You can generate SHA-256 hashed API keys in Settings > API and call POST /api/v1/extract with a multipart invoice file to receive structured JSON.',
  },
  {
    question: 'Which languages and support channels are available?',
    answer:
      'Our hybrid OCR pipeline supports English and Devanagari Hindi (eng+hin) for regional bills. Support and CA onboarding assistance are available via the Contact page.',
  },
];

export const DEDICATED_SEO_PAGES: Record<string, SeoLandingPageSpec> = {
  '/invoice-ocr-for-ca': {
    slug: 'invoice-ocr-for-ca',
    path: '/invoice-ocr-for-ca',
    badge: 'Chartered Accountant OCR Workflow',
    h1: 'Invoice OCR Built for Indian CA Firms',
    subtitle:
      'Eliminate manual voucher typing during GST filing and tax audits. Extract supplier GSTIN, invoice numbers, HSN codes, and tax splits from scanned PDFs and mobile bill photos with audit-grade precision.',
    metaTitle: 'Invoice OCR Software for CA Firms in India | LedgerSutra',
    metaDescription:
      'Automate client purchase register creation with GST invoice OCR built for Indian CA firms. Extract GSTINs, HSN codes, and tax splits. Try OCR today.',
    primaryKeywords: [
      'invoice OCR for CA',
      'CA firm invoice automation India',
      'chartered accountant bill scanning software',
      'OCR software for tax consultants',
    ],
    problemStatement:
      'CA firms and article assistants spend hundreds of hours every month keying in paper bills, WhatsApp invoice photos, and multi-page PDF statements sent by clients right before the 11th and 20th GST filing deadlines.',
    workflowSteps: [
      {
        title: '1. Upload Client Invoice Batches',
        detail: 'Select multiple JPG, PNG, or multi-page PDF invoices received via email or WhatsApp.',
      },
      {
        title: '2. High-DPI Preprocessing & Hybrid OCR',
        detail:
          'LedgerSutra sharpens faint thermal ink, extracts PDF coordinate layers, and runs bilingual English + Hindi OCR.',
      },
      {
        title: '3. Automated GST & Tax Math Audit',
        detail:
          'Verify 15-character Seller GSTIN format, state code, duplicate invoice numbers, and Taxable + GST = Grand Total math.',
      },
      {
        title: '4. Export to Excel, CSV, JSON, or SQL',
        detail:
          'Download a consolidated 1-Bill-per-Row summary or detailed line-item register ready for accounting review.',
      },
    ],
    keyCapabilities: [
      {
        title: '15-Character GSTIN & State Code Verification',
        description:
          'Automatically checks Indian GSTIN structure (State Code + PAN + Entity + Z + Checksum) and maps all 37 GST states and Union Territories.',
      },
      {
        title: 'Bilingual English + Hindi Bill Recognition',
        description:
          'Reads regional kirana bills, mandi receipts, and bilingual commercial invoices using English + Devanagari OCR.',
      },
      {
        title: 'Zero Missed Line Items',
        description:
          'Combines AI Vision extraction with deterministic coordinate table parsing so every product row is captured.',
      },
      {
        title: 'Duplicate Invoice Alerting',
        description:
          'Prevents double ITC claims by flagging repeated Invoice Numbers from the same Supplier GSTIN or party.',
      },
    ],
    extractedFields: [
      'Supplier / Party Name',
      'Seller GSTIN (with State Lookup)',
      'Buyer Name & Buyer GSTIN',
      'Invoice Number & Bill Date',
      'HSN / SAC Code',
      'Quantity, Unit (UOM) & Unit Rate',
      'Taxable Value & Discount',
      'CGST, SGST & IGST Amounts',
      'Grand Total & Verbatim Raw Text',
    ],
    caUseCases: [
      'Monthly Purchase Register preparation for SME and retail clients',
      'Pre-filing verification of Input Tax Credit (ITC) supporting bills',
      'Statutory & Tax Audit (44AB) voucher vouching and sampling',
      'Digitizing physical box files into searchable text and Excel workbooks',
    ],
    faqs: [
      {
        question: 'Can LedgerSutra handle WhatsApp photos of crumpled or shadowed client bills?',
        answer:
          'Yes. LedgerSutra applies automated luminance normalization and contrast stretching before running OCR, improving readability on mobile photos.',
      },
      {
        question: 'Does it support both summary-level and item-wise accounting sheets?',
        answer:
          'Yes. You can toggle instantaneously between "1 Bill = 1 Row" summary view and "CA Detailed Line-Item Rows" without rescanning.',
      },
    ],
  },

  '/gst-invoice-data-extraction': {
    slug: 'gst-invoice-data-extraction',
    path: '/gst-invoice-data-extraction',
    badge: 'GST Compliance & Reconciliation',
    h1: 'Automated GST Invoice Data Extraction',
    subtitle:
      'Extract Seller GSTIN, Buyer GSTIN, HSN/SAC codes, Taxable Value, and CGST/SGST/IGST breakups from B2B and B2C invoices. Built for accurate GSTR-1, GSTR-2B, and GSTR-3B working papers.',
    metaTitle: 'Automated GST Invoice Data Extraction | LedgerSutra',
    metaDescription:
      'Extract Seller GSTIN, Buyer GSTIN, invoice number, HSN codes, and CGST/SGST/IGST splits from PDF and image bills automatically. Start scanning now.',
    primaryKeywords: [
      'GST invoice data extraction',
      'extract GSTIN from PDF invoice',
      'GSTR-2B purchase register automation',
      'HSN code invoice extractor India',
    ],
    problemStatement:
      'A single typo in a 15-character GSTIN or misread CGST/IGST split can lead to GSTR-2B mismatches, blocked Input Tax Credit (ITC), and compliance notices for your clients.',
    workflowSteps: [
      {
        title: '1. Drop B2B or Retail GST Invoices',
        detail: 'Upload single or multi-page tax invoices in PDF, JPG, or PNG format.',
      },
      {
        title: '2. Structured GST Field Parsing',
        detail: 'Separates Supplier GSTIN from Buyer GSTIN and identifies intra-state (CGST+SGST) vs inter-state (IGST) tax.',
      },
      {
        title: '3. Supplier-Wise Summary Aggregation',
        detail:
          'Group all scanned bills by Seller GSTIN to view invoice counts, total taxable value, and total GST per vendor.',
      },
      {
        title: '4. Download Audit-Ready GST Sheets',
        detail: 'Export directly to Excel (.xlsx) or CSV for GSTR-2B reconciliation and working paper documentation.',
      },
    ],
    keyCapabilities: [
      {
        title: 'Real-Time GSTIN Regex & PAN Extraction',
        description:
          'Validates the 2-digit Indian state code (01 to 38) and embedded 10-character PAN inside every extracted GSTIN.',
      },
      {
        title: 'Tax Math Consistency Engine',
        description:
          'Automatically checks whether Taxable Value + CGST + SGST + IGST minus Discount equals the Invoice Grand Total.',
      },
      {
        title: 'Supplier-Wise / GSTIN-Wise Rollup',
        description:
          'Consolidates multiple bills from the same vendor into a clean party-wise summary for faster GSTR-2B comparison.',
      },
      {
        title: 'Custom Dynamic Header & Item Columns',
        description:
          'Capture industry-specific fields such as E-Way Bill No, Vehicle No, Batch No, or Drug License No.',
      },
    ],
    extractedFields: [
      '15-Digit Seller GSTIN & State Name',
      '15-Digit Buyer GSTIN',
      'Tax Invoice Number & Date (YYYY-MM-DD)',
      'Place of Supply & Voucher Category',
      'Line-Item HSN / SAC Codes',
      'Taxable Subtotal (₹)',
      'CGST, SGST & IGST Breakup (₹)',
      'Total Tax & Grand Total (₹)',
    ],
    caUseCases: [
      'Reconciling physical purchase invoices against GSTR-2B portal downloads',
      'Segregating B2B registered purchases from B2C unregistered expenses',
      'Preparing HSN-wise summary tables for GSTR-1 filing',
      'Identifying missing GSTINs or invalid tax calculations before return lock',
    ],
    faqs: [
      {
        question: 'How does LedgerSutra distinguish between Seller GSTIN and Buyer GSTIN on an invoice?',
        answer:
          'The extraction engine analyzes document layout positions (top vendor header vs "Bill To / Buyer" block) so the supplier’s GSTIN is mapped to Seller GSTIN and the client’s GSTIN is mapped to Buyer GSTIN.',
      },
      {
        question: 'What happens if an invoice does not have a GSTIN?',
        answer:
          'LedgerSutra flags the bill as "Unregistered / B2C" in the CA Validation panel so your team knows ITC is not applicable on that voucher.',
      },
    ],
  },

  '/pdf-invoice-to-excel': {
    slug: 'pdf-invoice-to-excel',
    path: '/pdf-invoice-to-excel',
    badge: 'PDF to Excel Converter for Accounting',
    h1: 'Convert PDF Invoices to Excel Automatically',
    subtitle:
      'Stop copy-pasting broken tables from PDFs. Turn single or multi-page PDF invoices into clean, formula-ready Excel workbooks with customizable columns and automatic totals.',
    metaTitle: 'Convert PDF Invoices to Excel (.XLSX) | LedgerSutra',
    metaDescription:
      'Convert digital and scanned PDF purchase invoices into structured Excel (.xlsx) sheets with 1 Bill = 1 Row or line-item detail. Convert PDFs today.',
    primaryKeywords: [
      'PDF invoice to Excel converter',
      'convert GST PDF bill to Excel',
      'purchase bill PDF to spreadsheet India',
      'multi-page PDF invoice extractor',
    ],
    problemStatement:
      'Standard PDF-to-Excel converters dump misaligned text into random cells, forcing accountants to spend more time fixing broken columns than typing the bill from scratch.',
    workflowSteps: [
      {
        title: '1. Select Digital or Scanned PDFs',
        detail: 'Upload native ERP-generated PDFs or scanned image-only PDFs up to multiple pages.',
      },
      {
        title: '2. Coordinate-Aware Table Reconstruction',
        detail:
          'Reads exact X/Y text coordinates from digital PDFs and runs 2.0x High-DPI OCR on scanned PDF pages.',
      },
      {
        title: '3. Choose Your Excel Row Architecture',
        detail:
          'Pick "1 Bill = 1 Row" (with auto-expanding Product 1..N columns) or "CA Detailed Line-Item Rows".',
      },
      {
        title: '4. Export Multi-Sheet .XLSX or Append',
        detail:
          'Download a formatted Excel file containing both your structured accounting sheet and a second sheet with verbatim extracted text.',
      },
    ],
    keyCapabilities: [
      {
        title: '1 Bill = 1 Row Smart Consolidation',
        description:
          'Keeps your master register tidy—each uploaded PDF bill occupies exactly one row with automatic Product 1, Product 2... horizontal expansion when needed.',
      },
      {
        title: 'Append to Existing Excel Workbook',
        description:
          'Upload last month’s or yesterday’s `.xlsx` file and append newly scanned PDF bills directly into the same table.',
      },
      {
        title: 'Selective Column Picker',
        description:
          'Check or uncheck which columns appear in your exported Excel sheet—from basic Date & Cost to full GST & HSN columns.',
      },
      {
        title: 'Multi-Sheet Workbook Output',
        description:
          'Every `.xlsx` download includes Sheet 1 (Structured Register + Grand Total Sum Row) and Sheet 2 (Complete Verbatim OCR Text for audit trail).',
      },
    ],
    extractedFields: [
      'Bill / File Name',
      'Bill Date & Invoice No',
      'Shop / Supplier Name',
      'Product 1, Product 2... Product N Columns',
      'Seller & Buyer GSTIN',
      'Taxable Value & Total GST',
      'Total Cost / Grand Total (with SUM Footer)',
    ],
    caUseCases: [
      'Converting vendor PDF statements and e-commerce tax invoices into Excel',
      'Maintaining a running monthly expense register without creating 20 rows per grocery or hardware bill',
      'Appending weekly client PDF batches into a master quarterly Excel workbook',
      'Exporting clean CSV and SQL scripts for ERP or database ingestion',
    ],
    faqs: [
      {
        question: 'Why does standard copy-paste from PDF to Excel fail on invoices?',
        answer:
          'PDF files store text as positioned graphics rather than spreadsheet cells. LedgerSutra reconstructs horizontal baselines using X/Y coordinate buckets and semantic field parsing so numbers land in the right columns.',
      },
      {
        question: 'Can I customize which columns are included in the Excel download?',
        answer:
          'Yes. In the Merged Excel Sheet tab, you can toggle any standard, GST, or dynamic product column on or off before clicking Export.',
      },
    ],
  },

  '/bulk-invoice-processing': {
    slug: 'bulk-invoice-processing',
    path: '/bulk-invoice-processing',
    badge: 'High-Volume Batch Automation',
    h1: 'Batch Invoice Upload & Processing Queue',
    subtitle:
      'Upload multiple client invoices back-to-back in a single session. Automatically extract, validate, and merge dozens of PDFs and images into one unified accounting register.',
    metaTitle: 'Bulk Invoice Processing & Batch OCR | LedgerSutra',
    metaDescription:
      'Upload and process dozens of PDF and image GST invoices in bulk with per-file progress tracking and unified Excel or XML export. Try batch upload.',
    primaryKeywords: [
      'bulk invoice processing India',
      'batch bill scanner for CA',
      'merge multiple invoices to Excel',
      'high volume invoice data entry automation',
    ],
    problemStatement:
      'During peak compliance weeks between the 1st and 20th of every month, CA firms receive folders containing puluhan or hundreds of mixed-format bills (PDFs, JPEGs, PNGs) that cannot be processed one-by-one with slow manual tools.',
    workflowSteps: [
      {
        title: '1. Multi-Select Files in One Click',
        detail: 'Use multi-file upload to queue multiple PDF and image bills simultaneously.',
      },
      {
        title: '2. Sequential Non-Blocking Extraction',
        detail:
          'Each document is rendered, OCR-scanned, and parsed sequentially with live progress tracking and memory cleanup.',
      },
      {
        title: '3. Instant Auto-Append to Master Sheet',
        detail:
          'Every processed bill slides into your Master Excel Sheet automatically with a "NEW" indicator badge.',
      },
      {
        title: '4. Batch Audit & One-Click Export',
        detail:
          'Review duplicate alerts and supplier summaries across the entire batch, then export once to `.xlsx`, `.csv`, `.json`, or `.sql`.',
      },
    ],
    keyCapabilities: [
      {
        title: 'Zero-Reload Back-to-Back Scanning',
        description:
          'Engineered with automatic canvas memory cleanup and AbortController safeguards so uploading 2nd, 5th, or 20th files never freezes the browser.',
      },
      {
        title: 'Mixed Format Batching',
        description:
          'Combine scanned PDFs, digital PDFs, JPG camera photos, and PNG screenshots in the same batch without pre-sorting.',
      },
      {
        title: 'Cross-Batch Duplicate Detection',
        description:
          'Flags if the same invoice number from the same supplier was accidentally uploaded twice in a client folder.',
      },
      {
        title: 'Unified Multi-Format Export',
        description:
          'Export the entire consolidated batch to Excel (.xlsx), CSV, JSON, or relational SQL (`CREATE TABLE` + `INSERT INTO`).',
      },
    ],
    extractedFields: [
      'Batch File Name & Timestamp',
      'Supplier Name & GSTIN',
      'Invoice Number & Date',
      'Line Items & Dynamic Product Columns',
      'Taxable Subtotal, CGST, SGST, IGST',
      'Grand Total & Batch Column Sums',
    ],
    caUseCases: [
      'Processing monthly client folders shared over Google Drive, Email, or WhatsApp',
      'Clearing backlog book-keeping for quarterly GST return filers',
      'Consolidating multi-branch retail expense bills into a central register',
      'Generating SQL insert scripts for custom practice management databases',
    ],
    faqs: [
      {
        question: 'Do I need to refresh the page between uploading different bills?',
        answer:
          'Never. LedgerSutra is specifically architected for continuous multi-file and back-to-back uploads in the same workspace session.',
      },
      {
        question: 'Can I filter or search bills after processing a bulk batch?',
        answer:
          'Yes. You can filter by date or search by shop name, invoice number, GSTIN, or product name directly in the Merged Excel Sheet.',
      },
    ],
  },

  '/invoice-automation-for-accountants': {
    slug: 'invoice-automation-for-accountants',
    path: '/invoice-automation-for-accountants',
    badge: 'Accounting & Bookkeeping Automation',
    h1: 'Invoice Automation for Accountants',
    subtitle:
      'Replace repetitive voucher entry with intelligent document capture, human-in-the-loop verification, and instant spreadsheet & SQL generation.',
    metaTitle: 'Invoice Automation for Accountants | LedgerSutra',
    metaDescription:
      'Eliminate manual voucher entry for accountants and tax consultants with side-by-side OCR review, GST validation, and Excel export. Automate today.',
    primaryKeywords: [
      'invoice automation for accountants',
      'automated bookkeeping India',
      'accounting data entry automation software',
      'AI tool for tax consultants India',
    ],
    problemStatement:
      'Skilled accountants and tax professionals shouldn’t spend 70% of their billable hours typing invoice numbers and item descriptions from paper bills into spreadsheets.',
    workflowSteps: [
      {
        title: '1. Capture Invoices from Any Source',
        detail: 'Upload PDFs, images, or scan receipt QR codes using your webcam or mobile camera.',
      },
      {
        title: '2. Human-in-the-Loop Side-by-Side Review',
        detail:
          'Inspect the high-resolution document preview alongside editable header fields and line-item rows.',
      },
      {
        title: '3. Dynamic Schema Adaptation',
        detail:
          'Add custom header or item columns on the fly when dealing with specialized pharma, textile, or hardware invoices.',
      },
      {
        title: '4. Analytics & Multi-Format Export',
        detail:
          'Visualize monthly spending and GST trends on the interactive dashboard and export structured registers.',
      },
    ],
    keyCapabilities: [
      {
        title: 'Side-by-Side Visual & Data Editor',
        description:
          'View the original invoice image/PDF on the left while editing any extracted field or product row on the right.',
      },
      {
        title: 'QR Code & UPI Receipt Parser',
        description:
          'Scan B2B e-invoice QR payloads or UPI payment QR codes directly via camera or image upload.',
      },
      {
        title: 'Monthly Spend & GST Analytics Dashboard',
        description:
          'Interactive Area and Bar charts break down monthly Taxable Value, GST outflow, and Grand Total spend.',
      },
      {
        title: 'Dual Persistence (Local + Workspace Store)',
        description:
          'Your scanned bills and custom column presets persist automatically across browser sessions.',
      },
    ],
    extractedFields: [
      'Vendor / Party Name & GSTIN',
      'Voucher Type & Payment Mode (Cash/UPI/Bank)',
      'Invoice Number & Date',
      'Line Items (Qty, Rate, HSN, GST %, Line Total)',
      'Custom Extra Header & Item Attributes',
      'Net Subtotal, Tax & Grand Total',
    ],
    caUseCases: [
      'Outsourced bookkeeping and virtual CFO services for startups and MSMEs',
      'Expense reimbursement verification for corporate finance teams',
      'Preparing monthly management information system (MIS) spend charts',
      'Rapid client onboarding when historical purchase registers are incomplete',
    ],
    faqs: [
      {
        question: 'Can accountants edit extracted values before adding a bill to the master sheet?',
        answer:
          'Yes. Every extracted field—including shop name, GSTIN, invoice date, and individual product quantities or rates—is 100% editable in real time.',
      },
      {
        question: 'Does LedgerSutra include built-in sample bills to test the workflow?',
        answer:
          'Yes. You can load realistic sample GST invoices and retail bills directly in the workspace or upload your own client files immediately.',
      },
    ],
  },

  '/document-scanning-software': {
    slug: 'document-scanning-software',
    path: '/document-scanning-software',
    badge: 'Verbatim OCR & Document Digitization',
    h1: 'Document Scanning Software for CA Firms',
    subtitle:
      'Extract 100% verbatim readable text and structured tables from scanned PDFs, tilted photos, and bilingual English + Hindi financial documents.',
    metaTitle: 'Document Scanning Software for CA Firms | LedgerSutra',
    metaDescription:
      'High-DPI document scanning software with English and Hindi OCR for CA firms. Extract verbatim text (.txt) and structured Excel tables. Scan a file.',
    primaryKeywords: [
      'document scanning software India',
      'PDF and image to text converter',
      'English Hindi OCR software for bills',
      'financial document digitization tool',
    ],
    problemStatement:
      'Financial notices, rent agreements, composite bills, and legacy scanned PDFs often trap critical numbers inside unsearchable images or low-contrast scans.',
    workflowSteps: [
      {
        title: '1. Upload Any PDF or Image Document',
        detail: 'Supports multi-page PDFs (up to 5 pages per scan pass) and high-resolution JPG/PNG images.',
      },
      {
        title: '2. 2.0x High-DPI Canvas Contrast Enhancement',
        detail:
          'Normalizes page illumination and stretches text contrast so small fonts, GSTINs, and Hindi matras are crisp.',
      },
      {
        title: '3. Verbatim Text + Structured Table Extraction',
        detail:
          'Generates both a complete verbatim text transcript and a structured bill/item breakdown simultaneously.',
      },
      {
        title: '4. Copy Text, Download .TXT, or Export .XLSX',
        detail:
          'Copy raw text in one click, download `.txt` archives, or merge structured data into Excel and SQL.',
      },
    ],
    keyCapabilities: [
      {
        title: '100% Verbatim Text Output Box',
        description:
          'Every scanned document produces a clean, editable raw text transcript that can be copied or downloaded as a `.txt` file.',
      },
      {
        title: 'Deep Enhance Re-Scan Control',
        description:
          'Trigger an on-demand deep visual OCR pass (`eng+hin`) whenever a scanned document has faint or complex typography.',
      },
      {
        title: 'Multi-Page PDF Navigation',
        description:
          'Flip through rendered pages right inside the preview pane while reviewing page-segmented extracted text.',
      },
      {
        title: 'Permanent Verbatim Text History',
        description:
          'Access all previously scanned documents in the Exact Text History tab to re-copy or download transcripts anytime.',
      },
    ],
    extractedFields: [
      'Complete Verbatim Page-by-Page Text',
      'Document Type Classification (Bill vs Normal Document)',
      'Page Count & OCR Language Metadata',
      'OCR Confidence Score (%)',
      'Structured Invoice & Line-Item Fields (when applicable)',
    ],
    caUseCases: [
      'Digitizing scanned GST notices, assessment orders, and legal deeds into editable text',
      'Extracting text from bilingual Hindi + English mandi and transport receipts',
      'Creating searchable text archives alongside Excel purchase registers',
      'Verifying raw OCR text against structured spreadsheet rows during audit review',
    ],
    faqs: [
      {
        question: 'Can I use LedgerSutra just to extract plain text from a PDF or image?',
        answer:
          'Absolutely. Every upload immediately populates the "Exact Image / PDF to Text Output" panel with one-click Copy and `.TXT` download buttons.',
      },
      {
        question: 'Does it support Hindi (Devanagari) text extraction?',
        answer:
          'Yes. The client-side OCR engine is configured with bilingual `eng+hin` support to read both English and Devanagari script.',
      },
    ],
  },

  '/gst-invoice-to-tally': {
    slug: 'gst-invoice-to-tally',
    path: '/gst-invoice-to-tally',
    badge: 'TallyPrime XML Voucher Import',
    h1: 'Convert GST Invoices to TallyPrime XML Vouchers Automatically',
    subtitle:
      'Extract supplier GSTIN, invoice number, date, taxable value, and CGST/SGST/IGST splits from PDF or photo bills and generate TallyPrime-ready XML purchase vouchers in one click.',
    metaTitle: 'Convert GST Invoice to TallyPrime XML | LedgerSutra',
    metaDescription:
      'Convert PDF and photo GST purchase bills directly into TallyPrime XML vouchers with party ledger auto-creation and GST audit checks. Export XML now.',
    primaryKeywords: [
      'GST invoice to Tally XML',
      'import PDF invoice into TallyPrime',
      'purchase bill to Tally converter India',
      'CA firm Tally automation software',
    ],
    problemStatement:
      'Every month, article assistants and junior accountants in Indian CA firms spend days manually keying purchase vouchers into TallyPrime—selecting party ledgers, typing 16-character invoice numbers, splitting taxable amounts, and matching CGST, SGST, IGST, and round-off entries.',
    longFormParagraphs: [
      'Manual purchase voucher entry in TallyPrime is one of the most time-consuming bottlenecks in an Indian Chartered Accountant practice. Whether a client submits digital ERP PDFs, multi-page distributor bills, or WhatsApp photographs of paper invoices, someone has to verify the 15-character supplier GSTIN, check whether the transaction is intra-state (CGST + SGST) or inter-state (IGST), and ensure the ledger totals balance to the exact rupee.',
      'LedgerSutra eliminates repetitive voucher typing by combining hybrid OCR extraction with a purpose-built TallyPrime XML generator. When you upload a single bill or a batch of client invoices, LedgerSutra extracts the supplier name, Seller GSTIN, invoice number, invoice date, HSN/SAC line items, taxable subtotal, CGST, SGST, IGST, other charges, and round-off automatically.',
      'Before generating the XML file, LedgerSutra runs a deterministic Pre-Export Validation check. Any voucher with a missing invoice number, unrecognized date, invalid 15-digit GSTIN format/checksum, or tax math variance is flagged on the validation screen with a "Fix Now" link or an option to skip blocked bills. This ensures broken vouchers never pollute your client’s Tally company data.',
      'In the Tally Settings panel, you can map your exact TallyPrime Company Name, Purchase Ledger Name, Input CGST, Input SGST, Input IGST, and Round-Off ledger names per client. You can also enable "Auto-create missing party ledgers", which embeds `<LEDGER ACTION="Create">` master blocks under Sundry Creditors with the supplier’s GSTIN and State Name right inside the XML envelope so TallyPrime imports vouchers cleanly on the first attempt.',
    ],
    workflowSteps: [
      {
        title: '1. Upload PDF or Photo Purchase Bills',
        detail: 'Drop single or bulk GST invoices into your client workspace.',
      },
      {
        title: '2. Configure Client Tally Ledger Names',
        detail:
          'Set your TallyPrime company name, purchase ledger, CGST/SGST/IGST ledgers, and enable auto-creation of missing party ledgers.',
      },
      {
        title: '3. Run Pre-Export GST & Math Validation',
        detail:
          'Review and fix any bills flagged for missing invoice numbers, invalid GSTINs, or tax math mismatches before export.',
      },
      {
        title: '4. Import XML in TallyPrime (Alt + O > Import > Vouchers)',
        detail:
          'Download the `.xml` file with properly signed Debit/Credit (`ISDEEMEDPOSITIVE`) ledger entries and import directly into TallyPrime.',
      },
    ],
    keyCapabilities: [
      {
        title: 'Standards-Compliant TallyPrime XML Envelope',
        description:
          'Generates `ENVELOPE > HEADER > BODY > IMPORTDATA > Vouchers` with YYYYMMDD dates, bill allocations, and XML character escaping.',
      },
      {
        title: 'Auto-Create Missing Supplier Ledgers',
        description:
          'Optionally includes `<LEDGER>` master messages under Sundry Creditors with `PARTYGSTIN` and `LEDSTATENAME` so new vendors never fail import.',
      },
      {
        title: 'Pre-Export Validation Gate',
        description:
          'Lists any blocked bills (missing date/invoice no, invalid GSTIN, tax mismatch) with one-click "Fix Now" or "Skip & Export Valid Bills".',
      },
      {
        title: 'Also Supports Zoho Books CSV & Busy Excel',
        description:
          'Need to import into Zoho Books or Busy Accounting instead of Tally? Export mapped CSV and `.xlsx` files from the same menu.',
      },
    ],
    extractedFields: [
      'DATE (YYYYMMDD) & VOUCHERNUMBER',
      'REFERENCE (Original Supplier Invoice No)',
      'PARTYLEDGERNAME & PARTYGSTIN',
      'Party Credit Entry (Grand Total)',
      'Purchase Debit Entry (Net Taxable Value)',
      'Separate CGST, SGST & IGST Debit Entries',
      'Automatic Round-Off & Other Charges Entries',
    ],
    caUseCases: [
      'Importing monthly B2B purchase registers into TallyPrime before GSTR-3B filing',
      'Onboarding backlog client books for annual tax audit (Section 44AB)',
      'Standardizing ledger names across multiple article assistants and staff members',
      'Exporting only Reviewer/Owner-Approved bills into Tally books',
    ],
    faqs: [
      {
        question: 'How do I import the downloaded XML file into TallyPrime?',
        answer:
          'Open your client company in TallyPrime, press Alt + O (Import) > Vouchers, select the XML file exported from LedgerSutra, and press Enter.',
      },
      {
        question: 'What if a supplier ledger does not exist in TallyPrime yet?',
        answer:
          'Keep "Auto-create missing party ledgers" enabled in Tally Settings. LedgerSutra will include the LEDGER creation nodes under Sundry Creditors with the supplier GSTIN in the same XML file.',
      },
      {
        question: 'Does it handle round-off differences between taxable + tax and grand total?',
        answer:
          'Yes. Any rounding difference is automatically posted to your configured Round-Off ledger with the correct Debit or Credit sign (`ISDEEMEDPOSITIVE`) so the voucher always balances.',
      },
    ],
  },

  '/gstr-2b-reconciliation-excel': {
    slug: 'gstr-2b-reconciliation-excel',
    path: '/gstr-2b-reconciliation-excel',
    badge: 'GSTR-2B vs Purchase Books Matching',
    h1: 'GSTR-2B Reconciliation in Excel',
    subtitle:
      'Match your scanned purchase register against GST portal GSTR-2B JSON or Excel files in seconds. Identify Eligible ITC, ITC at Risk, Amount Mismatches, and Unbooked 2B bills automatically.',
    metaTitle: 'GSTR-2B Reconciliation in Excel — 6-Status Match | LedgerSutra',
    metaDescription:
      'Match your purchase register against GST portal GSTR-2B JSON or Excel files with 6-status classification and multi-sheet Excel export. Reconcile now.',
    primaryKeywords: [
      'GSTR-2B reconciliation Excel',
      'reconcile purchase register with GSTR-2B JSON',
      'ITC reconciliation tool for CA firms',
      'GSTR-2B vs books matching software',
    ],
    problemStatement:
      'Under current GST rules, Input Tax Credit (ITC) can only be claimed in GSTR-3B if the supplier invoice appears in GSTR-2B. Reconciling hundreds of purchase bills against portal JSON or Excel downloads using manual VLOOKUPs breaks whenever suppliers add prefixes, slashes, or leading zeros to invoice numbers.',
    longFormParagraphs: [
      'Manual VLOOKUP reconciliation in Excel fails on real-world Indian GST data because suppliers frequently format invoice numbers differently when filing GSTR-1—for example, `INV/2026-27/0042` on the printed bill might appear as `INV2627-42` or `042` in GSTR-2B. Additionally, small rounding variances of ₹0.50 or ₹1.00 cause exact-match formulas to reject valid vouchers.',
      'LedgerSutra includes a dedicated GSTR-2B Reconciliation workspace designed specifically for Indian CA firms and GST practitioners. You can upload the official GSTR-2B JSON file or Excel workbook downloaded directly from the GST portal, and LedgerSutra parses the B2B supplier invoices (Supplier GSTIN, Trade Name, Invoice No, Date, Taxable Value, IGST, CGST, SGST, and ITC Availability).',
      'Our two-pass matching engine first pairs records by Supplier GSTIN + Normalized Invoice Number (stripping spaces, slashes, hyphens, and leading zeros, case-insensitively). For remaining unmatched bills from the same supplier, it runs a fuzzy fallback on Invoice Amount (with a configurable rupee tolerance, default ₹1) and Date to catch probable invoice number typos.',
      'Every record is classified into one of 6 clear audit statuses: Matched, Amount Mismatch, Date Mismatch, Invoice Number Mismatch (Probable), In Books but Not in 2B, and In 2B but Not in Books. You can add per-row audit notes, manually override match statuses, filter by tax period, and export a complete multi-sheet Excel reconciliation workbook containing a Summary sheet plus one dedicated worksheet per status.',
    ],
    workflowSteps: [
      {
        title: '1. Scan or Import Client Purchase Bills',
        detail: 'Build your purchase register by scanning PDF/image invoices or importing an existing Excel sheet.',
      },
      {
        title: '2. Upload Portal GSTR-2B JSON or Excel',
        detail: 'Drop the GSTR-2B `.json` or `.xlsx` file downloaded from the GST portal into the GSTR-2B Reconciliation tab.',
      },
      {
        title: '3. Review 6-Status Match & ITC Summary Cards',
        detail:
          'Inspect Total ITC as per Books vs. GSTR-2B, ITC at Risk, and side-by-side differences with configurable rupee tolerance.',
      },
      {
        title: '4. Export Multi-Sheet Reconciliation Excel',
        detail:
          'Download a structured `.xlsx` workbook with a Summary tab and separate tabs for Matched, Mismatched, Missing in 2B, and Missing in Books.',
      },
    ],
    keyCapabilities: [
      {
        title: 'Dual GSTR-2B JSON & Excel Parser',
        description:
          'Reads both official GST portal JSON (`docdata.b2b`) and GSTR-2B Excel workbooks with clear error reporting.',
      },
      {
        title: 'Smart Invoice Normalization + Fuzzy Fallback',
        description:
          'Strips spaces, slashes, and leading zeros first, then falls back to GSTIN + Amount + Date matching to catch supplier typos.',
      },
      {
        title: 'Configurable Amount Tolerance (Default ₹1)',
        description:
          'Adjust the rounding tolerance in rupees so minor paise differences do not trigger false mismatch alerts.',
      },
      {
        title: 'Multi-Sheet Excel Working Paper Export',
        description:
          'Generates a client-ready Excel report with one sheet per reconciliation status plus an executive ITC summary.',
      },
    ],
    extractedFields: [
      'Supplier GSTIN & Trade Name',
      'Books vs 2B Invoice Number & Date',
      'Books vs 2B Taxable Value & Variance (₹)',
      'Books vs 2B IGST, CGST, SGST & Total Tax Diff',
      '2B ITC Availability Flag (YES / NO)',
      'Per-Row CA Audit Note & Manual Override Status',
    ],
    caUseCases: [
      'Monthly GSTR-2B vs Purchase Register reconciliation before filing GSTR-3B',
      'Identifying suppliers who have not filed GSTR-1 ("In Books but Not in 2B") for client follow-up',
      'Catching unbooked purchase bills ("In 2B but Not in Books") to maximize legitimate ITC claims',
      'Preparing annual GSTR-9 / 9C ITC reconciliation working papers',
    ],
    faqs: [
      {
        question: 'Can I upload both GSTR-2B JSON and Excel files?',
        answer:
          'Yes. The GSTR-2B Reconciliation tab accepts both the raw `.json` file and `.xlsx` / `.xls` files downloaded from the GST portal.',
      },
      {
        question: 'What if a supplier typed the invoice number slightly differently in GSTR-1?',
        answer:
          'LedgerSutra normalizes punctuation and leading zeros automatically, and uses fuzzy matching on Supplier GSTIN + Amount + Date to flag probable Invoice Number Mismatches for one-click manual confirmation.',
      },
      {
        question: 'How is the exported Excel reconciliation report structured?',
        answer:
          'It includes a Summary sheet (Total ITC Books vs 2B, ITC at Risk, and status totals) followed by 6 dedicated worksheets—one for each reconciliation status.',
      },
    ],
  },

  '/bulk-invoice-processing-for-ca': {
    slug: 'bulk-invoice-processing-for-ca',
    path: '/bulk-invoice-processing-for-ca',
    badge: 'CA Practice Batch Automation',
    h1: 'Bulk Invoice Processing for CA Firms',
    subtitle:
      'Process dozens of client PDFs and bill photos in a queued batch pipeline, organize registers client-by-client, enforce team review workflows, and export to TallyPrime or Excel.',
    metaTitle: 'Bulk Invoice Processing for CA Firms | LedgerSutra',
    metaDescription:
      'Manage bulk invoice scanning across multiple client GSTIN workspaces with maker-checker review queues and duplicate bill detection. Start a pilot.',
    primaryKeywords: [
      'bulk invoice processing for CA',
      'batch GST invoice scanner India',
      'multi-client accounting workspace for CA firms',
      'automate article assistant bill entry',
    ],
    problemStatement:
      'During peak GST compliance weeks (1st to 20th of every month), a typical CA practice handles dozens of clients—each sending 50 to 500 mixed PDF and image bills. Processing bills one at a time without client separation or maker-checker review leads to bottlenecks and filing errors.',
    longFormParagraphs: [
      'High-volume compliance in an Indian Chartered Accountant firm requires more than a single-file OCR widget. When clients share zip archives or WhatsApp folders containing hundreds of purchase bills, your team needs a structured batch pipeline that processes files reliably, tracks per-file progress, and keeps every client’s books strictly segregated.',
      'LedgerSutra is built around a Client-Wise Workspace architecture (`/users/{uid}/clients/{clientId}`). From the header switcher, your team can create, edit, or archive client profiles—recording the client’s Legal Name, 15-digit GSTIN, PAN, and Financial Year. Every batch scan, Master Sheet view, GSTR-2B reconciliation, and Tally XML export operates exclusively on the active client.',
      'Inside the workspace, the dedicated Batch Invoice Upload & Processing Queue lets staff drag and drop multiple PDFs and images at once. Each file shows an individual progress bar (0%–100%), stage label, and extracted summary. If any invoice has low OCR confidence, a missing invoice number, an invalid GSTIN, or a tax mismatch, LedgerSutra automatically marks it with a "Needs Review" flag so reviewers can filter the Review Queue immediately.',
      'Furthermore, LedgerSutra supports role-based Team Access (Owner/CA, Reviewer, and Staff). Staff members can upload bills and submit them for review (`Pending Review`), while only Owners and Reviewers can mark bills as `Approved` or `Rejected` (with a recorded rejection reason and full timestamped audit trail). By default, only Approved bills flow into TallyPrime XML exports and GSTR-2B reconciliations.',
    ],
    workflowSteps: [
      {
        title: '1. Select or Create the Client Workspace',
        detail: 'Switch to the target client (with their GSTIN, PAN, and Financial Year) in the header.',
      },
      {
        title: '2. Queue Multiple Invoices in Batch Upload',
        detail: 'Drop dozens of PDFs and images into the Batch Queue and track per-file progress bars in real time.',
      },
      {
        title: '3. Filter the Review Queue & Approve Bills',
        detail:
          'Reviewers inspect bills flagged as "Needs Review" or duplicate collisions and mark verified vouchers as Approved.',
      },
      {
        title: '4. Export Approved Register to Tally, Excel, Zoho, or Busy',
        detail:
          'Download TallyPrime XML, multi-sheet Excel, Zoho Books CSV, or Busy Excel for the client.',
      },
    ],
    keyCapabilities: [
      {
        title: 'Dedicated Batch Queue with Per-File Progress',
        description:
          'Monitor Queued, Scanning, Completed, and Error states with individual progress bars and one-click retry.',
      },
      {
        title: 'Client-Wise Isolation & Overview Dashboard',
        description:
          'Manage all firm clients with an overview of Bill Count, Total Taxable, Total GST, and Pending Review counts per client.',
      },
      {
        title: 'Maker-Checker Team Approval & Audit Trail',
        description:
          'Assign Owner, Reviewer, and Staff roles. Track who uploaded, edited, and approved every bill with timestamps.',
      },
      {
        title: 'Duplicate Invoice Resolution Modal',
        description:
          'Automatically detects duplicate `Invoice Number + Shop Name` entries and lets you Merge Items, Overwrite, or Save as Duplicate.',
      },
    ],
    extractedFields: [
      'Standard GST Header & Line-Item Fields',
      'IRN, E-Way Bill No & E-Invoice QR Payload',
      'Supplier & Buyer Address, State & PAN',
      'Bank Name, Account No & IFSC Code',
      'PO Number, Due Date, Payment Terms & Currency',
      'Discount, Other Charges, Round-Off & Bill of Entry Fields',
    ],
    caUseCases: [
      'Managing 20+ monthly GST retainer clients under one firm account',
      'Delegating bulk scanning to article assistants (Staff role) while CAs (Owner/Reviewer) approve exceptions',
      'Preventing duplicate bill entry across weekly client uploads',
      'Measuring real extraction accuracy on client samples using the built-in Accuracy Test page',
    ],
    faqs: [
      {
        question: 'Can staff upload bills without being able to approve them for Tally export?',
        answer:
          'Yes. Users assigned the Staff role can upload and submit bills (`Pending Review`), while only Owner/CA and Reviewer roles can approve or reject bills—enforced both in the UI and in Firestore security rules.',
      },
      {
        question: 'What happens if the same bill is uploaded twice in a batch?',
        answer:
          'LedgerSutra detects matching Invoice Number and Shop Name combinations and presents a resolution modal to Merge Items, Overwrite the existing record, or Save as a duplicate.',
      },
    ],
  },
};

export const RESOURCE_ARTICLES: ResourceArticleSpec[] = [
  {
    slug: 'how-to-import-purchase-invoices-into-tallyprime-from-pdf',
    path: '/blog/how-to-import-purchase-invoices-into-tallyprime-from-pdf',
    title: 'How to Import Purchase Invoices into TallyPrime from PDF',
    metaTitle: 'How to Import Purchase Invoices into TallyPrime from PDF — LedgerSutra',
    metaDescription:
      'Step-by-step guide for Indian CA firms on converting PDF purchase bills into TallyPrime XML vouchers with GST ledger mapping and party auto-creation.',
    category: 'TallyPrime Automation',
    readTime: '7 min read',
    publishedDate: '2026-11-02',
    summary:
      'Learn how to extract structured GST data from PDF purchase invoices, validate GSTINs and tax splits, and import vouchers directly into TallyPrime using XML.',
    keyTakeaways: [
      'TallyPrime natively imports vouchers wrapped in the standard ENVELOPE > IMPORTDATA > Vouchers XML schema.',
      'Always map your exact Purchase, Input CGST, Input SGST, Input IGST, and Round-Off ledger names before generating XML.',
      'Enable automatic party ledger creation in XML so new suppliers under Sundry Creditors do not block voucher import.',
    ],
    sections: [
      {
        heading: '1. Why Typing PDF Purchase Bills into TallyPrime Takes Too Long',
        paragraphs: [
          'For Indian Chartered Accountants and bookkeeping teams, recording purchase vouchers in TallyPrime is a monthly marathon. Clients send invoices as ERP PDFs, scanned multi-page statements, or mobile camera photos. Entering each bill manually requires checking whether the supplier ledger exists, verifying the 15-character GSTIN, entering the supplier invoice number and date in the Reference field, and splitting taxable values and CGST/SGST/IGST ledgers.',
          'When a single typo occurs in a ledger name or tax calculation, either Tally rejects the entry or your GSTR-3B working papers go out of sync with GSTR-2B.',
        ],
      },
      {
        heading: '2. Understanding TallyPrime’s XML Voucher Import Structure',
        paragraphs: [
          'TallyPrime includes a built-in XML import engine accessible via Alt + O (Import) > Vouchers. A valid purchase voucher XML file uses `<ENVELOPE>` containing `<HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER>` and `<BODY><IMPORTDATA>`. Inside `<REQUESTDESC>`, `<REPORTNAME>Vouchers</REPORTNAME>` and `<SVCURRENTCOMPANY>` tell Tally which company should receive the vouchers.',
          'Each invoice is represented as a `<VOUCHER VCHTYPE="Purchase" ACTION="Create">` node with `<DATE>` in `YYYYMMDD` format, `<VOUCHERNUMBER>`, `<REFERENCE>`, `<PARTYLEDGERNAME>`, `<PARTYGSTIN>`, and `<ALLLEDGERENTRIES.LIST>`. Crucially, Tally XML requires strict sign and `ISDEEMEDPOSITIVE` conventions: the Supplier Credit entry uses `<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>` with a positive amount, while the Purchase and Input GST Debit entries use `<ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>` with negative amounts.',
        ],
        checklist: [
          'Ensure dates are formatted strictly as YYYYMMDD (e.g. 20261031).',
          'Escape special XML characters (&amp;, &lt;, &gt;, &quot;, &apos;) in supplier names like "M/s Shah & Sons".',
          'Include a Round-Off ledger entry whenever Taxable + GST differs from Grand Total by paise.',
        ],
      },
      {
        heading: '3. Step-by-Step Workflow in LedgerSutra',
        paragraphs: [
          'In LedgerSutra, upload your PDF invoices in the Scanner or Batch Queue tab. Next, open Tally Settings in the Master Sheet export menu to confirm your Tally Company Name and ledger names. Click "Export to Tally (XML)" to run the pre-export validation check, resolve or skip any blocked bills, and download the `.xml` file ready for TallyPrime.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What happens if a supplier name has an ampersand (&) like "A & B Traders"?',
        answer:
          'LedgerSutra automatically escapes all XML special characters (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;`) so TallyPrime parses the XML without syntax errors.',
      },
    ],
  },
  {
    slug: 'gstr-2b-reconciliation-in-excel-step-by-step',
    path: '/blog/gstr-2b-reconciliation-in-excel-step-by-step',
    title: 'GSTR-2B Reconciliation in Excel: Step by Step',
    metaTitle: 'GSTR-2B Reconciliation in Excel: Step by Step — LedgerSutra',
    metaDescription:
      'Complete step-by-step guide to reconciling your purchase register with GST portal GSTR-2B JSON and Excel files to protect Input Tax Credit. Read guide.',
    category: 'GST Reconciliation',
    readTime: '8 min read',
    publishedDate: '2026-11-03',
    summary:
      'A practical guide for CA firms on matching purchase books against GSTR-2B, handling invoice number formatting differences, and exporting multi-sheet audit reports.',
    keyTakeaways: [
      'Normalize invoice numbers by stripping spaces, slashes, hyphens, and leading zeros before comparing Books vs GSTR-2B.',
      'Use a ₹1 to ₹2 rounding tolerance so paise differences do not hide genuine matches.',
      'Separate discrepancies into actionable buckets: Missing in 2B (follow up with vendor) vs Missing in Books (record unbooked bill).',
    ],
    sections: [
      {
        heading: '1. Why GSTR-2B Reconciliation Is Critical Before Filing GSTR-3B',
        paragraphs: [
          'Under Section 16(2)(aa) of the CGST Act read with Rule 36(4), Input Tax Credit (ITC) can only be availed when the supplier has furnished the invoice in their GSTR-1/IFF and the details are communicated in the recipient’s GSTR-2B statement.',
          'Claiming excess ITC not reflected in GSTR-2B triggers automated DRC-01C intimations and potential interest liability. Conversely, failing to spot invoices present in GSTR-2B but missing from your client’s purchase books leaves legitimate ITC unclaimed.',
        ],
      },
      {
        heading: '2. Why Standard Excel VLOOKUPs Fail on GSTR-2B Data',
        paragraphs: [
          'When you run a naive VLOOKUP on `GSTIN + Invoice Number` in Excel, 15% to 30% of valid invoices often show up as unmatched. Why? Because the printed bill might say `Bill No: 00458/26-27`, whereas the supplier’s accountant uploaded `458` or `458-26/27` in GSTR-1.',
        ],
        checklist: [
          'Step 1: Normalize both Books and 2B invoice numbers (uppercase, strip punctuation and leading zeros).',
          'Step 2: Match on Supplier GSTIN + Normalized Invoice Number and compare Taxable Value and Tax within a ₹1 tolerance.',
          'Step 3: Run a second pass on remaining unmatched items matching Supplier GSTIN + Invoice Date + Amount to catch probable invoice number typos.',
          'Step 4: Classify remaining items into "In Books but Not in 2B" and "In 2B but Not in Books".',
        ],
      },
      {
        heading: '3. Generating the 6-Sheet Excel Working Paper in LedgerSutra',
        paragraphs: [
          'Instead of building complex macros every month, open the GSTR-2B Reconciliation tab in LedgerSutra, upload your portal GSTR-2B JSON or Excel file, review the side-by-side differences, add audit notes, and click "Export Reconciliation Excel" to download a workbook with a Summary sheet and one sheet per status.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should I reconcile against GSTR-2A or GSTR-2B for monthly ITC claims?',
        answer:
          'Always reconcile against the static GSTR-2B statement generated on the 14th of the following month for monthly GSTR-3B ITC claims.',
      },
    ],
  },
  {
    slug: 'how-to-find-duplicate-purchase-invoices-before-filing-gst',
    path: '/blog/how-to-find-duplicate-purchase-invoices-before-filing-gst',
    title: 'How to Find Duplicate Purchase Invoices Before Filing GST',
    metaTitle: 'How to Find Duplicate Purchase Invoices Before Filing GST — LedgerSutra',
    metaDescription:
      'Learn how CA firms detect and resolve duplicate purchase bills across WhatsApp photos, PDFs, and Excel sheets before filing GSTR-3B.',
    category: 'GST Audit Controls',
    readTime: '6 min read',
    publishedDate: '2026-11-04',
    summary:
      'Duplicate purchase vouchers are a common cause of excess ITC claims during GST audits. Here is how to catch and resolve them before exporting your register.',
    keyTakeaways: [
      'Clients frequently send both a WhatsApp photo and an email PDF of the same supplier invoice in a monthly folder.',
      'Check for collisions on normalized (Invoice Number + Supplier Name / GSTIN) before adding rows to your master register.',
      'Decide whether to Merge Line Items (for multi-page bills), Overwrite the existing record, or Save as a separate entry.',
    ],
    sections: [
      {
        heading: '1. How Duplicate Purchase Bills Sneak into Client Books',
        paragraphs: [
          'In most small and medium businesses, purchase bills arrive through multiple channels: a store manager snaps a WhatsApp photo when goods arrive, while the vendor emails a PDF tax invoice at the end of the week. At month-end, both files get dumped into the CA’s Google Drive folder.',
          'If two different staff members process those files—or if a batch is imported without collision checks—the same invoice gets booked twice, inflating Input Tax Credit.',
        ],
      },
      {
        heading: '2. Deterministic Duplicate Detection & Resolution',
        paragraphs: [
          'Whenever you save a bill to the Master Sheet in LedgerSutra, the system checks `savedBills` for any existing record with the same normalized `invoiceNumber` and `shopName` / `sellerGstin`.',
        ],
        checklist: [
          'Option 1 — Merge Items: Ideal when two pages of the same invoice were scanned separately; appends line items and recalculates totals.',
          'Option 2 — Overwrite Record: Ideal when re-scanning a clearer copy of a previously scanned invoice.',
          'Option 3 — Save as Duplicate: Keeps both entries separate if two genuinely distinct vendors happen to share a generic bill number like "001".',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does LedgerSutra also flag duplicates inside the CA Validation panel?',
        answer:
          'Yes. Even before clicking Save, the real-time CA Audit Engine checks your active draft against all saved bills in the current client workspace and shows a Duplicate Invoice alert.',
      },
    ],
  },
  {
    slug: 'automate-invoice-data-entry-ca-firms',
    path: '/blog/automate-invoice-data-entry-ca-firms',
    title: 'How to Automate Invoice Data Entry in a CA Firm: A Practical Step-by-Step Guide',
    metaTitle: 'How to Automate Invoice Data Entry in a CA Firm: A Practical Step-by-Step Guide — LedgerSutra',
    metaDescription:
      'Learn how Indian Chartered Accountant firms automate purchase bill data entry using AI OCR, GSTIN validation, and Excel exports. Read the guide now.',
    category: 'CA Practice Management',
    readTime: '7 min read',
    publishedDate: '2026-10-15',
    summary:
      'A practical blueprint for Indian CA practices to transition from manual voucher typing to AI-assisted document capture, exception-based review, and standardized Excel/SQL exports.',
    keyTakeaways: [
      'Standardize how clients submit bills (PDF folders vs WhatsApp photos) before the 5th of every month.',
      'Use hybrid OCR + coordinate parsing to extract headers and line items without manual typing.',
      'Shift article assistants from data entry operators to exception reviewers focusing on GSTIN and tax math.',
    ],
    sections: [
      {
        heading: '1. Why Manual Voucher Entry Is the Biggest Bottleneck in CA Firms',
        paragraphs: [
          'Every month between the 1st and the 20th, Chartered Accountant offices across India face the same operational crunch: hundreds of client purchase bills, expense vouchers, and sales invoices arrive in mixed formats—scanned PDFs, camera photos, and loose thermal receipts.',
          'When article assistants and junior accountants type every invoice number, date, supplier GSTIN, and tax split manually into spreadsheets, two things happen: valuable audit time is lost, and human fatigue leads to transposition errors in 15-character GSTINs or invoice values.',
        ],
      },
      {
        heading: '2. The 4-Stage Automated Invoice Workflow for CA Practices',
        paragraphs: [
          'Modernizing your practice does not require replacing your core accounting software. Instead, introduce an intelligent pre-accounting extraction layer between raw client documents and your final register:',
        ],
        checklist: [
          'Stage 1 — Centralized Intake: Collect client PDFs and images in monthly batch folders.',
          'Stage 2 — Hybrid OCR Extraction: Run automated extraction to capture Supplier Name, Seller GSTIN, Invoice No, Date, HSN, Taxable Value, and CGST/SGST/IGST.',
          'Stage 3 — Exception-Only Audit: Review only those bills flagged for invalid GSTIN format, duplicate invoice numbers, or tax math variance.',
          'Stage 4 — Standardized Export: Export the verified register to Excel (.xlsx), CSV, or SQL for final return preparation.',
        ],
      },
      {
        heading: '3. Choosing Between 1-Bill-Per-Row Summary and Line-Item Detail',
        paragraphs: [
          'Not every client requires the same level of granularity. For small traders or composition dealers, a "1 Bill = 1 Row" summary with auto-expanding product columns keeps the spreadsheet clean. For manufacturing and wholesale B2B audits, line-item HSN and GST rate breakdowns provide the detail needed for GSTR-1 and ITC verification.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much time can a CA firm save by automating purchase bill entry?',
        answer:
          'By eliminating manual typing of routine fields and reviewing only flagged exceptions, teams drastically cut down voucher preparation time while improving GSTIN accuracy.',
      },
    ],
  },

  {
    slug: 'ocr-for-gst-invoices-complete-guide',
    path: '/blog/ocr-for-gst-invoices-complete-guide',
    title: 'OCR for GST Invoices: Complete Technical & Compliance Guide for Indian Accountants',
    metaTitle: 'OCR for GST Invoices: Complete Technical & Compliance Guide for Indian Accountants — LedgerSutra',
    metaDescription:
      'Understand how Optical Character Recognition and AI Vision extract GSTIN, HSN codes, and CGST/SGST/IGST splits from GST invoices. Read the full guide.',
    category: 'GST Technology',
    readTime: '8 min read',
    publishedDate: '2026-10-18',
    summary:
      'Explore how modern hybrid OCR engines combine PDF coordinate extraction, High-DPI image preprocessing, and Indian GST rules to parse complex tax invoices.',
    keyTakeaways: [
      'Traditional OCR struggles with multi-column GST tables unless paired with X/Y coordinate reconstruction.',
      'Image contrast normalization is essential for reading faint dot-matrix and thermal GST receipts.',
      'Automated 15-digit GSTIN regex validation catches OCR character confusions (such as 0 vs O or 1 vs I).',
    ],
    sections: [
      {
        heading: '1. Why Indian GST Invoices Are Challenging for Generic OCR Tools',
        paragraphs: [
          'Unlike simple Western receipts that only show a subtotal and a single sales tax line, Indian GST invoices contain dense tabular structures: 15-character alphanumeric GSTINs for both supplier and buyer, 4-to-8 digit HSN/SAC codes, quantity and UOM columns, discounts, taxable values, and split tax columns (CGST % + CGST Amt + SGST % + SGST Amt or IGST).',
          'Generic OCR tools built for overseas markets often merge adjacent columns or misidentify the buyer’s GSTIN as the seller’s GSTIN.',
        ],
      },
      {
        heading: '2. How Hybrid Coordinate + Vision OCR Solves Table Alignment',
        paragraphs: [
          'LedgerSutra uses a multi-layered approach: for digital PDFs, it extracts exact X/Y coordinates from the PDF text layer and groups text fragments into horizontal baseline buckets. For scanned PDFs and camera images, it renders pages at 2.0x High-DPI, normalizes luminance contrast, and combines AI Vision with Tesseract PSM-4 column segmentation.',
        ],
        checklist: [
          'Validates 2-digit State Code against all 37 Indian states and UTs.',
          'Verifies embedded 10-character PAN format inside the GSTIN.',
          'Cross-checks line-item sums against invoice-level taxable and grand totals.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can OCR read both English and Hindi text on the same bill?',
        answer:
          'Yes, when configured with bilingual English + Devanagari (`eng+hin`) language models, the engine can read bilingual shop headers and item descriptions.',
      },
    ],
  },

  {
    slug: 'convert-purchase-bills-to-excel-accounting',
    path: '/blog/convert-purchase-bills-to-excel-accounting',
    title: 'How to Convert Client Purchase Bills into Clean Excel Sheets for Accounting',
    metaTitle: 'How to Convert Client Purchase Bills into Clean Excel Sheets for Accounting — LedgerSutra',
    metaDescription:
      'Step-by-step guide to converting PDF and image purchase bills into structured, formula-ready Excel (.xlsx) registers without broken columns. Read more.',
    category: 'Excel & Bookkeeping',
    readTime: '6 min read',
    publishedDate: '2026-10-20',
    summary:
      'Learn how to structure your Excel purchase register so single-cost bills and multi-product bills coexist cleanly in one workbook.',
    keyTakeaways: [
      'Avoid creating 15 separate rows for a single retail expense bill unless line-item HSN reporting is required.',
      'Use dynamic horizontal product columns (Product 1, Product 2...) for multi-item retail bills.',
      'Always keep a second worksheet with verbatim extracted text for audit trail verification.',
    ],
    sections: [
      {
        heading: '1. Structuring the Ideal Excel Purchase Register',
        paragraphs: [
          'When preparing a monthly purchase sheet in Excel, consistency is everything. Every row should clearly identify Which Bill (File Name), Bill Date, Invoice Number, Shop/Party Name, Seller GSTIN, Taxable Value, GST Amount, and Grand Total.',
        ],
      },
      {
        heading: '2. Appending New Bills to an Existing Excel File',
        paragraphs: [
          'Instead of creating dozens of separate Excel files for each batch of bills a client sends over the month, use an append workflow. Import your existing `.xlsx` register, scan the new bills, and export a unified workbook with updated column totals.',
        ],
        checklist: [
          'Select only the columns relevant to your client’s accounting workflow.',
          'Verify the automatic SUM footer row before exporting to `.xlsx`.',
          'Use Supplier-Wise Summary view to cross-check vendor totals.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does the exported Excel file contain real numeric cells for totals?',
        answer:
          'Yes. Taxable Value, CGST, SGST, IGST, and Grand Total are exported as numeric values with an automatic summary row at the bottom.',
      },
    ],
  },

  {
    slug: 'common-errors-manual-invoice-entry',
    path: '/blog/common-errors-manual-invoice-entry',
    title: '7 Costly Errors in Manual Invoice Data Entry (And How CA Firms Prevent Them)',
    metaTitle: '7 Costly Errors in Manual Invoice Data Entry (And How CA Firms Prevent Them) — LedgerSutra',
    metaDescription:
      'Discover the 7 most common manual invoice data entry mistakes in Indian accounting practices—from GSTIN typos to duplicate ITC claims. Read the guide.',
    category: 'Audit & Risk Control',
    readTime: '6 min read',
    publishedDate: '2026-10-22',
    summary:
      'From transposed GSTIN digits to duplicate voucher entry, here are the seven data entry pitfalls that trigger GST reconciliation mismatches and audit exceptions.',
    keyTakeaways: [
      'Duplicate invoice numbers from the same supplier can lead to excess ITC claims and interest penalties.',
      'Confusing Seller GSTIN with Buyer GSTIN invalidates B2B purchase register entries.',
      'Automated math checks catch bills where printed tax totals do not match line-item sums.',
    ],
    sections: [
      {
        heading: '1. The Hidden Cost of Keystroke Mistakes in Tax Compliance',
        paragraphs: [
          'Even a 99% accurate data entry operator will make mistakes when typing thousands of 15-character GSTINs, invoice dates, and decimal values under tight filing deadlines.',
        ],
        checklist: [
          'Error 1: Transposing characters in the 15-digit Seller GSTIN.',
          'Error 2: Entering the Buyer’s own GSTIN in the Supplier GSTIN column.',
          'Error 3: Recording the same purchase bill twice when a client sends both a WhatsApp photo and a PDF copy.',
          'Error 4: Swapping DD/MM/YYYY and MM/DD/YYYY invoice dates across tax periods.',
          'Error 5: Misallocating IGST to CGST/SGST on inter-state purchases.',
          'Error 6: Skipping line items on multi-page invoices.',
          'Error 7: Ignoring rounding-off or discount deductions in the taxable value.',
        ],
      },
      {
        heading: '2. Implementing Automated Pre-Filing Validation Controls',
        paragraphs: [
          'LedgerSutra runs deterministic validation rules on every extracted invoice—highlighting invalid GSTIN formats, duplicate invoice numbers, and tax math variances before you export your sheet.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How does duplicate invoice detection work?',
        answer:
          'LedgerSutra compares the normalized Invoice Number and Seller GSTIN (or Supplier Name) against all bills already present in your active sheet and flags any collision immediately.',
      },
    ],
  },

  {
    slug: 'digital-document-workflow-chartered-accountants',
    path: '/blog/digital-document-workflow-chartered-accountants',
    title: 'Designing a Modern Digital Document Workflow for Chartered Accountants',
    metaTitle: 'Designing a Modern Digital Document Workflow for Chartered Accountants — LedgerSutra',
    metaDescription:
      'Build a paperless, audit-ready digital document workflow for your CA firm. Standardize document collection, OCR extraction, and archival. Read guide.',
    category: 'Digital Practice',
    readTime: '7 min read',
    publishedDate: '2026-10-25',
    summary:
      'How progressive CA firms are moving from physical voucher box files to structured digital document pipelines with full text searchability.',
    keyTakeaways: [
      'Pair every structured spreadsheet row with its source file name and verbatim OCR text.',
      'Use role-appropriate views: Normal User view for client staff, CA Audit Mode for review teams.',
      'Export both `.xlsx` working papers and `.sql`/`.json` backups for long-term retention.',
    ],
    sections: [
      {
        heading: '1. Moving Beyond Unsearchable PDF Folders',
        paragraphs: [
          'Storing client bills as `IMG_0042.jpg` or `Scan_12.pdf` inside nested folders is not true digitization. True digital workflow means every document’s text is searchable and its financial attributes are indexed in a structured table.',
        ],
      },
      {
        heading: '2. Bridging Client Staff and CA Audit Teams',
        paragraphs: [
          'When clients or junior staff upload bills in Normal User Mode, they see a simple 1-row-per-bill summary. When the CA switches the same workspace to CA / GST Audit Mode, full GSTIN, HSN, and tax breakup columns appear immediately.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can we export both Excel and SQL from the same scanned bills?',
        answer:
          'Yes. Once bills are scanned into your workspace, you can export `.xlsx`, `.csv`, `.json`, and `.sql` at any time without rescanning.',
      },
    ],
  },

  {
    slug: 'gst-invoice-fields-checklist-verification',
    path: '/blog/gst-invoice-fields-checklist-verification',
    title: 'Mandatory GST Invoice Fields Checklist: What Every CA Must Verify Under Rule 46',
    metaTitle: 'Mandatory GST Invoice Fields Checklist: What Every CA Must Verify Under Rule 46 — LedgerSutra',
    metaDescription:
      'Complete checklist of mandatory fields required on a valid Indian GST Tax Invoice under CGST Rule 46 for claiming Input Tax Credit. View checklist now.',
    category: 'GST Compliance',
    readTime: '8 min read',
    publishedDate: '2026-10-27',
    summary:
      'A practical audit checklist covering the mandatory particulars of a GST Tax Invoice under Rule 46 of the CGST Rules and how to verify them rapidly.',
    keyTakeaways: [
      'A valid 15-character Supplier GSTIN and consecutive Invoice Number are mandatory for B2B ITC.',
      'Verify Place of Supply to confirm whether CGST+SGST or IGST applies.',
      'Ensure HSN/SAC codes and tax rate splits match the taxable value.',
    ],
    sections: [
      {
        heading: '1. Why Rule 46 Invoice Verification Matters for Input Tax Credit',
        paragraphs: [
          'Under Section 16(2) of the CGST Act read with Rule 36 and Rule 46 of the CGST Rules, a registered person cannot claim Input Tax Credit unless they possess a tax invoice containing prescribed particulars.',
        ],
        checklist: [
          'Name, address, and 15-character GSTIN of the supplier.',
          'Consecutive serial invoice number (not exceeding 16 characters).',
          'Date of issue of the tax invoice.',
          'Name, address, and GSTIN/UIN of the recipient (for registered buyers).',
          'HSN code for goods or SAC code for services.',
          'Description of goods or services, quantity, and unit (UOM).',
          'Total value of supply and taxable value after discount/abatement.',
          'Applicable rate of tax and amount of tax charged (CGST, SGST/UTGST, or IGST).',
          'Place of supply along with state name for inter-state supplies.',
        ],
      },
      {
        heading: '2. Automating Rule 46 Field Checks with LedgerSutra',
        paragraphs: [
          'Instead of visually hunting for each of these fields across different invoice templates, LedgerSutra extracts them into dedicated fields and highlights missing mandatory GST attributes automatically.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What if a vendor invoice is missing the Seller GSTIN?',
        answer:
          'LedgerSutra flags "Seller GSTIN" in the Missing Mandatory Fields badge so your audit team can classify it as an unregistered B2C purchase.',
      },
    ],
  },

  {
    slug: 'ai-document-processing-for-tax-consultants',
    path: '/blog/ai-document-processing-for-tax-consultants',
    title: 'AI Document Processing for Tax Consultants: Practical Use Cases & Safeguards',
    metaTitle: 'AI Document Processing for Tax Consultants: Practical Use Cases & Safeguards — LedgerSutra',
    metaDescription:
      'How Indian tax consultants and GST practitioners use AI document processing with deterministic validation rules to speed up return filing. Read guide.',
    category: 'AI in Accounting',
    readTime: '6 min read',
    publishedDate: '2026-10-29',
    summary:
      'Why the best accounting automation combines AI Vision extraction with deterministic rule checks and human-in-the-loop editing.',
    keyTakeaways: [
      'Never rely on black-box AI alone for accounting—always pair extraction with deterministic math and GSTIN validation.',
      'Keep side-by-side document preview active so reviewers can verify any flagged figure in seconds.',
      'Use fallback client-side OCR so work never stops even if cloud connectivity fluctuates.',
    ],
    sections: [
      {
        heading: '1. Why "AI + Deterministic Rules" Beats Pure Black-Box Automation',
        paragraphs: [
          'In tax and audit work, accuracy is non-negotiable. While AI Vision models excel at understanding diverse invoice layouts, deterministic code is unbeatable at checking 15-character GSTIN regular expressions, summing line items, and flagging duplicate invoice numbers.',
          'LedgerSutra combines both: intelligent extraction followed by strict mathematical and regulatory validation.',
        ],
      },
      {
        heading: '2. Human-in-the-Loop Control for Tax Practitioners',
        paragraphs: [
          'Every field extracted by LedgerSutra remains transparently editable alongside the original document image and verbatim raw text.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What happens if an invoice has unusual custom columns like Batch No or Expiry Date?',
        answer:
          'LedgerSutra automatically discovers dynamic extra columns and includes them in your selectable column list.',
      },
    ],
  },

  {
    slug: 'organize-client-bills-monthly-gst-compliance',
    path: '/blog/organize-client-bills-monthly-gst-compliance',
    title: 'How to Organize Client Bills for Stress-Free Monthly GST Compliance',
    metaTitle: 'How to Organize Client Bills for Stress-Free Monthly GST Compliance — LedgerSutra',
    metaDescription:
      'A practical system for CA firms and accountants to organize, scan, and reconcile client purchase and sales bills before GST deadlines. Read the guide.',
    category: 'GST Workflow',
    readTime: '7 min read',
    publishedDate: '2026-11-01',
    summary:
      'Stop the last-minute scramble on the 10th and 19th of every month with a structured weekly bill scanning and supplier reconciliation routine.',
    keyTakeaways: [
      'Process client bills weekly using the Append-to-Excel workflow rather than waiting until month-end.',
      'Use Supplier-Wise Summary view to reconcile vendor totals against GSTR-2B in minutes.',
      'Maintain a clean monthly spend and GST trend dashboard for client advisory.',
    ],
    sections: [
      {
        heading: '1. Breaking the Month-End Filing Bottleneck',
        paragraphs: [
          'When clients drop 300 bills two days before the GSTR-3B deadline, thorough verification becomes nearly impossible. By encouraging clients or staff to scan batches weekly and append them into a running `.xlsx` register, 80% of the month’s data is already structured before the 1st of the following month.',
        ],
      },
      {
        heading: '2. Using Supplier-Wise Rollups for Rapid GSTR-2B Matching',
        paragraphs: [
          'Instead of matching 200 individual bills one by one against the portal, switch to LedgerSutra’s Supplier-Wise Summary view first. If a vendor’s total invoice count and total GST match the portal summary, you can approve that vendor’s batch immediately and focus only on vendors with discrepancies.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I filter bills by date or supplier name during reconciliation?',
        answer:
          'Yes. The Merged Excel Sheet includes instant search and date filtering so you can isolate any vendor or date range immediately.',
      },
    ],
  },
];

export const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/og-default.png`;
export const DEFAULT_OG_IMAGE_ALT =
  'LedgerSutra — GST Invoice OCR, TallyPrime XML Export & GSTR-2B Reconciliation for Indian CA Firms';

export const DEFAULT_CA_AUTHOR = {
  name: 'LedgerSutra Editorial Team',
  credentials: 'GST & Accounting Workflow Documentation Team',
  bio: 'Maintained by the LedgerSutra product and tax-automation engineering team for Indian CA practices.',
  url: `${SITE_DOMAIN}/about`,
};

export const HINDI_LOCALIZED_ROUTES: Record<
  string,
  {
    enPath: string;
    hiPath: string;
    title: string;
    h1: string;
    subtitle: string;
    description: string;
    breadcrumbName: string;
  }
> = {
  '/hi': {
    enPath: '/',
    hiPath: '/hi',
    title: 'भारतीय CA फर्मों के लिए GST इनवॉइस OCR सॉफ्टवेयर | LedgerSutra',
    h1: 'भारतीय CA फर्मों के लिए GST इनवॉइस OCR और डेटा एंट्री ऑटोमेशन',
    subtitle:
      'अंग्रेज़ी और हिंदी (देवनागरी) बिलों को स्कैन करें, 15-अंकीय GSTIN और टैक्स गणित की स्वचालित जांच करें, और एक क्लिक में TallyPrime XML या Excel (.xlsx) में एक्सपोर्ट करें।',
    description:
      'भारतीय चार्टर्ड अकाउंटेंट्स (CA) के लिए द्विभाषी GST इनवॉइस OCR। 15-अंकीय GSTIN सत्यापित करें, TallyPrime XML वाउचर बनाएं और GSTR-2B मिलान करें। अभी आज़माएं।',
    breadcrumbName: 'होम (Hindi)',
  },
  '/hi/features': {
    enPath: '/features',
    hiPath: '/hi/features',
    title: 'GST इनवॉइस OCR फीचर्स — GSTIN सत्यापन और द्विभाषी OCR | LedgerSutra',
    h1: 'भारतीय GST प्रैक्टिस वर्कफ़्लो के लिए निर्मित फीचर्स',
    subtitle:
      '15-अंकीय GSTIN Mod-36 चेकसम ऑडिट, द्विभाषी बिल स्कैनिंग, मल्टी-क्लाइंट वर्कस्पेस और मेकर-चेकर टीम अप्रूवल।',
    description:
      'भारतीय चार्टर्ड अकाउंटेंट्स के लिए LedgerSutra के फीचर्स: Mod-36 GSTIN जांच, TallyPrime XML एक्सपोर्ट, GSTR-2B मिलान और बैच इनवॉइस स्कैनिंग। फीचर्स देखें।',
    breadcrumbName: 'फीचर्स (Hindi)',
  },
  '/hi/pricing': {
    enPath: '/pricing',
    hiPath: '/hi/pricing',
    title: 'प्राइसिंग — CA फर्मों के लिए GST इनवॉइस OCR प्लान | LedgerSutra',
    h1: 'सोलो प्रैक्टिशनर्स और मल्टी-पार्टनर CA फर्मों के लिए प्लान',
    subtitle:
      'मल्टी-क्लाइंट GSTIN वर्कस्पेस, TallyPrime XML एक्सपोर्ट और GSTR-2B रिकन्सिलिएशन के साथ पारदर्शी प्लान (₹0, ₹1,499, ₹3,999)। पायलट फर्मों के लिए अर्ली-एक्सेस प्राइसिंग।',
    description:
      'भारतीय CA फर्मों और जीएसटी प्रैक्टिशनर्स के लिए पारदर्शी प्लान: मल्टी-क्लाइंट वर्कस्पेस, TallyPrime XML एक्सपोर्ट और GSTR-2B रिकन्सिलिएशन। प्लान चुनें।',
    breadcrumbName: 'प्राइसिंग (Hindi)',
  },
  '/hi/gst-invoice-to-tally': {
    enPath: '/gst-invoice-to-tally',
    hiPath: '/hi/gst-invoice-to-tally',
    title: 'GST इनवॉइस को TallyPrime XML में बदलें | LedgerSutra',
    h1: 'GST इनवॉइस को TallyPrime XML वाउचर में स्वचालित रूप से बदलें',
    subtitle:
      'PDF और फोटो बिलों से सप्लायर GSTIN, इनवॉइस नंबर, कर योग्य मूल्य और CGST/SGST/IGST निकालें और सीधे TallyPrime में इम्पोर्ट करें।',
    description:
      'PDF और फोटो GST खरीद बिलों को सीधे TallyPrime XML वाउचर में बदलें। ऑटोमैटिक पार्टी लेजर निर्माण और प्री-एक्सपोर्ट GST जांच के साथ। XML एक्सपोर्ट करें।',
    breadcrumbName: 'GST से Tally XML (Hindi)',
  },
  '/hi/gstr-2b-reconciliation-excel': {
    enPath: '/gstr-2b-reconciliation-excel',
    hiPath: '/hi/gstr-2b-reconciliation-excel',
    title: 'Excel में GSTR-2B रिकन्सिलिएशन — 6-स्टेटस मिलान | LedgerSutra',
    h1: 'Excel में GSTR-2B रिकन्सिलिएशन',
    subtitle:
      'अपने खरीद रजिस्टर का GST पोर्टल GSTR-2B JSON या Excel फ़ाइल से मिलान करें और पात्र ITC, राशि अंतर और छूटे हुए बिल तुरंत पहचानें।',
    description:
      'GST पोर्टल की GSTR-2B JSON या Excel फ़ाइल को अपने परचेस रजिस्टर से मिलाएं। कुछ ही सेकंड में पात्र ITC, मिसमैच और छूटे बिलों की रिपोर्ट पाएं। अभी मिलान करें।',
    breadcrumbName: 'GSTR-2B रिकन्सिलिएशन (Hindi)',
  },
  '/hi/pdf-invoice-to-excel': {
    enPath: '/pdf-invoice-to-excel',
    hiPath: '/hi/pdf-invoice-to-excel',
    title: 'PDF इनवॉइस को Excel (.XLSX) में बदलें | LedgerSutra',
    h1: 'PDF इनवॉइस को स्वचालित रूप से Excel में बदलें',
    subtitle:
      'डिजिटल और स्कैन किए गए PDF खरीद बिलों को 1 बिल = 1 पंक्ति या विस्तृत आइटम-वार तालिकाओं के साथ संरचित Excel (.xlsx) वर्कबुक में बदलें।',
    description:
      'PDF इनवॉइस और स्कैन किए गए बिलों को संरचित Excel (.xlsx) और CSV शीट में बदलें। 1 बिल = 1 पंक्ति सारांश और विस्तृत आइटम मोड समर्थित। अभी कन्वर्ट करें।',
    breadcrumbName: 'PDF से Excel (Hindi)',
  },
};

export function getHreflangAlternates(cleanPath: string): {
  enUrl: string;
  hiUrl: string;
} | null {
  const hiEntry = Object.values(HINDI_LOCALIZED_ROUTES).find(
    (item) => item.enPath === cleanPath || item.hiPath === cleanPath
  );
  if (!hiEntry) return null;
  return {
    enUrl: `${SITE_DOMAIN}${hiEntry.enPath === '/' ? '/' : hiEntry.enPath}`,
    hiUrl: `${SITE_DOMAIN}${hiEntry.hiPath}`,
  };
}

export const CORE_SAAS_ROUTES_META: Record<
  string,
  {
    title: string;
    h1: string;
    description: string;
    breadcrumbName: string;
  }
> = {
  '/': {
    title: 'GST Invoice OCR Software for Indian CA Firms | LedgerSutra',
    h1: 'GST Invoice OCR & Data Entry Automation for Indian CA Firms',
    description:
      'Automate GST invoice OCR, 15-digit GSTIN validation, GSTR-2B reconciliation, and TallyPrime XML exports for CA firms. Try the live workspace today.',
    breadcrumbName: 'Home',
  },
  '/app': {
    title: 'CA Invoice OCR, Tally XML & GSTR-2B Workspace | LedgerSutra',
    h1: 'LedgerSutra Live Invoice OCR, GST Audit & Tally Command Center',
    description:
      'Upload PDF or image invoices, extract GST fields, validate 15-digit GSTINs, reconcile GSTR-2B, and export TallyPrime XML, Excel, or Zoho CSV. Open now.',
    breadcrumbName: 'Workspace',
  },
  '/features': {
    title: 'GST Invoice OCR Features — GSTIN Validation & Bilingual OCR | LedgerSutra',
    h1: 'Features Built for Indian GST Practice Workflows',
    description:
      'Explore 15-digit GSTIN Mod-36 checksum validation, English + Hindi invoice OCR, GSTR-2B matching, and TallyPrime XML export. Explore features today.',
    breadcrumbName: 'Features',
  },
  '/how-it-works': {
    title: 'How LedgerSutra Automates GST Invoice Entry | LedgerSutra',
    h1: 'From Client Invoice Folder to Tally Sign-Off',
    description:
      'See how Indian CA firms upload client PDF and image bills, validate GSTINs and tax splits, and export to TallyPrime XML or Excel. Start a pilot.',
    breadcrumbName: 'How It Works',
  },
  '/pricing': {
    title: 'Pricing — GST Invoice OCR Plans for CA Firms | LedgerSutra',
    h1: 'Plans for Solo Practitioners & Multi-Partner CA Firms',
    description:
      'Compare transparent plans for solo practitioners and multi-partner CA firms with multi-client workspaces and TallyPrime XML export. View plans now.',
    breadcrumbName: 'Pricing',
  },
  '/faq': {
    title: 'GST Invoice OCR FAQ for Indian CA Firms | LedgerSutra',
    h1: 'Questions from Chartered Accountants & Tax Teams',
    description:
      'Read answers on TallyPrime XML voucher import, GSTR-2B JSON/Excel reconciliation, bilingual OCR, and client data isolation. Browse CA answers today.',
    breadcrumbName: 'FAQ',
  },
  '/security': {
    title: 'Security & Data Isolation for Client Records | LedgerSutra',
    h1: 'Security & Data Isolation for Client Records',
    description:
      'Learn how LedgerSutra protects client financial records with client-wise workspace isolation, RBAC rules, and instant deletion. Review security now.',
    breadcrumbName: 'Security',
  },
  '/privacy': {
    title: 'Privacy Policy — Zero AI Training & Data Protection | LedgerSutra',
    h1: 'Privacy Policy for Chartered Accountant & Client Financial Data',
    description:
      "Read LedgerSutra's privacy policy covering zero AI model training on client invoices, local fallback OCR processing, and one-click data deletion.",
    breadcrumbName: 'Privacy Policy',
  },
  '/terms': {
    title: 'Terms of Service — GST OCR & Tally XML Platform | LedgerSutra',
    h1: 'Terms of Service for LedgerSutra CA Practice Software',
    description:
      "Review the terms of service governing LedgerSutra's GST invoice OCR workspace, TallyPrime XML export, GSTR-2B reconciliation, and developer API.",
    breadcrumbName: 'Terms of Service',
  },
  '/data-deletion': {
    title: 'Data Deletion Policy — Instant Record Removal | LedgerSutra',
    h1: 'Data Deletion Policy & Zero Server-Side Retention Controls',
    description:
      'How to permanently delete individual purchase bills, client workspaces, or your entire LedgerSutra account immediately with zero server retention.',
    breadcrumbName: 'Data Deletion Policy',
  },
  '/blog': {
    title: 'GST & TallyPrime Guides for CA Firms | LedgerSutra',
    h1: 'GST & TallyPrime Guides for CA Firms',
    description:
      'Step-by-step guides and tutorials for Indian CA firms on GST invoice OCR, TallyPrime XML voucher import, and GSTR-2B reconciliation. Read guides.',
    breadcrumbName: 'Blog',
  },
  '/api-docs': {
    title: 'Invoice OCR REST API Documentation | LedgerSutra',
    h1: 'Invoice Extraction REST API (v1)',
    description:
      'Integrate GST invoice OCR, 15-digit GSTIN validation, and structured line-item JSON extraction into your accounting tools. Read the API docs now.',
    breadcrumbName: 'API Docs',
  },
  '/about': {
    title: 'About LedgerSutra — Built for Indian CA Firms',
    h1: 'Built for Indian Chartered Accountants',
    description:
      'Discover why LedgerSutra built specialized GST invoice OCR, GSTR-2B reconciliation, and TallyPrime automation for Indian CA firms. Learn more today.',
    breadcrumbName: 'About',
  },
  '/contact': {
    title: 'Contact & Book a Demo | LedgerSutra',
    h1: 'Contact & Book a Demo',
    description:
      'Schedule a live walkthrough of LedgerSutra GST invoice OCR, TallyPrime XML import, and GSTR-2B reconciliation for your CA firm. Book a demo today.',
    breadcrumbName: 'Contact',
  },
};

/**
 * Legacy or duplicate routes that have an exact, relevant replacement in LedgerSutra.
 * Redirected with 301 Permanent Redirect.
 */
export const REDIRECT_ROUTE_MAP: Record<string, string> = {
  '/resources': '/blog',
  '/invoice-ocr': '/app',
  '/workspace': '/app',
  '/scanner': '/app',
};

/**
 * Obsolete "Paisa Saarthi" / B2C personal-finance route prefixes that previously existed
 * on the domain (e.g. /schemes?page=48) and have NO relevant replacement on a B2B CA GST platform.
 * Served with HTTP 410 Gone + X-Robots-Tag: noindex, nofollow (Option B in Task 2).
 */
export const OBSOLETE_PERSONAL_FINANCE_PREFIXES: string[] = [
  '/schemes',
  '/paisa-saarthi',
  '/personal-finance',
  '/loans',
  '/mutual-funds',
  '/emi-calculator',
  '/credit-cards',
  '/sip-calculator',
  '/fd-calculator',
  '/tax-calculator',
  '/govt-schemes',
  '/insurance',
];

export function normalizePathname(rawPath: string): string {
  if (!rawPath || rawPath === '/') return '/';
  const cleaned = rawPath.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return cleaned || '/';
}

export interface RouteAuditResolution {
  cleanPath: string;
  routeKind: 'canonical' | 'workspace' | 'redirect' | 'obsolete_gone' | 'not_found';
  statusCode: 200 | 301 | 404 | 410;
  redirectTo?: string;
  robots: 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
  hasDisallowedQueryParams: boolean;
}

export function resolveRouteAudit(rawUrlOrPath: string): RouteAuditResolution {
  const rawStr = String(rawUrlOrPath || '/');
  const queryPart = rawStr.includes('?') ? rawStr.split('?')[1].split('#')[0] : '';
  const cleanPath = normalizePathname(rawStr);
  const lowerPath = cleanPath.toLowerCase();

  const hasDisallowedQueryParams = /(?:^|&)(?:page|p|sort|filter|category|tag|q|search)=/i.test(queryPart);

  // 1. Check obsolete Paisa Saarthi / personal-finance routes (e.g. /schemes, /schemes?page=48)
  for (const prefix of OBSOLETE_PERSONAL_FINANCE_PREFIXES) {
    if (lowerPath === prefix || lowerPath.startsWith(`${prefix}/`)) {
      return {
        cleanPath,
        routeKind: 'obsolete_gone',
        statusCode: 410,
        robots: 'noindex, nofollow',
        hasDisallowedQueryParams,
      };
    }
  }

  // 2. Check exact duplicate redirects (e.g. /resources -> /blog, /invoice-ocr -> /app)
  if (REDIRECT_ROUTE_MAP[lowerPath]) {
    return {
      cleanPath,
      routeKind: 'redirect',
      statusCode: 301,
      redirectTo: REDIRECT_ROUTE_MAP[lowerPath],
      robots: 'noindex, follow',
      hasDisallowedQueryParams,
    };
  }

  // 3. Check /resources/:slug -> /blog/:slug
  if (lowerPath.startsWith('/resources/')) {
    const slug = cleanPath.slice('/resources/'.length);
    const matchingArticle = RESOURCE_ARTICLES.find((a) => a.slug === slug);
    if (matchingArticle) {
      return {
        cleanPath,
        routeKind: 'redirect',
        statusCode: 301,
        redirectTo: `/blog/${matchingArticle.slug}`,
        robots: 'noindex, follow',
        hasDisallowedQueryParams,
      };
    }
    return {
      cleanPath,
      routeKind: 'not_found',
      statusCode: 404,
      robots: 'noindex, nofollow',
      hasDisallowedQueryParams,
    };
  }

  // 4. Interactive Workspace route (/app)
  if (cleanPath === '/app') {
    return {
      cleanPath,
      routeKind: 'workspace',
      statusCode: 200,
      robots: hasDisallowedQueryParams ? 'noindex, nofollow' : 'noindex, follow',
      hasDisallowedQueryParams,
    };
  }

  // 5. Known canonical indexable pages (including /hi localized pages)
  const isKnownCore = Boolean(CORE_SAAS_ROUTES_META[cleanPath]);
  const isKnownSeoLanding = Boolean(DEDICATED_SEO_PAGES[cleanPath]);
  const isKnownHindiRoute = Boolean(HINDI_LOCALIZED_ROUTES[cleanPath]);
  const isKnownBlogArticle = RESOURCE_ARTICLES.some((a) => a.path === cleanPath || `/blog/${a.slug}` === cleanPath);

  if (isKnownCore || isKnownSeoLanding || isKnownHindiRoute || isKnownBlogArticle) {
    return {
      cleanPath,
      routeKind: 'canonical',
      statusCode: 200,
      robots: hasDisallowedQueryParams ? 'noindex, nofollow' : 'index, follow',
      hasDisallowedQueryParams,
    };
  }

  // 6. Any other unrecognized route -> 404 Not Found with noindex, nofollow
  return {
    cleanPath,
    routeKind: 'not_found',
    statusCode: 404,
    robots: 'noindex, nofollow',
    hasDisallowedQueryParams,
  };
}

export function getCanonicalSitemapEntries(): Array<{
  loc: string;
  lastmod: string;
  changefreq: 'weekly' | 'monthly';
  priority: string;
}> {
  const defaultDate = '2026-11-14';
  const entries: Array<{
    loc: string;
    lastmod: string;
    changefreq: 'weekly' | 'monthly';
    priority: string;
  }> = [
    { loc: `${SITE_DOMAIN}/`, lastmod: defaultDate, changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE_DOMAIN}/features`, lastmod: defaultDate, changefreq: 'weekly', priority: '0.9' },
    { loc: `${SITE_DOMAIN}/how-it-works`, lastmod: defaultDate, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_DOMAIN}/pricing`, lastmod: defaultDate, changefreq: 'weekly', priority: '0.9' },
    { loc: `${SITE_DOMAIN}/faq`, lastmod: defaultDate, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_DOMAIN}/security`, lastmod: defaultDate, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_DOMAIN}/api-docs`, lastmod: defaultDate, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_DOMAIN}/about`, lastmod: defaultDate, changefreq: 'monthly', priority: '0.7' },
    { loc: `${SITE_DOMAIN}/contact`, lastmod: defaultDate, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_DOMAIN}/privacy`, lastmod: defaultDate, changefreq: 'monthly', priority: '0.5' },
    { loc: `${SITE_DOMAIN}/terms`, lastmod: defaultDate, changefreq: 'monthly', priority: '0.5' },
    { loc: `${SITE_DOMAIN}/data-deletion`, lastmod: defaultDate, changefreq: 'monthly', priority: '0.5' },
  ];

  Object.keys(DEDICATED_SEO_PAGES).forEach((seoPath) => {
    entries.push({
      loc: `${SITE_DOMAIN}${seoPath}`,
      lastmod: defaultDate,
      changefreq: 'weekly',
      priority: '0.9',
    });
  });

  entries.push({
    loc: `${SITE_DOMAIN}/blog`,
    lastmod: defaultDate,
    changefreq: 'weekly',
    priority: '0.8',
  });

  RESOURCE_ARTICLES.forEach((article) => {
    entries.push({
      loc: `${SITE_DOMAIN}/blog/${article.slug}`,
      lastmod: article.publishedDate || defaultDate,
      changefreq: 'monthly',
      priority: '0.8',
    });
  });

  // Add Hindi (/hi) localized routes to sitemap.xml per Task 12
  Object.keys(HINDI_LOCALIZED_ROUTES).forEach((hiPath) => {
    entries.push({
      loc: `${SITE_DOMAIN}${hiPath}`,
      lastmod: defaultDate,
      changefreq: 'weekly',
      priority: hiPath === '/hi' ? '0.9' : '0.8',
    });
  });

  return entries;
}

export function resolvePageSeoMetadata(rawUrlOrPath: string): {
  cleanPath: string;
  canonicalUrl: string;
  title: string;
  h1: string;
  description: string;
  breadcrumbName: string;
  robots: 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
  statusCode: 200 | 301 | 404 | 410;
  routeKind: RouteAuditResolution['routeKind'];
  redirectTo?: string;
  pageFaqs: FaqItem[];
  seoSpec?: SeoLandingPageSpec;
  articleSpec?: ResourceArticleSpec;
  hindiSpec?: (typeof HINDI_LOCALIZED_ROUTES)[string];
} {
  const audit = resolveRouteAudit(rawUrlOrPath);
  const { cleanPath, robots, statusCode, routeKind, redirectTo } = audit;
  const effectivePath = redirectTo || cleanPath;
  const canonicalUrl = `${SITE_DOMAIN}${effectivePath === '/' ? '/' : effectivePath}`;

  if (routeKind === 'obsolete_gone') {
    return {
      cleanPath,
      canonicalUrl: `${SITE_DOMAIN}/`,
      title: `410 Gone — Legacy Personal Finance Page Removed | ${BRAND_NAME}`,
      h1: '410 Gone — Legacy Personal-Finance Page Removed',
      description: `This legacy personal-finance or scheme directory URL has been permanently removed. ${BRAND_NAME} is a B2B GST invoice OCR, TallyPrime XML, and GSTR-2B platform for Indian CA firms.`,
      breadcrumbName: '410 Gone',
      robots: 'noindex, nofollow',
      statusCode: 410,
      routeKind,
      pageFaqs: [],
    };
  }

  if (routeKind === 'not_found') {
    return {
      cleanPath,
      canonicalUrl: `${SITE_DOMAIN}/`,
      title: `404 Page Not Found | ${BRAND_NAME}`,
      h1: '404 — Page Not Found',
      description: `The requested page could not be found on ${BRAND_NAME}. Explore GST Invoice OCR, TallyPrime XML export, and GSTR-2B reconciliation for Indian Chartered Accountants.`,
      breadcrumbName: '404 Not Found',
      robots: 'noindex, nofollow',
      statusCode: 404,
      routeKind,
      pageFaqs: [],
    };
  }

  let title = CORE_SAAS_ROUTES_META['/'].title;
  let h1 = CORE_SAAS_ROUTES_META['/'].h1;
  let description = CORE_SAAS_ROUTES_META['/'].description;
  let breadcrumbName = 'Home';
  let pageFaqs: FaqItem[] = effectivePath === '/' || effectivePath === '/faq' ? HOMEPAGE_FAQS : [];
  let seoSpec: SeoLandingPageSpec | undefined;
  let articleSpec: ResourceArticleSpec | undefined;
  let hindiSpec: (typeof HINDI_LOCALIZED_ROUTES)[string] | undefined;

  if (HINDI_LOCALIZED_ROUTES[effectivePath]) {
    hindiSpec = HINDI_LOCALIZED_ROUTES[effectivePath];
    title = hindiSpec.title;
    h1 = hindiSpec.h1;
    description = hindiSpec.description;
    breadcrumbName = hindiSpec.breadcrumbName;
    if (hindiSpec.enPath === '/') {
      pageFaqs = HOMEPAGE_FAQS;
    } else if (DEDICATED_SEO_PAGES[hindiSpec.enPath]) {
      seoSpec = DEDICATED_SEO_PAGES[hindiSpec.enPath];
      pageFaqs = seoSpec.faqs;
    }
  } else if (CORE_SAAS_ROUTES_META[effectivePath]) {
    title = CORE_SAAS_ROUTES_META[effectivePath].title;
    h1 = CORE_SAAS_ROUTES_META[effectivePath].h1;
    description = CORE_SAAS_ROUTES_META[effectivePath].description;
    breadcrumbName = CORE_SAAS_ROUTES_META[effectivePath].breadcrumbName;
  } else if (DEDICATED_SEO_PAGES[effectivePath]) {
    seoSpec = DEDICATED_SEO_PAGES[effectivePath];
    title = seoSpec.metaTitle;
    h1 = seoSpec.h1;
    description = seoSpec.metaDescription;
    breadcrumbName = seoSpec.badge;
    pageFaqs = seoSpec.faqs;
  } else {
    articleSpec = RESOURCE_ARTICLES.find(
      (a) => a.path === effectivePath || `/blog/${a.slug}` === effectivePath
    );
    if (articleSpec) {
      title = articleSpec.metaTitle;
      h1 = articleSpec.title;
      description = articleSpec.metaDescription;
      breadcrumbName = articleSpec.title;
      pageFaqs = articleSpec.faqs;
    }
  }

  return {
    cleanPath,
    canonicalUrl,
    title,
    h1,
    description,
    breadcrumbName,
    robots,
    statusCode,
    routeKind,
    redirectTo,
    pageFaqs,
    seoSpec,
    articleSpec,
    hindiSpec,
  };
}

export function buildJsonLdGraph(rawUrlOrPath: string): Record<string, any> {
  const { cleanPath, canonicalUrl, breadcrumbName, routeKind, pageFaqs, seoSpec, articleSpec, hindiSpec } =
    resolvePageSeoMetadata(rawUrlOrPath);

  const graph: any[] = [
    {
      '@type': 'Organization',
      '@id': `${SITE_DOMAIN}/#organization`,
      name: BRAND_NAME,
      url: SITE_DOMAIN,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_DOMAIN}/og-default.png`,
        width: 1200,
        height: 630,
      },
      description: BRAND_TAGLINE,
      areaServed: 'IN',
      // TODO: confirm social profile URLs
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@casaarthiai.in',
        contactType: 'customer support',
        areaServed: 'IN',
      },
      knowsAbout: [
        'GST Invoice to Tally XML Conversion',
        'GSTR-2B Reconciliation in Excel',
        'Invoice OCR for Chartered Accountants',
        'GSTIN Checksum Validation',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_DOMAIN}/#website`,
      url: SITE_DOMAIN,
      name: BRAND_NAME,
      publisher: { '@id': `${SITE_DOMAIN}/#organization` },
    },
  ];

  if (routeKind === 'obsolete_gone' || routeKind === 'not_found') {
    return {
      '@context': 'https://schema.org',
      '@graph': graph,
    };
  }

  // Only include SoftwareApplication schema on genuine software/product pages
  const qualifiesForSoftwareApp =
    cleanPath === '/' ||
    cleanPath === '/hi' ||
    cleanPath === '/app' ||
    cleanPath === '/features' ||
    cleanPath === '/how-it-works' ||
    cleanPath === '/pricing' ||
    Boolean(seoSpec) ||
    Boolean(hindiSpec);

  if (qualifiesForSoftwareApp) {
    graph.push({
      '@type': 'SoftwareApplication',
      name: BRAND_NAME,
      operatingSystem: 'Web',
      applicationCategory: 'BusinessApplication',
      description:
        'AI-powered bilingual GST invoice OCR, TallyPrime XML export, and GSTR-2B reconciliation software designed specifically for Indian Chartered Accountants.',
      url: `${SITE_DOMAIN}/`,
      screenshot: DEFAULT_OG_IMAGE,
      featureList: [
        'Invoice OCR',
        'PDF invoice processing',
        'JPG and PNG invoice processing',
        'Hindi and English text extraction',
        'GSTIN field extraction',
        'Invoice number and date extraction',
        'Batch document processing',
        'Excel export',
        'TallyPrime XML export',
      ],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
    });
  }

  // Task 9.4: Add HowTo schema on /gst-invoice-to-tally (and /hi/gst-invoice-to-tally)
  if (cleanPath === '/gst-invoice-to-tally' || cleanPath === '/hi/gst-invoice-to-tally') {
    const tallySpec = DEDICATED_SEO_PAGES['/gst-invoice-to-tally'];
    graph.push({
      '@type': 'HowTo',
      name: tallySpec.h1,
      description: tallySpec.metaDescription,
      step: tallySpec.workflowSteps.map((s, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: s.title,
        text: s.detail,
      })),
    });
  }

  const breadcrumbItems: any[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_DOMAIN}/`,
    },
  ];
  if (cleanPath !== '/') {
    if (articleSpec) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_DOMAIN}/blog`,
      });
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 3,
        name: articleSpec.title,
        item: canonicalUrl,
      });
    } else if (hindiSpec && hindiSpec.hiPath !== '/hi') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Hindi (/hi)',
        item: `${SITE_DOMAIN}/hi`,
      });
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 3,
        name: breadcrumbName,
        item: canonicalUrl,
      });
    } else if (seoSpec) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Features',
        item: `${SITE_DOMAIN}/features`,
      });
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 3,
        name: breadcrumbName,
        item: canonicalUrl,
      });
    } else {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: breadcrumbName,
        item: canonicalUrl,
      });
    }
  }
  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  });

  if (pageFaqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: pageFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  // Task 8: Article schema with honest editorial Organization author + Organization publisher
  if (articleSpec) {
    graph.push({
      '@type': 'Article',
      headline: articleSpec.title,
      description: articleSpec.metaDescription,
      image: DEFAULT_OG_IMAGE,
      datePublished: articleSpec.publishedDate,
      dateModified: articleSpec.publishedDate,
      author: {
        '@type': 'Organization',
        '@id': `${SITE_DOMAIN}/#organization`,
        name: DEFAULT_CA_AUTHOR.name,
        url: DEFAULT_CA_AUTHOR.url,
      },
      publisher: { '@id': `${SITE_DOMAIN}/#organization` },
      mainEntityOfPage: canonicalUrl,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function syncDocumentSeoTags(pathname: string): void {
  if (typeof document === 'undefined') return;
  const fullPathWithQuery =
    typeof window !== 'undefined' ? `${pathname}${window.location.search || ''}` : pathname;
  const { cleanPath, canonicalUrl, title, description, robots, articleSpec, hindiSpec } =
    resolvePageSeoMetadata(fullPathWithQuery);

  document.title = title;
  document.documentElement.lang = hindiSpec ? 'hi-IN' : 'en-IN';

  // Remove meta keywords tag if present
  const keywordsMeta = document.head.querySelector('meta[name="keywords"]');
  if (keywordsMeta) {
    keywordsMeta.remove();
  }

  const setMetaTag = (selector: string, attrName: 'name' | 'property', attrValue: string, content: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaTag('meta[name="description"]', 'name', 'description', description);
  setMetaTag('meta[name="robots"]', 'name', 'robots', robots);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', articleSpec ? 'article' : 'website');
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', BRAND_NAME);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', DEFAULT_OG_IMAGE);
  setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', DEFAULT_OG_IMAGE_ALT);
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', DEFAULT_OG_IMAGE);

  let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Sync hreflang links (en-IN, hi-IN, x-default) per Task 12
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  const alternates = getHreflangAlternates(cleanPath);
  if (alternates) {
    const addHreflang = (lang: string, href: string) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', href);
      document.head.appendChild(link);
    };
    addHreflang('en-IN', alternates.enUrl);
    addHreflang('hi-IN', alternates.hiUrl);
    addHreflang('x-default', alternates.enUrl);
  }

  // Remove any legacy duplicate JSON-LD script tags
  const legacyScript = document.head.querySelector('script#casaarthiai-software-jsonld, script#casaarthiai-jsonld');
  if (legacyScript && legacyScript.id !== 'ledgersutra-jsonld') {
    legacyScript.remove();
  }

  let scriptEl = document.head.querySelector<HTMLScriptElement>('script#ledgersutra-jsonld');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.type = 'application/ld+json';
    scriptEl.id = 'ledgersutra-jsonld';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(buildJsonLdGraph(fullPathWithQuery));
}

function escapeHtmlAttr(raw: string): string {
  return String(raw || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Generates crawlable SSR HTML body + head metadata for public routes so search engine
 * crawlers see a single clear H1, breadcrumb nav, contextual internal <a href> links, FAQs, and JSON-LD in raw HTML.
 */
export function getPrerenderedSeoHtml(rawUrlOrPath: string): {
  title: string;
  h1: string;
  description: string;
  canonicalUrl: string;
  robots: 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
  statusCode: 200 | 301 | 404 | 410;
  routeKind: RouteAuditResolution['routeKind'];
  redirectTo?: string;
  hreflangHtml: string;
  jsonLdString: string;
  ssrBodyHtml: string;
} {
  const {
    cleanPath,
    canonicalUrl,
    title,
    h1,
    description,
    breadcrumbName,
    robots,
    statusCode,
    routeKind,
    redirectTo,
    pageFaqs,
    seoSpec,
    articleSpec,
    hindiSpec,
  } = resolvePageSeoMetadata(rawUrlOrPath);
  const jsonLdString = JSON.stringify(buildJsonLdGraph(rawUrlOrPath));

  const alternates = getHreflangAlternates(cleanPath);
  const hreflangHtml = alternates
    ? `<link rel="alternate" hreflang="en-IN" href="${escapeHtmlAttr(alternates.enUrl)}" />\n    <link rel="alternate" hreflang="hi-IN" href="${escapeHtmlAttr(alternates.hiUrl)}" />\n    <link rel="alternate" hreflang="x-default" href="${escapeHtmlAttr(alternates.enUrl)}" />`
    : '';

  const sharedNavHtml = `<header>
    <nav aria-label="Primary site navigation">
      <a href="/">${escapeHtmlAttr(BRAND_NAME)}</a>
      <a href="/">Home</a>
      <a href="/app">Workspace</a>
      <a href="/features">Features</a>
      <a href="/how-it-works">How It Works</a>
      <a href="/pricing">Pricing</a>
      <a href="/blog">Blog</a>
      <a href="/api-docs">API</a>
      <a href="/hi">हिंदी (/hi)</a>
    </nav>
  </header>`;

  const breadcrumbNavHtml =
    cleanPath !== '/'
      ? `<nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; ${
            articleSpec
              ? `<a href="/blog">Blog</a> &gt; <span aria-current="page">${escapeHtmlAttr(articleSpec.title)}</span>`
              : seoSpec
              ? `<a href="/features">Features</a> &gt; <span aria-current="page">${escapeHtmlAttr(breadcrumbName)}</span>`
              : `<span aria-current="page">${escapeHtmlAttr(breadcrumbName)}</span>`
          }
        </nav>`
      : '';

  const sharedFooterHtml = `<footer>
    <nav aria-label="Footer navigation">
      <a href="/">https://www.casaarthiai.in</a>
      <a href="/invoice-ocr-for-ca">Invoice OCR for CA Firms</a>
      <a href="/gst-invoice-to-tally">GST Invoice to TallyPrime XML</a>
      <a href="/gstr-2b-reconciliation-excel">GSTR-2B Reconciliation in Excel</a>
      <a href="/bulk-invoice-processing-for-ca">Bulk Invoice Processing for CA</a>
      <a href="/gst-invoice-data-extraction">GST Invoice Data Extraction</a>
      <a href="/pdf-invoice-to-excel">PDF Invoice to Excel Converter</a>
      <a href="/bulk-invoice-processing">Bulk Invoice Processing</a>
      <a href="/invoice-automation-for-accountants">Invoice Automation for Accountants</a>
      <a href="/document-scanning-software">Document Scanning Software</a>
      <a href="/pricing">Pricing &amp; CA Firm Pilots</a>
      <a href="/faq">FAQ</a>
      <a href="/security">Security &amp; Data Isolation</a>
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
      <a href="/data-deletion">Data Deletion Policy</a>
      <a href="/about">About LedgerSutra</a>
      <a href="/contact">Contact &amp; Book a Demo</a>
      <a href="/blog">All Blog Articles &amp; Tutorials</a>
      ${RESOURCE_ARTICLES.map((a) => `<a href="${escapeHtmlAttr(a.path)}">${escapeHtmlAttr(a.title)}</a>`).join('\n      ')}
    </nav>
  </footer>`;

  let ssrBodyHtml = '';

  if (routeKind === 'obsolete_gone') {
    ssrBodyHtml = `<div class="sr-only" aria-hidden="false">
      ${sharedNavHtml}
      <main>
        <h1>410 Gone — Legacy Personal-Finance Page Removed</h1>
        <p>This legacy personal-finance or government scheme directory URL (${escapeHtmlAttr(cleanPath)}) has been permanently retired. <a href="/">Return to ${escapeHtmlAttr(BRAND_NAME)} Homepage</a>.</p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (routeKind === 'not_found') {
    ssrBodyHtml = `<div class="sr-only" aria-hidden="false">
      ${sharedNavHtml}
      <main>
        <h1>404 — Page Not Found</h1>
        <p>The requested URL (${escapeHtmlAttr(cleanPath)}) does not exist on ${escapeHtmlAttr(BRAND_NAME)}. <a href="/">Back to Homepage</a>.</p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (seoSpec) {
    ssrBodyHtml = `<div class="sr-only" aria-hidden="false">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <article>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>${escapeHtmlAttr(hindiSpec ? hindiSpec.subtitle : seoSpec.subtitle)}</p>
        <p>${escapeHtmlAttr(seoSpec.problemStatement)}</p>
        ${(seoSpec.longFormParagraphs || []).map((p) => `<p>${escapeHtmlAttr(p)}</p>`).join('')}
        <p>Explore related workflows: <a href="/gst-invoice-to-tally">Convert GST Invoices to TallyPrime XML</a>, <a href="/gstr-2b-reconciliation-excel">GSTR-2B Reconciliation in Excel</a>, <a href="/pdf-invoice-to-excel">Convert PDF Invoices to Excel</a>, <a href="/bulk-invoice-processing">Bulk Invoice Processing</a>, and <a href="/pricing">CA Firm Pricing Plans</a>.</p>
        <section>
          <h2>How ${escapeHtmlAttr(BRAND_NAME)} Works</h2>
          <ul>
            ${seoSpec.workflowSteps
              .map((step) => `<li><strong>${escapeHtmlAttr(step.title)}:</strong> ${escapeHtmlAttr(step.detail)}</li>`)
              .join('')}
          </ul>
        </section>
        <section>
          <h2>Key Capabilities</h2>
          <ul>
            ${seoSpec.keyCapabilities
              .map((cap) => `<li><strong>${escapeHtmlAttr(cap.title)}:</strong> ${escapeHtmlAttr(cap.description)}</li>`)
              .join('')}
          </ul>
        </section>
        ${
          pageFaqs.length > 0
            ? `<section><h2>Frequently Asked Questions</h2>${pageFaqs
                .map((f) => `<div><h3>${escapeHtmlAttr(f.question)}</h3><p>${escapeHtmlAttr(f.answer)}</p></div>`)
                .join('')}</section>`
            : ''
        }
      </article>
      ${sharedFooterHtml}
    </div>`;
  } else if (articleSpec) {
    ssrBodyHtml = `<div class="sr-only" aria-hidden="false">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <article>
        <p>Published ${escapeHtmlAttr(articleSpec.publishedDate)} · Updated ${escapeHtmlAttr(articleSpec.publishedDate)} · By <a href="/about">${escapeHtmlAttr(DEFAULT_CA_AUTHOR.name)} (${escapeHtmlAttr(DEFAULT_CA_AUTHOR.credentials)})</a> — ${escapeHtmlAttr(DEFAULT_CA_AUTHOR.bio)}</p>
        <h1>${escapeHtmlAttr(articleSpec.title)}</h1>
        <p>${escapeHtmlAttr(articleSpec.summary)}</p>
        ${articleSpec.sections
          .map(
            (sec) => `<section>
          <h2>${escapeHtmlAttr(sec.heading)}</h2>
          ${sec.paragraphs.map((p) => `<p>${escapeHtmlAttr(p)}</p>`).join('')}
        </section>`
          )
          .join('')}
        <p>Related CA Workflows: <a href="/gst-invoice-to-tally">GST Invoice to TallyPrime XML Converter</a> · <a href="/gstr-2b-reconciliation-excel">GSTR-2B Reconciliation in Excel</a> · <a href="/pricing">CA Practice Pricing Plans</a> · <a href="/blog">Back to All Blog Articles</a></p>
        ${
          pageFaqs.length > 0
            ? `<section><h2>Frequently Asked Questions</h2>${pageFaqs
                .map((f) => `<div><h3>${escapeHtmlAttr(f.question)}</h3><p>${escapeHtmlAttr(f.answer)}</p></div>`)
                .join('')}</section>`
            : ''
        }
      </article>
      ${sharedFooterHtml}
    </div>`;
  } else {
    ssrBodyHtml = `<div class="sr-only" aria-hidden="false">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>${escapeHtmlAttr(hindiSpec ? hindiSpec.subtitle : description)}</p>
        <p>Invoice OCR software for Indian CA firms — automated GST data extraction with a Hindi + English bill scanner.</p>
        <p>Built for Indian Chartered Accountants — explore <a href="/gst-invoice-to-tally">TallyPrime XML export</a>, <a href="/gstr-2b-reconciliation-excel">GSTR-2B reconciliation</a>, <a href="/features">all GST features</a>, and <a href="/pricing">pricing plans</a>.</p>
        <section>
          <h2>Core Capabilities for Indian CA Firms &amp; GST Practitioners</h2>
          <ul>
            <li><a href="/gst-invoice-data-extraction">15-Digit GSTIN Validation (Mod-36 Checksum Audit)</a></li>
            <li><a href="/document-scanning-software">Bilingual Bill Scanner (English &amp; Hindi)</a></li>
            <li><a href="/security">Zero-Retention Local Fallback OCR &amp; Firestore Client Isolation</a></li>
            <li><a href="/gst-invoice-to-tally">TallyPrime XML</a>, <a href="/gstr-2b-reconciliation-excel">GSTR-2B Excel</a>, <a href="/pdf-invoice-to-excel">PDF to Excel (.xlsx)</a>, and <a href="/api-docs">REST API</a></li>
          </ul>
        </section>
        ${
          pageFaqs.length > 0
            ? `<section><h2>Frequently Asked Questions</h2>${pageFaqs
                .map((f) => `<div><h3>${escapeHtmlAttr(f.question)}</h3><p>${escapeHtmlAttr(f.answer)}</p></div>`)
                .join('')}</section>`
            : ''
        }
      </main>
      ${sharedFooterHtml}
    </div>`;
  }

  return {
    title,
    h1,
    description,
    canonicalUrl,
    robots,
    statusCode,
    routeKind,
    redirectTo,
    hreflangHtml,
    jsonLdString,
    ssrBodyHtml,
  };
}



