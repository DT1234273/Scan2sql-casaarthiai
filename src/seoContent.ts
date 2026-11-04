export const SITE_DOMAIN = 'https://casaarthiai.in';
export const BRAND_NAME = 'LedgerSutra';
export const BRAND_TAGLINE = 'AI-Powered Invoice & Document Automation for CA Firms';

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
    question: 'What types of invoices and bills can LedgerSutra process?',
    answer:
      'LedgerSutra processes digital PDFs, scanned multi-page PDFs, and mobile or scanner images (JPG, JPEG, PNG). It handles B2B GST tax invoices, retail purchase bills, wholesale distributor invoices, thermal receipts, and bilingual English + Hindi bills.',
  },
  {
    question: 'How does LedgerSutra help Chartered Accountants during monthly GSTR-1, GSTR-2B, and GSTR-3B preparation?',
    answer:
      'Instead of typing supplier GSTINs, invoice numbers, dates, HSN/SAC codes, taxable values, and CGST/SGST/IGST splits manually into spreadsheets, CAs and article assistants can upload client folders in bulk. LedgerSutra extracts structured fields, validates 15-character GSTIN state codes, checks tax math consistency, flags duplicates, and exports clean Excel (.xlsx), CSV, JSON, or SQL registers.',
  },
  {
    question: 'What is the difference between Normal User Mode and CA / GST Audit Mode?',
    answer:
      'Normal User Mode consolidates each bill onto a single row (1 Bill = 1 Row) with Bill Name, Date, Invoice No, Shop Name, and Total Cost—while automatically expanding Product 1, Product 2... columns when a receipt contains multiple items. CA / GST Audit Mode unlocks Seller & Buyer GSTIN validation, HSN/SAC codes, Taxable Value, CGST/SGST/IGST columns, line-item audit view, and Supplier-Wise GSTR reconciliation summaries.',
  },
  {
    question: 'Does LedgerSutra work if an uploaded invoice is tilted, shadowed, or a scanned image without a digital text layer?',
    answer:
      'Yes. LedgerSutra combines PDF coordinate text extraction with High-DPI canvas contrast normalization and hybrid AI Vision + bilingual Tesseract OCR (English + Devanagari Hindi). Even if a document is a flat photograph or scan, the engine extracts verbatim text and structured line items.',
  },
  {
    question: 'Can I append newly scanned client bills into an existing Excel purchase register?',
    answer:
      'Yes. Using the "Append to Existing Excel (.xlsx)" workflow, you can import your existing client spreadsheet, scan additional bills in the same session, and export a single merged multi-sheet Excel workbook without losing prior rows.',
  },
  {
    question: 'How is client financial data stored and protected?',
    answer:
      'Uploaded files are processed in your active workspace session with local browser storage and optional workspace sync so you don’t lose work on page refresh. You retain full control to delete individual invoice rows or clear your workspace history at any time.',
  },
];

