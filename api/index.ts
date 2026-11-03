import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

interface NoSQLStoreData {
  bills: any[];
  documents: any[];
  selectedColumns?: string[];
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
      };
    }
  } catch {
    // ignore read error
  }
  return { bills: [], documents: [] };
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

export default async function handler(req: any, res: any) {
  const url = req.url || '';

  // Handle /api/nosql/store
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
      };
      writeNoSQLStore(updated);
      return res.status(200).json({ success: true, store: updated });
    }
  }

  // Handle /api/extract-document
  if (url.includes('/api/extract-document') && req.method === 'POST') {
    const { images, embeddedText, fileName } = (req.body || {}) as {
      images?: Array<{ mimeType: string; data: string }>;
      embeddedText?: string;
      fileName?: string;
    };

    const trimmedEmbedded = embeddedText ? embeddedText.trim().slice(0, 12000) : '';

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
        const firstImg = images[0];
        if (firstImg?.data) {
          const cleanBase64 = firstImg.data.includes(',') ? firstImg.data.split(',')[1] : firstImg.data;
          parts.push({
            inlineData: {
              mimeType: firstImg.mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          });
        }
      }

      const promptText = `You are a high-precision OCR & Bill Extraction engine for Chartered Accountants (CA) and retail users.
Document File: "${fileName || 'Document'}"
${trimmedEmbedded ? `\nDigital PDF Text Layer:\n"""\n${trimmedEmbedded}\n"""\n` : ''}
Task:
1. Read ALL visible text from the document accurately and put the full verbatim text in "exactRawText" (preserving line breaks with \\n and table columns with " | ").
2. Extract the structured bill fields:
   - "shopName": The actual store/company/vendor name (e.g. "GREEN MART GROCERY", "CITY ELECTRONICS"). NEVER use watermark text like "DEMO SAMPLE", "NOT A REAL INVOICE", or "SYNTHETIC DATA" as shopName.
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

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
      for (const modelName of candidateModels) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('AI_TIMEOUT')), 9000)
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
