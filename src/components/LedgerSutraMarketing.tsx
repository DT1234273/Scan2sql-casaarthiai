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
  Briefcase,
  Check,
  Upload,
  FileCode2,
  Users,
  Code2,
  Eye,
  LogIn,
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

// ============================================================================
// BUILT-IN 3 SAMPLE INVOICES FOR INSTANT NO-LOGIN LIVE DEMO (PART 7.2)
// ============================================================================
interface DemoSampleInvoice {
  id: string;
  label: string;
  badge: string;
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
    label: 'Sample 1: Intra-State B2B Tax Invoice (CGST + SGST)',
    badge: 'Maharashtra 27 • 18% GST',
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
    label: 'Sample 2: Inter-State IT Services Invoice (IGST 18%)',
    badge: 'Karnataka 29 → Delhi 07',
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
    label: 'Sample 3: Multi-Rate Wholesale & Round-Off Invoice',
    badge: 'Gujarat 24 • Multi-HSN + Round-off',
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
// SECTION 1: HERO BANNER (PART 7.1)
// ============================================================================
export const LedgerSutraHeroBanner: React.FC<{
  onOpenWorkspaceTab: (
    tab?: 'scanner' | 'master_sheet' | 'dashboard' | 'history',
    mode?: 'normal_user' | 'ca_mode'
  ) => void;
  onTriggerUpload?: () => void;
  onNavigate?: (path: string) => void;
  savedBillsCount: number;
}> = ({ onOpenWorkspaceTab, onNavigate, savedBillsCount }) => {
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
            GST invoice to Tally and Excel,{' '}
            <span className="text-indigo-500">built for Indian CA firms</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl">
            Extract 15-character GSTINs, HSN/SAC codes, line items, IRN, e-Way bills, and CGST/SGST/IGST tax splits
            from PDFs and bill photos. Export directly to TallyPrime XML, reconcile GSTR-2B in Excel, and manage
            client-wise workspaces.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => scrollToSection('live-no-login-demo')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Try free demo</span>
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
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-indigo-500/10 text-[var(--text-main)] border border-[var(--border-color)] text-sm font-bold transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-indigo-500" />
              <span>Book a demo</span>
            </button>

            <button
              onClick={() => {
                onOpenWorkspaceTab('master_sheet', 'ca_mode');
                scrollToSection('live-ocr-workspace');
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-indigo-500 hover:underline cursor-pointer"
            >
              <span>Open Full Workspace ({savedBillsCount} Bills) →</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--border-color)] text-xs">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>TallyPrime XML Import</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>GSTR-2B Reconciliation</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>GSTIN Mod-36 Checksum</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Client-Wise Workspaces</span>
            </div>
          </div>
        </div>

        {/* Right Preview Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-5 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  TallyPrime XML &amp; GSTR-2B Pipeline
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                CA Audit Ready
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Supplier GSTIN</span>
                <span className="font-bold text-emerald-500">27AABCK4829M1Z5 (Valid ✓)</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Taxable + CGST + SGST</span>
                <span className="font-bold">₹45,000 + ₹4,050 + ₹4,050</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between">
                <span className="text-[var(--text-muted)]">GSTR-2B Status</span>
                <span className="font-bold text-indigo-500">Matched (ITC Eligible)</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Export Formats</span>
                <span className="font-bold">Tally XML • XLSX • Zoho • Busy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// SECTIONS 2 TO 10: ORDERED PUBLIC LANDING PAGE SECTIONS (PART 7.2 - 7.10)
// ============================================================================
export const LedgerSutraHomepageSections: React.FC<{
  onNavigate: (path: string) => void;
  onOpenWorkspaceTab: (
    tab?: 'scanner' | 'master_sheet' | 'dashboard' | 'history',
    mode?: 'normal_user' | 'ca_mode'
  ) => void;
  onTriggerUpload?: () => void;
  savedBillsCount: number;
  onSignInRequest?: () => void;
}> = ({ onNavigate, onOpenWorkspaceTab, onTriggerUpload, onSignInRequest }) => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>(BUILTIN_DEMO_SAMPLES[0].id);
  const [demoViewTab, setDemoViewTab] = useState<'table' | 'json'>('table');
  const [scansUsedToday, setScansUsedToday] = useState<number>(() => getBrowserDemoScansUsed());
  const [customDemoResult, setCustomDemoResult] = useState<DemoSampleInvoice['data'] | null>(null);
  const [customDemoLoading, setCustomDemoLoading] = useState(false);
  const [customDemoError, setCustomDemoError] = useState('');

  const activeSample =
    BUILTIN_DEMO_SAMPLES.find((s) => s.id === selectedSampleId) || BUILTIN_DEMO_SAMPLES[0];
  const displayedInvoice = customDemoResult || activeSample.data;

  const handleCustomDemoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const used = getBrowserDemoScansUsed();
    if (used >= 3) {
      setCustomDemoError('You have used all 3 free browser scans for today. Please sign in with Google to scan more invoices.');
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
      {/* SECTION 2: LIVE DEMO WITHOUT LOGIN (3 BUILT-IN SAMPLES + 3/DAY CAP) */}
      {/* =================================================================== */}
      <section
        id="live-no-login-demo"
        className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6 scroll-mt-20"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              Section 2 • Instant Live Demo (No Login Required)
            </span>
            <h2 className="text-2xl font-extrabold text-[var(--text-main)] mt-1">
              Test GST Invoice Extraction — Table &amp; JSON Output
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              Pick one of our 3 built-in Indian GST invoices below or upload a sample invoice (limit: 3 custom browser scans per day without login;{' '}
              <b>{Math.max(0, 3 - scansUsedToday)} of 3 remaining today</b>).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {scansUsedToday < 3 ? (
              <label className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer flex items-center gap-2 shadow">
                <Upload className="w-4 h-4" />
                <span>{customDemoLoading ? 'Extracting...' : 'Upload Sample Invoice'}</span>
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
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Daily 3-Scan Limit Reached — Sign in for More
              </button>
            )}
          </div>
        </div>

        {customDemoError && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs flex items-center justify-between gap-3">
            <span>{customDemoError}</span>
            {onSignInRequest && (
              <button
                onClick={onSignInRequest}
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold shrink-0"
              >
                Sign In with Google
              </button>
            )}
          </div>
        )}

