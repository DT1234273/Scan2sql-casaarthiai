import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Settings,
  Upload,
  Users,
  Building2,
  ShieldCheck,
  Key,
  Target,
  Trash2,
  Plus,
  Edit3,
  Archive,
  X,
  FileSpreadsheet,
  Copy,
  ExternalLink,
} from 'lucide-react';
import {
  CAClientProfile,
  TallySettings,
  DEFAULT_TALLY_SETTINGS,
  Gstr2bPortalInvoice,
  ReconciliationRow,
  ReconciliationStatus,
  TeamMemberRecord,
  FirmRole,
  UserApiKeyRecord,
  AccuracyGroundTruthRow,
} from '../caWorkspaceTypes';
import {
  validateBillsForTallyExport,
  downloadTallyPrimeXml,
  exportZohoBooksCsv,
  exportBusyCompatibleExcel,
  ZOHO_BOOKS_COLUMN_MAPPING_DOCS,
  BUSY_EXCEL_COLUMN_MAPPING_DOCS,
} from '../tallyAndExports';
import {
  parseGstr2bJsonString,
  parseGstr2bExcelBuffer,
  buildSampleGstr2bFromBooks,
  reconcileBooksWithGstr2b,
  exportReconciliationReportToExcel,
  parseGroundTruthExcel,
  evaluateExtractionAccuracy,
  exportAccuracyReportToExcel,
} from '../gstr2bReconciliation';

// ============================================================================
// 1. TALLY EXPORT & SETTINGS MODAL + ZOHO BOOKS & BUSY EXPORTS (PART 1)
// ============================================================================

export interface TallyExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bills: any[];
  tallySettings: TallySettings;
  onSaveTallySettings: (next: TallySettings) => void | Promise<void>;
  onJumpToFixBill: (billId: string) => void;
  activeClientName?: string;
  showToast?: (msg: string) => void;
}

