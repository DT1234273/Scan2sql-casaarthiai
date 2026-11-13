import * as XLSX from 'xlsx';
import type { NoSQLBillRecord } from './App';
import { validateIndianGstin } from './caValidation';
import type { TallySettings } from './caWorkspaceTypes';

export interface TallyBillValidationIssue {
  billId: string;
  invoiceNumber: string;
  shopName: string;
  billDate: string;
  grandTotal: number;
  reasons: string[];
  canSkip: boolean;
}

export function escapeXml(unsafe: string | number | undefined | null): string {
  const str = String(unsafe ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function formatTallyDateYYYYMMDD(dateInput: string): string {
  const raw = (dateInput || '').trim();
  // Match YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${y}${m}${d}`;
  }
  // Match DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = dmyMatch[3];
    return `${y}${m}${d}`;
  }
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export function formatBusyDateDDMMYYYY(dateInput: string): string {
  const ymd = formatTallyDateYYYYMMDD(dateInput);
  return `${ymd.slice(6, 8)}-${ymd.slice(4, 6)}-${ymd.slice(0, 4)}`;
}

export function validateBillsForTallyExport(
  bills: NoSQLBillRecord[],
  settings: TallySettings
): {
  validBills: NoSQLBillRecord[];
  blockedIssues: TallyBillValidationIssue[];
} {
  const validBills: NoSQLBillRecord[] = [];
  const blockedIssues: TallyBillValidationIssue[] = [];

  for (const bill of bills) {
    const reasons: string[] = [];

    if (!bill.invoiceNumber || !bill.invoiceNumber.trim()) {
      reasons.push('Missing Invoice Number');
    }

    if (!bill.billDate || !bill.billDate.trim()) {
      reasons.push('Missing Invoice Date');
    } else {
      const hasValidFormat =
        /^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(bill.billDate.trim()) ||
        /^\d{1,2}[-/]\d{1,2}[-/]\d{4}/.test(bill.billDate.trim());
      if (!hasValidFormat) {
        reasons.push(`Unrecognized Date Format ("${bill.billDate}")`);
      }
    }

    if (bill.sellerGstin && bill.sellerGstin.trim().length > 0) {
      const gstCheck = validateIndianGstin(bill.sellerGstin);
      if (!gstCheck.isValid) {
        reasons.push(`Invalid Seller GSTIN (${gstCheck.message})`);
      }
    }

    const sub = Number(bill.subtotal) || 0;
    const cgst = Number(bill.cgstAmount) || 0;
    const sgst = Number(bill.sgstAmount) || 0;
    const igst = Number(bill.igstAmount) || 0;
    const totalTax = Number(bill.taxAmount) || Number((cgst + sgst + igst).toFixed(2));
    const disc = Number(bill.discountAmount) || 0;
    const otherCharges = Number(bill.extraHeaderFields?.otherCharges || (bill as any).otherCharges || 0);
    const grand = Number(bill.grandTotal) || 0;

    const expectedGrand = Number((sub + totalTax + otherCharges - disc).toFixed(2));
    const diff = Number(Math.abs(grand - expectedGrand).toFixed(2));
    if (grand <= 0) {
      reasons.push('Grand Total is zero or negative');
    } else if (diff > 2.0) {
      reasons.push(
        `Tax Math Mismatch: Taxable (₹${sub.toFixed(2)}) + Tax (₹${totalTax.toFixed(2)}) = ₹${expectedGrand.toFixed(2)}, but Grand Total is ₹${grand.toFixed(2)} (Diff: ₹${diff.toFixed(2)})`
      );
    }

    const approvalStatus = (bill as any).approvalStatus || 'approved';
    if (settings.onlyExportApprovedBills && approvalStatus !== 'approved') {
      reasons.push(`Bill status is "${approvalStatus}" (Only Approved bills enabled)`);
    }

    if (reasons.length > 0) {
      blockedIssues.push({
        billId: bill.id,
        invoiceNumber: bill.invoiceNumber || '(No Invoice No)',
        shopName: bill.shopName || 'Unnamed Supplier',
        billDate: bill.billDate || '(No Date)',
        grandTotal: grand,
        reasons,
        canSkip: true,
      });
    } else {
      validBills.push(bill);
    }
  }

  return { validBills, blockedIssues };
}

/**
 * Generates TallyPrime-importable XML adhering strictly to Tally XML Schema:
 * ENVELOPE > HEADER (TALLYREQUEST Import Data) > BODY > IMPORTDATA >
 * REQUESTDESC (REPORTNAME Vouchers, STATICVARIABLES SVCURRENTCOMPANY) >
 * REQUESTDATA > TALLYMESSAGE > VOUCHER VCHTYPE="Purchase" ACTION="Create"
 *
 * Sign conventions in Tally XML:
 * - DEBIT entry: <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE> and <AMOUNT>-100.00</AMOUNT>
 * - CREDIT entry: <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE> and <AMOUNT>100.00</AMOUNT>
 */
export function generateTallyPrimeXml(bills: NoSQLBillRecord[], settings: TallySettings): string {
  const vchType = settings.defaultVoucherType?.trim() || 'Purchase';
  const companyName = settings.companyName?.trim() || 'LedgerSutra Client Books';
  const purchaseLedger = settings.purchaseLedgerName?.trim() || 'Purchase Account';
  const cgstLedger = settings.cgstLedgerName?.trim() || 'Input CGST';
  const sgstLedger = settings.sgstLedgerName?.trim() || 'Input SGST';
  const igstLedger = settings.igstLedgerName?.trim() || 'Input IGST';
  const roundOffLedger = settings.roundOffLedgerName?.trim() || 'Round Off';
  const otherChargesLedger = settings.otherChargesLedgerName?.trim() || 'Freight & Other Charges';

  const xmlLines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<ENVELOPE>',
    '  <HEADER>',
    '    <TALLYREQUEST>Import Data</TALLYREQUEST>',
    '  </HEADER>',
    '  <BODY>',
    '    <IMPORTDATA>',
    '      <REQUESTDESC>',
    '        <REPORTNAME>Vouchers</REPORTNAME>',
    '        <STATICVARIABLES>',
    `          <SVCURRENTCOMPANY>${escapeXml(companyName)}</SVCURRENTCOMPANY>`,
    '        </STATICVARIABLES>',
    '      </REQUESTDESC>',
    '      <REQUESTDATA>',
  ];

  // Optional: Auto-create missing Party Ledgers & Tax Ledgers
  if (settings.autoCreateMissingPartyLedgers) {
    const uniqueSuppliers = new Map<string, { name: string; gstin: string; stateName: string }>();
    for (const bill of bills) {
      const partyName = (bill.shopName || 'Sundry Creditor').trim();
      if (!uniqueSuppliers.has(partyName.toUpperCase())) {
        const gstCheck = validateIndianGstin(bill.sellerGstin);
        uniqueSuppliers.set(partyName.toUpperCase(), {
          name: partyName,
          gstin: gstCheck.normalized || (bill.sellerGstin || '').trim(),
          stateName: gstCheck.stateName || bill.placeOfSupply || '',
        });
      }
    }

    // Standard Purchase & Tax Ledgers
    const systemLedgers: Array<{ name: string; parent: string }> = [
      { name: purchaseLedger, parent: 'Purchase Accounts' },
      { name: cgstLedger, parent: 'Duties & Taxes' },
      { name: sgstLedger, parent: 'Duties & Taxes' },
      { name: igstLedger, parent: 'Duties & Taxes' },
      { name: roundOffLedger, parent: 'Indirect Expenses' },
      { name: otherChargesLedger, parent: 'Indirect Expenses' },
    ];

    for (const sysLed of systemLedgers) {
      xmlLines.push(
        '        <TALLYMESSAGE xmlns:UDF="TallyUDF">',
        `          <LEDGER NAME="${escapeXml(sysLed.name)}" ACTION="Create">`,
        '            <NAME.LIST>',
        `              <NAME>${escapeXml(sysLed.name)}</NAME>`,
        '            </NAME.LIST>',
        `            <PARENT>${escapeXml(sysLed.parent)}</PARENT>`,
        '            <ISBILLWISEON>No</ISBILLWISEON>',
        '          </LEDGER>',
        '        </TALLYMESSAGE>'
      );
    }

    for (const supplier of uniqueSuppliers.values()) {
      const regType = supplier.gstin.length === 15 ? 'Regular' : 'Unregistered';
      xmlLines.push(
        '        <TALLYMESSAGE xmlns:UDF="TallyUDF">',
        `          <LEDGER NAME="${escapeXml(supplier.name)}" ACTION="Create">`,
        '            <NAME.LIST>',
        `              <NAME>${escapeXml(supplier.name)}</NAME>`,
        '            </NAME.LIST>',
        '            <PARENT>Sundry Creditors</PARENT>',
        '            <ISBILLWISEON>Yes</ISBILLWISEON>',
        `            <GSTREGISTRATIONTYPE>${regType}</GSTREGISTRATIONTYPE>`,
        supplier.gstin ? `            <PARTYGSTIN>${escapeXml(supplier.gstin)}</PARTYGSTIN>` : '',
        supplier.stateName ? `            <LEDSTATENAME>${escapeXml(supplier.stateName)}</LEDSTATENAME>` : '',
        '          </LEDGER>',
        '        </TALLYMESSAGE>'
      );
    }
  }

  // Generate Voucher Messages
  bills.forEach((bill, idx) => {
    const tallyDate = formatTallyDateYYYYMMDD(bill.billDate);
    const partyName = (bill.shopName || 'Cash / Sundry Creditor').trim();
    const invoiceNo = (bill.invoiceNumber || `VCH-${idx + 1}`).trim();
    const gstCheck = validateIndianGstin(bill.sellerGstin);
    const partyGstin = gstCheck.normalized || (bill.sellerGstin || '').trim();
    const stateName = gstCheck.stateName || bill.placeOfSupply || '';

    const subtotal = Number((Number(bill.subtotal) || 0).toFixed(2));
    let cgst = Number((Number(bill.cgstAmount) || 0).toFixed(2));
    let sgst = Number((Number(bill.sgstAmount) || 0).toFixed(2));
    let igst = Number((Number(bill.igstAmount) || 0).toFixed(2));
    const rawTax = Number((Number(bill.taxAmount) || 0).toFixed(2));

    // If only total tax was populated without split, split into CGST + SGST equally
    if (cgst === 0 && sgst === 0 && igst === 0 && rawTax > 0) {
      cgst = Number((rawTax / 2).toFixed(2));
      sgst = Number((rawTax - cgst).toFixed(2));
    }

    const otherCharges = Number(
      (Number(bill.extraHeaderFields?.otherCharges || (bill as any).otherCharges || 0) || 0).toFixed(2)
    );
    const discount = Number((Number(bill.discountAmount) || 0).toFixed(2));
    const grandTotal = Number((Number(bill.grandTotal) || 0).toFixed(2));

    const netTaxableDebit = Number(Math.max(0, subtotal - discount).toFixed(2));
    const sumDebitsBeforeRound = Number((netTaxableDebit + cgst + sgst + igst + otherCharges).toFixed(2));
    // Round-off = grandTotal - sumDebitsBeforeRound
    // If positive, we need an extra DEBIT of roundOff so total Debits == Party Credit (grandTotal)
    // If negative, we need a CREDIT of |roundOff|
    const computedRoundOff = Number((grandTotal - sumDebitsBeforeRound).toFixed(2));

    const itemSummary =
      bill.items && bill.items.length > 0
        ? bill.items.map((i) => `${i.itemName} (${i.quantity} ${i.unit || 'NOS'})`).join(', ')
        : 'Purchase Bill';
    const narration = `Being purchase recorded against Invoice No. ${invoiceNo} dtd ${bill.billDate} from ${partyName}. Items: ${itemSummary.slice(0, 220)}`;

    xmlLines.push(
      '        <TALLYMESSAGE xmlns:UDF="TallyUDF">',
      `          <VOUCHER VCHTYPE="${escapeXml(vchType)}" ACTION="Create" OBJVIEW="Accounting Voucher View">`,
      `            <DATE>${tallyDate}</DATE>`,
      `            <EFFECTIVEDATE>${tallyDate}</EFFECTIVEDATE>`,
      `            <VOUCHERTYPENAME>${escapeXml(vchType)}</VOUCHERTYPENAME>`,
      `            <VOUCHERNUMBER>${escapeXml(invoiceNo)}</VOUCHERNUMBER>`,
      `            <REFERENCE>${escapeXml(invoiceNo)}</REFERENCE>`,
      `            <REFERENCEDATE>${tallyDate}</REFERENCEDATE>`,
      `            <PARTYLEDGERNAME>${escapeXml(partyName)}</PARTYLEDGERNAME>`,
      `            <PARTYNAME>${escapeXml(partyName)}</PARTYNAME>`,
      partyGstin ? `            <PARTYGSTIN>${escapeXml(partyGstin)}</PARTYGSTIN>` : '',
      stateName ? `            <STATENAME>${escapeXml(stateName)}</STATENAME>` : '',
      stateName ? `            <PLACEOFSUPPLY>${escapeXml(stateName)}</PLACEOFSUPPLY>` : '',
      `            <NARRATION>${escapeXml(narration)}</NARRATION>`,
      '            <ISINVOICE>No</ISINVOICE>',
      '            <PERSISTEDVIEW>Accounting Voucher View</PERSISTEDVIEW>',
      '',
      '            <!-- 1. Party Ledger Entry (CREDIT: ISDEEMEDPOSITIVE=No, Positive Amount) -->',
      '            <ALLLEDGERENTRIES.LIST>',
      `              <LEDGERNAME>${escapeXml(partyName)}</LEDGERNAME>`,
      '              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>',
      '              <ISPARTYLEDGER>Yes</ISPARTYLEDGER>',
      `              <AMOUNT>${grandTotal.toFixed(2)}</AMOUNT>`,
      '              <BILLALLOCATIONS.LIST>',
      `                <NAME>${escapeXml(invoiceNo)}</NAME>`,
      '                <BILLTYPE>New Ref</BILLTYPE>',
      `                <AMOUNT>${grandTotal.toFixed(2)}</AMOUNT>`,
      '              </BILLALLOCATIONS.LIST>',
      '            </ALLLEDGERENTRIES.LIST>',
      '',
      '            <!-- 2. Purchase Ledger Entry (DEBIT: ISDEEMEDPOSITIVE=Yes, Negative Amount) -->',
      '            <ALLLEDGERENTRIES.LIST>',
      `              <LEDGERNAME>${escapeXml(purchaseLedger)}</LEDGERNAME>`,
      '              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>',
      '              <ISPARTYLEDGER>No</ISPARTYLEDGER>',
      `              <AMOUNT>-${netTaxableDebit.toFixed(2)}</AMOUNT>`,
      '            </ALLLEDGERENTRIES.LIST>'
    );

    if (cgst > 0) {
      xmlLines.push(
        '            <ALLLEDGERENTRIES.LIST>',
        `              <LEDGERNAME>${escapeXml(cgstLedger)}</LEDGERNAME>`,
        '              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>',
        '              <ISPARTYLEDGER>No</ISPARTYLEDGER>',
        `              <AMOUNT>-${cgst.toFixed(2)}</AMOUNT>`,
        '            </ALLLEDGERENTRIES.LIST>'
      );
    }

    if (sgst > 0) {
      xmlLines.push(
        '            <ALLLEDGERENTRIES.LIST>',
        `              <LEDGERNAME>${escapeXml(sgstLedger)}</LEDGERNAME>`,
        '              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>',
        '              <ISPARTYLEDGER>No</ISPARTYLEDGER>',
        `              <AMOUNT>-${sgst.toFixed(2)}</AMOUNT>`,
        '            </ALLLEDGERENTRIES.LIST>'
      );
    }

    if (igst > 0) {
      xmlLines.push(
        '            <ALLLEDGERENTRIES.LIST>',
        `              <LEDGERNAME>${escapeXml(igstLedger)}</LEDGERNAME>`,
        '              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>',
        '              <ISPARTYLEDGER>No</ISPARTYLEDGER>',
        `              <AMOUNT>-${igst.toFixed(2)}</AMOUNT>`,
        '            </ALLLEDGERENTRIES.LIST>'
      );
    }

    if (otherCharges > 0) {
      xmlLines.push(
        '            <ALLLEDGERENTRIES.LIST>',
        `              <LEDGERNAME>${escapeXml(otherChargesLedger)}</LEDGERNAME>`,
        '              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>',
        '              <ISPARTYLEDGER>No</ISPARTYLEDGER>',
        `              <AMOUNT>-${otherCharges.toFixed(2)}</AMOUNT>`,
        '            </ALLLEDGERENTRIES.LIST>'
      );
    }

    if (Math.abs(computedRoundOff) >= 0.01) {
      const isDebitRoundOff = computedRoundOff > 0;
      xmlLines.push(
        '            <ALLLEDGERENTRIES.LIST>',
        `              <LEDGERNAME>${escapeXml(roundOffLedger)}</LEDGERNAME>`,
        `              <ISDEEMEDPOSITIVE>${isDebitRoundOff ? 'Yes' : 'No'}</ISDEEMEDPOSITIVE>`,
        '              <ISPARTYLEDGER>No</ISPARTYLEDGER>',
        `              <AMOUNT>${isDebitRoundOff ? `-${Math.abs(computedRoundOff).toFixed(2)}` : Math.abs(computedRoundOff).toFixed(2)}</AMOUNT>`,
        '            </ALLLEDGERENTRIES.LIST>'
      );
    }

    xmlLines.push('          </VOUCHER>', '        </TALLYMESSAGE>');
  });

  xmlLines.push(
    '      </REQUESTDATA>',
    '    </IMPORTDATA>',
    '  </BODY>',
    '</ENVELOPE>'
  );

  return xmlLines.filter((line) => line !== '').join('\r\n');
}

