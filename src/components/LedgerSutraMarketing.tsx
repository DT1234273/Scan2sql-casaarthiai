import React, { useMemo, useState } from 'react';
import {
  ScanLine,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
  AlertTriangle,
  Database,
  HelpCircle,
  Lock,
  Mail,
  Briefcase,
  Check,
  Upload,
  FileCode2,
  Code2,
  LogIn,
  Search,
  ChevronDown,
  SlidersHorizontal,
  Building2,
  FileCheck2,
  Clock,
  Receipt,
} from 'lucide-react';
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  SITE_DOMAIN,
  HOMEPAGE_FAQS,
  DEDICATED_SEO_PAGES,
  RESOURCE_ARTICLES,
  normalizePathname,
} from '../seoContent';
import heroStudioImg from '../assets/images/ledgersutra_hero_studio_1794578857550.jpg';
import invoiceAuditImg from '../assets/images/ledgersutra_invoice_audit_1794578856952.jpg';
import caWorkspaceImg from '../assets/images/ledgersutra_ca_workspace_1794578858193.jpg';

// ============================================================================
// RESILIENT EDITORIAL IMAGE COMPONENT (ZERO-BROKEN-IMAGE FALLBACK)
// ============================================================================
const EditorialVisual: React.FC<{
  src: string;
  alt: string;
  fallbackTitle: string;
  fallbackSubtitle: string;
  className?: string;
}> = ({ src, alt, fallbackTitle, fallbackSubtitle, className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-end p-6 ${className}`}
      >
        <div className="space-y-1.5 text-slate-100">
          <Receipt className="w-6 h-6 text-indigo-400" />
          <div className="text-sm font-semibold">{fallbackTitle}</div>
          <div className="text-xs text-slate-300">{fallbackSubtitle}</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className={className}
    />
  );
};

// ============================================================================
// BUILT-IN 3 SAMPLE INVOICES FOR INSTANT NO-LOGIN LIVE DEMO (PART 7.2)
// ============================================================================
interface DemoSampleInvoice {
  id: string;
  label: string;
  meta: string;
  tallyCompany: string;
  gstr2bStatus: 'Matched' | 'ITC Eligible (2B Verified)' | 'Multi-HSN Split';
  data: {
    invoiceNumber: string;
    billDate: string;
    dueDate: string;
    shopName: string;
    sellerGstin: string;
    supplierPan: string;
    supplierState: string;
    buyerName: string;
    buyerGstin: string;
    placeOfSupply: string;
    irn: string;
    ewayBillNo: string;
    poNumber: string;
    paymentTerms: string;
    bankName: string;
    bankAccountNo: string;
    bankIfsc: string;
    currency: string;
    subtotal: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    discountAmount: number;
    otherCharges: number;
    roundOff: number;
    grandTotal: number;
    items: Array<{
      itemName: string;
      hsnSac: string;
      quantity: number;
      unit: string;
      unitPrice: number;
      gstRate: number;
      taxableValue: number;
      lineTotal: number;
    }>;
  };
}

const BUILTIN_DEMO_SAMPLES: DemoSampleInvoice[] = [
  {
    id: 'sample_b2b_intra',
    label: 'Intra-State B2B Tax Invoice',
    meta: 'Maharashtra 27 · CGST 9% + SGST 9%',
    tallyCompany: 'Deshmukh Precision Engineering LLP',
    gstr2bStatus: 'Matched',
    data: {
      invoiceNumber: 'INV/26-27/0842',
      billDate: '2026-10-18',
      dueDate: '2026-11-17',
      shopName: 'Kulkarni Industrial Components Pvt Ltd',
      sellerGstin: '27AABCK4829M1Z5',
      supplierPan: 'AABCK4829M',
      supplierState: '27-Maharashtra',
      buyerName: 'Deshmukh Precision Engineering LLP',
      buyerGstin: '27AAEFD9102K1Z2',
      placeOfSupply: '27-Maharashtra',
      irn: '8f4b2c9012e84719a0c31b7d4e6f981234567890abcdef1234567890abcdef12',
      ewayBillNo: '241098451209',
      poNumber: 'PO-DPE-2026-119',
      paymentTerms: 'Net 30 Days',
      bankName: 'HDFC Bank Ltd',
      bankAccountNo: '50200048192011',
      bankIfsc: 'HDFC0000142',
      currency: 'INR',
      subtotal: 45000,
      cgstAmount: 4050,
      sgstAmount: 4050,
      igstAmount: 0,
      discountAmount: 0,
      otherCharges: 0,
      roundOff: 0,
      grandTotal: 53100,
      items: [
        {
          itemName: 'CNC Machined Spindle Bearing Housing',
          hsnSac: '8483',
          quantity: 10,
          unit: 'NOS',
          unitPrice: 3200,
          gstRate: 18,
          taxableValue: 32000,
          lineTotal: 37760,
        },
        {
          itemName: 'High-Tensile Hex Fastener Kit M12',
          hsnSac: '7318',
          quantity: 20,
          unit: 'SET',
          unitPrice: 650,
          gstRate: 18,
          taxableValue: 13000,
          lineTotal: 15340,
        },
      ],
    },
  },
  {
    id: 'sample_b2b_inter',
    label: 'Inter-State SaaS & IT Services Bill',
    meta: 'Karnataka 29 to Delhi 07 · IGST 18%',
    tallyCompany: 'Verma & Co Chartered Accountants',
    gstr2bStatus: 'ITC Eligible (2B Verified)',
    data: {
      invoiceNumber: 'BLR/SAAS/2026/319',
      billDate: '2026-10-24',
      dueDate: '2026-11-08',
      shopName: 'NammaCloud Infrastructure Technologies Pvt Ltd',
      sellerGstin: '29AADCN7712F1Z8',
      supplierPan: 'AADCN7712F',
      supplierState: '29-Karnataka',
      buyerName: 'Verma & Co Chartered Accountants',
      buyerGstin: '07AABFV3319N1Z4',
      placeOfSupply: '07-Delhi',
      irn: '3a9d1e7744c81230f9b21a6d8e4c11223344556677889900aabbccddeeff0011',
      ewayBillNo: 'Not Applicable (SAC 9983)',
      poNumber: 'WO-DEL-88',
      paymentTerms: 'Net 15 Days',
      bankName: 'ICICI Bank Ltd',
      bankAccountNo: '000205031984',
      bankIfsc: 'ICIC0000002',
      currency: 'INR',
      subtotal: 80000,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 14400,
      discountAmount: 2000,
      otherCharges: 0,
      roundOff: 0,
      grandTotal: 94400,
      items: [
        {
          itemName: 'Dedicated Cloud Accounting Server Hosting (Q3)',
          hsnSac: '998315',
          quantity: 1,
          unit: 'QTR',
          unitPrice: 60000,
          gstRate: 18,
          taxableValue: 60000,
          lineTotal: 70800,
        },
        {
          itemName: 'Automated Encrypted Offsite Backup Add-on',
          hsnSac: '998313',
          quantity: 1,
          unit: 'QTR',
          unitPrice: 20000,
          gstRate: 18,
          taxableValue: 20000,
          lineTotal: 23600,
        },
      ],
    },
  },
  {
    id: 'sample_boe_import',
    label: 'Wholesale Multi-HSN & Round-Off Bill',
    meta: 'Gujarat 24 · 5% GST + Freight + Round-Off',
    tallyCompany: 'Mehta Apparel Exports Pvt Ltd',
    gstr2bStatus: 'Multi-HSN Split',
    data: {
      invoiceNumber: 'SRT/TEX/26/4901',
      billDate: '2026-10-28',
      dueDate: '2026-11-27',
      shopName: 'Suryauratna Synthetic Mills Ltd',
      sellerGstin: '24AAACS9104P1Z1',
      supplierPan: 'AAACS9104P',
      supplierState: '24-Gujarat',
      buyerName: 'Mehta Apparel Exports Pvt Ltd',
      buyerGstin: '24AABCM6641R1Z9',
      placeOfSupply: '24-Gujarat',
      irn: '7c2e9f0182b34657d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f',
      ewayBillNo: '681902348112',
      poNumber: 'PO/MAE/442',
      paymentTerms: '30 Days Credit',
      bankName: 'State Bank of India',
      bankAccountNo: '30918273645',
      bankIfsc: 'SBIN0000482',
      currency: 'INR',
      subtotal: 125450,
      cgstAmount: 3136.25,
      sgstAmount: 3136.25,
      igstAmount: 0,
      discountAmount: 550,
      otherCharges: 250,
      roundOff: 0.5,
      grandTotal: 131723,
      items: [
        {
          itemName: 'Polynosic Woven Fabric Roll 60-Inch',
          hsnSac: '5407',
          quantity: 500,
          unit: 'MTR',
          unitPrice: 210,
          gstRate: 5,
          taxableValue: 105000,
          lineTotal: 110250,
        },
        {
          itemName: 'Industrial Bobbin Thread Cones',
          hsnSac: '5401',
          quantity: 90,
          unit: 'BOX',
          unitPrice: 227.22,
          gstRate: 5,
          taxableValue: 20450,
          lineTotal: 21472.5,
        },
      ],
    },
  },
];

function buildSampleTallyXmlPreview(inv: DemoSampleInvoice['data']): string {
  const tallyDate = inv.billDate.replace(/-/g, '');
  const taxLines =
    inv.igstAmount > 0
      ? `        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>Input IGST</LEDGERNAME>
          <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
          <AMOUNT>-${inv.igstAmount.toFixed(2)}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>`
      : `        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>Input CGST</LEDGERNAME>
          <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
          <AMOUNT>-${inv.cgstAmount.toFixed(2)}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>
        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>Input SGST</LEDGERNAME>
          <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
          <AMOUNT>-${inv.sgstAmount.toFixed(2)}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>`;

  return `<ENVELOPE>
  <HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC><REPORTNAME>Vouchers</REPORTNAME></REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE>
          <VOUCHER VCHTYPE="Purchase" ACTION="Create">
            <DATE>${tallyDate}</DATE>
            <REFERENCE>${inv.invoiceNumber}</REFERENCE>
            <PARTYLEDGERNAME>${inv.shopName}</PARTYLEDGERNAME>
            <PARTYGSTIN>${inv.sellerGstin}</PARTYGSTIN>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${inv.shopName}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>${inv.grandTotal.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Purchase GST</LEDGERNAME>
              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
              <AMOUNT>-${inv.subtotal.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
${taxLines}
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
}

function getTodayDemoScanKey(): string {
  const d = new Date().toISOString().slice(0, 10);
  return `ledgersutra_demo_scans_${d}`;
}

function getBrowserDemoScansUsed(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return Number(localStorage.getItem(getTodayDemoScanKey()) || '0') || 0;
  } catch {
    return 0;
  }
}

function incrementBrowserDemoScans(): number {
  if (typeof window === 'undefined') return 1;
  try {
    const next = getBrowserDemoScansUsed() + 1;
    localStorage.setItem(getTodayDemoScanKey(), String(next));
    return next;
  } catch {
    return 1;
  }
}

// ============================================================================
// SECTION 1: EXECUTIVE HERO BANNER + INTERACTIVE PIPELINE CARD (PART 7.1)
// ============================================================================
export const LedgerSutraHeroBanner: React.FC<{
  onOpenWorkspaceTab: (
    tab?: 'scanner' | 'master_sheet' | 'dashboard' | 'history',
    mode?: 'normal_user' | 'ca_mode'
  ) => void;
  onTriggerUpload?: () => void;
  onNavigate?: (path: string) => void;
  savedBillsCount: number;
}> = ({ onOpenWorkspaceTab, onTriggerUpload, onNavigate, savedBillsCount }) => {
  const [heroStage, setHeroStage] = useState<'extract' | 'tally' | 'gstr2b' | 'compare'>('extract');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Narrative & Primary CTA */}
          <div className="lg:col-span-7 p-4 sm:p-8 lg:p-12 flex flex-col justify-between space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-medium text-[var(--text-muted)]">
                <img
                  src="/ca-saarthi-icon.svg"
                  alt="CA Saarthi AI - Invoice OCR Tool"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain shadow-xs shrink-0"
                />
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 min-w-0">
                  <span className="font-display font-extrabold text-sm tracking-tight inline-flex items-baseline gap-1 shrink-0">
                    <span className="bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-300 dark:to-orange-400 bg-clip-text text-transparent">
                      CA
                    </span>
                    <span className="text-[var(--text-main)]">Saarthi</span>
                    <span className="bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      AI
                    </span>
                  </span>
                  <span aria-hidden="true" className="hidden sm:inline text-[var(--text-muted)]">·</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-[11px] sm:text-xs leading-snug">
                    {BRAND_TAGLINE}
                  </span>
                </div>
              </div>

              <h1
                className="font-display font-extrabold tracking-tight leading-[1.08] text-[var(--text-main)]"
                style={{ fontSize: 'clamp(1.68rem, 4.8vw, 3.45rem)' }}
              >
                Automate GST Invoice Data Entry in Seconds.
              </h1>

              <h2 className="text-sm sm:text-lg font-normal text-[var(--text-muted)] leading-relaxed max-w-2xl">
                Bilingual AI OCR built exclusively for Indian CA firms. Scan English &amp; Hindi
                bills, validate GSTINs automatically, and export directly to SQL or Excel with 100%
                data privacy.
              </h2>

              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3">
                  <button
                    onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('/contact');
                      } else {
                        onOpenWorkspaceTab('scanner', 'ca_mode');
                      }
                    }}
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--border-color)] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Mail className="w-4 h-4 text-indigo-500" />
                    <span>Book a Demo</span>
                  </button>

                  {onTriggerUpload && (
                    <button
                      onClick={() => {
                        onOpenWorkspaceTab('scanner', 'ca_mode');
                        onTriggerUpload();
                      }}
                      className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-elevated)] text-indigo-600 dark:text-indigo-400 border border-[var(--border-color)] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Invoice ({savedBillsCount} Saved)</span>
                    </button>
                  )}
                </div>

                {/* Trust Badge / Micro-copy under CTA */}
                <p className="text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>🔒 Local Fallback OCR | Zero Server-Side Data Retention</span>
                </p>
              </div>
            </div>

            {/* Clean 4-Column Architectural Proof Row + Long-Tail SEO Paragraph */}
            <div className="space-y-3 pt-5 sm:pt-6 border-t border-[var(--border-color)] text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <div className="font-semibold text-[var(--text-main)]">15-Digit GSTIN Audit</div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">Mod-36 checksum &amp; PAN check</div>
                </div>
                <div>
                  <div className="font-semibold text-[var(--text-main)]">Bilingual OCR</div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">English &amp; Hindi bill scanner</div>
                </div>
                <div>
                  <div className="font-semibold text-[var(--text-main)]">TallyPrime &amp; 2B</div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">XML vouchers &amp; 6-status match</div>
                </div>
                <div>
                  <div className="font-semibold text-[var(--text-main)]">SQL, JSON &amp; XLSX</div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">Developer-ready exports</div>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Engineered as the <strong>Best OCR software for invoices India</strong>, delivering{' '}
                <strong>Automated GST data extraction for CA firms</strong> with an accurate{' '}
                <strong>Hindi bilingual bill scanner</strong>.
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Studio Photography + 4-Mode Upper Command Inspector */}
          <div className="lg:col-span-5 relative min-h-[340px] sm:min-h-[370px] lg:min-h-full bg-slate-950 border-t lg:border-t-0 lg:border-l border-[var(--border-color)] flex flex-col justify-end">
            <EditorialVisual
              src={heroStudioImg}
              alt="CA Saarthi AI - Invoice OCR Tool dashboard and GST data extraction for Indian CA firms"
              fallbackTitle="CA Saarthi AI Practice Audit Desk"
              fallbackSubtitle="Purchase bills to TallyPrime XML, SQL, and GSTR-2B Excel"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />

            <div className="relative z-10 p-4 sm:p-6 space-y-3 text-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-300">
                  Live Practice Output &amp; Benchmark
                </span>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900/95 border border-slate-700/80 overflow-x-auto no-scrollbar max-w-full">
                  {[
                    { id: 'extract' as const, label: '01. GST Fields' },
                    { id: 'tally' as const, label: '02. Tally XML' },
                    { id: 'gstr2b' as const, label: '03. GSTR-2B' },
                    { id: 'compare' as const, label: '04. vs Others' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setHeroStage(tab.id)}
                      className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        heroStage === tab.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/95 border border-slate-800 p-3.5 sm:p-4 text-[11px] sm:text-xs font-mono tabular-nums space-y-2.5 backdrop-blur-xs">
                {heroStage === 'extract' && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">Supplier GSTIN</span>
                      <span className="text-emerald-400 font-semibold break-all sm:break-normal">27AABCK4829M1Z5 (Valid Mod-36)</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">Invoice / Date</span>
                      <span className="text-slate-100">INV/26-27/0842 · 2026-10-18</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">Taxable + CGST + SGST</span>
                      <span className="text-slate-100 font-semibold">₹45,000 + ₹4,050 + ₹4,050</span>
                    </div>
                  </>
                )}

                {heroStage === 'tally' && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">Voucher Type</span>
                      <span className="text-indigo-300 font-semibold">Purchase · Action: Create</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">Party Credit (ISDEEMEDPOSITIVE=No)</span>
                      <span className="text-slate-100">₹53,100.00</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">Purchase + Tax Debits</span>
                      <span className="text-emerald-400">-₹45,000 / -₹4,050 / -₹4,050</span>
                    </div>
                  </>
                )}

                {heroStage === 'gstr2b' && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">Normalized Invoice Key</span>
                      <span className="text-slate-100 break-all sm:break-normal">27AABCK4829M1Z5 · INV26270842</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">Portal vs Books Delta</span>
                      <span className="text-emerald-400 font-semibold">₹0.00 Variance</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">Reconciliation Status</span>
                      <span className="text-emerald-400 font-semibold">Matched · ITC Eligible</span>
                    </div>
                  </>
                )}

                {heroStage === 'compare' && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">Tally Pre-Export Blocker Check</span>
                      <span className="text-emerald-400 font-semibold">Built-In (vs None in Basic OCR)</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">GSTR-2B 6-Status Excel Match</span>
                      <span className="text-emerald-400 font-semibold">Included (JSON + XLSX)</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">Exports Supported</span>
                      <span className="text-slate-100">Tally XML · Zoho · Busy · SQL</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Section (4 Pillars Beating Enterprise Competition) */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Core Features · Built for Indian Chartered Accountants
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-main)] mt-0.5">
              Four Pillars Engineered to Outperform Generic Enterprise OCR
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Best OCR software for invoices India · Automated GST data extraction for CA firms · Hindi bilingual bill scanner
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: '01.',
              title: '15-Digit GSTIN Validation',
              copy: 'Built for India. Automatically extracts and cross-verifies 15-digit GSTINs from complex invoice layouts to ensure flawless GSTR filing.',
            },
            {
              num: '02.',
              title: 'Bilingual Bill Scanner',
              copy: 'Regional bills are no longer a bottleneck. Flawlessly extract line items and vendor details from both English and Hindi invoices.',
            },
            {
              num: '03.',
              title: 'Military-Grade Data Privacy',
              copy: "Your clients' financial data never lingers. With our Local Fallback OCR and instant record deletion, your data is processed and purged immediately.",
            },
            {
              num: '04.',
              title: 'Developer-Friendly Exports',
              copy: 'Say goodbye to manual copy-pasting. Push extracted data directly into your existing systems via SQL, JSON, or download formatted XLSX files.',
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between space-y-2.5"
            >
              <div className="space-y-1.5">
                <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {pillar.num}
                </div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">{pillar.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{pillar.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Section Wayfinder Strip — Keeps Users Exploring */}
      <nav
        aria-label="Homepage workflow sections"
        className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium text-[var(--text-muted)]"
      >
        {[
          { id: 'live-no-login-demo', label: '01. Live Demo (No Login)' },
          { id: 'live-ocr-workspace', label: '02. Full OCR & GSTR-2B Workspace' },
          { id: 'practice-roi-estimator', label: '03. Time-Saved & Competitor Matrix' },
          { id: 'ca-suite-capabilities', label: '04. 9 Core Capabilities' },
          { id: 'extracted-fields-explorer', label: '05. 30+ Extracted Fields' },
          { id: 'practice-pricing-plans', label: '06. Plans & FAQ' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-indigo-500/50 hover:text-[var(--text-main)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </section>
  );
};

// ============================================================================
// SECTIONS 2 TO 10: ORDERED PUBLIC LANDING PAGE SECTIONS (PART 7.2 - 7.10)
// ============================================================================
const ALL_EXTRACTED_FIELDS: Array<{
  name: string;
  category: 'party' | 'einvoice' | 'tax' | 'boe';
  categoryLabel: string;
}> = [
  { name: 'Supplier Name (Party Ledger)', category: 'party', categoryLabel: 'Party & GSTIN' },
  { name: 'Supplier 15-Digit GSTIN', category: 'party', categoryLabel: 'Party & GSTIN' },
  { name: 'Supplier 10-Digit PAN', category: 'party', categoryLabel: 'Party & GSTIN' },
  { name: 'Supplier Address & State Code', category: 'party', categoryLabel: 'Party & GSTIN' },
  { name: 'Buyer Name & Buyer GSTIN', category: 'party', categoryLabel: 'Party & GSTIN' },
  { name: 'Buyer Address & State Code', category: 'party', categoryLabel: 'Party & GSTIN' },
  { name: 'Place of Supply (POS)', category: 'party', categoryLabel: 'Party & GSTIN' },
  { name: 'Invoice Number & Voucher Type', category: 'einvoice', categoryLabel: 'E-Invoice & Logistics' },
  { name: 'Invoice Date & Due Date', category: 'einvoice', categoryLabel: 'E-Invoice & Logistics' },
  { name: '64-Character e-Invoice IRN', category: 'einvoice', categoryLabel: 'E-Invoice & Logistics' },
  { name: '12-Digit e-Way Bill Number', category: 'einvoice', categoryLabel: 'E-Invoice & Logistics' },
  { name: 'e-Invoice QR Code Data', category: 'einvoice', categoryLabel: 'E-Invoice & Logistics' },
  { name: 'Purchase Order (PO) Number', category: 'einvoice', categoryLabel: 'E-Invoice & Logistics' },
  { name: 'Payment Terms & Mode', category: 'einvoice', categoryLabel: 'E-Invoice & Logistics' },
  { name: 'Bank Name, Account No & IFSC', category: 'tax', categoryLabel: 'Tax & Bank Math' },
  { name: 'Invoice Currency (INR / Forex)', category: 'tax', categoryLabel: 'Tax & Bank Math' },
  { name: 'Line Item Description', category: 'tax', categoryLabel: 'Tax & Bank Math' },
  { name: 'HSN / SAC Code per Row', category: 'tax', categoryLabel: 'Tax & Bank Math' },
  { name: 'Quantity, Unit (UOM) & Rate', category: 'tax', categoryLabel: 'Tax & Bank Math' },
  { name: 'Taxable Value (Subtotal)', category: 'tax', categoryLabel: 'Tax & Bank Math' },
  { name: 'CGST Rate & Amount', category: 'tax', categoryLabel: 'Tax & Bank Math' },
  { name: 'SGST / UTGST Rate & Amount', category: 'tax', categoryLabel: 'Tax & Bank Math' },
  { name: 'IGST Rate & Amount', category: 'tax', categoryLabel: 'Tax & Bank Math' },
  { name: 'Trade Discount & Other Charges', category: 'tax', categoryLabel: 'Tax & Bank Math' },
  { name: 'Round-Off Adjustment', category: 'tax', categoryLabel: 'Tax & Bank Math' },
  { name: 'Final Grand Total', category: 'tax', categoryLabel: 'Tax & Bank Math' },
  { name: 'Bill of Entry (BOE) Number & Date', category: 'boe', categoryLabel: 'Import BOE' },
  { name: 'Customs Port Code (Import BOE)', category: 'boe', categoryLabel: 'Import BOE' },
];

export const LedgerSutraHomepageSections: React.FC<{
  onNavigate: (path: string) => void;
  onOpenWorkspaceTab: (
    tab?: 'scanner' | 'master_sheet' | 'dashboard' | 'history',
    mode?: 'normal_user' | 'ca_mode'
  ) => void;
  onTriggerUpload?: () => void;
  savedBillsCount: number;
  onSignInRequest?: () => void;
}> = ({ onNavigate, onOpenWorkspaceTab, onSignInRequest }) => {
  // Live Demo State
  const [selectedSampleId, setSelectedSampleId] = useState<string>(BUILTIN_DEMO_SAMPLES[0].id);
  const [demoViewTab, setDemoViewTab] = useState<'table' | 'tally_xml' | 'gstr2b' | 'json'>('table');
  const [scansUsedToday, setScansUsedToday] = useState<number>(() => getBrowserDemoScansUsed());
  const [customDemoResult, setCustomDemoResult] = useState<DemoSampleInvoice['data'] | null>(null);
  const [customDemoLoading, setCustomDemoLoading] = useState(false);
  const [customDemoError, setCustomDemoError] = useState('');

  // Interactive Time-Saved Calculator State
  const [monthlyInvoices, setMonthlyInvoices] = useState<number>(600);
  const [clientCount, setClientCount] = useState<number>(25);
  const [include2bReconciliation, setInclude2bReconciliation] = useState<boolean>(true);

  // Field Explorer Filter State
  const [fieldCategory, setFieldCategory] = useState<'all' | 'party' | 'einvoice' | 'tax' | 'boe'>('all');
  const [fieldSearch, setFieldSearch] = useState('');

  // Interactive Workspace Spotlight State
  const [previewMode, setPreviewMode] = useState<'tally' | 'gstr2b' | 'queue'>('tally');

  // Interactive FAQ Accordion & Category State
  const [faqCategory, setFaqCategory] = useState<'All' | 'Tally' | 'GSTR-2B' | 'Security' | 'General'>('All');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const activeSample =
    BUILTIN_DEMO_SAMPLES.find((s) => s.id === selectedSampleId) || BUILTIN_DEMO_SAMPLES[0];
  const displayedInvoice = customDemoResult || activeSample.data;

  const estimatedTimeStats = useMemo(() => {
    const manualMinPerInvoice = 3.5;
    const automatedMinPerInvoice = 0.6;
    const reconExtraManualHours = include2bReconciliation ? Math.round(clientCount * 1.4) : 0;
    const reconAutomatedHours = include2bReconciliation ? Math.round(clientCount * 0.25) : 0;

    const manualHours = Math.round((monthlyInvoices * manualMinPerInvoice) / 60) + reconExtraManualHours;
    const withLedgerSutraHours =
      Math.round((monthlyInvoices * automatedMinPerInvoice) / 60) + reconAutomatedHours;
    const hoursSaved = Math.max(0, manualHours - withLedgerSutraHours);
    return { manualHours, withLedgerSutraHours, hoursSaved };
  }, [monthlyInvoices, clientCount, include2bReconciliation]);

  const filteredFields = useMemo(() => {
    const q = fieldSearch.trim().toLowerCase();
    return ALL_EXTRACTED_FIELDS.filter((f) => {
      if (fieldCategory !== 'all' && f.category !== fieldCategory) return false;
      if (q && !f.name.toLowerCase().includes(q) && !f.categoryLabel.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [fieldCategory, fieldSearch]);

  const filteredFaqs = useMemo(() => {
    return HOMEPAGE_FAQS.filter((faq) => {
      if (faqCategory === 'All') return true;
      const text = `${faq.question} ${faq.answer}`.toLowerCase();
      if (faqCategory === 'Tally') return text.includes('tally') || text.includes('xml') || text.includes('zoho');
      if (faqCategory === 'GSTR-2B') return text.includes('2b') || text.includes('itc') || text.includes('reconcil');
      if (faqCategory === 'Security') return text.includes('secur') || text.includes('data') || text.includes('firestore') || text.includes('team');
      return !text.includes('tally') && !text.includes('2b') && !text.includes('secur');
    });
  }, [faqCategory]);

  const handleCustomDemoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const used = getBrowserDemoScansUsed();
    if (used >= 3) {
      setCustomDemoError(
        'You have used all 3 free browser scans for today. Please sign in with Google to scan more invoices.'
      );
      return;
    }

    setCustomDemoLoading(true);
    setCustomDemoError('');
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const dataUrl = await base64Promise;
      const res = await fetch('/api/extract-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          images: [{ mimeType: file.type || 'image/jpeg', data: dataUrl }],
        }),
      });
      const json = await res.json();
      const nextCount = incrementBrowserDemoScans();
      setScansUsedToday(nextCount);

      if (json.success && json.data) {
        const d = json.data;
        setCustomDemoResult({
          invoiceNumber: d.invoiceNumber || 'INV-DEMO',
          billDate: d.billDate || new Date().toISOString().slice(0, 10),
          dueDate: d.dueDate || '—',
          shopName: d.shopName || file.name,
          sellerGstin: d.sellerGstin || '—',
          supplierPan: d.supplierPan || (d.sellerGstin ? d.sellerGstin.slice(2, 12) : '—'),
          supplierState: d.supplierState || d.placeOfSupply || '—',
          buyerName: d.buyerName || '—',
          buyerGstin: d.buyerGstin || '—',
          placeOfSupply: d.placeOfSupply || '—',
          irn: d.irn || '—',
          ewayBillNo: d.ewayBillNo || '—',
          poNumber: d.poNumber || '—',
          paymentTerms: d.paymentTerms || '—',
          bankName: d.bankName || '—',
          bankAccountNo: d.bankAccountNo || '—',
          bankIfsc: d.bankIfsc || '—',
          currency: d.currency || 'INR',
          subtotal: Number(d.subtotal) || 0,
          cgstAmount: Number(d.cgstAmount) || 0,
          sgstAmount: Number(d.sgstAmount) || 0,
          igstAmount: Number(d.igstAmount) || 0,
          discountAmount: Number(d.discountAmount) || 0,
          otherCharges: Number(d.otherCharges) || 0,
          roundOff: Number(d.roundOff) || 0,
          grandTotal: Number(d.grandTotal) || 0,
          items: Array.isArray(d.billItems) ? d.billItems : [],
        });
      } else {
        setCustomDemoError(
          'Uploaded file queued. Use the full workspace scanner above for multi-page PDF rendering and OCR fallback.'
        );
      }
    } catch {
      setCustomDemoError('Could not process sample upload right now. Please try one of the 3 built-in samples.');
    } finally {
      setCustomDemoLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* =================================================================== */}
      {/* SECTION 2: INTERACTIVE SPLIT LIVE DEMO (NO LOGIN REQUIRED)          */}
      {/* =================================================================== */}
      <section
        id="live-no-login-demo"
        className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-8 space-y-5 sm:space-y-6 scroll-mt-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-color)] pb-4 sm:pb-5">
          <div className="space-y-1">
            <div className="text-xs font-medium text-[var(--text-muted)]">
              Interactive Extraction Sandbox · No Login Required ·{' '}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {Math.max(0, 3 - scansUsedToday)} of 3 custom demo scans remaining today
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
              Inspect GST Invoice Extraction, TallyPrime XML &amp; JSON Live
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {scansUsedToday < 3 ? (
              <label className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors whitespace-nowrap shrink-0">
                <Upload className="w-4 h-4" />
                <span>{customDemoLoading ? 'Extracting Invoice...' : 'Upload Sample Invoice'}</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleCustomDemoUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <button
                onClick={onSignInRequest}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogIn className="w-4 h-4" />
                <span>Daily 3-Scan Limit Reached — Sign in for More</span>
              </button>
            )}
          </div>
        </div>

        {customDemoError && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>{customDemoError}</span>
            {onSignInRequest && (
              <button
                onClick={onSignInRequest}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold shrink-0 cursor-pointer"
              >
                Sign In with Google
              </button>
            )}
          </div>
        )}

        {/* 3 Built-in Sample Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
          {BUILTIN_DEMO_SAMPLES.map((samp, index) => {
            const isSelected = !customDemoResult && selectedSampleId === samp.id;
            return (
              <button
                key={samp.id}
                onClick={() => {
                  setCustomDemoResult(null);
                  setSelectedSampleId(samp.id);
                }}
                className={`p-3.5 sm:p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/5'
                    : 'border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-indigo-500/40'
                }`}
              >
                <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                  Sample 0{index + 1} · {samp.meta}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--text-main)] mt-1">{samp.label}</div>
              </button>
            );
          })}
        </div>

        {/* Split Invoice Document Preview (Left) + 4-Way Inspector (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left: Interactive Document Sheet View */}
          <div className="lg:col-span-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-medium text-[var(--text-muted)]">
                    Tax Invoice Preview
                  </div>
                  <div className="text-sm font-bold text-[var(--text-main)] mt-0.5 break-words">
                    {displayedInvoice.shopName}
                  </div>
                  <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 mt-0.5 break-all">
                    GSTIN: {displayedInvoice.sellerGstin}
                  </div>
                </div>
                <div className="sm:text-right font-mono text-xs tabular-nums shrink-0">
                  <div className="font-semibold text-[var(--text-main)]">
                    {displayedInvoice.invoiceNumber}
                  </div>
                  <div className="text-[var(--text-muted)]">{displayedInvoice.billDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="min-w-0">
                  <div className="text-[11px] text-[var(--text-muted)]">Billed To</div>
                  <div className="font-semibold text-[var(--text-main)] truncate">
                    {displayedInvoice.buyerName}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--text-muted)] break-all">
                    {displayedInvoice.buyerGstin}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-[var(--text-muted)]">Place of Supply &amp; Logistics</div>
                  <div className="font-medium text-[var(--text-main)]">{displayedInvoice.placeOfSupply}</div>
                  <div className="font-mono text-[11px] text-[var(--text-muted)] truncate">
                    e-Way: {displayedInvoice.ewayBillNo}
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border-color)] pt-3 space-y-2">
                {displayedInvoice.items.map((item, idx) => (
                  <div key={idx} className="flex items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <div className="font-medium text-[var(--text-main)] break-words sm:truncate">
                        {item.itemName}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--text-muted)]">
                        HSN {item.hsnSac} · {item.quantity} {item.unit} × ₹{item.unitPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="font-mono font-semibold text-[var(--text-main)] tabular-nums shrink-0">
                      ₹{item.taxableValue.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--border-color)] pt-3 space-y-1.5 text-xs font-mono tabular-nums">
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Taxable Value</span>
                <span>₹{displayedInvoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {displayedInvoice.igstAmount > 0 ? (
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>IGST</span>
                  <span>₹{displayedInvoice.igstAmount.toLocaleString('en-IN')}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>CGST</span>
                    <span>₹{displayedInvoice.cgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>SGST</span>
                    <span>₹{displayedInvoice.sgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between pt-2 border-t border-[var(--border-color)] text-sm font-bold text-[var(--text-main)]">
                <span>Grand Total ({displayedInvoice.currency})</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  ₹{displayedInvoice.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Right: 4-Tab Interactive Output Switcher */}
          <div className="lg:col-span-7 flex flex-col space-y-4 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] overflow-x-auto no-scrollbar max-w-full">
                {[
                  { id: 'table' as const, label: 'Accounting Table' },
                  { id: 'tally_xml' as const, label: 'TallyPrime XML' },
                  { id: 'gstr2b' as const, label: 'GSTR-2B Check' },
                  { id: 'json' as const, label: 'Raw JSON API' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDemoViewTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      demoViewTab === tab.id
                        ? 'bg-[var(--bg-card)] text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums truncate">
                IRN: {displayedInvoice.irn.slice(0, 14)}…
              </span>
            </div>

            {demoViewTab === 'table' && (
              <div className="space-y-4 flex-1 flex flex-col justify-between min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                    <div className="text-[11px] text-[var(--text-muted)]">Supplier PAN</div>
                    <div className="font-mono font-semibold text-[var(--text-main)] mt-0.5">
                      {displayedInvoice.supplierPan}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                    <div className="text-[11px] text-[var(--text-muted)]">PO / Payment Terms</div>
                    <div className="font-semibold text-[var(--text-main)] mt-0.5 truncate">
                      {displayedInvoice.poNumber} · {displayedInvoice.paymentTerms}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                    <div className="text-[11px] text-[var(--text-muted)]">Bank &amp; IFSC</div>
                    <div className="font-mono font-semibold text-[var(--text-main)] mt-0.5 truncate">
                      {displayedInvoice.bankName} ({displayedInvoice.bankIfsc})
                    </div>
                  </div>
                </div>

                <div className="border border-[var(--border-color)] rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-xs tabular-nums">
                    <thead className="bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Line Item Description</th>
                        <th className="py-2.5 px-3 font-semibold">HSN/SAC</th>
                        <th className="py-2.5 px-3 font-semibold">Qty</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Taxable (₹)</th>
                        <th className="py-2.5 px-3 font-semibold text-right">GST</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Line Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {displayedInvoice.items.map((it, i) => (
                        <tr key={i} className="hover:bg-[var(--bg-subtle)]/50">
                          <td className="py-2.5 px-3 font-medium text-[var(--text-main)]">{it.itemName}</td>
                          <td className="py-2.5 px-3 font-mono">{it.hsnSac}</td>
                          <td className="py-2.5 px-3 font-mono">
                            {it.quantity} {it.unit}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-right">
                            ₹{it.taxableValue.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-right">{it.gstRate}%</td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-right">
                            ₹{it.lineTotal.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {demoViewTab === 'tally_xml' && (
              <pre className="p-4 rounded-xl bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto max-h-80 leading-relaxed">
                {buildSampleTallyXmlPreview(displayedInvoice)}
              </pre>
            )}

            {demoViewTab === 'gstr2b' && (
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-main)]">
                      Books vs GSTR-2B Portal Match Simulation
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      Normalized match key: GSTIN + stripped invoice number
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {activeSample.gstr2bStatus}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono tabular-nums">
                  <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <div className="text-[11px] text-[var(--text-muted)] font-sans">Books Tax Claim</div>
                    <div className="text-sm font-bold text-[var(--text-main)] mt-1">
                      ₹{(displayedInvoice.cgstAmount + displayedInvoice.sgstAmount + displayedInvoice.igstAmount).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <div className="text-[11px] text-[var(--text-muted)] font-sans">Portal 2B Eligible ITC</div>
                    <div className="text-sm font-bold text-[var(--text-main)] mt-1">
                      ₹{(displayedInvoice.cgstAmount + displayedInvoice.sgstAmount + displayedInvoice.igstAmount).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <div className="text-[11px] text-[var(--text-muted)] font-sans">Tax Variance</div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      ₹0.00
                    </div>
                  </div>
                </div>
              </div>
            )}

            {demoViewTab === 'json' && (
              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-80">
                {JSON.stringify(displayedInvoice, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 3: INTERACTIVE TIME-SAVED ESTIMATOR & WORKFLOW COMPARISON   */}
      {/* =================================================================== */}
      <section
        id="practice-roi-estimator"
        className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-8 scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Slider Calculator */}
          <div className="lg:col-span-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-5 space-y-5">
            <div className="space-y-1">
              <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Interactive Practice Workload Estimator</span>
              </div>
              <h2 className="font-display text-xl font-bold text-[var(--text-main)]">
                Estimate Monthly Voucher &amp; 2B Hours Saved
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <label htmlFor="roi-invoices">Monthly Purchase Invoices</label>
                  <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                    {monthlyInvoices.toLocaleString('en-IN')} bills
                  </span>
                </div>
                <input
                  id="roi-invoices"
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={monthlyInvoices}
                  onChange={(e) => setMonthlyInvoices(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <label htmlFor="roi-clients">Active GST Clients</label>
                  <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                    {clientCount} clients
                  </span>
                </div>
                <input
                  id="roi-clients"
                  type="range"
                  min={1}
                  max={150}
                  step={1}
                  value={clientCount}
                  onChange={(e) => setClientCount(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-[var(--text-main)]">
                <input
                  type="checkbox"
                  checked={include2bReconciliation}
                  onChange={(e) => setInclude2bReconciliation(e.target.checked)}
                  className="rounded border-[var(--border-color)] accent-indigo-600"
                />
                <span>Include monthly GSTR-2B Excel reconciliation time</span>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--border-color)] font-mono tabular-nums">
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="text-[10px] font-sans text-[var(--text-muted)]">Manual Entry</div>
                <div className="text-base font-bold text-[var(--text-main)] mt-0.5">
                  {estimatedTimeStats.manualHours}h
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="text-[10px] font-sans text-[var(--text-muted)]">With Review</div>
                <div className="text-base font-bold text-[var(--text-main)] mt-0.5">
                  {estimatedTimeStats.withLedgerSutraHours}h
                </div>
              </div>
              <div className="p-3 rounded-lg bg-indigo-600 text-white">
                <div className="text-[10px] font-sans text-indigo-100">Hours Saved</div>
                <div className="text-base font-bold mt-0.5">
                  ~{estimatedTimeStats.hoursSaved}h/mo
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Illustrative workflow calculation assuming ~3.5 min manual voucher &amp; ledger entry per invoice vs ~0.6 min review &amp; export.
            </p>
          </div>

          {/* Right: Manual Entry vs LedgerSutra Comparison */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="text-xs font-medium text-[var(--text-muted)]">
                Problem vs Solution
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--text-main)] mt-1">
                Why Indian CA Firms Replace Manual Voucher Entry with {BRAND_NAME}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-3">
                <div className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Manual Data Entry Bottlenecks</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[var(--text-muted)] leading-relaxed">
                  <li>Typing 15-character GSTINs, invoice numbers, and HSN rows by hand before GSTR-3B deadlines.</li>
                  <li>Transposing characters (`8` vs `B`, `0` vs `O`) causing avoidable GSTR-2B mismatches.</li>
                  <li>Double-booking invoices when clients share both a WhatsApp photo and an email PDF.</li>
                  <li>Manually creating Sundry Creditor ledgers and tax splits inside TallyPrime.</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-3">
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Structured {BRAND_NAME} Workflow</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[var(--text-muted)] leading-relaxed">
                  <li>Batch upload PDFs &amp; photos simultaneously with real-time per-file queue progress bars.</li>
                  <li>Deterministic 15-character GSTIN Mod-36 checksum and line-item tax math verification.</li>
                  <li>Automatic duplicate invoice prompt (`Merge Items`, `Overwrite`, or `Save as Duplicate`).</li>
                  <li>One-click TallyPrime XML vouchers + 6-status GSTR-2B Excel reconciliation report.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 4: ASYMMETRIC BENTO CAPABILITIES GRID (PART 7.4)            */}
      {/* =================================================================== */}
      <section
        id="ca-suite-capabilities"
        className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6 scroll-mt-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-[var(--text-muted)]">
              Complete CA Practice Suite
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-main)] mt-1">
              Nine Capabilities Built for GST Practitioners &amp; Audit Teams
            </h2>
          </div>
          <button
            onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-left cursor-pointer whitespace-nowrap shrink-0"
          >
            Launch Full Suite Workspace →
          </button>
        </div>

        {/* Asymmetric Bento Row 1: Two Marquee Spotlight Cards with Editorial Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 p-6 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                01. TallyPrime XML Export &amp; Pre-Export Validator
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                Direct Purchase Voucher XML Generation with Ledger Auto-Create
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Generates TallyPrime-importable Purchase Vouchers (`ENVELOPE &gt; TALLYMESSAGE &gt; VOUCHER`) with Party credit, Purchase debit, CGST/SGST/IGST ledgers, round-off, and blocked-bill validation (`Fix Now` or skip).
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Tally XML · Zoho Books CSV · Busy Excel
              </span>
              <button
                onClick={() => onNavigate('/gst-invoice-to-tally')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Read Tally Guide →
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-[var(--border-color)] bg-slate-900 overflow-hidden relative min-h-[220px] flex flex-col justify-end">
            <EditorialVisual
              src={invoiceAuditImg}
              alt="CA Saarthi AI - Invoice OCR Tool GST purchase register and GSTR-2B reconciliation"
              fallbackTitle="02. GSTR-2B Reconciliation"
              fallbackSubtitle="Match Books vs Portal JSON & Excel"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
            <div className="relative z-10 p-5 space-y-2 text-slate-100">
              <div className="text-xs font-semibold text-indigo-300">
                02. GSTR-2B Reconciliation
              </div>
              <h3 className="text-base font-bold">
                Upload Portal JSON/Excel &amp; Flag ITC at Risk Across 6 Statuses
              </h3>
              <button
                onClick={() => onNavigate('/gstr-2b-reconciliation-excel')}
                className="text-xs font-semibold text-white hover:underline cursor-pointer"
              >
                Explore 2B Matcher →
              </button>
            </div>
          </div>
        </div>

        {/* Remaining 7 Capabilities in Clean Hairline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: '03. Duplicate Invoice Detection',
              desc: 'Checks every bill against saved records by Supplier Name and Invoice Number, prompting you to Merge Items, Overwrite, or Save as Duplicate.',
              link: '/blog/how-to-find-duplicate-purchase-invoices-before-filing-gst',
            },
            {
              title: '04. GSTIN Validation & Tax Audit',
              desc: 'Validates 15-character GSTIN format, state code, and official Mod-36 checksum digit while verifying line-item taxable sums against printed tax splits.',
              link: '/gst-invoice-data-extraction',
            },
            {
              title: '05. Batch Processing Queue',
              desc: 'Upload dozens of multi-page PDFs and bill photos simultaneously with an interactive file queue and per-file progress bars.',
              link: '/bulk-invoice-processing-for-ca',
            },
            {
              title: '06. Client-Wise Workspace',
              desc: 'Organize bills, documents, GSTR-2B reconciliations, and Tally ledger settings under dedicated CA client profiles in Firestore.',
              link: '/features',
            },
            {
              title: '07. Team Access & Approval Workflow',
              desc: 'Assign Owner/CA, Reviewer, and Staff roles. Staff upload Draft/Pending bills; Reviewers approve or reject with an audit trail.',
              link: '/security',
            },
            {
              title: '08. Multi-Format Accounting Export',
              desc: 'Export validated purchase registers to TallyPrime XML, multi-sheet Excel (.xlsx), Zoho Books CSV, Busy Excel, JSON, SQL, and verbatim TXT.',
              link: '/pdf-invoice-to-excel',
            },
            {
              title: '09. Developer REST API (v1)',
              desc: 'Integrate POST /api/v1/extract into your custom ERP or firm portal using SHA-256 hashed API keys with built-in rate limiting.',
              link: '/api-docs',
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[var(--text-main)]">{feat.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{feat.desc}</p>
              </div>
              <button
                onClick={() => onNavigate(feat.link)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-left cursor-pointer"
              >
                Learn more →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 5: INTERACTIVE "FIELDS WE EXTRACT" EXPLORER (PART 5 & 7.5)  */}
      {/* =================================================================== */}
      <section
        id="extracted-fields-explorer"
        className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-8 space-y-4 sm:space-y-5 scroll-mt-20"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-4">
          <div>
            <div className="text-xs font-medium text-[var(--text-muted)]">
              Comprehensive Schema Coverage · Filterable Column Directory
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-main)] mt-1">
              30+ Invoice, E-Invoice &amp; Bill of Entry Fields Extracted Automatically
            </h2>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fieldSearch}
                onChange={(e) => setFieldSearch(e.target.value)}
                placeholder="Filter fields (e.g. IRN, IFSC, HSN)"
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>
          </div>
        </div>

        {/* Interactive Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all' as const, label: `All Fields (${ALL_EXTRACTED_FIELDS.length})` },
            { id: 'party' as const, label: 'Party & GSTIN' },
            { id: 'einvoice' as const, label: 'E-Invoice & Logistics' },
            { id: 'tax' as const, label: 'Tax & Bank Math' },
            { id: 'boe' as const, label: 'Import BOE' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFieldCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                fieldCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
          {filteredFields.map((field) => (
            <div
              key={field.name}
              className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-between gap-2"
            >
              <span className="font-medium text-[var(--text-main)] truncate">{field.name}</span>
              <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            </div>
          ))}
          {filteredFields.length === 0 && (
            <div className="col-span-full py-6 text-center text-xs text-[var(--text-muted)]">
              No extracted fields match "{fieldSearch}".{' '}
              <button
                onClick={() => {
                  setFieldSearch('');
                  setFieldCategory('all');
                }}
                className="text-indigo-500 font-semibold hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 6 & 7: 3-STEP WORKFLOW + INTERACTIVE PRACTICE PREVIEW       */}
      {/* =================================================================== */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-[var(--text-muted)]">
                Three-Step Practice Workflow
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--text-main)] mt-1">
                From Client Invoice Folder to Tally &amp; 2B Sign-Off
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  num: '01.',
                  title: 'Select Client & Upload Invoices',
                  desc: 'Pick your client workspace in the header and upload single or batch PDFs, multi-page statements, Bills of Entry, or mobile photos.',
                },
                 {
                  num: '02.',
                  title: 'Automated GST Audit & Review Queue',
                  desc: 'CA Saarthi AI extracts header and line-item fields, validates GSTIN Mod-36 checksums, flags duplicate invoices, and routes bills for CA Reviewer approval.',
                },
                {
                  num: '03.',
                  title: 'Reconcile GSTR-2B & Export to Tally',
                  desc: 'Match approved bills against portal GSTR-2B JSON/Excel files and download TallyPrime XML vouchers, Excel registers, Zoho CSV, or Busy sheets.',
                },
              ].map((st) => (
                <div
                  key={st.num}
                  className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1"
                >
                  <div className="text-sm font-bold text-[var(--text-main)]">
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 mr-2">{st.num}</span>
                    {st.title}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Workspace Module Switcher + Editorial Practice Photo */}
          <div className="lg:col-span-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] overflow-hidden flex flex-col justify-between">
            <div className="relative h-52 bg-slate-900">
              <EditorialVisual
                src={caWorkspaceImg}
                alt="CA Saarthi AI - Invoice OCR Tool dual-monitor CA workspace"
                fallbackTitle="CA Practice Dual-Monitor Workflow"
                fallbackSubtitle="TallyPrime XML, GSTR-2B Reconciliation & Client Workspaces"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-white">
                  Inside the {BRAND_NAME} CA Workspace
                </span>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950/85 border border-slate-700/70">
                  {[
                    { id: 'tally' as const, label: 'Tally Validator' },
                    { id: 'gstr2b' as const, label: '2B Matcher' },
                    { id: 'queue' as const, label: 'Batch Queue' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPreviewMode(m.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        previewMode === m.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {previewMode === 'tally' && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-indigo-500" />
                    <span>Pre-Export Validator &amp; Ledger Mapping</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Flags blocked bills (missing invoice number, invalid GSTIN checksum, tax math variance) before XML generation, with one-click Fix Now or Skip &amp; Export Valid Bills actions.
                  </p>
                </div>
              )}

              {previewMode === 'gstr2b' && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    <span>Side-by-Side Purchase Register vs Portal 2B</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Categorizes every invoice across 6 actionable statuses (Matched, Amount Mismatch, Date Mismatch, Probable Invoice Mismatch, In Books Only, In 2B Only) with ITC at Risk totals.
                  </p>
                </div>
              )}

              {previewMode === 'queue' && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>Multi-File Batch Processing Queue</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Upload PDFs and images together, track individual per-file progress bars, retry failed scans, and resolve duplicate bills interactively before saving.
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)]">
                  Available live above in workspace
                </span>
                <button
                  onClick={() =>
                    onOpenWorkspaceTab(previewMode === 'queue' ? 'scanner' : 'master_sheet', 'ca_mode')
                  }
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Open this view live →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 8: TRUTHFUL SECURITY & PRIVACY ARCHITECTURE (PART 7.8)      */}
      {/* =================================================================== */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Truthful Security Architecture
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text-main)] mt-1">
              Security &amp; Data Isolation for Client Records
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/security')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Read Full Security Architecture →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Google Sign-In Authentication</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Users authenticate via Google OAuth (Firebase Authentication). No plaintext passwords are stored by CA Saarthi AI.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Per-User &amp; Per-Client Firestore Isolation</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              All saved clients, bills, and audit trails are scoped under{' '}
              <code className="font-mono">/users/&#123;uid&#125;/clients/&#123;clientId&#125;</code> and enforced by Firestore rules.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Encryption in Transit &amp; Instant Deletion</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              All traffic uses HTTPS/TLS encryption in transit, and users can delete any client or purge all account data anytime.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 9: PRICING SECTION (PLACEHOLDER PLANS + PILOT NOTE)         */}
      {/* =================================================================== */}
      <section
        id="practice-pricing-plans"
        className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6 scroll-mt-20"
      >
        <div>
          <div className="text-xs font-medium text-[var(--text-muted)]">
            Placeholder Practice Plans · Custom CA-Firm Pilot Offers Available
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-main)] mt-1">
            Plans for Solo Practitioners &amp; Multi-Partner CA Firms
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              tier: 'For Evaluating Workflows · Free Starter (Placeholder)',
              price: '₹0 / month',
              subtitle: 'For testing OCR, GSTIN validation & Tally XML export structure',
              highlighted: false,
              features: [
                '3 no-login demo scans/day + free workspace trial',
                'Single & batch invoice upload queue',
                'TallyPrime XML & Excel (.xlsx) export',
                '1 Default Client workspace',
              ],
            },
            {
              tier: 'For Solo CAs & Tax Consultants · Pro Practitioner (Placeholder)',
              price: '₹1,499 / month (Placeholder)',
              subtitle: 'For independent CAs & GST practitioners filing monthly returns',
              highlighted: true,
              features: [
                'Up to 25 Client-Wise Workspaces',
                'Full GSTR-2B JSON & Excel Reconciliation',
                'Zoho Books CSV & Busy Excel exports',
                'Extended E-Invoice, IRN & Bank field extraction',
              ],
            },
            {
              tier: 'For Multi-Partner Audit Firms · CA Firm & Team (Placeholder)',
              price: '₹3,999 / month (Placeholder)',
              subtitle: 'For multi-partner CA firms with articles & reviewer workflows',
              highlighted: false,
              features: [
                'Unlimited Client Workspaces',
                'Team Access RBAC (Owner/CA, Reviewer, Staff)',
                'Bill approval workflow & immutable audit trail',
                'Developer REST API (POST /api/v1/extract)',
              ],
            },
          ].map((plan) => (
            <div
              key={plan.tier}
              className={`p-6 rounded-xl border flex flex-col justify-between space-y-5 ${
                plan.highlighted
                  ? 'border-indigo-500 bg-indigo-500/5'
                  : 'border-[var(--border-color)] bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {plan.tier}
                </div>
                <div className="font-display text-2xl font-bold text-[var(--text-main)] tabular-nums">
                  {plan.price}
                </div>
                <p className="text-xs text-[var(--text-muted)]">{plan.subtitle}</p>
                <ul className="space-y-2 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-main)]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => onNavigate('/contact')}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  plan.highlighted
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                Request CA-Firm Pilot Offer
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 10: INTERACTIVE CATEGORY-FILTERED FAQ ACCORDION (12+ Qs)    */}
      {/* =================================================================== */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-[var(--text-muted)]">
              Frequently Asked Questions · {HOMEPAGE_FAQS.length} Practitioner Answers
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text-main)] mt-1">
              Questions from Chartered Accountants &amp; Tax Teams
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', 'Tally', 'GSTR-2B', 'Security', 'General'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFaqCategory(cat);
                  setOpenFaqIdx(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  faqCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-subtle)]">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={faq.question} className="bg-[var(--bg-card)]">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[var(--bg-subtle)]/60 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-semibold text-[var(--text-main)]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

// ============================================================================
// DEDICATED ROUTE VIEW (/privacy, /terms, /security, /pricing, /faq, /blog, /api-docs, SEO pages)
// ============================================================================
export const LedgerSutraRouteView: React.FC<{
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenWorkspaceTab: (
    tab?: 'scanner' | 'master_sheet' | 'dashboard' | 'history',
    mode?: 'normal_user' | 'ca_mode'
  ) => void;
  savedBillsCount: number;
}> = ({ currentPath, onNavigate, onOpenWorkspaceTab }) => {
  const cleanPath = normalizePathname(currentPath);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactFirm, setContactFirm] = useState('');

  // 1. Dedicated SEO Landing Pages
  if (DEDICATED_SEO_PAGES[cleanPath]) {
    const spec = DEDICATED_SEO_PAGES[cleanPath];
    return (
      <article className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-8">
        <div className="space-y-3 border-b border-[var(--border-color)] pb-6">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            {spec.badge}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-main)]">
            {spec.h1}
          </h1>
          <p className="text-base text-[var(--text-muted)]">{spec.subtitle}</p>
          <p className="text-sm text-[var(--text-main)] leading-relaxed max-w-3xl">
            {spec.problemStatement}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
            >
              Try Free Demo in CA Workspace
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
            >
              Back to Homepage
            </button>
          </div>
        </div>

        {spec.longFormParagraphs && spec.longFormParagraphs.length > 0 && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="font-display text-xl font-bold text-[var(--text-main)]">
              Why Indian CA Firms Automate This Workflow with {BRAND_NAME}
            </h2>
            {spec.longFormParagraphs.map((para, i) => (
              <p key={i} className="text-sm text-[var(--text-muted)] leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {spec.workflowSteps.map((step, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5"
            >
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                0{i + 1}. {step.title}
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{step.detail}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-[var(--text-main)]">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.keyCapabilities.map((cap, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5"
              >
                <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{cap.title}</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>

        {spec.faqs.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-[var(--border-color)]">
            <h2 className="font-display text-xl font-bold text-[var(--text-main)]">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spec.faqs.map((f, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5"
                >
                  <h3 className="text-sm font-bold text-[var(--text-main)]">{f.question}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    );
  }

  // 2. Blog / Resource Article Detail Page
  const article = RESOURCE_ARTICLES.find(
    (a) => a.path === cleanPath || `/blog/${a.slug}` === cleanPath || `/resources/${a.slug}` === cleanPath
  );
  if (article) {
    return (
      <article className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-8">
        <div className="space-y-3 border-b border-[var(--border-color)] pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
            <span aria-hidden="true">·</span>
            <span>Published {article.publishedDate}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">{article.title}</h1>
          <p className="text-sm text-[var(--text-muted)] max-w-3xl">{article.summary}</p>
        </div>

        <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Key Takeaways for CA Firms
          </div>
          <ul className="space-y-1.5 text-xs text-[var(--text-main)]">
            {article.keyTakeaways.map((kt, i) => (
              <li key={i}>• {kt}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-6 max-w-3xl">
          {article.sections.map((sec, i) => (
            <section key={i} className="space-y-3">
              <h2 className="font-display text-xl font-bold text-[var(--text-main)]">{sec.heading}</h2>
              {sec.paragraphs.map((p, j) => (
                <p key={j} className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {p}
                </p>
              ))}
              {sec.checklist && (
                <ul className="space-y-1.5 pl-4 text-sm text-[var(--text-main)]">
                  {sec.checklist.map((c, k) => (
                    <li key={k}>✓ {c}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
          <button
            onClick={() => onNavigate('/blog')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            ← Back to All Blog Articles
          </button>
          <button
            onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
          >
            Try {BRAND_NAME} Live Workspace
          </button>
        </div>
      </article>
    );
  }

  // 3. Blog / Resources Index
  if (cleanPath === '/blog' || cleanPath === '/resources') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        <div>
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            CA Practice Blog &amp; Guides
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-main)] mt-1">
            Tutorials on TallyPrime Import, GSTR-2B Reconciliation &amp; GST Audit
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESOURCE_ARTICLES.map((art) => (
            <div
              key={art.slug}
              className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="text-xs text-[var(--text-muted)]">
                  {art.category} · {art.readTime}
                </div>
                <h2 className="text-base font-bold text-[var(--text-main)]">{art.title}</h2>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{art.summary}</p>
              </div>
              <button
                onClick={() => onNavigate(art.path)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-left cursor-pointer"
              >
                Read Full Article →
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 4. Developer API Docs Page (/api-docs)
  if (cleanPath === '/api-docs') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        <div className="space-y-2 border-b border-[var(--border-color)] pb-5">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            REST API v1 Documentation
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">
            Programmatic GST Invoice Extraction —{' '}
            <code className="text-indigo-600 dark:text-indigo-400">POST /api/v1/extract</code>
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-3xl">
            Authenticate with the built-in endpoint or generate per-user API keys in the workspace{' '}
            <b>QA &amp; API</b> tab. Keys are hashed with SHA-256 before storage. Rate limit: 30 requests/minute; max payload: 15 MB.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-main)]">cURL Multipart Request Example</h2>
            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">
              {`curl -X POST ${SITE_DOMAIN}/api/v1/extract \\
  -H "Authorization: Bearer ls_live_your_api_key_here" \\
  -F "file=@/path/to/purchase_invoice.pdf"`}
            </pre>

            <h2 className="text-base font-bold text-[var(--text-main)] pt-2">JSON Base64 Request Example</h2>
            <pre className="p-4 rounded-xl bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto">
              {`curl -X POST ${SITE_DOMAIN}/api/v1/extract \\
  -H "x-api-key: ls_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "fileName": "tax_invoice_842.pdf",
    "mimeType": "application/pdf",
    "fileBase64": "JVBERi0xLjQK..."
  }'`}
            </pre>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-main)]">200 OK JSON Response Example</h2>
            <pre className="p-4 rounded-xl bg-slate-950 text-amber-300 font-mono text-xs overflow-x-auto max-h-96">
              {JSON.stringify(
                {
                  success: true,
                  apiVersion: 'v1',
                  fileName: 'tax_invoice_842.pdf',
                  extractedAt: '2026-11-04T10:15:00.000Z',
                  invoice: BUILTIN_DEMO_SAMPLES[0].data,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </section>
    );
  }

  // 5. Privacy Policy (/privacy)
  if (cleanPath === '/privacy') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-5">
        <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">Privacy Policy</h1>
        <p className="text-xs text-[var(--text-muted)]">Last Updated: November 2026 · Support: support@casaarthiai.in</p>
        <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
          <p>
            <strong className="text-[var(--text-main)]">1. Zero AI Model Training on Client Data:</strong>{' '}
            {BRAND_NAME} never uses your uploaded invoices, GSTINs, or client financial documents to train, fine-tune, or
            improve public or third-party AI models.
          </p>
          <p>
            <strong className="text-[var(--text-main)]">2. Zero Server-Side Retention &amp; Instant Purge:</strong>{' '}
            Uploaded invoice files are processed in memory for OCR extraction and purged immediately from the processing
            server. With our Local Fallback OCR, extraction can also run directly inside your browser.
          </p>
          <p>
            <strong className="text-[var(--text-main)]">3. Strict Per-User Isolation &amp; Deletion:</strong> If you
            sign in to save history, your client profiles and bills are isolated under your authenticated account and can
            be permanently deleted at any time with a single click.
          </p>
        </div>
      </section>
    );
  }

  // 6. Terms of Service (/terms)
  if (cleanPath === '/terms') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-5">
        <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">Terms of Service</h1>
        <p className="text-xs text-[var(--text-muted)]">Last Updated: November 2026 · Support: support@casaarthiai.in</p>
        <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
          <p>
            <strong className="text-[var(--text-main)]">1. Professional Verification Responsibility:</strong>{' '}
            {BRAND_NAME} is an OCR extraction and accounting preparation tool for Chartered Accountants and tax
            practitioners. Users must review and verify extracted GSTINs, tax amounts, GSTR-2B statuses, and Tally XML
            vouchers before filing statutory GST returns or financial statements.
          </p>
          <p>
            <strong className="text-[var(--text-main)]">2. Acceptable API &amp; Demo Usage:</strong> Unauthenticated
            demo usage is limited to 3 custom scans per browser per day. Authenticated API usage on{' '}
            <code className="font-mono">POST /api/v1/extract</code> is subject to rate limits (30 requests/min) and payload limits (15 MB).
          </p>
        </div>
      </section>
    );
  }

  // 6b. Data Deletion Policy (/data-deletion)
  if (cleanPath === '/data-deletion') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-5">
        <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">Data Deletion Policy</h1>
        <p className="text-xs text-[var(--text-muted)]">Last Updated: November 2026 · Support: support@casaarthiai.in</p>
        <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
          <p>
            <strong className="text-[var(--text-main)]">1. Ephemeral In-Memory OCR Processing:</strong> Every invoice PDF
            or image uploaded to {BRAND_NAME} is processed ephemerally and purged from server memory immediately after the
            structured response is returned.
          </p>
          <p>
            <strong className="text-[var(--text-main)]">2. Instant One-Click Record &amp; Workspace Purge:</strong>{' '}
            Within the {BRAND_NAME} workspace, you can delete any single invoice row, clear an entire client workspace, or
            purge all saved records immediately without waiting for manual support tickets.
          </p>
          <p>
            <strong className="text-[var(--text-main)]">3. Direct Deletion Assistance:</strong> For enterprise compliance
            confirmations or account-wide deletion requests, email{' '}
            <a href="mailto:support@casaarthiai.in" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              support@casaarthiai.in
            </a>.
          </p>
        </div>
      </section>
    );
  }

  // 7. Security Page (/security)
  if (cleanPath === '/security') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-5">
        <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">
          Security &amp; Data Isolation Architecture
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
          We describe only the technical security controls that are implemented and active in {BRAND_NAME}:
        </p>
        <ul className="space-y-3 text-sm text-[var(--text-main)] max-w-3xl">
          <li>• <b>Google Sign-In (Firebase Auth):</b> All user sessions are authenticated via Google OAuth tokens.</li>
          <li>• <b>Database-Level Ownership Rules:</b> <code className="font-mono">firestore.rules</code> enforces strict <code className="font-mono">request.auth.uid == userId</code> ownership and role-based approval permissions on every read and write.</li>
          <li>• <b>SHA-256 Hashed API Keys:</b> Developer API keys generated for <code className="font-mono">/api/v1/extract</code> are hashed in the browser using SHA-256 before saving to Firestore; plaintext keys are never persisted.</li>
          <li>• <b>Encryption in Transit:</b> All client-to-server and client-to-Firestore traffic is encrypted over HTTPS/TLS.</li>
        </ul>
      </section>
    );
  }

  // 8. FAQ Standalone Page (/faq)
  if (cleanPath === '/faq') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">
          Frequently Asked Questions ({HOMEPAGE_FAQS.length} Questions)
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOMEPAGE_FAQS.map((f, i) => (
            <div key={i} className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
              <h2 className="text-sm font-bold text-[var(--text-main)]">{f.question}</h2>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 9. Contact / Demo Booking Interactive Form (/contact) + Pricing Fallback
  if (cleanPath === '/contact') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6 max-w-3xl">
        <div className="space-y-2">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            CA Practice Onboarding
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">
            Book a Live Demo or Request CA-Firm Pilot
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Schedule a live walkthrough of TallyPrime XML import, GSTR-2B reconciliation, and multi-client firm workspaces with our engineering team at{' '}
            <a href="mailto:support@casaarthiai.in" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              support@casaarthiai.in
            </a>.
          </p>
        </div>

        {contactSubmitted ? (
          <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demo Request Recorded for {contactFirm || 'Your Practice'}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              We have noted {contactEmail}. You can also test Tally XML export and batch scanning immediately in our workspace below.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!contactEmail.includes('@')) return;
              setContactSubmitted(true);
            }}
            className="space-y-4 max-w-lg"
          >
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                CA Firm or Organization Name
              </label>
              <input
                type="text"
                required
                value={contactFirm}
                onChange={(e) => setContactFirm(e.target.value)}
                placeholder="e.g. Sharma & Associates Chartered Accountants"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="partner@cafirm.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                Request Demo Walkthrough
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
              >
                Back to Homepage
              </button>
            </div>
          </form>
        )}
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-5">
      <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">
        {cleanPath === '/pricing'
          ? 'Practice Plans & CA-Firm Pilot Offers'
          : `${BRAND_NAME} — ${BRAND_TAGLINE}`}
      </h1>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
        Explore our live workspace below or return to the homepage for the interactive walkthrough.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onNavigate('/')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
        >
          View Full Landing Page
        </button>
        <button
          onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
          className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
        >
          Jump to Workspace
        </button>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 11: QUIET ARCHITECTURAL FOOTER (PART 7.11)
