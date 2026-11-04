import React, { useState } from 'react';
import {
  ScanLine,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
  FileText,
  Sparkles,
  BookOpen,
  Building2,
  Scale,
  AlertTriangle,
  Database,
  Download,
  Clock,
  ChevronRight,
  HelpCircle,
  Lock,
  Mail,
  MapPin,
  Briefcase,
  Check,
  Upload,
} from 'lucide-react';
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  HOMEPAGE_FAQS,
  DEDICATED_SEO_PAGES,
  RESOURCE_ARTICLES,
} from '../seoContent';

interface MarketingProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenWorkspaceTab: (tab?: 'scanner' | 'master_sheet' | 'dashboard' | 'history', mode?: 'normal_user' | 'ca_mode') => void;
  savedBillsCount: number;
}

export const LedgerSutraHeroBanner: React.FC<{
  onOpenWorkspaceTab: (tab?: 'scanner' | 'master_sheet' | 'dashboard' | 'history', mode?: 'normal_user' | 'ca_mode') => void;
  onTriggerUpload?: () => void;
  savedBillsCount: number;
}> = ({ onOpenWorkspaceTab, onTriggerUpload, savedBillsCount }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 lg:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{BRAND_TAGLINE}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12] text-[var(--text-main)]">
              Stop Entering Invoices Manually.{' '}
              <span className="text-indigo-500">Let AI Do the Heavy Lifting.</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl">
              LedgerSutra helps Indian CA firms extract invoice data, digitize financial documents and organize
              accounting information with AI-powered OCR and intelligent document processing.
            </p>

            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              <strong className="text-[var(--text-main)]">Brand Positioning:</strong> &ldquo;Turn invoices, bills and
              financial documents into structured, searchable accounting data — without repetitive manual data
              entry.&rdquo;
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => {
                  const wsEl = document.getElementById('live-ocr-workspace');
                  if (wsEl) {
                    wsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    onOpenWorkspaceTab('scanner', 'ca_mode');
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <ScanLine className="w-4 h-4" />
                Explore Invoice Automation
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works-section')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-indigo-500/10 text-[var(--text-main)] border border-[var(--border-color)] text-sm font-bold transition-all cursor-pointer"
              >
                See How It Works
              </button>

              {onTriggerUpload && (
                <button
                  onClick={onTriggerUpload}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Upload Test Invoice Now
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--border-color)] text-xs">
              <div>
                <span className="font-bold text-[var(--text-main)] block">15-Char GSTIN</span>
                <span className="text-[var(--text-muted)]">State & PAN Validator</span>
              </div>
              <div>
                <span className="font-bold text-[var(--text-main)] block">English + Hindi</span>
                <span className="text-[var(--text-muted)]">Bilingual Bill OCR</span>
              </div>
              <div>
                <span className="font-bold text-[var(--text-main)] block">1 Bill = 1 Row</span>
                <span className="text-[var(--text-muted)]">+ Line-Item Audit Mode</span>
              </div>
              <div>
                <span className="font-bold text-[var(--text-main)] block">Multi-Export</span>
                <span className="text-[var(--text-muted)]">.XLSX, .CSV, .JSON, .SQL</span>
              </div>
            </div>
          </div>

          {/* Genuine Live Application Interface Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold tracking-tight">
                    LedgerSutra CA Audit Console (Live Preview)
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-semibold">
                  GSTR-2B Ready
                </span>
              </div>

              <div className="bg-[var(--bg-card)] rounded-xl p-3.5 border border-[var(--border-color)] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)] font-medium">Detected Supplier</span>
                  <span className="font-bold">SHREE GANESH TRADERS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)] font-medium">Seller GSTIN</span>
                  <span className="font-mono font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 24AAACS1234F1Z5 (Gujarat)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)] font-medium">Invoice No & Date</span>
                  <span className="font-mono font-semibold">SGT/26-27/0842 • 2026-10-31</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border-color)] text-center">
                  <div className="p-2 rounded-lg bg-[var(--bg-subtle)]">
                    <span className="block text-[10px] text-[var(--text-muted)]">Taxable Value</span>
                    <span className="font-mono font-bold">₹14,500.00</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--bg-subtle)]">
                    <span className="block text-[10px] text-[var(--text-muted)]">CGST + SGST</span>
                    <span className="font-mono font-bold text-amber-500">₹2,610.00</span>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <span className="block text-[10px] text-indigo-500 font-semibold">Grand Total</span>
                    <span className="font-mono font-black text-indigo-500">₹17,110.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] rounded-xl p-3 border border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[var(--text-muted)] uppercase">Automated CA Audit Checks</span>
                  <span className="text-emerald-500 font-bold">3 / 3 Passed</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-500">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>15-Char GSTIN Format & State Code (24-Gujarat) Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-500">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>Tax Math Verified: Taxable + 18% GST = Grand Total</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-500">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>No Duplicate Invoice Collision in Active Register ({savedBillsCount} Bills)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const wsEl = document.getElementById('live-ocr-workspace');
                  if (wsEl) wsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-500 font-bold text-xs flex items-center justify-center gap-1.5 border border-indigo-500/20 cursor-pointer"
              >
                <span>Jump to Live Interactive Scanner Below</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
  );
};

export const LedgerSutraHomepageSections: React.FC<{
  onNavigate: (path: string) => void;
  onOpenWorkspaceTab: (tab?: 'scanner' | 'master_sheet' | 'dashboard' | 'history', mode?: 'normal_user' | 'ca_mode') => void;
  onTriggerUpload?: () => void;
  savedBillsCount: number;
}> = ({ onNavigate, onOpenWorkspaceTab }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="space-y-16 pb-12 pt-4">
      {/* =================================================================== */}
      {/* SECTION 2: CA INDUSTRY PROBLEMS                                     */}
      {/* =================================================================== */}
      <section className="space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
            The Compliance Bottleneck in Indian Accounting Firms
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Why Manual Invoice Entry Drains CA Firm Productivity Every Month
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)]">
            Between the 1st and 20th of every month, Chartered Accountants, tax consultants, and article assistants face
            relentless manual data entry pressure from unorganized client bills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: 'Hours Lost Typing Client Vouchers',
              desc: 'Clients share hundreds of purchase bills via WhatsApp photos, scanned PDFs, and paper folders right before GSTR-1 and GSTR-3B filing deadlines.',
            },
            {
              title: '15-Digit GSTIN & Invoice Typos',
              desc: 'A single transposed character in a Seller GSTIN or invoice number causes GSTR-2B reconciliation mismatches and delays legitimate Input Tax Credit (ITC).',
            },
            {
              title: 'Broken PDF-to-Excel Copy-Pasting',
              desc: 'Copying tables from multi-page PDFs into Excel scrambles HSN codes, quantities, and CGST/SGST columns into unusable cells.',
            },
            {
              title: 'Duplicate Bills & Tax Math Errors',
              desc: 'When clients accidentally upload both a photo and a PDF of the same invoice, manual entry teams risk recording duplicate vouchers.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 space-y-2.5 shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-mono font-bold text-sm">
                0{i + 1}
              </div>
              <h3 className="text-sm font-bold">{item.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 3: THE LEDGERSUTRA SOLUTION                                 */}
      {/* =================================================================== */}
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
            The LedgerSutra Solution
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Built Specifically for Indian GST Invoices, Retail Bills & Audit Registers
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)]">
            LedgerSutra bridges raw client documents and your accounting spreadsheets—combining AI Vision, coordinate
            PDF parsing, bilingual English + Hindi OCR, and deterministic CA validation rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
            <h3 className="text-base font-bold flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-indigo-500" />
              Hybrid OCR + PDF Coordinate Engine
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Extracts digital PDF text layers with exact X/Y baseline alignment while running 2.0x High-DPI contrast
              enhancement and bilingual English + Hindi OCR on scanned images.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
            <h3 className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Pre-Accounting GST & Math Validation
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Automatically checks 15-character Seller & Buyer GSTIN format against all 37 Indian State/UT codes, flags
              duplicate invoice numbers, and verifies that Taxable + GST equals Grand Total.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
            <h3 className="text-base font-bold flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
              1-Bill-1-Row & CA Line-Item Modes
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Keep your register clean with 1 row per bill (and automatic Product 1..N columns for multi-item bills), or
              switch in one click to CA Detailed Line-Item rows and Supplier-Wise GSTR summaries.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 4: HOW THE PLATFORM WORKS                                   */}
      {/* =================================================================== */}
      <section id="how-it-works-section" className="space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            4-Step Automated Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How LedgerSutra Works — From Raw Bill to Audit-Ready Excel
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)]">
            No complex templates or training required. Process single invoices or multi-file client batches in four
            transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: 'Step 01',
              title: 'Upload PDFs or Bill Images',
              desc: 'Select single or multiple JPG, JPEG, PNG, or multi-page PDF bills—or append directly to an existing .xlsx sheet.',
            },
            {
              step: 'Step 02',
              title: 'AI OCR & Field Extraction',
              desc: 'LedgerSutra extracts verbatim raw text, Seller/Buyer GSTIN, Invoice No, Date, HSN/SAC, and CGST/SGST/IGST splits.',
            },
            {
              step: 'Step 03',
              title: 'CA Validation & Review',
              desc: 'Inspect the side-by-side preview, check GSTIN state badges, resolve any duplicate or math alerts, and edit any cell.',
            },
            {
              step: 'Step 04',
              title: 'Export Excel, CSV, JSON or SQL',
              desc: 'Download a multi-sheet .xlsx workbook, CSV register, structured JSON, or relational SQL script immediately.',
            },
          ].map((st, idx) => (
            <div
              key={idx}
              className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 space-y-3 relative"
            >
              <span className="inline-block text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500">
                {st.step}
              </span>
              <h3 className="text-sm font-bold">{st.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 5: CORE PRODUCT FEATURES (A, B, C, D)                       */}
      {/* =================================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              CA-Focused Product Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Core Capabilities Engineered for Accounting Accuracy
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/features')}
            className="text-xs font-bold text-indigo-500 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            View Full Feature Breakdown <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-3">
            <span className="text-xs font-mono font-bold text-indigo-500">A. SMART INVOICE OCR</span>
            <h3 className="text-lg font-bold">High-DPI Multi-Page PDF & Bilingual Image OCR</h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Upload JPG, JPEG, PNG, and multi-page PDF files (single or batch).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Support English and Devanagari Hindi (`eng+hin`) OCR for regional bills.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>2.0x High-DPI canvas contrast enhancement for shadowed or tilted photos.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>100% verbatim extracted text output with one-click Copy and `.TXT` download.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-500">B. INTELLIGENT GST DATA EXTRACTION</span>
            <h3 className="text-lg font-bold">Structured Header, GSTIN & Tax Split Capture</h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Extracts Supplier Name, Seller GSTIN, Buyer Name, and Buyer GSTIN.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Captures Invoice Number, Bill Date, Place of Supply, and Payment Mode.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Separates Taxable Subtotal, CGST, SGST, IGST, Discount, and Grand Total.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Includes live QR code scanner for B2B e-Invoice and UPI payment receipts.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-3">
            <span className="text-xs font-mono font-bold text-amber-500">C. LINE-ITEM & DYNAMIC TABLE ENGINE</span>
            <h3 className="text-lg font-bold">Every Product Row + Custom Dynamic Columns</h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Captures Item Description, HSN/SAC Code, Quantity, Unit, Rate, GST %, and Line Total.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Auto-expands horizontal `Product 1..Product N` columns in 1-Bill-1-Row mode.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Discovers dynamic extra fields (e.g., Batch No, Expiry, MRP, Vehicle No).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Interactive side-by-side table editor to add, edit, or remove line items.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-3">
            <span className="text-xs font-mono font-bold text-indigo-500">D. MULTI-FORMAT EXPORT & RECONCILIATION</span>
            <h3 className="text-lg font-bold">Excel (.XLSX), CSV, JSON, SQL & Supplier Rollups</h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Export multi-sheet Excel (`.xlsx`) with custom column selection and SUM row.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Append newly scanned bills into an existing `.xlsx` purchase register.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>One-click export to `.CSV`, structured `.JSON`, and relational `.SQL` (`CREATE` + `INSERT`).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Supplier-Wise / GSTIN-Wise summary view for rapid GSTR-2B reconciliation.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 6: DESIGNED FOR CA WORKFLOWS                                */}
      {/* =================================================================== */}
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Tailored for Indian Practice Workflows
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Designed Around Real Chartered Accountant & Tax Consultant Tasks
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)]">
            Explore dedicated workflow guides and landing pages built for specific compliance tasks in your firm:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(DEDICATED_SEO_PAGES).map((page) => (
            <div
              key={page.path}
              onClick={() => onNavigate(page.path)}
              className="p-5 rounded-2xl bg-[var(--bg-subtle)] hover:bg-indigo-500/5 border border-[var(--border-color)] hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500">
                  {page.badge}
                </span>
                <h3 className="text-sm font-bold group-hover:text-indigo-500 transition-colors">{page.h1}</h3>
                <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">{page.subtitle}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-500">
                <span>Explore Workflow</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 7: SUPPORTED DOCUMENTS & FORMATS                            */}
      {/* =================================================================== */}
      <section className="space-y-5">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
            Universal Document Compatibility
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Supported Documents, File Formats & Export Schemas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 space-y-2">
            <h3 className="text-sm font-bold">Input File Formats</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              <strong>PDF (.pdf)</strong> (digital ERP PDFs & scanned multi-page PDFs),{' '}
              <strong>JPEG (.jpg, .jpeg)</strong>, <strong>PNG (.png)</strong>, existing{' '}
              <strong>Excel (.xlsx, .xls, .csv)</strong> for sheet appending, and live webcam/image{' '}
              <strong>QR Codes</strong>.
            </p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 space-y-2">
            <h3 className="text-sm font-bold">Supported Indian Bill Types</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              B2B GST Tax Invoices, Retail & Wholesale Purchase Bills, Supermarket & Kirana Receipts, Pharma & Medical
              Distributor Bills, Hardware & Textile Invoices, and Bilingual English + Hindi Bills.
            </p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 space-y-2">
            <h3 className="text-sm font-bold">Structured Output Formats</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Multi-Sheet <strong>Excel (.xlsx)</strong>, UTF-8 <strong>CSV (.csv)</strong>, Structured NoSQL{' '}
              <strong>JSON (.json)</strong>, Relational <strong>SQL (.sql)</strong> (`CREATE TABLE` + `INSERT INTO`),
              and Verbatim <strong>Text (.txt)</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 8: SECURITY & DATA PRIVACY                                  */}
      {/* =================================================================== */}
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500">
              <Lock className="w-4 h-4" />
              <span>Security, Confidentiality & Data Control</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Built for Client Confidentiality & Transparent Data Ownership
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Chartered Accountants handle sensitive financial records. LedgerSutra is engineered with transparent data
              handling so you stay in complete control of your client documents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-1/2">
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1">
              <h3 className="text-xs font-bold">Server-Side API Key Isolation</h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                AI Vision extraction routes execute through backend proxy endpoints without exposing credentials in the
                browser.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1">
              <h3 className="text-xs font-bold">Local Fallback OCR</h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                PDF coordinate extraction and Tesseract OCR run directly in your browser memory when offline or local
                processing is preferred.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1">
              <h3 className="text-xs font-bold">Instant Record Deletion</h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Delete any individual invoice row or clear your workspace history at any time with immediate effect.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1">
              <h3 className="text-xs font-bold">Human-in-the-Loop Verification</h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Every extracted figure is paired with the source visual preview and verbatim text for audit sign-off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 9: FREQUENTLY ASKED QUESTIONS                               */}
      {/* =================================================================== */}
      <section className="space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Common Questions from Chartered Accountants & Finance Teams
          </h2>
        </div>

        <div className="space-y-3">
          {HOMEPAGE_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm hover:bg-[var(--bg-subtle)]/50 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-indigo-500 shrink-0 transition-transform ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-color)]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 10: STRONG FINAL CTA                                        */}
      {/* =================================================================== */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white p-8 sm:p-10 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
            Ready to Automate Your Next Client Batch?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Transform Invoices & Bills into Structured Accounting Data Today
          </h2>
          <p className="text-sm text-indigo-100 leading-relaxed">
            Use the live LedgerSutra workspace right below—or open the full-screen CA console—to scan PDFs, validate
            GSTINs, and export clean Excel, CSV, JSON, and SQL sheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => {
              const wsEl = document.getElementById('live-ocr-workspace');
              if (wsEl) {
                wsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                onOpenWorkspaceTab('scanner', 'ca_mode');
              }
            }}
            className="px-6 py-3.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-sm font-extrabold shadow-md cursor-pointer flex items-center gap-2"
          >
            <ScanLine className="w-4 h-4" />
            Launch Live Scanner
          </button>
          <button
            onClick={() => onNavigate('/resources')}
            className="px-5 py-3.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/40 text-white border border-indigo-300/30 text-sm font-bold cursor-pointer"
          >
            Browse CA Resource Guides
          </button>
        </div>
      </section>
    </div>
  );
};

