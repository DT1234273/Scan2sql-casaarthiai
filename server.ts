import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const NOSQL_DB_FILE = path.resolve(process.cwd(), 'nosql_store.json');

interface NoSQLStoreData {
  bills: any[];
  documents: any[];
  selectedColumns?: string[];
}

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

function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
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

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // ---------------------------------------------------------------------------
  // 1. Single-Call Vision OCR & Structured Bill Extractor
  // ---------------------------------------------------------------------------
  app.post('/api/extract-document', async (req, res) => {
    const { images, embeddedText, fileName } = (req.body || {}) as {
      images?: Array<{ mimeType: string; data: string }>;
      embeddedText?: string;
      fileName?: string;
    };

    const trimmedEmbedded = embeddedText ? embeddedText.trim().slice(0, 12000) : '';

    try {
      if (!process.env.GEMINI_API_KEY) {
        res.json({ success: false, needsClientOcr: true });
        return;
      }

      const ai = getGeminiClient();
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
            res.json({ success: true, data: parsed });
            return;
          }
        } catch {
          // Try next candidate model if 503 high demand or timeout occurs
        }
      }

      res.json({ success: false, needsClientOcr: true });
    } catch {
      // Tell client to immediately run local Tesseract OCR + coordinate parser
      res.json({ success: false, needsClientOcr: true });
    }
  });

  // ---------------------------------------------------------------------------
  // 2. Persistent Store Endpoints
  // ---------------------------------------------------------------------------
  app.get('/api/nosql/store', (_req, res) => {
    const store = readNoSQLStore();
    res.json({ success: true, store });
  });

  app.post('/api/nosql/store', (req, res) => {
    const { bills, documents, selectedColumns } = req.body as NoSQLStoreData;
    const current = readNoSQLStore();
    const updated: NoSQLStoreData = {
      bills: Array.isArray(bills) ? bills : current.bills,
      documents: Array.isArray(documents) ? documents : current.documents,
      selectedColumns: Array.isArray(selectedColumns) ? selectedColumns : current.selectedColumns,
    };
    writeNoSQLStore(updated);
    res.json({ success: true, store: updated });
  });

  // ---------------------------------------------------------------------------
  // 3. Vite Middleware / Static Assets
  // ---------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Scan2SQL Server running on http://localhost:${PORT}`);
  });
}

startServer();
