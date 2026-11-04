import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import jsQR from 'jsqr';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  FileText,
  CheckCircle2,
  Search,
  Download,
  Trash2,
  Plus,
  Eye,
  RefreshCw,
  Database,
  LayoutDashboard,
  FileSpreadsheet,
  ScanLine,
  Check,
  X,
  Upload,
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  QrCode,
  Camera,
  CameraOff,
  ChevronLeft,
  Columns,
  Layers,
  FilePlus2,
  Copy,
  Code2,
  UserCheck,
  Briefcase,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import {
  SAMPLE_TEST_FILES,
  SampleTestFileSpec,
  generateSampleTestFile,
  downloadSampleTestFile,
} from './sampleTestFiles';
import {
  auditBillDraftOrRecord,
  computeSupplierSummary,
  exportMasterRowsToCsv,
  exportBillsToJsonFile,
  exportBillsToSqlFile,
} from './caValidation';
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  normalizePathname,
  syncDocumentSeoTags,
} from './seoContent';
import {
  LedgerSutraHeroBanner,
  LedgerSutraHomepageSections,
  LedgerSutraRouteView,
  LedgerSutraFooter,
} from './components/LedgerSutraMarketing';

// Configure PDF.js worker for browser rendering & coordinate text extraction
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

// ---------------------------------------------------------------------------
// Types & Dynamic Schema Interfaces
// ---------------------------------------------------------------------------
type DocType = 'NORMAL_DOCUMENT' | 'SHOP_BILL';
type UserProfileMode = 'normal_user' | 'ca_mode';

export interface NoSQLBillItem {
  id: string;
  itemName: string;
  hsnSac: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  taxableValue: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  lineTotal: number;
  /** Dynamic columns that appear in specific bills (e.g. Batch No, Expiry, MRP) */
  extraColumns: Record<string, string>;
}

export interface NoSQLBillRecord {
  id: string;
  fileName: string;
  shopName: string;
  sellerGstin: string;
  buyerName: string;
  buyerGstin: string;
  invoiceNumber: string;
  billDate: string;
  placeOfSupply: string;
  voucherType: string;
  paymentMode: string;
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  confidence: number;
  rawText: string;
  createdAt: string;
  extraHeaderFields: Record<string, string>;
  items: NoSQLBillItem[];
}

export interface SavedDocumentRecord {
  id: string;
  fileName: string;
  fileType: string;
  docType: DocType;
  pageCount: number;
  ocrLanguage: string;
  extractedText: string;
  confidence: number;
  createdAt: string;
}

export interface ColumnDefinition {
  key: string;
  label: string;
  category: 'HEADER' | 'ITEM' | 'DYNAMIC_HEADER' | 'DYNAMIC_ITEM' | 'MULTI_PRODUCT';
  isNumeric?: boolean;
}

// Base Columns — Notice fileName ("Bill / File Name"), billDate, invoiceNumber, shopName, and grandTotal ("Total Cost") are core!
const STANDARD_COLUMNS: ColumnDefinition[] = [
  { key: 'fileName', label: 'Bill / File Name', category: 'HEADER' },
  { key: 'billDate', label: 'Bill Date', category: 'HEADER' },
  { key: 'invoiceNumber', label: 'Bill / Invoice No', category: 'HEADER' },
  { key: 'shopName', label: 'Shop / Party Name', category: 'HEADER' },
  { key: 'sellerGstin', label: 'Seller GSTIN', category: 'HEADER' },
  { key: 'buyerName', label: 'Buyer Name', category: 'HEADER' },
  { key: 'buyerGstin', label: 'Buyer GSTIN', category: 'HEADER' },
  { key: 'placeOfSupply', label: 'Place of Supply', category: 'HEADER' },
  { key: 'voucherType', label: 'Bill Category / Type', category: 'HEADER' },
  { key: 'paymentMode', label: 'Payment Mode', category: 'HEADER' },
  { key: 'itemName', label: 'Item Summary / Description', category: 'ITEM' },
  { key: 'hsnSac', label: 'HSN / SAC', category: 'ITEM' },
  { key: 'quantity', label: 'Total Qty', category: 'ITEM', isNumeric: true },
  { key: 'unit', label: 'Unit (UOM)', category: 'ITEM' },
  { key: 'unitPrice', label: 'Rate', category: 'ITEM', isNumeric: true },
  { key: 'discount', label: 'Discount', category: 'ITEM', isNumeric: true },
  { key: 'taxableValue', label: 'Taxable Value', category: 'ITEM', isNumeric: true },
  { key: 'gstRate', label: 'GST %', category: 'ITEM', isNumeric: true },
  { key: 'cgstAmount', label: 'CGST Amt', category: 'ITEM', isNumeric: true },
  { key: 'sgstAmount', label: 'SGST Amt', category: 'ITEM', isNumeric: true },
  { key: 'igstAmount', label: 'IGST Amt', category: 'ITEM', isNumeric: true },
  { key: 'taxAmount', label: 'Total Tax / GST', category: 'HEADER', isNumeric: true },
  { key: 'grandTotal', label: 'Total Cost / Grand Total', category: 'HEADER', isNumeric: true },
];

// Normal User Preset: 1 row per bill, showing Which Bill, Date, Shop Name, Bill No, and Total Cost!
// (And if a bill has multiple products like grocery shopping, Product 1, Product 2... columns auto-expand!)
const NORMAL_USER_PRESET_KEYS = [
  'fileName',
  'billDate',
  'invoiceNumber',
  'shopName',
  'grandTotal',
];

// CA GST Summary Preset (1 Row per Bill with full GST & Bill Details)
const CA_SUMMARY_PRESET_KEYS = [
  'fileName',
  'billDate',
  'invoiceNumber',
  'shopName',
  'sellerGstin',
  'buyerGstin',
  'taxableValue',
  'cgstAmount',
  'sgstAmount',
  'igstAmount',
  'grandTotal',
];

// CA Detailed Audit Preset
const CA_GST_PRESET_KEYS = [
  'fileName',
  'billDate',
  'invoiceNumber',
  'shopName',
  'sellerGstin',
  'itemName',
  'hsnSac',
  'quantity',
  'unitPrice',
  'taxableValue',
  'gstRate',
  'cgstAmount',
  'sgstAmount',
  'igstAmount',
  'grandTotal',
];

const SCANNING_STEPS = [
  { title: 'Rendering Document Pages...', subtitle: 'Preparing clean visual & text layers' },
  { title: 'Extracting Exact Text & Bill Data...', subtitle: 'Reading Bill Name, Date, Items & Total Cost' },
  { title: 'Organizing Columns (Normal User & CA)...', subtitle: 'Expanding product columns only when multiple items exist' },
  { title: 'Finalizing & Merging into Sheet...', subtitle: 'Ready for instant Excel (.xlsx) export' },
];

const STORAGE_KEYS = {
  DOCUMENTS: 'scan2sql_documents_v3',
  BILLS: 'scan2sql_bills_v3',
  SELECTED_COLUMNS: 'scan2sql_selected_columns_v3',
  USER_MODE: 'scan2sql_user_mode_v3',
};

// ---------------------------------------------------------------------------
// High-Precision Coordinate-Aware PDF Text Reconstruction + Image Contrast Enhancer
// ---------------------------------------------------------------------------
function extractCoordinateSortedTextFromPdfItems(items: any[]): string {
  const validItems = items.filter(
    (it) => typeof it.str === 'string' && it.str.length > 0 && Array.isArray(it.transform)
  );
  if (validItems.length === 0) return '';

  interface PdfChunk {
    x: number;
    width: number;
    fontSize: number;
    text: string;
  }

  interface LineBucket {
    y: number;
    fontSize: number;
    chunks: PdfChunk[];
  }
  const lines: LineBucket[] = [];

  for (const item of validItems) {
    const text = String(item.str);
    if (!text.trim() && text.length === 0) continue;
    const x = Number(item.transform[4]) || 0;
    const y = Number(item.transform[5]) || 0;
    const fontSize = Math.max(6, Math.abs(Number(item.transform[0]) || Number(item.height) || 10));
    const width = Number(item.width) > 0 ? Number(item.width) : text.length * fontSize * 0.52;

    // Group items on the same horizontal baseline within 40% of font height
    const tolerance = Math.max(3.5, fontSize * 0.42);
    let bucket = lines.find((b) => Math.abs(b.y - y) <= tolerance);
    if (!bucket) {
      bucket = { y, fontSize, chunks: [] };
      lines.push(bucket);
    }
    bucket.chunks.push({ x, width, fontSize, text });
  }

  // Sort top-to-bottom (descending Y in PDF coordinate space)
  lines.sort((a, b) => b.y - a.y);

  const formattedLines: string[] = [];
  let prevLineY: number | null = null;

  for (const line of lines) {
    line.chunks.sort((a, b) => a.x - b.x);
    let lineStr = '';
    let prevRightX: number | null = null;

    for (const chunk of line.chunks) {
      if (prevRightX !== null) {
        const gap = chunk.x - prevRightX;
        if (gap > chunk.fontSize * 2.4) {
          lineStr += '  |  '; // Clear table column boundary
        } else if (gap > chunk.fontSize * 0.22) {
          if (!lineStr.endsWith(' ') && !chunk.text.startsWith(' ')) {
            lineStr += ' ';
          }
        }
      }
      lineStr += chunk.text;
      prevRightX = chunk.x + chunk.width;
    }

    const trimmed = lineStr.replace(/\s+\|\s+$/g, '').trim();
    if (trimmed) {
      if (prevLineY !== null && prevLineY - line.y > line.fontSize * 2.2) {
        formattedLines.push(''); // Paragraph / section break
      }
      formattedLines.push(trimmed);
      prevLineY = line.y;
    }
  }

  return formattedLines.join('\n');
}

/**
 * Normalizes resolution and boosts text contrast at the pixel level on uploaded images
 * so camera photos of receipts & invoices have crisp, high-contrast characters for OCR.
 */
async function enhanceImageForSharpOcr(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const maxDim = 1800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          const scale = maxDim / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        } else if (w < 800 && h < 800) {
          w = Math.round(w * 1.5);
          h = Math.round(h * 1.5);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        // Pixel-level adaptive contrast enhancement for crisp text
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const contrast = 1.25;
        const intercept = 128 * (1 - contrast);
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, data[i] * contrast + intercept));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * contrast + intercept));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * contrast + intercept));
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Runs Tesseract OCR using Page Segmentation Mode 4 (Single column of text of variable sizes)
 * so large top store headers (e.g. GREEN MART GROCERY, CITY ELECTRONICS) and multi-column
 * item tables on tilted receipts are read without skipping headers or hallucinating line noise.
 */
async function recognizePageTextOptimal(
  imageSource: string,
  lang: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  let worker: Tesseract.Worker | null = null;
  try {
    worker = await Tesseract.createWorker(lang, 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && typeof m.progress === 'number' && onProgress) {
          onProgress(m.progress);
        }
      },
    });
    await worker.setParameters({
      tessedit_pageseg_mode: '4' as any,
    });
    const { data } = await worker.recognize(imageSource);
    const text = data?.text ? data.text.trim() : '';
    if (text.length >= 15) {
      return text;
    }
  } catch {
    // Fallback to default recognize below
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // ignore
      }
    }
  }

  const fallbackRes = await Tesseract.recognize(imageSource, lang, {
    logger: (m) => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number' && onProgress) {
        onProgress(m.progress);
      }
    },
  });
  return fallbackRes.data?.text ? fallbackRes.data.text.trim() : '';
}

