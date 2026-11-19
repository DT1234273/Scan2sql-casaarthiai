export const SITE_DOMAIN = 'https://www.casaarthiai.in';
export const BRAND_NAME = 'CA Saarthi AI';
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
      'Extraction accuracy depends on invoice print and scan quality (digital PDF vs. low-light WhatsApp photo). Rather than publishing fixed marketing percentages, CA Saarthi AI provides a built-in Accuracy Test tool where you can upload your own client invoices and a ground-truth Excel sheet to measure field-level accuracy on your real documents.',
  },
  {
    question: 'What document formats are supported?',
    answer:
      'CA Saarthi AI supports single-page and multi-page PDFs (both digital ERP PDFs and scanned PDFs), mobile camera photos (JPG, JPEG, PNG, WEBP), Bill of Entry import documents, and e-invoice QR images.',
  },
  {
    question: 'Does CA Saarthi AI work on handwritten or faded thermal invoices?',
    answer:
      'Accuracy depends on handwriting legibility and ink contrast. Printed, computer-generated, and clear thermal GST invoices extract reliably, while handwritten or heavily smudged bills are automatically flagged with a "Needs Review" status so your staff can verify fields side-by-side.',
  },
  {
    question: 'Is the XML export directly compatible with TallyPrime?',
    answer:
      'Yes. CA Saarthi AI generates TallyPrime-importable XML using the standard ENVELOPE > IMPORTDATA > Vouchers schema with configurable Purchase, CGST, SGST, IGST, and Round-Off ledger names, plus an option to auto-create missing supplier ledgers.',
  },
  {
    question: 'How does the GSTR-2B reconciliation engine work?',
    answer:
      'Upload the GSTR-2B JSON or Excel file downloaded from the GST portal. CA Saarthi AI matches portal B2B invoices against your scanned purchase register by Supplier GSTIN and normalized invoice number, then falls back to fuzzy amount + date matching with a configurable tolerance (default ₹1).',
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

export const HOMEPAGE_FAQS_HI: FaqItem[] = [
  {
    question: 'भारतीय GST इनवॉइस पर डेटा एक्सट्रैक्शन की सटीकता (accuracy) क्या है?',
    answer:
      'एक्सट्रैक्शन की सटीकता इनवॉइस के प्रिंट और स्कैन की गुणवत्ता (डिजिटल PDF बनाम कम रोशनी वाला WhatsApp फोटो) पर निर्भर करती है। काल्पनिक मार्केटिंग प्रतिशत का दावा करने के बजाय, CA Saarthi AI में एक इन-बिल्ट Accuracy Test टूल दिया गया है जहाँ आप अपने क्लाइंट इनवॉइस और ग्राउंड-ट्रूथ Excel शीट अपलोड करके वास्तविक दस्तावेज़ों पर फ़ील्ड-स्तरीय सटीकता माप सकते हैं।',
  },
  {
    question: 'कौन-कौन से दस्तावेज़ फ़ॉर्मेट समर्थित हैं?',
    answer:
      'CA Saarthi AI सिंगल-पेज और मल्टी-पेज PDF (डिजिटल ERP PDF और स्कैन किए गए PDF दोनों), मोबाइल कैमरा फोटो (JPG, JPEG, PNG, WEBP), Bill of Entry इम्पोर्ट दस्तावेज़ और ई-इनवॉइस QR इमेज को सपोर्ट करता है।',
  },
  {
    question: 'क्या CA Saarthi AI हस्तलिखित (handwritten) या हल्के थर्मल बिलों पर काम करता है?',
    answer:
      'सटीकता लिखावट की स्पष्टता और स्याही के कंट्रास्ट पर निर्भर करती है। प्रिंटेड, कंप्यूटर-जनित और स्पष्ट थर्मल GST इनवॉइस से डेटा विश्वसनीय रूप से निकलता है, जबकि हस्तलिखित या धुंधले बिलों को स्वचालित रूप से "Needs Review" (समीक्षा आवश्यक) स्थिति में चिह्नित किया जाता है ताकि आपका स्टाफ साइड-बाय-साइड फ़ील्ड्स की जांच कर सके।',
  },
  {
    question: 'क्या XML एक्सपोर्ट सीधे TallyPrime के साथ संगत (compatible) है?',
    answer:
      'हाँ। CA Saarthi AI मानक ENVELOPE > IMPORTDATA > Vouchers स्कीमा का उपयोग करके TallyPrime-इम्पोर्ट योग्य XML तैयार करता है, जिसमें Purchase, CGST, SGST, IGST और Round-Off लेजर नाम कॉन्फ़िगर किए जा सकते हैं और नए सप्लायर लेजर ऑटो-क्रिएट करने का विकल्प भी शामिल है।',
  },
  {
    question: 'GSTR-2B रिकन्सिलिएशन इंजन कैसे काम करता है?',
    answer:
      'GST पोर्टल से डाउनलोड की गई GSTR-2B JSON या Excel फ़ाइल अपलोड करें। CA Saarthi AI पोर्टल के B2B इनवॉइस का आपके स्कैन किए गए परचेस रजिस्टर से Supplier GSTIN और नॉर्मलाइज़्ड इनवॉइस नंबर के आधार पर मिलान करता है, और इसके बाद कॉन्फ़िगर करने योग्य टॉलरेंस (डिफ़ॉल्ट ₹1) के साथ राशि + तिथि मिलान (fuzzy matching) का उपयोग करता है।',
  },
  {
    question: 'क्लाइंट का वित्तीय डेटा कैसे सुरक्षित और संग्रहीत किया जाता है?',
    answer:
      'प्रमाणीकरण (Authentication) के लिए Firebase Authentication के माध्यम से Google Sign-In का उपयोग होता है। सभी क्लाइंट वर्कस्पेस, बिल और ऑडिट लॉग HTTPS एन्क्रिप्शन के साथ Firestore में प्रत्येक प्रमाणित उपयोगकर्ता के लिए अलग-अलग (isolated) रखे जाते हैं। आप किसी भी समय कोई भी क्लाइंट वर्कस्पेस या अपना पूरा खाता डेटा हटा सकते हैं।',
  },
  {
    question: 'प्राइसिंग प्लान क्या हैं और क्या CA फर्मों के लिए पायलट उपलब्ध है?',
    answer:
      'हम तीन संरचित प्रैक्टिस प्लान प्रदान करते हैं: Starter / Trial (₹0 / माह), CA Practice Pro (₹1,499 / माह), और Firm / Enterprise (₹3,999 / माह)। पायलट फर्मों के लिए अर्ली-एक्सेस प्राइसिंग उपलब्ध है।',
  },
  {
    question: 'एक बैच में मैं कितने इनवॉइस अपलोड कर सकता हूँ?',
    answer:
      'बैच प्रोसेसिंग क्यू (queue) के माध्यम से आप दर्जनों PDF और इमेज बिल एक साथ चुन सकते हैं और बिना ब्राउज़र रीलोड किए प्रति-फ़ाइल प्रोग्रेस बार, रीट्राई कंट्रोल और ऑटोमैटिक Master Sheet इंसर्शन के साथ उन्हें क्रमवार प्रोसेस कर सकते हैं।',
  },
  {
    question: 'क्या मैं अपनी CA प्रैक्टिस के लिए कई क्लाइंट्स को अलग-अलग मैनेज कर सकता हूँ?',
    answer:
      'हाँ। आप अलग-अलग क्लाइंट प्रोफ़ाइल (नाम, GSTIN, PAN, वित्तीय वर्ष, नोट्स) बना सकते हैं और हेडर से क्लाइंट्स के बीच स्विच कर सकते हैं। सभी स्कैनिंग, Master Sheet व्यू, GSTR-2B रिकन्सिलिएशन और TallyPrime XML एक्सपोर्ट सक्रिय क्लाइंट तक ही सीमित रहते हैं।',
  },
  {
    question: 'क्या आप टीम एक्सेस और मेकर-चेकर (maker-checker) अप्रूवल वर्कफ़्लो सपोर्ट करते हैं?',
    answer:
      'हाँ। फर्म ओनर्स Owner/CA, Reviewer और Staff (केवल अपलोड) भूमिकाएं निर्धारित कर सकते हैं। स्टाफ बिल स्कैन करके समीक्षा के लिए सबमिट कर सकता है, जबकि केवल Owners और Reviewers ही प्रति-बिल ऑडिट ट्रेल के साथ बिलों को Approved या Rejected मार्क कर सकते हैं।',
  },
  {
    question: 'क्या हमारे अपने ERP या प्रैक्टिस टूल में इनवॉइस एक्सट्रैक्शन जोड़ने के लिए API उपलब्ध है?',
    answer:
      'हाँ। आप Settings > API में SHA-256 हैश्ड API कुंजी (keys) जनरेट कर सकते हैं और मल्टीपार्ट इनवॉइस फ़ाइल के साथ POST /api/v1/extract को कॉल करके संरचित JSON प्राप्त कर सकते हैं।',
  },
  {
    question: 'कौन-कौन सी भाषाएं और सहायता (support) चैनल उपलब्ध हैं?',
    answer:
      'हमारा हाइब्रिड OCR पाइपलाइन क्षेत्रीय बिलों के लिए अंग्रेज़ी और देवनागरी हिंदी (eng+hin) का समर्थन करता है। सहायता और CA ऑनबोर्डिंग के लिए आप Contact पेज के माध्यम से हमसे संपर्क कर सकते हैं।',
  },
];

export const DEDICATED_SEO_PAGES: Record<string, SeoLandingPageSpec> = {
  '/invoice-ocr-for-ca': {
    slug: 'invoice-ocr-for-ca',
    path: '/invoice-ocr-for-ca',
    badge: 'Chartered Accountant OCR Workflow',
    h1: 'Invoice OCR Built for Indian CA Firms',
    subtitle:
      'Eliminate manual voucher typing during GST filing and tax audits. Extract supplier GSTIN, invoice numbers, HSN codes, and tax splits from scanned PDFs and mobile bill photos with built-in GSTIN checksum and tax math validation.',
    metaTitle: 'Invoice OCR Software for CA Firms in India | CA Saarthi AI',
    metaDescription:
      'Automate client purchase register creation with GST invoice OCR built for Indian CA firms. Extract GSTINs, HSN codes, and tax splits. Try OCR today.',
    primaryKeywords: [
      'invoice OCR for CA',
      'CA firm invoice automation India',
      'chartered accountant bill scanning software',
      'OCR software for tax consultants',
    ],
    problemStatement:
      'CA firms and article assistants spend significant time every month keying in paper bills, WhatsApp invoice photos, and multi-page PDF statements sent by clients right before the 11th and 20th GST filing deadlines.',
    workflowSteps: [
      {
        title: '1. Upload Client Invoice Batches',
        detail: 'Select multiple JPG, PNG, or multi-page PDF invoices received via email or WhatsApp.',
      },
      {
        title: '2. High-DPI Preprocessing & Hybrid OCR',
        detail:
          'CA Saarthi AI sharpens faint thermal ink, extracts PDF coordinate layers, and runs bilingual English + Hindi OCR.',
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
        title: 'Multi-Line Item Table Extraction',
        description:
          'Combines AI Vision extraction with coordinate-based table parsing to capture product and service rows across invoice tables for side-by-side CA review.',
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
        question: 'Can CA Saarthi AI handle WhatsApp photos of crumpled or shadowed client bills?',
        answer:
          'Yes. CA Saarthi AI applies automated luminance normalization and contrast stretching before running OCR, improving readability on mobile photos.',
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
    metaTitle: 'Automated GST Invoice Data Extraction | CA Saarthi AI',
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
        question: 'How does CA Saarthi AI distinguish between Seller GSTIN and Buyer GSTIN on an invoice?',
        answer:
          'The extraction engine analyzes document layout positions (top vendor header vs "Bill To / Buyer" block) so the supplier’s GSTIN is mapped to Seller GSTIN and the client’s GSTIN is mapped to Buyer GSTIN.',
      },
      {
        question: 'What happens if an invoice does not have a GSTIN?',
        answer:
          'CA Saarthi AI flags the bill as "Unregistered / B2C" in the CA Validation panel so your team knows ITC is not applicable on that voucher.',
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
    metaTitle: 'Convert PDF Invoices to Excel (.XLSX) | CA Saarthi AI',
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
          'PDF files store text as positioned graphics rather than spreadsheet cells. CA Saarthi AI reconstructs horizontal baselines using X/Y coordinate buckets and semantic field parsing so numbers land in the right columns.',
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
    metaTitle: 'Bulk Invoice Processing & Batch OCR | CA Saarthi AI',
    metaDescription:
      'Upload and process dozens of PDF and image GST invoices in bulk with per-file progress tracking and unified Excel or XML export. Try batch upload.',
    primaryKeywords: [
      'bulk invoice processing India',
      'batch bill scanner for CA',
      'merge multiple invoices to Excel',
      'high volume invoice data entry automation',
    ],
    problemStatement:
      'During peak compliance weeks between the 1st and 20th of every month, CA firms receive folders containing dozens or hundreds of mixed-format bills (PDFs, JPEGs, PNGs) that cannot be processed one-by-one with slow manual tools.',
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
          'Never. CA Saarthi AI is specifically architected for continuous multi-file and back-to-back uploads in the same workspace session.',
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
    metaTitle: 'Invoice Automation for Accountants | CA Saarthi AI',
    metaDescription:
      'Eliminate manual voucher entry for accountants and tax consultants with side-by-side OCR review, GST validation, and Excel export. Automate today.',
    primaryKeywords: [
      'invoice automation for accountants',
      'automated bookkeeping India',
      'accounting data entry automation software',
      'AI tool for tax consultants India',
    ],
    problemStatement:
      'Skilled accountants and tax professionals shouldn’t spend hours of their monthly compliance schedule manually typing invoice numbers and item descriptions from paper bills into spreadsheets.',
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
        question: 'Does CA Saarthi AI include built-in sample bills to test the workflow?',
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
      'Extract verbatim readable text and structured tables from scanned PDFs, tilted photos, and bilingual English + Hindi financial documents.',
    metaTitle: 'Document Scanning Software for CA Firms | CA Saarthi AI',
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
        title: 'Verbatim Text Output Box',
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
        question: 'Can I use CA Saarthi AI just to extract plain text from a PDF or image?',
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
    metaTitle: 'Convert GST Invoice to TallyPrime XML | CA Saarthi AI',
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
      'CA Saarthi AI eliminates repetitive voucher typing by combining hybrid OCR extraction with a purpose-built TallyPrime XML generator. When you upload a single bill or a batch of client invoices, CA Saarthi AI extracts the supplier name, Seller GSTIN, invoice number, invoice date, HSN/SAC line items, taxable subtotal, CGST, SGST, IGST, other charges, and round-off automatically.',
      'Before generating the XML file, CA Saarthi AI runs a deterministic Pre-Export Validation check. Any voucher with a missing invoice number, unrecognized date, invalid 15-digit GSTIN format/checksum, or tax math variance is flagged on the validation screen with a "Fix Now" link or an option to skip blocked bills. This ensures broken vouchers never pollute your client’s Tally company data.',
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
          'Open your client company in TallyPrime, press Alt + O (Import) > Vouchers, select the XML file exported from CA Saarthi AI, and press Enter.',
      },
      {
        question: 'What if a supplier ledger does not exist in TallyPrime yet?',
        answer:
          'Keep "Auto-create missing party ledgers" enabled in Tally Settings. CA Saarthi AI will include the LEDGER creation nodes under Sundry Creditors with the supplier GSTIN in the same XML file.',
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
    metaTitle: 'GSTR-2B Reconciliation in Excel — 6-Status Match | CA Saarthi AI',
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
      'CA Saarthi AI includes a dedicated GSTR-2B Reconciliation workspace designed specifically for Indian CA firms and GST practitioners. You can upload the official GSTR-2B JSON file or Excel workbook downloaded directly from the GST portal, and CA Saarthi AI parses the B2B supplier invoices (Supplier GSTIN, Trade Name, Invoice No, Date, Taxable Value, IGST, CGST, SGST, and ITC Availability).',
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
          'CA Saarthi AI normalizes punctuation and leading zeros automatically, and uses fuzzy matching on Supplier GSTIN + Amount + Date to flag probable Invoice Number Mismatches for one-click manual confirmation.',
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
    metaTitle: 'Bulk Invoice Processing for CA Firms | CA Saarthi AI',
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
      'CA Saarthi AI is built around a Client-Wise Workspace architecture (`/users/{uid}/clients/{clientId}`). From the header switcher, your team can create, edit, or archive client profiles—recording the client’s Legal Name, 15-digit GSTIN, PAN, and Financial Year. Every batch scan, Master Sheet view, GSTR-2B reconciliation, and Tally XML export operates exclusively on the active client.',
      'Inside the workspace, the dedicated Batch Invoice Upload & Processing Queue lets staff drag and drop multiple PDFs and images at once. Each file shows an individual progress bar (0%–100%), stage label, and extracted summary. If any invoice has low OCR confidence, a missing invoice number, an invalid GSTIN, or a tax mismatch, CA Saarthi AI automatically marks it with a "Needs Review" flag so reviewers can filter the Review Queue immediately.',
      'Furthermore, CA Saarthi AI supports role-based Team Access (Owner/CA, Reviewer, and Staff). Staff members can upload bills and submit them for review (`Pending Review`), while only Owners and Reviewers can mark bills as `Approved` or `Rejected` (with a recorded rejection reason and full timestamped audit trail). By default, only Approved bills flow into TallyPrime XML exports and GSTR-2B reconciliations.',
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
          'CA Saarthi AI detects matching Invoice Number and Shop Name combinations and presents a resolution modal to Merge Items, Overwrite the existing record, or Save as a duplicate.',
      },
    ],
  },
};

export const RESOURCE_ARTICLES: ResourceArticleSpec[] = [
  {
    slug: 'how-to-import-purchase-invoices-into-tallyprime-from-pdf',
    path: '/blog/how-to-import-purchase-invoices-into-tallyprime-from-pdf',
    title: 'How to Import Purchase Invoices into TallyPrime from PDF',
    metaTitle: 'How to Import Purchase Invoices into TallyPrime from PDF — CA Saarthi AI',
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
    metaTitle: 'GSTR-2B Reconciliation in Excel: Step by Step — CA Saarthi AI',
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
        heading: '3. Generating the 6-Sheet Excel Working Paper in CA Saarthi AI',
        paragraphs: [
          'Instead of building complex macros every month, open the GSTR-2B Reconciliation tab in CA Saarthi AI, upload your portal GSTR-2B JSON or Excel file, review the side-by-side differences, add audit notes, and click "Export Reconciliation Excel" to download a workbook with a Summary sheet and one sheet per status.',
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
    metaTitle: 'How to Find Duplicate Purchase Invoices Before Filing GST — CA Saarthi AI',
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
    metaTitle: 'How to Automate Invoice Data Entry in a CA Firm: A Practical Step-by-Step Guide — CA Saarthi AI',
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
    metaTitle: 'OCR for GST Invoices: Complete Technical & Compliance Guide for Indian Accountants — CA Saarthi AI',
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
    metaTitle: 'How to Convert Client Purchase Bills into Clean Excel Sheets for Accounting — CA Saarthi AI',
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
    metaTitle: '7 Costly Errors in Manual Invoice Data Entry (And How CA Firms Prevent Them) — CA Saarthi AI',
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
    metaTitle: 'Designing a Modern Digital Document Workflow for Chartered Accountants — CA Saarthi AI',
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
    metaTitle: 'Mandatory GST Invoice Fields Checklist: What Every CA Must Verify Under Rule 46 — CA Saarthi AI',
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
    metaTitle: 'AI Document Processing for Tax Consultants: Practical Use Cases & Safeguards — CA Saarthi AI',
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
    metaTitle: 'How to Organize Client Bills for Stress-Free Monthly GST Compliance — CA Saarthi AI',
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

export const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/og-default.png`;
export const DEFAULT_OG_IMAGE_ALT =
  'CA Saarthi AI — GST Invoice OCR, TallyPrime XML Export & GSTR-2B Reconciliation for Indian CA Firms';

export const DEFAULT_CA_AUTHOR = {
  name: 'CA Saarthi AI Editorial Team',
  credentials: 'GST & Accounting Workflow Documentation Team',
  bio: 'Maintained by the CA Saarthi AI product and tax-automation engineering team for Indian CA practices.',
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
    title: 'भारतीय CA फर्मों के लिए GST इनवॉइस OCR सॉफ्टवेयर | CA Saarthi AI',
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
    title: 'GST इनवॉइस OCR फीचर्स — GSTIN सत्यापन और द्विभाषी OCR | CA Saarthi AI',
    h1: 'भारतीय GST प्रैक्टिस वर्कफ़्लो के लिए निर्मित फीचर्स',
    subtitle:
      '15-अंकीय GSTIN Mod-36 चेकसम ऑडिट, द्विभाषी बिल स्कैनिंग, मल्टी-क्लाइंट वर्कस्पेस और मेकर-चेकर टीम अप्रूवल।',
    description:
      'भारतीय चार्टर्ड अकाउंटेंट्स के लिए CA Saarthi AI के फीचर्स: Mod-36 GSTIN जांच, TallyPrime XML एक्सपोर्ट, GSTR-2B मिलान और बैच इनवॉइस स्कैनिंग। फीचर्स देखें।',
    breadcrumbName: 'फीचर्स (Hindi)',
  },
  '/hi/pricing': {
    enPath: '/pricing',
    hiPath: '/hi/pricing',
    title: 'प्राइसिंग — CA फर्मों के लिए GST इनवॉइस OCR प्लान | CA Saarthi AI',
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
    title: 'GST इनवॉइस को TallyPrime XML में बदलें | CA Saarthi AI',
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
    title: 'Excel में GSTR-2B रिकन्सिलिएशन — 6-स्टेटस मिलान | CA Saarthi AI',
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
    title: 'PDF इनवॉइस को Excel (.XLSX) में बदलें | CA Saarthi AI',
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
    title: 'GST Invoice OCR Software for Indian CA Firms | CA Saarthi AI',
    h1: 'GST Invoice OCR & Data Entry Automation for Indian CA Firms',
    description:
      'Automate GST invoice OCR, 15-digit GSTIN validation, GSTR-2B reconciliation, and TallyPrime XML exports for CA firms. Try the live workspace today.',
    breadcrumbName: 'Home',
  },
  '/app': {
    title: 'CA Invoice OCR, Tally XML & GSTR-2B Workspace | CA Saarthi AI',
    h1: 'CA Saarthi AI Live Invoice OCR, GST Audit & Tally Command Center',
    description:
      'Upload PDF or image invoices, extract GST fields, validate 15-digit GSTINs, reconcile GSTR-2B, and export TallyPrime XML, Excel, or Zoho CSV. Open now.',
    breadcrumbName: 'Workspace',
  },
  '/features': {
    title: 'GST Invoice OCR Features — GSTIN Validation & Bilingual OCR | CA Saarthi AI',
    h1: 'Features Built for Indian GST Practice Workflows',
    description:
      'Explore 15-digit GSTIN Mod-36 checksum validation, English + Hindi invoice OCR, GSTR-2B matching, and TallyPrime XML export. Explore features today.',
    breadcrumbName: 'Features',
  },
  '/how-it-works': {
    title: 'How CA Saarthi AI Automates GST Invoice Entry | CA Saarthi AI',
    h1: 'From Client Invoice Folder to Tally Sign-Off',
    description:
      'See how Indian CA firms upload client PDF and image bills, validate GSTINs and tax splits, and export to TallyPrime XML or Excel. Start a pilot.',
    breadcrumbName: 'How It Works',
  },
  '/pricing': {
    title: 'Pricing — GST Invoice OCR Plans for CA Firms | CA Saarthi AI',
    h1: 'Plans for Solo Practitioners & Multi-Partner CA Firms',
    description:
      'Compare transparent plans for solo practitioners and multi-partner CA firms with multi-client workspaces and TallyPrime XML export. View plans now.',
    breadcrumbName: 'Pricing',
  },
  '/faq': {
    title: 'GST Invoice OCR FAQ for Indian CA Firms | CA Saarthi AI',
    h1: 'Questions from Chartered Accountants & Tax Teams',
    description:
      'Read answers on TallyPrime XML voucher import, GSTR-2B JSON/Excel reconciliation, bilingual OCR, and client data isolation. Browse CA answers today.',
    breadcrumbName: 'FAQ',
  },
  '/security': {
    title: 'Security & Data Isolation for Client Records | CA Saarthi AI',
    h1: 'Security & Data Isolation for Client Records',
    description:
      'Learn how CA Saarthi AI protects client financial records with client-wise workspace isolation, RBAC rules, and instant deletion. Review security now.',
    breadcrumbName: 'Security',
  },
  '/privacy': {
    title: 'Privacy Policy — Client Data & OCR Processing | CA Saarthi AI',
    h1: 'Privacy Policy for Chartered Accountant & Client Financial Data',
    description:
      "Read CA Saarthi AI's privacy policy covering in-memory cloud OCR, local browser fallback OCR, client-scoped Firestore storage, and one-click data deletion.",
    breadcrumbName: 'Privacy Policy',
  },
  '/terms': {
    title: 'Terms of Service — GST OCR & Tally XML Platform | CA Saarthi AI',
    h1: 'Terms of Service for CA Saarthi AI CA Practice Software',
    description:
      "Review the terms of service governing CA Saarthi AI's GST invoice OCR workspace, TallyPrime XML export, GSTR-2B reconciliation, and developer API.",
    breadcrumbName: 'Terms of Service',
  },
  '/data-deletion': {
    title: 'Data Deletion Policy — Instant Record Removal | CA Saarthi AI',
    h1: 'Data Deletion Policy & Workspace Purge Controls',
    description:
      'How to permanently delete individual purchase bills, client workspaces, or your entire CA Saarthi AI Cloud Firestore and local browser records.',
    breadcrumbName: 'Data Deletion Policy',
  },
  '/blog': {
    title: 'GST & TallyPrime Guides for CA Firms | CA Saarthi AI',
    h1: 'GST & TallyPrime Guides for CA Firms',
    description:
      'Step-by-step guides and tutorials for Indian CA firms on GST invoice OCR, TallyPrime XML voucher import, and GSTR-2B reconciliation. Read guides.',
    breadcrumbName: 'Blog',
  },
  '/api-docs': {
    title: 'Invoice OCR REST API Documentation | CA Saarthi AI',
    h1: 'Invoice Extraction REST API (v1)',
    description:
      'Integrate GST invoice OCR, 15-digit GSTIN validation, and structured line-item JSON extraction into your accounting tools. Read the API docs now.',
    breadcrumbName: 'API Docs',
  },
  '/about': {
    title: 'About CA Saarthi AI — Built for Indian CA Firms',
    h1: 'Built for Indian Chartered Accountants',
    description:
      'Discover why CA Saarthi AI built specialized GST invoice OCR, GSTR-2B reconciliation, and TallyPrime automation for Indian CA firms. Learn more today.',
    breadcrumbName: 'About',
  },
  '/contact': {
    title: 'Contact & Book a Demo | CA Saarthi AI',
    h1: 'Contact & Book a Demo',
    description:
      'Schedule a live walkthrough of CA Saarthi AI GST invoice OCR, TallyPrime XML import, and GSTR-2B reconciliation for your CA firm. Book a demo today.',
    breadcrumbName: 'Contact',
  },
};

/**
 * Legacy or duplicate routes that have an exact, relevant replacement in CA Saarthi AI.
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
      pageFaqs = HOMEPAGE_FAQS_HI;
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
    const isHindiPage = cleanPath === '/hi' || cleanPath.startsWith('/hi/') || Boolean(hindiSpec);
    graph.push({
      '@type': 'SoftwareApplication',
      name: BRAND_NAME,
      operatingSystem: 'Web',
      applicationCategory: 'BusinessApplication',
      inLanguage: isHindiPage ? 'hi-IN' : 'en-IN',
      description: isHindiPage
        ? 'भारतीय चार्टर्ड अकाउंटेंट्स (CA) और टैक्स प्रैक्टिशनर्स के लिए निर्मित द्विभाषी (अंग्रेज़ी + हिंदी) GST इनवॉइस OCR, 15-अंकीय GSTIN सत्यापन, TallyPrime XML एक्सपोर्ट और GSTR-2B रिकन्सिलिएशन सॉफ्टवेयर।'
        : 'AI-powered bilingual GST invoice OCR, TallyPrime XML export, and GSTR-2B reconciliation software designed specifically for Indian Chartered Accountants.',
      url: isHindiPage ? `${SITE_DOMAIN}/hi` : `${SITE_DOMAIN}/`,
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

export interface PracticePricingPlanSpec {
  id: string;
  tier: string;
  name: string;
  price: string;
  subtitle: string;
  audience: string;
  highlighted: boolean;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
}

export const PRACTICE_PRICING_PLANS: PracticePricingPlanSpec[] = [
  {
    id: 'starter',
    tier: 'For Evaluating Workflows · Starter / Trial',
    name: 'Starter / Trial',
    price: '₹0 / month',
    subtitle: 'For testing OCR, GSTIN validation & Tally XML export structure',
    audience: 'Individual accountants & CA practitioners evaluating invoice OCR on sample or real bills',
    highlighted: false,
    ctaLabel: 'Start Free Trial in Workspace',
    ctaHref: '/app',
    features: [
      '3 no-login demo scans/day + free workspace trial',
      'Single & batch invoice upload queue',
      'TallyPrime XML & Excel (.xlsx) export',
      '1 Default Client workspace',
    ],
  },
  {
    id: 'pro',
    tier: 'For Solo CAs & Tax Consultants · CA Practice Pro',
    name: 'CA Practice Pro',
    price: '₹1,499 / month',
    subtitle: 'For independent CAs & GST practitioners filing monthly returns',
    audience: 'Solo Chartered Accountants and GST practitioners managing multiple monthly retainer clients',
    highlighted: true,
    ctaLabel: 'Request CA-Firm Pilot Offer',
    ctaHref: '/contact',
    features: [
      'Up to 25 Client-Wise Workspaces',
      'Full GSTR-2B JSON & Excel Reconciliation',
      'Zoho Books CSV & Busy Excel exports',
      'Extended E-Invoice, IRN & Bank field extraction',
    ],
  },
  {
    id: 'enterprise',
    tier: 'For Multi-Partner Audit Firms · Firm / Enterprise',
    name: 'Firm / Enterprise',
    price: '₹3,999 / month',
    subtitle: 'For multi-partner CA firms with articles & reviewer workflows',
    audience: 'Multi-partner CA firms requiring maker-checker review queues, role permissions, and API access',
    highlighted: false,
    ctaLabel: 'Request CA-Firm Pilot Offer',
    ctaHref: '/contact',
    features: [
      'Unlimited Client Workspaces',
      'Team Access RBAC (Owner/CA, Reviewer, Staff)',
      'Bill approval workflow & immutable audit trail',
      'Developer REST API (POST /api/v1/extract)',
    ],
  },
];

export const PRACTICE_PRICING_PLANS_HI: PracticePricingPlanSpec[] = [
  {
    id: 'starter',
    tier: 'वर्कफ़्लो मूल्यांकन के लिए · Starter / Trial',
    name: 'Starter / Trial',
    price: '₹0 / माह',
    subtitle: 'OCR, GSTIN सत्यापन और TallyPrime XML एक्सपोर्ट संरचना के परीक्षण के लिए',
    audience: 'सैंपल या वास्तविक बिलों पर इनवॉइस OCR का परीक्षण करने वाले अकाउंटेंट्स और CA प्रैक्टिशनर्स',
    highlighted: false,
    ctaLabel: 'वर्कस्पेस में मुफ़्त ट्रायल शुरू करें',
    ctaHref: '/app',
    features: [
      'प्रतिदिन 3 बिना-लॉगिन डेमो स्कैन + मुफ़्त वर्कस्पेस ट्रायल',
      'सिंगल और बैच इनवॉइस अपलोड क्यू (Queue)',
      'TallyPrime XML और Excel (.xlsx) एक्सपोर्ट',
      '1 डिफ़ॉल्ट क्लाइंट वर्कस्पेस',
    ],
  },
  {
    id: 'pro',
    tier: 'सोलो CA और टैक्स कंसल्टेंट्स के लिए · CA Practice Pro',
    name: 'CA Practice Pro',
    price: '₹1,499 / माह',
    subtitle: 'मासिक रिटर्न फाइल करने वाले स्वतंत्र CA और GST प्रैक्टिशनर्स के लिए',
    audience: 'कई मासिक रिटेनर क्लाइंट्स को संभालने वाले स्वतंत्र चार्टर्ड अकाउंटेंट्स और GST प्रैक्टिशनर्स',
    highlighted: true,
    ctaLabel: 'CA-फर्म पायलट ऑफ़र का अनुरोध करें',
    ctaHref: '/contact',
    features: [
      '25 तक क्लाइंट-वाइज़ वर्कस्पेस',
      'पूर्ण GSTR-2B JSON और Excel रिकन्सिलिएशन',
      'Zoho Books CSV और Busy Excel एक्सपोर्ट',
      'विस्तृत E-Invoice, IRN और बैंक फ़ील्ड एक्सट्रैक्शन',
    ],
  },
  {
    id: 'enterprise',
    tier: 'मल्टी-पार्टनर ऑडिट फर्मों के लिए · Firm / Enterprise',
    name: 'Firm / Enterprise',
    price: '₹3,999 / माह',
    subtitle: 'आर्टिकल्स और रिव्यूअर वर्कफ़्लो वाली मल्टी-पार्टनर CA फर्मों के लिए',
    audience: 'मेकर-चेकर रिव्यू क्यू, रोल अनुमतियों (RBAC) और API एक्सेस की आवश्यकता वाली मल्टी-पार्टनर CA फर्में',
    highlighted: false,
    ctaLabel: 'CA-फर्म पायलट ऑफ़र का अनुरोध करें',
    ctaHref: '/contact',
    features: [
      'असीमित (Unlimited) क्लाइंट वर्कस्पेस',
      'टीम एक्सेस RBAC (Owner/CA, Reviewer, Staff)',
      'बिल अप्रूवल वर्कफ़्लो और ऑडिट ट्रेल',
      'डेवलपर REST API (POST /api/v1/extract)',
    ],
  },
];

export interface DetailedFeatureSectionSpec {
  id: string;
  number: string;
  title: string;
  badge: string;
  whatItDoes: string;
  inputAccepted: string;
  outputProduced: string;
  whatCaNeedsToReview: string;
  limitations: string;
  linkHref: string;
  linkLabel: string;
}

export const DETAILED_FEATURES_SPECS: DetailedFeatureSectionSpec[] = [
  {
    id: 'bilingual-ocr',
    number: '01',
    title: 'Bilingual English and Hindi OCR (eng+hin)',
    badge: 'Hybrid Vision + Coordinate + Tesseract OCR',
    whatItDoes:
      'Extracts verbatim text and structured accounting fields from English and Devanagari Hindi invoices. For digital PDFs, it reconstructs horizontal table lines using PDF.js X/Y coordinates; for scanned PDFs and camera photos, it applies 2.0x High-DPI canvas contrast normalization and runs cloud AI Vision with an automatic in-browser Tesseract.js (eng+hin, PSM-4) fallback.',
    inputAccepted:
      'Single-page and multi-page PDFs (digital ERP PDFs or scanned image PDFs) and mobile camera images (JPG, JPEG, PNG, WEBP).',
    outputProduced:
      'Complete page-by-page verbatim text transcript (.txt and Excel Sheet 2) alongside structured invoice header and line-item fields.',
    whatCaNeedsToReview:
      'Handwritten notes, faded thermal ink, or regional Hindi product names on bills where the OCR confidence score is below 80%.',
    limitations:
      'Extraction quality depends on document legibility and lighting; multi-page visual rendering processes up to 5 pages per scan pass.',
    linkHref: '/document-scanning-software',
    linkLabel: 'Explore Document Scanning & Bilingual OCR →',
  },
  {
    id: 'gstin-validation',
    number: '02',
    title: '15-Digit GSTIN Structure & Mod-36 Checksum Validation',
    badge: 'Deterministic GST Audit Rules',
    whatItDoes:
      'Validates both Seller GSTIN and Buyer GSTIN against the official 15-character format (2-digit State Code + 10-character PAN + Entity Code + Z + Mod-36 Check Digit), maps all 37 Indian GST State and Union Territory codes (01 to 38), derives the supplier PAN and taxpayer constitution, and checks whether Seller GSTIN mistakenly matches Buyer GSTIN.',
    inputAccepted:
      'Extracted or manually entered 15-character GSTIN strings on bills, or direct check requests via the workspace GSTIN Verifier (/api/gstin/verify).',
    outputProduced:
      'Checksum Pass/Fail status, expected 15th check character when a typo is detected, mapped State Name, embedded PAN, and B2B vs. Unregistered/B2C classification.',
    whatCaNeedsToReview:
      'Invoices flagged for Mod-36 checksum mismatch (common when OCR or vendor print confuses 0/O, 1/I, 5/S, or 8/B) or bills missing a supplier GSTIN.',
    limitations:
      'Unless an external upstream portal API URL and key are configured on the server, verification validates mathematical Mod-36 checksum structure, state code, and PAN format rather than live GST portal filing status.',
    linkHref: '/gst-invoice-data-extraction',
    linkLabel: 'Explore GST Invoice Data Extraction →',
  },
  {
    id: 'header-line-items',
    number: '03',
    title: 'Invoice Header, E-Invoice & Line-Item Extraction',
    badge: '30+ Accounting, Tax & BOE Fields',
    whatItDoes:
      'Captures supplier and buyer details, invoice number, invoice and due dates, Place of Supply, 64-character e-Invoice IRN, 12-digit e-Way Bill number, PO number, bank account/IFSC details, Customs Bill of Entry (BOE) fields, and individual product/service rows (HSN/SAC, Qty, UOM, Rate, Discount, Taxable Value, GST %, CGST, SGST, IGST, Line Total). Runs a real-time tax math check verifying that Taxable + CGST + SGST + IGST - Discount + Other Charges + Round-Off equals Grand Total.',
    inputAccepted:
      'B2B tax invoices, retail receipts, bills of supply, credit notes, import Bills of Entry, and e-invoice/UPI QR codes.',
    outputProduced:
      'Interactive side-by-side visual preview and editable voucher form with automatic tax math discrepancy alerts (flagged when variance exceeds ₹1.50).',
    whatCaNeedsToReview:
      'Line-item HSN/SAC codes, intra-state (CGST + SGST) vs. inter-state (IGST) tax allocation, and any voucher marked "Needs Review" due to tax math variance.',
    limitations:
      'Non-standard multi-tier trade discounts, composite TCS/TDS lines, or handwritten total overrides may require manual adjustment in the side-by-side editor.',
    linkHref: '/invoice-ocr-for-ca',
    linkLabel: 'Explore Invoice OCR for CA Firms →',
  },
  {
    id: 'duplicate-detection',
    number: '04',
    title: 'Duplicate Invoice Detection & Resolution',
    badge: 'Double-ITC Prevention Control',
    whatItDoes:
      'Checks every newly scanned or edited invoice against all saved bills in the active client workspace by comparing normalized Invoice Number and Supplier GSTIN / Shop Name before inserting into the register.',
    inputAccepted:
      'Active invoice draft or queued batch bill being saved to a client’s Master Sheet.',
    outputProduced:
      'Real-time duplicate warning badge in the CA Validation panel and an interactive resolution modal with 3 options: Merge Line Items, Overwrite Existing Record, or Save as Separate Entry.',
    whatCaNeedsToReview:
      'Whether a flagged collision is an accidental duplicate upload (e.g., WhatsApp photo plus email PDF of the same bill), a multi-page invoice that should be merged, or two unrelated vendors sharing a generic bill number.',
    limitations:
      'Duplicate checks operate within the currently selected client workspace and match on normalized invoice number and party identifiers.',
    linkHref: '/blog/how-to-find-duplicate-purchase-invoices-before-filing-gst',
    linkLabel: 'Read Duplicate Invoice Prevention Guide →',
  },
  {
    id: 'batch-processing',
    number: '05',
    title: 'Batch Invoice Upload & Processing Queue',
    badge: 'Multi-File Sequential Pipeline',
    whatItDoes:
      'Queues multiple PDF and image bills in a single upload action, processes each document sequentially with canvas memory cleanup and AbortController safeguards, displays per-file progress bars (0%–100%), and appends completed records directly into the client Master Sheet.',
    inputAccepted:
      'Multiple PDF, JPG, PNG, and WEBP invoice files selected together from a client folder.',
    outputProduced:
      'Consolidated purchase register rows with per-file status (Queued, Processing, Completed, Error), retry controls, and automatic "Needs Review" flags.',
    whatCaNeedsToReview:
      'Any files marked with an error or flagged in the "Needs Review" filter after batch completion.',
    limitations:
      'Files process sequentially in the active browser tab to prevent memory exhaustion; closing or refreshing the tab mid-batch stops remaining queued files.',
    linkHref: '/bulk-invoice-processing',
    linkLabel: 'Explore Bulk Invoice Processing →',
  },
  {
    id: 'tally-xml-export',
    number: '06',
    title: 'TallyPrime XML Voucher Export & Pre-Export Validator',
    badge: 'ENVELOPE > IMPORTDATA > Vouchers Schema',
    whatItDoes:
      'Generates TallyPrime-ready XML purchase vouchers with per-client ledger mapping (Company Name, Purchase Ledger, Input CGST, Input SGST, Input IGST, Round-Off) and optional automatic creation of missing supplier ledgers under Sundry Creditors (<LEDGER ACTION="Create">). Runs a mandatory Pre-Export Validation check before download.',
    inputAccepted:
      'Verified client purchase register rows and configured TallyPrime ledger names.',
    outputProduced:
      'Downloadable .xml file with YYYYMMDD dates, XML-escaped party names (&amp;, &lt;, &gt;), properly signed ISDEEMEDPOSITIVE Debit/Credit entries, and bill-wise reference allocations.',
    whatCaNeedsToReview:
      'Bills listed in the Pre-Export Validation gate (missing invoice number, invalid date, invalid 15-digit GSTIN, or tax math mismatch) using "Fix Now" or "Skip & Export Valid Bills", and confirming ledger names match the target TallyPrime company.',
    limitations:
      'Generates accounting voucher ledger entries (Party Credit, Purchase Debit, Tax Debits, Round-Off) rather than stock-item inventory allocations inside TallyPrime.',
    linkHref: '/gst-invoice-to-tally',
    linkLabel: 'Explore GST Invoice to TallyPrime XML →',
  },
  {
    id: 'gstr2b-reconciliation',
    number: '07',
    title: 'GSTR-2B JSON & Excel Reconciliation Engine',
    badge: '6-Status ITC Matching & 7-Sheet Export',
    whatItDoes:
      'Matches your scanned client purchase register against official GST portal GSTR-2B files. Pass 1 pairs invoices by Supplier GSTIN + Normalized Invoice Number (stripping spaces, slashes, hyphens, and leading zeros); Pass 2 runs a fuzzy fallback on Supplier GSTIN + Amount (within a configurable rupee tolerance, default ₹1) + Date.',
    inputAccepted:
      'GST portal GSTR-2B .json (docdata.b2b) or .xlsx / .xls files matched against the active client’s purchase bills.',
    outputProduced:
      '6-status classification (Matched, Amount Mismatch, Date Mismatch, Invoice Number Mismatch [Probable], In Books but Not in 2B, In 2B but Not in Books), ITC summary cards, per-row audit notes, manual status overrides, and a 7-sheet .xlsx reconciliation report.',
    whatCaNeedsToReview:
      'Probable invoice number mismatches, amount variances exceeding the rupee tolerance, unbooked 2B bills, and suppliers who have not filed GSTR-1 before locking GSTR-3B ITC.',
    limitations:
      'Matches B2B supplier invoices (b2b section); credit/debit notes (CDNR) and ISD entries require separate review.',
    linkHref: '/gstr-2b-reconciliation-excel',
    linkLabel: 'Explore GSTR-2B Reconciliation in Excel →',
  },
  {
    id: 'multi-format-exports',
    number: '08',
    title: 'PDF, Excel (.XLSX), CSV, Zoho Books, Busy, JSON & SQL Exports',
    badge: '1 Bill = 1 Row or Line-Item Granularity',
    whatItDoes:
      'Exports your client register in either "1 Bill = 1 Row" summary mode (with auto-expanding Product 1..N columns) or "CA Detailed Line-Item" mode, and allows importing an existing .xlsx register to append newly scanned bills.',
    inputAccepted:
      'Active client bills, custom selected columns, and optional existing .xlsx workbook for appending.',
    outputProduced:
      'Multi-sheet Excel (.xlsx) with numeric SUM footers and a Verbatim OCR Text sheet, standard CSV, Zoho Books CSV, Busy Accounting Excel, structured JSON, relational SQL (CREATE TABLE + INSERT INTO), and plain .txt.',
    whatCaNeedsToReview:
      'Selected column checkboxes and whether 1-Bill-per-Row or Item-Wise mode is active prior to downloading.',
    limitations:
      'Appending to an existing .xlsx workbook combines tabular data values into a clean workbook download and does not preserve custom VBA macros or cell conditional formatting from the source file.',
    linkHref: '/pdf-invoice-to-excel',
    linkLabel: 'Explore PDF Invoice to Excel Converter →',
  },
  {
    id: 'rest-api-v1',
    number: '09',
    title: 'Developer REST API (POST /api/v1/extract)',
    badge: 'SHA-256 Hashed Keys & JSON Output',
    whatItDoes:
      'Exposes programmatic invoice extraction for custom ERP, practice management, or internal firm scripts using SHA-256 hashed API keys generated in the workspace QA & API tab.',
    inputAccepted:
      'HTTP POST to /api/v1/extract with multipart/form-data (field "file") or application/json ("fileBase64" / "embeddedText"), authenticated via Authorization: Bearer <key> or x-api-key: <key>.',
    outputProduced:
      'Structured JSON response containing apiVersion ("v1"), fileName, extractedAt timestamp, and the parsed invoice object with header fields, GST breakups, billItems, and exactRawText.',
    whatCaNeedsToReview:
      'Downstream integrations should inspect the returned confidence score, verify sellerGstin checksums, and handle HTTP 400/403/413/429 error responses.',
    limitations:
      'Enforces an in-memory rate limit of 30 requests/minute per API key hash and a maximum payload size of 15 MB per request.',
    linkHref: '/api-docs',
    linkLabel: 'Read REST API v1 Documentation →',
  },
];

export const SECURITY_ARCHITECTURE_SECTIONS: Array<{
  title: string;
  paragraphs: string[];
  bullets?: string[];
}> = [
  {
    title: '1. Authentication & Session Architecture',
    paragraphs: [
      'CA Saarthi AI supports Google Sign-In via Firebase Authentication (GoogleAuthProvider) as well as scoped CA Practice Workspace sessions for custom-domain and instant practice workflows. Plaintext user passwords are never created, transmitted, or stored by CA Saarthi AI.',
      'When authenticated with Firebase Google Sign-In, every request to Cloud Firestore carries the user’s cryptographic Firebase ID token, and security rules verify request.auth != null, request.auth.token.email_verified == true, and request.auth.uid == userId.',
    ],
  },
  {
    title: '2. Distinction Between Cloud AI OCR, Local Browser OCR Fallback & Persistent Storage',
    paragraphs: [
      'We maintain a strict, transparent distinction between how uploaded document files are processed during OCR and how extracted accounting records are stored in your workspace:',
    ],
    bullets: [
      'In-Memory Cloud OCR Processing (/api/extract-document & /api/v1/extract): When the server is configured with a Gemini API key (GEMINI_API_KEY), rendered page images (up to 5 pages per scan pass) and extracted PDF text layers (up to 18,000 characters) are transmitted over HTTPS to the Google Gemini API (@google/genai) to extract structured JSON. The application server processes the file buffer in memory and does not write uploaded PDF/JPG binary files to server disk.',
      'Local Browser OCR Fallback (PDF.js + Tesseract.js): When cloud extraction is unavailable, times out (11-second threshold), or when local re-scanning is triggered, OCR runs directly inside your browser using PDF.js coordinate extraction and a client-side Tesseract.js (eng+hin) WebAssembly worker.',
      'Persistent Workspace Storage (Firestore & Browser Storage): While raw uploaded binary files are not stored in a cloud file bucket, the extracted structured invoice records (Supplier Name, GSTIN, Invoice Number, Dates, Tax Amounts, Line Items, Audit Trail) and verbatim OCR text transcript (rawText / extractedText) ARE persistently stored in Google Cloud Firestore (when signed in) and in browser localStorage so your purchase register remains available across sessions until you delete it.',
    ],
  },
  {
    title: '3. Per-User & Per-Client Firestore Isolation (firestore.rules)',
    paragraphs: [
      'In Cloud Firestore, all data is hierarchically isolated per authenticated user and per client workspace under /users/{userId}/clients/{clientId}/bills/{billId} and /users/{userId}/clients/{clientId}/documents/{docId}.',
      'Our deployed firestore.rules file begins with a global default-deny rule (match /{document=**} { allow read, write: if false; }) and explicitly validates document ownership (request.auth.uid == userId && data.ownerId == userId), field types, string lengths, and bounded currency values (0 to 10,000,000,000) on every create and update operation.',
    ],
  },
  {
    title: '4. Role-Based Maker-Checker Access Control (RBAC)',
    paragraphs: [
      'Workspaces support three firm roles: Owner/CA, Reviewer, and Staff. Role permissions are enforced both in the React workspace UI and in Firestore security rules (canApproveOrReject):',
    ],
    bullets: [
      'Staff Role: Can upload invoices, edit draft fields, and submit bills with status "draft" or "pending_review", but is blocked from marking bills as "approved" or "rejected".',
      'Reviewer Role: Can inspect the review queue and mark bills as "approved" or "rejected" with recorded rejection reasons and timestamped audit trail entries.',
      'Owner/CA Role: Full control over client workspaces, Tally ledger settings, bill approvals, team member invitations (/users/{userId}/teamMembers), and developer API keys (/users/{userId}/apiKeys).',
    ],
  },
  {
    title: '5. Encryption in Transit & SHA-256 API Key Hashing',
    paragraphs: [
      'All network communication between the browser, www.casaarthiai.in, Firebase Authentication, Cloud Firestore, and the Gemini API is encrypted in transit using HTTPS/TLS.',
      'When you generate a developer API key (ls_live_...) in the QA & API tab, the plaintext key is displayed once and hashed in the browser using Web Crypto SHA-256. Only the 64-character hexadecimal SHA-256 hash and key prefix are stored in Firestore and the server key registry.',
    ],
  },
  {
    title: '6. Provider Governance & Items Requiring Owner Verification',
    paragraphs: [
      'In accordance with our commitment to technical transparency, we do not claim third-party security certifications (such as ISO 27001 or SOC 2 Type II), custom customer-managed encryption keys (CMEK), or custom geographic residency guarantees beyond the underlying Google Cloud / Firebase project configuration.',
      'Deployment Owner Verification Note: Whether prompts sent to the Google Gemini API are excluded from provider model training or abuse-monitoring logs depends on the billing tier of the GEMINI_API_KEY configured by the deployment owner in Google AI Studio / Google Cloud Vertex AI.',
    ],
  },
];

export const PRIVACY_POLICY_SECTIONS: Array<{
  title: string;
  paragraphs: string[];
  bullets?: string[];
}> = [
  {
    title: '1. Scope & Audience',
    paragraphs: [
      'This Privacy Policy explains what information CA Saarthi AI (https://www.casaarthiai.in) collects, how uploaded invoices and accounting documents are processed, where extracted records are stored, and how users can delete their data.',
    ],
  },
  {
    title: '2. Information We Collect and Store',
    paragraphs: [
      'Depending on whether you use CA Saarthi AI in guest mode or signed-in workspace mode, the application processes and stores the following categories of data:',
    ],
    bullets: [
      'Account Profile Data: When you sign in via Google OAuth or CA Practice Sign-In, we store your user ID (uid), email address, display name, profile photo URL (if provided by Google), selected user mode (normal_user or ca_mode), firm role, and column preferences.',
      'Client Workspace Metadata: Client legal/trade name, 15-digit GSTIN, 10-character PAN, financial year (e.g., 2026-27), and optional notes created in the Clients & Team tab.',
      'Extracted Invoice & Document Records: Structured fields extracted from uploaded bills (supplier/buyer names and GSTINs, invoice number, dates, HSN/SAC line items, tax amounts, bank details, IRN/e-Way Bill numbers, approval status, audit trail) and the verbatim extracted text transcript (rawText / extractedText).',
      'Tally, Team & API Configuration: Per-client TallyPrime ledger names, invited team member records (name, email, role, assigned client IDs), and SHA-256 hashes of generated API keys.',
      'Browser LocalStorage State: Theme preference, accent color, daily free demo scan counter, and local workspace cache (ledgersutra_bills_v4, ledgersutra_documents_v4, ledgersutra_clients_v4) so your work persists across page reloads.',
    ],
  },
  {
    title: '3. How Uploaded Invoice Files Are Processed (Cloud OCR vs. Local Fallback)',
    paragraphs: [
      'When you upload a PDF or image invoice for extraction, the binary file is read in your browser to render page previews and extract any embedded PDF text layer.',
      'If cloud AI extraction is active on the server (/api/extract-document or /api/v1/extract), rendered page images (up to 5 pages) and extracted text are sent over HTTPS to the server, which forwards them to the Google Gemini API (@google/genai) and returns structured JSON. The server holds the upload buffer in memory only for the duration of the extraction request and does not store the raw PDF or image file on disk.',
      'If cloud AI extraction is unavailable or you use client-side re-scanning, OCR runs locally inside your browser using PDF.js and Tesseract.js (eng+hin) without transmitting the image to an external OCR API.',
    ],
  },
  {
    title: '4. Where Extracted Data Is Stored',
    paragraphs: [
      'Unlike the temporary binary file stream used during OCR, the resulting structured invoice data and verbatim text transcript are saved to your workspace so you can review, reconcile GSTR-2B, and export Tally XML or Excel files:',
    ],
    bullets: [
      'Signed-In Cloud Workspace: Stored in Google Cloud Firestore under /users/{uid}/clients/{clientId}/bills and /documents, protected by per-user ownership rules.',
      'Browser LocalStorage: Cached locally in your browser storage for offline resilience and guest sessions.',
      'Server Workspace Store (/api/nosql/store): In guest sessions and for API key hash lookup, the server maintains a JSON store (nosql_store.json or /tmp/nosql_store.json in serverless environments).',
    ],
  },
  {
    title: '5. Data Retention & Instant User Deletion',
    paragraphs: [
      'Saved invoice records, client profiles, and text transcripts remain in your workspace until you choose to delete them. You can delete individual bills, specific client workspaces, or your entire account history at any time directly from the application interface. Refer to our Data Deletion Policy (/data-deletion) for step-by-step instructions.',
    ],
  },
];

export const DATA_DELETION_SECTIONS: Array<{
  title: string;
  paragraphs: string[];
  bullets?: string[];
}> = [
  {
    title: '1. What Is Ephemeral vs. What Is Persistently Stored',
    paragraphs: [
      'To give Chartered Accountants and their clients complete clarity over data lifecycle, CA Saarthi AI separates ephemeral file processing from persistent register storage:',
    ],
    bullets: [
      'Uploaded Binary Files (Ephemeral): Raw PDF, JPG, and PNG files submitted to /api/extract-document or /api/v1/extract are parsed in memory to extract text and fields and are discarded immediately after the HTTP response completes.',
      'Extracted Workspace Records (Persistent Until Deleted): The extracted bill fields, line items, verbatim text transcripts, client GSTIN profiles, Tally ledger mappings, team member entries, and SHA-256 API key hashes are stored in Google Cloud Firestore (when signed in) and in your browser’s localStorage until you delete them.',
    ],
  },
  {
    title: '2. How to Delete Individual Bills or Verbatim Text Records',
    paragraphs: [
      'In the Merged Excel Sheet tab or Exact Text History tab, click the Delete (trash icon) button next to any invoice row or document transcript, or use "Clear Sheet" to remove all bills in the active view. This immediately deletes the record from your active state, updates browser localStorage, and calls deleteBillFromUserAccount / deleteDocumentFromUserAccount to remove the document from Firestore (/users/{uid}/clients/{clientId}/bills/{billId}).',
    ],
  },
  {
    title: '3. How to Delete an Entire Client Workspace',
    paragraphs: [
      'Open the Clients & Team tab in the workspace. You can archive a client or click Delete on any non-default client profile. Deleting a client invokes deleteClientFromFirestore, which removes the client profile document (/users/{uid}/clients/{clientId}) and purges all bills and documents stored under that client.',
    ],
  },
  {
    title: '4. How to Purge Your Entire Account & Cloud Data in One Click',
    paragraphs: [
      'In the Clients & Team tab (or account controls), trigger Complete Account Data Deletion. This executes deleteEntireUserAccountDataFromFirestore(uid), which permanently deletes:',
    ],
    bullets: [
      'Every bill and document inside /users/{uid}/clients/{clientId}/bills and /documents across all clients.',
      'Every client profile document inside /users/{uid}/clients.',
      'All team member records (/users/{uid}/teamMembers) and API key hashes (/users/{uid}/apiKeys).',
      'Any legacy root /users/{uid}/bills and /users/{uid}/documents records.',
      'The root user profile document (/users/{uid}) and all local browser storage keys (ledgersutra_bills_v4, ledgersutra_documents_v4, ledgersutra_clients_v4, ledgersutra_tally_settings_v4).',
    ],
  },
  {
    title: '5. Support & Compliance Assistance',
    paragraphs: [
      'If you require assistance revoking an API key hash or verifying account deletion for a firm audit, contact support@casaarthiai.in.',
    ],
  },
];

export const ABOUT_PAGE_SECTIONS: Array<{
  title: string;
  paragraphs: string[];
  bullets?: string[];
}> = [
  {
    title: '1. Purpose: Solving Pre-Accounting Bottlenecks for Indian CA Practices',
    paragraphs: [
      'CA Saarthi AI is a specialized GST invoice OCR, TallyPrime XML export, and GSTR-2B reconciliation web application built for Indian Chartered Accountants, CA firms, GST practitioners, and accounting teams.',
      'Every month prior to GSTR-1 and GSTR-3B filing deadlines, accounting teams receive mixed folders of digital ERP PDFs, multi-page distributor bills, and mobile camera photos of purchase invoices. Keying those vouchers manually into TallyPrime or Excel—and reconciling them against GSTR-2B using fragile spreadsheet formulas—consumes valuable review time and introduces transcription errors in 15-character GSTINs, invoice numbers, and tax splits.',
    ],
  },
  {
    title: '2. Who Uses CA Saarthi AI',
    paragraphs: [
      'The workspace is designed around two complementary operating modes that share the same underlying data model:',
    ],
    bullets: [
      'CA / GST Audit Mode: Built for Chartered Accountants, tax consultants, and article assistants who need 15-digit GSTIN Mod-36 checksum validation, HSN/SAC line-item splits, CGST/SGST/IGST math verification, GSTR-2B 6-status matching, client-wise isolation, maker-checker approval queues, and TallyPrime XML voucher generation.',
      'Normal User / Business Mode: Built for client staff and small business owners who want a clean "1 Bill = 1 Row" purchase register with automatic horizontal expansion (Product 1, Product 2...) for multi-item bills and one-click Excel (.xlsx) downloads.',
    ],
  },
  {
    title: '3. Implemented Technical Capabilities',
    paragraphs: [
      'Every feature described on CA Saarthi AI corresponds to live, inspectable functionality inside the application:',
    ],
    bullets: [
      'Hybrid Bilingual OCR: Combines PDF.js X/Y coordinate text reconstruction, 2.0x High-DPI canvas contrast enhancement, cloud AI Vision, and local browser Tesseract.js (eng+hin) fallback.',
      'Deterministic GST Audit Engine: Validates 15-character GSTIN structure, all 37 Indian state codes, Mod-36 check digits, embedded PANs, duplicate invoice collisions, and Taxable + Tax = Grand Total math.',
      'Accounting & ERP Exports: Generates TallyPrime XML vouchers (with pre-export validation and optional party ledger creation), multi-sheet Excel (.xlsx), CSV, Zoho Books CSV, Busy Accounting Excel, JSON, and SQL scripts.',
      'GSTR-2B Reconciliation: Parses GST portal GSTR-2B JSON and Excel files, normalizes invoice numbers, runs fuzzy amount/date matching with configurable rupee tolerance, and exports a 7-sheet Excel working paper.',
      'Built-In Ground-Truth Accuracy Benchmark: Rather than publishing unverified accuracy claims, the QA & API tab includes a live Accuracy Test tool where firms can upload their own sample invoices alongside a ground-truth Excel sheet to measure exact field-level accuracy.',
    ],
  },
];

export const HOW_IT_WORKS_SECTIONS: Array<{
  step: string;
  title: string;
  description: string;
  reviewNote: string;
}> = [
  {
    step: 'Step 01',
    title: 'Select or Create Your Client GSTIN Workspace',
    description:
      'Choose the active client from the header switcher or add a new client profile with their Legal Name, 15-digit GSTIN, PAN, and Financial Year. All bills, Tally ledger settings, and GSTR-2B reconciliations stay scoped to that client.',
    reviewNote: 'Confirm the client’s 15-digit GSTIN and Financial Year so Buyer GSTIN checks and Tally company mappings align.',
  },
  {
    step: 'Step 02',
    title: 'Upload Single or Batch Invoices (PDF, JPG, PNG, QR)',
    description:
      'Drop digital PDFs, scanned multi-page PDFs, or mobile bill photos into the Scanner or Batch Processing Queue. CA Saarthi AI extracts coordinate text layers, enhances image contrast, and runs bilingual English + Hindi extraction.',
    reviewNote: 'Monitor per-file progress bars in the batch queue; low-confidence or math-variance bills are automatically flagged as "Needs Review".',
  },
  {
    step: 'Step 03',
    title: 'Verify GSTIN Checksums, Duplicates & Line Items Side-by-Side',
    description:
      'Inspect the high-resolution document preview on the left alongside editable header fields, line items, and the deterministic CA Validation panel on the right. Resolve any duplicate invoice alerts or Mod-36 GSTIN checksum warnings.',
    reviewNote: 'In multi-member firms, Staff submit verified bills to "Pending Review" and Reviewers/Owners mark them "Approved".',
  },
  {
    step: 'Step 04',
    title: 'Reconcile Against Portal GSTR-2B & Export to TallyPrime or Excel',
    description:
      'Upload the client’s portal GSTR-2B JSON or Excel file to classify every purchase voucher across 6 reconciliation statuses, then export your approved register to TallyPrime XML, multi-sheet Excel (.xlsx), Zoho Books CSV, Busy Excel, JSON, or SQL.',
    reviewNote: 'Review the Pre-Export Validation modal before Tally XML download to fix or skip any blocked vouchers.',
  },
];

export const API_DOCS_SPEC = {
  endpoint: 'POST /api/v1/extract',
  auxiliaryEndpoints: [
    {
      method: 'POST',
      path: '/api/v1/extract',
      summary: 'Extract structured GST invoice header fields, tax breakups, line items, and verbatim text from a PDF or image.',
    },
    {
      method: 'POST',
      path: '/api/gstin/verify',
      summary: 'Validate 15-character GSTIN format, Indian state code (01–38), Mod-36 check character, and embedded PAN constitution.',
    },
    {
      method: 'POST',
      path: '/api/v1/keys/register',
      summary: 'Register or revoke a 64-character SHA-256 API key hash generated in the workspace QA & API tab.',
    },
    {
      method: 'GET',
      path: '/api/gstin/status-config',
      summary: 'Check whether the deterministic GSTIN verification service is active.',
    },
  ],
  authDescription:
    'Pass your API key in the Authorization: Bearer <api_key> header or the x-api-key: <api_key> header. Keys are generated in the Workspace > QA & API tab (prefixed with ls_live_) and hashed in the browser using SHA-256 before storage. For quick sandbox testing, if no header is supplied, the endpoint falls back to its built-in default sandbox key.',
  limitsDescription:
    'Rate Limit: 30 requests per minute per API key hash (tracked via an in-memory sliding window; responses include X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset headers). Maximum Request Payload: 15 MB (15,728,640 bytes).',
  errorCodes: [
    {
      status: 400,
      code: 'INVALID_MULTIPART_PAYLOAD / INVALID_REQUEST_BODY / EMPTY_DOCUMENT',
      description: 'The request did not contain a valid "file" field in multipart/form-data or valid "fileBase64" / "embeddedText" in application/json.',
    },
    {
      status: 403,
      code: 'INVALID_OR_REVOKED_API_KEY',
      description: 'The SHA-256 hash of the provided API key does not match an active key in the registry or has been revoked.',
    },
    {
      status: 413,
      code: 'PAYLOAD_TOO_LARGE',
      description: 'The uploaded file buffer exceeds the 15 MB maximum size limit.',
    },
    {
      status: 429,
      code: 'RATE_LIMIT_EXCEEDED',
      description: 'More than 30 requests were sent within a 60-second window for the same API key hash.',
    },
  ],
};

function escapeHtmlAttr(raw: string): string {
  return String(raw || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Generates crawlable SSR HTML body + head metadata for public routes so search engine
 * crawlers and page extractors see the complete, unique, page-specific H1, breadcrumbs,
 * pricing cards, feature breakdowns, security/privacy policies, API docs, FAQs, and internal links.
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

  const isHindiRoute = cleanPath === '/hi' || cleanPath.startsWith('/hi/');

  const sharedNavHtml = isHindiRoute
    ? `<header>
    <nav aria-label="मुख्य साइट नेविगेशन">
      <a href="/hi">${escapeHtmlAttr(BRAND_NAME)}</a>
      <a href="/hi">होम</a>
      <a href="/app">वर्कस्पेस</a>
      <a href="/hi/features">फीचर्स</a>
      <a href="/how-it-works">कार्यप्रणाली</a>
      <a href="/hi/pricing">प्राइसिंग</a>
      <a href="/blog">CA ब्लॉग</a>
      <a href="/api-docs">REST API</a>
      <a href="/">English (/)</a>
    </nav>
  </header>`
    : `<header>
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
    cleanPath !== '/' && cleanPath !== '/hi'
      ? isHindiRoute
        ? `<nav aria-label="ब्रेडक्रम्ब">
          <a href="/hi">होम</a> &gt; ${
            seoSpec
              ? `<a href="/hi/features">फीचर्स</a> &gt; <span aria-current="page">${escapeHtmlAttr(breadcrumbName)}</span>`
              : `<span aria-current="page">${escapeHtmlAttr(breadcrumbName)}</span>`
          }
        </nav>`
        : `<nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; ${
            articleSpec
              ? `<a href="/blog">Blog</a> &gt; <span aria-current="page">${escapeHtmlAttr(articleSpec.title)}</span>`
              : seoSpec
              ? `<a href="/features">Features</a> &gt; <span aria-current="page">${escapeHtmlAttr(breadcrumbName)}</span>`
              : `<span aria-current="page">${escapeHtmlAttr(breadcrumbName)}</span>`
          }
        </nav>`
      : '';

  const sharedFooterHtml = isHindiRoute
    ? `<footer>
    <p>भारतीय चार्टर्ड अकाउंटेंट्स, GST प्रैक्टिशनर्स और टैक्स कंसल्टेंट्स के लिए निर्मित। किसी भी बिल को स्कैन करें, 15-अंकीय GSTIN और टैक्स गणित की जांच करें, पोर्टल JSON/Excel से GSTR-2B का मिलान करें और TallyPrime XML, Excel, CSV, JSON या SQL में एक्सपोर्ट करें।</p>
    <nav aria-label="फ़ुटर नेविगेशन">
      <a href="/hi">https://www.casaarthiai.in/hi</a>
      <a href="/invoice-ocr-for-ca">CA फर्मों के लिए इनवॉइस OCR</a>
      <a href="/hi/gst-invoice-to-tally">GST इनवॉइस से TallyPrime XML</a>
      <a href="/hi/gstr-2b-reconciliation-excel">Excel में GSTR-2B रिकन्सिलिएशन</a>
      <a href="/bulk-invoice-processing-for-ca">CA के लिए बल्क इनवॉइस प्रोसेसिंग</a>
      <a href="/gst-invoice-data-extraction">GST इनवॉइस डेटा एक्सट्रैक्शन</a>
      <a href="/hi/pdf-invoice-to-excel">PDF इनवॉइस से Excel कन्वर्टर</a>
      <a href="/bulk-invoice-processing">बैच इनवॉइस प्रोसेसिंग</a>
      <a href="/invoice-automation-for-accountants">अकाउंटेंट्स के लिए इनवॉइस ऑटोमेशन</a>
      <a href="/document-scanning-software">डॉक्यूमेंट स्कैनिंग सॉफ्टवेयर</a>
      <a href="/hi/features">सभी GST प्रैक्टिस फीचर्स</a>
      <a href="/how-it-works">यह कैसे काम करता है</a>
      <a href="/hi/pricing">प्राइसिंग और CA फर्म पायलट</a>
      <a href="/faq">अक्सर पूछे जाने वाले प्रश्न (FAQ)</a>
      <a href="/security">सुरक्षा और डेटा आइसोलेशन</a>
      <a href="/privacy">प्राइवेसी पॉलिसी</a>
      <a href="/terms">सेवा की शर्तें</a>
      <a href="/data-deletion">डेटा विलोपन नीति</a>
      <a href="/about">CA Saarthi AI के बारे में</a>
      <a href="/contact">संपर्क करें और डेमो बुक करें</a>
      <a href="/blog">सभी ब्लॉग गाइड्स और ट्यूटोरियल</a>
      <a href="/">English Homepage (/)</a>
    </nav>
  </footer>`
    : `<footer>
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
      <a href="/features">All GST Practice Features</a>
      <a href="/how-it-works">How It Works</a>
      <a href="/pricing">Pricing &amp; CA Firm Pilots</a>
      <a href="/faq">FAQ</a>
      <a href="/security">Security &amp; Data Isolation</a>
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
      <a href="/data-deletion">Data Deletion Policy</a>
      <a href="/about">About CA Saarthi AI</a>
      <a href="/contact">Contact &amp; Book a Demo</a>
      <a href="/blog">All Blog Articles &amp; Tutorials</a>
      ${RESOURCE_ARTICLES.map((a) => `<a href="${escapeHtmlAttr(a.path)}">${escapeHtmlAttr(a.title)}</a>`).join('\n      ')}
    </nav>
  </footer>`;

  let ssrBodyHtml = '';

  if (routeKind === 'obsolete_gone') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      <main>
        <h1>410 Gone — Legacy Personal-Finance Page Removed</h1>
        <p>This legacy personal-finance or government scheme directory URL (${escapeHtmlAttr(cleanPath)}) has been permanently retired. <a href="/">Return to ${escapeHtmlAttr(BRAND_NAME)} Homepage</a>.</p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (routeKind === 'not_found') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      <main>
        <h1>404 — Page Not Found</h1>
        <p>The requested URL (${escapeHtmlAttr(cleanPath)}) does not exist on ${escapeHtmlAttr(BRAND_NAME)}. <a href="/">Back to Homepage</a>.</p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/hi/pricing') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>${escapeHtmlAttr(hindiSpec ? hindiSpec.subtitle : description)}</p>
        <p>पायलट CA फर्मों के लिए अर्ली-एक्सेस प्राइसिंग। हमारे तीन संरचित प्रैक्टिस प्लान की तुलना नीचे करें:</p>
        <section>
          <h2>CA Saarthi AI प्रैक्टिस प्राइसिंग प्लान</h2>
          ${PRACTICE_PRICING_PLANS_HI.map(
            (plan) => `<article>
            <h3>${escapeHtmlAttr(plan.name)} — ${escapeHtmlAttr(plan.price)}</h3>
            <p>${escapeHtmlAttr(plan.tier)} · ${escapeHtmlAttr(plan.subtitle)}</p>
            <p><strong>किसके लिए उपयुक्त:</strong> ${escapeHtmlAttr(plan.audience)}</p>
            <ul>
              ${plan.features.map((f) => `<li>${escapeHtmlAttr(f)}</li>`).join('')}
            </ul>
            <p><a href="${escapeHtmlAttr(plan.ctaHref)}">${escapeHtmlAttr(plan.ctaLabel)}</a></p>
          </article>`
          ).join('\n          ')}
        </section>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/pricing') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>${escapeHtmlAttr(hindiSpec ? hindiSpec.subtitle : description)}</p>
        <p>Early-access pricing — locked for pilot CA firms. Compare our three structured tiers below:</p>
        <section>
          <h2>CA Saarthi AI Practice Pricing Plans</h2>
          ${PRACTICE_PRICING_PLANS.map(
            (plan) => `<article>
            <h3>${escapeHtmlAttr(plan.name)} — ${escapeHtmlAttr(plan.price)}</h3>
            <p>${escapeHtmlAttr(plan.tier)} · ${escapeHtmlAttr(plan.subtitle)}</p>
            <p><strong>Designed for:</strong> ${escapeHtmlAttr(plan.audience)}</p>
            <ul>
              ${plan.features.map((f) => `<li>${escapeHtmlAttr(f)}</li>`).join('')}
            </ul>
            <p><a href="${escapeHtmlAttr(plan.ctaHref)}">${escapeHtmlAttr(plan.ctaLabel)}</a></p>
          </article>`
          ).join('\n          ')}
        </section>
        <section>
          <h2>How Plan Differences Work in Practice</h2>
          <p><strong>Starter / Trial (₹0 / month):</strong> Includes 3 no-login demo scans per day on the homepage plus access to the live workspace with 1 Default Client profile, single and batch invoice uploads, 15-digit GSTIN Mod-36 checksum validation, and exports to <a href="/gst-invoice-to-tally">TallyPrime XML</a> and <a href="/pdf-invoice-to-excel">Excel (.xlsx)</a>.</p>
          <p><strong>CA Practice Pro (₹1,499 / month):</strong> Designed for solo practitioners managing up to 25 separate client GSTIN workspaces. Unlocks the full 6-status <a href="/gstr-2b-reconciliation-excel">GSTR-2B JSON &amp; Excel Reconciliation</a> engine, Zoho Books CSV and Busy Accounting Excel exports, and extended e-Invoice IRN, e-Way Bill, bank IFSC, and Bill of Entry field extraction.</p>
          <p><strong>Firm / Enterprise (₹3,999 / month):</strong> Built for multi-partner CA firms requiring unlimited client workspaces, role-based team access (Owner/CA, Reviewer, and Staff roles), maker-checker bill approval workflows with audit trails, and programmatic access to <a href="/api-docs">POST /api/v1/extract</a>.</p>
          <p>Explore <a href="/features">all implemented GST practice features</a>, review our <a href="/security">Security &amp; Data Isolation architecture</a>, or <a href="/contact">Contact us to book a CA firm pilot walkthrough</a>.</p>
        </section>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/features' || cleanPath === '/hi/features') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>${escapeHtmlAttr(hindiSpec ? hindiSpec.subtitle : description)}</p>
        <p>Every capability listed below is implemented in the ${escapeHtmlAttr(BRAND_NAME)} workspace. Each section details what the module does, what input it accepts, what output it produces, what the Chartered Accountant or accountant must review, and technical limitations.</p>
        ${DETAILED_FEATURES_SPECS.map(
          (feat) => `<section id="${escapeHtmlAttr(feat.id)}">
          <h2>${escapeHtmlAttr(feat.number)}. ${escapeHtmlAttr(feat.title)}</h2>
          <p><strong>Capability Overview:</strong> ${escapeHtmlAttr(feat.whatItDoes)}</p>
          <ul>
            <li><strong>Input Accepted:</strong> ${escapeHtmlAttr(feat.inputAccepted)}</li>
            <li><strong>Output Produced:</strong> ${escapeHtmlAttr(feat.outputProduced)}</li>
            <li><strong>What the CA / Accountant Needs to Review:</strong> ${escapeHtmlAttr(feat.whatCaNeedsToReview)}</li>
            <li><strong>Known Limitations:</strong> ${escapeHtmlAttr(feat.limitations)}</li>
          </ul>
          <p><a href="${escapeHtmlAttr(feat.linkHref)}">${escapeHtmlAttr(feat.linkLabel)}</a></p>
        </section>`
        ).join('\n        ')}
        <p>Ready to evaluate these capabilities on your own client invoices? <a href="/app">Open the Live CA Workspace</a> or compare <a href="/pricing">CA Practice Pricing Plans</a>.</p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/security') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>This page documents the exact authentication, OCR processing, Firestore database isolation, role-based access control, and encryption mechanisms implemented in the ${escapeHtmlAttr(BRAND_NAME)} codebase.</p>
        ${SECURITY_ARCHITECTURE_SECTIONS.map(
          (sec) => `<section>
          <h2>${escapeHtmlAttr(sec.title)}</h2>
          ${sec.paragraphs.map((p) => `<p>${escapeHtmlAttr(p)}</p>`).join('')}
          ${sec.bullets ? `<ul>${sec.bullets.map((b) => `<li>${escapeHtmlAttr(b)}</li>`).join('')}</ul>` : ''}
        </section>`
        ).join('\n        ')}
        <p>Related Trust Pages: <a href="/privacy">Privacy Policy</a> · <a href="/data-deletion">Data Deletion Policy</a> · <a href="/terms">Terms of Service</a> · <a href="/contact">Contact Security &amp; Support</a></p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/privacy') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>Last Updated: November 2026 · Support: <a href="mailto:support@casaarthiai.in">support@casaarthiai.in</a></p>
        ${PRIVACY_POLICY_SECTIONS.map(
          (sec) => `<section>
          <h2>${escapeHtmlAttr(sec.title)}</h2>
          ${sec.paragraphs.map((p) => `<p>${escapeHtmlAttr(p)}</p>`).join('')}
          ${sec.bullets ? `<ul>${sec.bullets.map((b) => `<li>${escapeHtmlAttr(b)}</li>`).join('')}</ul>` : ''}
        </section>`
        ).join('\n        ')}
        <p>See also: <a href="/security">Security &amp; Data Isolation Architecture</a> · <a href="/data-deletion">Data Deletion Policy</a> · <a href="/terms">Terms of Service</a></p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/data-deletion') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>Last Updated: November 2026 · Support: <a href="mailto:support@casaarthiai.in">support@casaarthiai.in</a></p>
        ${DATA_DELETION_SECTIONS.map(
          (sec) => `<section>
          <h2>${escapeHtmlAttr(sec.title)}</h2>
          ${sec.paragraphs.map((p) => `<p>${escapeHtmlAttr(p)}</p>`).join('')}
          ${sec.bullets ? `<ul>${sec.bullets.map((b) => `<li>${escapeHtmlAttr(b)}</li>`).join('')}</ul>` : ''}
        </section>`
        ).join('\n        ')}
        <p>See also: <a href="/privacy">Privacy Policy</a> · <a href="/security">Security &amp; Data Isolation</a> · <a href="/app">Open Workspace to Manage Data</a></p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/about') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>${escapeHtmlAttr(description)}</p>
        ${ABOUT_PAGE_SECTIONS.map(
          (sec) => `<section>
          <h2>${escapeHtmlAttr(sec.title)}</h2>
          ${sec.paragraphs.map((p) => `<p>${escapeHtmlAttr(p)}</p>`).join('')}
          ${sec.bullets ? `<ul>${sec.bullets.map((b) => `<li>${escapeHtmlAttr(b)}</li>`).join('')}</ul>` : ''}
        </section>`
        ).join('\n        ')}
        <p>Explore <a href="/features">GST Practice Features</a>, <a href="/pricing">Pricing Plans</a>, <a href="/security">Security &amp; Data Isolation</a>, or <a href="/contact">Contact our team</a>.</p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/api-docs') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>${escapeHtmlAttr(description)}</p>
        <section>
          <h2>1. Available API Endpoints</h2>
          <ul>
            ${API_DOCS_SPEC.auxiliaryEndpoints
              .map((ep) => `<li><strong>${escapeHtmlAttr(ep.method)} ${escapeHtmlAttr(ep.path)}:</strong> ${escapeHtmlAttr(ep.summary)}</li>`)
              .join('')}
          </ul>
        </section>
        <section>
          <h2>2. Authentication &amp; SHA-256 Key Hashing</h2>
          <p>${escapeHtmlAttr(API_DOCS_SPEC.authDescription)}</p>
        </section>
        <section>
          <h2>3. Rate Limits &amp; Payload Constraints</h2>
          <p>${escapeHtmlAttr(API_DOCS_SPEC.limitsDescription)}</p>
        </section>
        <section>
          <h2>4. Request Formats (Multipart &amp; JSON Base64)</h2>
          <pre>curl -X POST ${escapeHtmlAttr(SITE_DOMAIN)}/api/v1/extract \\
  -H "Authorization: Bearer ls_live_your_api_key_here" \\
  -F "file=@/path/to/purchase_invoice.pdf"</pre>
          <pre>curl -X POST ${escapeHtmlAttr(SITE_DOMAIN)}/api/v1/extract \\
  -H "x-api-key: ls_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"fileName":"tax_invoice_842.pdf","mimeType":"application/pdf","fileBase64":"JVBERi0xLjQK..."}'</pre>
        </section>
        <section>
          <h2>5. 200 OK JSON Response Schema</h2>
          <p>Successful calls to <code>POST /api/v1/extract</code> return HTTP 200 with <code>success: true</code>, <code>apiVersion: "v1"</code>, <code>fileName</code>, <code>extractedAt</code> (ISO-8601 timestamp), and an <code>invoice</code> object containing <code>shopName</code>, <code>sellerGstin</code>, <code>supplierPan</code>, <code>buyerName</code>, <code>buyerGstin</code>, <code>invoiceNumber</code>, <code>billDate</code>, <code>placeOfSupply</code>, <code>voucherType</code>, <code>irn</code>, <code>ewayBillNo</code>, <code>subtotal</code>, <code>cgstAmount</code>, <code>sgstAmount</code>, <code>igstAmount</code>, <code>taxAmount</code>, <code>grandTotal</code>, <code>billItems</code> (array of line items with <code>itemName</code>, <code>hsnSac</code>, <code>quantity</code>, <code>unit</code>, <code>unitPrice</code>, <code>taxableValue</code>, <code>gstRate</code>, <code>cgstAmount</code>, <code>sgstAmount</code>, <code>igstAmount</code>, <code>lineTotal</code>), and <code>exactRawText</code>.</p>
        </section>
        <section>
          <h2>6. Error Handling &amp; Status Codes</h2>
          <ul>
            ${API_DOCS_SPEC.errorCodes
              .map((err) => `<li><strong>HTTP ${err.status} (${escapeHtmlAttr(err.code)}):</strong> ${escapeHtmlAttr(err.description)}</li>`)
              .join('')}
          </ul>
        </section>
        <p>Generate and test your API keys in the <a href="/app">CA Workspace (QA &amp; API Tab)</a> or view <a href="/pricing">Firm &amp; Enterprise API plans</a>.</p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/how-it-works') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>${escapeHtmlAttr(description)}</p>
        ${HOW_IT_WORKS_SECTIONS.map(
          (st) => `<section>
          <h2>${escapeHtmlAttr(st.step)}: ${escapeHtmlAttr(st.title)}</h2>
          <p>${escapeHtmlAttr(st.description)}</p>
          <p><strong>CA Review Checkpoint:</strong> ${escapeHtmlAttr(st.reviewNote)}</p>
        </section>`
        ).join('\n        ')}
        <p>Explore <a href="/gst-invoice-to-tally">TallyPrime XML Import</a>, <a href="/gstr-2b-reconciliation-excel">GSTR-2B Reconciliation in Excel</a>, <a href="/features">All Features</a>, and <a href="/pricing">Pricing Plans</a>.</p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/blog') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>${escapeHtmlAttr(description)}</p>
        <section>
          <h2>All GST, TallyPrime &amp; Audit Automation Guides</h2>
          <ul>
            ${RESOURCE_ARTICLES.map(
              (art) => `<li>
              <h3><a href="${escapeHtmlAttr(art.path)}">${escapeHtmlAttr(art.title)}</a></h3>
              <p>${escapeHtmlAttr(art.category)} · ${escapeHtmlAttr(art.readTime)} · Published ${escapeHtmlAttr(art.publishedDate)}</p>
              <p>${escapeHtmlAttr(art.summary)}</p>
            </li>`
            ).join('\n            ')}
          </ul>
        </section>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/terms') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>Last Updated: November 2026 · Support: <a href="mailto:support@casaarthiai.in">support@casaarthiai.in</a></p>
        <section>
          <h2>1. Professional Verification Responsibility</h2>
          <p>${escapeHtmlAttr(BRAND_NAME)} is an OCR extraction and accounting preparation tool designed for Chartered Accountants and tax practitioners. Because OCR output depends on document print quality and layout, users must review and verify extracted GSTINs, invoice dates, HSN/SAC codes, tax amounts, GSTR-2B match statuses, and TallyPrime XML vouchers before filing statutory GST returns or financial statements.</p>
        </section>
        <section>
          <h2>2. Acceptable Demo, Workspace &amp; API Usage</h2>
          <p>Unauthenticated homepage demo scans are limited to 3 custom uploads per browser per day. Programmatic calls to <code>POST /api/v1/extract</code> are subject to a rate limit of 30 requests per minute per API key hash and a maximum file payload of 15 MB.</p>
        </section>
        <section>
          <h2>3. Data Ownership &amp; Deletion</h2>
          <p>You retain ownership of the client profiles and invoice records uploaded to your workspace. You may export or permanently delete your records at any time as detailed in our <a href="/privacy">Privacy Policy</a> and <a href="/data-deletion">Data Deletion Policy</a>.</p>
        </section>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/contact') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>Schedule a live walkthrough of <a href="/gst-invoice-to-tally">TallyPrime XML import</a>, <a href="/gstr-2b-reconciliation-excel">GSTR-2B reconciliation in Excel</a>, and multi-client CA firm workspaces with our engineering team at <a href="mailto:support@casaarthiai.in">support@casaarthiai.in</a>.</p>
        <p>Compare our <a href="/pricing">Starter (₹0), CA Practice Pro (₹1,499/month), and Firm / Enterprise (₹3,999/month) plans</a> or test the <a href="/app">live workspace</a> directly.</p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (seoSpec) {
    ssrBodyHtml = `<div id="prerendered-route-shell">
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
    ssrBodyHtml = `<div id="prerendered-route-shell">
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
  } else if (cleanPath === '/faq') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>${escapeHtmlAttr(description)}</p>
        <section>
          <h2>Frequently Asked Questions (${HOMEPAGE_FAQS.length} Practitioner Answers)</h2>
          ${HOMEPAGE_FAQS.map(
            (f) => `<article>
            <h3>${escapeHtmlAttr(f.question)}</h3>
            <p>${escapeHtmlAttr(f.answer)}</p>
          </article>`
          ).join('\n          ')}
        </section>
        <p>Explore <a href="/features">all 9 GST practice capabilities</a>, compare <a href="/pricing">CA Practice Pricing Plans</a>, or <a href="/contact">Contact us to book a demo</a>.</p>
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else if (cleanPath === '/hi') {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>${escapeHtmlAttr(hindiSpec ? hindiSpec.subtitle : description)}</p>
        <p>भारतीय CA फर्मों के लिए इनवॉइस OCR सॉफ्टवेयर — <a href="/hi/gst-invoice-to-tally">TallyPrime XML एक्सपोर्ट</a>, <a href="/hi/gstr-2b-reconciliation-excel">Excel में GSTR-2B रिकन्सिलिएशन</a>, <a href="/bulk-invoice-processing-for-ca">CA के लिए बल्क इनवॉइस प्रोसेसिंग</a>, <a href="/hi/features">15-अंकीय GSTIN सत्यापन और द्विभाषी OCR फीचर्स</a> तथा <a href="/hi/pricing">पारदर्शी CA प्रैक्टिस प्लान</a> देखें।</p>
        <p><a href="/app">मुफ़्त ट्रायल शुरू करें</a> · <a href="/contact">डेमो बुक करें</a></p>
        <section>
          <h2>भारतीय चार्टर्ड अकाउंटेंट्स के लिए निर्मित चार प्रमुख स्तंभ</h2>
          <ul>
            <li><strong>01. 15-अंकीय GSTIN सत्यापन:</strong> GSTR फाइलिंग से पहले 15-अंकीय GSTIN फ़ॉर्मेट, राज्य कोड (01–38), PAN संरचना और Mod-36 चेकसम को स्वचालित रूप से निकालता और सत्यापित करता है।</li>
            <li><strong>02. द्विभाषी बिल स्कैनर (अंग्रेज़ी + हिंदी):</strong> प्रिंटेड अंग्रेज़ी और देवनागरी हिंदी इनवॉइस से हेडर फ़ील्ड्स, लाइन आइटम और विक्रेता विवरण निकालता है।</li>
            <li><strong>03. क्लाइंट-स्कोप्ड डेटा आइसोलेशन:</strong> अपलोड की गई फ़ाइलों को OCR के दौरान मेमोरी में प्रोसेस किया जाता है, जबकि सहेजे गए क्लाइंट वर्कस्पेस और बिल प्रति-उपयोगकर्ता Firestore नियमों और वन-क्लिक डिलीट सुविधा से सुरक्षित रहते हैं।</li>
            <li><strong>04. डेवलपर-फ्रेंडली एक्सपोर्ट्स:</strong> निकाले गए डेटा को सीधे TallyPrime XML, Zoho Books CSV, Busy Excel, SQL, JSON या फ़ॉर्मेटेड XLSX फ़ाइलों के माध्यम से अपने मौजूदा अकाउंटिंग सिस्टम में भेजें।</li>
          </ul>
        </section>
        <section>
          <h2>भारतीय GST प्रैक्टिस के लिए 9 मुख्य क्षमताएं</h2>
          <ul>
            <li><strong>01. द्विभाषी अंग्रेज़ी + हिंदी OCR (eng+hin):</strong> क्षेत्रीय किराना बिलों, मंडी रसीदों और द्विभाषी टैक्स इनवॉइस से सटीक डेटा निकालता है। <a href="/invoice-ocr-for-ca">CA फर्मों के लिए इनवॉइस OCR देखें</a>।</li>
            <li><strong>02. 15-अंकीय GSTIN Mod-36 चेकसम सत्यापन:</strong> सप्लायर और खरीदार के GSTIN, 37 राज्य कोड और Mod-36 चेकसम की स्वचालित जांच करता है। <a href="/hi/features">GSTIN सत्यापन नियम देखें</a>।</li>
            <li><strong>03. HSN/SAC और टैक्स गणित (Tax Math) जांच:</strong> सत्यापित करता है कि Taxable Value + CGST + SGST + IGST का योग Grand Total से मेल खाता है और इंटर-स्टेट बनाम इंट्रा-स्टेट टैक्स विरोधाभास पकड़ता है। <a href="/gst-invoice-data-extraction">30+ निकाले गए फ़ील्ड्स देखें</a>।</li>
            <li><strong>04. TallyPrime XML वाउचर जनरेशन:</strong> कस्टम लेजर मैपिंग और प्री-एक्सपोर्ट वैलिडेशन के साथ मानक TallyPrime XML परचेस वाउचर जनरेट करता है। <a href="/hi/gst-invoice-to-tally">GST से TallyPrime XML कन्वर्टर देखें</a>।</li>
            <li><strong>05. 6-स्टेटस GSTR-2B रिकन्सिलिएशन इंजन:</strong> आपके परचेस रजिस्टर का पोर्टल GSTR-2B JSON या Excel फ़ाइल से मिलान करके Matched, Mismatch, In Books Only और In 2B Only बिलों की पहचान करता है। <a href="/hi/gstr-2b-reconciliation-excel">Excel में GSTR-2B रिकन्सिलिएशन देखें</a>।</li>
            <li><strong>06. मल्टी-फ़ाइल बैच प्रोसेसिंग क्यू (Queue):</strong> प्रति-फ़ाइल प्रोग्रेस ट्रैकिंग और डुप्लिकेट बिल पहचान के साथ दर्जनों PDF और इमेज बिल एक साथ प्रोसेस करें। <a href="/bulk-invoice-processing-for-ca">बल्क इनवॉइस प्रोसेसिंग देखें</a>।</li>
            <li><strong>07. क्लाइंट-वाइज़ GSTIN वर्कस्पेस:</strong> प्रत्येक क्लाइंट के लिए अलग वर्कस्पेस (नाम, GSTIN, PAN, वित्तीय वर्ष) बनाएं ताकि बिल, GSTR-2B मिलान और Tally XML एक्सपोर्ट अलग रहें।</li>
            <li><strong>08. मेकर-चेकर टीम एक्सेस (RBAC):</strong> फर्म के भीतर Owner/CA, Reviewer और Staff भूमिकाएं असाइन करें और ऑडिट ट्रेल के साथ बिल अप्रूवल वर्कफ़्लो चलाएं।</li>
            <li><strong>09. मल्टी-फ़ॉर्मेट एक्सपोर्ट और REST API:</strong> <a href="/hi/pdf-invoice-to-excel">Excel (.xlsx)</a>, Zoho Books CSV, Busy Excel, SQL, JSON या <a href="/api-docs">POST /api/v1/extract REST API</a> के माध्यम से एक्सपोर्ट करें।</li>
          </ul>
        </section>
        <section>
          <h2>तीन-चरणीय प्रैक्टिस वर्कफ़्लो</h2>
          <ol>
            <li><strong>01. क्लाइंट चुनें और इनवॉइस अपलोड करें:</strong> हेडर में अपना क्लाइंट वर्कस्पेस चुनें और सिंगल या बैच PDF, मल्टी-पेज स्टेटमेंट, Bill of Entry या मोबाइल फोटो अपलोड करें।</li>
            <li><strong>02. स्वचालित GST ऑडिट और समीक्षा क्यू (Review Queue):</strong> CA Saarthi AI हेडर और लाइन-आइटम फ़ील्ड्स निकालता है, GSTIN Mod-36 चेकसम सत्यापित करता है, डुप्लिकेट इनवॉइस चिह्नित करता है और CA Reviewer की स्वीकृति के लिए बिल भेजता है।</li>
            <li><strong>03. GSTR-2B मिलान करें और Tally में एक्सपोर्ट करें:</strong> स्वीकृत बिलों का पोर्टल GSTR-2B JSON/Excel फ़ाइलों से मिलान करें और TallyPrime XML वाउचर, Excel रजिस्टर, Zoho CSV या Busy शीट डाउनलोड करें।</li>
          </ol>
        </section>
        <section>
          <h2>क्लाइंट रिकॉर्ड्स के लिए सुरक्षा और डेटा आइसोलेशन</h2>
          <p>प्राथमिक OCR सर्वर डिस्क पर कच्ची फ़ाइलें लिखे बिना <code>/api/extract-document</code> के माध्यम से मेमोरी में चलता है। लॉग इन करने पर सहेजे गए क्लाइंट, बिल और ऑडिट ट्रेल प्रति-उपयोगकर्ता Firestore नियमों (<code>/users/&#123;uid&#125;/clients/&#123;clientId&#125;</code>) और HTTPS एन्क्रिप्शन के तहत सुरक्षित रहते हैं। <a href="/security">सुरक्षा आर्किटेक्चर पढ़ें</a>।</p>
        </section>
        <section>
          <h2>सोलो प्रैक्टिशनर्स और मल्टी-पार्टनर CA फर्मों के लिए प्लान</h2>
          ${PRACTICE_PRICING_PLANS_HI.map(
            (plan) => `<article>
            <h3>${escapeHtmlAttr(plan.name)} — ${escapeHtmlAttr(plan.price)}</h3>
            <p>${escapeHtmlAttr(plan.audience)}</p>
            <ul>${plan.features.map((f) => `<li>${escapeHtmlAttr(f)}</li>`).join('')}</ul>
          </article>`
          ).join('\n          ')}
          <p><a href="/hi/pricing">सभी प्राइसिंग प्लान विवरणों की तुलना करें</a> या <a href="/hi/features">सभी 9 GST प्रैक्टिस फीचर्स देखें</a>।</p>
        </section>
        ${
          pageFaqs.length > 0
            ? `<section><h2>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h2>${pageFaqs
                .map((f) => `<div><h3>${escapeHtmlAttr(f.question)}</h3><p>${escapeHtmlAttr(f.answer)}</p></div>`)
                .join('')}</section>`
            : ''
        }
      </main>
      ${sharedFooterHtml}
    </div>`;
  } else {
    ssrBodyHtml = `<div id="prerendered-route-shell">
      ${sharedNavHtml}
      ${breadcrumbNavHtml}
      <main>
        <h1>${escapeHtmlAttr(h1)}</h1>
        <p>${escapeHtmlAttr(hindiSpec ? hindiSpec.subtitle : description)}</p>
        <p>Bilingual AI OCR built exclusively for Indian CA firms. Scan English &amp; Hindi bills, validate 15-digit GSTINs with Mod-36 checksums, and export directly to <a href="/gst-invoice-to-tally">TallyPrime XML</a>, <a href="/gstr-2b-reconciliation-excel">GSTR-2B Reconciliation in Excel</a>, <a href="/pdf-invoice-to-excel">Excel (.xlsx)</a>, SQL, or JSON with client-scoped data isolation.</p>
        <section>
          <h2>Four Pillars Engineered for Indian Chartered Accountants</h2>
          <ul>
            <li><strong>01. 15-Digit GSTIN Validation:</strong> Automatically extracts and cross-verifies 15-digit GSTIN format, state code (01–38), PAN structure, and Mod-36 checksum before GSTR filing.</li>
            <li><strong>02. Bilingual Bill Scanner:</strong> Extract header fields, line items, and vendor details from printed English and Devanagari Hindi invoices.</li>
            <li><strong>03. Client-Scoped Data Isolation:</strong> Uploaded files are parsed in memory during OCR, while saved client workspaces and bills are isolated under per-user Firestore rules with one-click deletion.</li>
            <li><strong>04. Developer-Friendly Exports:</strong> Push extracted data directly into your existing systems via TallyPrime XML, Zoho Books CSV, Busy Excel, SQL, JSON, or formatted XLSX files.</li>
          </ul>
        </section>
        <section>
          <h2>Plans for Solo Practitioners &amp; Multi-Partner CA Firms</h2>
          ${PRACTICE_PRICING_PLANS.map(
            (plan) => `<article>
            <h3>${escapeHtmlAttr(plan.name)} — ${escapeHtmlAttr(plan.price)}</h3>
            <p>${escapeHtmlAttr(plan.audience)}</p>
            <ul>${plan.features.map((f) => `<li>${escapeHtmlAttr(f)}</li>`).join('')}</ul>
          </article>`
          ).join('\n          ')}
          <p><a href="/pricing">Compare full pricing plan details</a> or <a href="/features">inspect all 9 GST practice features</a>.</p>
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




