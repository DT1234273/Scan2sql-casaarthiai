export const SITE_DOMAIN = 'https://www.casaarthiai.in';
export const BRAND_NAME = 'CA Saarthi AI';
export const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/og-default.png`;
export const DEFAULT_OG_IMAGE_ALT =
  'CA Saarthi AI — GST Invoice OCR, TallyPrime XML Export & GSTR-2B Reconciliation for Indian CA Firms';

export const DEFAULT_CA_AUTHOR = {
  name: 'CA Saarthi AI Editorial Team',
  credentials: 'GST & Accounting Workflow Documentation Team',
  bio: 'Maintained by the CA Saarthi AI product and tax-automation engineering team for Indian CA practices.',
  url: `${SITE_DOMAIN}/about`,
};

export interface FaqItem {
  question: string;
  answer: string;
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
  modifiedDate?: string;
  summary: string;
  keyTakeaways: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
    checklist?: string[];
    externalSources?: Array<{
      label: string;
      url: string;
      sourceName?: string;
    }>;
  }>;
  faqs: FaqItem[];
}

export const RESOURCE_ARTICLES: ResourceArticleSpec[] = [
  {
    slug: 'how-to-import-purchase-invoices-into-tallyprime-from-pdf',
    path: '/blog/how-to-import-purchase-invoices-into-tallyprime-from-pdf',
    title: 'How to Import Purchase Invoices into TallyPrime from PDF',
    metaTitle: 'Import PDF Purchase Invoices to TallyPrime | CA Saarthi AI',
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
        heading: '3. Step-by-Step Workflow in CA Saarthi AI',
        paragraphs: [
          'In CA Saarthi AI, upload your PDF invoices in the Scanner or Batch Queue tab. Next, open Tally Settings in the Master Sheet export menu to confirm your Tally Company Name and ledger names. Click "Export to Tally (XML)" to run the pre-export validation check, resolve or skip any blocked bills, and download the `.xml` file ready for TallyPrime.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What happens if a supplier name has an ampersand (&) like "A & B Traders"?',
        answer:
          'CA Saarthi AI automatically escapes all XML special characters (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;`) so TallyPrime parses the XML without syntax errors.',
      },
    ],
  },
  {
    slug: 'gstr-2b-reconciliation-in-excel-step-by-step',
    path: '/blog/gstr-2b-reconciliation-in-excel-step-by-step',
    title: 'GSTR-2B Reconciliation in Excel: Step by Step',
    metaTitle: 'GSTR-2B Reconciliation in Excel: Step-by-Step',
    metaDescription:
      'Complete step-by-step guide to reconciling your purchase register with GST portal GSTR-2B JSON and Excel files to protect Input Tax Credit. Read guide.',
    category: 'GST Reconciliation',
    readTime: '8 min read',
    publishedDate: '2026-11-03',
    modifiedDate: '2026-11-27',
    summary:
      'A practical guide for CA firms on matching purchase books against GSTR-2B, handling invoice number formatting differences, and exporting a 7-sheet reconciliation workbook.',
    keyTakeaways: [
      'Normalize invoice numbers by stripping spaces, slashes, hyphens, and leading zeros before comparing Books vs GSTR-2B.',
      'Use a ₹1 to ₹2 rounding tolerance so paise differences do not hide genuine matches.',
      'Separate discrepancies into actionable buckets: In Books but Not in GSTR-2B (follow up with vendor) vs In GSTR-2B but Not in Books (review unbooked bill).',
    ],
    sections: [
      {
        heading: '1. Why GSTR-2B Reconciliation Is Critical Before Filing GSTR-3B',
        paragraphs: [
          'Under Section 16(2)(aa) of the CGST Act read with Rule 36(4), Input Tax Credit (ITC) can only be availed when the supplier has furnished the invoice in their GSTR-1/IFF and the details are communicated in the recipient’s GSTR-2B statement.',
          'On the GST Portal, a Form GST DRC-01C intimation is issued when the difference between ITC available as per GSTR-2B and ITC claimed in GSTR-3B/3BQ exceeds the prescribed limit. When such an intimation is received, the taxpayer must submit a response in Part B. As explained by the GST Portal, failure to submit the Part B response can restrict filing of GSTR-1/IFF for the subsequent tax period. Not every unmatched invoice or reconciliation difference automatically triggers DRC-01C, and receiving an intimation does not automatically establish fraud or impose an automatic penalty—it is a return-compliance intimation requiring reconciliation and a Part B explanation or payment where applicable. Conversely, failing to spot invoices present in GSTR-2B but missing from your client’s purchase books can leave eligible ITC unrecorded.',
        ],
        externalSources: [
          {
            label: 'GST Portal guide to DRC-01C return compliance',
            url: 'https://tutorial.gst.gov.in/userguide/returns/Manual_Return_Compliance_ITC.htm',
            sourceName: 'Official GST Portal (tutorial.gst.gov.in)',
          },
        ],
      },
      {
        heading: '2. Why Standard Excel VLOOKUPs Fail on GSTR-2B Data',
        paragraphs: [
          'When you run a simple exact-match VLOOKUP on `GSTIN + Invoice Number` in Excel, valid invoices can still appear unmatched because of different invoice-number formats, leading zeros, punctuation and spacing differences, supplier GSTIN inconsistencies, invoice-date and tax-value discrepancies, and different data formats between purchase registers and GSTR-2B. For example, a printed bill might read `Bill No: 00458/26-27`, whereas the supplier uploaded `458` or `458-26/27` in GSTR-1.',
        ],
        checklist: [
          'Step 1: Normalize both Books and 2B invoice numbers (uppercase, strip punctuation and leading zeros).',
          'Step 2: Match on Supplier GSTIN + Normalized Invoice Number and compare Taxable Value and Tax within a ₹1 tolerance.',
          'Step 3: Run a second pass on remaining unmatched items matching Supplier GSTIN + Invoice Date + Amount to catch probable invoice number typos.',
          'Step 4: Classify remaining items into "In Books but Not in GSTR-2B" and "In GSTR-2B but Not in Books".',
        ],
      },
      {
        heading: '3. Generating the 7-Sheet Excel Working Paper in CA Saarthi AI',
        paragraphs: [
          'Instead of building complex macros every month, open the GSTR-2B Reconciliation tab in CA Saarthi AI, upload your portal GSTR-2B JSON or Excel file, review the 6 status classifications (Matched, Amount Mismatch, Date Mismatch, Invoice Number Mismatch [Probable], In Books but Not in GSTR-2B, and In GSTR-2B but Not in Books), add audit notes, and click "Export Reconciliation Excel" to download a 7-sheet workbook containing Summary plus 6 status worksheets: Matched, Amount_Mismatch, Date_Mismatch, Inv_No_Mismatch, In_Books_Not_2B, and In_2B_Not_Books.',
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
    metaTitle: 'Find Duplicate Purchase Invoices Before GST | CA Saarthi AI',
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
          'Whenever you save a bill to the Master Sheet in CA Saarthi AI, the system checks `savedBills` for any existing record with the same normalized `invoiceNumber` and `shopName` / `sellerGstin`.',
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
        question: 'Does CA Saarthi AI also flag duplicates inside the CA Validation panel?',
        answer:
          'Yes. Even before clicking Save, the real-time CA Audit Engine checks your active draft against all saved bills in the current client workspace and shows a Duplicate Invoice alert.',
      },
    ],
  },
  {
    slug: 'automate-invoice-data-entry-ca-firms',
    path: '/blog/automate-invoice-data-entry-ca-firms',
    title: 'How to Automate Invoice Data Entry in a CA Firm: A Practical Step-by-Step Guide',
    metaTitle: 'Automate Invoice Data Entry for CA Firms | CA Saarthi AI',
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
    metaTitle: 'OCR for GST Invoices: Guide for Indian CAs | CA Saarthi AI',
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
          'CA Saarthi AI uses a multi-layered approach: for digital PDFs, it extracts exact X/Y coordinates from the PDF text layer and groups text fragments into horizontal baseline buckets. For scanned PDFs and camera images, it renders pages at 2.0x High-DPI, normalizes luminance contrast, and combines AI Vision with Tesseract PSM-4 column segmentation.',
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
    metaTitle: 'Convert Purchase Bills to Excel for CAs | CA Saarthi AI',
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
    metaTitle: '7 Manual Invoice Entry Errors in CA Firms | CA Saarthi AI',
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
          'CA Saarthi AI runs deterministic validation rules on every extracted invoice—highlighting invalid GSTIN formats, duplicate invoice numbers, and tax math variances before you export your sheet.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How does duplicate invoice detection work?',
        answer:
          'CA Saarthi AI compares the normalized Invoice Number and Seller GSTIN (or Supplier Name) against all bills already present in your active sheet and flags any collision immediately.',
      },
    ],
  },
  {
    slug: 'digital-document-workflow-chartered-accountants',
    path: '/blog/digital-document-workflow-chartered-accountants',
    title: 'Designing a Modern Digital Document Workflow for Chartered Accountants',
    metaTitle: 'Digital Document Workflow for CA Firms | CA Saarthi AI',
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
    metaTitle: 'Mandatory GST Invoice Fields (Rule 46) | CA Saarthi AI',
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
        heading: '2. Automating Rule 46 Field Checks with CA Saarthi AI',
        paragraphs: [
          'Instead of visually hunting for each of these fields across different invoice templates, CA Saarthi AI extracts them into dedicated fields and highlights missing mandatory GST attributes automatically.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What if a vendor invoice is missing the Seller GSTIN?',
        answer:
          'CA Saarthi AI flags "Seller GSTIN" in the Missing Mandatory Fields badge so your audit team can classify it as an unregistered B2C purchase.',
      },
    ],
  },
  {
    slug: 'ai-document-processing-for-tax-consultants',
    path: '/blog/ai-document-processing-for-tax-consultants',
    title: 'AI Document Processing for Tax Consultants: Practical Use Cases & Safeguards',
    metaTitle: 'AI Document Processing for Tax Consultants | CA Saarthi AI',
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
          'CA Saarthi AI combines both: intelligent extraction followed by strict mathematical and regulatory validation.',
        ],
      },
      {
        heading: '2. Human-in-the-Loop Control for Tax Practitioners',
        paragraphs: [
          'Every field extracted by CA Saarthi AI remains transparently editable alongside the original document image and verbatim raw text.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What happens if an invoice has unusual custom columns like Batch No or Expiry Date?',
        answer:
          'CA Saarthi AI automatically discovers dynamic extra columns and includes them in your selectable column list.',
      },
    ],
  },
  {
    slug: 'organize-client-bills-monthly-gst-compliance',
    path: '/blog/organize-client-bills-monthly-gst-compliance',
    title: 'How to Organize Client Bills for Stress-Free Monthly GST Compliance',
    metaTitle: 'Organize Client Bills for Monthly GST | CA Saarthi AI',
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
          'Instead of matching 200 individual bills one by one against the portal, switch to CA Saarthi AI’s Supplier-Wise Summary view first. If a vendor’s total invoice count and total GST match the portal summary, you can approve that vendor’s batch immediately and focus only on vendors with discrepancies.',
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

export function normalizeBlogPathname(rawPathname: string): string {
  const pathOnly = rawPathname.split('?')[0].split('#')[0] || '/';
  const collapsed = pathOnly.replace(/\/+/g, '/');
  if (collapsed.length > 1 && collapsed.endsWith('/')) {
    return collapsed.slice(0, -1).toLowerCase();
  }
  return (collapsed || '/').toLowerCase();
}

export function findBlogArticleByPath(pathname: string): ResourceArticleSpec | undefined {
  const clean = normalizeBlogPathname(pathname);
  return RESOURCE_ARTICLES.find(
    (a) => a.path === clean || `/blog/${a.slug}` === clean || `/resources/${a.slug}` === clean
  );
}

export function isBlogRoutePath(pathname: string): boolean {
  const clean = normalizeBlogPathname(pathname);
  if (clean === '/blog' || clean === '/resources') return true;
  if (clean.startsWith('/blog/') || clean.startsWith('/resources/')) {
    return Boolean(findBlogArticleByPath(clean));
  }
  return false;
}

export function getCanonicalBlogPath(pathname: string): string {
  const clean = normalizeBlogPathname(pathname);
  if (clean === '/resources') return '/blog';
  const article = findBlogArticleByPath(clean);
  if (article) return article.path;
  return clean;
}

export function syncBlogDocumentSeoTags(pathname: string): void {
  if (typeof document === 'undefined') return;
  const canonicalPath = getCanonicalBlogPath(pathname);
  const article = findBlogArticleByPath(canonicalPath);

  const canonicalUrl = `${SITE_DOMAIN}${canonicalPath}`;
  const title = article
    ? article.metaTitle
    : 'GST & TallyPrime Guides for CA Firms | CA Saarthi AI';
  const description = article
    ? article.metaDescription
    : 'Step-by-step guides and tutorials for Indian CA firms on GST invoice OCR, TallyPrime XML voucher import, and GSTR-2B reconciliation. Read guides.';

  document.title = title;
  document.documentElement.lang = 'en-IN';

  const setMetaTag = (
    selector: string,
    attrName: 'name' | 'property',
    attrValue: string,
    content: string
  ) => {
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaTag('meta[name="description"]', 'name', 'description', description);
  setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow');
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', article ? 'article' : 'website');
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

  const graph: Array<Record<string, unknown>> = [
    {
      '@type': 'Organization',
      '@id': `${SITE_DOMAIN}/#organization`,
      name: BRAND_NAME,
      url: `${SITE_DOMAIN}/`,
      logo: { '@type': 'ImageObject', url: `${SITE_DOMAIN}/ca-saarthi-icon.svg` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: article
        ? [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_DOMAIN}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_DOMAIN}/blog` },
            { '@type': 'ListItem', position: 3, name: article.title, item: canonicalUrl },
          ]
        : [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_DOMAIN}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: canonicalUrl },
          ],
    },
  ];

  if (article) {
    graph.push({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.metaDescription,
      image: DEFAULT_OG_IMAGE,
      datePublished: article.publishedDate,
      dateModified: article.modifiedDate || article.publishedDate,
      author: {
        '@type': 'Organization',
        '@id': `${SITE_DOMAIN}/#organization`,
        name: DEFAULT_CA_AUTHOR.name,
        url: DEFAULT_CA_AUTHOR.url,
      },
      publisher: { '@id': `${SITE_DOMAIN}/#organization` },
      mainEntityOfPage: canonicalUrl,
    });
    if (article.faqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      });
    }
  }

  let jsonLdScript = document.getElementById('ledgersutra-jsonld') as HTMLScriptElement | null;
  if (!jsonLdScript) {
    jsonLdScript = document.createElement('script');
    jsonLdScript.id = 'ledgersutra-jsonld';
    jsonLdScript.type = 'application/ld+json';
    document.head.appendChild(jsonLdScript);
  }
  jsonLdScript.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}