export const TallyExportModal: React.FC<TallyExportModalProps> = ({
  isOpen,
  onClose,
  bills,
  tallySettings,
  onSaveTallySettings,
  onJumpToFixBill,
  activeClientName = 'Client',
  showToast,
}) => {
  const [localSettings, setLocalSettings] = useState<TallySettings>(tallySettings || DEFAULT_TALLY_SETTINGS);
  const [approvedOnly, setApprovedOnly] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'validate' | 'settings' | 'mappings'>('validate');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  React.useEffect(() => {
    setLocalSettings(tallySettings || DEFAULT_TALLY_SETTINGS);
  }, [tallySettings]);

  const candidateBills = useMemo(() => {
    if (!approvedOnly) return bills;
    return bills.filter((b) => {
      const st = String(b.approvalStatus || 'Approved').toLowerCase();
      return st === 'approved';
    });
  }, [bills, approvedOnly]);

  const validation = useMemo(() => {
    return validateBillsForTallyExport(candidateBills, localSettings);
  }, [candidateBills, localSettings]);

  if (!isOpen) return null;

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await onSaveTallySettings(localSettings);
      setSettingsSavedMsg('Tally settings saved to workspace.');
      if (showToast) showToast('Tally ledger settings saved.');
      setTimeout(() => setSettingsSavedMsg(''), 3000);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleExportTallyXml = (includeBlocked: boolean) => {
    const targetBills = includeBlocked ? candidateBills : validation.validBills;
    if (targetBills.length === 0) return;
    const safeClientSlug = activeClientName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'Client';
    downloadTallyPrimeXml(targetBills, localSettings, `CASaarthiAI_TallyPrime_${safeClientSlug}.xml`);
    if (showToast) {
      showToast(`Exported ${targetBills.length} voucher(s) to TallyPrime XML.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-4 sm:my-8">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-2 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-white leading-snug">
                TallyPrime XML, Zoho Books &amp; Busy Export Center
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Client: <span className="text-indigo-300 font-semibold">{activeClientName}</span> • Pre-export GST &amp; voucher validation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              onClick={() => setActiveTab('validate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                activeTab === 'validate'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              1. Pre-Export Validation ({candidateBills.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              2. Tally Ledger Settings
            </button>
            <button
              onClick={() => setActiveTab('mappings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                activeTab === 'mappings'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              3. Zoho &amp; Busy Mappings
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={approvedOnly}
              onChange={(e) => setApprovedOnly(e.target.checked)}
              className="rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Include only Approved bills</span>
          </label>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto space-y-5 sm:space-y-6">
          {activeTab === 'validate' && (
            <>
              {/* Summary Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/70 border border-slate-700">
                  <div className="text-xs text-slate-400">Total Selected Bills</div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-1">{candidateBills.length}</div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    Company: <span className="text-slate-200">{localSettings.companyName}</span>
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-950/30 border border-emerald-700/40">
                  <div className="text-xs text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Ready for Tally Import
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
                    {validation.validBills.length}
                  </div>
                  <div className="text-[11px] text-emerald-300/80 mt-1">
                    Passed invoice no, date, GSTIN &amp; tax checks
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-amber-950/30 border border-amber-700/40">
                  <div className="text-xs text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Blocked Bills Requiring Attention
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">
                    {validation.blockedIssues.length}
                  </div>
                  <div className="text-[11px] text-amber-300/80 mt-1">
                    Fix now or skip blocked bills during export
                  </div>
                </div>
              </div>

              {/* Blocked Bills List */}
              {validation.blockedIssues.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Bills Blocked by Pre-Export Validation ({validation.blockedIssues.length})</span>
                  </h3>
                  <div className="border border-slate-700 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[540px]">
                      <thead className="bg-slate-800 text-slate-300">
                        <tr>
                          <th className="py-2.5 px-3">Supplier / Party</th>
                          <th className="py-2.5 px-3">Invoice No</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Total (₹)</th>
                          <th className="py-2.5 px-3">Blocking Reasons</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                        {validation.blockedIssues.map((issue) => (
                          <tr key={issue.billId} className="hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 font-medium text-white">{issue.shopName}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-300">{issue.invoiceNumber}</td>
                            <td className="py-2.5 px-3 text-slate-300">{issue.billDate}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-200">
                              ₹{issue.grandTotal.toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3">
                              <ul className="space-y-1">
                                {issue.reasons.map((r, idx) => (
                                  <li key={idx} className="text-amber-300 flex items-center gap-1">
                                    <span>•</span> {r}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => {
                                  onJumpToFixBill(issue.billId);
                                  onClose();
                                }}
                                className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-semibold"
                              >
                                Fix now
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-700/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  All {candidateBills.length} selected bills passed pre-export validation and are ready for TallyPrime XML import.
                </div>
              )}

              {/* Export Buttons */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleExportTallyXml(false)}
                    disabled={validation.validBills.length === 0}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    {validation.blockedIssues.length > 0
                      ? `Skip Blocked & Export Valid to Tally XML (${validation.validBills.length})`
                      : `Export to TallyPrime XML (${validation.validBills.length})`}
                  </button>

                  {validation.blockedIssues.length > 0 && (
                    <button
                      onClick={() => handleExportTallyXml(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                    >
                      Force Export All ({candidateBills.length})
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      exportZohoBooksCsv(
                        validation.validBills.length > 0 ? validation.validBills : candidateBills,
                        `CASaarthiAI_ZohoBooks_${activeClientName.replace(/[^a-zA-Z0-9_-]/g, '_')}.csv`
                      )
                    }
                    disabled={candidateBills.length === 0}
                    className="px-3.5 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Zoho Books CSV
                  </button>
                  <button
                    onClick={() =>
                      exportBusyCompatibleExcel(
                        validation.validBills.length > 0 ? validation.validBills : candidateBills,
                        `CASaarthiAI_Busy_${activeClientName.replace(/[^a-zA-Z0-9_-]/g, '_')}.xlsx`
                      )
                    }
                    disabled={candidateBills.length === 0}
                    className="px-3.5 py-2 rounded-xl bg-amber-700/80 hover:bg-amber-600 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Busy Excel (.xlsx)
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tally Company Name (SVCURRENTCOMPANY)
                  </label>
                  <input
                    type="text"
                    value={localSettings.companyName}
                    onChange={(e) => setLocalSettings({ ...localSettings, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                    placeholder="e.g. Sharma & Associates Client Books"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Default Voucher Type
                  </label>
                  <select
                    value={localSettings.defaultVoucherType}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        defaultVoucherType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  >
                    <option value="Purchase">Purchase</option>
                    <option value="Journal">Journal</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Purchase Ledger Name (Debit Taxable Value)
                  </label>
                  <input
                    type="text"
                    value={localSettings.purchaseLedgerName}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, purchaseLedgerName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Input CGST Ledger Name
                  </label>
                  <input
                    type="text"
                    value={localSettings.cgstLedgerName}
                    onChange={(e) => setLocalSettings({ ...localSettings, cgstLedgerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Input SGST Ledger Name
                  </label>
                  <input
                    type="text"
                    value={localSettings.sgstLedgerName}
                    onChange={(e) => setLocalSettings({ ...localSettings, sgstLedgerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Input IGST Ledger Name
                  </label>
                  <input
                    type="text"
                    value={localSettings.igstLedgerName}
                    onChange={(e) => setLocalSettings({ ...localSettings, igstLedgerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Round-Off Ledger Name
                  </label>
                  <input
                    type="text"
                    value={localSettings.roundOffLedgerName}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, roundOffLedgerName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.autoCreateMissingPartyLedgers}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          autoCreateMissingPartyLedgers: e.target.checked,
                        })
                      }
                      className="rounded border-slate-600 bg-slate-800 text-indigo-600"
                    />
                    <span>
                      Auto-create missing Supplier Party Ledgers under <b>Sundry Creditors</b> in XML
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="text-xs text-emerald-400">{settingsSavedMsg}</div>
                <button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  {savingSettings ? 'Saving...' : 'Save Tally Settings'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'mappings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-2">
                  Zoho Books Bill Import CSV Column Mapping
                </h3>
                <div className="border border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="py-2 px-3">Zoho Books Column</th>
                        <th className="py-2 px-3">LedgerSutra Field</th>
                        <th className="py-2 px-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {ZOHO_BOOKS_COLUMN_MAPPING_DOCS.map((row, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-mono text-indigo-300">{row.column}</td>
                          <td className="py-2 px-3 font-mono text-slate-200">{row.source}</td>
                          <td className="py-2 px-3 text-slate-400">{row.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">
                  Busy Accounting Software Purchase Excel Column Mapping
                </h3>
                <div className="border border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="py-2 px-3">Busy Excel Column</th>
                        <th className="py-2 px-3">LedgerSutra Field</th>
                        <th className="py-2 px-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {BUSY_EXCEL_COLUMN_MAPPING_DOCS.map((row, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-mono text-amber-300">{row.column}</td>
                          <td className="py-2 px-3 font-mono text-slate-200">{row.source}</td>
                          <td className="py-2 px-3 text-slate-400">{row.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. GSTR-2B RECONCILIATION TAB (PART 2)
// ============================================================================

export interface Gstr2bReconciliationTabProps {
  bills: any[];
  activeClient?: CAClientProfile;
  activeClientName?: string;
  showToast?: (msg: string) => void;
}

const RECON_STATUS_META: Array<{ code: ReconciliationStatus; label: string }> = [
  { code: 'MATCHED', label: 'Matched' },
  { code: 'AMOUNT_MISMATCH', label: 'Amount Mismatch' },
  { code: 'DATE_MISMATCH', label: 'Date Mismatch' },
  { code: 'INVOICE_NO_MISMATCH', label: 'Invoice Number Mismatch (probable)' },
  { code: 'IN_BOOKS_NOT_2B', label: 'In Books but Not in 2B' },
  { code: 'IN_2B_NOT_BOOKS', label: 'In 2B but Not in Books' },
];

export const Gstr2bReconciliationTab: React.FC<Gstr2bReconciliationTabProps> = ({
  bills,
  activeClient,
  activeClientName,
  showToast,
}) => {
  const clientDisplayName = activeClient?.name || activeClientName || 'Default Client';
  const [portalInvoices, setPortalInvoices] = useState<Gstr2bPortalInvoice[]>([]);
  const [parseError, setParseError] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [toleranceRs, setToleranceRs] = useState<number>(1);
  const [periodFilter, setPeriodFilter] = useState<string>('ALL');
  const [approvedOnly, setApprovedOnly] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [manualOverrides, setManualOverrides] = useState<
    Record<string, { status?: ReconciliationStatus; note?: string }>
  >({});

  const handleUploadGstr2bFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError('');
    setUploadedFileName(file.name);

    if (file.name.toLowerCase().endsWith('.json')) {
      const text = await file.text();
      const res = parseGstr2bJsonString(text);
      if (res.error) {
        setParseError(res.error);
      } else {
        setPortalInvoices(res.invoices);
        if (showToast) showToast(`Parsed ${res.invoices.length} GSTR-2B portal invoice(s).`);
      }
    } else {
      const buf = await file.arrayBuffer();
      const res = parseGstr2bExcelBuffer(buf);
      if (res.error) {
        setParseError(res.error);
      } else {
        setPortalInvoices(res.invoices);
        if (showToast) showToast(`Parsed ${res.invoices.length} GSTR-2B Excel invoice(s).`);
      }
    }
    e.target.value = '';
  };

  const handleLoadSample2bFromBooks = () => {
    setParseError('');
    const sample = buildSampleGstr2bFromBooks(bills);
    setPortalInvoices(sample);
    setUploadedFileName('Sample_GSTR2B_From_Active_Client_Books.json');
    if (showToast) showToast(`Generated ${sample.length} sample GSTR-2B portal records.`);
  };

  const filteredBookBills = useMemo(() => {
    return bills.filter((b) => {
      if (approvedOnly) {
        const st = String(b.approvalStatus || 'Approved').toLowerCase();
        if (st !== 'approved') return false;
      }
      if (periodFilter !== 'ALL' && !periodFilter.startsWith('FY:')) {
        if (!String(b.billDate || '').startsWith(periodFilter)) return false;
      }
      return true;
    });
  }, [bills, approvedOnly, periodFilter]);

  const reconciliation = useMemo(() => {
    return reconcileBooksWithGstr2b(filteredBookBills, portalInvoices, toleranceRs, manualOverrides);
  }, [filteredBookBills, portalInvoices, toleranceRs, manualOverrides]);

  const filteredRows = useMemo(() => {
    return reconciliation.rows.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${r.supplierName} ${r.supplierGstin} ${r.bookInvoiceNo || ''} ${
          r.portalInvoiceNo || ''
        } ${r.matchReason}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [reconciliation.rows, statusFilter, searchQuery]);

  const handleManualStatusToggle = (row: ReconciliationRow) => {
    const current = manualOverrides[row.id] || {};
    const nextStatus: ReconciliationStatus =
      row.status === 'MATCHED' ? 'IN_BOOKS_NOT_2B' : 'MATCHED';
    setManualOverrides({
      ...manualOverrides,
      [row.id]: {
        ...current,
        status: nextStatus,
      },
    });
  };

  const handleNoteChange = (rowId: string, note: string) => {
    const current = manualOverrides[rowId] || {};
    setManualOverrides({
      ...manualOverrides,
      [rowId]: {
        ...current,
        note,
      },
    });
  };

  const statusBadgeClass = (status: ReconciliationStatus) => {
    switch (status) {
      case 'MATCHED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'AMOUNT_MISMATCH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'DATE_MISMATCH':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'INVOICE_NO_MISMATCH':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'IN_BOOKS_NOT_2B':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'IN_2B_NOT_BOOKS':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    }
  };

  const formatStatusLabel = (status: ReconciliationStatus) => {
    const found = RECON_STATUS_META.find((m) => m.code === status);
    return found ? found.label : status;
  };

  return (
    <div className="space-y-6">
      {/* Top Upload & Configuration Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              GSTR-2B vs Purchase Register Reconciliation
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Client: <span className="text-indigo-300 font-semibold">{clientDisplayName}</span> • Upload GST Portal GSTR-2B (.json or .xlsx) to match B2B invoices &amp; identify ITC at risk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer flex items-center gap-2 shadow">
              <Upload className="w-4 h-4" />
              Upload GSTR-2B (JSON / Excel)
              <input
                type="file"
                accept=".json,.xlsx,.xls,.csv"
                onChange={handleUploadGstr2bFile}
                className="hidden"
              />
            </label>

            <button
              onClick={handleLoadSample2bFromBooks}
              disabled={bills.length === 0}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold border border-slate-700"
            >
              Simulate 2B from Current Books ({bills.length})
            </button>

            <button
              onClick={() =>
                exportReconciliationReportToExcel(
                  reconciliation.rows,
                  reconciliation.summary,
                  clientDisplayName,
                  `CASaarthiAI_GSTR2B_Reconciliation_${clientDisplayName.replace(/[^a-zA-Z0-9_-]/g, '_')}.xlsx`
                )
              }
              disabled={reconciliation.rows.length === 0}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Download className="w-4 h-4" />
              Export Multi-Sheet Report (.xlsx)
            </button>
          </div>
        </div>

        {parseError && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-700/60 text-rose-200 text-xs flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {uploadedFileName && !parseError && (
          <div className="text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Loaded <b>{portalInvoices.length}</b> B2B portal records from <span className="font-mono">{uploadedFileName}</span>
          </div>
        )}

        {/* Controls Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Amount Rounding Tolerance (₹)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={toleranceRs}
              onChange={(e) => setToleranceRs(Math.max(0, Number(e.target.value) || 0))}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Period Filter (Month / FY)
            </label>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            >
              <option value="ALL">All Periods</option>
              <option value="FY:2026-27">FY 2026-27</option>
              <option value="FY:2025-26">FY 2025-26</option>
              <option value="FY:2024-25">FY 2024-25</option>
              <option value="2026-11">Nov 2026 (2026-11)</option>
              <option value="2026-10">Oct 2026 (2026-10)</option>
              <option value="2026-09">Sep 2026 (2026-09)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            >
              <option value="ALL">All Statuses ({reconciliation.rows.length})</option>
              {RECON_STATUS_META.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.label} ({reconciliation.summary.countsByStatus[m.code]})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={approvedOnly}
                onChange={(e) => setApprovedOnly(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-indigo-600"
              />
              <span>Only Approved Books Bills</span>
            </label>
          </div>
        </div>
      </div>

      {/* ITC Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Total ITC as per Purchase Books</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            ₹{reconciliation.summary.totalItcBooks.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Sum of CGST + SGST + IGST in Books</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Total ITC as per GSTR-2B Portal</div>
          <div className="text-2xl font-bold text-indigo-400 font-mono mt-1">
            ₹{reconciliation.summary.totalItc2b.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Sum of eligible tax in uploaded GSTR-2B</div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/25 border border-rose-800/50">
          <div className="text-xs text-rose-300 font-semibold">ITC at Risk (Follow up with Vendors)</div>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">
            ₹{reconciliation.summary.itcAtRisk.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-rose-300/80 mt-1">
            Bills in Books missing in 2B + excess Books tax
          </div>
        </div>
      </div>

      {/* 6 Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {RECON_STATUS_META.map((m) => {
          const count = reconciliation.summary.countsByStatus[m.code];
          const amount = reconciliation.summary.amountsByStatus[m.code];
          const isSelected = statusFilter === m.code;
          return (
            <button
              key={m.code}
              onClick={() => setStatusFilter(isSelected ? 'ALL' : m.code)}
              className={`p-3 rounded-xl border text-left transition ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-300 line-clamp-1">{m.label}</div>
              <div className="text-xl font-bold text-white mt-1">{count}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">
                Value: ₹{amount.toLocaleString('en-IN')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-bold text-white">
            Reconciliation Working Sheet ({filteredRows.length} rows)
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search supplier, GSTIN, invoice no..."
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/90 text-slate-300">
              <tr>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Supplier &amp; GSTIN</th>
                <th className="py-2.5 px-3">Invoice No (Books vs 2B)</th>
                <th className="py-2.5 px-3">Date (Books vs 2B)</th>
                <th className="py-2.5 px-3">Taxable (Books vs 2B)</th>
                <th className="py-2.5 px-3">Tax / ITC (Books vs 2B)</th>
                <th className="py-2.5 px-3">Variance Details</th>
                <th className="py-2.5 px-3">Auditor Note &amp; Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No reconciliation rows match the current filter. Upload a GSTR-2B file or click &ldquo;Simulate 2B from Current Books&rdquo; above.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md border text-[11px] font-semibold ${statusBadgeClass(
                          row.status
                        )}`}
                      >
                        {formatStatusLabel(row.status)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{row.supplierName}</div>
                      <div className="font-mono text-[11px] text-slate-400">{row.supplierGstin}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <div className="text-slate-200">B: {row.bookInvoiceNo || '—'}</div>
                      <div className="text-indigo-300">2B: {row.portalInvoiceNo || '—'}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <div className="text-slate-200">B: {row.bookDate || '—'}</div>
                      <div className="text-indigo-300">2B: {row.portalDate || '—'}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <div className="text-slate-200">₹{row.bookTaxable.toLocaleString('en-IN')}</div>
                      <div className="text-indigo-300">₹{row.portalTaxable.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <div className="text-slate-200">₹{row.bookTotalTax.toLocaleString('en-IN')}</div>
                      <div className="text-indigo-300">₹{row.portalTotalTax.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-xs">{row.matchReason}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={manualOverrides[row.id]?.note ?? row.note ?? ''}
                          onChange={(e) => handleNoteChange(row.id, e.target.value)}
                          placeholder="Add CA note..."
                          className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-[11px] w-32"
                        />
                        <button
                          onClick={() => handleManualStatusToggle(row)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] font-semibold shrink-0"
                          title="Toggle manual Match / Unmatch override"
                        >
                          {row.status === 'MATCHED' ? 'Unmatch' : 'Force Match'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. CLIENTS OVERVIEW, TEAM RBAC & DATA DELETION PANEL (PARTS 3, 4, 9.3)
// ============================================================================

export interface ClientsAndTeamPanelProps {
  clients: CAClientProfile[];
  activeClientId: string;
  onSelectClient: (clientId: string) => void;
  onSaveClient: (client: CAClientProfile) => Promise<void>;
  onDeleteClient?: (clientId: string) => Promise<void>;
  onDeleteClientData?: (clientId: string) => Promise<void>;
  onDeleteEntireAccountData?: () => Promise<void>;
  bills?: any[];
  activeClientBills?: any[];
  teamMembers: TeamMemberRecord[];
  onSaveTeamMember: (member: TeamMemberRecord) => Promise<void>;
  onRemoveTeamMember?: (memberId: string) => Promise<void>;
  onDeleteTeamMember?: (memberId: string) => Promise<void>;
  currentFirmRole: FirmRole;
  onChangeFirmRole: (role: FirmRole) => void;
  showToast?: (msg: string) => void;
}

export const ClientsAndTeamPanel: React.FC<ClientsAndTeamPanelProps> = ({
  clients,
  activeClientId,
  onSelectClient,
  onSaveClient,
  onDeleteClient,
  onDeleteClientData,
  onDeleteEntireAccountData,
  bills,
  activeClientBills,
  teamMembers,
  onSaveTeamMember,
  onRemoveTeamMember,
  onDeleteTeamMember,
  currentFirmRole,
  onChangeFirmRole,
  showToast,
}) => {
  const resolvedBills = activeClientBills || bills || [];
  const [editingClient, setEditingClient] = useState<CAClientProfile | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientGstin, setClientGstin] = useState('');
  const [clientPan, setClientPan] = useState('');
  const [clientFy, setClientFy] = useState('2026-27');
  const [clientNotes, setClientNotes] = useState('');

  // Team invite state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<FirmRole>('Staff');

  // Delete confirmation state
  const [confirmDeleteClient, setConfirmDeleteClient] = useState<string | null>(null);

  const startNewClient = () => {
    setEditingClient({
      id: `client_${Date.now()}`,
      name: '',
      gstin: '',
      pan: '',
      financialYear: '2026-27',
      notes: '',
      archived: false,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    setClientName('');
    setClientGstin('');
    setClientPan('');
    setClientFy('2026-27');
    setClientNotes('');
  };

  const startEditClient = (c: CAClientProfile) => {
    setEditingClient(c);
    setClientName(c.name);
    setClientGstin(c.gstin);
    setClientPan(c.pan);
    setClientFy(c.financialYear);
    setClientNotes(c.notes);
  };

  const handleSaveClientForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !clientName.trim()) return;
    const updated: CAClientProfile = {
      ...editingClient,
      name: clientName.trim(),
      gstin: clientGstin.trim().toUpperCase(),
      pan: clientPan.trim().toUpperCase(),
      financialYear: clientFy.trim() || '2026-27',
      notes: clientNotes.trim(),
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    await onSaveClient(updated);
    setEditingClient(null);
    if (showToast) showToast(`Saved client "${updated.name}".`);
  };

  const handleToggleArchiveClient = async (c: CAClientProfile) => {
    await onSaveClient({
      ...c,
      archived: !c.archived,
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
  };

  const handleInviteTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const member: TeamMemberRecord = {
      id: `member_${Date.now()}`,
      email: inviteEmail.trim().toLowerCase(),
      name: inviteName.trim() || inviteEmail.split('@')[0],
      role: inviteRole,
      assignedClientIds: [activeClientId],
      status: 'Active',
      invitedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    await onSaveTeamMember(member);
    setInviteEmail('');
    setInviteName('');
    if (showToast) showToast(`Invited ${member.email} as ${member.role}.`);
  };

  // Active client metrics
  const activeMetrics = useMemo(() => {
    const billCount = resolvedBills.length;
    const totalTaxable = resolvedBills.reduce((s, b) => s + (Number(b.subtotal) || 0), 0);
    const totalGst = resolvedBills.reduce((s, b) => s + (Number(b.taxAmount) || 0), 0);
    const pendingReviewCount = resolvedBills.filter(
      (b) =>
        b.approvalStatus === 'Pending Review' ||
        b.approvalStatus === 'pending_review' ||
        b.needsReview
    ).length;
    return { billCount, totalTaxable, totalGst, pendingReviewCount };
  }, [resolvedBills]);

  const isOwnerRole = currentFirmRole === 'Owner/CA' || currentFirmRole === 'owner';

  return (
    <div className="space-y-6">
      {/* Section 1: Clients Overview & Workspace Switcher (Part 3) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              Client-Wise CA Firm Workspaces
            </h2>
            <p className="text-xs text-slate-400">
              All scanning, master sheets, GSTR-2B reconciliation, and Tally XML exports are isolated per selected client.
            </p>
          </div>
          <button
            onClick={startNewClient}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add New Client
          </button>
        </div>

        {/* Add/Edit Client Form */}
        {editingClient && (
          <form
            onSubmit={handleSaveClientForm}
            className="p-4 rounded-xl bg-slate-800/80 border border-indigo-500/40 space-y-3"
          >
            <div className="text-xs font-bold text-indigo-300">
              {clients.some((c) => c.id === editingClient.id) ? 'Edit Client Profile' : 'Create New Client Workspace'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Client Legal / Trade Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  placeholder="e.g. Apex Manufacturing Pvt Ltd"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Client GSTIN (15-char)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={clientGstin}
                  onChange={(e) => setClientGstin(e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  placeholder="27AABCU9603R1ZM"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">PAN (10-char)</label>
                <input
                  type="text"
                  maxLength={10}
                  value={clientPan}
                  onChange={(e) => setClientPan(e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  placeholder="AABCU9603R"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Financial Year</label>
                <select
                  value={clientFy}
                  onChange={(e) => setClientFy(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="2026-27">2026-27</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Audit &amp; Filing Notes</label>
              <input
                type="text"
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                placeholder="Monthly GSTR-3B filer, TallyPrime books maintained..."
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-200 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Save Client
              </button>
            </div>
          </form>
        )}

        {/* Clients Overview Table */}
        <div className="border border-slate-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/90 text-slate-300">
              <tr>
                <th className="py-2.5 px-3">Client Name</th>
                <th className="py-2.5 px-3">GSTIN / PAN</th>
                <th className="py-2.5 px-3">FY</th>
                <th className="py-2.5 px-3">Active Workspace Metrics</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {clients.map((c) => {
                const isSelected = c.id === activeClientId;
                return (
                  <tr
                    key={c.id}
                    className={`${isSelected ? 'bg-indigo-950/30' : 'hover:bg-slate-800/40'} ${
                      c.archived ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{c.name}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-semibold">
                            Active Client
                          </span>
                        )}
                        {c.archived && (
                          <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px]">
                            Archived
                          </span>
                        )}
                      </div>
                      {c.notes && <div className="text-[11px] text-slate-400 mt-0.5">{c.notes}</div>}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      <div>GSTIN: {c.gstin || 'Unregistered'}</div>
                      <div className="text-[11px] text-slate-400">PAN: {c.pan || '—'}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{c.financialYear}</td>
                    <td className="py-3 px-3">
                      {isSelected ? (
                        <div className="flex flex-wrap items-center gap-3 text-[11px]">
                          <span className="text-slate-200">
                            Bills: <b>{activeMetrics.billCount}</b>
                          </span>
                          <span className="text-slate-200 font-mono">
                            Taxable: <b>₹{activeMetrics.totalTaxable.toLocaleString('en-IN')}</b>
                          </span>
                          <span className="text-indigo-300 font-mono">
                            GST: <b>₹{activeMetrics.totalGst.toLocaleString('en-IN')}</b>
                          </span>
                          <span className="text-amber-300">
                            Pending Review: <b>{activeMetrics.pendingReviewCount}</b>
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Switch to client to view live Firestore totals
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isSelected && (
                          <button
                            onClick={() => onSelectClient(c.id)}
                            className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold"
                          >
                            Switch
                          </button>
                        )}
                        <button
                          onClick={() => startEditClient(c)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Edit client"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleArchiveClient(c)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title={c.archived ? 'Unarchive client' : 'Archive client'}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        {(onDeleteClient || onDeleteClientData) && c.id !== 'client_default' && (
                          <button
                            onClick={() => {
                              const fn = onDeleteClient || onDeleteClientData;
                              if (fn) fn(c.id);
                            }}
                            className="p-1.5 rounded bg-slate-800 hover:bg-rose-900/60 text-rose-400"
                            title="Delete client workspace"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Team Access & Role-Based Approval Workflow (Part 4) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Team Access &amp; Approval Workflow (RBAC)
            </h2>
            <p className="text-xs text-slate-400">
              Roles: <b>Owner/CA</b> (full access), <b>Reviewer</b> (can approve/reject bills), <b>Staff</b> (upload &amp; submit only). Enforced in UI and <code className="text-indigo-300">firestore.rules</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-300">Active Role Mode:</span>
            <select
              value={currentFirmRole}
              onChange={(e) => onChangeFirmRole(e.target.value as FirmRole)}
              className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded border border-slate-700"
            >
              <option value="Owner/CA">Owner/CA</option>
              <option value="Reviewer">Reviewer</option>
              <option value="Staff">Staff (Upload-Only)</option>
            </select>
          </div>
        </div>

        {isOwnerRole && (
          <form
            onSubmit={handleInviteTeamMember}
            className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700"
          >
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@cafirm.in (Google Email)"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
            />
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="Staff / Article / CA Name"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as FirmRole)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
            >
              <option value="Staff">Staff (Upload &amp; Submit)</option>
              <option value="Reviewer">Reviewer (Approve / Reject)</option>
              <option value="Owner/CA">Owner / Partner CA</option>
            </select>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              Invite Team Member
            </button>
          </form>
        )}

        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="py-2 px-3">Name &amp; Google Email</th>
                <th className="py-2 px-3">Firm Role</th>
                <th className="py-2 px-3">Permissions</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {teamMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-400">
                    No additional team members invited yet. Use the form above to invite articles, staff, or reviewers by Google email.
                  </td>
                </tr>
              ) : (
                teamMembers.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{m.name}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{m.email}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-semibold">
                        {m.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {m.role === 'Staff' || m.role === 'staff'
                        ? 'Can upload & submit Draft / Pending Review bills'
                        : 'Can upload, edit, and Approve / Reject bills'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isOwnerRole && (onRemoveTeamMember || onDeleteTeamMember) && (
                        <button
                          onClick={() => {
                            const fn = onRemoveTeamMember || onDeleteTeamMember;
                            if (fn) fn(m.id);
                          }}
                          className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Delete Client Workspace Controls */}
      {(onDeleteClient || onDeleteClientData) && (
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-800/50 space-y-3">
          <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Client Workspace Deletion Control
          </h3>
          <p className="text-xs text-slate-300">
            Permanently delete a client workspace and its bills from Firestore, or use the Accuracy &amp; API tab to purge your entire account data.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {confirmDeleteClient === activeClientId ? (
              <div className="flex items-center gap-2 bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-600">
                <span className="text-xs text-rose-200">Delete all bills &amp; records in active client?</span>
                <button
                  onClick={async () => {
                    const fn = onDeleteClient || onDeleteClientData;
                    if (fn) await fn(activeClientId);
                    setConfirmDeleteClient(null);
                  }}
                  className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-bold"
                >
                  Confirm Delete Client
                </button>
                <button
                  onClick={() => setConfirmDeleteClient(null)}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteClient(activeClientId)}
                className="px-3.5 py-2 rounded-xl bg-rose-900/50 hover:bg-rose-800/70 border border-rose-700 text-rose-200 text-xs font-semibold"
              >
                Delete Active Client Data
              </button>
            )}

            {onDeleteEntireAccountData && (
              <button
                onClick={() => onDeleteEntireAccountData()}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950 border border-rose-800/60 text-rose-300 text-xs font-semibold"
              >
                Delete All My Account Data
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 4. ACCURACY TEST, PUBLIC API v1 KEYS & DELETE MY DATA PANEL (PARTS 5.5, 6, 9.3)
// ============================================================================

export interface AccuracyAndApiPanelProps {
  bills: any[];
  apiKeys: UserApiKeyRecord[];
  isLoggedIn?: boolean;
  onGenerateApiKey?: (name: string) => Promise<{ rawKey: string; record: UserApiKeyRecord } | null>;
  onCreateApiKey?: (name: string) => Promise<{ rawKey: string; record: UserApiKeyRecord }>;
  onRevokeApiKey: (keyId: string, keyHash?: string) => Promise<void>;
  onDeleteAllUserData?: () => Promise<void>;
  onNavigateToApiDocs?: () => void;
  showToast?: (msg: string) => void;
}

export const AccuracyAndApiPanel: React.FC<AccuracyAndApiPanelProps> = ({
  bills,
  apiKeys,
  onGenerateApiKey,
  onCreateApiKey,
  onRevokeApiKey,
  onDeleteAllUserData,
  onNavigateToApiDocs,
  showToast,
}) => {
  const [groundTruthRows, setGroundTruthRows] = useState<AccuracyGroundTruthRow[]>([]);
  const [gtError, setGtError] = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  const [justCreatedRawKey, setJustCreatedRawKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  const handleUploadGroundTruth = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGtError('');
    const buf = await file.arrayBuffer();
    const parsed = parseGroundTruthExcel(buf);
    if (parsed.error) {
      setGtError(parsed.error);
    } else {
      setGroundTruthRows(parsed.rows);
      if (showToast) showToast(`Loaded ${parsed.rows.length} ground-truth rows.`);
    }
    e.target.value = '';
  };

  const handleLoadGroundTruthFromCurrentBills = () => {
    setGtError('');
    const rows: AccuracyGroundTruthRow[] = bills.map((b) => ({
      fileName: b.fileName || '',
      invoiceNumber: b.invoiceNumber || '',
      billDate: b.billDate || '',
      sellerGstin: b.sellerGstin || '',
      subtotal: Number(b.subtotal) || 0,
      taxAmount: Number(b.taxAmount) || 0,
      grandTotal: Number(b.grandTotal) || 0,
    }));
    setGroundTruthRows(rows);
  };

  const handleDownloadGroundTruthTemplate = () => {
    const sampleRows =
      bills.length > 0
        ? bills.map((b) => ({
            FileName: b.fileName || 'sample.pdf',
            InvoiceNumber: b.invoiceNumber || '',
            BillDate: b.billDate || '',
            SellerGSTIN: b.sellerGstin || '',
            TaxableValue: Number(b.subtotal) || 0,
            TaxAmount: Number(b.taxAmount) || 0,
            GrandTotal: Number(b.grandTotal) || 0,
          }))
        : [
            {
              FileName: 'invoice_01.pdf',
              InvoiceNumber: 'INV-2026-001',
              BillDate: '2026-10-15',
              SellerGSTIN: '27AABCU9603R1ZM',
              TaxableValue: 10000,
              TaxAmount: 1800,
              GrandTotal: 11800,
            },
          ];
    const ws = XLSX.utils.json_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'GroundTruth');
    XLSX.writeFile(wb, 'CASaarthiAI_GroundTruth_Template.xlsx');
  };

  const accuracyReport = useMemo(() => {
    return evaluateExtractionAccuracy(groundTruthRows, bills);
  }, [groundTruthRows, bills]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const creator = onGenerateApiKey || onCreateApiKey;
    if (!creator) return;
    const res = await creator(newKeyName.trim());
    if (res && res.rawKey) {
      setJustCreatedRawKey(res.rawKey);
      setNewKeyName('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Part 5.5: Internal Ground-Truth Accuracy Benchmark Page */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Internal Field-Level Extraction Accuracy Benchmark (Part 5.5)
            </h2>
            <p className="text-xs text-slate-400">
              Upload a ground-truth Excel sheet against your scanned invoices to measure real field-level accuracy (Invoice No, Date, GSTIN, Taxable, Tax, Total) before making any marketing claim.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadGroundTruthTemplate}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
            >
              Download Ground-Truth Template (.xlsx)
            </button>
            <label className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              Upload Ground-Truth Excel
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleUploadGroundTruth}
                className="hidden"
              />
            </label>
            {bills.length > 0 && (
              <button
                onClick={handleLoadGroundTruthFromCurrentBills}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-slate-700"
              >
                Use Current Bills as Baseline ({bills.length})
              </button>
            )}
            <button
              onClick={() =>
                exportAccuracyReportToExcel(accuracyReport.rows, accuracyReport.fieldAccuracy)
              }
              disabled={accuracyReport.rows.length === 0}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export Accuracy Report (.xlsx)
            </button>
          </div>
        </div>

        {gtError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-700 text-rose-200 text-xs">
            {gtError}
          </div>
        )}

        {accuracyReport.rows.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'Invoice No', val: accuracyReport.fieldAccuracy.invoiceNumber },
                { label: 'Invoice Date', val: accuracyReport.fieldAccuracy.billDate },
                { label: 'Seller GSTIN', val: accuracyReport.fieldAccuracy.sellerGstin },
                { label: 'Taxable Value', val: accuracyReport.fieldAccuracy.subtotal },
                { label: 'Tax Amount', val: accuracyReport.fieldAccuracy.taxAmount },
                { label: 'Grand Total', val: accuracyReport.fieldAccuracy.grandTotal },
                { label: 'Overall Score', val: accuracyReport.fieldAccuracy.overall },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-[11px] text-slate-400">{m.label}</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{m.val}%</div>
                </div>
              ))}
            </div>

            <div className="border border-slate-800 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="py-2 px-3">File / Invoice</th>
                    <th className="py-2 px-3">Inv No Match</th>
                    <th className="py-2 px-3">Date Match</th>
                    <th className="py-2 px-3">GSTIN Match</th>
                    <th className="py-2 px-3">Taxable Match</th>
                    <th className="py-2 px-3">Tax Match</th>
                    <th className="py-2 px-3">Total Match</th>
                    <th className="py-2 px-3">Row Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {accuracyReport.rows.map((r, i) => (
                    <tr key={i}>
                      <td className="py-2 px-3 font-mono text-white">
                        {r.fileName} ({r.fields.invoiceNumber.expected})
                      </td>
                      <td className="py-2 px-3">
                        {r.fields.invoiceNumber.match ? '✅' : `❌ (${r.fields.invoiceNumber.actual})`}
                      </td>
                      <td className="py-2 px-3">
                        {r.fields.billDate.match ? '✅' : `❌ (${r.fields.billDate.actual})`}
                      </td>
                      <td className="py-2 px-3">
                        {r.fields.sellerGstin.match ? '✅' : `❌ (${r.fields.sellerGstin.actual})`}
                      </td>
                      <td className="py-2 px-3">
                        {r.fields.subtotal.match ? '✅' : `❌ (${r.fields.subtotal.actual})`}
                      </td>
                      <td className="py-2 px-3">
                        {r.fields.taxAmount.match ? '✅' : `❌ (${r.fields.taxAmount.actual})`}
                      </td>
                      <td className="py-2 px-3">
                        {r.fields.grandTotal.match ? '✅' : `❌ (${r.fields.grandTotal.actual})`}
                      </td>
                      <td className="py-2 px-3 font-bold text-indigo-300 font-mono">
                        {r.rowScorePercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Part 6: Public API Keys Settings (SHA-256 Hashed Keys) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              Developer API Keys — <code className="text-indigo-300">POST /api/v1/extract</code>
            </h2>
            <p className="text-xs text-slate-400">
              Generate per-user API keys for programmatic invoice extraction. Only the SHA-256 hash (<code className="text-slate-300">keyHash</code>) is stored in Firestore.
            </p>
          </div>
          {onNavigateToApiDocs && (
            <button
              onClick={onNavigateToApiDocs}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Interactive API Documentation
            </button>
          )}
        </div>

        <form onSubmit={handleCreateKey} className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            required
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key label (e.g. Tally Connector Script, ERP Webhook)"
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs w-72"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Generate New API Key
          </button>
        </form>

        {justCreatedRawKey && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/60 space-y-2">
            <div className="text-xs font-bold text-emerald-300">
              Copy your new API key now — for security, only its SHA-256 hash is stored and it will not be shown again:
            </div>
            <div className="flex items-center gap-2">
              <code className="px-3 py-1.5 rounded bg-slate-950 text-emerald-300 font-mono text-xs select-all">
                {justCreatedRawKey}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(justCreatedRawKey);
                  setCopiedKey(true);
                  setTimeout(() => setCopiedKey(false), 2000);
                }}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedKey ? 'Copied!' : 'Copy Key'}
              </button>
              <button
                onClick={() => setJustCreatedRawKey(null)}
                className="text-xs text-slate-400 hover:text-white ml-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="py-2 px-3">Key Name</th>
                <th className="py-2 px-3">Prefix</th>
                <th className="py-2 px-3">SHA-256 Hash (First 16 chars)</th>
                <th className="py-2 px-3">Created</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-400">
                    No API keys generated yet.
                  </td>
                </tr>
              ) : (
                apiKeys.map((k) => {
                  const isActive = !k.revoked && k.status !== 'revoked';
                  return (
                    <tr key={k.id}>
                      <td className="py-2.5 px-3 font-semibold text-white">{k.name || k.label}</td>
                      <td className="py-2.5 px-3 font-mono text-indigo-300">{k.keyPrefix}...</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{k.keyHash.slice(0, 16)}…</td>
                      <td className="py-2.5 px-3 text-slate-400">{k.createdAt.slice(0, 10)}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {isActive ? 'active' : 'revoked'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {isActive && (
                          <button
                            onClick={() => onRevokeApiKey(k.id, k.keyHash)}
                            className="text-rose-400 hover:text-rose-300 font-semibold"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 9.3: Self-Service Account Data Deletion ("Delete my data") */}
      {onDeleteAllUserData && (
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-800/50 space-y-3">
          <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete My Data — Self-Service Account Purge (Part 9.3)
          </h3>
          <p className="text-xs text-slate-300">
            Permanently delete all clients, scanned invoices, documents, team records, and API keys stored under your account in Firestore and local storage.
          </p>
          <div>
            {confirmDeleteAccount ? (
              <div className="inline-flex items-center gap-2 bg-rose-950/60 px-3 py-2 rounded-xl border border-rose-600">
                <span className="text-xs text-rose-200 font-semibold">
                  Are you sure? This will permanently erase all your workspaces and bills:
                </span>
                <button
                  onClick={async () => {
                    await onDeleteAllUserData();
                    setConfirmDeleteAccount(false);
                  }}
                  className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Confirm Delete All My Data
                </button>
                <button
                  onClick={() => setConfirmDeleteAccount(false)}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteAccount(true)}
                className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold"
              >
                Delete My Data (Purge All Workspaces &amp; Bills)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