function parseFallbackBillFromRawText(rawText: string, fileName: string) {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const lower = rawText.toLowerCase();
  const billKeywords = [
    'invoice',
    'gstin',
    'tax',
    'total',
    'bill',
    'receipt',
    'qty',
    'rate',
    'price',
    'amount',
    'subtotal',
    'cgst',
    'sgst',
    'hsn',
    'mrp',
    'cash memo',
    'rs',
    '₹',
  ];
  let keywordHits = 0;
  for (const kw of billKeywords) {
    if (lower.includes(kw)) keywordHits++;
  }
  const docType: DocType = keywordHits >= 2 ? 'SHOP_BILL' : 'NORMAL_DOCUMENT';

  const ignoreHeaderRegex =
    /^(tax invoice|invoice|cash memo|receipt|bill of supply|original|duplicate|date|time|gstin|mobile|phone|tel|=== page|demo sample|not a real|synthetic data|shop\s*\d|\d+\s+market|plot\s*\d|unit\s*\d|civil\s*lines|fc\s*road|main\s*market)/i;

  let shopName = '';
  for (const line of lines.slice(0, 8)) {
    const cleanedLine = line.replace(/[*_#|«»=-]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (
      cleanedLine.length >= 3 &&
      !ignoreHeaderRegex.test(cleanedLine) &&
      !/demo\s*sample|not\s*a\s*real\s*invoice|synthetic\s*data/i.test(cleanedLine)
    ) {
      shopName = cleanedLine;
      break;
    }
  }
  if (!shopName) shopName = fileName.replace(/\.[^.]+$/, '');

  // Support exact GSTINs as well as minor OCR character confusions (e.g. '24FGHI)5678K1Z2' -> '24FGHIJ5678K1Z2')
  const gstinMatches = rawText.match(/\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/gi) || [];
  let sellerGstin = gstinMatches[0] ? gstinMatches[0].toUpperCase() : '';
  const buyerGstin = gstinMatches[1] ? gstinMatches[1].toUpperCase() : '';
  if (!sellerGstin) {
    const fuzzyGstinMatch = rawText.match(/GSTIN\s*[:.-]?\s*([0-9A-Z)!I|l]{15})/i);
    if (fuzzyGstinMatch?.[1]) {
      sellerGstin = fuzzyGstinMatch[1]
        .toUpperCase()
        .replace(/\)/g, 'J')
        .replace(/[|!l]/g, '1');
    }
  }

  let invoiceNumber = '';
  const invMatch =
    rawText.match(
      /(?:invoice\s*(?:no|number|#)?|bill\s*(?:no|number|#)?|receipt\s*(?:no|#)?|inv\s*(?:no|#)?|voucher\s*no)\s*[:.-]\s*([A-Za-z0-9/_-]{2,25})/i
    ) || rawText.match(/(?:no|inv)\s*[:.-]\s*([A-Za-z0-9/_-]{3,20})/i);
  if (invMatch?.[1]) {
    invoiceNumber = invMatch[1].trim();
  }

  let billDate = new Date().toISOString().slice(0, 10);
  const isoMatch = rawText.match(/\b(20\d{2}[-/.](?:0[1-9]|1[0-2])[-/.](?:0[1-9]|[12]\d|3[01]))\b/);
  const dmyMatch = rawText.match(/\b(0?[1-9]|[12]\d|3[01])[-/.](0?[1-9]|1[0-2])[-/.](20\d{2}|\d{2})\b/);
  if (isoMatch) {
    billDate = isoMatch[1].replace(/[/.]/g, '-');
  } else if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3].length === 2 ? `20${dmyMatch[3]}` : dmyMatch[3];
    billDate = `${year}-${month}-${day}`;
  }

  const parseNum = (val?: string) => {
    if (!val) return 0;
    const m = String(val).replace(/,/g, '').match(/\d+(?:\.\d+)?/);
    if (!m) return 0;
    const num = parseFloat(m[0]);
    return Number.isFinite(num) ? num : 0;
  };

  const billItems: NoSQLBillItem[] = [];
  const ignoreLineRegex =
    /(?:subtotal|sub\s*total|उप-योग|कुल\s*छूट|कुल\s*राशि|कुल\s*योग|total\s*tax|tax\s*\/\s*gst|tax\s*\|\s*gst|cgst|sgst|igst|vat|grand\s*total|net\s*amount|amount\s*payable|total\s*taxable|balance|change|payment|cashier|thank\s*you|धन्यवाद|gstin|invoice\s*no|invoice\s*:|bill\s*no|date\s*:|time\s*:|phone|mobile|address|discount|round\s*off|bank|ifsc|terms|signatory|demo\s*sample|not\s*a\s*real|synthetic\s*data|central\s*plaza|market\s*road|sg\s*highway|industrial\s*estate|doctor\s*:|customer\s*:|buyer\s*:|place\s*of\s*supply)/i;

  for (const line of lines) {
    if (ignoreLineRegex.test(line)) continue;
    if (/^(item|description|particulars|वस्तु|दवा|sl\s*no|sr\s*no|qty|quantity|rate|price|amount|hsn)\b/i.test(line)) {
      continue;
    }

    // 1) High-precision trailing price-pair matcher:
    // Matches lines ending with [Qty or OCR '1' token] [Currency/Noise?] [UnitPrice] [Currency/Noise?] [LineTotal]
    // Handles OCR variations of ₹ such as %, $, ¥, z, X, Rs, or leading '3'/'7' merged into unitPrice,
    // and OCR variations of Qty '1' such as 'a', 'at', 'i', 'l', '|' on tilted bills.
    const priceTailMatch = line.match(
      /^(.+?)\s+(?:(\d{4,8})\s+)?(?:(\d+(?:\.\d+)?)|([a-zA-Z|!]{1,2}))\s*(?:x|X|\s)\s*(?:[₹$¥€£%zZxXrRsS.?]+\s*)?(\d+(?:,\d{3})*(?:\.\d{1,2}))\s+(?:[₹$¥€£%zZxXrRsS.?]+\s*)?(\d+(?:,\d{3})*(?:\.\d{1,2}))$/
    );
    if (priceTailMatch) {
      let itemName = priceTailMatch[1].replace(/^[\d.)\s-]+/, '').trim();
      let hsnSac = priceTailMatch[2] ? priceTailMatch[2].trim() : '';
      let quantity = priceTailMatch[3] ? parseNum(priceTailMatch[3]) : 0;
      let unitPrice = parseNum(priceTailMatch[5]);
      const lineTotal = parseNum(priceTailMatch[6]);

      // Extract inline "(HSN 8471)" if present in itemName
      const inlineHsn = itemName.match(/\(?\bHSN\s*[:.-]?\s*(\d{4,8})\)?/i);
      if (inlineHsn?.[1]) {
        hsnSac = hsnSac || inlineHsn[1];
        itemName = itemName.replace(inlineHsn[0], '').trim();
      }

      if (itemName.length >= 2 && /[A-Za-z\u0900-\u097F]/.test(itemName) && lineTotal > 0) {
        // Mathematical Self-Healing A:
        // If ₹ was OCR'd as a leading digit on unitPrice (e.g., "₹ 149.00" -> "3149.00" while lineTotal is 298.00 and qty is 2)
        if (unitPrice > lineTotal && quantity >= 1) {
          const expectedRate = Number((lineTotal / quantity).toFixed(2));
          if (expectedRate > 0) {
            unitPrice = expectedRate;
          }
        }
        // Mathematical Self-Healing B:
        // If quantity was misread as a letter ('a'/'at' -> 0) or wrong digit ('4' when unitPrice=48 and lineTotal=48)
        if (unitPrice > 0 && lineTotal >= unitPrice) {
          const ratio = lineTotal / unitPrice;
          if (quantity <= 0 || Math.abs(quantity * unitPrice - lineTotal) > 0.5) {
            if (Math.abs(ratio - Math.round(ratio)) < 0.02 && Math.round(ratio) >= 1 && Math.round(ratio) <= 1000) {
              quantity = Math.round(ratio);
            }
          }
        }
        if (quantity <= 0) quantity = 1;
        if (unitPrice <= 0) unitPrice = Number((lineTotal / quantity).toFixed(2));

        billItems.push({
          id: `item-${Date.now()}-${billItems.length}`,
          itemName,
          hsnSac,
          quantity,
          unit: 'PCS',
          unitPrice,
          discount: 0,
          taxableValue: lineTotal,
          gstRate: 0,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 0,
          lineTotal,
          extraColumns: {},
        });
        continue;
      }
    }

    // 2) Pipe-delimited "|" or multi-space tabular fallback
    const cols = line
      .split(/\s*\|\s*|\s{2,}/)
      .map((c) => c.trim())
      .filter(Boolean);
    if (cols.length >= 2) {
      const numericCols = cols
        .slice(1)
        .map((c) => parseNum(c))
        .filter((n) => n > 0);
      const nameCandidate = cols[0].replace(/^\d+[.)\s-]+/, '').trim();
      if (nameCandidate.length >= 2 && /[A-Za-z\u0900-\u097F]/.test(nameCandidate) && numericCols.length >= 1) {
        const lineTotal = numericCols[numericCols.length - 1];
        let qty = numericCols.length >= 2 && numericCols[0] < 1000 ? numericCols[0] : 1;
        let unitPrice = numericCols.length >= 3 ? numericCols[numericCols.length - 2] : Number((lineTotal / (qty || 1)).toFixed(2));
        if (unitPrice > lineTotal && qty >= 1) {
          unitPrice = Number((lineTotal / qty).toFixed(2));
        }
        if (unitPrice > 0 && Math.abs(qty * unitPrice - lineTotal) > 0.5) {
          const ratio = lineTotal / unitPrice;
          if (Math.abs(ratio - Math.round(ratio)) < 0.02 && Math.round(ratio) >= 1) {
            qty = Math.round(ratio);
          }
        }
        billItems.push({
          id: `item-${Date.now()}-${billItems.length}`,
          itemName: nameCandidate,
          hsnSac: '',
          quantity: qty,
          unit: 'PCS',
          unitPrice,
          discount: 0,
          taxableValue: lineTotal,
          gstRate: 0,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 0,
          lineTotal,
          extraColumns: {},
        });
      }
    }
  }

  const grandMatch = rawText.match(
    /(?:grand\s*total|कुल\s*राशि|कुल\s*योग|net\s*payable|total\s*amount|amount\s*payable)\s*[:₹$¥%xXRs.\s|-]*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i
  );
  const subtotalMatch = rawText.match(
    /(?:subtotal|sub\s*total|total\s*taxable\s*value)\s*[:₹$¥%xXRs.\s|-]*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i
  );
  const taxMatch = rawText.match(
    /(?:tax\s*\/\s*gst|tax\s*\|\s*gst|total\s*tax|tax\s*amount)\s*[:₹$¥%xXRs.\s|-]*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i
  );
  const cgstMatch = rawText.match(/cgst(?:\s*@?\s*\(?[\d.]+%?\)?)?\s*[:₹$¥%xXRs.\s|-]*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i);
  const sgstMatch = rawText.match(/sgst(?:\s*@?\s*\(?[\d.]+%?\)?)?\s*[:₹$¥%xXRs.\s|-]*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/i);

  const itemsSum = Number(billItems.reduce((s, i) => s + i.lineTotal, 0).toFixed(2));
  const parsedCgst = cgstMatch ? parseNum(cgstMatch[1]) : 0;
  const parsedSgst = sgstMatch ? parseNum(sgstMatch[1]) : 0;
  const taxAmount = taxMatch
    ? parseNum(taxMatch[1])
    : Number((parsedCgst + parsedSgst).toFixed(2));
  const subtotal = subtotalMatch ? parseNum(subtotalMatch[1]) : itemsSum;
  const grandTotal = grandMatch ? parseNum(grandMatch[1]) : Number(((subtotal || itemsSum) + taxAmount).toFixed(2));

  return {
    docType,
    shopName,
    sellerGstin,
    buyerName: '',
    buyerGstin,
    invoiceNumber: invoiceNumber || `INV-${Date.now().toString().slice(-5)}`,
    billDate,
    placeOfSupply: '',
    voucherType: 'Tax Invoice',
    paymentMode: /card/i.test(rawText) ? 'Card' : /neft|rtgs/i.test(rawText) ? 'NEFT' : 'Cash / UPI',
    subtotal: subtotal || grandTotal,
    cgstAmount: parsedCgst || Number((taxAmount / 2).toFixed(2)),
    sgstAmount: parsedSgst || Number((taxAmount / 2).toFixed(2)),
    igstAmount: 0,
    taxAmount,
    discountAmount: 0,
    grandTotal,
    extraHeaderFields: {} as Record<string, string>,
    billItems,
  };
}

// ---------------------------------------------------------------------------
// QR Code Payload Parser
// ---------------------------------------------------------------------------
function parseReceiptQrData(rawQrString: string): {
  shopName?: string;
  invoiceNumber?: string;
  billDate?: string;
  grandTotal?: number;
  taxAmount?: number;
  sellerGstin?: string;
  summary: string;
} {
  const text = rawQrString.trim();

  if (text.startsWith('{') && text.endsWith('}')) {
    try {
      const obj = JSON.parse(text);
      const shopName = obj.shop || obj.shopName || obj.merchant || obj.seller || obj.vendor || obj.name;
      const invoiceNumber = obj.inv || obj.invoice || obj.invoiceNumber || obj.billNo || obj.receiptNo;
      const billDate = obj.date || obj.billDate || obj.dt;
      const grandTotal =
        obj.total || obj.grandTotal || obj.amount || obj.am
          ? Number(obj.total || obj.grandTotal || obj.amount || obj.am)
          : undefined;
      const taxAmount = obj.tax || obj.gst || obj.taxAmount ? Number(obj.tax || obj.gst || obj.taxAmount) : undefined;
      const sellerGstin = obj.gstin || obj.sellerGstin;
      return {
        shopName: shopName ? String(shopName) : undefined,
        invoiceNumber: invoiceNumber ? String(invoiceNumber) : undefined,
        billDate: billDate ? String(billDate).slice(0, 10) : undefined,
        grandTotal: Number.isFinite(grandTotal) ? grandTotal : undefined,
        taxAmount: Number.isFinite(taxAmount) ? taxAmount : undefined,
        sellerGstin: sellerGstin ? String(sellerGstin) : undefined,
        summary: `Parsed JSON QR (${shopName || 'Merchant'})`,
      };
    } catch {
      // fall through
    }
  }

  if (text.toLowerCase().startsWith('upi://pay')) {
    try {
      const url = new URL(text);
      const p = url.searchParams;
      const pn = p.get('pn') || undefined;
      const tr = p.get('tr') || p.get('tid') || undefined;
      const am = p.get('am') ? Number(p.get('am')) : undefined;
      return {
        shopName: pn ? decodeURIComponent(pn) : undefined,
        invoiceNumber: tr ? decodeURIComponent(tr) : undefined,
        grandTotal: Number.isFinite(am) ? am : undefined,
        summary: `Parsed UPI QR (${pn || 'Merchant Payment'})`,
      };
    } catch {
      // fall through
    }
  }

  return {
    shopName: text.length <= 60 ? text : undefined,
    summary: `Scanned QR Code: "${text.slice(0, 60)}"`,
  };
}