// ============================================================================
export const LedgerSutraFooter: React.FC<{
  onNavigate: (path: string) => void;
  onOpenWorkspaceTab: (
    tab?: 'scanner' | 'master_sheet' | 'dashboard' | 'history',
    mode?: 'normal_user' | 'ca_mode'
  ) => void;
}> = ({ onNavigate, onOpenWorkspaceTab }) => {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)] mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <img
                src="/ca-saarthi-icon.svg"
                alt="CA Saarthi AI - Invoice OCR Tool"
                className="w-12 h-12 rounded-2xl object-contain shadow-sm shrink-0"
              />
              <div>
                <span className="font-display font-extrabold text-lg tracking-tight flex items-baseline gap-1">
                  <span className="bg-gradient-to-br from-amber-500 via-amber-500 to-orange-600 dark:from-amber-300 dark:via-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                    CA
                  </span>
                  <span className="text-[var(--text-main)]">Saarthi</span>
                  <span className="bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    AI
                  </span>
                </span>
                <span className="text-[11px] font-medium text-[var(--text-muted)] block">{SITE_DOMAIN}</span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Bilingual AI OCR built exclusively for Indian CA firms. Best OCR software for invoices India with automated GST data extraction for CA firms and a Hindi bilingual bill scanner.
            </p>
            <div className="text-xs text-[var(--text-main)] font-medium">
              Support:{' '}
              <a
                href="mailto:support@casaarthiai.in"
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                support@casaarthiai.in
              </a>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => onNavigate('/api-docs')}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
              >
                REST API Docs
              </button>
            </div>
          </div>

          {/* Col 2: Public Website & Legal Links (Crucial for B2B Trust) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[var(--text-main)]">Platform &amp; Legal Trust</h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="font-semibold text-[var(--text-main)] hover:text-indigo-500 cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="font-semibold text-[var(--text-main)] hover:text-indigo-500 cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/data-deletion')}
                  className="font-semibold text-[var(--text-main)] hover:text-indigo-500 cursor-pointer"
                >
                  Data Deletion Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/security')} className="hover:text-indigo-500 cursor-pointer">
                  Security &amp; Data Isolation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/pricing')} className="hover:text-indigo-500 cursor-pointer">
                  Pricing &amp; CA Firm Pilots
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-indigo-500 cursor-pointer">
                  FAQ ({HOMEPAGE_FAQS.length} Questions)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-indigo-500 cursor-pointer">
                  Contact &amp; Book a Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: High-Intent CA SEO Solutions */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[var(--text-main)]">CA &amp; GST Workflows</h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <button
                  onClick={() => onNavigate('/gst-invoice-to-tally')}
                  className="hover:text-indigo-500 cursor-pointer text-left font-medium text-indigo-600 dark:text-indigo-400"
                >
                  GST Invoice to TallyPrime XML
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/gstr-2b-reconciliation-excel')}
                  className="hover:text-indigo-500 cursor-pointer text-left font-medium text-indigo-600 dark:text-indigo-400"
                >
                  GSTR-2B Reconciliation in Excel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/bulk-invoice-processing-for-ca')}
                  className="hover:text-indigo-500 cursor-pointer text-left font-medium text-indigo-600 dark:text-indigo-400"
                >
                  Bulk Invoice Processing for CA
                </button>
              </li>
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
            </ul>
          </div>

          {/* Col 4: Blog Articles */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[var(--text-main)]">CA Blog &amp; Guides</h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <button
                  onClick={() => onNavigate('/blog')}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer text-left"
                >
                  All Blog Articles &amp; Tutorials →
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

        <div className="pt-6 border-t border-[var(--border-color)] space-y-3 text-xs text-[var(--text-muted)]">
          <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] leading-relaxed">
            <strong className="text-[var(--text-main)]">Professional Compliance Disclaimer:</strong> {BRAND_NAME} is a
            document-processing and accounting workflow support tool. Chartered Accountants and users should review and
            verify extracted data before importing into TallyPrime or filing official GST returns.
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
            <span>
              © {new Date().getFullYear()} {BRAND_NAME} (casaarthiai.in). Contact: support@casaarthiai.in
            </span>
            <span>🔒 Local Fallback OCR · Zero Server-Side Data Retention · TallyPrime XML · GSTR-2B · SQL &amp; XLSX</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
