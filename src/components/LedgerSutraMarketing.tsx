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
  HOMEPAGE_FAQS_HI,
  DEDICATED_SEO_PAGES,
  RESOURCE_ARTICLES,
  DEFAULT_CA_AUTHOR,
  HINDI_LOCALIZED_ROUTES,
  PRACTICE_PRICING_PLANS,
  PRACTICE_PRICING_PLANS_HI,
  DETAILED_FEATURES_SPECS,
  SECURITY_ARCHITECTURE_SECTIONS,
  PRIVACY_POLICY_SECTIONS,
  DATA_DELETION_SECTIONS,
  ABOUT_PAGE_SECTIONS,
  HOW_IT_WORKS_SECTIONS,
  API_DOCS_SPEC,
  normalizePathname,
  resolveRouteAudit,
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
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'auto' | 'sync';
  fetchPriority?: 'high' | 'low' | 'auto';
  className?: string;
}> = ({
  src,
  alt,
  fallbackTitle,
  fallbackSubtitle,
  width = 1200,
  height = 800,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  className = '',
}) => {
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
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      {...(fetchPriority ? { fetchPriority } : {})}
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
  currentPath?: string;
}> = ({ onOpenWorkspaceTab, onTriggerUpload, onNavigate, savedBillsCount, currentPath = '/' }) => {
  const [heroStage, setHeroStage] = useState<'extract' | 'tally' | 'gstr2b' | 'compare'>('extract');
  const cleanHeroPath = normalizePathname(currentPath);
  const hindiHome = cleanHeroPath === '/hi' ? HINDI_LOCALIZED_ROUTES['/hi'] : null;

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
              <div className="flex items-center justify-between gap-2.5 sm:gap-3 text-xs font-medium text-[var(--text-muted)]">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="relative p-0.5 rounded-xl bg-gradient-to-br from-sky-400/50 via-amber-400/50 to-indigo-500/50 shadow-xs shrink-0">
                    <img
                      src="/ca-saarthi-icon.svg"
                      alt=""
                      width={36}
                      height={36}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] object-contain block"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="font-display font-extrabold text-sm sm:text-base tracking-tight inline-flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-baseline">
                        <span className="text-[var(--text-main)]">C</span>
                        <span className="bg-gradient-to-b from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                          A
                        </span>
                      </span>
                      <span className="text-[var(--text-main)]">Saarthi</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-black tracking-wider bg-gradient-to-r from-cyan-500/15 via-sky-500/15 to-teal-500/15 border border-cyan-500/35">
                        <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-teal-500 dark:from-cyan-300 dark:via-sky-400 dark:to-teal-300 bg-clip-text text-transparent">
                          AI
                        </span>
                      </span>
                    </span>
                    <span aria-hidden="true" className="hidden sm:inline text-[var(--text-muted)]">·</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-[11px] sm:text-xs leading-snug">
                      {hindiHome ? hindiHome.breadcrumbName : BRAND_TAGLINE}
                    </span>
                  </div>
                </div>
                <a
                  href={hindiHome ? '/' : '/hi'}
                  onClick={(e) => {
                    if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate(hindiHome ? '/' : '/hi');
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                >
                  {hindiHome ? 'English (EN)' : 'हिंदी (/hi)'}
                </a>
              </div>

              <h1
                className="font-display font-extrabold tracking-tight leading-[1.08] text-[var(--text-main)]"
                style={{ fontSize: 'clamp(1.68rem, 4.4vw, 3.15rem)' }}
              >
                {hindiHome
                  ? hindiHome.h1
                  : 'GST Invoice OCR & Data Entry Automation for Indian CA Firms'}
              </h1>

              <h2 className="text-sm sm:text-lg font-normal text-[var(--text-muted)] leading-relaxed max-w-2xl">
                {hindiHome
                  ? hindiHome.subtitle
                  : 'Bilingual AI OCR built exclusively for Indian CA firms. Scan English & Hindi bills, validate 15-digit GSTINs with Mod-36 checksums, and export directly to TallyPrime XML, SQL, or Excel with client-scoped data isolation.'}
              </h2>

              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3">
                  <a
                    href="/app"
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault();
                        onOpenWorkspaceTab('scanner', 'ca_mode');
                      }
                    }}
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>{hindiHome ? 'मुफ़्त ट्रायल शुरू करें' : 'Start Free Trial'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="/contact"
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault();
                        if (onNavigate) {
                          onNavigate('/contact');
                        } else {
                          onOpenWorkspaceTab('scanner', 'ca_mode');
                        }
                      }
                    }}
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--border-color)] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Mail className="w-4 h-4 text-indigo-500" />
                    <span>{hindiHome ? 'डेमो बुक करें' : 'Book a Demo'}</span>
                  </a>

                  {onTriggerUpload && (
                    <button
                      onClick={() => {
                        onOpenWorkspaceTab('scanner', 'ca_mode');
                        onTriggerUpload();
                      }}
                      className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-elevated)] text-indigo-600 dark:text-indigo-400 border border-[var(--border-color)] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {hindiHome
                          ? `इनवॉइस अपलोड करें (${savedBillsCount} सहेजे गए)`
                          : `Upload Invoice (${savedBillsCount} Saved)`}
                      </span>
                    </button>
                  )}
                </div>

                {/* Trust Badge / Micro-copy under CTA */}
                <p className="text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>
                    {hindiHome
                      ? '🔒 हाइब्रिड क्लाउड और लोकल फ़ॉलबैक OCR | क्लाइंट-स्कोप्ड आइसोलेशन और तुरंत डिलीट नियंत्रण'
                      : '🔒 Hybrid Cloud & Local Fallback OCR | Client-Scoped Isolation & Instant Deletion'}
                  </span>
                </p>
              </div>
            </div>

            {/* Clean 4-Column Architectural Proof Row + Clean Single Sentence (Task 5) */}
            <div className="space-y-3 pt-5 sm:pt-6 border-t border-[var(--border-color)] text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <div className="font-semibold text-[var(--text-main)]">
                    {hindiHome ? '15-अंकीय GSTIN जांच' : '15-Digit GSTIN Audit'}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">
                    {hindiHome ? 'Mod-36 चेकसम और PAN जांच' : 'Mod-36 checksum & PAN check'}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-[var(--text-main)]">
                    {hindiHome ? 'द्विभाषी OCR (eng+hin)' : 'Bilingual OCR'}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">
                    {hindiHome ? 'अंग्रेज़ी और हिंदी बिल स्कैनर' : 'English & Hindi bill scanner'}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-[var(--text-main)]">
                    {hindiHome ? 'TallyPrime और GSTR-2B' : 'TallyPrime & 2B'}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">
                    {hindiHome ? 'XML वाउचर और 6-स्टेटस मिलान' : 'XML vouchers & 6-status match'}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-[var(--text-main)]">
                    {hindiHome ? 'SQL, JSON और XLSX' : 'SQL, JSON & XLSX'}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">
                    {hindiHome ? 'डेवलपर-रेडी एक्सपोर्ट्स' : 'Developer-ready exports'}
                  </div>
                </div>
              </div>
              {hindiHome ? (
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  भारतीय CA फर्मों के लिए इनवॉइस OCR सॉफ्टवेयर — हिंदी + अंग्रेज़ी बिल स्कैनर के साथ स्वचालित GST डेटा एक्सट्रैक्शन। देखें:{' '}
                  <a
                    href="/hi/gst-invoice-to-tally"
                    onClick={(e) => {
                      if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault();
                        onNavigate('/hi/gst-invoice-to-tally');
                      }
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    GST इनवॉइस से TallyPrime XML
                  </a>
                  ,{' '}
                  <a
                    href="/hi/gstr-2b-reconciliation-excel"
                    onClick={(e) => {
                      if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault();
                        onNavigate('/hi/gstr-2b-reconciliation-excel');
                      }
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Excel में GSTR-2B रिकन्सिलिएशन
                  </a>
                  ,{' '}
                  <a
                    href="/hi/features"
                    onClick={(e) => {
                      if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault();
                        onNavigate('/hi/features');
                      }
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    GST प्रैक्टिस फीचर्स
                  </a>
                  , और{' '}
                  <a
                    href="/hi/pricing"
                    onClick={(e) => {
                      if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault();
                        onNavigate('/hi/pricing');
                      }
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    CA फर्म प्राइसिंग प्लान
                  </a>
                  ।
                </p>
              ) : (
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Invoice OCR software for Indian CA firms — automated GST data extraction with a Hindi + English bill scanner. Explore{' '}
                  <a
                    href="/gst-invoice-to-tally"
                    onClick={(e) => {
                      if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault();
                        onNavigate('/gst-invoice-to-tally');
                      }
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    GST Invoice to TallyPrime XML
                  </a>
                  ,{' '}
                  <a
                    href="/gstr-2b-reconciliation-excel"
                    onClick={(e) => {
                      if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault();
                        onNavigate('/gstr-2b-reconciliation-excel');
                      }
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    GSTR-2B Reconciliation in Excel
                  </a>
                  ,{' '}
                  <a
                    href="/features"
                    onClick={(e) => {
                      if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault();
                        onNavigate('/features');
                      }
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    GST Practice Features
                  </a>
                  , and{' '}
                  <a
                    href="/pricing"
                    onClick={(e) => {
                      if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault();
                        onNavigate('/pricing');
                      }
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    CA Firm Pricing Plans
                  </a>
                  .
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Studio Photography + 4-Mode Upper Command Inspector */}
          <div className="lg:col-span-5 relative min-h-[340px] sm:min-h-[370px] lg:min-h-full bg-slate-950 border-t lg:border-t-0 lg:border-l border-[var(--border-color)] flex flex-col justify-end">
            <EditorialVisual
              src={heroStudioImg}
              alt={
                hindiHome
                  ? 'CA Saarthi AI इनवॉइस OCR वर्कस्पेस — GSTIN सत्यापन और TallyPrime XML एक्सपोर्ट'
                  : 'CA Saarthi AI invoice OCR workspace showing GSTIN validation and Tally XML export'
              }
              fallbackTitle={hindiHome ? 'CA Saarthi AI प्रैक्टिस ऑडिट डेस्क' : 'CA Saarthi AI Practice Audit Desk'}
              fallbackSubtitle={
                hindiHome
                  ? 'खरीद बिलों से TallyPrime XML, SQL और GSTR-2B Excel'
                  : 'Purchase bills to TallyPrime XML, SQL, and GSTR-2B Excel'
              }
              width={1200}
              height={900}
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />

            <div className="relative z-10 p-4 sm:p-6 space-y-3 text-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-300">
                  {hindiHome ? 'लाइव प्रैक्टिस आउटपुट और बेंचमार्क' : 'Live Practice Output & Benchmark'}
                </span>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900/95 border border-slate-700/80 overflow-x-auto no-scrollbar max-w-full">
                  {[
                    { id: 'extract' as const, label: hindiHome ? '01. GST फ़ील्ड्स' : '01. GST Fields' },
                    { id: 'tally' as const, label: '02. Tally XML' },
                    { id: 'gstr2b' as const, label: '03. GSTR-2B' },
                    { id: 'compare' as const, label: hindiHome ? '04. तुलना' : '04. vs Others' },
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
                      <span className="text-slate-400">{hindiHome ? 'सप्लायर GSTIN' : 'Supplier GSTIN'}</span>
                      <span className="text-emerald-400 font-semibold break-all sm:break-normal">
                        {hindiHome ? '27AABCK4829M1Z5 (मान्य Mod-36)' : '27AABCK4829M1Z5 (Valid Mod-36)'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">{hindiHome ? 'इनवॉइस / तिथि' : 'Invoice / Date'}</span>
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
                      <span className="text-slate-400">{hindiHome ? 'वाउचर प्रकार' : 'Voucher Type'}</span>
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
                      <span className="text-slate-400">{hindiHome ? 'नॉर्मलाइज़्ड इनवॉइस की (Key)' : 'Normalized Invoice Key'}</span>
                      <span className="text-slate-100 break-all sm:break-normal">27AABCK4829M1Z5 · INV26270842</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">{hindiHome ? 'पोर्टल बनाम बुक्स अंतर' : 'Portal vs Books Delta'}</span>
                      <span className="text-emerald-400 font-semibold">{hindiHome ? '₹0.00 अंतर' : '₹0.00 Variance'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">{hindiHome ? 'रिकन्सिलिएशन स्थिति' : 'Reconciliation Status'}</span>
                      <span className="text-emerald-400 font-semibold">
                        {hindiHome ? 'Matched · ITC पात्र' : 'Matched · ITC Eligible'}
                      </span>
                    </div>
                  </>
                )}

                {heroStage === 'compare' && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">
                        {hindiHome ? 'Tally प्री-एक्सपोर्ट ब्लॉकर जांच' : 'Tally Pre-Export Blocker Check'}
                      </span>
                      <span className="text-emerald-400 font-semibold">
                        {hindiHome ? 'इन-बिल्ट (सामान्य OCR में नहीं)' : 'Built-In (vs None in Basic OCR)'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">
                        {hindiHome ? 'GSTR-2B 6-स्टेटस Excel मिलान' : 'GSTR-2B 6-Status Excel Match'}
                      </span>
                      <span className="text-emerald-400 font-semibold">
                        {hindiHome ? 'शामिल (JSON + XLSX)' : 'Included (JSON + XLSX)'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3">
                      <span className="text-slate-400">{hindiHome ? 'समर्थित एक्सपोर्ट्स' : 'Exports Supported'}</span>
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
              {hindiHome
                ? 'मुख्य विशेषताएं · भारतीय चार्टर्ड अकाउंटेंट्स के लिए निर्मित'
                : 'Core Features · Built for Indian Chartered Accountants'}
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-main)] mt-0.5">
              {hindiHome
                ? 'भारतीय चार्टर्ड अकाउंटेंट्स (CA) के लिए निर्मित चार प्रमुख स्तंभ'
                : 'Four Pillars Engineered to Outperform Generic Enterprise OCR'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(hindiHome
            ? [
                {
                  num: '01.',
                  title: '15-अंकीय GSTIN सत्यापन',
                  copy: 'भारत के लिए निर्मित। GSTR फाइलिंग से पहले 15-अंकीय GSTIN फ़ॉर्मेट, राज्य कोड (01–38), PAN संरचना और Mod-36 चेकसम को स्वचालित रूप से निकालता और सत्यापित करता है।',
                },
                {
                  num: '02.',
                  title: 'द्विभाषी बिल स्कैनर (अंग्रेज़ी + हिंदी)',
                  copy: 'मानक टैक्स इनवॉइस के साथ क्षेत्रीय बिल भी समर्थित हैं। प्रिंटेड अंग्रेज़ी और देवनागरी हिंदी इनवॉइस से हेडर फ़ील्ड्स, लाइन आइटम और विक्रेता विवरण निकालता है।',
                },
                {
                  num: '03.',
                  title: 'क्लाइंट-स्कोप्ड डेटा आइसोलेशन',
                  copy: 'अपलोड की गई फ़ाइलें OCR के दौरान मेमोरी में प्रोसेस होती हैं, जबकि सहेजे गए क्लाइंट वर्कस्पेस और बिल प्रति-उपयोगकर्ता Firestore नियमों और वन-क्लिक डिलीट सुविधा से सुरक्षित रहते हैं।',
                },
                {
                  num: '04.',
                  title: 'डेवलपर-फ्रेंडली एक्सपोर्ट्स',
                  copy: 'मैनुअल कॉपी-पेस्ट से मुक्ति पाएं। निकाले गए डेटा को सीधे TallyPrime XML, SQL, JSON या फ़ॉर्मेटेड Excel (.xlsx) फ़ाइलों के माध्यम से अपने मौजूदा अकाउंटिंग सिस्टम में भेजें।',
                },
              ]
            : [
                {
                  num: '01.',
                  title: '15-Digit GSTIN Validation',
                  copy: 'Built for India. Automatically extracts and cross-verifies 15-digit GSTIN format, state code, PAN structure, and Mod-36 checksum before GSTR filing.',
                },
                {
                  num: '02.',
                  title: 'Bilingual Bill Scanner',
                  copy: 'Regional bills are supported alongside standard tax invoices. Extract header fields, line items, and vendor details from printed English and Hindi invoices.',
                },
                {
                  num: '03.',
                  title: 'Client-Scoped Data Isolation',
                  copy: 'Uploaded files are parsed in memory during OCR, while saved client workspaces and bills are isolated under per-user Firestore rules with one-click deletion.',
                },
                {
                  num: '04.',
                  title: 'Developer-Friendly Exports',
                  copy: 'Say goodbye to manual copy-pasting. Push extracted data directly into your existing systems via TallyPrime XML, SQL, JSON, or formatted XLSX files.',
                },
              ]
          ).map((pillar) => (
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
        aria-label={hindiHome ? 'होमपेज वर्कफ़्लो सेक्शन' : 'Homepage workflow sections'}
        className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium text-[var(--text-muted)]"
      >
        {(hindiHome
          ? [
              { id: 'live-no-login-demo', label: '01. लाइव डेमो (बिना लॉगिन)' },
              { id: 'live-ocr-workspace', label: '02. पूर्ण OCR और GSTR-2B वर्कस्पेस' },
              { id: 'practice-roi-estimator', label: '03. समय की बचत और तुलना' },
              { id: 'ca-suite-capabilities', label: '04. 9 मुख्य क्षमताएं' },
              { id: 'extracted-fields-explorer', label: '05. 30+ निकाले गए फ़ील्ड्स' },
              { id: 'practice-pricing-plans', label: '06. प्लान और सामान्य प्रश्न (FAQ)' },
            ]
          : [
              { id: 'live-no-login-demo', label: '01. Live Demo (No Login)' },
              { id: 'live-ocr-workspace', label: '02. Full OCR & GSTR-2B Workspace' },
              { id: 'practice-roi-estimator', label: '03. Time-Saved & Competitor Matrix' },
              { id: 'ca-suite-capabilities', label: '04. 9 Core Capabilities' },
              { id: 'extracted-fields-explorer', label: '05. 30+ Extracted Fields' },
              { id: 'practice-pricing-plans', label: '06. Plans & FAQ' },
            ]
        ).map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(item.id);
            }}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-indigo-500/50 hover:text-[var(--text-main)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {item.label}
          </a>
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

const ALL_EXTRACTED_FIELDS_HI: Array<{
  name: string;
  category: 'party' | 'einvoice' | 'tax' | 'boe';
  categoryLabel: string;
}> = [
  { name: 'सप्लायर का नाम (Party Ledger)', category: 'party', categoryLabel: 'पार्टी और GSTIN' },
  { name: 'सप्लायर का 15-अंकीय GSTIN', category: 'party', categoryLabel: 'पार्टी और GSTIN' },
  { name: 'सप्लायर का 10-अंकीय PAN', category: 'party', categoryLabel: 'पार्टी और GSTIN' },
  { name: 'सप्लायर का पता और राज्य कोड', category: 'party', categoryLabel: 'पार्टी और GSTIN' },
  { name: 'खरीदार का नाम और खरीदार GSTIN', category: 'party', categoryLabel: 'पार्टी और GSTIN' },
  { name: 'खरीदार का पता और राज्य कोड', category: 'party', categoryLabel: 'पार्टी और GSTIN' },
  { name: 'आपूर्ति का स्थान (Place of Supply)', category: 'party', categoryLabel: 'पार्टी और GSTIN' },
  { name: 'इनवॉइस नंबर और वाउचर प्रकार', category: 'einvoice', categoryLabel: 'E-Invoice और लॉजिस्टिक्स' },
  { name: 'इनवॉइस तिथि और देय तिथि (Due Date)', category: 'einvoice', categoryLabel: 'E-Invoice और लॉजिस्टिक्स' },
  { name: '64-कैरेक्टर e-Invoice IRN', category: 'einvoice', categoryLabel: 'E-Invoice और लॉजिस्टिक्स' },
  { name: '12-अंकीय e-Way Bill नंबर', category: 'einvoice', categoryLabel: 'E-Invoice और लॉजिस्टिक्स' },
  { name: 'e-Invoice QR कोड डेटा', category: 'einvoice', categoryLabel: 'E-Invoice और लॉजिस्टिक्स' },
  { name: 'परचेस ऑर्डर (PO) नंबर', category: 'einvoice', categoryLabel: 'E-Invoice और लॉजिस्टिक्स' },
  { name: 'भुगतान शर्तें और माध्यम', category: 'einvoice', categoryLabel: 'E-Invoice और लॉजिस्टिक्स' },
  { name: 'बैंक का नाम, खाता संख्या और IFSC', category: 'tax', categoryLabel: 'टैक्स और बैंक गणना' },
  { name: 'इनवॉइस मुद्रा (INR / Forex)', category: 'tax', categoryLabel: 'टैक्स और बैंक गणना' },
  { name: 'लाइन आइटम विवरण (Description)', category: 'tax', categoryLabel: 'टैक्स और बैंक गणना' },
  { name: 'प्रति पंक्ति HSN / SAC कोड', category: 'tax', categoryLabel: 'टैक्स और बैंक गणना' },
  { name: 'मात्रा (Quantity), इकाई (UOM) और दर', category: 'tax', categoryLabel: 'टैक्स और बैंक गणना' },
  { name: 'कर योग्य मूल्य (Taxable Subtotal)', category: 'tax', categoryLabel: 'टैक्स और बैंक गणना' },
  { name: 'CGST दर और राशि', category: 'tax', categoryLabel: 'टैक्स और बैंक गणना' },
  { name: 'SGST / UTGST दर और राशि', category: 'tax', categoryLabel: 'टैक्स और बैंक गणना' },
  { name: 'IGST दर और राशि', category: 'tax', categoryLabel: 'टैक्स और बैंक गणना' },
  { name: 'ट्रेड डिस्काउंट और अन्य शुल्क', category: 'tax', categoryLabel: 'टैक्स और बैंक गणना' },
  { name: 'राउंड-ऑफ (Round-Off) समायोजन', category: 'tax', categoryLabel: 'टैक्स और बैंक गणना' },
  { name: 'अंतिम कुल योग (Final Grand Total)', category: 'tax', categoryLabel: 'टैक्स और बैंक गणना' },
  { name: 'Bill of Entry (BOE) नंबर और तिथि', category: 'boe', categoryLabel: 'इम्पोर्ट BOE' },
  { name: 'कस्टम्स पोर्ट कोड (Import BOE)', category: 'boe', categoryLabel: 'इम्पोर्ट BOE' },
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
  currentPath?: string;
}> = ({ onNavigate, onOpenWorkspaceTab, onSignInRequest, currentPath = '/' }) => {
  const cleanSectionPath = normalizePathname(currentPath);
  const isHindi = cleanSectionPath === '/hi' || cleanSectionPath.startsWith('/hi/');

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

  const activeFieldsSource = isHindi ? ALL_EXTRACTED_FIELDS_HI : ALL_EXTRACTED_FIELDS;

  const filteredFields = useMemo(() => {
    const q = fieldSearch.trim().toLowerCase();
    return activeFieldsSource.filter((f) => {
      if (fieldCategory !== 'all' && f.category !== fieldCategory) return false;
      if (q && !f.name.toLowerCase().includes(q) && !f.categoryLabel.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [activeFieldsSource, fieldCategory, fieldSearch]);

  const activeFaqsSource = isHindi ? HOMEPAGE_FAQS_HI : HOMEPAGE_FAQS;

  const filteredFaqs = useMemo(() => {
    return activeFaqsSource.filter((faq) => {
      if (faqCategory === 'All') return true;
      const text = `${faq.question} ${faq.answer}`.toLowerCase();
      if (faqCategory === 'Tally') return text.includes('tally') || text.includes('xml') || text.includes('zoho');
      if (faqCategory === 'GSTR-2B') return text.includes('2b') || text.includes('itc') || text.includes('reconcil') || text.includes('रिकन्सिलिएशन');
      if (faqCategory === 'Security') return text.includes('secur') || text.includes('data') || text.includes('firestore') || text.includes('team') || text.includes('सुरक्षित') || text.includes('टीम');
      return !text.includes('tally') && !text.includes('2b') && !text.includes('secur') && !text.includes('सुरक्षित');
    });
  }, [activeFaqsSource, faqCategory]);

  const handleCustomDemoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const used = getBrowserDemoScansUsed();
    if (used >= 3) {
      setCustomDemoError(
        isHindi
          ? 'आपने आज के सभी 3 मुफ़्त ब्राउज़र डेमो स्कैन का उपयोग कर लिया है। अधिक इनवॉइस स्कैन करने के लिए कृपया Google से साइन इन करें।'
          : 'You have used all 3 free browser scans for today. Please sign in with Google to scan more invoices.'
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
              {isHindi
                ? 'इंटरैक्टिव एक्सट्रैक्शन सैंडबॉक्स · लॉगिन आवश्यक नहीं · '
                : 'Interactive Extraction Sandbox · No Login Required · '}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {isHindi
                  ? `आज 3 में से ${Math.max(0, 3 - scansUsedToday)} कस्टम डेमो स्कैन शेष`
                  : `${Math.max(0, 3 - scansUsedToday)} of 3 custom demo scans remaining today`}
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
              {isHindi
                ? 'GST इनवॉइस एक्सट्रैक्शन, TallyPrime XML और JSON का लाइव निरीक्षण करें'
                : 'Inspect GST Invoice Extraction, TallyPrime XML & JSON Live'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {scansUsedToday < 3 ? (
              <label className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors whitespace-nowrap shrink-0">
                <Upload className="w-4 h-4" />
                <span>
                  {customDemoLoading
                    ? isHindi
                      ? 'इनवॉइस प्रोसेस हो रहा है...'
                      : 'Extracting Invoice...'
                    : isHindi
                    ? 'सैंपल इनवॉइस अपलोड करें'
                    : 'Upload Sample Invoice'}
                </span>
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
                <span>
                  {isHindi
                    ? 'दैनिक 3-स्कैन सीमा पूर्ण — अधिक के लिए साइन इन करें'
                    : 'Daily 3-Scan Limit Reached — Sign in for More'}
                </span>
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
                {isHindi ? 'Google से साइन इन करें' : 'Sign In with Google'}
              </button>
            )}
          </div>
        )}

        {/* 3 Built-in Sample Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
          {BUILTIN_DEMO_SAMPLES.map((samp, index) => {
            const isSelected = !customDemoResult && selectedSampleId === samp.id;
            const hiLabels = [
              { meta: 'इंटर-स्टेट B2B · IGST 18%', label: 'भारती एयरटेल एंटरप्राइज लीज्ड लाइन बिल' },
              { meta: 'इंट्रा-स्टेट · CGST 9% + SGST 9%', label: 'अल्ट्राटेक सीमेंट और हार्डवेयर सप्लाई इनवॉइस' },
              { meta: 'द्विभाषी (हिंदी + अंग्रेज़ी) · GST 5%', label: 'श्री बालाजी एग्रो एंड ट्रेडर्स (देवनागरी बिल)' },
            ];
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
                  {isHindi
                    ? `सैंपल 0${index + 1} · ${hiLabels[index]?.meta || samp.meta}`
                    : `Sample 0${index + 1} · ${samp.meta}`}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--text-main)] mt-1">
                  {isHindi ? hiLabels[index]?.label || samp.label : samp.label}
                </div>
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
                    {isHindi ? 'टैक्स इनवॉइस प्रीव्यू' : 'Tax Invoice Preview'}
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
                  <div className="text-[11px] text-[var(--text-muted)]">{isHindi ? 'खरीदार (Billed To)' : 'Billed To'}</div>
                  <div className="font-semibold text-[var(--text-main)] truncate">
                    {displayedInvoice.buyerName}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--text-muted)] break-all">
                    {displayedInvoice.buyerGstin}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {isHindi ? 'आपूर्ति का स्थान और लॉजिस्टिक्स' : 'Place of Supply & Logistics'}
                  </div>
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
                <span>{isHindi ? 'कर योग्य मूल्य (Taxable Value)' : 'Taxable Value'}</span>
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
                <span>{isHindi ? `कुल योग (${displayedInvoice.currency})` : `Grand Total (${displayedInvoice.currency})`}</span>
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
                  { id: 'table' as const, label: isHindi ? 'अकाउंटिंग तालिका' : 'Accounting Table' },
                  { id: 'tally_xml' as const, label: 'TallyPrime XML' },
                  { id: 'gstr2b' as const, label: isHindi ? 'GSTR-2B जांच' : 'GSTR-2B Check' },
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
                    <div className="text-[11px] text-[var(--text-muted)]">{isHindi ? 'सप्लायर PAN' : 'Supplier PAN'}</div>
                    <div className="font-mono font-semibold text-[var(--text-main)] mt-0.5">
                      {displayedInvoice.supplierPan}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                    <div className="text-[11px] text-[var(--text-muted)]">{isHindi ? 'PO / भुगतान शर्तें' : 'PO / Payment Terms'}</div>
                    <div className="font-semibold text-[var(--text-main)] mt-0.5 truncate">
                      {displayedInvoice.poNumber} · {displayedInvoice.paymentTerms}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                    <div className="text-[11px] text-[var(--text-muted)]">{isHindi ? 'बैंक और IFSC' : 'Bank & IFSC'}</div>
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
                      {isHindi ? 'बुक्स बनाम GSTR-2B पोर्टल मिलान सिमुलेशन' : 'Books vs GSTR-2B Portal Match Simulation'}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {isHindi
                        ? 'नॉर्मलाइज़्ड मिलान कुंजी: GSTIN + इनवॉइस नंबर'
                        : 'Normalized match key: GSTIN + stripped invoice number'}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {activeSample.gstr2bStatus}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono tabular-nums">
                  <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <div className="text-[11px] text-[var(--text-muted)] font-sans">
                      {isHindi ? 'बुक्स टैक्स दावा (Books Tax)' : 'Books Tax Claim'}
                    </div>
                    <div className="text-sm font-bold text-[var(--text-main)] mt-1">
                      ₹{(displayedInvoice.cgstAmount + displayedInvoice.sgstAmount + displayedInvoice.igstAmount).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <div className="text-[11px] text-[var(--text-muted)] font-sans">
                      {isHindi ? 'पोर्टल 2B पात्र ITC' : 'Portal 2B Eligible ITC'}
                    </div>
                    <div className="text-sm font-bold text-[var(--text-main)] mt-1">
                      ₹{(displayedInvoice.cgstAmount + displayedInvoice.sgstAmount + displayedInvoice.igstAmount).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <div className="text-[11px] text-[var(--text-muted)] font-sans">
                      {isHindi ? 'टैक्स अंतर (Variance)' : 'Tax Variance'}
                    </div>
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
                <span>
                  {isHindi ? 'इंटरैक्टिव प्रैक्टिस कार्यभार कैलकुलेटर' : 'Interactive Practice Workload Estimator'}
                </span>
              </div>
              <h2 className="font-display text-xl font-bold text-[var(--text-main)]">
                {isHindi
                  ? 'मासिक वाउचर एंट्री और GSTR-2B समय की बचत का अनुमान लगाएं'
                  : 'Estimate Monthly Voucher & 2B Hours Saved'}
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <label htmlFor="roi-invoices">
                    {isHindi ? 'मासिक खरीद इनवॉइस (Purchase Invoices)' : 'Monthly Purchase Invoices'}
                  </label>
                  <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                    {monthlyInvoices.toLocaleString('en-IN')} {isHindi ? 'बिल' : 'bills'}
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
                  <label htmlFor="roi-clients">
                    {isHindi ? 'सक्रिय GST क्लाइंट्स' : 'Active GST Clients'}
                  </label>
                  <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                    {clientCount} {isHindi ? 'क्लाइंट्स' : 'clients'}
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
                <span>
                  {isHindi
                    ? 'मासिक GSTR-2B Excel रिकन्सिलिएशन समय शामिल करें'
                    : 'Include monthly GSTR-2B Excel reconciliation time'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--border-color)] font-mono tabular-nums">
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="text-[10px] font-sans text-[var(--text-muted)]">
                  {isHindi ? 'मैनुअल एंट्री' : 'Manual Entry'}
                </div>
                <div className="text-base font-bold text-[var(--text-main)] mt-0.5">
                  {estimatedTimeStats.manualHours}h
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="text-[10px] font-sans text-[var(--text-muted)]">
                  {isHindi ? 'समीक्षा सहित' : 'With Review'}
                </div>
                <div className="text-base font-bold text-[var(--text-main)] mt-0.5">
                  {estimatedTimeStats.withLedgerSutraHours}h
                </div>
              </div>
              <div className="p-3 rounded-lg bg-indigo-600 text-white">
                <div className="text-[10px] font-sans text-indigo-100">
                  {isHindi ? 'बचाया गया समय' : 'Hours Saved'}
                </div>
                <div className="text-base font-bold mt-0.5">
                  ~{estimatedTimeStats.hoursSaved}h/mo
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {isHindi
                ? 'उदाहरणात्मक गणना: प्रति इनवॉइस लगभग 3.5 मिनट मैनुअल वाउचर व लेजर एंट्री बनाम लगभग 0.6 मिनट समीक्षा और एक्सपोर्ट।'
                : 'Illustrative workflow calculation assuming ~3.5 min manual voucher & ledger entry per invoice vs ~0.6 min review & export.'}
            </p>
          </div>

          {/* Right: Manual Entry vs LedgerSutra Comparison */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="text-xs font-medium text-[var(--text-muted)]">
                {isHindi ? 'समस्या बनाम समाधान' : 'Problem vs Solution'}
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--text-main)] mt-1">
                {isHindi
                  ? `भारतीय CA फर्में मैनुअल वाउचर एंट्री के स्थान पर ${BRAND_NAME} क्यों अपनाती हैं`
                  : `Why Indian CA Firms Replace Manual Voucher Entry with ${BRAND_NAME}`}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-3">
                <div className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{isHindi ? 'मैनुअल डेटा एंट्री की बाधाएं' : 'Manual Data Entry Bottlenecks'}</span>
                </div>
                {isHindi ? (
                  <ul className="space-y-2.5 text-xs text-[var(--text-muted)] leading-relaxed">
                    <li>GSTR-3B की समय-सीमा से पहले 15-अंकीय GSTIN, इनवॉइस नंबर और HSN पंक्तियों को हाथ से टाइप करना।</li>
                    <li>अक्षरों की टाइपिंग त्रुटियों (`8` बनाम `B`, `0` बनाम `O`) के कारण अनावश्यक GSTR-2B मिसमैच होना।</li>
                    <li>क्लाइंट द्वारा WhatsApp फोटो और ईमेल PDF दोनों भेजने पर एक ही इनवॉइस की दोबारा एंट्री हो जाना।</li>
                    <li>TallyPrime के भीतर Sundry Creditor लेजर और टैक्स विभाजन को मैनुअल रूप से बनाना।</li>
                  </ul>
                ) : (
                  <ul className="space-y-2.5 text-xs text-[var(--text-muted)] leading-relaxed">
                    <li>Typing 15-character GSTINs, invoice numbers, and HSN rows by hand before GSTR-3B deadlines.</li>
                    <li>Transposing characters (`8` vs `B`, `0` vs `O`) causing avoidable GSTR-2B mismatches.</li>
                    <li>Double-booking invoices when clients share both a WhatsApp photo and an email PDF.</li>
                    <li>Manually creating Sundry Creditor ledgers and tax splits inside TallyPrime.</li>
                  </ul>
                )}
              </div>

              <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-3">
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{isHindi ? `संरचित ${BRAND_NAME} वर्कफ़्लो` : `Structured ${BRAND_NAME} Workflow`}</span>
                </div>
                {isHindi ? (
                  <ul className="space-y-2.5 text-xs text-[var(--text-muted)] leading-relaxed">
                    <li>रीयल-टाइम प्रति-फ़ाइल क्यू प्रोग्रेस बार के साथ एक साथ दर्जनों PDF और फोटो बैच अपलोड करें।</li>
                    <li>15-अंकीय GSTIN Mod-36 चेकसम और लाइन-आइटम टैक्स गणित (Tax Math) की स्वचालित जांच।</li>
                    <li>डुप्लिकेट इनवॉइस की स्वचालित पहचान (`Merge Items`, `Overwrite`, या `Save as Duplicate` विकल्प)।</li>
                    <li>एक क्लिक में TallyPrime XML वाउचर और 6-स्टेटस GSTR-2B Excel रिकन्सिलिएशन रिपोर्ट।</li>
                  </ul>
                ) : (
                  <ul className="space-y-2.5 text-xs text-[var(--text-muted)] leading-relaxed">
                    <li>Batch upload PDFs &amp; photos simultaneously with real-time per-file queue progress bars.</li>
                    <li>Deterministic 15-character GSTIN Mod-36 checksum and line-item tax math verification.</li>
                    <li>Automatic duplicate invoice prompt (`Merge Items`, `Overwrite`, or `Save as Duplicate`).</li>
                    <li>One-click TallyPrime XML vouchers + 6-status GSTR-2B Excel reconciliation report.</li>
                  </ul>
                )}
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
              {isHindi ? 'संपूर्ण CA प्रैक्टिस सुइट' : 'Complete CA Practice Suite'}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-main)] mt-1">
              {isHindi
                ? 'GST प्रैक्टिशनर्स और ऑडिट टीमों के लिए निर्मित 9 मुख्य क्षमताएं'
                : 'Nine Capabilities Built for GST Practitioners & Audit Teams'}
            </h2>
          </div>
          <a
            href="/app"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onOpenWorkspaceTab('scanner', 'ca_mode');
              }
            }}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-left cursor-pointer whitespace-nowrap shrink-0"
          >
            {isHindi ? 'पूर्ण वर्कस्पेस खोलें →' : 'Launch Full Suite Workspace →'}
          </a>
        </div>

        {/* Asymmetric Bento Row 1: Two Marquee Spotlight Cards with Editorial Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 p-6 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {isHindi
                  ? '01. TallyPrime XML एक्सपोर्ट और प्री-एक्सपोर्ट वैलिडेटर'
                  : '01. TallyPrime XML Export & Pre-Export Validator'}
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                {isHindi
                  ? 'ऑटोमैटिक पार्टी लेजर निर्माण के साथ सीधा परचेस वाउचर XML जनरेशन'
                  : 'Direct Purchase Voucher XML Generation with Ledger Auto-Create'}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {isHindi
                  ? 'Party क्रेडिट, Purchase डेबिट, CGST/SGST/IGST लेजर, राउंड-ऑफ और ब्लॉक्ड-बिल वैलिडेशन (Fix Now या Skip विकल्प) के साथ TallyPrime-इम्पोर्ट योग्य परचेस वाउचर (ENVELOPE > TALLYMESSAGE > VOUCHER) जनरेट करता है।'
                  : 'Generates TallyPrime-importable Purchase Vouchers (`ENVELOPE > TALLYMESSAGE > VOUCHER`) with Party credit, Purchase debit, CGST/SGST/IGST ledgers, round-off, and blocked-bill validation (`Fix Now` or skip).'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Tally XML · Zoho Books CSV · Busy Excel
              </span>
              <a
                href={isHindi ? '/hi/gst-invoice-to-tally' : '/gst-invoice-to-tally'}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate(isHindi ? '/hi/gst-invoice-to-tally' : '/gst-invoice-to-tally');
                  }
                }}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {isHindi ? 'Tally XML गाइड पढ़ें →' : 'Read Tally Guide →'}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-[var(--border-color)] bg-slate-900 overflow-hidden relative min-h-[220px] flex flex-col justify-end">
            <EditorialVisual
              src={invoiceAuditImg}
              alt={
                isHindi
                  ? 'GSTR-2B रिकन्सिलिएशन स्टेटस के साथ GST परचेस रजिस्टर'
                  : 'GST purchase register with GSTR-2B reconciliation statuses'
              }
              fallbackTitle={isHindi ? '02. GSTR-2B रिकन्सिलिएशन' : '02. GSTR-2B Reconciliation'}
              fallbackSubtitle={isHindi ? 'बुक्स बनाम पोर्टल JSON और Excel मिलान' : 'Match Books vs Portal JSON & Excel'}
              width={900}
              height={600}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
            <div className="relative z-10 p-5 space-y-2 text-slate-100">
              <div className="text-xs font-semibold text-indigo-300">
                {isHindi ? '02. GSTR-2B रिकन्सिलिएशन' : '02. GSTR-2B Reconciliation'}
              </div>
              <h3 className="text-base font-bold">
                {isHindi
                  ? 'पोर्टल JSON/Excel अपलोड करें और 6 स्थितियों में जोखिम वाले ITC की पहचान करें'
                  : 'Upload Portal JSON/Excel & Flag ITC at Risk Across 6 Statuses'}
              </h3>
              <a
                href={isHindi ? '/hi/gstr-2b-reconciliation-excel' : '/gstr-2b-reconciliation-excel'}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate(isHindi ? '/hi/gstr-2b-reconciliation-excel' : '/gstr-2b-reconciliation-excel');
                  }
                }}
                className="text-xs font-semibold text-white hover:underline cursor-pointer inline-block"
              >
                {isHindi ? '2B रिकन्सिलिएशन देखें →' : 'Explore 2B Matcher →'}
              </a>
            </div>
          </div>
        </div>

        {/* Remaining 7 Capabilities in Clean Hairline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(isHindi
            ? [
                {
                  title: '03. डुप्लिकेट इनवॉइस की पहचान',
                  desc: 'सप्लायर के नाम और इनवॉइस नंबर के आधार पर सहेजे गए रिकॉर्ड्स से प्रत्येक बिल की जांच करता है और Merge Items, Overwrite या Save as Duplicate का विकल्प देता है।',
                  link: '/blog/how-to-find-duplicate-purchase-invoices-before-filing-gst',
                  linkLabel: 'डुप्लिकेट इनवॉइस पहचान के बारे में जानें →',
                },
                {
                  title: '04. GSTIN सत्यापन और टैक्स ऑडिट',
                  desc: '15-अंकीय GSTIN फ़ॉर्मेट, राज्य कोड और आधिकारिक Mod-36 चेकसम अंक को सत्यापित करता है तथा प्रिंटेड टैक्स विभाजन के विरुद्ध लाइन-आइटम योग की जांच करता है।',
                  link: '/gst-invoice-data-extraction',
                  linkLabel: 'GSTIN और टैक्स एक्सट्रैक्शन के बारे में जानें →',
                },
                {
                  title: '05. बैच प्रोसेसिंग क्यू (Batch Queue)',
                  desc: 'इंटरैक्टिव फ़ाइल क्यू और प्रति-फ़ाइल प्रोग्रेस बार के साथ दर्जनों मल्टी-पेज PDF और बिल फोटो एक साथ अपलोड और प्रोसेस करें।',
                  link: '/bulk-invoice-processing-for-ca',
                  linkLabel: 'बल्क इनवॉइस प्रोसेसिंग के बारे में जानें →',
                },
                {
                  title: '06. क्लाइंट-वाइज़ वर्कस्पेस',
                  desc: 'Firestore में समर्पित CA क्लाइंट प्रोफ़ाइल के तहत बिल, दस्तावेज़, GSTR-2B रिकन्सिलिएशन और Tally लेजर सेटिंग्स को अलग-अलग व्यवस्थित करें।',
                  link: '/hi/features',
                  linkLabel: 'क्लाइंट-वाइज़ वर्कस्पेस के बारे में जानें →',
                },
                {
                  title: '07. टीम एक्सेस और अप्रूवल वर्कफ़्लो',
                  desc: 'Owner/CA, Reviewer और Staff भूमिकाएं असाइन करें। स्टाफ Draft/Pending बिल अपलोड करता है; Reviewers ऑडिट ट्रेल के साथ स्वीकृत या अस्वीकृत करते हैं।',
                  link: '/security',
                  linkLabel: 'टीम RBAC और सुरक्षा के बारे में जानें →',
                },
                {
                  title: '08. मल्टी-फ़ॉर्मेट अकाउंटिंग एक्सपोर्ट',
                  desc: 'सत्यापित परचेस रजिस्टर को TallyPrime XML, मल्टी-शीट Excel (.xlsx), Zoho Books CSV, Busy Excel, JSON, SQL और TXT में एक्सपोर्ट करें।',
                  link: '/hi/pdf-invoice-to-excel',
                  linkLabel: 'PDF से Excel एक्सपोर्ट के बारे में जानें →',
                },
                {
                  title: '09. डेवलपर REST API (v1)',
                  desc: 'इन-बिल्ट रेट लिमिटिंग और SHA-256 हैश्ड API कुंजियों का उपयोग करके अपने कस्टम ERP या फर्म पोर्टल में POST /api/v1/extract को इंटीग्रेट करें।',
                  link: '/api-docs',
                  linkLabel: 'REST API v1 के बारे में जानें →',
                },
              ]
            : [
                {
                  title: '03. Duplicate Invoice Detection',
                  desc: 'Checks every bill against saved records by Supplier Name and Invoice Number, prompting you to Merge Items, Overwrite, or Save as Duplicate.',
                  link: '/blog/how-to-find-duplicate-purchase-invoices-before-filing-gst',
                  linkLabel: 'Learn more about Duplicate Invoice Detection →',
                },
                {
                  title: '04. GSTIN Validation & Tax Audit',
                  desc: 'Validates 15-character GSTIN format, state code, and official Mod-36 checksum digit while verifying line-item taxable sums against printed tax splits.',
                  link: '/gst-invoice-data-extraction',
                  linkLabel: 'Learn more about GSTIN & Tax Extraction →',
                },
                {
                  title: '05. Batch Processing Queue',
                  desc: 'Upload dozens of multi-page PDFs and bill photos simultaneously with an interactive file queue and per-file progress bars.',
                  link: '/bulk-invoice-processing-for-ca',
                  linkLabel: 'Learn more about Bulk Invoice Processing →',
                },
                {
                  title: '06. Client-Wise Workspace',
                  desc: 'Organize bills, documents, GSTR-2B reconciliations, and Tally ledger settings under dedicated CA client profiles in Firestore.',
                  link: '/features',
                  linkLabel: 'Learn more about Client-Wise Workspaces →',
                },
                {
                  title: '07. Team Access & Approval Workflow',
                  desc: 'Assign Owner/CA, Reviewer, and Staff roles. Staff upload Draft/Pending bills; Reviewers approve or reject with an audit trail.',
                  link: '/security',
                  linkLabel: 'Learn more about Team RBAC & Security →',
                },
                {
                  title: '08. Multi-Format Accounting Export',
                  desc: 'Export validated purchase registers to TallyPrime XML, multi-sheet Excel (.xlsx), Zoho Books CSV, Busy Excel, JSON, SQL, and verbatim TXT.',
                  link: '/pdf-invoice-to-excel',
                  linkLabel: 'Learn more about PDF to Excel Exports →',
                },
                {
                  title: '09. Developer REST API (v1)',
                  desc: 'Integrate POST /api/v1/extract into your custom ERP or firm portal using SHA-256 hashed API keys with built-in rate limiting.',
                  link: '/api-docs',
                  linkLabel: 'Learn more about REST API v1 →',
                },
              ]
          ).map((feat) => (
            <div
              key={feat.title}
              className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[var(--text-main)]">{feat.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{feat.desc}</p>
              </div>
              <a
                href={feat.link}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate(feat.link);
                  }
                }}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-left cursor-pointer"
              >
                {feat.linkLabel}
              </a>
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
              {isHindi
                ? 'व्यापक स्कीमा कवरेज · फ़िल्टर करने योग्य कॉलम निर्देशिका'
                : 'Comprehensive Schema Coverage · Filterable Column Directory'}
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-main)] mt-1">
              {isHindi
                ? '30+ इनवॉइस, E-Invoice और Bill of Entry फ़ील्ड्स का स्वचालित एक्सट्रैक्शन'
                : '30+ Invoice, E-Invoice & Bill of Entry Fields Extracted Automatically'}
            </h2>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fieldSearch}
                onChange={(e) => setFieldSearch(e.target.value)}
                placeholder={isHindi ? 'फ़ील्ड्स खोजें (जैसे IRN, IFSC, HSN)' : 'Filter fields (e.g. IRN, IFSC, HSN)'}
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>
          </div>
        </div>

        {/* Interactive Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            {
              id: 'all' as const,
              label: isHindi
                ? `सभी फ़ील्ड्स (${activeFieldsSource.length})`
                : `All Fields (${ALL_EXTRACTED_FIELDS.length})`,
            },
            { id: 'party' as const, label: isHindi ? 'पार्टी और GSTIN' : 'Party & GSTIN' },
            { id: 'einvoice' as const, label: isHindi ? 'E-Invoice और लॉजिस्टिक्स' : 'E-Invoice & Logistics' },
            { id: 'tax' as const, label: isHindi ? 'टैक्स और बैंक गणना' : 'Tax & Bank Math' },
            { id: 'boe' as const, label: isHindi ? 'इम्पोर्ट BOE' : 'Import BOE' },
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
              {isHindi ? `"${fieldSearch}" से मेल खाने वाला कोई फ़ील्ड नहीं मिला। ` : `No extracted fields match "${fieldSearch}". `}
              <button
                onClick={() => {
                  setFieldSearch('');
                  setFieldCategory('all');
                }}
                className="text-indigo-500 font-semibold hover:underline cursor-pointer"
              >
                {isHindi ? 'फ़िल्टर रीसेट करें' : 'Reset Filter'}
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
                {isHindi ? 'तीन-चरणीय प्रैक्टिस वर्कफ़्लो' : 'Three-Step Practice Workflow'}
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--text-main)] mt-1">
                {isHindi
                  ? 'क्लाइंट इनवॉइस फ़ोल्डर से Tally और GSTR-2B साइन-ऑफ़ तक'
                  : 'From Client Invoice Folder to Tally & 2B Sign-Off'}
              </h2>
            </div>

            <div className="space-y-4">
              {(isHindi
                ? [
                    {
                      num: '01.',
                      title: 'क्लाइंट चुनें और इनवॉइस अपलोड करें',
                      desc: 'हेडर में अपना क्लाइंट वर्कस्पेस चुनें और सिंगल या बैच PDF, मल्टी-पेज स्टेटमेंट, Bill of Entry या मोबाइल फोटो अपलोड करें।',
                    },
                    {
                      num: '02.',
                      title: 'स्वचालित GST ऑडिट और समीक्षा क्यू (Review Queue)',
                      desc: 'CA Saarthi AI हेडर और लाइन-आइटम फ़ील्ड्स निकालता है, GSTIN Mod-36 चेकसम सत्यापित करता है, डुप्लिकेट इनवॉइस चिह्नित करता है और CA Reviewer की स्वीकृति के लिए बिल भेजता है।',
                    },
                    {
                      num: '03.',
                      title: 'GSTR-2B मिलान करें और Tally में एक्सपोर्ट करें',
                      desc: 'स्वीकृत बिलों का पोर्टल GSTR-2B JSON/Excel फ़ाइलों से मिलान करें और TallyPrime XML वाउचर, Excel रजिस्टर, Zoho CSV या Busy शीट डाउनलोड करें।',
                    },
                  ]
                : [
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
                  ]
              ).map((st) => (
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
                alt={
                  isHindi
                    ? 'CA Saarthi AI Tally वैलिडेटर में चिह्नित इनवॉइस की समीक्षा करते हुए CA'
                    : 'CA reviewing flagged invoices in the CA Saarthi AI Tally validator'
                }
                fallbackTitle={isHindi ? 'CA प्रैक्टिस डुअल-मॉनिटर वर्कफ़्लो' : 'CA Practice Dual-Monitor Workflow'}
                fallbackSubtitle={
                  isHindi
                    ? 'TallyPrime XML, GSTR-2B रिकन्सिलिएशन और क्लाइंट वर्कस्पेस'
                    : 'TallyPrime XML, GSTR-2B Reconciliation & Client Workspaces'
                }
                width={900}
                height={520}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-white">
                  {isHindi ? `${BRAND_NAME} CA वर्कस्पेस के भीतर` : `Inside the ${BRAND_NAME} CA Workspace`}
                </span>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950/85 border border-slate-700/70">
                  {[
                    { id: 'tally' as const, label: isHindi ? 'Tally वैलिडेटर' : 'Tally Validator' },
                    { id: 'gstr2b' as const, label: isHindi ? '2B मिलान' : '2B Matcher' },
                    { id: 'queue' as const, label: isHindi ? 'बैच क्यू' : 'Batch Queue' },
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
                    <span>
                      {isHindi
                        ? 'प्री-एक्सपोर्ट वैलिडेटर और लेजर मैपिंग'
                        : 'Pre-Export Validator & Ledger Mapping'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {isHindi
                      ? 'XML जनरेशन से पहले ब्लॉक्ड बिलों (अनुपलब्ध इनवॉइस नंबर, अमान्य GSTIN चेकसम, टैक्स गणित अंतर) को चिह्नित करता है, जिसमें वन-क्लिक Fix Now या Skip & Export Valid Bills विकल्प होते हैं।'
                      : 'Flags blocked bills (missing invoice number, invalid GSTIN checksum, tax math variance) before XML generation, with one-click Fix Now or Skip & Export Valid Bills actions.'}
                  </p>
                </div>
              )}

              {previewMode === 'gstr2b' && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    <span>
                      {isHindi
                        ? 'साइड-बाय-साइड परचेस रजिस्टर बनाम पोर्टल GSTR-2B'
                        : 'Side-by-Side Purchase Register vs Portal 2B'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {isHindi
                      ? 'जोखिम वाले ITC (ITC at Risk) योग के साथ प्रत्येक इनवॉइस को 6 स्थितियों (Matched, Amount Mismatch, Date Mismatch, Probable Invoice Mismatch, In Books Only, In 2B Only) में वर्गीकृत करता है।'
                      : 'Categorizes every invoice across 6 actionable statuses (Matched, Amount Mismatch, Date Mismatch, Probable Invoice Mismatch, In Books Only, In 2B Only) with ITC at Risk totals.'}
                  </p>
                </div>
              )}

              {previewMode === 'queue' && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>
                      {isHindi ? 'मल्टी-फ़ाइल बैच प्रोसेसिंग क्यू' : 'Multi-File Batch Processing Queue'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {isHindi
                      ? 'PDF और इमेज एक साथ अपलोड करें, प्रति-फ़ाइल प्रोग्रेस बार ट्रैक करें, विफल स्कैन को रीट्राई करें और सहेजने से पहले डुप्लिकेट बिलों का समाधान करें।'
                      : 'Upload PDFs and images together, track individual per-file progress bars, retry failed scans, and resolve duplicate bills interactively before saving.'}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)]">
                  {isHindi ? 'ऊपर लाइव वर्कस्पेस में उपलब्ध' : 'Available live above in workspace'}
                </span>
                <a
                  href="/app"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                      e.preventDefault();
                      onOpenWorkspaceTab(previewMode === 'queue' ? 'scanner' : 'master_sheet', 'ca_mode');
                    }
                  }}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {isHindi ? 'यह व्यू लाइव खोलें →' : 'Open this view live →'}
                </a>
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
              {isHindi ? 'पारदर्शी सुरक्षा आर्किटेक्चर' : 'Truthful Security Architecture'}
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text-main)] mt-1">
              {isHindi
                ? 'क्लाइंट रिकॉर्ड्स के लिए सुरक्षा और डेटा आइसोलेशन'
                : 'Security & Data Isolation for Client Records'}
            </h2>
          </div>
          <a
            href="/security"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/security');
              }
            }}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            {isHindi ? 'पूर्ण सुरक्षा आर्किटेक्चर पढ़ें →' : 'Read Full Security Architecture →'}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                {isHindi
                  ? 'हाइब्रिड OCR: क्लाउड AI और लोकल ब्राउज़र फ़ॉलबैक'
                  : 'Hybrid OCR: Cloud AI & Local Browser Fallback'}
              </span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {isHindi ? (
                <>
                  प्राथमिक OCR सर्वर डिस्क पर कच्ची फ़ाइलें लिखे बिना <code className="font-mono">/api/extract-document</code> के माध्यम से मेमोरी में चलता है। ऑफ़लाइन या फ़ॉलबैक OCR PDF.js और Tesseract.js (<code className="font-mono">eng+hin</code>) का उपयोग करके ब्राउज़र में स्थानीय रूप से चलता है।
                </>
              ) : (
                <>
                  Primary OCR runs in memory via <code className="font-mono">/api/extract-document</code> without writing raw files to server disk. Offline or fallback OCR runs locally in the browser using PDF.js &amp; Tesseract.js (<code className="font-mono">eng+hin</code>).
                </>
              )}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                {isHindi
                  ? 'प्रति-उपयोगकर्ता और प्रति-क्लाइंट Firestore आइसोलेशन'
                  : 'Per-User & Per-Client Firestore Isolation'}
              </span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {isHindi ? (
                <>
                  साइन इन करने पर, सहेजे गए क्लाइंट, बिल और ऑडिट ट्रेल{' '}
                  <code className="font-mono">/users/&#123;uid&#125;/clients/&#123;clientId&#125;</code> के अंतर्गत संग्रहीत होते हैं और <code className="font-mono">firestore.rules</code> स्वामित्व एवं RBAC नियमों द्वारा सुरक्षित रहते हैं।
                </>
              ) : (
                <>
                  When signed in, saved clients, bills, and audit trails are persisted under{' '}
                  <code className="font-mono">/users/&#123;uid&#125;/clients/&#123;clientId&#125;</code> and enforced by <code className="font-mono">firestore.rules</code> ownership &amp; RBAC checks.
                </>
              )}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                {isHindi
                  ? 'ट्रांज़िट में HTTPS, SHA-256 कुंजियां और तुरंत डिलीट'
                  : 'HTTPS in Transit, SHA-256 Keys & Instant Deletion'}
              </span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {isHindi
                ? 'सभी ट्रैफ़िक ट्रांज़िट में HTTPS/TLS का उपयोग करता है, REST API कुंजियों को स्टोरेज से पहले SHA-256 के साथ हैश किया जाता है, और उपयोगकर्ता किसी भी समय व्यक्तिगत बिल, क्लाइंट वर्कस्पेस या सभी खाता रिकॉर्ड हटा सकते हैं।'
                : 'All traffic uses HTTPS/TLS in transit, REST API keys are hashed with SHA-256 before storage, and users can delete individual bills, client workspaces, or all account records anytime.'}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 9: PRICING SECTION (TASK 7 — CLEAN EARLY-ACCESS PLANS)       */}
      {/* =================================================================== */}
      <section
        id="practice-pricing-plans"
        className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6 scroll-mt-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-medium text-[var(--text-muted)]">
              {isHindi
                ? 'पारदर्शी प्रैक्टिस प्लान · कस्टम CA-फर्म पायलट ऑफ़र उपलब्ध'
                : 'Transparent Practice Plans · Custom CA-Firm Pilot Offers Available'}
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text-main)] mt-1">
              {isHindi
                ? 'सोलो प्रैक्टिशनर्स और मल्टी-पार्टनर CA फर्मों के लिए प्लान'
                : 'Plans for Solo Practitioners & Multi-Partner CA Firms'}
            </h2>
          </div>
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {isHindi
              ? 'पायलट फर्मों के लिए अर्ली-एक्सेस प्राइसिंग।'
              : 'Early-access pricing — locked for pilot firms.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(isHindi ? PRACTICE_PRICING_PLANS_HI : PRACTICE_PRICING_PLANS).map((plan) => (
            <div
              key={plan.id}
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
              <a
                href="/contact"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('/contact');
                  }
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold text-center transition-colors cursor-pointer block ${
                  plan.highlighted
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                {isHindi ? 'CA-फर्म पायलट ऑफ़र का अनुरोध करें' : 'Request CA-Firm Pilot Offer'}
              </a>
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
              {isHindi
                ? `अक्सर पूछे जाने वाले प्रश्न (FAQs) · ${activeFaqsSource.length} प्रैक्टिशनर उत्तर`
                : `Frequently Asked Questions · ${HOMEPAGE_FAQS.length} Practitioner Answers`}
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text-main)] mt-1">
              {isHindi
                ? 'चार्टर्ड अकाउंटेंट्स और टैक्स टीमों के सामान्य प्रश्न'
                : 'Questions from Chartered Accountants & Tax Teams'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'All' as const, label: isHindi ? 'सभी (All)' : 'All' },
                { id: 'Tally' as const, label: 'Tally' },
                { id: 'GSTR-2B' as const, label: 'GSTR-2B' },
                { id: 'Security' as const, label: isHindi ? 'सुरक्षा (Security)' : 'Security' },
                { id: 'General' as const, label: isHindi ? 'सामान्य (General)' : 'General' },
              ]
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setFaqCategory(cat.id);
                  setOpenFaqIdx(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  faqCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                {cat.label}
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
  const routeAudit = resolveRouteAudit(currentPath);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactFirm, setContactFirm] = useState('');

  // Shared Visible Breadcrumb Strip for all non-home routes (Task 1 — Home > Section > Current Page)
  const renderBreadcrumb = (label: string, section?: { name: string; path: string }) => (
    <nav aria-label="Breadcrumb" className="text-xs text-[var(--text-muted)] flex flex-wrap items-center gap-1.5">
      <a
        href="/"
        onClick={(e) => {
          if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
            e.preventDefault();
            onNavigate('/');
          }
        }}
        className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline font-medium"
      >
        Home
      </a>
      {section && (
        <>
          <span aria-hidden="true">&gt;</span>
          <a
            href={section.path}
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate(section.path);
              }
            }}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline font-medium"
          >
            {section.name}
          </a>
        </>
      )}
      <span aria-hidden="true">&gt;</span>
      <span className="font-semibold text-[var(--text-main)] truncate max-w-md">{label}</span>
    </nav>
  );

  // 0a. Obsolete Paisa Saarthi / Personal-Finance Routes (HTTP 410 Gone — no indiscriminate redirect)
  if (routeAudit.routeKind === 'obsolete_gone') {
    return (
      <section className="rounded-2xl border border-amber-500/30 bg-[var(--bg-card)] p-6 sm:p-10 space-y-5 max-w-3xl">
        {renderBreadcrumb('410 Gone')}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>HTTP 410 Gone · Legacy Personal-Finance Route Retired · noindex, nofollow</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
          410 Gone — Legacy Personal-Finance Page Removed
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          The URL <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--bg-subtle)]">{cleanPath}</code>{' '}
          belonged to an older personal-finance or scheme directory that has been permanently retired and de-indexed.{' '}
          <strong className="text-[var(--text-main)]">{BRAND_NAME}</strong> is a dedicated B2B GST invoice OCR,
          TallyPrime XML export, and GSTR-2B reconciliation platform built exclusively for Indian Chartered Accountants
          and tax practitioners.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href="/"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
          >
            Go to {BRAND_NAME} Homepage
          </a>
          <a
            href="/app"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/app');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
          >
            Open CA Invoice OCR Workspace (/app)
          </a>
        </div>
      </section>
    );
  }

  // 0b. Unknown / Non-Existent Routes (HTTP 404 Not Found)
  if (routeAudit.routeKind === 'not_found') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-5 max-w-3xl">
        {renderBreadcrumb('404 Not Found')}
        <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
          HTTP 404 Not Found · noindex, nofollow
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
          404 — Page Not Found
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          The requested path <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--bg-subtle)]">{cleanPath}</code>{' '}
          could not be found on {BRAND_NAME}. Choose a canonical CA workflow page below:
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href="/"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
          >
            Return to Homepage
          </a>
          <a
            href="/app"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/app');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
          >
            Open CA Workspace (/app)
          </a>
          <a
            href="/blog"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/blog');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
          >
            Browse CA Practice Blog
          </a>
        </div>
      </section>
    );
  }

  // 0c. Hindi Localized Routes (/hi/* — Task 12)
  if (HINDI_LOCALIZED_ROUTES[cleanPath]) {
    const hiSpec = HINDI_LOCALIZED_ROUTES[cleanPath];
    return (
      <article className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {renderBreadcrumb(hiSpec.h1)}
          <a
            href={hiSpec.enPath}
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate(hiSpec.enPath);
              }
            }}
            className="px-3 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Read in English ({hiSpec.enPath}) →
          </a>
        </div>
        <div className="space-y-3 border-b border-[var(--border-color)] pb-6">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{hiSpec.breadcrumbName}</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-main)]">{hiSpec.h1}</h1>
          <p className="text-base text-[var(--text-muted)]">{hiSpec.subtitle}</p>
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="/app"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onOpenWorkspaceTab('scanner', 'ca_mode');
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
            >
              CA वर्कस्पेस खोलें (/app)
            </a>
            <a
              href="/hi"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/hi');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
            >
              हिंदी होमपेज (/hi)
            </a>
          </div>
        </div>
        <div className="space-y-4 max-w-3xl">
          <p className="text-sm text-[var(--text-main)] leading-relaxed">
            {hiSpec.description}
          </p>
        </div>

        {cleanPath === '/hi/pricing' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {PRACTICE_PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
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
                  <p className="text-xs text-[var(--text-muted)]">{plan.audience}</p>
                  <ul className="space-y-2 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-main)]">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={plan.ctaHref}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                      e.preventDefault();
                      if (plan.ctaHref === '/app') {
                        onOpenWorkspaceTab('scanner', 'ca_mode');
                      } else {
                        onNavigate(plan.ctaHref);
                      }
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold text-center transition-colors cursor-pointer block ${
                    plan.highlighted
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--border-color)]'
                  }`}
                >
                  {plan.ctaLabel}
                </a>
              </div>
            ))}
          </div>
        )}

        {cleanPath === '/hi/features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {DETAILED_FEATURES_SPECS.map((feat) => (
              <div
                key={feat.id}
                className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2.5"
              >
                <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {feat.number}. {feat.badge}
                </div>
                <h2 className="text-base font-bold text-[var(--text-main)]">{feat.title}</h2>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{feat.whatItDoes}</p>
                <a
                  href={feat.linkHref}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate(feat.linkHref);
                    }
                  }}
                  className="inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {feat.linkLabel}
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] leading-relaxed">
          संबंधित वर्कफ़्लो:{' '}
          <a href="/hi/gst-invoice-to-tally" onClick={(e) => { e.preventDefault(); onNavigate('/hi/gst-invoice-to-tally'); }} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            GST बिल से TallyPrime XML
          </a>{' '}
          ·{' '}
          <a href="/hi/gstr-2b-reconciliation-excel" onClick={(e) => { e.preventDefault(); onNavigate('/hi/gstr-2b-reconciliation-excel'); }} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            GSTR-2B रिकॉन्सिलिएशन
          </a>{' '}
          ·{' '}
          <a href="/hi/pdf-invoice-to-excel" onClick={(e) => { e.preventDefault(); onNavigate('/hi/pdf-invoice-to-excel'); }} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            PDF से Excel (.XLSX)
          </a>{' '}
          ·{' '}
          <a href="/hi/pricing" onClick={(e) => { e.preventDefault(); onNavigate('/hi/pricing'); }} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            प्राइसिंग प्लान्स
          </a>
        </div>
      </article>
    );
  }

  // 1. Dedicated SEO Landing Pages
  if (DEDICATED_SEO_PAGES[cleanPath]) {
    const spec = DEDICATED_SEO_PAGES[cleanPath];
    return (
      <article className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-8">
        {renderBreadcrumb(spec.h1, { name: 'Features', path: '/features' })}
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
            <a
              href="/app"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onOpenWorkspaceTab('scanner', 'ca_mode');
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
            >
              Try Free Demo in CA Workspace
            </a>
            <a
              href="/"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
            >
              Back to Homepage
            </a>
          </div>
        </div>

        <div className="space-y-4 max-w-3xl">
          {spec.longFormParagraphs && spec.longFormParagraphs.length > 0 && (
            <>
              <h2 className="font-display text-xl font-bold text-[var(--text-main)]">
                Why Indian CA Firms Automate This Workflow with {BRAND_NAME}
              </h2>
              {spec.longFormParagraphs.map((para, i) => (
                <p key={i} className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {para}
                </p>
              ))}
            </>
          )}
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Explore related CA workflows:{' '}
            <a
              href="/gst-invoice-to-tally"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/gst-invoice-to-tally');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              GST Invoice to TallyPrime XML
            </a>
            ,{' '}
            <a
              href="/gstr-2b-reconciliation-excel"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/gstr-2b-reconciliation-excel');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              GSTR-2B Reconciliation in Excel
            </a>
            ,{' '}
            <a
              href="/bulk-invoice-processing"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/bulk-invoice-processing');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Bulk Invoice Processing
            </a>
            ,{' '}
            <a
              href="/pdf-invoice-to-excel"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/pdf-invoice-to-excel');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Convert PDF Invoices to Excel
            </a>
            , and{' '}
            <a
              href="/pricing"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/pricing');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              CA Firm Pricing Plans
            </a>
            .
          </p>
        </div>

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

  // 2. Blog / Resource Article Detail Page (Task 1, Task 4, Task 8)
  const article = RESOURCE_ARTICLES.find(
    (a) => a.path === cleanPath || `/blog/${a.slug}` === cleanPath || `/resources/${a.slug}` === cleanPath
  );
  if (article) {
    const author = DEFAULT_CA_AUTHOR;
    const updatedDate = article.publishedDate;
    return (
      <article className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-8">
        {renderBreadcrumb(article.title, { name: 'Blog', path: '/blog' })}
        <div className="space-y-3 border-b border-[var(--border-color)] pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
            <span aria-hidden="true">·</span>
            <span>
              Published {article.publishedDate} · Updated {updatedDate}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">{article.title}</h1>
          <p className="text-sm text-[var(--text-muted)] max-w-3xl">{article.summary}</p>

          {/* Visible Author Byline Block (Task 8 — Honest Editorial Attribution) */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-[var(--text-main)]">
                By{' '}
                <a
                  href="/about"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('/about');
                    }
                  }}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {author.name}
                </a>{' '}
                <span className="font-normal text-[var(--text-muted)]">({author.credentials})</span>
              </div>
              <div className="text-[var(--text-muted)]">{author.bio}</div>
            </div>
            <a
              href="/about"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/about');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              About {BRAND_NAME} →
            </a>
          </div>
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

          {/* Contextual Internal Links from Blog Copy to Money Pages + Pricing (Task 1) */}
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] leading-relaxed">
            <strong className="text-[var(--text-main)]">Related {BRAND_NAME} Workflows:</strong> Automate{' '}
            <a
              href="/gst-invoice-to-tally"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/gst-invoice-to-tally');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              GST Invoice to TallyPrime XML Import
            </a>
            , run 6-status{' '}
            <a
              href="/gstr-2b-reconciliation-excel"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/gstr-2b-reconciliation-excel');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              GSTR-2B Reconciliation in Excel
            </a>
            , or compare{' '}
            <a
              href="/pricing"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/pricing');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              CA Firm Pricing Plans
            </a>
            .
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
          <a
            href="/blog"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/blog');
              }
            }}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            ← Back to All Blog Articles
          </a>
          <a
            href="/app"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onOpenWorkspaceTab('scanner', 'ca_mode');
              }
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
          >
            Try the live workspace
          </a>
        </div>
      </article>
    );
  }

  // 3. Blog / Resources Index (Task 1.6 & Task 4)
  if (cleanPath === '/blog' || cleanPath === '/resources') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        {renderBreadcrumb('Blog')}
        <div>
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            CA Practice Blog &amp; Guides
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-main)] mt-1">
            GST &amp; TallyPrime Guides for CA Firms
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESOURCE_ARTICLES.map((art) => (
            <a
              key={art.slug}
              href={art.path}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate(art.path);
                }
              }}
              className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] hover:border-indigo-500/50 transition-colors flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="text-xs text-[var(--text-muted)]">
                  {art.category} · {art.readTime} · {art.publishedDate}
                </div>
                <h2 className="text-base font-bold text-[var(--text-main)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {art.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{art.summary}</p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline text-left">
                Read Full Article →
              </span>
            </a>
          ))}
        </div>
      </section>
    );
  }

  // 4. Developer API Docs Page (/api-docs)
  if (cleanPath === '/api-docs') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-8">
        {renderBreadcrumb('REST API v1')}
        <div className="space-y-2.5 border-b border-[var(--border-color)] pb-5">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            REST API v1 Documentation · Programmatic GST Invoice OCR
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-main)]">
            Invoice Extraction REST API (v1)
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-3xl leading-relaxed">
            Programmatic GST invoice OCR and 15-digit GSTIN verification for Indian CA firms, ERP integrators, and accounting tools. Generate per-user API keys (<code className="font-mono">ls_live_...</code>) inside the{' '}
            <a
              href="/app"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented && e.button === 0) {
                  e.preventDefault();
                  onOpenWorkspaceTab('scanner', 'ca_mode');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              CA Workspace (/app)
            </a>{' '}
            under the <b>QA &amp; API</b> tab.
          </p>
        </div>

        {/* Authentication & Rate Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
            <h2 className="text-sm font-bold text-[var(--text-main)]">Authentication &amp; Key Security</h2>
            <p className="text-[var(--text-muted)] leading-relaxed">{API_DOCS_SPEC.authDescription}</p>
          </div>
          <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
            <h2 className="text-sm font-bold text-[var(--text-main)]">Rate Limits &amp; Payload Caps</h2>
            <p className="text-[var(--text-muted)] leading-relaxed">{API_DOCS_SPEC.limitsDescription}</p>
          </div>
        </div>

        {/* Implemented Endpoints */}
        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold text-[var(--text-main)]">
            Implemented API Endpoints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {API_DOCS_SPEC.auxiliaryEndpoints.map((ep) => (
              <div
                key={ep.path}
                className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold">
                    {ep.method}
                  </span>
                  <code className="font-mono text-xs sm:text-sm font-bold text-[var(--text-main)]">
                    {ep.path}
                  </code>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{ep.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Request & Response Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-main)]">
              1. Multipart File Upload (<code className="font-mono text-xs">multipart/form-data</code>)
            </h2>
            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">
              {`curl -X POST ${SITE_DOMAIN}/api/v1/extract \\
  -H "Authorization: Bearer ls_live_your_api_key_here" \\
  -F "file=@/path/to/purchase_invoice.pdf"`}
            </pre>

            <h2 className="text-base font-bold text-[var(--text-main)] pt-2">
              2. JSON Base64 Payload (<code className="font-mono text-xs">application/json</code>)
            </h2>
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
            <h2 className="text-base font-bold text-[var(--text-main)]">
              200 OK JSON Response Schema Example
            </h2>
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

        {/* Error Codes Table */}
        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold text-[var(--text-main)]">
            HTTP Status &amp; Error Responses
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] text-[var(--text-main)]">
                  <th className="py-2.5 px-4 font-bold">HTTP Status</th>
                  <th className="py-2.5 px-4 font-bold">Condition</th>
                  <th className="py-2.5 px-4 font-bold">Error Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {API_DOCS_SPEC.errorCodes.map((err) => (
                  <tr key={err.status}>
                    <td className="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                      {err.status}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-[var(--text-main)]">
                      {err.code}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--text-muted)]">
                      {err.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Links */}
        <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap items-center gap-3 text-xs">
          <a
            href="/app"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onOpenWorkspaceTab('scanner', 'ca_mode');
              }
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
          >
            Generate API Key in Workspace (/app)
          </a>
          <a
            href="/features"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/features');
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold cursor-pointer"
          >
            Explore All 9 Capabilities
          </a>
          <a
            href="/security"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/security');
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold cursor-pointer"
          >
            Security &amp; SHA-256 Key Storage
          </a>
        </div>
      </section>
    );
  }

  // 5. Privacy Policy (/privacy)
  if (cleanPath === '/privacy') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        {renderBreadcrumb('Privacy Policy')}
        <div className="space-y-2 border-b border-[var(--border-color)] pb-5">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Data Handling &amp; Storage Transparency
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-main)]">
            Privacy Policy for Chartered Accountant &amp; Client Financial Data
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Last Updated: November 2026 · Privacy &amp; Data Protection Contact:{' '}
            <a href="mailto:support@casaarthiai.in" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              support@casaarthiai.in
            </a>
          </p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
            This Privacy Policy describes what data {BRAND_NAME} collects, how uploaded GST invoices are processed during OCR extraction, what structured records are stored when you save bills to a client workspace, and how you can delete your data at any time.
          </p>
        </div>

        <div className="space-y-5 max-w-4xl">
          {PRIVACY_POLICY_SECTIONS.map((sec) => (
            <div
              key={sec.title}
              className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2.5"
            >
              <h2 className="text-base font-bold text-[var(--text-main)]">{sec.title}</h2>
              {sec.paragraphs.map((p, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {p}
                </p>
              ))}
              {sec.bullets && (
                <ul className="space-y-1.5 pt-1 text-xs sm:text-sm text-[var(--text-main)]">
                  {sec.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap gap-3 text-xs">
          <a
            href="/security"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/security');
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Security &amp; Data Isolation Architecture →
          </a>
          <a
            href="/data-deletion"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/data-deletion');
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Data Deletion Policy →
          </a>
          <a
            href="/terms"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/terms');
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Terms of Service →
          </a>
        </div>
      </section>
    );
  }

  // 6. Terms of Service (/terms)
  if (cleanPath === '/terms') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        {renderBreadcrumb('Terms of Service')}
        <div className="space-y-2 border-b border-[var(--border-color)] pb-5">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-main)]">
            Terms of Service for CA Saarthi AI CA Practice Software
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Last Updated: November 2026 · Support: support@casaarthiai.in
          </p>
        </div>
        <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
          <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
            <h2 className="text-base font-bold text-[var(--text-main)]">
              1. Professional Verification Responsibility
            </h2>
            <p>
              {BRAND_NAME} is an OCR extraction and accounting preparation tool for Chartered Accountants and tax practitioners. Users must review and verify extracted GSTINs, invoice numbers, dates, HSN/SAC codes, tax amounts, GSTR-2B statuses, and TallyPrime XML vouchers before importing into accounting ledgers or filing statutory GST returns.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
            <h2 className="text-base font-bold text-[var(--text-main)]">
              2. Acceptable Demo &amp; REST API Usage
            </h2>
            <p>
              Unauthenticated evaluation usage is limited to 3 custom scans per browser per day (plus 3 built-in sample invoices). Authenticated REST API requests on{' '}
              <code className="font-mono">POST /api/v1/extract</code> are subject to a rate limit of 30 requests per minute per API key and a maximum request body size of 15 MB.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
            <h2 className="text-base font-bold text-[var(--text-main)]">
              3. Client Data Ownership &amp; Deletion
            </h2>
            <p>
              You retain full ownership of the invoices and accounting records you process in {BRAND_NAME}. You may export your records to Excel, CSV, JSON, SQL, or TallyPrime XML, or delete saved records at any time as detailed in our{' '}
              <a
                href="/data-deletion"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('/data-deletion');
                  }
                }}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Data Deletion Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    );
  }

  // 6b. Data Deletion Policy (/data-deletion)
  if (cleanPath === '/data-deletion') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        {renderBreadcrumb('Data Deletion Policy')}
        <div className="space-y-2 border-b border-[var(--border-color)] pb-5">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Self-Service &amp; Assisted Deletion Controls
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-main)]">
            Data Deletion Policy &amp; Workspace Purge Controls
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Last Updated: November 2026 · Support:{' '}
            <a href="mailto:support@casaarthiai.in" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              support@casaarthiai.in
            </a>
          </p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
            How to delete single invoice records, clear an entire client workspace, purge all saved Cloud Firestore data, or clear browser-local storage in {BRAND_NAME}.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl">
          {DATA_DELETION_SECTIONS.map((sec) => (
            <div
              key={sec.title}
              className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2.5"
            >
              <h2 className="text-base font-bold text-[var(--text-main)]">{sec.title}</h2>
              {sec.paragraphs.map((p, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {p}
                </p>
              ))}
              {sec.bullets && (
                <ul className="space-y-1.5 pt-1 text-xs sm:text-sm text-[var(--text-main)]">
                  {sec.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap gap-3 text-xs">
          <a
            href="/privacy"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/privacy');
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Privacy Policy →
          </a>
          <a
            href="/security"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/security');
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Security &amp; Data Isolation →
          </a>
        </div>
      </section>
    );
  }

  // 7. Security Page (/security)
  if (cleanPath === '/security') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        {renderBreadcrumb('Security & Data Isolation')}
        <div className="space-y-2 border-b border-[var(--border-color)] pb-5">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Code-Verified Security Architecture
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-main)]">
            Security &amp; Data Isolation for Client Records
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
            We document only the technical security controls, OCR data flows, and database access rules that are implemented and active in the {BRAND_NAME} codebase (<code className="font-mono">firestore.rules</code>, <code className="font-mono">server.ts</code>, <code className="font-mono">api/index.ts</code>, and <code className="font-mono">src/firebase.ts</code>).
          </p>
        </div>

        <div className="space-y-5 max-w-4xl">
          {SECURITY_ARCHITECTURE_SECTIONS.map((sec) => (
            <div
              key={sec.title}
              className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2.5"
            >
              <h2 className="text-base font-bold text-[var(--text-main)]">{sec.title}</h2>
              {sec.paragraphs.map((p, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {p}
                </p>
              ))}
              {sec.bullets && (
                <ul className="space-y-1.5 pt-1 text-xs sm:text-sm text-[var(--text-main)]">
                  {sec.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap gap-3 text-xs">
          <a
            href="/privacy"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/privacy');
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Read Privacy Policy →
          </a>
          <a
            href="/data-deletion"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/data-deletion');
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Read Data Deletion Policy →
          </a>
          <a
            href="/api-docs"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/api-docs');
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            REST API v1 Documentation →
          </a>
        </div>
      </section>
    );
  }

  // 8. FAQ Standalone Page (/faq)
  if (cleanPath === '/faq') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        {renderBreadcrumb('FAQ')}
        <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">
          Questions from Chartered Accountants &amp; Tax Teams
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

  // 9. Contact / Demo Booking Interactive Form (/contact)
  if (cleanPath === '/contact') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6 max-w-3xl">
        {renderBreadcrumb('Contact & Book a Demo')}
        <div className="space-y-2">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            CA Practice Onboarding
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">
            Contact &amp; Book a Demo
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Schedule a live walkthrough of{' '}
            <a
              href="/gst-invoice-to-tally"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/gst-invoice-to-tally');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              TallyPrime XML import
            </a>
            ,{' '}
            <a
              href="/gstr-2b-reconciliation-excel"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/gstr-2b-reconciliation-excel');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              GSTR-2B reconciliation
            </a>
            , and multi-client firm workspaces with our engineering team at{' '}
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
              <a
                href="/"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('/');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
              >
                Back to Homepage
              </a>
            </div>
          </form>
        )}
      </section>
    );
  }

  // 10. Pricing Page (/pricing)
  if (cleanPath === '/pricing') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-8">
        {renderBreadcrumb('Pricing')}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[var(--border-color)] pb-5">
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Transparent Practice Plans · Early-Access Pricing Locked for Pilot Firms
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-main)]">
              Plans for Solo Practitioners &amp; Multi-Partner CA Firms
            </h1>
            <p className="text-sm text-[var(--text-muted)] max-w-3xl leading-relaxed">
              Choose the plan that matches your practice workflow. Evaluate invoice OCR, 15-digit GSTIN Mod-36 checksum validation, and TallyPrime XML exports on the ₹0 Starter / Trial plan, or scale across client workspaces and audit staff.
            </p>
          </div>
          <a
            href="/hi/pricing"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/hi/pricing');
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
          >
            हिंदी में देखें (/hi/pricing) →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRACTICE_PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
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
                <div className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-main)] tabular-nums">
                  {plan.price}
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{plan.audience}</p>
                <ul className="space-y-2.5 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-main)]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={plan.ctaHref}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault();
                    if (plan.ctaHref === '/app') {
                      onOpenWorkspaceTab('scanner', 'ca_mode');
                    } else {
                      onNavigate(plan.ctaHref);
                    }
                  }
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold text-center transition-colors cursor-pointer block ${
                  plan.highlighted
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                {plan.ctaLabel}
              </a>
            </div>
          ))}
        </div>

        {/* Plan Comparison & Practice Scope Explanation */}
        <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-4">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--text-main)]">
            How Plan Differences Work in Practice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <div className="font-bold text-[var(--text-main)]">Starter / Trial (₹0 / month)</div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Includes 3 built-in GST sample invoices plus up to 3 custom file scans per browser per day without login, or a 1-client workspace when signed in to test TallyPrime XML and Excel (.xlsx) output.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-bold text-[var(--text-main)]">CA Practice Pro (₹1,499 / month)</div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Designed for solo CAs and GST practitioners managing up to 25 distinct client GSTIN workspaces, adding 6-status GSTR-2B JSON/Excel reconciliation, Zoho Books CSV, Busy Excel, and e-invoice IRN/bank field extraction.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-bold text-[var(--text-main)]">Firm / Enterprise (₹3,999 / month)</div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Designed for multi-partner CA firms needing unlimited client workspaces, role-based access control (Owner/CA, Reviewer, Staff), bill approval &amp; lock workflows, and programmatic REST API (<code className="font-mono">POST /api/v1/extract</code>) access.
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap gap-3 text-xs">
            <a
              href="/features"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/features');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Compare All 9 Technical Capabilities →
            </a>
            <a
              href="/gst-invoice-to-tally"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/gst-invoice-to-tally');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              TallyPrime XML Import Guide →
            </a>
            <a
              href="/gstr-2b-reconciliation-excel"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/gstr-2b-reconciliation-excel');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              GSTR-2B Reconciliation Engine →
            </a>
            <a
              href="/security"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('/security');
                }
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Security &amp; Data Isolation →
            </a>
          </div>
        </div>
      </section>
    );
  }

  // 11. Features Page (/features)
  if (cleanPath === '/features') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-8">
        {renderBreadcrumb('Features')}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[var(--border-color)] pb-5">
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              CA Practice Capabilities Suite · Code-Verified Specifications
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-main)]">
              Features Built for Indian GST Practice Workflows
            </h1>
            <p className="text-sm text-[var(--text-muted)] max-w-3xl leading-relaxed">
              Detailed technical breakdown of every capability implemented in {BRAND_NAME} — including accepted inputs, generated outputs, what the Chartered Accountant or article assistant needs to review, and known operational limitations.
            </p>
          </div>
          <a
            href="/hi/features"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/hi/features');
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
          >
            हिंदी में देखें (/hi/features) →
          </a>
        </div>

        <div className="space-y-5">
          {DETAILED_FEATURES_SPECS.map((feat) => (
            <article
              key={feat.id}
              id={feat.id}
              className="p-5 sm:p-6 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                <div>
                  <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {feat.number}. {feat.badge}
                  </div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--text-main)] mt-0.5">
                    {feat.title}
                  </h2>
                </div>
                <a
                  href={feat.linkHref}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate(feat.linkHref);
                    }
                  }}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                >
                  {feat.linkLabel}
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div>
                    <strong className="text-[var(--text-main)] block mb-0.5">What It Does:</strong>
                    <p className="text-[var(--text-muted)] leading-relaxed">{feat.whatItDoes}</p>
                  </div>
                  <div>
                    <strong className="text-[var(--text-main)] block mb-0.5">Input Accepted:</strong>
                    <p className="text-[var(--text-muted)] leading-relaxed">{feat.inputAccepted}</p>
                  </div>
                  <div>
                    <strong className="text-[var(--text-main)] block mb-0.5">Output Produced:</strong>
                    <p className="text-[var(--text-muted)] leading-relaxed">{feat.outputProduced}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-3.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <strong className="text-[var(--text-main)] block mb-1">
                      What the CA / Accountant Needs to Review:
                    </strong>
                    <p className="text-[var(--text-muted)] leading-relaxed">{feat.whatCaNeedsToReview}</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <strong className="text-[var(--text-main)] block mb-1">
                      Known Limitations &amp; Constraints:
                    </strong>
                    <p className="text-[var(--text-muted)] leading-relaxed">{feat.limitations}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap gap-3 text-xs">
          <a
            href="/app"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onOpenWorkspaceTab('scanner', 'ca_mode');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
          >
            Test Features in Live Workspace (/app)
          </a>
          <a
            href="/pricing"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/pricing');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold cursor-pointer"
          >
            View CA Practice Pricing Plans →
          </a>
          <a
            href="/how-it-works"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/how-it-works');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold cursor-pointer"
          >
            Read 4-Step Workflow Guide →
          </a>
        </div>
      </section>
    );
  }

  // 12. About Page (/about)
  if (cleanPath === '/about') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        {renderBreadcrumb('About CA Saarthi AI')}
        <div className="space-y-2 border-b border-[var(--border-color)] pb-5">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            Built for Indian Chartered Accountants &amp; Tax Practitioners
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-main)]">
            Built for Indian Chartered Accountants
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
            {BRAND_NAME} eliminates repetitive purchase voucher typing, GSTIN verification bottlenecks, and manual GSTR-2B spreadsheet preparation for Indian CA firms, GST practitioners, and accounting teams.
          </p>
        </div>

        <div className="space-y-5 max-w-4xl">
          {ABOUT_PAGE_SECTIONS.map((sec) => (
            <div
              key={sec.title}
              className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2.5"
            >
              <h2 className="text-base font-bold text-[var(--text-main)]">{sec.title}</h2>
              {sec.paragraphs.map((p, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {p}
                </p>
              ))}
              {sec.bullets && (
                <ul className="space-y-1.5 pt-1 text-xs sm:text-sm text-[var(--text-main)]">
                  {sec.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap gap-3 text-xs">
          <a
            href="/features"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/features');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
          >
            Explore All 9 Capabilities →
          </a>
          <a
            href="/pricing"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/pricing');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold cursor-pointer"
          >
            View Pricing Plans →
          </a>
          <a
            href="/security"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/security');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold cursor-pointer"
          >
            Security &amp; Data Isolation →
          </a>
          <a
            href="/contact"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/contact');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold cursor-pointer"
          >
            Contact &amp; Book a Demo →
          </a>
        </div>
      </section>
    );
  }

  // 13. How It Works Page (/how-it-works)
  if (cleanPath === '/how-it-works') {
    return (
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        {renderBreadcrumb('How It Works')}
        <div className="space-y-2 border-b border-[var(--border-color)] pb-5">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            4-Step CA Practice Workflow
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-main)]">
            From Client Invoice Folder to Tally Sign-Off
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
            How Chartered Accountants and article assistants use {BRAND_NAME} to process client purchase bills, validate 15-digit GSTINs, reconcile GSTR-2B, and export TallyPrime XML vouchers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {HOW_IT_WORKS_SECTIONS.map((s) => (
            <div
              key={s.step}
              className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2.5"
            >
              <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {s.step}
              </div>
              <h2 className="text-base font-bold text-[var(--text-main)]">{s.title}</h2>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{s.description}</p>
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)]">
                <strong>CA Review Checkpoint:</strong> {s.reviewNote}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap gap-3 text-xs">
          <a
            href="/app"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onOpenWorkspaceTab('scanner', 'ca_mode');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
          >
            Open Live Workspace (/app)
          </a>
          <a
            href="/features"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/features');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold cursor-pointer"
          >
            View All 9 Features →
          </a>
          <a
            href="/pricing"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/pricing');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-semibold cursor-pointer"
          >
            View Pricing Plans →
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-5">
      {renderBreadcrumb(BRAND_NAME)}
      <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{BRAND_NAME}</div>
      <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">
        {BRAND_NAME} — {BRAND_TAGLINE}
      </h1>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
        Explore our live workspace below or return to the homepage for the interactive walkthrough.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="/"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
              e.preventDefault();
              onNavigate('/');
            }
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
        >
          View Full Landing Page
        </a>
        <a
          href="/app"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
              e.preventDefault();
              onOpenWorkspaceTab('scanner', 'ca_mode');
            }
          }}
          className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
        >
          Jump to Workspace
        </a>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 11: QUIET ARCHITECTURAL FOOTER (PART 7.11 & TASK 1)
// ============================================================================
export const LedgerSutraFooter: React.FC<{
  onNavigate: (path: string) => void;
  onOpenWorkspaceTab: (
    tab?: 'scanner' | 'master_sheet' | 'dashboard' | 'history',
    mode?: 'normal_user' | 'ca_mode'
  ) => void;
  currentPath?: string;
}> = ({ onNavigate, onOpenWorkspaceTab, currentPath = '/' }) => {
  const cleanFooterPath = normalizePathname(currentPath);
  const isHindi = cleanFooterPath === '/hi' || cleanFooterPath.startsWith('/hi/');

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)] mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="relative p-0.5 rounded-2xl bg-gradient-to-br from-sky-400/50 via-amber-400/50 to-indigo-500/50 shadow-sm shrink-0">
                <img
                  src="/ca-saarthi-icon.svg"
                  alt=""
                  width={48}
                  height={48}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] object-contain block"
                />
              </div>
              <div>
                <a
                  href={isHindi ? '/hi' : '/'}
                  onClick={(e) => handleLinkClick(e, isHindi ? '/hi' : '/')}
                  className="font-display font-extrabold text-lg sm:text-xl tracking-tight flex items-center gap-1.5 group"
                >
                  <span className="inline-flex items-baseline">
                    <span className="text-[var(--text-main)] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      C
                    </span>
                    <span className="bg-gradient-to-b from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                      A
                    </span>
                  </span>
                  <span className="text-[var(--text-main)] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    Saarthi
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-black tracking-wider bg-gradient-to-r from-cyan-500/15 via-sky-500/15 to-teal-500/15 border border-cyan-500/35">
                    <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-teal-500 dark:from-cyan-300 dark:via-sky-400 dark:to-teal-300 bg-clip-text text-transparent">
                      AI
                    </span>
                  </span>
                </a>
                <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] mt-0.5">
                  {isHindi ? 'बिल स्कैनिंग और डेटा ऑटोमेशन' : 'Bill Scanning & Data Automation'}
                </div>
                <a
                  href={isHindi ? '/hi' : '/'}
                  onClick={(e) => handleLinkClick(e, isHindi ? '/hi' : '/')}
                  className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline block mt-0.5"
                >
                  {SITE_DOMAIN}
                </a>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isHindi
                ? 'भारतीय चार्टर्ड अकाउंटेंट्स (CA) के लिए निर्मित — स्वचालित GST इनवॉइस एक्सट्रैक्शन, अंग्रेज़ी और हिंदी बिल OCR, TallyPrime XML एक्सपोर्ट और GSTR-2B रिकन्सिलिएशन।'
                : 'Built for Indian Chartered Accountants — automated GST invoice extraction, English & Hindi bill OCR, TallyPrime XML export, and GSTR-2B reconciliation.'}
            </p>
            <div className="text-xs text-[var(--text-main)] font-medium">
              {isHindi ? 'सहायता (Support): ' : 'Support: '}
              <a
                href="mailto:support@casaarthiai.in"
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                support@casaarthiai.in
              </a>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="/app"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault();
                    onOpenWorkspaceTab('scanner', 'ca_mode');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                {isHindi ? 'मुफ़्त ट्रायल शुरू करें' : 'Start Free Trial'}
              </a>
              <a
                href="/api-docs"
                onClick={(e) => handleLinkClick(e, '/api-docs')}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
              >
                {isHindi ? 'REST API डॉक्स' : 'REST API Docs'}
              </a>
              <a
                href={isHindi ? '/' : '/hi'}
                onClick={(e) => handleLinkClick(e, isHindi ? '/' : '/hi')}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer"
              >
                {isHindi ? 'English (/)' : 'हिंदी (/hi)'}
              </a>
            </div>
          </div>

          {/* Col 2: Public Website & Legal Links (Crucial for B2B Trust) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[var(--text-main)]">
              {isHindi ? 'प्लेटफ़ॉर्म और कानूनी विश्वास' : 'Platform & Legal Trust'}
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleLinkClick(e, '/privacy')}
                  className="font-semibold text-[var(--text-main)] hover:text-indigo-500 cursor-pointer"
                >
                  {isHindi ? 'प्राइवेसी पॉलिसी (Privacy Policy)' : 'Privacy Policy'}
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleLinkClick(e, '/terms')}
                  className="font-semibold text-[var(--text-main)] hover:text-indigo-500 cursor-pointer"
                >
                  {isHindi ? 'सेवा की शर्तें (Terms of Service)' : 'Terms of Service'}
                </a>
              </li>
              <li>
                <a
                  href="/data-deletion"
                  onClick={(e) => handleLinkClick(e, '/data-deletion')}
                  className="font-semibold text-[var(--text-main)] hover:text-indigo-500 cursor-pointer"
                >
                  {isHindi ? 'डेटा विलोपन नीति (Data Deletion)' : 'Data Deletion Policy'}
                </a>
              </li>
              <li>
                <a
                  href="/security"
                  onClick={(e) => handleLinkClick(e, '/security')}
                  className="hover:text-indigo-500 cursor-pointer"
                >
                  {isHindi ? 'सुरक्षा और डेटा आइसोलेशन' : 'Security & Data Isolation'}
                </a>
              </li>
              <li>
                <a
                  href={isHindi ? '/hi/pricing' : '/pricing'}
                  onClick={(e) => handleLinkClick(e, isHindi ? '/hi/pricing' : '/pricing')}
                  className="hover:text-indigo-500 cursor-pointer"
                >
                  {isHindi ? 'प्राइसिंग और CA फर्म पायलट' : 'Pricing & CA Firm Pilots'}
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  onClick={(e) => handleLinkClick(e, '/faq')}
                  className="hover:text-indigo-500 cursor-pointer"
                >
                  {isHindi ? `सामान्य प्रश्न (FAQ — ${HOMEPAGE_FAQS.length} प्रश्न)` : `FAQ (${HOMEPAGE_FAQS.length} Questions)`}
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="hover:text-indigo-500 cursor-pointer"
                >
                  {isHindi ? 'संपर्क करें और डेमो बुक करें' : 'Contact & Book a Demo'}
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, '/about')}
                  className="hover:text-indigo-500 cursor-pointer"
                >
                  {isHindi ? 'CA Saarthi AI के बारे में' : 'About CA Saarthi AI'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: High-Intent CA SEO Solutions */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[var(--text-main)]">
              {isHindi ? 'CA और GST वर्कफ़्लो' : 'CA & GST Workflows'}
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <a
                  href={isHindi ? '/hi/gst-invoice-to-tally' : '/gst-invoice-to-tally'}
                  onClick={(e) => handleLinkClick(e, isHindi ? '/hi/gst-invoice-to-tally' : '/gst-invoice-to-tally')}
                  className="hover:text-indigo-500 cursor-pointer text-left font-medium text-indigo-600 dark:text-indigo-400"
                >
                  {isHindi ? 'GST इनवॉइस से TallyPrime XML' : 'GST Invoice to TallyPrime XML'}
                </a>
              </li>
              <li>
                <a
                  href={isHindi ? '/hi/gstr-2b-reconciliation-excel' : '/gstr-2b-reconciliation-excel'}
                  onClick={(e) =>
                    handleLinkClick(e, isHindi ? '/hi/gstr-2b-reconciliation-excel' : '/gstr-2b-reconciliation-excel')
                  }
                  className="hover:text-indigo-500 cursor-pointer text-left font-medium text-indigo-600 dark:text-indigo-400"
                >
                  {isHindi ? 'Excel में GSTR-2B रिकन्सिलिएशन' : 'GSTR-2B Reconciliation in Excel'}
                </a>
              </li>
              <li>
                <a
                  href="/bulk-invoice-processing-for-ca"
                  onClick={(e) => handleLinkClick(e, '/bulk-invoice-processing-for-ca')}
                  className="hover:text-indigo-500 cursor-pointer text-left font-medium text-indigo-600 dark:text-indigo-400"
                >
                  {isHindi ? 'CA के लिए बल्क इनवॉइस प्रोसेसिंग' : 'Bulk Invoice Processing for CA'}
                </a>
              </li>
              <li>
                <a
                  href="/invoice-ocr-for-ca"
                  onClick={(e) => handleLinkClick(e, '/invoice-ocr-for-ca')}
                  className="hover:text-indigo-500 cursor-pointer text-left"
                >
                  {isHindi ? 'CA फर्मों के लिए इनवॉइस OCR' : 'Invoice OCR for CA Firms'}
                </a>
              </li>
              <li>
                <a
                  href="/gst-invoice-data-extraction"
                  onClick={(e) => handleLinkClick(e, '/gst-invoice-data-extraction')}
                  className="hover:text-indigo-500 cursor-pointer text-left"
                >
                  {isHindi ? 'GST इनवॉइस डेटा एक्सट्रैक्शन' : 'GST Invoice Data Extraction'}
                </a>
              </li>
              <li>
                <a
                  href={isHindi ? '/hi/pdf-invoice-to-excel' : '/pdf-invoice-to-excel'}
                  onClick={(e) => handleLinkClick(e, isHindi ? '/hi/pdf-invoice-to-excel' : '/pdf-invoice-to-excel')}
                  className="hover:text-indigo-500 cursor-pointer text-left"
                >
                  {isHindi ? 'PDF इनवॉइस से Excel (.XLSX)' : 'PDF Invoice to Excel (.XLSX)'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Blog Articles */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[var(--text-main)]">
              {isHindi ? 'CA ब्लॉग और गाइड्स' : 'CA Blog & Guides'}
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <a
                  href="/blog"
                  onClick={(e) => handleLinkClick(e, '/blog')}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer text-left"
                >
                  {isHindi ? 'सभी ब्लॉग लेख और ट्यूटोरियल →' : 'All Blog Articles & Tutorials →'}
                </a>
              </li>
              {RESOURCE_ARTICLES.map((art) => (
                <li key={art.slug}>
                  <a
                    href={art.path}
                    onClick={(e) => handleLinkClick(e, art.path)}
                    className="hover:text-indigo-500 cursor-pointer text-left line-clamp-1 block"
                  >
                    {art.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border-color)] space-y-3 text-xs text-[var(--text-muted)]">
          <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] leading-relaxed">
            {isHindi ? (
              <>
                <strong className="text-[var(--text-main)]">पेशेवर अनुपालन अस्वीकरण (Disclaimer):</strong> {BRAND_NAME} एक दस्तावेज़-प्रोसेसिंग और अकाउंटिंग वर्कफ़्लो सहायता टूल है। चार्टर्ड अकाउंटेंट्स और उपयोगकर्ताओं को TallyPrime में इम्पोर्ट करने या आधिकारिक GST रिटर्न दाखिल करने से पहले निकाले गए डेटा की समीक्षा और सत्यापन करना चाहिए।
              </>
            ) : (
              <>
                <strong className="text-[var(--text-main)]">Professional Compliance Disclaimer:</strong> {BRAND_NAME} is a
                document-processing and accounting workflow support tool. Chartered Accountants and users should review and
                verify extracted data before importing into TallyPrime or filing official GST returns.
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
            <span>
              © {new Date().getFullYear()} {BRAND_NAME} (
              <a
                href={isHindi ? '/hi' : '/'}
                onClick={(e) => handleLinkClick(e, isHindi ? '/hi' : '/')}
                className="hover:underline"
              >
                casaarthiai.in
              </a>
              ). {isHindi ? 'संपर्क: support@casaarthiai.in' : 'Contact: support@casaarthiai.in'}
            </span>
            <span>
              {isHindi
                ? '🔒 हाइब्रिड क्लाउड और लोकल OCR · क्लाइंट-स्कोप्ड आइसोलेशन · TallyPrime XML · GSTR-2B · SQL और XLSX'
                : '🔒 Hybrid Cloud & Local OCR · Client-Scoped Isolation · TallyPrime XML · GSTR-2B · SQL & XLSX'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