export function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scan2sql-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('scan2sql-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // User Mode: 'normal_user' (Simple 1-row per bill + grocery multi-product columns) vs 'ca_mode' (CA GST & Audit)
  const [userMode, setUserMode] = useState<UserProfileMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_MODE);
    return saved === 'ca_mode' ? 'ca_mode' : 'normal_user';
  });

  // Main Navigation Tabs
  const [activeTab, setActiveTab] = useState<'scanner' | 'master_sheet' | 'dashboard' | 'history'>('scanner');

  // Clean URL Route State for Multi-Page SEO Architecture & CA Resource Center
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePathname(window.location.pathname);
    }
    return '/';
  });

  useEffect(() => {
    syncDocumentSeoTags(currentPath);
  }, [currentPath]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePathname(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback((path: string) => {
    const normalized = normalizePathname(path);
    if (typeof window !== 'undefined' && normalizePathname(window.location.pathname) !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [showSupplierSummary, setShowSupplierSummary] = useState<boolean>(false);

  // Document & Preview State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<string>('IMAGE');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // Processing & Animation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [ocrProgressPercent, setOcrProgressPercent] = useState<number>(0);
  const [batchStatusText, setBatchStatusText] = useState<string>('');
  const [ocrLang, setOcrLang] = useState<'eng+hin' | 'eng' | 'hin'>('eng+hin');
  const [autoAppendToMaster, setAutoAppendToMaster] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const excelImportInputRef = useRef<HTMLInputElement | null>(null);
  const activeAbortControllerRef = useRef<AbortController | null>(null);

  // Active Extracted Document & Bill Editor State
  const [extractedText, setExtractedText] = useState<string>('');
  const [detectedType, setDetectedType] = useState<DocType>('SHOP_BILL');
  const [confidenceScore, setConfidenceScore] = useState<number>(0);

  // Current Bill Header Fields
  const [shopName, setShopName] = useState('');
  const [sellerGstin, setSellerGstin] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerGstin, setBuyerGstin] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [billDate, setBillDate] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [voucherType, setVoucherType] = useState('Tax Invoice');
  const [paymentMode, setPaymentMode] = useState('Cash / UPI');
  const [extraHeaderFields, setExtraHeaderFields] = useState<Record<string, string>>({});

  // Current Bill Line Items
  const [billItems, setBillItems] = useState<NoSQLBillItem[]>([]);
  const [cgstAmount, setCgstAmount] = useState<number>(0);
  const [sgstAmount, setSgstAmount] = useState<number>(0);
  const [igstAmount, setIgstAmount] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Dynamic Column Builder Inputs
  const [newItemColumnName, setNewItemColumnName] = useState('');
  const [newHeaderFieldKey, setNewHeaderFieldKey] = useState('');
  const [newHeaderFieldVal, setNewHeaderFieldVal] = useState('');
  const [showNoSqlJsonModal, setShowNoSqlJsonModal] = useState(false);

  // QR Scanner State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [qrScannedBanner, setQrScannedBanner] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const qrImageInputRef = useRef<HTMLInputElement | null>(null);
  const qrScanLoopRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Persistent Collection State
  const [savedBills, setSavedBills] = useState<NoSQLBillRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BILLS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [savedDocuments, setSavedDocuments] = useState<SavedDocumentRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [selectedColumnKeys, setSelectedColumnKeys] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SELECTED_COLUMNS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return NORMAL_USER_PRESET_KEYS;
  });

  // DEFAULT TO 'bill_wise' (1 Bill = 1 Row!) so normal users never get 20 rows for 1 bill!
  const [masterSheetMode, setMasterSheetMode] = useState<'bill_wise' | 'item_wise'>('bill_wise');

  // Switch presets cleanly when user toggles between Normal User Mode & CA Mode
  const handleSwitchUserMode = (mode: UserProfileMode) => {
    setUserMode(mode);
    localStorage.setItem(STORAGE_KEYS.USER_MODE, mode);
    if (mode === 'normal_user') {
      setMasterSheetMode('bill_wise');
      // Include Normal User columns + any multi-product columns
      const multiProdKeys = allAvailableColumns
        .filter((c) => c.category === 'MULTI_PRODUCT')
        .map((c) => c.key);
      setSelectedColumnKeys(Array.from(new Set([...NORMAL_USER_PRESET_KEYS, ...multiProdKeys])));
    } else {
      setSelectedColumnKeys(CA_SUMMARY_PRESET_KEYS);
    }
  };

  // Load initial server store if local is empty
  useEffect(() => {
    fetch('/api/nosql/store')
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && res.store) {
          if (Array.isArray(res.store.bills) && res.store.bills.length > 0 && savedBills.length === 0) {
            setSavedBills(res.store.bills);
          }
          if (Array.isArray(res.store.documents) && res.store.documents.length > 0 && savedDocuments.length === 0) {
            setSavedDocuments(res.store.documents);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Debounced persistence so saving large PDFs never blocks the UI thread or second upload
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(savedBills));
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(savedDocuments));
        localStorage.setItem(STORAGE_KEYS.SELECTED_COLUMNS, JSON.stringify(selectedColumnKeys));
      } catch {
        // ignore quota issues
      }
      fetch('/api/nosql/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bills: savedBills,
          documents: savedDocuments,
          selectedColumns: selectedColumnKeys,
        }),
      }).catch(() => {});
    }, 300);
    return () => clearTimeout(timer);
  }, [savedBills, savedDocuments, selectedColumnKeys]);

  // Maximum number of products in any multi-product bill (e.g. Grocery Shopping bill with 5 products -> Product 1..Product 5 columns!)
  // NOTE: If all bills have <= 1 item, maxMultiProductCount is 0 so no extra Product columns clutter the table!
  const maxMultiProductCount = useMemo(() => {
    let maxItems = billItems.length > 1 ? billItems.length : 0;
    for (const b of savedBills) {
      if (Array.isArray(b.items) && b.items.length > 1) {
        if (b.items.length > maxItems) {
          maxItems = b.items.length;
        }
      }
    }
    return Math.min(maxItems, 20); // Cap at 20 horizontal product columns
  }, [billItems, savedBills]);

  // Discover ALL Available Columns (Standard + Multi-Product Grocery Columns + Dynamic NoSQL Columns)
  const allAvailableColumns = useMemo<ColumnDefinition[]>(() => {
    const cols: ColumnDefinition[] = [];
    const existingKeys = new Set<string>();

    // Insert Product 1..Product N columns right before Total Tax & Grand Total so the Excel sheet reads naturally left-to-right
    for (const stdCol of STANDARD_COLUMNS) {
      if (stdCol.key === 'taxAmount') {
        for (let i = 1; i <= maxMultiProductCount; i++) {
          const prodKey = `prod_${i}`;
          if (!existingKeys.has(prodKey)) {
            existingKeys.add(prodKey);
            cols.push({
              key: prodKey,
              label: `Product ${i}`,
              category: 'MULTI_PRODUCT',
            });
          }
        }
      }
      if (!existingKeys.has(stdCol.key)) {
        existingKeys.add(stdCol.key);
        cols.push(stdCol);
      }
    }

    const addHeaderKey = (k: string) => {
      const clean = k.trim();
      if (!clean) return;
      const keyId = `hdr:${clean}`;
      if (!existingKeys.has(keyId)) {
        existingKeys.add(keyId);
        cols.push({
          key: keyId,
          label: `${clean} (Extra)`,
          category: 'DYNAMIC_HEADER',
        });
      }
    };

    Object.keys(extraHeaderFields).forEach(addHeaderKey);
    savedBills.forEach((b) => {
      if (b.extraHeaderFields) Object.keys(b.extraHeaderFields).forEach(addHeaderKey);
    });

    const addItemCol = (k: string) => {
      const clean = k.trim();
      if (!clean) return;
      const keyId = `itm:${clean}`;
      if (!existingKeys.has(keyId)) {
        existingKeys.add(keyId);
        cols.push({
          key: keyId,
          label: `${clean} (Extra)`,
          category: 'DYNAMIC_ITEM',
        });
      }
    };

    billItems.forEach((item) => {
      if (item.extraColumns) Object.keys(item.extraColumns).forEach(addItemCol);
    });
    savedBills.forEach((b) => {
      b.items?.forEach((item) => {
        if (item.extraColumns) Object.keys(item.extraColumns).forEach(addItemCol);
      });
    });

    return cols;
  }, [extraHeaderFields, billItems, savedBills, maxMultiProductCount]);

  // Auto-enable Product 1..N columns when a multi-product bill (like grocery shopping) is scanned!
  useEffect(() => {
    if (maxMultiProductCount > 1) {
      const prodKeys: string[] = [];
      for (let i = 1; i <= maxMultiProductCount; i++) {
        prodKeys.push(`prod_${i}`);
      }
      setSelectedColumnKeys((prev) => Array.from(new Set([...prev, ...prodKeys])));
    }
  }, [maxMultiProductCount]);

  const activeDynamicItemColumnNames = useMemo<string[]>(() => {
    const set = new Set<string>();
    billItems.forEach((item) => {
      if (item.extraColumns) {
        Object.keys(item.extraColumns).forEach((k) => {
          if (k.trim()) set.add(k.trim());
        });
      }
    });
    return Array.from(set);
  }, [billItems]);

  // Search, Filter & UI Toast State
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  }, []);

  // Webcam QR Code Scanner Lifecycle
  const stopCameraStream = useCallback(() => {
    if (qrScanLoopRef.current) {
      cancelAnimationFrame(qrScanLoopRef.current);
      qrScanLoopRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const applyDecodedQrPayload = useCallback(
    (rawQrText: string) => {
      const parsed = parseReceiptQrData(rawQrText);
      setDetectedType('SHOP_BILL');
      if (parsed.shopName) setShopName(parsed.shopName);
      if (parsed.invoiceNumber) setInvoiceNumber(parsed.invoiceNumber);
      if (parsed.billDate) setBillDate(parsed.billDate);
      if (parsed.sellerGstin) setSellerGstin(parsed.sellerGstin);
      if (typeof parsed.taxAmount === 'number') setTaxAmount(parsed.taxAmount);

      if (typeof parsed.grandTotal === 'number') {
        const netSubtotal =
          typeof parsed.taxAmount === 'number'
            ? Number((parsed.grandTotal - parsed.taxAmount).toFixed(2))
            : parsed.grandTotal;
        setBillItems((prev) => {
          if (prev.length === 0) {
            return [
              {
                id: `qr-${Date.now()}`,
                itemName: parsed.shopName ? `${parsed.shopName} — Bill` : 'QR Scanned Receipt',
                hsnSac: '',
                quantity: 1,
                unit: 'NOS',
                unitPrice: netSubtotal > 0 ? netSubtotal : parsed.grandTotal!,
                discount: 0,
                taxableValue: netSubtotal > 0 ? netSubtotal : parsed.grandTotal!,
                gstRate: 0,
                cgstAmount: 0,
                sgstAmount: 0,
                igstAmount: 0,
                lineTotal: netSubtotal > 0 ? netSubtotal : parsed.grandTotal!,
                extraColumns: {},
              },
            ];
          }
          return prev;
        });
      }

      setQrScannedBanner(parsed.summary);
      stopCameraStream();
      setIsQrModalOpen(false);
      showToast(`QR Code Applied: ${parsed.summary}`);
    },
    [showToast, stopCameraStream]
  );

  const scanVideoFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = qrCanvasRef.current;
    if (!video || !canvas) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code && code.data) {
          applyDecodedQrPayload(code.data);
          return;
        }
      }
    }
    qrScanLoopRef.current = requestAnimationFrame(scanVideoFrame);
  }, [applyDecodedQrPayload]);

  const startWebcamQrScanner = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      mediaStreamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        qrScanLoopRef.current = requestAnimationFrame(scanVideoFrame);
      }
    } catch {
      setCameraError('Could not access webcam. Please allow camera permissions or upload a QR image below.');
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    return () => stopCameraStream();
  }, [stopCameraStream]);

  const handleQrImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          applyDecodedQrPayload(code.data);
        } else {
          setCameraError('No valid QR code found in the uploaded image.');
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const [recentlyAddedBillIds, setRecentlyAddedBillIds] = useState<string[]>([]);

  const markBillsAsRecentlyAdded = useCallback((ids: string[]) => {
    if (!ids.length) return;
    setRecentlyAddedBillIds((prev) => Array.from(new Set([...ids, ...prev])));
    setTimeout(() => {
      setRecentlyAddedBillIds((prev) => prev.filter((id) => !ids.includes(id)));
    }, 3500);
  }, []);

  // ---------------------------------------------------------------------------
  // Populate Active Editor & Auto-Append to Master Sheet
  // ---------------------------------------------------------------------------
  const applyExtractedDataToState = useCallback(
    (
      fileName: string,
      fileType: string,
      pageCount: number,
      result: {
        exactRawText: string;
        docType: DocType;
        confidence: number;
        shopName: string;
        sellerGstin: string;
        buyerName: string;
        buyerGstin: string;
        invoiceNumber: string;
        billDate: string;
        placeOfSupply: string;
        voucherType: string;
        paymentMode: string;
        subtotal: number;
        cgstAmount: number;
        sgstAmount: number;
        igstAmount: number;
        taxAmount: number;
        discountAmount: number;
        grandTotal: number;
        extraHeaderFields: Record<string, string>;
        billItems: NoSQLBillItem[];
      },
      shouldAutoSaveToMaster: boolean
    ) => {
      setExtractedText(result.exactRawText);
      setDetectedType(result.docType);
      setConfidenceScore(result.confidence);
      setShopName(result.shopName);
      setSellerGstin(result.sellerGstin);
      setBuyerName(result.buyerName);
      setBuyerGstin(result.buyerGstin);
      setInvoiceNumber(result.invoiceNumber);
      setBillDate(result.billDate);
      setPlaceOfSupply(result.placeOfSupply);
      setVoucherType(result.voucherType || 'Tax Invoice');
      setPaymentMode(result.paymentMode || 'Cash / UPI');
      setExtraHeaderFields(result.extraHeaderFields || {});
      setBillItems(result.billItems || []);
      setCgstAmount(result.cgstAmount || 0);
      setSgstAmount(result.sgstAmount || 0);
      setIgstAmount(result.igstAmount || 0);
      setTaxAmount(result.taxAmount || 0);
      setDiscountAmount(result.discountAmount || 0);

      // Auto-enable any newly discovered dynamic columns
      const newDynKeys: string[] = [];
      Object.keys(result.extraHeaderFields || {}).forEach((k) => {
        if (k.trim()) newDynKeys.push(`hdr:${k.trim()}`);
      });
      (result.billItems || []).forEach((it) => {
        Object.keys(it.extraColumns || {}).forEach((k) => {
          if (k.trim()) newDynKeys.push(`itm:${k.trim()}`);
        });
      });
      if ((result.billItems || []).length > 1) {
        for (let i = 1; i <= Math.min(result.billItems.length, 20); i++) {
          newDynKeys.push(`prod_${i}`);
        }
      }
      if (newDynKeys.length > 0) {
        setSelectedColumnKeys((prev) => Array.from(new Set([...prev, ...newDynKeys])));
      }

      if (shouldAutoSaveToMaster) {
        const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const newDoc: SavedDocumentRecord = {
          id: `DOC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          fileName,
          fileType,
          docType: result.docType,
          pageCount,
          ocrLanguage: ocrLang,
          extractedText: result.exactRawText,
          confidence: result.confidence,
          createdAt: nowStr,
        };
        setSavedDocuments((prev) => [newDoc, ...prev]);

        const newBill: NoSQLBillRecord = {
          id: `BILL-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          fileName,
          shopName: result.shopName || fileName.replace(/\.[^.]+$/, ''),
          sellerGstin: result.sellerGstin || '',
          buyerName: result.buyerName || '',
          buyerGstin: result.buyerGstin || '',
          invoiceNumber: result.invoiceNumber || `INV-${Date.now().toString().slice(-5)}`,
          billDate: result.billDate || new Date().toISOString().slice(0, 10),
          placeOfSupply: result.placeOfSupply || '',
          voucherType: result.voucherType || 'Bill / Receipt',
          paymentMode: result.paymentMode || 'Cash / UPI',
          subtotal: result.subtotal || result.grandTotal || 0,
          cgstAmount: result.cgstAmount || 0,
          sgstAmount: result.sgstAmount || 0,
          igstAmount: result.igstAmount || 0,
          taxAmount: result.taxAmount || 0,
          discountAmount: result.discountAmount || 0,
          grandTotal: result.grandTotal || result.subtotal || 0,
          confidence: result.confidence,
          rawText: result.exactRawText,
          createdAt: nowStr,
          extraHeaderFields: result.extraHeaderFields || {},
          items: result.billItems || [],
        };
        setSavedBills((prev) => [newBill, ...prev]);
        markBillsAsRecentlyAdded([newBill.id]);
      }
    },
    [ocrLang, markBillsAsRecentlyAdded]
  );

  // ---------------------------------------------------------------------------
  // Guaranteed Text + Bill Extraction Engine:
  // 1) Tries Server Vision + PDF Coordinate Layer
  // 2) NEVER returns early with empty text — if text is < 15 chars, ALWAYS runs
  //    client-side Tesseract.recognize on the enhanced page images!
  // ---------------------------------------------------------------------------
  const extractWithHybridEngine = async (params: {
    fileName: string;
    fileType: string;
    pageDataUrls: string[];
    embeddedCoordinateText: string;
    shouldAutoSave: boolean;
  }) => {
    const { fileName, fileType, pageDataUrls, embeddedCoordinateText, shouldAutoSave } = params;

    setScanStepIndex(1);
    setOcrProgressPercent(30);

    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    activeAbortControllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 13000);

    const imagePayloads = pageDataUrls.slice(0, 2).map((dataUrl) => ({
      mimeType: dataUrl.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png',
      data: dataUrl,
    }));

    try {
      const apiRes = await fetch('/api/extract-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          images: imagePayloads,
          embeddedText: embeddedCoordinateText,
          fileName,
        }),
      });

      clearTimeout(timeoutId);

      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json?.success && json.data) {
          const d = json.data;
          const aiText = d.exactRawText ? String(d.exactRawText).trim() : '';
          const embText = embeddedCoordinateText.trim();
          const combinedText = aiText.length >= embText.length ? aiText : embText;

          // CRITICAL: Only accept AI result if we actually have readable text (>= 15 chars)!
          // Otherwise fall through to guaranteed client-side Tesseract OCR below!
          if (combinedText.length >= 15) {
            setScanStepIndex(3);
            setOcrProgressPercent(100);

            const extraHeadersObj: Record<string, string> = {};
            if (Array.isArray(d.extraHeaderFields)) {
              d.extraHeaderFields.forEach((entry: any) => {
                if (entry?.key && entry?.value !== undefined) {
                  extraHeadersObj[String(entry.key).trim()] = String(entry.value).trim();
                }
              });
            }

            const mappedItems: NoSQLBillItem[] = Array.isArray(d.billItems)
              ? d.billItems.map((it: any, idx: number) => {
                  const extraColsObj: Record<string, string> = {};
                  if (Array.isArray(it.extraColumns)) {
                    it.extraColumns.forEach((col: any) => {
                      if (col?.columnName && col?.value !== undefined) {
                        extraColsObj[String(col.columnName).trim()] = String(col.value).trim();
                      }
                    });
                  }
                  const qty = Number(it.quantity) || 1;
                  const rate = Number(it.unitPrice) || 0;
                  const taxable = Number(it.taxableValue) || Number((qty * rate).toFixed(2));
                  const cgst = Number(it.cgstAmount) || 0;
                  const sgst = Number(it.sgstAmount) || 0;
                  const igst = Number(it.igstAmount) || 0;
                  const total = Number(it.lineTotal) || Number((taxable + cgst + sgst + igst).toFixed(2));
                  return {
                    id: `item-${Date.now()}-${idx}`,
                    itemName: String(it.itemName || `Item #${idx + 1}`),
                    hsnSac: String(it.hsnSac || ''),
                    quantity: qty,
                    unit: String(it.unit || 'PCS'),
                    unitPrice: rate,
                    discount: Number(it.discount) || 0,
                    taxableValue: taxable,
                    gstRate: Number(it.gstRate) || 0,
                    cgstAmount: cgst,
                    sgstAmount: sgst,
                    igstAmount: igst,
                    lineTotal: total,
                    extraColumns: extraColsObj,
                  };
                })
              : [];

            // Cross-check with deterministic line-item parser so no product row is ever missed
            const fallbackCrossCheck = parseFallbackBillFromRawText(combinedText, fileName);
            const finalItems =
              fallbackCrossCheck.billItems.length > mappedItems.length
                ? fallbackCrossCheck.billItems
                : mappedItems;

            const itemsTaxableSum = Number(finalItems.reduce((s, i) => s + i.taxableValue, 0).toFixed(2));
            const itemsTotalSum = Number(finalItems.reduce((s, i) => s + i.lineTotal, 0).toFixed(2));
            const cgstTotal =
              Number(d.cgstAmount) ||
              fallbackCrossCheck.cgstAmount ||
              Number(finalItems.reduce((s, i) => s + i.cgstAmount, 0).toFixed(2));
            const sgstTotal =
              Number(d.sgstAmount) ||
              fallbackCrossCheck.sgstAmount ||
              Number(finalItems.reduce((s, i) => s + i.sgstAmount, 0).toFixed(2));
            const igstTotal =
              Number(d.igstAmount) || Number(finalItems.reduce((s, i) => s + i.igstAmount, 0).toFixed(2));
            const totalTax =
              Number(d.taxAmount) ||
              fallbackCrossCheck.taxAmount ||
              Number((cgstTotal + sgstTotal + igstTotal).toFixed(2));
            const subtotalVal = Number(d.subtotal) || fallbackCrossCheck.subtotal || itemsTaxableSum || itemsTotalSum;
            const grandTotalVal =
              Number(d.grandTotal) ||
              fallbackCrossCheck.grandTotal ||
              itemsTotalSum ||
              Number((subtotalVal + totalTax).toFixed(2));

            const rawShopName = String(d.shopName || '').trim();
            const cleanShopName =
              !rawShopName || /demo\s*sample|not\s*a\s*real|synthetic\s*data/i.test(rawShopName)
                ? fallbackCrossCheck.shopName || fileName.replace(/\.[^.]+$/, '')
                : rawShopName;

            applyExtractedDataToState(
              fileName,
              fileType,
              pageDataUrls.length,
              {
                exactRawText: combinedText,
                docType: d.docType === 'NORMAL_DOCUMENT' && finalItems.length === 0 ? 'NORMAL_DOCUMENT' : 'SHOP_BILL',
                confidence: Number(d.confidence) || 98.5,
                shopName: cleanShopName,
                sellerGstin: String(d.sellerGstin || fallbackCrossCheck.sellerGstin || ''),
                buyerName: String(d.buyerName || ''),
                buyerGstin: String(d.buyerGstin || fallbackCrossCheck.buyerGstin || ''),
                invoiceNumber: String(
                  d.invoiceNumber || fallbackCrossCheck.invoiceNumber || `INV-${Date.now().toString().slice(-5)}`
                ),
                billDate: String(d.billDate || fallbackCrossCheck.billDate || new Date().toISOString().slice(0, 10)),
                placeOfSupply: String(d.placeOfSupply || ''),
                voucherType: String(d.voucherType || 'Tax Invoice'),
                paymentMode: String(d.paymentMode || fallbackCrossCheck.paymentMode || 'Cash / UPI'),
                subtotal: subtotalVal,
                cgstAmount: cgstTotal,
                sgstAmount: sgstTotal,
                igstAmount: igstTotal,
                taxAmount: totalTax,
                discountAmount: Number(d.discountAmount) || 0,
                grandTotal: grandTotalVal,
                extraHeaderFields: extraHeadersObj,
                billItems: finalItems,
              },
              shouldAutoSave
            );
            return;
          }
        }
      }
    } catch {
      clearTimeout(timeoutId);
    }

    // ---------------------------------------------------------------------------
    // GUARANTEED CLIENT-SIDE TESSERACT OCR (PSM 4) + COORDINATE PDF TEXT
    // Runs whenever the document is a scanned PDF/Image or if AI text was empty
    // ---------------------------------------------------------------------------
    setScanStepIndex(1);
    let fullRawText = embeddedCoordinateText.trim();

    if (fullRawText.length < 25 && pageDataUrls.length > 0) {
      const pageTexts: string[] = [];
      const pagesToOcr = Math.min(pageDataUrls.length, 3);
      for (let i = 0; i < pagesToOcr; i++) {
        const pageText = await recognizePageTextOptimal(pageDataUrls[i], ocrLang, (progress) => {
          const pct = Math.round(((i + progress) / pagesToOcr) * 100);
          setOcrProgressPercent(Math.max(30, pct));
        });
        if (pageText) {
          pageTexts.push(pagesToOcr > 1 ? `=== Page ${i + 1} ===\n${pageText}` : pageText);
        }
      }
      fullRawText = pageTexts.join('\n\n').trim();
    }

    const fallbackParsed = parseFallbackBillFromRawText(fullRawText, fileName);
    setScanStepIndex(3);
    setOcrProgressPercent(100);

    applyExtractedDataToState(
      fileName,
      fileType,
      pageDataUrls.length,
      {
        exactRawText: fullRawText || 'No readable text detected in this image.',
        docType: fallbackParsed.docType,
        confidence: 95.0,
        ...fallbackParsed,
      },
      shouldAutoSave
    );
  };

  // Manual Re-Scan / Deep Enhance Exact Text Button Handler (Always runs OCR if needed!)
  const handleDeepReScanExactText = async () => {
    if (previewImages.length === 0) {
      showToast('Please upload a PDF or Image first.');
      return;
    }
    setIsProcessing(true);
    setScanStepIndex(1);
    setOcrProgressPercent(35);
    try {
      const pageTexts: string[] = [];
      const pagesToScan = Math.min(previewImages.length, 3);
      for (let i = 0; i < pagesToScan; i++) {
        const pageText = await recognizePageTextOptimal(previewImages[i], ocrLang, (progress) => {
          setOcrProgressPercent(Math.round(((i + progress) / pagesToScan) * 100));
        });
        if (pageText) {
          pageTexts.push(pageText);
        }
      }
      const combined = pageTexts.join('\n\n').trim();
      if (combined) {
        setExtractedText(combined);
        const reparsed = parseFallbackBillFromRawText(combined, uploadedFileName || 'Document');
        if (reparsed.shopName) setShopName(reparsed.shopName);
        if (reparsed.sellerGstin) setSellerGstin(reparsed.sellerGstin);
        if (reparsed.invoiceNumber) setInvoiceNumber(reparsed.invoiceNumber);
        if (reparsed.billDate) setBillDate(reparsed.billDate);
        if (reparsed.billItems.length > 0) setBillItems(reparsed.billItems);
        showToast('Successfully re-scanned & extracted all products from document pages!');
      } else {
        showToast('Re-scan complete.');
      }
    } catch {
      showToast('Could not re-scan image right now.');
    } finally {
      setIsProcessing(false);
      setOcrProgressPercent(100);
    }
  };

  // Process a single File (PDF or Image) with High-DPI rendering & memory cleanup
  const processSingleFile = async (file: File, shouldAutoSave: boolean) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isPdf = ext === 'pdf';

    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    setUploadedFileType(isPdf ? 'PDF' : ext.toUpperCase());
    setExtractedText('Reading high-resolution document text...');
    setScanStepIndex(0);
    setOcrProgressPercent(15);

    if (isPdf) {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Data = new Uint8Array(arrayBuffer);
      const loadingTask = pdfjsLib.getDocument({ data: uint8Data });
      let pdf: pdfjsLib.PDFDocumentProxy | null = null;

      try {
        pdf = await loadingTask.promise;
        const numPages = Math.min(pdf.numPages, 5);

        const renderedPageUrls: string[] = [];
        const pageTextBlocks: string[] = [];

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          // Render at 2.0x High-DPI so small fonts, GSTINs, HSN codes & Hindi matras are razor-sharp
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
            const rawPageUrl = canvas.toDataURL('image/jpeg', 0.92);
            const enhancedPageUrl = await enhanceImageForSharpOcr(rawPageUrl);
            renderedPageUrls.push(enhancedPageUrl);
          }

          const textContent = await page.getTextContent();
          const coordinateText = extractCoordinateSortedTextFromPdfItems(textContent.items as any[]);
          if (coordinateText.trim()) {
            pageTextBlocks.push(numPages > 1 ? `=== Page ${pageNum} ===\n${coordinateText}` : coordinateText);
          }
          page.cleanup();
        }

        const fullEmbeddedText = pageTextBlocks.join('\n\n');
        setPreviewImages(renderedPageUrls);
        setActivePageIndex(0);

        if (fullEmbeddedText.trim()) {
          setExtractedText(fullEmbeddedText);
        }

        await extractWithHybridEngine({
          fileName: file.name,
          fileType: 'PDF',
          pageDataUrls: renderedPageUrls,
          embeddedCoordinateText: fullEmbeddedText,
          shouldAutoSave,
        });
      } finally {
        try {
          if (pdf) {
            await pdf.cleanup();
            await pdf.destroy();
          }
          await loadingTask.destroy();
        } catch {
          // ignore cleanup warnings
        }
      }
    } else {
      const rawDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
      });

      // Enhance image contrast & sharpness for accurate OCR
      const enhancedDataUrl = await enhanceImageForSharpOcr(rawDataUrl);

      setPreviewImages([enhancedDataUrl]);
      setActivePageIndex(0);

      await extractWithHybridEngine({
        fileName: file.name,
        fileType: ext.toUpperCase(),
        pageDataUrls: [enhancedDataUrl],
        embeddedCoordinateText: '',
        shouldAutoSave,
      });
    }
  };

  // Handle Single or Multiple File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    // Copy files to array and IMMEDIATELY reset input value so uploading a 2nd PDF works every time
    const files: File[] = Array.from(fileList);
    e.target.value = '';

    const allowedExts = ['jpg', 'jpeg', 'png', 'pdf'];
    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!allowedExts.includes(ext)) {
        showToast(`Invalid file "${file.name}". Supported: JPG, JPEG, PNG, PDF.`);
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        showToast(`File "${file.name}" exceeds 20 MB limit.`);
        return;
      }
    }

    setIsProcessing(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (files.length > 1) {
          setBatchStatusText(`Scanning Bill ${i + 1} of ${files.length}: ${f.name}`);
        } else {
          setBatchStatusText('');
        }
        const shouldSave = files.length > 1 ? true : autoAppendToMaster;
        await processSingleFile(f, shouldSave);
      }
      if (files.length > 1) {
        showToast(`Merged ${files.length} bills into your Master Excel Sheet!`);
        setActiveTab('master_sheet');
      } else {
        showToast(
          autoAppendToMaster
            ? `Scanned "${files[0].name}" & added 1 row to Master Sheet!`
            : `Scanned "${files[0].name}" — review details below.`
        );
      }
    } catch (err: any) {
      showToast(`Error processing document: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setBatchStatusText('');
    }
  };

  const [showSampleKit, setShowSampleKit] = useState<boolean>(false);

  const handleDownloadSample = async (spec: SampleTestFileSpec) => {
    try {
      await downloadSampleTestFile(spec);
      showToast(`Downloaded "${spec.fileName}" — now you can upload it anytime!`);
    } catch (err: any) {
      showToast(`Could not download sample: ${err?.message || 'Error'}`);
    }
  };

  const handleDownloadAllSamples = async () => {
    try {
      showToast('Generating & downloading all 5 Demo PDFs & Images...');
      for (const spec of SAMPLE_TEST_FILES) {
        await downloadSampleTestFile(spec);
        await new Promise((r) => setTimeout(r, 250));
      }
      showToast('All 5 Demo PDF & Image bills downloaded to your computer!');
    } catch (err: any) {
      showToast(`Error downloading samples: ${err?.message || 'Error'}`);
    }
  };

  const handleDirectTestSample = async (spec: SampleTestFileSpec) => {
    if (isProcessing) return;
    setOcrLang(spec.language);
    if (spec.recommendedMode !== userMode) {
      handleSwitchUserMode(spec.recommendedMode);
    }
    setIsProcessing(true);
    setBatchStatusText(`Loading Test File: ${spec.fileName}`);
    try {
      const file = await generateSampleTestFile(spec);
      await processSingleFile(file, autoAppendToMaster);
      showToast(
        `Scanned "${spec.fileName}" (${spec.badge}) & added to Master Sheet!`
      );
    } catch (err: any) {
      showToast(`Error scanning test file: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setBatchStatusText('');
    }
  };

  // Import Existing Excel (.xlsx / .csv) to Append New Bills into Same Sheet
  const handleImportExistingExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

      if (rows.length === 0) {
        showToast('The selected Excel sheet is empty.');
        return;
      }

      const importedBills: NoSQLBillRecord[] = [];
      rows.forEach((row, idx) => {
        const firstVals = Object.values(row).map((v) => String(v).toLowerCase());
        if (firstVals.some((v) => v === 'grand total' || v === 'total' || v.startsWith('total ('))) {
          return;
        }

        let fileNameVal = file.name;
        let billDateVal = new Date().toISOString().slice(0, 10);
        let invVal = `IMP-${idx + 1}`;
        let sellerVal = 'Imported Bill';
        let sellerGstinVal = '';
        let totalVal = 0;
        const parsedProducts: NoSQLBillItem[] = [];

        for (const [rawHeader, cellVal] of Object.entries(row)) {
          const h = rawHeader.trim().toLowerCase();
          const strVal = String(cellVal ?? '').trim();
          const numVal = parseFloat(strVal.replace(/[,₹Rs\s]/g, '')) || 0;

          if (h.includes('file name') || h.includes('bill / file')) fileNameVal = strVal || fileNameVal;
          else if (h.includes('date')) billDateVal = strVal || billDateVal;
          else if (h.includes('invoice') || h.includes('bill no') || h.includes('bill / invoice')) invVal = strVal || invVal;
          else if (h.includes('gstin')) sellerGstinVal = strVal;
          else if (h.includes('shop') || h.includes('seller') || h.includes('party')) sellerVal = strVal || sellerVal;
          else if (h.includes('total cost') || h.includes('grand total') || h === 'total') totalVal = numVal;
          else if (h.startsWith('product ') && strVal) {
            parsedProducts.push({
              id: `imp-prod-${idx}-${parsedProducts.length}`,
              itemName: strVal,
              hsnSac: '',
              quantity: 1,
              unit: 'PCS',
              unitPrice: 0,
              discount: 0,
              taxableValue: 0,
              gstRate: 0,
              cgstAmount: 0,
              sgstAmount: 0,
              igstAmount: 0,
              lineTotal: 0,
              extraColumns: {},
            });
          }
        }

        importedBills.push({
          id: `XLSX-${Date.now()}-${idx}`,
          fileName: fileNameVal,
          shopName: sellerVal,
          sellerGstin: sellerGstinVal,
          buyerName: '',
          buyerGstin: '',
          invoiceNumber: invVal,
          billDate: billDateVal,
          placeOfSupply: '',
          voucherType: 'Imported Bill',
          paymentMode: 'Excel',
          subtotal: totalVal,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 0,
          taxAmount: 0,
          discountAmount: 0,
          grandTotal: totalVal,
          confidence: 100,
          rawText: JSON.stringify(row, null, 2),
          createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          extraHeaderFields: {},
          items: parsedProducts,
        });
      });

      setSavedBills((prev) => [...importedBills, ...prev]);
      markBillsAsRecentlyAdded(importedBills.map((b) => b.id));
      showToast(`Imported ${importedBills.length} bills from "${file.name}" into Master Sheet!`);
      setActiveTab('master_sheet');
    } catch (err: any) {
      showToast(`Failed to import Excel file: ${err?.message || 'Invalid format'}`);
    }
  };

  // Calculations for Active Bill Editor
  const calculatedSubtotal = useMemo(
    () => Number(billItems.reduce((sum, item) => sum + (Number(item.taxableValue) || 0), 0).toFixed(2)),
    [billItems]
  );

  const calculatedGrandTotal = useMemo(
    () => Number((calculatedSubtotal + Number(taxAmount || 0) - Number(discountAmount || 0)).toFixed(2)),
    [calculatedSubtotal, taxAmount, discountAmount]
  );

  // Update Line Item in Editor
  const handleUpdateItem = (id: string, field: keyof NoSQLBillItem, rawVal: string) => {
    setBillItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item };
        if (field === 'itemName' || field === 'hsnSac' || field === 'unit') {
          (updated as any)[field] = rawVal;
        } else {
          const num = parseFloat(rawVal) || 0;
          (updated as any)[field] = num;
          if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
            updated.taxableValue = Number((updated.quantity * updated.unitPrice - updated.discount).toFixed(2));
            if (updated.gstRate > 0) {
              const gstTotal = Number(((updated.taxableValue * updated.gstRate) / 100).toFixed(2));
              updated.cgstAmount = Number((gstTotal / 2).toFixed(2));
              updated.sgstAmount = Number((gstTotal / 2).toFixed(2));
            }
            updated.lineTotal = Number(
              (updated.taxableValue + updated.cgstAmount + updated.sgstAmount + updated.igstAmount).toFixed(2)
            );
          } else if (field === 'gstRate') {
            const gstTotal = Number(((updated.taxableValue * num) / 100).toFixed(2));
            updated.cgstAmount = Number((gstTotal / 2).toFixed(2));
            updated.sgstAmount = Number((gstTotal / 2).toFixed(2));
            updated.lineTotal = Number((updated.taxableValue + gstTotal + updated.igstAmount).toFixed(2));
          }
        }
        return updated;
      })
    );
  };

  const handleUpdateItemExtraColumn = (itemId: string, colName: string, value: string) => {
    setBillItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          extraColumns: {
            ...(it.extraColumns || {}),
            [colName]: value,
          },
        };
      })
    );
  };

  const handleAddDynamicItemColumn = () => {
    const clean = newItemColumnName.trim();
    if (!clean) return;
    setBillItems((prev) =>
      prev.map((it) => ({
        ...it,
        extraColumns: {
          ...(it.extraColumns || {}),
          [clean]: it.extraColumns?.[clean] || '',
        },
      }))
    );
    const colKey = `itm:${clean}`;
    setSelectedColumnKeys((prev) => (prev.includes(colKey) ? prev : [...prev, colKey]));
    setNewItemColumnName('');
    showToast(`Added custom column "${clean}"!`);
  };

  const handleAddDynamicHeaderField = () => {
    const k = newHeaderFieldKey.trim();
    if (!k) return;
    setExtraHeaderFields((prev) => ({ ...prev, [k]: newHeaderFieldVal.trim() }));
    const colKey = `hdr:${k}`;
    setSelectedColumnKeys((prev) => (prev.includes(colKey) ? prev : [...prev, colKey]));
    setNewHeaderFieldKey('');
    setNewHeaderFieldVal('');
    showToast(`Added custom bill field "${k}"!`);
  };

  const handleAddItemRow = () => {
    const defaultExtras: Record<string, string> = {};
    activeDynamicItemColumnNames.forEach((c) => {
      defaultExtras[c] = '';
    });
    setBillItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        itemName: 'New Product / Item',
        hsnSac: '',
        quantity: 1,
        unit: 'PCS',
        unitPrice: 0,
        discount: 0,
        taxableValue: 0,
        gstRate: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        lineTotal: 0,
        extraColumns: defaultExtras,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setBillItems((prev) => prev.filter((item) => item.id !== id));
  };

  // State for duplicate invoiceNumber + shopName warning & merge suggestion
  const [pendingDuplicateSave, setPendingDuplicateSave] = useState<{
    newBill: NoSQLBillRecord;
    existingBill: NoSQLBillRecord;
  } | null>(null);

  // Manual Save / Append Current Bill to Master Sheet
  const handleSaveCurrentToMasterSheet = () => {
    if (!uploadedFileName && !extractedText.trim() && billItems.length === 0) {
      showToast('Please upload a document or enter bill details first.');
      return;
    }

    const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const resolvedShopName = shopName.trim() || 'Shop / Vendor';
    const resolvedInvoiceNumber = invoiceNumber.trim() || `INV-${Date.now().toString().slice(-5)}`;

    const newBill: NoSQLBillRecord = {
      id: `BILL-${Date.now()}`,
      fileName: uploadedFileName || 'Manual_Bill.pdf',
      shopName: resolvedShopName,
      sellerGstin: sellerGstin.trim(),
      buyerName: buyerName.trim(),
      buyerGstin: buyerGstin.trim(),
      invoiceNumber: resolvedInvoiceNumber,
      billDate: billDate || new Date().toISOString().slice(0, 10),
      placeOfSupply: placeOfSupply.trim(),
      voucherType,
      paymentMode,
      subtotal: calculatedSubtotal,
      cgstAmount,
      sgstAmount,
      igstAmount,
      taxAmount,
      discountAmount,
      grandTotal: calculatedGrandTotal,
      confidence: confidenceScore || 100,
      rawText: extractedText,
      createdAt: nowStr,
      extraHeaderFields,
      items: billItems,
    };

    // Check for existing invoiceNumber + shopName combination in savedBills
    const normalizedInv = resolvedInvoiceNumber.toLowerCase();
    const normalizedShop = resolvedShopName.toLowerCase();
    const existingDuplicate = savedBills.find(
      (b) =>
        b.invoiceNumber.trim().toLowerCase() === normalizedInv &&
        b.shopName.trim().toLowerCase() === normalizedShop
    );

    if (existingDuplicate) {
      setPendingDuplicateSave({ newBill, existingBill: existingDuplicate });
      showToast(
        `Duplicate Warning: Invoice "${resolvedInvoiceNumber}" for "${resolvedShopName}" already exists in Master Sheet.`
      );
      return;
    }

    setPendingDuplicateSave(null);
    setSavedBills((prev) => [newBill, ...prev]);
    markBillsAsRecentlyAdded([newBill.id]);
    showToast(`Added "${newBill.shopName}" (₹${newBill.grandTotal.toFixed(2)}) as 1 Row in Master Sheet!`);
  };

  const handleMergePendingIntoExistingBill = () => {
    if (!pendingDuplicateSave) return;
    const { newBill, existingBill } = pendingDuplicateSave;

    const mergedItems: BillLineItem[] = [
      ...existingBill.items,
      ...newBill.items.map((it, idx) => ({
        ...it,
        id: `${it.id}-merged-${Date.now()}-${idx}`,
      })),
    ];

    const mergedExtraHeaders = [...existingBill.extraHeaderFields];
    newBill.extraHeaderFields.forEach((field) => {
      const existingIdx = mergedExtraHeaders.findIndex(
        (f) => f.label.trim().toLowerCase() === field.label.trim().toLowerCase()
      );
      if (existingIdx >= 0) {
        mergedExtraHeaders[existingIdx] = field;
      } else {
        mergedExtraHeaders.push(field);
      }
    });

    const mergedSubtotal = Number((existingBill.subtotal + newBill.subtotal).toFixed(2));
    const mergedCgst = Number((existingBill.cgstAmount + newBill.cgstAmount).toFixed(2));
    const mergedSgst = Number((existingBill.sgstAmount + newBill.sgstAmount).toFixed(2));
    const mergedIgst = Number((existingBill.igstAmount + newBill.igstAmount).toFixed(2));
    const mergedTax = Number((existingBill.taxAmount + newBill.taxAmount).toFixed(2));
    const mergedDiscount = Number((existingBill.discountAmount + newBill.discountAmount).toFixed(2));
    const mergedGrandTotal = Number((existingBill.grandTotal + newBill.grandTotal).toFixed(2));

    const mergedRecord: NoSQLBillRecord = {
      ...existingBill,
      sellerGstin: newBill.sellerGstin || existingBill.sellerGstin,
      buyerName: newBill.buyerName || existingBill.buyerName,
      buyerGstin: newBill.buyerGstin || existingBill.buyerGstin,
      placeOfSupply: newBill.placeOfSupply || existingBill.placeOfSupply,
      subtotal: mergedSubtotal,
      cgstAmount: mergedCgst,
      sgstAmount: mergedSgst,
      igstAmount: mergedIgst,
      taxAmount: mergedTax,
      discountAmount: mergedDiscount,
      grandTotal: mergedGrandTotal,
      extraHeaderFields: mergedExtraHeaders,
      items: mergedItems,
    };

    setSavedBills((prev) => prev.map((b) => (b.id === existingBill.id ? mergedRecord : b)));
    markBillsAsRecentlyAdded([existingBill.id]);
    setPendingDuplicateSave(null);
    showToast(
      `Merged ${newBill.items.length} item(s) into existing Invoice "${existingBill.invoiceNumber}" (New Total: ₹${mergedGrandTotal.toFixed(2)})!`
    );
  };

  const handleReplaceExistingBillWithPending = () => {
    if (!pendingDuplicateSave) return;
    const { newBill, existingBill } = pendingDuplicateSave;
    const updatedRecord: NoSQLBillRecord = {
      ...newBill,
      id: existingBill.id,
    };
    setSavedBills((prev) => prev.map((b) => (b.id === existingBill.id ? updatedRecord : b)));
    markBillsAsRecentlyAdded([existingBill.id]);
    setPendingDuplicateSave(null);
    showToast(
      `Updated existing Invoice "${existingBill.invoiceNumber}" for "${existingBill.shopName}" (₹${updatedRecord.grandTotal.toFixed(2)})!`
    );
  };

  const handleForceAddPendingDuplicate = () => {
    if (!pendingDuplicateSave) return;
    const { newBill } = pendingDuplicateSave;
    setSavedBills((prev) => [newBill, ...prev]);
    markBillsAsRecentlyAdded([newBill.id]);
    setPendingDuplicateSave(null);
    showToast(`Added duplicate Invoice "${newBill.invoiceNumber}" as a new row in Master Sheet!`);
  };

  // ---------------------------------------------------------------------------
  // Build Rows for Master Excel Sheet
  // Default 'bill_wise' = 1 Bill per Row!
  // If a bill has multiple products (e.g. Grocery Shopping), Product 1, Product 2... columns populate!
  // ---------------------------------------------------------------------------
  const activeSelectedColumnDefs = useMemo(
    () => allAvailableColumns.filter((c) => selectedColumnKeys.includes(c.key)),
    [allAvailableColumns, selectedColumnKeys]
  );

  const filteredBills = useMemo(() => {
    return savedBills.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesQ =
        !q ||
        b.fileName?.toLowerCase().includes(q) ||
        b.shopName.toLowerCase().includes(q) ||
        b.invoiceNumber.toLowerCase().includes(q) ||
        b.sellerGstin.toLowerCase().includes(q) ||
        b.rawText.toLowerCase().includes(q) ||
        b.items.some((it) => it.itemName.toLowerCase().includes(q) || it.hsnSac.toLowerCase().includes(q));
      const matchesDate = !dateFilter || b.billDate.includes(dateFilter);
      return matchesQ && matchesDate;
    });
  }, [savedBills, searchQuery, dateFilter]);

  const masterSheetRows = useMemo(() => {
    const rows: Array<{ id: string; billId: string; cells: Record<string, string | number> }> = [];

    if (masterSheetMode === 'bill_wise') {
      // 1 BILL = 1 SINGLE ROW!
      // Shows Which Bill (fileName), Bill Date, Invoice No, Shop Name, Total Cost,
      // AND if the bill has multiple products (like grocery shopping), fills Product 1, Product 2, Product 3... columns!
      filteredBills.forEach((bill) => {
        const cells: Record<string, string | number> = {};
        const totalQty = bill.items.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
        const combinedItems =
          bill.items.length > 0 ? bill.items.map((i) => i.itemName).join(', ') : bill.shopName || 'Bill Entry';
        const combinedHsn = Array.from(new Set(bill.items.map((i) => i.hsnSac).filter(Boolean))).join(', ');

        activeSelectedColumnDefs.forEach((col) => {
          if (col.key.startsWith('prod_')) {
            const prodIdx = parseInt(col.key.replace('prod_', ''), 10) - 1;
            // Only populate Product 1..N columns if this bill has multiple products (> 1), or if user selected it
            if (bill.items && bill.items[prodIdx]) {
              const it = bill.items[prodIdx];
              const priceStr = it.lineTotal ? ` — ₹${Number(it.lineTotal).toFixed(2)}` : '';
              const qtyStr = it.quantity && it.quantity !== 1 ? ` (${it.quantity} ${it.unit || 'x'})` : '';
              cells[col.key] = `${it.itemName}${qtyStr}${priceStr}`;
            } else {
              cells[col.key] = '-';
            }
          } else if (col.key.startsWith('hdr:')) {
            const rawK = col.key.slice(4);
            cells[col.key] = bill.extraHeaderFields?.[rawK] ?? '';
          } else if (col.key.startsWith('itm:')) {
            const rawK = col.key.slice(4);
            const vals = bill.items.map((i) => i.extraColumns?.[rawK]).filter(Boolean);
            cells[col.key] = vals.join(', ');
          } else if (col.key === 'fileName') {
            cells[col.key] = bill.fileName || 'Uploaded_Bill';
          } else if (col.key === 'itemName') {
            cells[col.key] = combinedItems;
          } else if (col.key === 'hsnSac') {
            cells[col.key] = combinedHsn;
          } else if (col.key === 'quantity') {
            cells[col.key] = totalQty || 1;
          } else if (col.key === 'taxableValue') {
            cells[col.key] = bill.subtotal;
          } else if (col.key === 'grandTotal') {
            cells[col.key] = bill.grandTotal;
          } else if (col.key === 'cgstAmount') {
            cells[col.key] = bill.cgstAmount;
          } else if (col.key === 'sgstAmount') {
            cells[col.key] = bill.sgstAmount;
          } else if (col.key === 'igstAmount') {
            cells[col.key] = bill.igstAmount;
          } else if (col.key === 'taxAmount') {
            cells[col.key] = bill.taxAmount;
          } else {
            cells[col.key] = (bill as any)[col.key] ?? '';
          }
        });
        rows.push({
          id: `${bill.id}_summary`,
          billId: bill.id,
          cells,
        });
      });
    } else {
      // Optional CA Item-Wise Breakdown (only when explicitly toggled by CA)
      filteredBills.forEach((bill) => {
        const itemsToUse =
          bill.items && bill.items.length > 0
            ? bill.items
            : [
                {
                  id: `${bill.id}-summary`,
                  itemName: bill.shopName || 'Bill Entry',
                  hsnSac: '',
                  quantity: 1,
                  unit: 'NOS',
                  unitPrice: bill.subtotal,
                  discount: bill.discountAmount,
                  taxableValue: bill.subtotal,
                  gstRate: 0,
                  cgstAmount: bill.cgstAmount,
                  sgstAmount: bill.sgstAmount,
                  igstAmount: bill.igstAmount,
                  lineTotal: bill.grandTotal,
                  extraColumns: {},
                },
              ];

        itemsToUse.forEach((item, idx) => {
          const cells: Record<string, string | number> = {};
          activeSelectedColumnDefs.forEach((col) => {
            if (col.key.startsWith('hdr:')) {
              const rawK = col.key.slice(4);
              cells[col.key] = bill.extraHeaderFields?.[rawK] ?? '';
            } else if (col.key.startsWith('itm:')) {
              const rawK = col.key.slice(4);
              cells[col.key] = item.extraColumns?.[rawK] ?? '';
            } else if (col.key === 'fileName') {
              cells[col.key] = bill.fileName || 'Uploaded_Bill';
            } else if (col.key === 'grandTotal') {
              cells[col.key] = item.lineTotal || bill.grandTotal;
            } else if (col.category === 'HEADER') {
              cells[col.key] = (bill as any)[col.key] ?? '';
            } else {
              cells[col.key] = (item as any)[col.key] ?? '';
            }
          });
          rows.push({
            id: `${bill.id}_${item.id}_${idx}`,
            billId: bill.id,
            cells,
          });
        });
      });
    }

    return rows;
  }, [filteredBills, masterSheetMode, activeSelectedColumnDefs]);

  // Calculate Column Totals for Footer Row
  const columnTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    activeSelectedColumnDefs.forEach((col) => {
      if (col.isNumeric) {
        totals[col.key] = Number(
          masterSheetRows
            .reduce((sum, r) => sum + (parseFloat(String(r.cells[col.key] || 0)) || 0), 0)
            .toFixed(2)
        );
      }
    });
    return totals;
  }, [activeSelectedColumnDefs, masterSheetRows]);

  // ---------------------------------------------------------------------------
  // Windowed Virtual Rendering for Master Spreadsheet Table (1,000s of CA bills)
  // ---------------------------------------------------------------------------
  const MASTER_ROW_HEIGHT = 40;
  const MASTER_VIEWPORT_HEIGHT = 560;
  const MASTER_OVERSCAN = 10;
  const masterTableScrollRef = useRef<HTMLDivElement | null>(null);
  const masterScrollRafRef = useRef<number | null>(null);
  const [masterTableScrollTop, setMasterTableScrollTop] = useState<number>(0);
  const [masterViewportHeight, setMasterViewportHeight] = useState<number>(MASTER_VIEWPORT_HEIGHT);

  const recentlyAddedBillIdSet = useMemo(
    () => new Set(recentlyAddedBillIds),
    [recentlyAddedBillIds]
  );

  const handleMasterTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const nextScrollTop = e.currentTarget.scrollTop;
    const nextClientHeight = e.currentTarget.clientHeight;
    if (masterScrollRafRef.current !== null) {
      cancelAnimationFrame(masterScrollRafRef.current);
    }
    masterScrollRafRef.current = requestAnimationFrame(() => {
      setMasterTableScrollTop(nextScrollTop);
      if (nextClientHeight > 0 && nextClientHeight !== masterViewportHeight) {
        setMasterViewportHeight(nextClientHeight);
      }
      masterScrollRafRef.current = null;
    });
  };

  useEffect(() => {
    return () => {
      if (masterScrollRafRef.current !== null) {
        cancelAnimationFrame(masterScrollRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setMasterTableScrollTop(0);
    if (masterTableScrollRef.current) {
      masterTableScrollRef.current.scrollTop = 0;
    }
  }, [searchQuery, dateFilter, masterSheetMode]);

  useEffect(() => {
    const container = masterTableScrollRef.current;
    if (!container) return;
    const measureViewport = () => {
      if (container.clientHeight > 0) {
        setMasterViewportHeight(container.clientHeight);
      }
    };
    measureViewport();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measureViewport);
      observer.observe(container);
      return () => observer.disconnect();
    }
  }, [activeTab, masterSheetRows.length]);

  useEffect(() => {
    const maxScrollTop = Math.max(0, masterSheetRows.length * MASTER_ROW_HEIGHT - masterViewportHeight);
    if (masterTableScrollTop > maxScrollTop) {
      setMasterTableScrollTop(maxScrollTop);
    }
  }, [masterSheetRows.length, masterViewportHeight, masterTableScrollTop]);

  const virtualMasterWindow = useMemo(() => {
    const totalRows = masterSheetRows.length;
    if (totalRows === 0) {
      return {
        totalRows: 0,
        startIndex: 0,
        endIndex: 0,
        visibleRows: [] as typeof masterSheetRows,
        paddingTop: 0,
        paddingBottom: 0,
      };
    }
    const effectiveViewportHeight = masterViewportHeight > 0 ? masterViewportHeight : MASTER_VIEWPORT_HEIGHT;
    const rawStartIndex = Math.floor(masterTableScrollTop / MASTER_ROW_HEIGHT);
    const clampedStart = Math.min(rawStartIndex, Math.max(0, totalRows - 1));
    const startIndex = Math.max(0, clampedStart - MASTER_OVERSCAN);
    const visibleCount = Math.ceil(effectiveViewportHeight / MASTER_ROW_HEIGHT) + MASTER_OVERSCAN * 2;
    const endIndex = Math.min(totalRows, startIndex + visibleCount);
    const visibleRows = masterSheetRows.slice(startIndex, endIndex);
    const paddingTop = startIndex * MASTER_ROW_HEIGHT;
    const paddingBottom = Math.max(0, (totalRows - endIndex) * MASTER_ROW_HEIGHT);

    return {
      totalRows,
      startIndex,
      endIndex,
      visibleRows,
      paddingTop,
      paddingBottom,
    };
  }, [masterSheetRows, masterTableScrollTop, masterViewportHeight]);

  // ---------------------------------------------------------------------------
  // Real Multi-Sheet .XLSX Excel Export
  // ---------------------------------------------------------------------------
  const handleExportMasterExcelXlsx = () => {
    if (masterSheetRows.length === 0) {
      showToast('No bills in the sheet yet. Scan a bill first!');
      return;
    }

    const exportData: Record<string, string | number>[] = masterSheetRows.map((row, idx) => {
      const obj: Record<string, string | number> = { 'Sr. No': idx + 1 };
      activeSelectedColumnDefs.forEach((col) => {
        const cleanHeader = col.label.replace(' (Extra)', '');
        obj[cleanHeader] = row.cells[col.key] ?? '';
      });
      return obj;
    });

    const totalsRow: Record<string, string | number> = { 'Sr. No': 'TOTAL' };
    activeSelectedColumnDefs.forEach((col, i) => {
      const cleanHeader = col.label.replace(' (Extra)', '');
      if (col.isNumeric) {
        totalsRow[cleanHeader] = columnTotals[col.key] ?? 0;
      } else if (i === 0) {
        totalsRow[cleanHeader] = `GRAND TOTAL (${masterSheetRows.length} Bills)`;
      } else {
        totalsRow[cleanHeader] = '';
      }
    });
    exportData.push(totalsRow);

    const wb = XLSX.utils.book_new();
    const wsMaster = XLSX.utils.json_to_sheet(exportData);

    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length + 5, 18),
    }));
    wsMaster['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, wsMaster, 'LedgerSutra_Bills_Sheet');

    const textSheetData = filteredBills.map((b, i) => ({
      'Sr. No': i + 1,
      'Bill / File Name': b.fileName,
      'Bill Date': b.billDate,
      'Bill / Invoice No': b.invoiceNumber,
      'Shop / Party Name': b.shopName,
      'Seller GSTIN': b.sellerGstin,
      'Total Cost (₹)': b.grandTotal,
      'Exact Extracted Text': b.rawText,
    }));
    const wsText = XLSX.utils.json_to_sheet(textSheetData);
    XLSX.utils.book_append_sheet(wb, wsText, 'Exact_Extracted_Text');

    XLSX.writeFile(wb, `LedgerSutra_Bills_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast(`Exported ${masterSheetRows.length} rows to LedgerSutra Excel (.xlsx)!`);
  };

  const handleExportMasterCsv = () => {
    if (masterSheetRows.length === 0) {
      showToast('No bills in the sheet yet. Scan a bill first!');
      return;
    }
    const filename = `LedgerSutra_Bills_${new Date().toISOString().slice(0, 10)}.csv`;
    exportMasterRowsToCsv(masterSheetRows, activeSelectedColumnDefs, columnTotals, filename);
    showToast(`Exported ${masterSheetRows.length} rows to CSV (${filename})!`);
  };

  const handleExportMasterJson = () => {
    if (filteredBills.length === 0) {
      showToast('No bills in the sheet yet. Scan a bill first!');
      return;
    }
    const filename = `LedgerSutra_Invoices_${new Date().toISOString().slice(0, 10)}.json`;
    exportBillsToJsonFile(filteredBills, filename);
    showToast(`Exported ${filteredBills.length} structured invoices to JSON (${filename})!`);
  };

  const handleExportMasterSql = () => {
    if (filteredBills.length === 0) {
      showToast('No bills in the sheet yet. Scan a bill first!');
      return;
    }
    const filename = `LedgerSutra_Accounting_${new Date().toISOString().slice(0, 10)}.sql`;
    exportBillsToSqlFile(filteredBills, filename);
    showToast(`Exported ${filteredBills.length} invoices & line items to SQL (${filename})!`);
  };

  // Real-time CA Audit & Validation for Active Bill Draft
  const currentBillAudit = useMemo(
    () =>
      auditBillDraftOrRecord(
        {
          shopName,
          sellerGstin,
          buyerGstin,
          invoiceNumber,
          billDate,
          subtotal: calculatedSubtotal,
          taxAmount,
          discountAmount,
          grandTotal: calculatedGrandTotal,
          confidence: confidenceScore,
        },
        savedBills
      ),
    [
      shopName,
      sellerGstin,
      buyerGstin,
      invoiceNumber,
      billDate,
      calculatedSubtotal,
      taxAmount,
      discountAmount,
      calculatedGrandTotal,
      confidenceScore,
      savedBills,
    ]
  );

  // Supplier-Wise / GSTIN-Wise Summary Rollup for GSTR-2B Reconciliation
  const supplierSummaryRows = useMemo(() => computeSupplierSummary(filteredBills), [filteredBills]);

  const handleOpenWorkspaceTab = useCallback(
    (
      tab: 'scanner' | 'master_sheet' | 'dashboard' | 'history' = 'scanner',
      mode?: UserProfileMode
    ) => {
      if (mode) {
        handleSwitchUserMode(mode);
      }
      setActiveTab(tab);
      navigateTo('/app');
    },
    [navigateTo]
  );

  const handleExportTxt = (textToDownload: string, filename = 'Extracted_Exact_Text.txt') => {
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded exact text file: ${filename}`);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied 100% exact text to clipboard!');
  };

  const handleDeleteRecord = (id: string) => {
    setSavedBills((prev) => prev.filter((b) => b.id !== id));
    setSavedDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast(`Deleted record.`);
  };

  const currentPreviewImg = previewImages[activePageIndex] || null;
  const totalTaxableAllBills = savedBills.reduce((s, b) => s + (Number(b.subtotal) || 0), 0);
  const totalGstAllBills = savedBills.reduce((s, b) => s + (Number(b.taxAmount) || 0), 0);
  const totalGrandAllBills = savedBills.reduce((s, b) => s + (Number(b.grandTotal) || 0), 0);

  const [dashboardChartType, setDashboardChartType] = useState<'area' | 'bar'>('area');

  const monthlySpendingData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map = new Map<
      string,
      {
        yearMonthKey: string;
        month: string;
        totalSpend: number;
        taxableSpend: number;
        gstSpend: number;
        billCount: number;
      }
    >();

    savedBills.forEach((bill) => {
      const rawDate = (bill.billDate || bill.createdAt || '').trim();
      let year = new Date().getFullYear();
      let monthIndex = new Date().getMonth();

      // Match YYYY-MM-DD or YYYY/MM/DD
      const isoMatch = rawDate.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
      // Match DD/MM/YYYY or DD-MM-YYYY
      const dmyMatch = rawDate.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/);

      if (isoMatch) {
        year = Number(isoMatch[1]);
        monthIndex = Math.max(0, Math.min(11, Number(isoMatch[2]) - 1));
      } else if (dmyMatch) {
        const yRaw = dmyMatch[3];
        year = yRaw.length === 2 ? Number(`20${yRaw}`) : Number(yRaw);
        monthIndex = Math.max(0, Math.min(11, Number(dmyMatch[2]) - 1));
      } else {
        const parsed = new Date(rawDate);
        if (!Number.isNaN(parsed.getTime())) {
          year = parsed.getFullYear();
          monthIndex = parsed.getMonth();
        }
      }

      const yearMonthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
      const label = `${monthNames[monthIndex]} ${year}`;

      const existing = map.get(yearMonthKey) || {
        yearMonthKey,
        month: label,
        totalSpend: 0,
        taxableSpend: 0,
        gstSpend: 0,
        billCount: 0,
      };

      existing.totalSpend = Number((existing.totalSpend + (Number(bill.grandTotal) || 0)).toFixed(2));
      existing.taxableSpend = Number((existing.taxableSpend + (Number(bill.subtotal) || 0)).toFixed(2));
      existing.gstSpend = Number((existing.gstSpend + (Number(bill.taxAmount) || 0)).toFixed(2));
      existing.billCount += 1;

      map.set(yearMonthKey, existing);
    });

    return Array.from(map.values()).sort((a, b) => a.yearMonthKey.localeCompare(b.yearMonthKey));
  }, [savedBills]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-400/30 text-sm font-medium max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-indigo-200 hover:text-white ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navigation Header — Rebranded to LedgerSutra (https://casaarthiai.in) */}
      <header className="sticky top-0 z-30 bg-[var(--bg-header)] backdrop-blur-md border-b border-[var(--border-color)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div
            onClick={() => navigateTo('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight group-hover:text-indigo-500 transition-colors">
                  {BRAND_NAME}
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3" /> CA Invoice & GST Automation
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] hidden sm:block">
                {BRAND_TAGLINE}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* SaaS Route Links */}
            <div className="hidden md:flex items-center gap-1 mr-1 text-xs font-semibold">
              <button
                onClick={() => navigateTo('/')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPath === '/'
                    ? 'text-indigo-500 bg-indigo-500/10 font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('/app')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPath === '/app'
                    ? 'text-indigo-500 bg-indigo-500/10 font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Workspace
              </button>
              <button
                onClick={() => navigateTo('/features')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPath === '/features'
                    ? 'text-indigo-500 bg-indigo-500/10 font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => navigateTo('/invoice-ocr-for-ca')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPath === '/invoice-ocr-for-ca'
                    ? 'text-indigo-500 bg-indigo-500/10 font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                CA OCR
              </button>
              <button
                onClick={() => navigateTo('/resources')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPath.startsWith('/resources')
                    ? 'text-indigo-500 bg-indigo-500/10 font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => navigateTo('/pricing')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPath === '/pricing'
                    ? 'text-indigo-500 bg-indigo-500/10 font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Pricing
              </button>
            </div>

            {/* Application Tool Tabs */}
            <nav className="hidden lg:flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-xl border border-[var(--border-color)]">
              <button
                onClick={() => {
                  setActiveTab('scanner');
                  const wsEl = document.getElementById('live-ocr-workspace');
                  if (wsEl) wsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'scanner'
                    ? 'bg-[var(--bg-card)] text-indigo-500 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <ScanLine className="w-3.5 h-3.5" />
                1. Scan Bill / PDF
              </button>
              <button
                onClick={() => {
                  setActiveTab('master_sheet');
                  const wsEl = document.getElementById('live-ocr-workspace');
                  if (wsEl) wsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'master_sheet'
                    ? 'bg-[var(--bg-card)] text-indigo-500 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                2. Excel Sheet ({savedBills.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  const wsEl = document.getElementById('live-ocr-workspace');
                  if (wsEl) wsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[var(--bg-card)] text-indigo-500 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                3. Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab('history');
                  const wsEl = document.getElementById('live-ocr-workspace');
                  if (wsEl) wsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[var(--bg-card)] text-indigo-500 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                4. Text History
              </button>
            </nav>

            <button
              onClick={toggleTheme}
              aria-label="Toggle Light/Dark Theme"
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-main)] text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around border-t border-[var(--border-color)] bg-[var(--bg-card)] px-2 py-1.5">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex flex-1 justify-center items-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold ${
              activeTab === 'scanner' ? 'bg-indigo-600/10 text-indigo-500' : 'text-[var(--text-muted)]'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" />
            Scanner
          </button>
          <button
            onClick={() => setActiveTab('master_sheet')}
            className={`flex flex-1 justify-center items-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold ${
              activeTab === 'master_sheet' ? 'bg-indigo-600/10 text-indigo-500' : 'text-[var(--text-muted)]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Excel ({savedBills.length})
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-1 justify-center items-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold ${
              activeTab === 'dashboard' ? 'bg-indigo-600/10 text-indigo-500' : 'text-[var(--text-muted)]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-1 justify-center items-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold ${
              activeTab === 'history' ? 'bg-indigo-600/10 text-indigo-500' : 'text-[var(--text-muted)]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Text
          </button>
          <button
            onClick={() => navigateTo('/resources')}
            className={`flex flex-1 justify-center items-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold ${
              currentPath.startsWith('/resources') ? 'bg-indigo-600/10 text-indigo-500' : 'text-[var(--text-muted)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Guides
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-8">
        {/* Section 1: Hero Banner at the top of the root Homepage ('/') */}
        {currentPath === '/' && (
          <LedgerSutraHeroBanner
            onOpenWorkspaceTab={handleOpenWorkspaceTab}
            onTriggerUpload={() => fileInputRef.current?.click()}
            savedBillsCount={savedBills.length}
          />
        )}

        {/* Render Dedicated Marketing/SEO/Resource Page View when visiting non-root / non-app routes */}
        {currentPath !== '/' && currentPath !== '/app' && (
          <LedgerSutraRouteView
            currentPath={currentPath}
            onNavigate={navigateTo}
            onOpenWorkspaceTab={handleOpenWorkspaceTab}
            savedBillsCount={savedBills.length}
          />
        )}

        {/* LIVE INTERACTIVE OCR, GST VALIDATION & EXCEL WORKSPACE */}
        <div id="live-ocr-workspace" className="space-y-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                {BRAND_NAME} Live Invoice OCR, GST Audit &amp; Multi-Format Excel Workspace
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--text-muted)]">
                Active Register: <strong>{savedBills.length} Bills</strong>
              </span>
              {currentPath !== '/app' && (
                <button
                  onClick={() => navigateTo('/app')}
                  className="text-indigo-500 hover:underline font-bold cursor-pointer"
                >
                  Focus Mode (/app) →
                </button>
              )}
            </div>
          </div>
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            {/* Top Action Bar: Mode Switcher (Normal User vs CA) + File Upload */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-muted)]">Select Mode:</span>
                    <button
                      onClick={() => handleSwitchUserMode('normal_user')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        userMode === 'normal_user'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Normal User Mode (1 Row per Bill + Grocery Product Columns)
                    </button>
                    <button
                      onClick={() => handleSwitchUserMode('ca_mode')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        userMode === 'ca_mode'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      CA / GST Audit Mode (Specific GST Columns)
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] pt-1">
                    {userMode === 'normal_user'
                      ? 'Normal User Mode: Each uploaded bill creates 1 single row (Bill Name, Date, Bill No, Shop Name & Total Cost). If a bill has multiple products (like Grocery Shopping), Product 1, Product 2... columns expand automatically!'
                      : 'CA Mode: Extracts specific accounting columns (Bill Name, Date, Invoice No, Seller GSTIN, Taxable Value, CGST, SGST, IGST & Grand Total) and merges multiple bills into one Excel sheet.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadedFileName ? 'Upload Next PDF / Image Bill' : 'Upload PDF / Image Bill'}
                  </button>

                  <input
                    ref={excelImportInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleImportExistingExcel}
                    className="hidden"
                  />
                  <button
                    onClick={() => excelImportInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
                    title="Select an existing Excel sheet to append newly scanned bills into it"
                  >
                    <FilePlus2 className="w-4 h-4" />
                    Append to Existing Excel (.xlsx)
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Scanning Progress Banner */}
            {isProcessing && (
              <div className="bg-[var(--bg-card)] rounded-2xl border-2 border-indigo-500/40 p-5 shadow-lg animate-pulse-glow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500 shrink-0">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                          {batchStatusText || `Stage ${scanStepIndex + 1} of ${SCANNING_STEPS.length} (${ocrProgressPercent}%)`}
                        </span>
                      </div>
                      <h3 className="text-base font-bold mt-0.5">{SCANNING_STEPS[scanStepIndex]?.title}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{SCANNING_STEPS[scanStepIndex]?.subtitle}</p>
                    </div>
                  </div>
                  <div className="w-full md:w-64">
                    <div className="w-full h-2.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 transition-all duration-300"
                        style={{ width: `${Math.max(15, ocrProgressPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main 2-Column Workspace: Left = Visual Preview + Exact Text, Right = Bill Summary & Items */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN (5 cols): Document Preview & 100% Exact Text Output */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-xs">
                  <div className="px-4 py-3 border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-2 bg-[var(--bg-subtle)]">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-bold">Document Preview</span>
                      {uploadedFileName && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-medium truncate max-w-[180px]">
                          {uploadedFileName}
                        </span>
                      )}
                    </div>

                    {previewImages.length > 1 && (
                      <div className="flex items-center gap-1.5 bg-[var(--bg-card)] px-2 py-1 rounded-lg border border-[var(--border-color)]">
                        <button
                          onClick={() => setActivePageIndex((p) => Math.max(0, p - 1))}
                          disabled={activePageIndex === 0}
                          className="p-0.5 disabled:opacity-40 hover:text-indigo-500 cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-bold">
                          Page {activePageIndex + 1} / {previewImages.length}
                        </span>
                        <button
                          onClick={() => setActivePageIndex((p) => Math.min(previewImages.length - 1, p + 1))}
                          disabled={activePageIndex === previewImages.length - 1}
                          className="p-0.5 disabled:opacity-40 hover:text-indigo-500 cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-[var(--bg-subtle)]">
                    {!currentPreviewImg ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[var(--border-color)] hover:border-indigo-500/60 rounded-2xl p-8 text-center cursor-pointer transition-all bg-[var(--bg-card)]"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-3">
                          <Upload className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold">Click to Upload PDF or Image Bill</h3>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          Upload 1st, 2nd, or multiple PDFs/Images back-to-back without reloading
                        </p>
                      </div>
                    ) : (
                      <div className="relative rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden flex items-center justify-center min-h-[260px] max-h-[380px]">
                        {isProcessing && (
                          <>
                            <div className="scan-line-glow-sweep" />
                            <div className="laser-scan-line" />
                          </>
                        )}
                        <img
                          src={currentPreviewImg}
                          alt="Document page preview"
                          className="max-h-[360px] w-auto object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 100% Exact Verbatim Extracted Text Box */}
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                        Exact Image / PDF to Text Output
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Instant text extraction — copy or download as .TXT
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={handleDeepReScanExactText}
                        disabled={previewImages.length === 0 || isProcessing}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 disabled:opacity-40 text-[11px] font-semibold border border-indigo-500/20 cursor-pointer"
                        title="Re-scan visual page image with High-DPI AI Vision OCR"
                      >
                        <Sparkles className="w-3 h-3" /> Deep Enhance Text
                      </button>
                      <button
                        onClick={() => handleCopyText(extractedText)}
                        disabled={!extractedText.trim()}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-indigo-500/10 hover:text-indigo-500 disabled:opacity-40 text-[11px] font-semibold border border-[var(--border-color)] cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> Copy Text
                      </button>
                      <button
                        onClick={() =>
                          handleExportTxt(
                            extractedText,
                            `${(uploadedFileName || 'Document').replace(/\.[^.]+$/, '')}_Exact_Text.txt`
                          )
                        }
                        disabled={!extractedText.trim()}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-indigo-500/10 hover:text-indigo-500 disabled:opacity-40 text-[11px] font-semibold border border-[var(--border-color)] cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> .TXT
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    rows={11}
                    placeholder="Upload any PDF or Image above — complete readable text will appear here..."
                    className="w-full rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] p-3 font-mono text-xs leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN (7 cols): Bill Details & Expandable Product Columns */}
              <div className="lg:col-span-7 space-y-5">
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 shadow-xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold">
                            {userMode === 'normal_user'
                              ? 'Bill Summary & Grocery/Product Details'
                              : 'CA GST Bill & Dynamic NoSQL Fields'}
                          </h3>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            1 Bill = 1 Row in Excel
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          {billItems.length > 1
                            ? `Multiple products detected (${billItems.length} items) — Product 1..Product ${billItems.length} columns automatically added!`
                            : 'Single-cost bill — only Bill Name, Date, Shop Name & Total Cost are added without extra rows.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowNoSqlJsonModal(true)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-indigo-500/10 text-[11px] font-semibold border border-[var(--border-color)] cursor-pointer"
                      >
                        <Code2 className="w-3.5 h-3.5 text-indigo-500" /> NoSQL JSON
                      </button>
                      <button
                        onClick={() => setActiveTab('master_sheet')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold shadow-xs cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        View Merged Excel Sheet ({savedBills.length} Bills)
                      </button>
                    </div>
                  </div>

                  {/* Core Bill Identification Fields (Which Bill, Date, Bill No, Shop Name, GSTIN) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                        Bill / File Name
                      </label>
                      <input
                        type="text"
                        value={uploadedFileName || ''}
                        onChange={(e) => setUploadedFileName(e.target.value)}
                        placeholder="e.g. Grocery_Bill_Oct.pdf"
                        className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                        Shop / Party Name
                      </label>
                      <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="e.g. D-Mart / Reliance Smart"
                        className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                        Bill / Invoice No
                      </label>
                      <input
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        placeholder="e.g. INV-2026-104"
                        className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                        Bill Date
                      </label>
                      <input
                        type="date"
                        value={billDate}
                        onChange={(e) => setBillDate(e.target.value)}
                        className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                        Seller GSTIN (15-Char)
                      </label>
                      <input
                        type="text"
                        value={sellerGstin}
                        onChange={(e) => setSellerGstin(e.target.value.toUpperCase())}
                        placeholder="e.g. 24ABCDE1234F1Z5"
                        className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                        Buyer GSTIN / State
                      </label>
                      <input
                        type="text"
                        value={buyerGstin || placeOfSupply}
                        onChange={(e) => setBuyerGstin(e.target.value.toUpperCase())}
                        placeholder="Optional Buyer GSTIN"
                        className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Real-Time CA GSTIN, Duplicate & Tax Math Validation Panel */}
                  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-3.5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-[var(--text-main)]">
                        <ShieldCheck className="w-4 h-4 text-indigo-500" />
                        CA Pre-Accounting Validation &amp; GST Audit Status
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                          currentBillAudit.status === 'VERIFIED'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : currentBillAudit.status === 'EXCEPTION'
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}
                      >
                        {currentBillAudit.status === 'VERIFIED'
                          ? 'GST & Math Verified'
                          : currentBillAudit.status === 'EXCEPTION'
                          ? 'Audit Exception Flagged'
                          : 'Review Recommended'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentBillAudit.flags.map((flag, fIdx) => (
                        <div
                          key={fIdx}
                          className={`p-2 rounded-lg border text-[11px] flex items-start gap-2 ${
                            flag.severity === 'ok'
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : flag.severity === 'error'
                              ? 'bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400'
                              : 'bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {flag.severity === 'ok' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-bold block">{flag.label}</span>
                            <span className="opacity-85 leading-snug block">{flag.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Products / Items List in this Bill */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Products / Items in this Bill ({billItems.length})
                        </label>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          If multiple products exist (like Grocery Shopping), each product automatically gets its own column in the Merged Sheet!
                        </p>
                      </div>
                      <button
                        onClick={handleAddItemRow}
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-500/10 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Product
                      </button>
                    </div>

                    <div className="border border-[var(--border-color)] rounded-xl overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[540px]">
                        <thead>
                          <tr className="bg-[var(--bg-subtle)] text-[10px] font-bold uppercase text-[var(--text-muted)] border-b border-[var(--border-color)]">
                            <th className="py-2 px-2.5 w-10">#</th>
                            <th className="py-2 px-2.5">Product / Item Name</th>
                            {userMode === 'ca_mode' && <th className="py-2 px-2 w-20">HSN/SAC</th>}
                            <th className="py-2 px-2 w-16 text-right">Qty</th>
                            <th className="py-2 px-2 w-24 text-right">Rate (₹)</th>
                            {userMode === 'ca_mode' && <th className="py-2 px-2 w-16 text-right">GST%</th>}
                            <th className="py-2 px-2.5 w-28 text-right">Amount (₹)</th>
                            <th className="py-2 px-2 w-8"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)] text-xs">
                          <AnimatePresence initial={false}>
                            {billItems.length === 0 ? (
                              <tr>
                                <td colSpan={8} className="py-5 text-center text-xs text-[var(--text-muted)]">
                                  Upload a bill to extract products or total cost automatically.
                                </td>
                              </tr>
                            ) : (
                              billItems.map((item, idx) => (
                                <motion.tr
                                  key={item.id}
                                  initial={{ opacity: 0, x: -14, y: -4 }}
                                  animate={{ opacity: 1, x: 0, y: 0 }}
                                  exit={{ opacity: 0, x: 14 }}
                                  transition={{
                                    duration: 0.26,
                                    ease: [0.22, 1, 0.36, 1],
                                    delay: Math.min(idx * 0.03, 0.2),
                                  }}
                                  className="excel-row-slide-in hover:bg-[var(--bg-subtle)]/60"
                                >
                                  <td className="p-1.5 px-2.5 font-mono text-[11px] text-[var(--text-muted)]">
                                    P{idx + 1}
                                  </td>
                                  <td className="p-1.5">
                                    <input
                                      type="text"
                                      value={item.itemName}
                                      onChange={(e) => handleUpdateItem(item.id, 'itemName', e.target.value)}
                                      className="w-full bg-transparent px-2 py-1 rounded border border-transparent focus:border-indigo-500 focus:bg-[var(--bg-card)] focus:outline-none font-medium"
                                    />
                                  </td>
                                  {userMode === 'ca_mode' && (
                                    <td className="p-1.5">
                                      <input
                                        type="text"
                                        value={item.hsnSac}
                                        onChange={(e) => handleUpdateItem(item.id, 'hsnSac', e.target.value)}
                                        placeholder="HSN"
                                        className="w-full bg-transparent px-1.5 py-1 rounded border border-transparent focus:border-indigo-500 focus:bg-[var(--bg-card)] font-mono text-[11px]"
                                      />
                                    </td>
                                  )}
                                  <td className="p-1.5">
                                    <input
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                                      className="w-full text-right bg-transparent px-1.5 py-1 rounded border border-transparent focus:border-indigo-500 focus:bg-[var(--bg-card)] font-mono"
                                    />
                                  </td>
                                  <td className="p-1.5">
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={item.unitPrice}
                                      onChange={(e) => handleUpdateItem(item.id, 'unitPrice', e.target.value)}
                                      className="w-full text-right bg-transparent px-1.5 py-1 rounded border border-transparent focus:border-indigo-500 focus:bg-[var(--bg-card)] font-mono"
                                    />
                                  </td>
                                  {userMode === 'ca_mode' && (
                                    <td className="p-1.5">
                                      <input
                                        type="number"
                                        value={item.gstRate}
                                        onChange={(e) => handleUpdateItem(item.id, 'gstRate', e.target.value)}
                                        className="w-full text-right bg-transparent px-1.5 py-1 rounded border border-transparent focus:border-indigo-500 focus:bg-[var(--bg-card)] font-mono"
                                      />
                                    </td>
                                  )}
                                  <td className="p-1.5 text-right font-mono font-bold pr-2.5">
                                    ₹{Number(item.lineTotal || 0).toFixed(2)}
                                  </td>
                                  <td className="p-1.5 text-center">
                                    <button
                                      onClick={() => handleRemoveItem(item.id)}
                                      className="text-[var(--text-muted)] hover:text-rose-500 p-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </motion.tr>
                              ))
                            )}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary Totals & Save Action */}
                  <div className="bg-[var(--bg-subtle)] rounded-xl p-4 border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="block text-[var(--text-muted)]">Net / Subtotal</span>
                        <span className="font-mono font-bold text-sm">₹{calculatedSubtotal.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="block text-[var(--text-muted)]">Tax / GST</span>
                        <input
                          type="number"
                          step="0.01"
                          value={taxAmount}
                          onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
                          className="w-24 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-2 py-0.5 font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <span className="block text-[var(--text-muted)]">Total Bill Cost</span>
                        <span className="font-mono font-black text-base text-indigo-500">
                          ₹{calculatedGrandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleSaveCurrentToMasterSheet}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add Bill Row to Sheet
                      </button>
                      <button
                        onClick={handleExportMasterExcelXlsx}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Download Excel (.XLSX)
                      </button>
                    </div>
                  </div>

                  {/* Duplicate Invoice Warning & Merge Suggestion Banner */}
                  {pendingDuplicateSave && (
                    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                              Duplicate Invoice &amp; Vendor Combination Detected
                            </h4>
                            <p className="text-xs text-[var(--text-main)] mt-0.5 leading-relaxed">
                              An entry for Invoice{' '}
                              <span className="font-mono font-bold text-indigo-500">
                                {pendingDuplicateSave.existingBill.invoiceNumber}
                              </span>{' '}
                              from{' '}
                              <span className="font-bold">
                                {pendingDuplicateSave.existingBill.shopName}
                              </span>{' '}
                              already exists in your Master Sheet (dated{' '}
                              <span className="font-mono">{pendingDuplicateSave.existingBill.billDate}</span>,{' '}
                              {pendingDuplicateSave.existingBill.items.length} item(s), Total:{' '}
                              <span className="font-mono font-bold">
                                ₹{pendingDuplicateSave.existingBill.grandTotal.toFixed(2)}
                              </span>
                              ). Would you like to merge these items into the existing bill or add a separate row?
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setPendingDuplicateSave(null)}
                          className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 cursor-pointer"
                          title="Dismiss Warning"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={handleMergePendingIntoExistingBill}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          Merge Items &amp; Totals into Existing Row (₹
                          {(
                            pendingDuplicateSave.existingBill.grandTotal +
                            pendingDuplicateSave.newBill.grandTotal
                          ).toFixed(2)}
                          )
                        </button>
                        <button
                          onClick={handleReplaceExistingBillWithPending}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Overwrite Existing Row
                        </button>
                        <button
                          onClick={handleForceAddPendingDuplicate}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-main)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add as Separate Row Anyway
                        </button>
                        <button
                          onClick={() => setPendingDuplicateSave(null)}
                          className="px-3 py-2 rounded-lg text-xs font-semibold text-[var(--text-muted)] hover:text-rose-500 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: MERGED EXCEL SHEET (1 ROW PER BILL + DYNAMIC PRODUCT COLUMNS)  */}
        {/* ===================================================================== */}
        {activeTab === 'master_sheet' && (
          <div className="space-y-6">
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 shadow-xs space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                      1 Bill = 1 Row • Dynamic Product Columns
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {savedBills.length} Bills Added • {activeSelectedColumnDefs.length} Active Columns
                    </span>
                  </div>
                  <h2 className="text-lg font-bold mt-1">
                    {BRAND_NAME} Merged Excel Register (Normal User &amp; CA GST Audit)
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Every bill is stored on a single row with its Bill Name, Date, Bill No, Shop Name, GSTIN &amp; Total Cost. Bills with multiple products automatically expand Product 1, Product 2... columns!
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Scan &amp; Add Next Bill
                  </button>
                  <button
                    onClick={() => excelImportInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-indigo-500/10 text-xs font-semibold border border-[var(--border-color)] cursor-pointer"
                  >
                    <FilePlus2 className="w-4 h-4 text-emerald-500" /> Append Existing .XLSX
                  </button>
                  <button
                    onClick={handleExportMasterExcelXlsx}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> .XLSX
                  </button>
                  <button
                    onClick={handleExportMasterCsv}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-indigo-500/10 text-xs font-bold border border-[var(--border-color)] cursor-pointer"
                    title="Export Register as UTF-8 CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-500" /> .CSV
                  </button>
                  <button
                    onClick={handleExportMasterJson}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-indigo-500/10 text-xs font-bold border border-[var(--border-color)] cursor-pointer"
                    title="Export Structured Invoices as JSON"
                  >
                    <Code2 className="w-3.5 h-3.5 text-indigo-500" /> .JSON
                  </button>
                  <button
                    onClick={handleExportMasterSql}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-indigo-500/10 text-xs font-bold border border-[var(--border-color)] cursor-pointer"
                    title="Export Relational SQL CREATE TABLE + INSERT Script"
                  >
                    <Database className="w-3.5 h-3.5 text-indigo-500" /> .SQL
                  </button>
                </div>
              </div>

              {/* Column Presets & Checkboxes */}
              <div className="bg-[var(--bg-subtle)] rounded-xl p-4 border border-[var(--border-color)] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Columns className="w-4 h-4 text-indigo-500" />
                    Select Columns to Show & Export ({activeSelectedColumnDefs.length} Columns):
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => handleSwitchUserMode('normal_user')}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border cursor-pointer ${
                        userMode === 'normal_user'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)]'
                      }`}
                    >
                      Normal User (Bill, Date, Cost + Grocery Products)
                    </button>
                    <button
                      onClick={() => handleSwitchUserMode('ca_mode')}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border cursor-pointer ${
                        userMode === 'ca_mode'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-[var(--bg-card)] border-[var(--border-color)]'
                      }`}
                    >
                      CA GST Summary (GSTIN, Taxable, CGST, SGST, Total)
                    </button>
                    <button
                      onClick={() => setSelectedColumnKeys(allAvailableColumns.map((c) => c.key))}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 cursor-pointer"
                    >
                      Select All Columns
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {allAvailableColumns.map((col) => {
                    const checked = selectedColumnKeys.includes(col.key);
                    const isProd = col.category === 'MULTI_PRODUCT';
                    return (
                      <label
                        key={col.key}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer select-none transition-all ${
                          checked
                            ? isProd
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedColumnKeys((prev) =>
                              prev.includes(col.key) ? prev.filter((k) => k !== col.key) : [...prev, col.key]
                            );
                          }}
                          className="hidden"
                        />
                        {checked && <Check className="w-3 h-3" />}
                        <span>{col.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Row Mode Switcher & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5 bg-[var(--bg-subtle)] p-1 rounded-xl border border-[var(--border-color)] w-fit">
                  <button
                    onClick={() => {
                      setShowSupplierSummary(false);
                      setMasterSheetMode('bill_wise');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !showSupplierSummary && masterSheetMode === 'bill_wise'
                        ? 'bg-indigo-600 text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    1 Bill = 1 Row (Summary)
                  </button>
                  <button
                    onClick={() => {
                      setShowSupplierSummary(false);
                      setMasterSheetMode('item_wise');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !showSupplierSummary && masterSheetMode === 'item_wise'
                        ? 'bg-indigo-600 text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    CA Detailed Line-Item Rows
                  </button>
                  <button
                    onClick={() => setShowSupplierSummary(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      showSupplierSummary
                        ? 'bg-emerald-600 text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Supplier-Wise GSTR Rollup ({supplierSummaryRows.length})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search bill, shop, GSTIN, product..."
                      className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Supplier-Wise / GSTIN-Wise Summary Table (when toggled) */}
              {showSupplierSummary && (
                <div className="border border-emerald-500/30 rounded-xl overflow-x-auto bg-emerald-500/5 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-500">
                      Supplier-Wise / GSTIN-Wise Summary for GSTR-2B Reconciliation
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Grouped by Normalized 15-Char Seller GSTIN or Vendor Name
                    </span>
                  </div>
                  <table className="w-full text-left border-collapse text-xs bg-[var(--bg-card)] rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-[var(--bg-subtle)] text-[11px] font-bold uppercase text-[var(--text-muted)] border-b border-[var(--border-color)]">
                        <th className="py-2.5 px-3">Supplier / Party Name</th>
                        <th className="py-2.5 px-3">Seller GSTIN</th>
                        <th className="py-2.5 px-3">GST State</th>
                        <th className="py-2.5 px-3 text-right">Bills</th>
                        <th className="py-2.5 px-3 text-right">Taxable (₹)</th>
                        <th className="py-2.5 px-3 text-right">Total GST (₹)</th>
                        <th className="py-2.5 px-3 text-right">Grand Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {supplierSummaryRows.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-[var(--text-muted)]">
                            No supplier records yet. Scan bills to generate GSTR vendor summaries.
                          </td>
                        </tr>
                      ) : (
                        supplierSummaryRows.map((sup) => (
                          <tr key={sup.supplierKey} className="hover:bg-[var(--bg-subtle)]/50">
                            <td className="py-2.5 px-3 font-bold">{sup.shopName}</td>
                            <td className="py-2.5 px-3 font-mono">
                              <span
                                className={
                                  sup.gstinValid ? 'text-emerald-500 font-semibold' : 'text-amber-500'
                                }
                              >
                                {sup.sellerGstin}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-[var(--text-muted)]">{sup.stateName}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{sup.invoiceCount}</td>
                            <td className="py-2.5 px-3 text-right font-mono">₹{sup.totalTaxable.toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-amber-500">
                              ₹{sup.totalTax.toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-500">
                              ₹{sup.totalGrand.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Master Spreadsheet Table (Virtualized for High-Volume CA Ledgers) */}
              {masterSheetRows.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                    <span>
                      Virtualized Grid: Showing rows{' '}
                      <strong className="text-[var(--text-main)] font-mono">
                        {virtualMasterWindow.startIndex + 1}–{virtualMasterWindow.endIndex}
                      </strong>{' '}
                      of{' '}
                      <strong className="text-[var(--text-main)] font-mono">
                        {masterSheetRows.length.toLocaleString('en-IN')}
                      </strong>{' '}
                      ({virtualMasterWindow.visibleRows.length} active DOM rows)
                    </span>
                  </div>
                  {masterSheetRows.length > 15 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (masterTableScrollRef.current) {
                            masterTableScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="px-2 py-0.5 rounded bg-[var(--bg-card)] hover:bg-indigo-500/10 border border-[var(--border-color)] text-[10px] font-semibold text-[var(--text-main)] cursor-pointer"
                      >
                        Jump to Top
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (masterTableScrollRef.current) {
                            masterTableScrollRef.current.scrollTo({
                              top: masterTableScrollRef.current.scrollHeight,
                              behavior: 'smooth',
                            });
                          }
                        }}
                        className="px-2 py-0.5 rounded bg-[var(--bg-card)] hover:bg-indigo-500/10 border border-[var(--border-color)] text-[10px] font-semibold text-[var(--text-main)] cursor-pointer"
                      >
                        Jump to Bottom
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div
                ref={masterTableScrollRef}
                onScroll={handleMasterTableScroll}
                className="border border-[var(--border-color)] rounded-xl overflow-auto max-h-[560px] relative"
              >
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-[var(--bg-subtle)] shadow-2xs">
                    <tr className="bg-[var(--bg-subtle)] text-[11px] font-bold uppercase text-[var(--text-muted)] border-b border-[var(--border-color)]">
                      <th className="py-3 px-3 w-12">#</th>
                      {activeSelectedColumnDefs.map((col) => (
                        <th
                          key={col.key}
                          className={`py-3 px-3 whitespace-nowrap ${col.isNumeric ? 'text-right' : ''} ${
                            col.category === 'MULTI_PRODUCT' ? 'text-emerald-500' : ''
                          }`}
                        >
                          {col.label.replace(' (Extra)', '')}
                        </th>
                      ))}
                      <th className="py-3 px-3 text-right w-16">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)] text-xs">
                    {masterSheetRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={activeSelectedColumnDefs.length + 2}
                          className="py-12 text-center text-[var(--text-muted)]"
                        >
                          No bills added yet. Upload a PDF or Image bill in the Scanner tab to add your first row!
                        </td>
                      </tr>
                    ) : (
                      <>
                        {virtualMasterWindow.paddingTop > 0 && (
                          <tr aria-hidden="true" style={{ height: `${virtualMasterWindow.paddingTop}px` }}>
                            <td colSpan={activeSelectedColumnDefs.length + 2} className="p-0 border-0" />
                          </tr>
                        )}
                        {virtualMasterWindow.visibleRows.map((row, visibleIdx) => {
                          const idx = virtualMasterWindow.startIndex + visibleIdx;
                          const isNewlyAdded = recentlyAddedBillIdSet.has(row.billId);
                          return (
                            <tr
                              key={row.id}
                              style={{ height: `${MASTER_ROW_HEIGHT}px` }}
                              className={`${
                                isNewlyAdded ? 'excel-row-newly-added' : 'excel-row-slide-in'
                              } hover:bg-[var(--bg-subtle)]/60`}
                            >
                              <td className="py-2 px-3 font-mono text-[var(--text-muted)] whitespace-nowrap">
                                <span className="inline-flex items-center gap-1.5">
                                  <span>{idx + 1}</span>
                                  {isNewlyAdded && (
                                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                                      NEW
                                    </span>
                                  )}
                                </span>
                              </td>
                              {activeSelectedColumnDefs.map((col) => {
                                const val = row.cells[col.key];
                                const formattedVal =
                                  col.isNumeric && typeof val === 'number'
                                    ? col.key === 'quantity' || col.key === 'gstRate'
                                      ? String(val)
                                      : `₹${val.toFixed(2)}`
                                    : val !== undefined && val !== ''
                                    ? String(val)
                                    : '-';
                                return (
                                  <td
                                    key={col.key}
                                    title={formattedVal}
                                    className={`py-2 px-3 whitespace-nowrap max-w-[260px] truncate ${
                                      col.isNumeric ? 'text-right font-mono font-semibold' : ''
                                    } ${col.key === 'grandTotal' ? 'text-indigo-500 font-bold' : ''}`}
                                  >
                                    {formattedVal}
                                  </td>
                                );
                              })}
                              <td className="py-2 px-3 text-right whitespace-nowrap">
                                <button
                                  onClick={() => handleDeleteRecord(row.billId)}
                                  title="Remove Bill from Sheet"
                                  className="text-[var(--text-muted)] hover:text-rose-500 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {virtualMasterWindow.paddingBottom > 0 && (
                          <tr aria-hidden="true" style={{ height: `${virtualMasterWindow.paddingBottom}px` }}>
                            <td colSpan={activeSelectedColumnDefs.length + 2} className="p-0 border-0" />
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                  {masterSheetRows.length > 0 && (
                    <tfoot className="sticky bottom-0 z-10 bg-[var(--bg-card)] shadow-[0_-1px_0_var(--border-color)]">
                      <tr className="bg-indigo-600/10 border-t-2 border-indigo-500/30 font-bold text-xs">
                        <td className="py-3 px-3 text-indigo-500">SUM</td>
                        {activeSelectedColumnDefs.map((col, i) => (
                          <td
                            key={col.key}
                            className={`py-3 px-3 ${col.isNumeric ? 'text-right font-mono text-indigo-500' : ''}`}
                          >
                            {col.isNumeric
                              ? col.key === 'quantity'
                                ? columnTotals[col.key]
                                : col.key === 'gstRate'
                                ? '-'
                                : `₹${(columnTotals[col.key] || 0).toFixed(2)}`
                              : i === 0
                              ? `TOTAL (${masterSheetRows.length} Bills)`
                              : ''}
                          </td>
                        ))}
                        <td />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: DASHBOARD                                                      */}
        {/* ===================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-color)] shadow-xs">
                <span className="text-xs font-semibold text-[var(--text-muted)]">Total Bills Scanned</span>
                <p className="text-3xl font-black mt-2">{savedBills.length}</p>
                <p className="text-xs text-emerald-500 mt-1">1 Row per Bill in Sheet</p>
              </div>
              <div className="bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-color)] shadow-xs">
                <span className="text-xs font-semibold text-[var(--text-muted)]">Total Taxable / Net</span>
                <p className="text-2xl font-black mt-2 font-mono">₹{totalTaxableAllBills.toFixed(2)}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Before Taxes</p>
              </div>
              <div className="bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-color)] shadow-xs">
                <span className="text-xs font-semibold text-[var(--text-muted)]">Total GST / Tax</span>
                <p className="text-2xl font-black mt-2 font-mono text-amber-500">₹{totalGstAllBills.toFixed(2)}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Combined GST</p>
              </div>
              <div className="bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-color)] shadow-xs">
                <span className="text-xs font-semibold text-[var(--text-muted)]">Total Spend / Grand Total</span>
                <p className="text-2xl font-black mt-2 font-mono text-indigo-500">₹{totalGrandAllBills.toFixed(2)}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Across All Merged Bills</p>
              </div>
            </div>

            {/* Monthly Spending Trends Chart (Recharts) */}
            <div className="bg-[var(--bg-card)] p-5 sm:p-6 rounded-2xl border border-[var(--border-color)] shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                    Monthly Spending Trends
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Visualizes monthly Grand Total, Taxable Value, and GST from your saved bills ({monthlySpendingData.length}{' '}
                    active month{monthlySpendingData.length === 1 ? '' : 's'})
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-[var(--bg-subtle)] p-1 rounded-xl border border-[var(--border-color)] self-start sm:self-auto">
                  <button
                    onClick={() => setDashboardChartType('area')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      dashboardChartType === 'area'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Trend Area Chart
                  </button>
                  <button
                    onClick={() => setDashboardChartType('bar')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      dashboardChartType === 'bar'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Monthly Bar Breakdown
                  </button>
                </div>
              </div>

              {monthlySpendingData.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-subtle)]">
                  <p className="text-xs text-[var(--text-muted)]">
                    No saved bills yet. Scan and add bills in the Scanner tab to view monthly spending trends!
                  </p>
                </div>
              ) : (
                <>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {dashboardChartType === 'area' ? (
                        <AreaChart data={monthlySpendingData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                          <defs>
                            <linearGradient id="grandTotalGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="taxableGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'}
                          />
                          <XAxis
                            dataKey="month"
                            tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }}
                          />
                          <YAxis
                            tickFormatter={(val) => `₹${val}`}
                            tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                              borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                              borderRadius: '12px',
                              fontSize: '12px',
                            }}
                            formatter={(value: number, name: string) => [`₹${Number(value).toFixed(2)}`, name]}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                          <Area
                            type="monotone"
                            dataKey="totalSpend"
                            name="Grand Total Spend (₹)"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#grandTotalGradient)"
                          />
                          <Area
                            type="monotone"
                            dataKey="taxableSpend"
                            name="Taxable / Net Amount (₹)"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#taxableGradient)"
                          />
                          <Area
                            type="monotone"
                            dataKey="gstSpend"
                            name="Total GST / Tax (₹)"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            fillOpacity={0.15}
                            fill="#f59e0b"
                          />
                        </AreaChart>
                      ) : (
                        <BarChart data={monthlySpendingData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'}
                          />
                          <XAxis
                            dataKey="month"
                            tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }}
                          />
                          <YAxis
                            tickFormatter={(val) => `₹${val}`}
                            tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                              borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                              borderRadius: '12px',
                              fontSize: '12px',
                            }}
                            formatter={(value: number, name: string) => [`₹${Number(value).toFixed(2)}`, name]}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                          <Bar
                            dataKey="taxableSpend"
                            name="Taxable / Net Amount (₹)"
                            fill="#10b981"
                            radius={[6, 6, 0, 0]}
                          />
                          <Bar
                            dataKey="gstSpend"
                            name="Total GST / Tax (₹)"
                            fill="#f59e0b"
                            radius={[6, 6, 0, 0]}
                          />
                          <Bar
                            dataKey="totalSpend"
                            name="Grand Total Spend (₹)"
                            fill="#6366f1"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>

                  {/* Monthly Summary Breakdown Table */}
                  <div className="border border-[var(--border-color)] rounded-xl overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[var(--bg-subtle)] text-[11px] font-bold uppercase text-[var(--text-muted)] border-b border-[var(--border-color)]">
                          <th className="py-2.5 px-3">Month</th>
                          <th className="py-2.5 px-3 text-right">Bills Scanned</th>
                          <th className="py-2.5 px-3 text-right">Taxable / Net (₹)</th>
                          <th className="py-2.5 px-3 text-right">Total GST / Tax (₹)</th>
                          <th className="py-2.5 px-3 text-right">Grand Total Spend (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-color)]">
                        {monthlySpendingData.map((row) => (
                          <tr key={row.yearMonthKey} className="hover:bg-[var(--bg-subtle)]/50">
                            <td className="py-2.5 px-3 font-semibold">{row.month}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{row.billCount}</td>
                            <td className="py-2.5 px-3 text-right font-mono">₹{row.taxableSpend.toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-amber-500">
                              ₹{row.gstSpend.toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-500">
                              ₹{row.totalSpend.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: EXACT TEXT ARCHIVE & SAVED DOCUMENTS                           */}
        {/* ===================================================================== */}
        {activeTab === 'history' && (
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">Saved Verbatim Text History ({savedDocuments.length})</h2>
                <p className="text-xs text-[var(--text-muted)]">
                  View, copy, or download the exact extracted text of every scanned PDF or Image
                </p>
              </div>
            </div>

            {savedDocuments.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] py-8 text-center">
                No documents scanned yet. Upload a PDF or Image in the Scanner tab.
              </p>
            ) : (
              <div className="space-y-3">
                {savedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{doc.fileName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-semibold">
                          {doc.fileType} • {doc.pageCount} Page(s)
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">{doc.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyText(doc.extractedText)}
                          className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
                        >
                          Copy Exact Text
                        </button>
                        <button
                          onClick={() => handleExportTxt(doc.extractedText, `${doc.fileName}_Exact.txt`)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Download .TXT
                        </button>
                      </div>
                    </div>
                    <pre className="text-xs font-mono bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border-color)] max-h-48 overflow-y-auto whitespace-pre-wrap">
                      {doc.extractedText}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>

        {/* 11-Section Conversion-Focused CA Homepage (shown on root '/') */}
        {currentPath === '/' && (
          <LedgerSutraHomepageSections
            onNavigate={navigateTo}
            onOpenWorkspaceTab={handleOpenWorkspaceTab}
            onTriggerUpload={() => fileInputRef.current?.click()}
            savedBillsCount={savedBills.length}
          />
        )}
      </main>

      {/* NoSQL Raw JSON Document Modal */}
      {showNoSqlJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-500" />
                {BRAND_NAME} Dynamic NoSQL Document Structure
              </h3>
              <button onClick={() => setShowNoSqlJsonModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <pre className="text-xs font-mono bg-[var(--bg-subtle)] p-4 rounded-xl border border-[var(--border-color)] max-h-[420px] overflow-auto">
              {JSON.stringify(
                {
                  app: BRAND_NAME,
                  domain: 'https://casaarthiai.in',
                  currentBill: {
                    fileName: uploadedFileName,
                    shopName,
                    sellerGstin,
                    invoiceNumber,
                    billDate,
                    grandTotal: calculatedGrandTotal,
                    auditStatus: currentBillAudit.status,
                    productCount: billItems.length,
                    products: billItems,
                  },
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* QR Code Scanner Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-500" />
                Scan Receipt / Invoice QR Code
              </h3>
              <button
                onClick={() => {
                  stopCameraStream();
                  setIsQrModalOpen(false);
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {cameraError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                {cameraError}
              </div>
            )}

            <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center relative">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              <canvas ref={qrCanvasRef} className="hidden" />
              {!isCameraActive && (
                <button
                  onClick={startWebcamQrScanner}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> Start Camera
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
              <input
                ref={qrImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleQrImageFileUpload}
                className="hidden"
              />
              <button
                onClick={() => qrImageInputRef.current?.click()}
                className="text-xs font-semibold text-indigo-500 hover:underline cursor-pointer"
              >
                Or upload an image containing a QR code
              </button>
              {isCameraActive && (
                <button
                  onClick={stopCameraStream}
                  className="text-xs font-semibold text-rose-500 flex items-center gap-1 cursor-pointer"
                >
                  <CameraOff className="w-3.5 h-3.5" /> Stop Camera
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive SaaS Footer with CA SEO Links, Resource Guides & Disclaimer */}
      <LedgerSutraFooter
        onNavigate={navigateTo}
        onOpenWorkspaceTab={handleOpenWorkspaceTab}
      />
    </div>
  );
}

export default App;