// ============================================================================
// DEDICATED ROUTE VIEWS (/features, /how-it-works, /pricing, /about, /contact,
// /resources, /resources/:slug, and the 6 High-Intent CA SEO Landing Pages)
// ============================================================================
export const LedgerSutraRouteView: React.FC<MarketingProps> = ({
  currentPath,
  onNavigate,
  onOpenWorkspaceTab,
}) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    firmName: '',
    email: '',
    city: '',
    monthlyVolume: '500 - 2,500 Invoices / Month',
    message: '',
  });

  // 1. Check if currentPath matches one of the 6 Dedicated CA SEO Landing Pages
  if (DEDICATED_SEO_PAGES[currentPath]) {
    const page = DEDICATED_SEO_PAGES[currentPath];
    return (
      <div className="space-y-10 pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <button onClick={() => onNavigate('/')} className="hover:text-indigo-500 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--text-main)] font-semibold">{page.badge}</span>
        </nav>

        {/* Hero Banner */}
        <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-5">
          <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            {page.badge}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{page.h1}</h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed">{page.subtitle}</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              Open Live {page.badge} Workspace
            </button>
            <button
              onClick={() => onOpenWorkspaceTab('master_sheet', 'ca_mode')}
              className="px-4 py-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-indigo-500/10 border border-[var(--border-color)] text-xs sm:text-sm font-bold cursor-pointer"
            >
              View Merged Excel Register
            </button>
          </div>
        </section>

        {/* Problem Statement & Workflow Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-4">
            <span className="text-xs font-bold uppercase text-rose-500">The Accounting Challenge</span>
            <h2 className="text-lg font-bold">Why Manual Processing Slows Down Your Firm</h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">{page.problemStatement}</p>
            <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
              <span className="text-xs font-bold uppercase text-[var(--text-muted)]">
                Key Fields Extracted Automatically:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {page.extractedFields.map((field, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-4">
            <span className="text-xs font-bold uppercase text-indigo-500">Step-by-Step Execution</span>
            <h2 className="text-lg font-bold">How LedgerSutra Automates This Workflow</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {page.workflowSteps.map((step, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5"
                >
                  <h3 className="text-xs sm:text-sm font-bold text-indigo-500">{step.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Capabilities & CA Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-4">
            <h2 className="text-lg font-bold">Technical Capabilities</h2>
            <div className="space-y-3">
              {page.keyCapabilities.map((cap, i) => (
                <div key={i} className="space-y-1">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {cap.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] pl-6 leading-relaxed">{cap.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-4">
            <h2 className="text-lg font-bold">Real-World CA Firm Use Cases</h2>
            <ul className="space-y-3">
              {page.caUseCases.map((uc, i) => (
                <li
                  key={i}
                  className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs sm:text-sm font-medium flex items-start gap-2.5"
                >
                  <Briefcase className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Page-Specific FAQs */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-4">
          <h2 className="text-lg font-bold">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {page.faqs.map((faq, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5"
              >
                <h3 className="text-xs sm:text-sm font-bold">{faq.question}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Check if currentPath matches a Resource Article (/resources/:slug)
  const matchedArticle = RESOURCE_ARTICLES.find((a) => a.path === currentPath);
  if (matchedArticle) {
    return (
      <article className="max-w-4xl mx-auto space-y-8 pb-12">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
          <button onClick={() => onNavigate('/')} className="hover:text-indigo-500 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => onNavigate('/resources')} className="hover:text-indigo-500 cursor-pointer">
            CA Resource Center
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--text-main)] font-semibold truncate max-w-xs">{matchedArticle.title}</span>
        </nav>

        <header className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6 sm:p-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-500 font-bold">
              {matchedArticle.category}
            </span>
            <span className="text-[var(--text-muted)] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {matchedArticle.readTime}
            </span>
            <span className="text-[var(--text-muted)]">Published: {matchedArticle.publishedDate}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {matchedArticle.title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">{matchedArticle.summary}</p>
        </header>

        {/* Key Takeaways Box */}
        <div className="bg-indigo-500/5 rounded-2xl border border-indigo-500/20 p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-500">Key Practice Takeaways</h2>
          <ul className="space-y-2">
            {matchedArticle.keyTakeaways.map((kt, i) => (
              <li key={i} className="text-xs sm:text-sm flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{kt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Article Sections */}
        <div className="space-y-6">
          {matchedArticle.sections.map((sec, idx) => (
            <section
              key={idx}
              className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 sm:p-8 space-y-4"
            >
              <h2 className="text-lg sm:text-xl font-bold">{sec.heading}</h2>
              {sec.paragraphs.map((p, pi) => (
                <p key={pi} className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {p}
                </p>
              ))}
              {sec.checklist && (
                <ul className="space-y-2 pt-2">
                  {sec.checklist.map((item, ci) => (
                    <li
                      key={ci}
                      className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs sm:text-sm flex items-start gap-2.5"
                    >
                      <Check className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Article FAQ */}
        {matchedArticle.faqs.length > 0 && (
          <section className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-4">
            <h2 className="text-lg font-bold">Frequently Asked Questions</h2>
            {matchedArticle.faqs.map((f, i) => (
              <div key={i} className="space-y-1">
                <h3 className="text-sm font-bold">{f.question}</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)]">{f.answer}</p>
              </div>
            ))}
          </section>
        )}

        {/* Try it live CTA */}
        <div className="rounded-2xl bg-[var(--bg-card)] border border-indigo-500/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold">Put This Guide Into Practice with LedgerSutra</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Scan client PDFs and images, validate 15-character GSTINs, and export Excel registers in seconds.
            </p>
          </div>
          <button
            onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 cursor-pointer"
          >
            Open Live Workspace
          </button>
        </div>
      </article>
    );
  }

  // 3. CA Resource Center Hub (/resources)
  if (currentPath === '/resources') {
    return (
      <div className="space-y-8 pb-12">
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6 sm:p-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            LedgerSutra Knowledge Base
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            CA Resource Center — Guides on GST Invoice OCR & Practice Automation
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl">
            In-depth technical guides, CGST Rule 46 checklists, and workflow playbooks written for Indian Chartered
            Accountants, GST practitioners, and accounting teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESOURCE_ARTICLES.map((art) => (
            <div
              key={art.slug}
              onClick={() => onNavigate(art.path)}
              className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] hover:border-indigo-500/40 p-6 flex flex-col justify-between gap-4 cursor-pointer transition-all group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-bold">
                    {art.category}
                  </span>
                  <span className="text-[var(--text-muted)]">{art.readTime}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold group-hover:text-indigo-500 transition-colors">
                  {art.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{art.summary}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 pt-2 border-t border-[var(--border-color)]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Complete Guide</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. Core SaaS Page: /features
  if (currentPath === '/features') {
    return (
      <div className="space-y-8 pb-12">
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6 sm:p-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Platform Capabilities</span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Every Feature Needed to Turn Unstructured Bills into Audit-Ready Data
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl">
            LedgerSutra combines verbatim OCR, structured GST field extraction, real-time CA validation rules, and
            flexible multi-format exports in one unified workspace.
          </p>
          <button
            onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <ScanLine className="w-4 h-4" /> Try All Features in Live Workspace
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: '15-Char Indian GSTIN Validator',
              desc: 'Verifies regex structure, maps 2-digit State Codes (01–38), and extracts the embedded 10-character PAN automatically.',
            },
            {
              title: 'Duplicate Invoice Alerting',
              desc: 'Detects when an invoice number from the same Seller GSTIN or Shop Name already exists in your active register.',
            },
            {
              title: 'Tax Math Consistency Check',
              desc: 'Checks whether Taxable Subtotal + CGST + SGST + IGST minus Discount matches the Invoice Grand Total.',
            },
            {
              title: '1 Bill = 1 Row + Grocery Columns',
              desc: 'Keeps single-cost bills on 1 row while automatically adding Product 1, Product 2... columns for multi-item receipts.',
            },
            {
              title: 'Supplier-Wise GSTR Rollup',
              desc: 'Aggregates all scanned bills by Seller GSTIN so CAs can compare vendor totals against GSTR-2B in seconds.',
            },
            {
              title: 'Append to Existing Excel (.XLSX)',
              desc: 'Import an existing client Excel sheet and append newly scanned bills directly into the same workbook.',
            },
            {
              title: 'Bilingual English + Hindi OCR',
              desc: 'Extracts text from both English and Devanagari Hindi invoices using High-DPI canvas preprocessing.',
            },
            {
              title: 'QR Code & e-Invoice Scanner',
              desc: 'Decode B2B GST QR payloads and UPI payment QR codes via webcam or uploaded image.',
            },
            {
              title: 'Excel, CSV, JSON & SQL Exports',
              desc: 'Download multi-sheet .xlsx workbooks, UTF-8 CSVs, structured JSON, or relational SQL CREATE/INSERT scripts.',
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 space-y-2"
            >
              <h2 className="text-sm font-bold text-indigo-500">{feat.title}</h2>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. Core SaaS Page: /how-it-works
  if (currentPath === '/how-it-works') {
    return (
      <div className="space-y-8 pb-12">
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6 sm:p-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Technical Workflow</span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            How LedgerSutra Processes, Validates & Exports Financial Documents
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl">
            Designed around the real-world document challenges of Indian CA offices—handling everything from digital
            ERP PDFs to tilted mobile camera photos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              step: 'Stage 1: High-DPI Document Rendering & Preprocessing',
              detail:
                'When you upload a PDF or image, LedgerSutra renders PDF pages at 2.0x scale and applies luminance contrast normalization so faint thermal ink, small HSN digits, and GSTIN characters become crisp.',
            },
            {
              step: 'Stage 2: Hybrid Coordinate + AI Vision + Bilingual OCR',
              detail:
                'For digital PDFs, X/Y text coordinates are grouped into horizontal baselines. Simultaneously, our hybrid AI Vision and client-side Tesseract (`eng+hin`) engine extracts verbatim text and structured fields.',
            },
            {
              step: 'Stage 3: Deterministic CA Audit & Exception Flagging',
              detail:
                'Every extracted bill runs through deterministic rules: 15-character GSTIN verification, state code lookup, duplicate invoice detection, and Taxable + Tax = Grand Total verification.',
            },
            {
              step: 'Stage 4: Multi-Mode Consolidation & Export',
              detail:
                'Review your bills in "1 Bill = 1 Row" mode, "CA Detailed Line-Item" mode, or "Supplier-Wise Summary" mode—then export to Excel (.xlsx), CSV, JSON, or SQL.',
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-2.5"
            >
              <h2 className="text-base font-bold text-indigo-500">{s.step}</h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Core SaaS Page: /pricing
  if (currentPath === '/pricing') {
    return (
      <div className="space-y-8 pb-12">
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6 sm:p-10 space-y-3 text-center max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Transparent Practice Tiers
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Simple, Honest Plans for Solo Practitioners & Multi-Partner CA Firms
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto">
            Start scanning, validating, and exporting invoices immediately in the live workspace with zero credit card
            required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-emerald-500">Live Interactive Access</span>
              <h2 className="text-xl font-extrabold">Practitioner Workspace</h2>
              <p className="text-2xl font-black font-mono">
                ₹0 <span className="text-xs font-normal text-[var(--text-muted)]">/ instant browser access</span>
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Full access to the live Invoice OCR, GST validation, and Excel/CSV/SQL export workspace.
              </p>
              <ul className="space-y-2 pt-3 border-t border-[var(--border-color)] text-xs">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> PDF & Image Bill OCR (English + Hindi)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> 15-Char GSTIN & Tax Math Validation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> 1-Bill-1-Row & CA Line-Item Modes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Export to .XLSX, .CSV, .JSON, .SQL & .TXT
                </li>
              </ul>
            </div>
            <button
              onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
            >
              Launch Workspace Now
            </button>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl border-2 border-indigo-500 p-6 flex flex-col justify-between space-y-6 shadow-md">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-indigo-500">For Growing CA Practices</span>
              <h2 className="text-xl font-extrabold">CA Firm Team Edition</h2>
              <p className="text-2xl font-black font-mono">
                Custom <span className="text-xs font-normal text-[var(--text-muted)]">/ per practice workflow</span>
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Designed for Chartered Accountant firms handling high-volume monthly client GST folders.
              </p>
              <ul className="space-y-2 pt-3 border-t border-[var(--border-color)] text-xs">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-500" /> Everything in Practitioner Workspace
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-500" /> Supplier-Wise GSTR-2B Summary Rollups
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-500" /> Append to Existing Client .XLSX Registers
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-500" /> Custom Column Presets for Audit Teams
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('/contact')}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
            >
              Request CA Firm Onboarding
            </button>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-amber-500">Enterprise Finance & ERP</span>
              <h2 className="text-xl font-extrabold">Custom ERP & API</h2>
              <p className="text-2xl font-black font-mono">
                Bespoke <span className="text-xs font-normal text-[var(--text-muted)]">/ dedicated deployment</span>
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Custom database schemas, dedicated private cloud deployment, and bespoke ERP export mappers.
              </p>
              <ul className="space-y-2 pt-3 border-t border-[var(--border-color)] text-xs">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Custom SQL & NoSQL Database Schemas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Industry-Specific Invoice Templates
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Dedicated Support & Onboarding
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('/contact')}
              className="w-full py-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-indigo-500/10 border border-[var(--border-color)] text-xs font-bold cursor-pointer"
            >
              Contact Solutions Team
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 7. Core SaaS Page: /about
  if (currentPath === '/about') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6 sm:p-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">About {BRAND_NAME}</span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Eliminating Repetitive Manual Data Entry for Indian Accounting Professionals
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            LedgerSutra (`https://casaarthiai.in`) was built with a single mission: to give Chartered Accountants, tax
            consultants, article assistants, and finance teams an intelligent, reliable way to turn unstructured bills
            and PDFs into verified accounting registers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-3">
            <h2 className="text-lg font-bold">Why We Built LedgerSutra</h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Generic OCR tools fail on Indian invoices because they don’t understand 15-character GSTIN state codes,
              HSN/SAC columns, CGST/SGST/IGST splits, or bilingual Hindi + English bills. Furthermore, everyday users
              and accountants often want 1 bill per row in Excel without losing product-level visibility. LedgerSutra
              solves both in a single unified platform.
            </p>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-3">
            <h2 className="text-lg font-bold">Our Engineering Principles</h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-muted)]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Human-in-the-Loop Transparency:</strong> Always show the original document and verbatim raw
                  text beside extracted numbers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Deterministic Validation:</strong> Pair AI extraction with strict GSTIN regex and tax math
                  checks.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Lock-In:</strong> Export your data cleanly to `.xlsx`, `.csv`, `.json`, `.sql`, or `.txt`
                  at any time.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 8. Core SaaS Page: /contact
  if (currentPath === '/contact') {
    const handleContactSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setContactSubmitted(true);
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6 sm:p-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Contact & Onboarding</span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Connect with the LedgerSutra CA Workflow Team
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)]">
            Have questions about bulk invoice processing, custom Excel/SQL column templates, or onboarding your CA
            practice? Reach out below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-5">
            <h2 className="text-base font-bold">Direct Practice Support</h2>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0 mt-1" />
                <div>
                  <span className="font-bold block">Email Support</span>
                  <span className="text-[var(--text-muted)]">support@casaarthiai.in</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-1" />
                <div>
                  <span className="font-bold block">Primary Market</span>
                  <span className="text-[var(--text-muted)]">
                    India (Serving Chartered Accountants, GST Practitioners & Finance Teams Nationwide)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
              <h3 className="text-xs font-bold">Need Immediate Invoice Extraction?</h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                The full LedgerSutra scanner and Excel merger is live right now in your browser.
              </p>
              <button
                onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
                className="w-full py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                Open Live Scanner
              </button>
            </div>
          </div>

          <div className="md:col-span-7 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6">
            {contactSubmitted ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Inquiry Recorded</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto">
                  Thank you, {contactForm.name || 'Partner'}. Your workflow requirements for{' '}
                  {contactForm.firmName || 'your practice'} have been logged. You can continue using the live workspace
                  immediately.
                </p>
                <button
                  onClick={() => setContactSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-bold cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-[var(--text-muted)] mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="CA Rajesh Sharma"
                      className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-[var(--text-muted)] mb-1">
                      CA Firm / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.firmName}
                      onChange={(e) => setContactForm((p) => ({ ...p, firmName: e.target.value }))}
                      placeholder="Sharma & Associates, Chartered Accountants"
                      className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-[var(--text-muted)] mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="partner@cafirm.in"
                      className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-[var(--text-muted)] mb-1">
                      Estimated Monthly Bill Volume
                    </label>
                    <select
                      value={contactForm.monthlyVolume}
                      onChange={(e) => setContactForm((p) => ({ ...p, monthlyVolume: e.target.value }))}
                      className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                    >
                      <option>Up to 500 Invoices / Month</option>
                      <option>500 - 2,500 Invoices / Month</option>
                      <option>2,500 - 10,000 Invoices / Month</option>
                      <option>10,000+ Invoices / Month</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[var(--text-muted)] mb-1">
                    Workflow & Integration Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us about your GST invoice types, custom Excel columns, or ERP integration needs..."
                    className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl p-3 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
                >
                  Submit CA Practice Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ============================================================================
// SECTION 11: PROFESSIONAL FOOTER WITH INTERNAL SEO LINKS & DISCLAIMER
// ============================================================================
export const LedgerSutraFooter: React.FC<{
  onNavigate: (path: string) => void;
  onOpenWorkspaceTab: (tab?: 'scanner' | 'master_sheet' | 'dashboard' | 'history', mode?: 'normal_user' | 'ca_mode') => void;
}> = ({ onNavigate, onOpenWorkspaceTab }) => {
  return (
    <footer className="bg-[var(--bg-card)] border-t border-[var(--border-color)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Identity */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-sm">
                <ScanLine className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight block">{BRAND_NAME}</span>
                <span className="text-[11px] text-[var(--text-muted)] block">https://casaarthiai.in</span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-sm">
              {BRAND_TAGLINE}. Turn invoices, bills and financial documents into structured, searchable accounting data
              — without repetitive manual data entry.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                Open CA Workspace
              </button>
              <button
                onClick={() => onOpenWorkspaceTab('master_sheet', 'normal_user')}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
              >
                Merged Excel Sheet
              </button>
            </div>
          </div>

          {/* Col 2: Core Platform Links */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">Platform</h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-indigo-500 cursor-pointer">
                  Homepage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/app')} className="hover:text-indigo-500 cursor-pointer">
                  Live OCR & GST Workspace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/features')} className="hover:text-indigo-500 cursor-pointer">
                  Product Features
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/how-it-works')} className="hover:text-indigo-500 cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/pricing')} className="hover:text-indigo-500 cursor-pointer">
                  Practice Plans & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-indigo-500 cursor-pointer">
                  About LedgerSutra
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-indigo-500 cursor-pointer">
                  Contact & Onboarding
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: High-Intent CA Workflows (SEO Landing Pages) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              CA & GST Solutions
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <button
                  onClick={() => onNavigate('/invoice-ocr-for-ca')}
                  className="hover:text-indigo-500 cursor-pointer text-left"
                >
                  Invoice OCR for CA Firms
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/gst-invoice-data-extraction')}
                  className="hover:text-indigo-500 cursor-pointer text-left"
                >
                  GST Invoice Data Extraction
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/pdf-invoice-to-excel')}
                  className="hover:text-indigo-500 cursor-pointer text-left"
                >
                  PDF Invoice to Excel (.XLSX)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/bulk-invoice-processing')}
                  className="hover:text-indigo-500 cursor-pointer text-left"
                >
                  Bulk Invoice Processing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/invoice-automation-for-accountants')}
                  className="hover:text-indigo-500 cursor-pointer text-left"
                >
                  Automation for Accountants
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/document-scanning-software')}
                  className="hover:text-indigo-500 cursor-pointer text-left"
                >
                  Document Scanning Software
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: CA Resource Center Articles */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              CA Resource Center
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <button
                  onClick={() => onNavigate('/resources')}
                  className="font-semibold text-indigo-500 hover:underline cursor-pointer text-left"
                >
                  All CA Guides & Checklists →
                </button>
              </li>
              {RESOURCE_ARTICLES.slice(0, 5).map((art) => (
                <li key={art.slug}>
                  <button
                    onClick={() => onNavigate(art.path)}
                    className="hover:text-indigo-500 cursor-pointer text-left line-clamp-1"
                  >
                    {art.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mandatory Professional Disclaimer */}
        <div className="pt-6 border-t border-[var(--border-color)] space-y-3 text-xs text-[var(--text-muted)]">
          <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] leading-relaxed">
            <strong className="text-[var(--text-main)]">Professional Compliance Disclaimer:</strong> LedgerSutra is a
            document-processing and accounting workflow support tool. Users and Chartered Accountants should review and
            verify extracted data before filing taxes, GST returns or official financial statements.
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
            <span>
              © {new Date().getFullYear()} {BRAND_NAME} (casaarthiai.in). Built for Indian Chartered Accountants, Tax
              Consultants & Finance Teams.
            </span>
            <span>Supports English + Hindi OCR • Multi-Sheet .XLSX • CSV • JSON • SQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