export function downloadTallyPrimeXml(
  bills: NoSQLBillRecord[],
  settings: TallySettings,
  filename = `LedgerSutra_TallyPrime_Vouchers_${new Date().toISOString().slice(0, 10)}.xml`
): void {
  const xml = generateTallyPrimeXml(bills, settings);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Zoho Books Bills Import CSV
 * Documented Column Mapping:
 * Bill Number, Bill Date, Due Date, Vendor Name, Vendor GSTIN, GST Treatment,
 * Source of Supply, Destination of Supply, Item Name, HSN/SAC, Account,
 * Quantity, Rate, Discount, Tax Name, Tax Percentage, CGST Amount, SGST Amount, IGST Amount,
 * Item Total, Currency Code, Notes
 */
export const ZOHO_BOOKS_COLUMN_MAPPING_DOCS = [
  { column: 'Bill Number', source: 'invoiceNumber', description: 'Supplier Tax Invoice Number' },
  { column: 'Bill Date', source: 'billDate (YYYY-MM-DD)', description: 'Invoice Date' },
  { column: 'Due Date', source: 'dueDate || billDate', description: 'Payment Due Date' },
  { column: 'Vendor Name', source: 'shopName', description: 'Supplier / Party Name' },
  { column: 'Vendor GSTIN', source: 'sellerGstin', description: '15-char Supplier GSTIN' },
  { column: 'GST Treatment', source: 'Auto (vat_registered / unregistered)', description: 'Zoho GST classification' },
  { column: 'Source of Supply', source: 'Seller State Code', description: '2-letter or State Code from GSTIN' },
  { column: 'Item Name', source: 'item.itemName', description: 'Line item description' },
  { column: 'HSN/SAC', source: 'item.hsnSac', description: 'HSN or SAC code' },
  { column: 'Account', source: 'Purchase Account', description: 'Expense / Purchase Ledger' },
  { column: 'Quantity', source: 'item.quantity', description: 'Billed Quantity' },
  { column: 'Rate', source: 'item.unitPrice', description: 'Unit Price before Tax' },
  { column: 'Tax Percentage', source: 'item.gstRate', description: 'Applicable GST % (e.g. 18)' },
  { column: 'Item Total', source: 'item.lineTotal', description: 'Total line amount' },
];

export function exportZohoBooksCsv(
  bills: NoSQLBillRecord[],
  filename = `LedgerSutra_ZohoBooks_Bills_${new Date().toISOString().slice(0, 10)}.csv`
): void {
  const headers = [
    'Bill Number',
    'Bill Date',
    'Due Date',
    'Vendor Name',
    'Vendor GSTIN',
    'GST Treatment',
    'Source of Supply',
    'Destination of Supply',
    'PurchaseOrder',
    'Item Name',
    'HSN/SAC',
    'Account',
    'Quantity',
    'Usage unit',
    'Rate',
    'Discount',
    'Tax Name',
    'Tax Percentage',
    'CGST Amount',
    'SGST Amount',
    'IGST Amount',
    'Item Total',
    'Currency Code',
    'Notes',
  ];

  const escapeCsv = (val: string | number | undefined): string => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows: string[] = [headers.map(escapeCsv).join(',')];

  for (const bill of bills) {
    const sellerGst = validateIndianGstin(bill.sellerGstin);
    const buyerGst = validateIndianGstin(bill.buyerGstin);
    const gstTreatment = sellerGst.isValid ? 'vat_registered' : 'unregistered';
    const sourceState = sellerGst.stateCode || bill.placeOfSupply || '';
    const destState = buyerGst.stateCode || sourceState || '';
    const dueDate = bill.extraHeaderFields?.dueDate || (bill as any).dueDate || bill.billDate;
    const poNumber = bill.extraHeaderFields?.poNumber || (bill as any).poNumber || '';
    const currency = bill.extraHeaderFields?.currency || (bill as any).currency || 'INR';

    const items =
      bill.items && bill.items.length > 0
        ? bill.items
        : [
            {
              id: `${bill.id}-1`,
              itemName: bill.shopName || 'Purchase Item',
              hsnSac: '',
              quantity: 1,
              unit: 'PCS',
              unitPrice: bill.subtotal,
              discount: bill.discountAmount,
              taxableValue: bill.subtotal,
              gstRate: bill.subtotal > 0 ? Number(((bill.taxAmount / bill.subtotal) * 100).toFixed(0)) : 0,
              cgstAmount: bill.cgstAmount,
              sgstAmount: bill.sgstAmount,
              igstAmount: bill.igstAmount,
              lineTotal: bill.grandTotal,
              extraColumns: {},
            },
          ];

    for (const item of items) {
      const isIgst = (Number(item.igstAmount) || Number(bill.igstAmount)) > 0;
      const gstRate = Number(item.gstRate) || 0;
      const taxName = gstRate > 0 ? (isIgst ? `IGST${gstRate}` : `GST${gstRate}`) : 'Exempt';

      const line = [
        bill.invoiceNumber,
        bill.billDate,
        dueDate,
        bill.shopName,
        sellerGst.normalized || bill.sellerGstin,
        gstTreatment,
        sourceState,
        destState,
        poNumber,
        item.itemName,
        item.hsnSac,
        'Cost of Goods Sold',
        item.quantity || 1,
        item.unit || 'PCS',
        Number(item.unitPrice || item.taxableValue || 0).toFixed(2),
        Number(item.discount || 0).toFixed(2),
        taxName,
        gstRate,
        Number(item.cgstAmount || 0).toFixed(2),
        Number(item.sgstAmount || 0).toFixed(2),
        Number(item.igstAmount || 0).toFixed(2),
        Number(item.lineTotal || bill.grandTotal || 0).toFixed(2),
        currency,
        `Imported from LedgerSutra (${bill.fileName})`,
      ];
      rows.push(line.map(escapeCsv).join(','));
    }
  }

  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Busy Accounting Software Excel Export (.xlsx)
 * Documented Column Mapping for Busy Data Import (Purchase Vouchers):
 */
export const BUSY_EXCEL_COLUMN_MAPPING_DOCS = [
  { column: 'Vch Series', source: 'Main', description: 'Busy Voucher Series Name' },
  { column: 'Vch Date', source: 'billDate (DD-MM-YYYY)', description: 'Voucher Date in DD-MM-YYYY' },
  { column: 'Vch Type', source: 'Purchase', description: 'Busy Voucher Type' },
  { column: 'Purc Type', source: 'L/GST-18% or I/GST-18%', description: 'Local (CGST+SGST) or Central (IGST) Purchase Type' },
  { column: 'Party Name', source: 'shopName', description: 'Supplier Account Master Name' },
  { column: 'Party GSTIN', source: 'sellerGstin', description: '15-char Supplier GSTIN' },
  { column: 'Bill No.', source: 'invoiceNumber', description: 'Original Purchase Bill No.' },
  { column: 'Item Name', source: 'item.itemName', description: 'Item Master Name' },
  { column: 'HSN Code', source: 'item.hsnSac', description: 'HSN/SAC Code' },
  { column: 'Qty / Unit / Price / Amount', source: 'Line Item Fields', description: 'Quantity, UOM, Unit Price & Taxable Amount' },
  { column: 'CGST / SGST / IGST Amt', source: 'Tax Split Fields', description: 'Tax Breakup Columns' },
  { column: 'Total Bill Amt', source: 'grandTotal', description: 'Final Voucher Total' },
];

export function exportBusyCompatibleExcel(
  bills: NoSQLBillRecord[],
  filename = `LedgerSutra_Busy_Purchase_Import_${new Date().toISOString().slice(0, 10)}.xlsx`
): void {
  const busyRows: Record<string, string | number>[] = [];

  for (const bill of bills) {
    const sellerGst = validateIndianGstin(bill.sellerGstin);
    const vchDate = formatBusyDateDDMMYYYY(bill.billDate);
    const isInterState = Number(bill.igstAmount) > 0;
    const effRate =
      bill.subtotal > 0 ? Math.round((Number(bill.taxAmount) / Number(bill.subtotal)) * 100) : 18;
    const purcType =
      Number(bill.taxAmount) > 0
        ? `${isInterState ? 'I' : 'L'}/GST-${effRate}%`
        : 'Exempt';

    const items =
      bill.items && bill.items.length > 0
        ? bill.items
        : [
            {
              id: `${bill.id}-1`,
              itemName: bill.shopName || 'General Purchase',
              hsnSac: '',
              quantity: 1,
              unit: 'PCS',
              unitPrice: bill.subtotal,
              discount: bill.discountAmount,
              taxableValue: bill.subtotal,
              gstRate: effRate,
              cgstAmount: bill.cgstAmount,
              sgstAmount: bill.sgstAmount,
              igstAmount: bill.igstAmount,
              lineTotal: bill.grandTotal,
              extraColumns: {},
            },
          ];

    items.forEach((item) => {
      busyRows.push({
        'Vch Series': 'Main',
        'Vch Date': vchDate,
        'Vch Type': 'Purchase',
        'Purc Type': purcType,
        'Party Name': bill.shopName,
        'Party GSTIN': sellerGst.normalized || bill.sellerGstin,
        'Party State': sellerGst.stateName || bill.placeOfSupply || '',
        'Bill No.': bill.invoiceNumber,
        'Bill Date': vchDate,
        'Item Name': item.itemName,
        'HSN Code': item.hsnSac || '',
        Qty: Number(item.quantity) || 1,
        Unit: item.unit || 'PCS',
        Price: Number(item.unitPrice || item.taxableValue || 0),
        'Taxable Amount': Number(item.taxableValue || bill.subtotal || 0),
        'CGST %': isInterState ? 0 : (Number(item.gstRate) || effRate) / 2,
        'CGST Amt': Number(item.cgstAmount || bill.cgstAmount || 0),
        'SGST %': isInterState ? 0 : (Number(item.gstRate) || effRate) / 2,
        'SGST Amt': Number(item.sgstAmount || bill.sgstAmount || 0),
        'IGST %': isInterState ? Number(item.gstRate) || effRate : 0,
        'IGST Amt': Number(item.igstAmount || bill.igstAmount || 0),
        'Total Bill Amt': Number(item.lineTotal || bill.grandTotal || 0),
        Narration: `Imported via LedgerSutra from ${bill.fileName}`,
      });
    });
  }

  const wb = XLSX.utils.book_new();
  const wsData = XLSX.utils.json_to_sheet(busyRows);
  XLSX.utils.book_append_sheet(wb, wsData, 'Busy_Purchase_Vouchers');

  const wsMapping = XLSX.utils.json_to_sheet(BUSY_EXCEL_COLUMN_MAPPING_DOCS);
  XLSX.utils.book_append_sheet(wb, wsMapping, 'Column_Mapping_Guide');

  XLSX.writeFile(wb, filename);
}
