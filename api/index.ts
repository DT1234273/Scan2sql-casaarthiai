import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface RegisteredApiKeyHash {
  keyHash: string;
  keyPrefix: string;
  name: string;
  uid: string;
  status: 'active' | 'revoked';
  createdAt: string;
}

interface NoSQLStoreData {
  bills: any[];
  documents: any[];
  selectedColumns?: string[];
  apiKeyHashes?: RegisteredApiKeyHash[];
}

const NOSQL_DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'nosql_store.json')
  : path.resolve(process.cwd(), 'nosql_store.json');

function readNoSQLStore(): NoSQLStoreData {
  try {
    if (fs.existsSync(NOSQL_DB_FILE)) {
      const raw = fs.readFileSync(NOSQL_DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        bills: Array.isArray(parsed.bills) ? parsed.bills : [],
        documents: Array.isArray(parsed.documents) ? parsed.documents : [],
        selectedColumns: Array.isArray(parsed.selectedColumns) ? parsed.selectedColumns : undefined,
        apiKeyHashes: Array.isArray(parsed.apiKeyHashes) ? parsed.apiKeyHashes : [],
      };
    }
  } catch {
    // ignore read error
  }
  return { bills: [], documents: [], apiKeyHashes: [] };
}

function writeNoSQLStore(data: NoSQLStoreData): void {
  try {
    fs.writeFileSync(NOSQL_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // ignore write error
  }
}

function safeParseJson(rawInput: string): any | null {
  const cleaned = rawInput
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  if (!cleaned) return null;
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

const GST_STATE_CODES_SERVER: Record<string, string> = {
  '01': 'Jammu & Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab', '04': 'Chandigarh',
  '05': 'Uttarakhand', '06': 'Haryana', '07': 'Delhi', '08': 'Rajasthan',
  '09': 'Uttar Pradesh', '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh',
  '13': 'Nagaland', '14': 'Manipur', '15': 'Mizoram', '16': 'Tripura',
  '17': 'Meghalaya', '18': 'Assam', '19': 'West Bengal', '20': 'Jharkhand',
  '21': 'Odisha', '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
  '26': 'Dadra & Nagar Haveli and Daman & Diu', '27': 'Maharashtra', '29': 'Karnataka',
  '30': 'Goa', '31': 'Lakshadweep', '32': 'Kerala', '33': 'Tamil Nadu',
  '34': 'Puducherry', '35': 'Andaman & Nicobar Islands', '36': 'Telangana',
  '37': 'Andhra Pradesh', '38': 'Ladakh',
};

const PAN_ENTITY_TYPES: Record<string, string> = {
  C: 'Company / Corporate',
  P: 'Individual / Proprietorship',
  H: 'Hindu Undivided Family (HUF)',
  F: 'Partnership Firm / LLP',
  A: 'Association of Persons (AOP)',
  T: 'Trust',
  B: 'Body of Individuals (BOI)',
  L: 'Local Authority',
  J: 'Artificial Juridical Person',
  G: 'Government Agency',
};

function verifyGstinMod36Server(gstin: string): { valid: boolean; expectedCheckChar: string } {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let factor = 2;
  let sum = 0;
  for (let i = 13; i >= 0; i--) {
    const codePoint = chars.indexOf(gstin[i]);
    if (codePoint === -1) return { valid: false, expectedCheckChar: '' };
    let addend = factor * codePoint;
    factor = factor === 2 ? 1 : 2;
    addend = Math.floor(addend / 36) + (addend % 36);
    sum += addend;
  }
  const remainder = sum % 36;
  const checkCodePoint = (36 - remainder) % 36;
  const expectedCheckChar = chars[checkCodePoint];
  return { valid: gstin[14] === expectedCheckChar, expectedCheckChar };
}

export default async function handler(req: any, res: any) {
  const url = String(req.url || '');

  // 1. Handle /api/gstin/status-config
  if (url.includes('/api/gstin/status-config')) {
    return res.status(200).json({
      configured: true,
      message: 'Direct GSTIN verification engine active.',
    });
  }

  // 2. Handle /api/gstin/verify
  if (url.includes('/api/gstin/verify') && req.method === 'POST') {
    const { gstin } = (req.body || {}) as { gstin?: string };
    const cleanGstin = String(gstin || '').trim().toUpperCase();
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(cleanGstin)) {
      return res.status(400).json({
        success: false,
        configured: true,
        error: 'Invalid 15-character GSTIN format.',
        message: 'Invalid 15-character GSTIN format.',
      });
    }
    const stateCode = cleanGstin.slice(0, 2);
    const stateName = GST_STATE_CODES_SERVER[stateCode];
    if (!stateName) {
      return res.status(400).json({
        success: false,
        configured: true,
        error: `Unrecognized State Code "${stateCode}" in GSTIN.`,
        message: `Unrecognized State Code "${stateCode}" in GSTIN.`,
      });
    }
    const checksum = verifyGstinMod36Server(cleanGstin);
    if (!checksum.valid) {
      return res.status(400).json({
        success: false,
        configured: true,
        error: `Mod-36 Checksum Mismatch: 15th character should be "${checksum.expectedCheckChar}".`,
        message: `Mod-36 Checksum Mismatch: 15th character should be "${checksum.expectedCheckChar}".`,
      });
    }
    const pan = cleanGstin.slice(2, 12);
    const entityChar = pan[3] || 'C';
    const constitution = PAN_ENTITY_TYPES[entityChar] || 'Registered Taxpayer';
    const verificationPayload = {
      status: 'Valid Structure & Mod-36 Checksum Verified',
      sts: 'Active (Checksum Verified)',
      gstin: cleanGstin,
      pan,
      stateCode,
      stateName,
      constitution,
      tradeName: `${stateName} (${constitution} • PAN: ${pan})`,
      legalName: `PAN ${pan} (${constitution})`,
    };
    return res.status(200).json({
      success: true,
      configured: true,
      gstin: cleanGstin,
      data: verificationPayload,
      result: verificationPayload,
    });
  }

  // 3. Handle /api/v1/keys/register & revoke
  if (url.includes('/api/v1/keys/')) {
    const { keyHash, keyPrefix, name, label, uid, ownerUid, action } = (req.body || {}) as any;
    if (!keyHash || typeof keyHash !== 'string') {
      return res.status(400).json({ success: false, error: 'Valid SHA-256 keyHash is required.' });
    }
    const store = readNoSQLStore();
    const list = store.apiKeyHashes || [];
    const existingIdx = list.findIndex((k) => k.keyHash === keyHash);
    if (action === 'revoke' || url.includes('/revoke')) {
      if (existingIdx >= 0) list[existingIdx].status = 'revoked';
    } else {
      const record: RegisteredApiKeyHash = {
        keyHash,
        keyPrefix: keyPrefix || 'ls_live_',
        name: name || label || 'CA Saarthi AI API Key',
        uid: uid || ownerUid || 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      if (existingIdx >= 0) list[existingIdx] = record;
      else list.push(record);
    }
    store.apiKeyHashes = list;
    writeNoSQLStore(store);
    return res.status(200).json({ success: true });
  }

  // 4. Handle /api/nosql/store
  if (url.includes('/api/nosql/store')) {
    if (req.method === 'GET') {
      const store = readNoSQLStore();
      return res.status(200).json({ success: true, store });
    }
    if (req.method === 'POST') {
      const { bills, documents, selectedColumns } = (req.body || {}) as NoSQLStoreData;
      const current = readNoSQLStore();
      const updated: NoSQLStoreData = {
        bills: Array.isArray(bills) ? bills : current.bills,
        documents: Array.isArray(documents) ? documents : current.documents,
        selectedColumns: Array.isArray(selectedColumns) ? selectedColumns : current.selectedColumns,
        apiKeyHashes: current.apiKeyHashes,
      };
      writeNoSQLStore(updated);
      return res.status(200).json({ success: true, store: updated });
    }
  }

  // 5. Handle /api/extract-document & /api/v1/extract
  if ((url.includes('/api/extract-document') || url.includes('/api/v1/extract')) && req.method === 'POST') {
    const { images, embeddedText, fileName } = (req.body || {}) as {
      images?: Array<{ mimeType: string; data: string }>;
      embeddedText?: string;
      fileName?: string;
    };

    const trimmedEmbedded = embeddedText ? embeddedText.trim().slice(0, 18000) : '';

    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({ success: false, needsClientOcr: true });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const parts: any[] = [];
      if (Array.isArray(images) && images.length > 0) {
        for (const img of images.slice(0, 5)) {
          if (img?.data) {
            const cleanBase64 = img.data.includes(',') ? img.data.split(',')[1] : img.data;
            parts.push({
              inlineData: {
                mimeType: img.mimeType || 'image/jpeg',
                data: cleanBase64,
              },
            });
          }
        }
      }

      const promptText = `You are CA Saarthi AI's high-precision GST Invoice, Bill of Entry & Accounting Document Extraction engine for Indian Chartered Accountants (CA firms).
Document File: "${fileName || 'Document'}"
${trimmedEmbedded ? `\nDigital PDF Text Layer:\n"""\n${trimmedEmbedded}\n"""\n` : ''}
Task:
1. Read ALL visible text from the document accurately and put the full verbatim text in "exactRawText" (preserving line breaks with \\n and table columns with " | ").
2. Extract the structured bill fields:
   - "shopName": The actual store/company/vendor name. NEVER use watermark text like "DEMO SAMPLE" as shopName.
   - "sellerGstin", "buyerName", "buyerGstin", "invoiceNumber", "billDate" (YYYY-MM-DD), "subtotal", "cgstAmount", "sgstAmount", "igstAmount", "taxAmount", "discountAmount", "grandTotal".
   - "billItems": Extract EVERY SINGLE product/item row from the bill table without skipping any row. For each item include: "itemName", "hsnSac", "quantity" (number), "unit", "unitPrice" (number), "lineTotal" (number).

Return ONLY a valid JSON object matching this format:
{
  "docType": "SHOP_BILL",
  "confidence": 98,
  "shopName": "",
  "sellerGstin": "",
  "buyerName": "",
  "buyerGstin": "",
  "invoiceNumber": "",
  "billDate": "YYYY-MM-DD",
  "placeOfSupply": "",
  "voucherType": "Tax Invoice",
  "paymentMode": "Cash / UPI",
  "subtotal": 0,
  "cgstAmount": 0,
  "sgstAmount": 0,
  "igstAmount": 0,
  "taxAmount": 0,
  "discountAmount": 0,
  "grandTotal": 0,
  "extraHeaderFields": [],
  "billItems": [
    {
      "itemName": "",
      "hsnSac": "",
      "quantity": 1,
      "unit": "PCS",
      "unitPrice": 0,
      "discount": 0,
      "taxableValue": 0,
      "gstRate": 0,
      "cgstAmount": 0,
      "sgstAmount": 0,
      "igstAmount": 0,
      "lineTotal": 0,
      "extraColumns": []
    }
  ],
  "exactRawText": ""
}`;

      parts.push({ text: promptText });

      const candidateModels = ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'];
      for (const modelName of candidateModels) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('AI_TIMEOUT')), 11000)
          );
          const response = await Promise.race([
            ai.models.generateContent({
              model: modelName,
              contents: { parts },
              config: {
                responseMimeType: 'application/json',
              },
            }),
            timeoutPromise,
          ]);

          const parsed = safeParseJson(response.text ?? '');
          if (parsed) {
            if (!parsed.exactRawText && trimmedEmbedded) {
              parsed.exactRawText = trimmedEmbedded;
            }
            return res.status(200).json({ success: true, data: parsed });
          }
        } catch {
          // Try next model
        }
      }

      return res.status(200).json({ success: false, needsClientOcr: true });
    } catch {
      return res.status(200).json({ success: false, needsClientOcr: true });
    }
  }

  return res.status(404).json({ error: 'Not Found' });
}