        {/* 3 Built-in Sample Selector Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {BUILTIN_DEMO_SAMPLES.map((samp) => {
            const isSelected = !customDemoResult && selectedSampleId === samp.id;
            return (
              <button
                key={samp.id}
                onClick={() => {
                  setCustomDemoResult(null);
                  setSelectedSampleId(samp.id);
                }}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-indigo-500/40'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                  {samp.badge}
                </div>
                <div className="text-xs font-bold text-[var(--text-main)] mt-1">{samp.label}</div>
              </button>
            );
          })}
        </div>

        {/* Table vs JSON Tab Switcher */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDemoViewTab('table')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                demoViewTab === 'table'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
              }`}
            >
              Structured Accounting Table View
            </button>
            <button
              onClick={() => setDemoViewTab('json')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                demoViewTab === 'json'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
              }`}
            >
              Raw JSON API Output Tab
            </button>
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Invoice: <b>{displayedInvoice.invoiceNumber}</b>
          </span>
        </div>

        {demoViewTab === 'table' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <div className="text-[10px] text-[var(--text-muted)]">Supplier Name</div>
                <div className="font-bold mt-0.5 truncate">{displayedInvoice.shopName}</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <div className="text-[10px] text-[var(--text-muted)]">Supplier GSTIN &amp; PAN</div>
                <div className="font-mono font-bold text-indigo-500 mt-0.5">{displayedInvoice.sellerGstin}</div>
                <div className="font-mono text-[10px] text-[var(--text-muted)]">PAN: {displayedInvoice.supplierPan}</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <div className="text-[10px] text-[var(--text-muted)]">Buyer GSTIN &amp; POS</div>
                <div className="font-mono font-bold mt-0.5">{displayedInvoice.buyerGstin}</div>
                <div className="text-[10px] text-[var(--text-muted)]">POS: {displayedInvoice.placeOfSupply}</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <div className="text-[10px] text-[var(--text-muted)]">e-Way Bill &amp; PO No</div>
                <div className="font-mono font-bold mt-0.5">{displayedInvoice.ewayBillNo}</div>
                <div className="text-[10px] text-[var(--text-muted)]">PO: {displayedInvoice.poNumber}</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <div className="text-[10px] text-[var(--text-muted)]">Bank Details (NEFT)</div>
                <div className="font-bold mt-0.5 truncate">{displayedInvoice.bankName}</div>
                <div className="font-mono text-[10px] text-[var(--text-muted)]">{displayedInvoice.bankIfsc}</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <div className="text-[10px] text-[var(--text-muted)]">Grand Total ({displayedInvoice.currency})</div>
                <div className="font-mono text-base font-extrabold text-emerald-500 mt-0.5">
                  ₹{displayedInvoice.grandTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="border border-[var(--border-color)] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                  <tr>
                    <th className="py-2 px-3">Line Item Description</th>
                    <th className="py-2 px-3">HSN/SAC</th>
                    <th className="py-2 px-3">Qty &amp; UOM</th>
                    <th className="py-2 px-3">Rate (₹)</th>
                    <th className="py-2 px-3">Taxable (₹)</th>
                    <th className="py-2 px-3">GST %</th>
                    <th className="py-2 px-3">Line Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {displayedInvoice.items.map((it, i) => (
                    <tr key={i}>
                      <td className="py-2 px-3 font-semibold">{it.itemName}</td>
                      <td className="py-2 px-3 font-mono">{it.hsnSac}</td>
                      <td className="py-2 px-3 font-mono">
                        {it.quantity} {it.unit}
                      </td>
                      <td className="py-2 px-3 font-mono">₹{it.unitPrice.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-3 font-mono">₹{it.taxableValue.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-3 font-mono">{it.gstRate}%</td>
                      <td className="py-2 px-3 font-mono font-bold">₹{it.lineTotal.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96">
            {JSON.stringify(displayedInvoice, null, 2)}
          </pre>
        )}
      </section>

      {/* =================================================================== */}
      {/* SECTION 3: PROBLEM / SOLUTION STRIP (MANUAL ENTRY VS LEDGERSUTRA)   */}
      {/* =================================================================== */}
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Section 3 • Problem vs Solution
          </span>
          <h2 className="text-2xl font-extrabold text-[var(--text-main)] mt-1">
            Why Indian CA Firms Replace Manual Voucher Entry with {BRAND_NAME}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
            <h3 className="text-sm font-bold text-rose-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Traditional Manual Data Entry in CA Offices
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>• Typing 15-character GSTINs, invoice numbers, and HSN rows by hand before GSTR-3B deadlines.</li>
              <li>• Transposing characters (`8` vs `B`, `0` vs `O`) leading to GSTR-2B mismatches.</li>
              <li>• Recording duplicate invoices when clients send both a WhatsApp image and a PDF copy.</li>
              <li>• Manually creating Sundry Creditor ledgers and tax split entries in TallyPrime.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
            <h3 className="text-sm font-bold text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Automated Workflow with {BRAND_NAME}
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>• Batch upload PDFs &amp; photos with per-file progress bars and automatic field extraction.</li>
              <li>• Deterministic 15-character GSTIN Mod-36 checksum &amp; tax math verification on every bill.</li>
              <li>• Instant duplicate invoice detection (`Merge Items`, `Overwrite`, or `Save as Duplicate`).</li>
              <li>• One-click TallyPrime XML voucher export + 6-status GSTR-2B reconciliation in Excel.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 4: 9-FEATURE GRID (PART 7.4)                                */}
      {/* =================================================================== */}
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Section 4 • Complete CA Practice Suite
          </span>
          <h2 className="text-2xl font-extrabold text-[var(--text-main)] mt-1">
            Nine Core Capabilities Built for GST Practitioners &amp; Audit Teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: '1. TallyPrime XML Export',
              desc: 'Generates TallyPrime-importable Purchase Vouchers with Party credit, Purchase debit, CGST/SGST/IGST ledgers, round-off, and optional auto-creation of missing Party ledgers.',
              link: '/gst-invoice-to-tally',
            },
            {
              title: '2. GSTR-2B Reconciliation',
              desc: 'Upload GST portal GSTR-2B JSON or Excel files. Match by Supplier GSTIN + normalized invoice number + fuzzy amount/date fallback and export a multi-sheet Excel report.',
              link: '/gstr-2b-reconciliation-excel',
            },
            {
              title: '3. Duplicate Invoice Detection',
              desc: 'Checks every bill against existing records by Supplier Name and Invoice Number, prompting you to merge items, overwrite, or keep as a separate entry.',
              link: '/blog/how-to-find-duplicate-purchase-invoices-before-filing-gst',
            },
            {
              title: '4. GSTIN Validation & Tax Audit',
              desc: 'Validates 15-character GSTIN format, state code, and official Mod-36 checksum digit while checking line-item taxable sums against printed GST totals.',
              link: '/gst-invoice-data-extraction',
            },
            {
              title: '5. Batch Processing Queue',
              desc: 'Upload dozens of multi-page PDFs and bill photos simultaneously with an interactive file queue and per-file progress bars.',
              link: '/bulk-invoice-processing-for-ca',
            },
            {
              title: '6. Client-Wise Workspace',
              desc: 'Organize bills, documents, GSTR-2B reconciliations, and Tally ledger settings under dedicated CA client profiles (/users/{uid}/clients/{clientId}).',
              link: '/features',
            },
            {
              title: '7. Team Access & Approval Workflow',
              desc: 'Assign Owner/CA, Reviewer, and Staff roles. Staff upload Draft/Pending bills; Reviewers approve or reject with an immutable per-bill audit trail.',
              link: '/security',
            },
            {
              title: '8. Multi-Format Accounting Export',
              desc: 'Export validated purchase registers to TallyPrime XML, multi-sheet Excel (.xlsx), Zoho Books CSV, Busy Accounting Excel, JSON, SQL, and verbatim TXT.',
              link: '/pdf-invoice-to-excel',
            },
            {
              title: '9. Developer REST API (v1)',
              desc: 'Integrate POST /api/v1/extract into your custom ERP or firm portal using SHA-256 hashed per-user API keys with rate limiting.',
              link: '/api-docs',
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[var(--text-main)]">{feat.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{feat.desc}</p>
              </div>
              <button
                onClick={() => onNavigate(feat.link)}
                className="text-xs font-bold text-indigo-500 hover:underline text-left cursor-pointer"
              >
                Learn more →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 5: "FIELDS WE EXTRACT" FULL LIST (PART 5 & PART 7.5)        */}
      {/* =================================================================== */}
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Section 5 • Comprehensive Schema Coverage
          </span>
          <h2 className="text-2xl font-extrabold text-[var(--text-main)] mt-1">
            30+ Invoice, E-Invoice &amp; Bill of Entry Fields Extracted Automatically
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            All fields below are extracted when present on the document and available as selectable columns in your Master Sheet and exports:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
          {[
            'Supplier Name (Party Ledger)',
            'Supplier 15-Digit GSTIN',
            'Supplier 10-Digit PAN',
            'Supplier Address & State Code',
            'Buyer Name & Buyer GSTIN',
            'Buyer Address & State Code',
            'Place of Supply (POS)',
            'Invoice Number & Voucher Type',
            'Invoice Date & Due Date',
            '64-Character e-Invoice IRN',
            '12-Digit e-Way Bill Number',
            'e-Invoice QR Code Data',
            'Purchase Order (PO) Number',
            'Payment Terms & Mode',
            'Bank Name, Account No & IFSC',
            'Invoice Currency (INR / Forex)',
            'Line Item Description',
            'HSN / SAC Code per Row',
            'Quantity, Unit (UOM) & Rate',
            'Taxable Value (Subtotal)',
            'CGST Rate & Amount',
            'SGST / UTGST Rate & Amount',
            'IGST Rate & Amount',
            'Trade Discount & Other Charges',
            'Round-Off Adjustment',
            'Final Grand Total',
            'Bill of Entry (BOE) Number & Date',
            'Customs Port Code (Import BOE)',
          ].map((field) => (
            <div
              key={field}
              className="px-3 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center gap-2 font-medium"
            >
              <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{field}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 6: HOW IT WORKS IN 3 STEPS (PART 7.6)                       */}
      {/* =================================================================== */}
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Section 6 • Simple 3-Step Workflow
          </span>
          <h2 className="text-2xl font-extrabold text-[var(--text-main)] mt-1">
            How {BRAND_NAME} Works in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: 'Step 1',
              title: 'Select Client & Upload Invoices',
              desc: 'Pick your client workspace in the header and upload single or batch PDFs, multi-page statements, Bills of Entry, or mobile photos.',
            },
            {
              step: 'Step 2',
              title: 'Automated GST Audit & Review',
              desc: 'LedgerSutra extracts all header and line-item fields, validates GSTIN Mod-36 checksums, flags duplicate invoices, and routes bills for CA Reviewer approval.',
            },
            {
              step: 'Step 3',
              title: 'Reconcile GSTR-2B & Export to Tally',
              desc: 'Match approved bills against portal GSTR-2B JSON/Excel files and download TallyPrime XML vouchers, multi-sheet Excel registers, Zoho CSV, or Busy sheets.',
            },
          ].map((st) => (
            <div
              key={st.step}
              className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2"
            >
              <span className="inline-block px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 text-xs font-bold">
                {st.step}
              </span>
              <h3 className="text-base font-bold text-[var(--text-main)]">{st.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 7: SCREENSHOTS SECTION (HONEST PLACEHOLDERS - PART 7.7)     */}
      {/* =================================================================== */}
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Section 7 • Workspace Previews
          </span>
          <h2 className="text-2xl font-extrabold text-[var(--text-main)] mt-1">
            Inside the {BRAND_NAME} CA Workspace
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Interactive UI wireframes below represent the live tabs available immediately inside the workspace above (placeholder preview slots for production screenshots).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: '[Screenshot Placeholder 1: TallyPrime XML Pre-Export Validator]',
              subtitle:
                'Shows blocked bills (missing invoice number, invalid GSTIN, tax variance) with "Fix Now" and "Skip & Export Valid Bills" actions.',
              tab: 'master_sheet' as const,
            },
            {
              title: '[Screenshot Placeholder 2: GSTR-2B vs Purchase Register Matcher]',
              subtitle:
                'Side-by-side comparison of Books vs GSTR-2B portal values across 6 statuses with ITC at Risk summary cards.',
              tab: 'master_sheet' as const,
            },
            {
              title: '[Screenshot Placeholder 3: Multi-File Batch Queue & Audit Mode]',
              subtitle:
                'Real-time batch processing queue with per-file progress bars, Mod-36 GSTIN verification, and line-item editor.',
              tab: 'scanner' as const,
            },
          ].map((shot) => (
            <div
              key={shot.title}
              className="p-5 rounded-2xl border border-dashed border-indigo-500/40 bg-[var(--bg-subtle)] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-indigo-500">{shot.title}</div>
                <p className="text-xs text-[var(--text-muted)]">{shot.subtitle}</p>
              </div>
              <button
                onClick={() => onOpenWorkspaceTab(shot.tab, 'ca_mode')}
                className="text-xs font-bold text-indigo-500 hover:underline text-left cursor-pointer"
              >
                Try this view live in workspace →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 8: TRUTHFUL SECURITY & PRIVACY SECTION (PART 7.8)           */}
      {/* =================================================================== */}
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
              Section 8 • Truthful Security Architecture
            </span>
            <h2 className="text-2xl font-extrabold text-[var(--text-main)] mt-1">
              Security &amp; Data Isolation for Client Records
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/security')}
            className="text-xs font-bold text-indigo-500 hover:underline cursor-pointer"
          >
            Read Full Security Overview →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              Google Sign-In Authentication
            </div>
            <p className="text-[var(--text-muted)]">
              Users authenticate via Google OAuth (Firebase Authentication). No plaintext passwords are stored by LedgerSutra.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Per-User &amp; Per-Client Firestore Isolation
            </div>
            <p className="text-[var(--text-muted)]">
              All saved clients, bills, and audit trails are scoped under <code className="font-mono">/users/&#123;uid&#125;/clients/&#123;clientId&#125;</code> and enforced by Firestore security rules.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              Encryption in Transit &amp; Instant Data Deletion
            </div>
            <p className="text-[var(--text-muted)]">
              All API and database traffic uses HTTPS/TLS encryption in transit, and users can permanently delete any client or their entire account data at any time.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 9: PRICING SECTION (PLACEHOLDER PLANS + PILOT NOTE)         */}
      {/* =================================================================== */}
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              Section 9 • Placeholder Practice Plans
            </span>
            <h2 className="text-2xl font-extrabold text-[var(--text-main)] mt-1">
              Pricing Built for Solo Practitioners &amp; Multi-Partner CA Firms
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Note: Pricing tiers below are placeholder plans. <b>Custom CA-firm pilot offers are available</b> — contact us to onboard your firm.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              tier: 'Free Starter (Placeholder)',
              price: '₹0 / month',
              subtitle: 'For evaluating OCR, GSTIN checks & Tally XML format',
              features: [
                '3 no-login demo scans/day + free workspace trial',
                'Single & batch invoice upload queue',
                'TallyPrime XML & Excel (.xlsx) export',
                '1 Default Client workspace',
              ],
            },
            {
              tier: 'Pro Practitioner (Placeholder)',
              price: '₹1,499 / month (Placeholder)',
              subtitle: 'For independent CAs & GST practitioners',
              features: [
                'Up to 25 Client-Wise Workspaces',
                'Full GSTR-2B JSON & Excel Reconciliation',
                'Zoho Books CSV & Busy Excel exports',
                'Extended E-Invoice, IRN & Bank field extraction',
              ],
            },
            {
              tier: 'CA Firm & Audit Team (Placeholder)',
              price: '₹3,999 / month (Placeholder)',
              subtitle: 'For multi-partner CA firms with articles & review teams',
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
              className="p-6 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase text-indigo-500">{plan.tier}</div>
                <div className="text-2xl font-extrabold text-[var(--text-main)]">{plan.price}</div>
                <p className="text-xs text-[var(--text-muted)]">{plan.subtitle}</p>
                <ul className="space-y-2 pt-3 text-xs text-[var(--text-main)]">
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
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
              >
                Request CA-Firm Pilot Offer
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 10: 12+ FAQS (ACCURACY MARKED DEPENDS ON INVOICE QUALITY)   */}
      {/* =================================================================== */}
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Section 10 • Frequently Asked Questions ({HOMEPAGE_FAQS.length} Questions)
          </span>
          <h2 className="text-2xl font-extrabold text-[var(--text-main)] mt-1">
            Common Questions from Chartered Accountants &amp; Tax Teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOMEPAGE_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2"
            >
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-6">{faq.answer}</p>
            </div>
          ))}
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

  // 1. Check Dedicated SEO Landing Pages (/gst-invoice-to-tally, /gstr-2b-reconciliation-excel, /bulk-invoice-processing-for-ca, etc.)
  if (DEDICATED_SEO_PAGES[cleanPath]) {
    const spec = DEDICATED_SEO_PAGES[cleanPath];
    return (
      <article className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-8">
        <div className="space-y-3 border-b border-[var(--border-color)] pb-6">
          <span className="inline-block px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase">
            {spec.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">{spec.h1}</h1>
          <p className="text-base text-[var(--text-muted)]">{spec.subtitle}</p>
          <p className="text-sm text-[var(--text-main)] leading-relaxed">{spec.problemStatement}</p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
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
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-main)]">
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
              className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5"
            >
              <div className="text-xs font-bold text-indigo-500 uppercase">Step {i + 1}</div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">{step.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{step.detail}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--text-main)]">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.keyCapabilities.map((cap, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5"
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
            <h2 className="text-xl font-bold text-[var(--text-main)]">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spec.faqs.map((f, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5"
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

  // 2. Check Blog / Resource Article Detail Page
  const article = RESOURCE_ARTICLES.find(
    (a) => a.path === cleanPath || `/blog/${a.slug}` === cleanPath || `/resources/${a.slug}` === cleanPath
  );
  if (article) {
    return (
      <article className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-8">
        <div className="space-y-3 border-b border-[var(--border-color)] pb-6">
          <div className="flex items-center gap-2 text-xs text-indigo-500 font-bold">
            <span>{article.category}</span> • <span>{article.readTime}</span> •{' '}
            <span>Published {article.publishedDate}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)]">{article.title}</h1>
          <p className="text-sm text-[var(--text-muted)]">{article.summary}</p>
        </div>

        <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
          <div className="text-xs font-bold uppercase text-indigo-500">Key Takeaways for CA Firms</div>
          <ul className="space-y-1.5 text-xs text-[var(--text-main)]">
            {article.keyTakeaways.map((kt, i) => (
              <li key={i}>• {kt}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          {article.sections.map((sec, i) => (
            <section key={i} className="space-y-3">
              <h2 className="text-xl font-bold text-[var(--text-main)]">{sec.heading}</h2>
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
            className="text-xs font-bold text-indigo-500 hover:underline cursor-pointer"
          >
            ← Back to All Blog Articles
          </button>
          <button
            onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
          >
            Try {BRAND_NAME} Live Workspace
          </button>
        </div>
      </article>
    );
  }

  // 3. Blog / Resources Index (/blog or /resources)
  if (cleanPath === '/blog' || cleanPath === '/resources') {
    return (
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase text-indigo-500">CA Practice Blog &amp; Guides</span>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] mt-1">
            Tutorials on TallyPrime Import, GSTR-2B Reconciliation &amp; GST Audit
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESOURCE_ARTICLES.map((art) => (
            <div
              key={art.slug}
              className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-indigo-500">
                  {art.category} • {art.readTime}
                </div>
                <h2 className="text-base font-bold text-[var(--text-main)]">{art.title}</h2>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{art.summary}</p>
              </div>
              <button
                onClick={() => onNavigate(art.path)}
                className="text-xs font-bold text-indigo-500 hover:underline text-left cursor-pointer"
              >
                Read Full Article →
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 4. Developer API Docs Page (/api-docs - Part 6.2)
  if (cleanPath === '/api-docs') {
    return (
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        <div className="space-y-2 border-b border-[var(--border-color)] pb-5">
          <span className="text-xs font-bold uppercase text-indigo-500">REST API v1 Documentation</span>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)]">
            Programmatic GST Invoice Extraction — <code className="text-indigo-500">POST /api/v1/extract</code>
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Authenticate with a per-user API key generated in the workspace <b>Accuracy &amp; API</b> tab. Keys are hashed with SHA-256 before storage in Firestore. Rate limit: 30 requests/minute; max payload: 15 MB.
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
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-5">
        <h1 className="text-3xl font-extrabold text-[var(--text-main)]">Privacy Policy</h1>
        <p className="text-xs text-[var(--text-muted)]">Last Updated: November 2026</p>
        <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed">
          <p>
            <strong className="text-[var(--text-main)]">1. Data We Process:</strong> When you use {BRAND_NAME}, we
            process the invoice PDFs/images you upload and store the extracted structured accounting records under your
            authenticated Google account in Firebase Firestore (<code className="font-mono">/users/&#123;uid&#125;/clients/&#123;clientId&#125;</code>).
          </p>
          <p>
            <strong className="text-[var(--text-main)]">2. Strict Per-User Isolation:</strong> Your client profiles,
            scanned invoices, GSTR-2B reconciliation working sheets, and Tally settings are isolated to your Firebase
            UID and authorized firm team members.
          </p>
          <p>
            <strong className="text-[var(--text-main)]">3. Self-Service Data Deletion:</strong> You can permanently
            delete any individual bill, purge an entire client workspace, or delete all data associated with your
            account at any time from the <b>Clients &amp; Team</b> tab in the workspace.
          </p>
        </div>
      </section>
    );
  }

  // 6. Terms of Service (/terms)
  if (cleanPath === '/terms') {
    return (
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-5">
        <h1 className="text-3xl font-extrabold text-[var(--text-main)]">Terms of Service</h1>
        <p className="text-xs text-[var(--text-muted)]">Last Updated: November 2026</p>
        <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed">
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

  // 7. Security Page (/security)
  if (cleanPath === '/security') {
    return (
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-5">
        <h1 className="text-3xl font-extrabold text-[var(--text-main)]">Security &amp; Data Isolation Architecture</h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          We describe only the technical security controls that are implemented and active in {BRAND_NAME}—without unverified certification claims:
        </p>
        <ul className="space-y-3 text-sm text-[var(--text-main)]">
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
      <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
        <h1 className="text-3xl font-extrabold text-[var(--text-main)]">
          Frequently Asked Questions ({HOMEPAGE_FAQS.length} Questions)
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOMEPAGE_FAQS.map((f, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
              <h2 className="text-sm font-bold text-[var(--text-main)]">{f.question}</h2>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 9. Pricing, Contact, Features, How-It-Works, About fallback
  return (
    <section className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-5">
      <h1 className="text-3xl font-extrabold text-[var(--text-main)]">
        {cleanPath === '/pricing'
          ? 'Practice Plans & CA-Firm Pilot Offers'
          : cleanPath === '/contact'
          ? 'Book a Live Demo or CA-Firm Pilot'
          : `${BRAND_NAME} — ${BRAND_TAGLINE}`}
      </h1>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
        {cleanPath === '/contact'
          ? 'Reach out to our CA onboarding engineering team at support@ledgersutra.in to schedule a live walkthrough of TallyPrime XML import, GSTR-2B reconciliation, and multi-client firm workspaces.'
          : 'Explore our live workspace below or return to the homepage for the complete interactive walkthrough.'}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onNavigate('/')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
        >
          View Full Landing Page
        </button>
        <button
          onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
          className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-bold cursor-pointer"
        >
          Jump to Workspace
        </button>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 11: FOOTER (PART 7.11)
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
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-sm">
                <ScanLine className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight block">{BRAND_NAME}</span>
                <span className="text-[11px] text-[var(--text-muted)] block">{SITE_DOMAIN}</span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              GST invoice to Tally and Excel, built for Indian CA firms. Extract GSTIN, HSN, line items, and tax splits
              with deterministic audit checks.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => onOpenWorkspaceTab('scanner', 'ca_mode')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                Open CA Workspace
              </button>
              <button
                onClick={() => onNavigate('/api-docs')}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
              >
                REST API Docs
              </button>
            </div>
          </div>

          {/* Col 2: Public Website & Legal Links */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              Platform &amp; Legal
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-indigo-500 cursor-pointer">
                  Home &amp; Live Demo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/pricing')} className="hover:text-indigo-500 cursor-pointer">
                  Pricing &amp; CA Firm Pilots
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-indigo-500 cursor-pointer">
                  FAQ (12+ Questions)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/security')} className="hover:text-indigo-500 cursor-pointer">
                  Security &amp; Data Isolation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-indigo-500 cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-indigo-500 cursor-pointer">
                  Terms of Service
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              CA &amp; GST Workflows
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <button
                  onClick={() => onNavigate('/gst-invoice-to-tally')}
                  className="hover:text-indigo-500 cursor-pointer text-left font-semibold text-indigo-500"
                >
                  GST Invoice to TallyPrime XML
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/gstr-2b-reconciliation-excel')}
                  className="hover:text-indigo-500 cursor-pointer text-left font-semibold text-indigo-500"
                >
                  GSTR-2B Reconciliation in Excel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/bulk-invoice-processing-for-ca')}
                  className="hover:text-indigo-500 cursor-pointer text-left font-semibold text-indigo-500"
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              CA Blog &amp; Guides
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <button
                  onClick={() => onNavigate('/blog')}
                  className="font-semibold text-indigo-500 hover:underline cursor-pointer text-left"
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
              © {new Date().getFullYear()} {BRAND_NAME}. Built for Indian Chartered Accountants &amp; GST Practitioners.
            </span>
            <span>TallyPrime XML • GSTR-2B Reconciliation • Zoho Books CSV • Busy Excel • REST API v1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