export const DEDICATED_SEO_PAGES: Record<string, SeoLandingPageSpec> = {
  '/invoice-ocr-for-ca': {
    slug: 'invoice-ocr-for-ca',
    path: '/invoice-ocr-for-ca',
    badge: 'Chartered Accountant OCR Workflow',
    h1: 'AI Invoice OCR Software for Chartered Accountants in India',
    subtitle:
      'Eliminate manual voucher typing during GST filing and tax audits. Extract supplier GSTIN, invoice numbers, HSN codes, and tax splits from scanned PDFs and mobile bill photos with audit-grade precision.',
    metaTitle: 'Invoice OCR for CA Firms in India | AI Bill Extraction — LedgerSutra',
    metaDescription:
      'Purpose-built Invoice OCR for Chartered Accountants and CA firms in India. Convert scanned purchase bills, PDFs, and GST invoices into structured Excel, CSV, and SQL registers.',
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
    h1: 'Automated GST Invoice Data Extraction & GSTIN Validation',
    subtitle:
      'Extract Seller GSTIN, Buyer GSTIN, HSN/SAC codes, Taxable Value, and CGST/SGST/IGST breakups from B2B and B2C invoices. Built for accurate GSTR-1, GSTR-2B, and GSTR-3B working papers.',
    metaTitle: 'GST Invoice Data Extraction Software India | GSTIN & Tax Split — LedgerSutra',
    metaDescription:
      'Extract GSTIN, invoice number, HSN/SAC, taxable value, CGST, SGST, and IGST from Indian GST invoices automatically. Validate GSTIN format and export to Excel.',
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
    h1: 'Convert PDF Invoices & Purchase Bills to Structured Excel (.XLSX)',
    subtitle:
      'Stop copy-pasting broken tables from PDFs. Turn single or multi-page PDF invoices into clean, formula-ready Excel workbooks with customizable columns and automatic totals.',
    metaTitle: 'PDF Invoice to Excel Converter for Accountants & CA Firms — LedgerSutra',
    metaDescription:
      'Convert PDF invoices and scanned bills into structured Excel (.xlsx) and CSV sheets. Supports 1 Bill = 1 Row summary mode and detailed line-item tables.',
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
    h1: 'Bulk Invoice Processing & Multi-Bill Merger for CA Practices',
    subtitle:
      'Upload multiple client invoices back-to-back in a single session. Automatically extract, validate, and merge dozens of PDFs and images into one unified accounting register.',
    metaTitle: 'Bulk Invoice Processing Software for CA Firms & Finance Teams — LedgerSutra',
    metaDescription:
      'Process multiple PDF and image invoices in bulk. Merge client purchase bills into a single validated Excel, CSV, or SQL register with zero page reloads.',
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
    h1: 'End-to-End Invoice Automation for Accountants & Tax Consultants',
    subtitle:
      'Replace repetitive voucher entry with intelligent document capture, human-in-the-loop verification, and instant spreadsheet & SQL generation.',
    metaTitle: 'Invoice Automation for Accountants & Tax Consultants in India — LedgerSutra',
    metaDescription:
      'Automate purchase bill and invoice data entry for Indian accountants, bookkeepers, and tax consultants. Extract headers, line items, GST, and export to Excel.',
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
    h1: 'Intelligent Document Scanning & Verbatim Text Extraction Software',
    subtitle:
      'Extract 100% verbatim readable text and structured tables from scanned PDFs, tilted photos, and bilingual English + Hindi financial documents.',
    metaTitle: 'Document Scanning Software & PDF/Image to Text OCR India — LedgerSutra',
    metaDescription:
      'High-DPI document scanning software with English and Hindi OCR. Extract verbatim text (.txt) and structured accounting tables (.xlsx, .sql) from PDFs and images.',
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
};

export const RESOURCE_ARTICLES: ResourceArticleSpec[] = [
  {
    slug: 'automate-invoice-data-entry-ca-firms',
    path: '/resources/automate-invoice-data-entry-ca-firms',
    title: 'How to Automate Invoice Data Entry in a CA Firm: A Practical Step-by-Step Guide',
    metaTitle: 'How to Automate Invoice Data Entry in a CA Firm | LedgerSutra Guide',
    metaDescription:
      'Learn how Indian Chartered Accountant firms can automate purchase bill and invoice data entry using AI OCR, GSTIN validation, and structured Excel workflows.',
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
    path: '/resources/ocr-for-gst-invoices-complete-guide',
    title: 'OCR for GST Invoices: Complete Technical & Compliance Guide for Indian Accountants',
    metaTitle: 'OCR for GST Invoices in India: Complete Guide for CAs — LedgerSutra',
    metaDescription:
      'Understand how Optical Character Recognition (OCR) and AI Vision extract GSTIN, HSN codes, and CGST/SGST/IGST splits from Indian tax invoices.',
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
    path: '/resources/convert-purchase-bills-to-excel-accounting',
    title: 'How to Convert Client Purchase Bills into Clean Excel Sheets for Accounting',
    metaTitle: 'Convert Purchase Bills to Excel for Accounting & GST — LedgerSutra',
    metaDescription:
      'Step-by-step guide to converting PDF and image purchase bills into structured, formula-ready Excel (.xlsx) registers without broken columns.',
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
    path: '/resources/common-errors-manual-invoice-entry',
    title: '7 Costly Errors in Manual Invoice Data Entry (And How CA Firms Prevent Them)',
    metaTitle: '7 Common Errors in Manual Invoice Entry & How to Prevent Them — LedgerSutra',
    metaDescription:
      'Discover the 7 most common manual invoice data entry mistakes in Indian accounting practices—from GSTIN typos to duplicate ITC claims—and how to prevent them.',
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
    path: '/resources/digital-document-workflow-chartered-accountants',
    title: 'Designing a Modern Digital Document Workflow for Chartered Accountants',
    metaTitle: 'Digital Document Workflow for Chartered Accountants in India — LedgerSutra',
    metaDescription:
      'Build a paperless, audit-ready digital document workflow for your CA firm. Standardize document collection, OCR extraction, validation, and archival.',
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
    path: '/resources/gst-invoice-fields-checklist-verification',
    title: 'Mandatory GST Invoice Fields Checklist: What Every CA Must Verify Under Rule 46',
    metaTitle: 'Mandatory GST Invoice Fields Checklist (CGST Rule 46) for CAs — LedgerSutra',
    metaDescription:
      'Complete checklist of mandatory fields required on a valid Indian GST Tax Invoice under Rule 46 for claiming Input Tax Credit (ITC).',
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
    path: '/resources/ai-document-processing-for-tax-consultants',
    title: 'AI Document Processing for Tax Consultants: Practical Use Cases & Safeguards',
    metaTitle: 'AI Document Processing for Tax Consultants in India — LedgerSutra',
    metaDescription:
      'How Indian tax consultants and GST practitioners use AI document processing with deterministic validation rules to speed up return preparation.',
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
    path: '/resources/organize-client-bills-monthly-gst-compliance',
    title: 'How to Organize Client Bills for Stress-Free Monthly GST Compliance',
    metaTitle: 'Organize Client Bills for Monthly GST Compliance — LedgerSutra Guide',
    metaDescription:
      'A practical system for CA firms and accountants to organize, scan, and reconcile client purchase and sales bills every month before GST filing deadlines.',
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

export const CORE_SAAS_ROUTES_META: Record<
  string,
  {
    title: string;
    description: string;
    breadcrumbName: string;
  }
> = {
  '/': {
    title: 'LedgerSutra — AI-Powered Invoice & Document Automation for CA Firms in India',
    description:
      'Turn invoices, bills and financial documents into structured, searchable accounting data — without repetitive manual data entry. Built for Indian Chartered Accountants & CA firms.',
    breadcrumbName: 'Home',
  },
  '/app': {
    title: 'Invoice OCR & GST Workspace — LedgerSutra',
    description:
      'Upload PDF or image invoices, extract verbatim text and GST fields, validate 15-character GSTINs, and export merged Excel (.xlsx), CSV, JSON, or SQL registers.',
    breadcrumbName: 'Workspace',
  },
  '/features': {
    title: 'Features — Smart Invoice OCR, GST Extraction & Excel Automation | LedgerSutra',
    description:
      'Explore LedgerSutra’s CA-focused features: English + Hindi invoice OCR, 15-digit GSTIN validation, duplicate detection, 1-Bill-1-Row Excel merger, and SQL/CSV/JSON exports.',
    breadcrumbName: 'Features',
  },
  '/how-it-works': {
    title: 'How LedgerSutra Works — 4-Step AI Invoice Automation for CA Firms',
    description:
      'See how LedgerSutra transforms scanned PDFs and bill photos into validated Excel purchase registers, supplier summaries, and accounting exports in 4 steps.',
    breadcrumbName: 'How It Works',
  },
  '/pricing': {
    title: 'Pricing & Practice Plans for CA Firms & Tax Consultants | LedgerSutra',
    description:
      'Transparent, honest workflow plans for solo practitioners, Chartered Accountant firms, and enterprise finance teams in India. Start using the live workspace immediately.',
    breadcrumbName: 'Pricing',
  },
  '/about': {
    title: 'About LedgerSutra — Purpose-Built Document Automation for Indian Accounting',
    description:
      'Learn why we built LedgerSutra at casaarthiai.in to eliminate repetitive manual invoice entry for Chartered Accountants, tax consultants, and finance teams across India.',
    breadcrumbName: 'About',
  },
  '/contact': {
    title: 'Contact LedgerSutra — CA Firm Onboarding, Support & Custom Workflows',
    description:
      'Get in touch with the LedgerSutra team for CA firm onboarding, custom ERP export schemas, bulk document automation inquiries, and technical support.',
    breadcrumbName: 'Contact',
  },
  '/resources': {
    title: 'CA Resource Center — Guides on GST Invoice OCR & Accounting Automation | LedgerSutra',
    description:
      'Practical guides, checklists, and technical resources for Indian Chartered Accountants, GST practitioners, and finance teams on automating invoice data entry.',
    breadcrumbName: 'Resources',
  },
};

export function normalizePathname(rawPath: string): string {
  if (!rawPath || rawPath === '/') return '/';
  const cleaned = rawPath.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return cleaned || '/';
}

export function syncDocumentSeoTags(pathname: string): void {
  if (typeof document === 'undefined') return;
  const cleanPath = normalizePathname(pathname);
  const canonicalUrl = `${SITE_DOMAIN}${cleanPath === '/' ? '' : cleanPath}`;

  let title = CORE_SAAS_ROUTES_META['/'].title;
  let description = CORE_SAAS_ROUTES_META['/'].description;
  let breadcrumbName = 'Home';
  let pageFaqs: FaqItem[] = cleanPath === '/' ? HOMEPAGE_FAQS : [];
  let articleSpec: ResourceArticleSpec | undefined;

  if (CORE_SAAS_ROUTES_META[cleanPath]) {
    title = CORE_SAAS_ROUTES_META[cleanPath].title;
    description = CORE_SAAS_ROUTES_META[cleanPath].description;
    breadcrumbName = CORE_SAAS_ROUTES_META[cleanPath].breadcrumbName;
  } else if (DEDICATED_SEO_PAGES[cleanPath]) {
    const seoSpec = DEDICATED_SEO_PAGES[cleanPath];
    title = seoSpec.metaTitle;
    description = seoSpec.metaDescription;
    breadcrumbName = seoSpec.badge;
    pageFaqs = seoSpec.faqs;
  } else {
    articleSpec = RESOURCE_ARTICLES.find((a) => a.path === cleanPath);
    if (articleSpec) {
      title = articleSpec.metaTitle;
      description = articleSpec.metaDescription;
      breadcrumbName = articleSpec.title;
      pageFaqs = articleSpec.faqs;
    }
  }

  document.title = title;

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
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', BRAND_NAME);
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);

  let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Build JSON-LD Graph
  const graph: any[] = [
    {
      '@type': 'Organization',
      '@id': `${SITE_DOMAIN}/#organization`,
      name: BRAND_NAME,
      url: SITE_DOMAIN,
      description: BRAND_TAGLINE,
      areaServed: 'IN',
      knowsAbout: [
        'Invoice OCR for Chartered Accountants',
        'GST Invoice Data Extraction',
        'PDF Invoice to Excel Conversion',
        'Automated Accounting Data Entry',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_DOMAIN}/#website`,
      url: SITE_DOMAIN,
      name: BRAND_NAME,
      publisher: { '@id': `${SITE_DOMAIN}/#organization` },
    },
    {
      '@type': 'SoftwareApplication',
      name: BRAND_NAME,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: SITE_DOMAIN,
      description:
        'AI-Powered Invoice & Document Automation platform for Indian Chartered Accountants (CAs), tax consultants, and finance teams.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
    },
  ];

  // BreadcrumbList
  const breadcrumbItems: any[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_DOMAIN,
    },
  ];
  if (cleanPath !== '/') {
    if (articleSpec) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Resources',
        item: `${SITE_DOMAIN}/resources`,
      });
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 3,
        name: articleSpec.title,
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

  if (articleSpec) {
    graph.push({
      '@type': 'Article',
      headline: articleSpec.title,
      description: articleSpec.metaDescription,
      datePublished: articleSpec.publishedDate,
      dateModified: articleSpec.publishedDate,
      author: {
        '@type': 'Organization',
        name: `${BRAND_NAME} CA Workflow Team`,
      },
      publisher: { '@id': `${SITE_DOMAIN}/#organization` },
      mainEntityOfPage: canonicalUrl,
    });
  }

  let scriptEl = document.head.querySelector<HTMLScriptElement>('script#ledgersutra-jsonld');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.type = 'application/ld+json';
    scriptEl.id = 'ledgersutra-jsonld';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  });
}
