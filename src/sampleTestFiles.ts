export interface SampleTestFileSpec {
  id: string;
  fileName: string;
  title: string;
  subtitle: string;
  badge: string;
  fileType: 'PNG' | 'JPG' | 'PDF';
  language: 'eng' | 'eng+hin' | 'hin';
  recommendedMode: 'normal_user' | 'ca_mode';
  tiltDegrees: number;
  previewNote: string;
  assetUrl?: string;
}

export const SAMPLE_TEST_FILES: SampleTestFileSpec[] = [
  {
    id: 'user-demo-bill-1-jpg',
    fileName: 'Scan2SQL_Demo_Bill_1.jpg',
    title: '1. Green Mart Grocery Bill (JPG • 4 Products)',
    subtitle: 'Tilted receipt with Basmati Rice, Amul Milk, Sugar & Tea (₹423.00)',
    badge: '4-Item JPG Bill',
    fileType: 'JPG',
    language: 'eng+hin',
    recommendedMode: 'normal_user',
    tiltDegrees: -2.0,
    previewNote: 'Extracts all 4 products (Product 1..Product 4) + Invoice GM-DEMO-1042',
    assetUrl: '/assets/aistudio/Scan2SQL_Demo_Bill_1_27a47ace.jpg',
  },
  {
    id: 'user-demo-bill-2-pdf',
    fileName: 'Scan2SQL_Demo_Bill_2.pdf',
    title: '2. City Electronics Scanned Bill (PDF • 3 Products)',
    subtitle: 'Scanned PDF with USB-C Cable, Wireless Mouse & Screen Guard (₹1,082.06)',
    badge: '3-Item Scanned PDF',
    fileType: 'PDF',
    language: 'eng+hin',
    recommendedMode: 'normal_user',
    tiltDegrees: 2.0,
    previewNote: 'Extracts all 3 products (Product 1..Product 3) + GST ₹165.06 + Invoice CE-TEST-2088',
    assetUrl: '/assets/aistudio/Scan2SQL_Demo_Bill_2_8e170f21.pdf',
  },
  {
    id: 'adi-thedi-grocery-img',
    fileName: 'Adi_Thedi_Reliance_Grocery_Bill.png',
    title: '3. Adi-Thedi (Tilted -5.5°) Grocery Bill Image',
    subtitle: 'Crooked camera photo of a multi-item supermarket bill with shadow & paper texture',
    badge: 'Tilted IMG (-5.5°)',
    fileType: 'PNG',
    language: 'eng',
    recommendedMode: 'normal_user',
    tiltDegrees: -5.5,
    previewNote: 'Tests Normal Mode: 1 Row + Product 1..4 horizontal columns from a tilted camera photo',
  },
  {
    id: 'hindi-english-kirana-img',
    fileName: 'Hindi_English_Ganesh_Kirana_Bill.png',
    title: '2. Hindi + English (हिन्दी + ENG) Tilted Kirana Bill Image',
    subtitle: 'Bilingual kirana receipt with tilted camera angle (+4.2°) & Hindi/English items',
    badge: 'हिन्दी + ENG IMG (+4.2°)',
    fileType: 'PNG',
    language: 'eng+hin',
    recommendedMode: 'normal_user',
    tiltDegrees: 4.2,
    previewNote: 'Tests Bilingual Hindi + English OCR & multi-product column expansion',
  },
  {
    id: 'ca-gst-audit-invoice-pdf',
    fileName: 'CA_GST_Tax_Invoice_Mehta_Electronics.pdf',
    title: '3. CA / GST B2B Tax Invoice PDF (Multi-Column HSN & GST)',
    subtitle: 'Full GST Tax Invoice PDF with Seller/Buyer GSTIN, HSN/SAC, CGST 9%, SGST 9%',
    badge: 'CA GST PDF',
    fileType: 'PDF',
    language: 'eng',
    recommendedMode: 'ca_mode',
    tiltDegrees: 0,
    previewNote: 'Tests CA Mode: Extracts GSTIN, HSN, Taxable Value, CGST, SGST & Grand Total',
  },
  {
    id: 'hindi-english-medical-pdf',
    fileName: 'Hindi_English_Rajesh_Medical_Bill.pdf',
    title: '4. Hindi + English Scanned Medical Bill PDF (Tilted -3.2°)',
    subtitle: 'Scanned PDF containing a slightly crooked bilingual pharmacy bill',
    badge: 'हिन्दी + ENG PDF (-3.2°)',
    fileType: 'PDF',
    language: 'eng+hin',
    recommendedMode: 'normal_user',
    tiltDegrees: -3.2,
    previewNote: 'Tests Scanned PDF-to-Text + Bilingual Hindi/English extraction',
  },
  {
    id: 'adi-thedi-cafe-single-img',
    fileName: 'Adi_Thedi_Cafe_Receipt_Skewed.png',
    title: '5. Adi-Thedi (Skewed +6.0°) Thermal Cafe Receipt Image',
    subtitle: 'Heavily tilted thermal receipt with uneven lighting & crease lines',
    badge: 'Skewed IMG (+6.0°)',
    fileType: 'PNG',
    language: 'eng',
    recommendedMode: 'normal_user',
    tiltDegrees: 6.0,
    previewNote: 'Tests back-to-back upload & merging multiple bills into the same Excel sheet',
  },
];

interface ReceiptRenderConfig {
  width: number;
  height: number;
  tiltDegrees: number;
  paperTint: string;
  headerLines: string[];
  metaLines: string[];
  tableHeader: string;
  itemLines: string[];
  footerLines: string[];
  pdfTextLines: string[];
  stampText?: string;
}

function getReceiptConfig(id: string): ReceiptRenderConfig {
  switch (id) {
    case 'adi-thedi-grocery-img':
      return {
        width: 900,
        height: 1180,
        tiltDegrees: -5.5,
        paperTint: '#faf7f0',
        headerLines: [
          'RELIANCE SMART SUPERSTORE',
          'Plot 14, SG Highway, Ahmedabad - 380054',
          'GSTIN: 24AABCR1234E1Z5   Phone: 079-26854100',
        ],
        metaLines: [
          'TAX INVOICE / CASH MEMO',
          'Invoice No: INV-RS-88412        Date: 2026-10-28',
          'Payment Mode: UPI               Cashier: Counter-04',
        ],
        tableHeader: 'ITEM DESCRIPTION                 QTY    RATE     AMOUNT',
        itemLines: [
          '1. Aashirvaad Atta 10kg           1    465.00    465.00',
          '2. Fortune Sunlite Oil 5L         1    780.00    780.00',
          '3. Tata Tea Gold 1kg              1    615.00    615.00',
          '4. Amul Pasteurised Butter 500g   1    280.00    280.00',
        ],
        footerLines: [
          'Subtotal (Taxable Value):               Rs. 2038.10',
          'CGST (2.5%):                            Rs.   50.95',
          'SGST (2.5%):                            Rs.   50.95',
          'GRAND TOTAL:                            Rs. 2140.00',
          'Thank You for Shopping at Reliance Smart!',
        ],
        pdfTextLines: [],
        stampText: 'PAID UPI',
      };

    case 'hindi-english-kirana-img':
      return {
        width: 920,
        height: 1200,
        tiltDegrees: 4.2,
        paperTint: '#fffdf7',
        headerLines: [
          'श्री गणेश किराना एंड जनरल स्टोर',
          'SHREE GANESH KIRANA & GENERAL STORE',
          'Main Market, Jaipur | GSTIN: 08ABCDE9988F1Z2',
        ],
        metaLines: [
          'बिल / कैश मेमो (RETAIL INVOICE)',
          'Bill No: SGK-2026-509           Date: 2026-10-29',
          'ग्राहक / Customer: Walk-in       Mode: Cash / नकद',
        ],
        tableHeader: 'वस्तु का नाम / ITEM NAME            QTY    RATE     TOTAL',
        itemLines: [
          '1. बासमती चावल Basmati Rice 5kg     1    580.00    580.00',
          '2. तूर दाल Organic Toor Dal 2kg     1    340.00    340.00',
          '3. मसाला Everest Masala 200g       2     95.00    190.00',
          '4. सरसों तेल Mustard Oil 1L         1    185.00    185.00',
        ],
        footerLines: [
          'उप-योग / Subtotal:                      Rs. 1295.00',
          'कुल छूट / Discount:                     Rs.    0.00',
          'कुल राशि / GRAND TOTAL:                 Rs. 1295.00',
          'धन्यवाद! पधारने के लिए शुक्रिया / Thank You!',
        ],
        pdfTextLines: [],
        stampText: 'नकद प्राप्त / PAID',
      };

    case 'ca-gst-audit-invoice-pdf':
      return {
        width: 1000,
        height: 1320,
        tiltDegrees: 0,
        paperTint: '#ffffff',
        headerLines: [
          'MEHTA ELECTRONICS & INDUSTRIAL SUPPLIES PVT LTD',
          'Unit 402, Andheri Industrial Estate, Mumbai - 400053',
          'GSTIN: 27AABCM4567D1Z9   State: 27-Maharashtra',
        ],
        metaLines: [
          'TAX INVOICE (B2B GST AUDIT COPY)',
          'Invoice No: ME/2026-27/1084     Date: 2026-10-31',
          'Buyer: Apex Engineering Works   Buyer GSTIN: 27XYZAB9876C1Z3',
          'Place of Supply: 27-Maharashtra Payment Mode: NEFT',
        ],
        tableHeader: 'DESCRIPTION (HSN)                QTY    RATE      TAXABLE',
        itemLines: [
          '1. Dell Latitude Business Laptop (HSN 8471)  1   42000.00  42000.00',
          '2. LG 27-inch 4K IPS Monitor (HSN 8528)      1   13000.00  13000.00',
        ],
        footerLines: [
          'Total Taxable Value:                    Rs. 55000.00',
          'CGST @ 9%:                              Rs.  4950.00',
          'SGST @ 9%:                              Rs.  4950.00',
          'IGST @ 0%:                              Rs.     0.00',
          'GRAND TOTAL:                            Rs. 64900.00',
        ],
        pdfTextLines: [
          'MEHTA ELECTRONICS & INDUSTRIAL SUPPLIES PVT LTD',
          'GSTIN: 27AABCM4567D1Z9   State: 27-Maharashtra',
          'TAX INVOICE',
          'Invoice No: ME/2026-27/1084     Date: 2026-10-31',
          'Buyer: Apex Engineering Works   Buyer GSTIN: 27XYZAB9876C1Z3',
          'Place of Supply: 27-Maharashtra Payment Mode: NEFT',
          'ITEM DESCRIPTION                 HSN    QTY    RATE      AMOUNT',
          '1. Dell Latitude Business Laptop 8471   1      42000.00  42000.00',
          '2. LG 27-inch 4K IPS Monitor     8528   1      13000.00  13000.00',
          'Subtotal: Rs. 55000.00',
          'CGST (9%): Rs. 4950.00',
          'SGST (9%): Rs. 4950.00',
          'Grand Total: Rs. 64900.00',
        ],
        stampText: 'VERIFIED GST INVOICE',
      };

    case 'hindi-english-medical-pdf':
      return {
        width: 920,
        height: 1220,
        tiltDegrees: -3.2,
        paperTint: '#fcfaf5',
        headerLines: [
          'राजेश मेडिकल एंड जनरल स्टोर',
          'RAJESH MEDICAL & GENERAL STORE',
          'Civil Lines, Prayagraj | GSTIN: 09AABCR7766E1Z1',
        ],
        metaLines: [
          'कैश मेमो / PHARMACY GST BILL',
          'Invoice No: RM-2026-712         Date: 2026-10-30',
          'Doctor: Dr. A. K. Verma         Payment: UPI',
        ],
        tableHeader: 'दवा का नाम / MEDICINE NAME         QTY    RATE     AMOUNT',
        itemLines: [
          '1. पैरासिटामोल Dolo 650mg Strip     2     35.00     70.00',
          '2. विटामिन सी Limcee Chewable       2    110.00    220.00',
          '3. प्रोटीन पाउडर Protinex Tin 400g  1    570.00    570.00',
        ],
        footerLines: [
          'Subtotal / उप-योग:                      Rs.  819.04',
          'CGST (2.5%):                            Rs.   20.48',
          'SGST (2.5%):                            Rs.   20.48',
          'Grand Total / कुल योग:                  Rs.  860.00',
        ],
        pdfTextLines: [
          'RAJESH MEDICAL & GENERAL STORE (राजेश मेडिकल एंड जनरल स्टोर)',
          'GSTIN: 09AABCR7766E1Z1',
          'Invoice No: RM-2026-712   Date: 2026-10-30',
          '1. Dolo 650mg Paracetamol Strip   2   35.00   70.00',
          '2. Limcee Vitamin C Chewable      2  110.00  220.00',
          '3. Protinex Protein Tin 400g      1  570.00  570.00',
          'Subtotal: Rs. 819.04',
          'CGST: Rs. 20.48   SGST: Rs. 20.48',
          'Grand Total: Rs. 860.00',
        ],
        stampText: 'PHARMACY PAID',
      };

    case 'adi-thedi-cafe-single-img':
    default:
      return {
        width: 880,
        height: 1140,
        tiltDegrees: 6.0,
        paperTint: '#f7f4eb',
        headerLines: [
          'CHAITANYA CAFE & BAKERY',
          'FC Road, Pune - 411004',
          'GSTIN: 27AADCC3321B1Z8',
        ],
        metaLines: [
          'THERMAL BILL / DINE-IN RECEIPT',
          'Bill No: CCF-2026-903           Date: 2026-10-31',
          'Table: T-07                     Mode: Card',
        ],
        tableHeader: 'ITEM                             QTY    RATE     AMOUNT',
        itemLines: [
          '1. Masala Chai & Bun Maska Combo  2    160.00    320.00',
          '2. Paneer Tikka Sandwich          1    290.00    290.00',
        ],
        footerLines: [
          'Subtotal:                               Rs.  610.00',
          'CGST (2.5%):                            Rs.   15.00',
          'SGST (2.5%):                            Rs.   15.00',
          'GRAND TOTAL:                            Rs.  640.00',
        ],
        pdfTextLines: [],
        stampText: 'PAID CARD',
      };
  }
}

function renderReceiptCanvas(config: ReceiptRenderConfig): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;
  const ctx = canvas.getContext('2d')!;

  // Dark wooden/desk background so tilted ("adi-thedi") paper edges look like a real phone camera photo
  if (Math.abs(config.tiltDegrees) > 0.1) {
    const deskGrad = ctx.createLinearGradient(0, 0, config.width, config.height);
    deskGrad.addColorStop(0, '#2c3038');
    deskGrad.addColorStop(1, '#1e2229');
    ctx.fillStyle = deskGrad;
    ctx.fillRect(0, 0, config.width, config.height);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, config.width, config.height);
  }

  ctx.save();
  const cx = config.width / 2;
  const cy = config.height / 2;
  ctx.translate(cx, cy);
  ctx.rotate((config.tiltDegrees * Math.PI) / 180);

  const paperW = Math.abs(config.tiltDegrees) > 0.1 ? config.width - 130 : config.width - 40;
  const paperH = Math.abs(config.tiltDegrees) > 0.1 ? config.height - 130 : config.height - 40;
  const left = -paperW / 2;
  const top = -paperH / 2;

  // Drop shadow for realistic camera depth
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 12;

  ctx.fillStyle = config.paperTint;
  ctx.fillRect(left, top, paperW, paperH);

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Subtle uneven camera lighting / paper crease lines for "adi-thedi" realism
  if (Math.abs(config.tiltDegrees) > 0.1) {
    const lightGrad = ctx.createLinearGradient(left, top, left + paperW, top + paperH);
    lightGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
    lightGrad.addColorStop(0.6, 'rgba(0,0,0,0.02)');
    lightGrad.addColorStop(1, 'rgba(0,0,0,0.09)');
    ctx.fillStyle = lightGrad;
    ctx.fillRect(left, top, paperW, paperH);

    // Subtle paper fold line across the middle
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.07)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left + 10, 20);
    ctx.lineTo(left + paperW - 10, -15);
    ctx.stroke();
  }

  // Border
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(left + 16, top + 16, paperW - 32, paperH - 32);

  let y = top + 72;
  const padX = left + 44;

  // Header Lines
  ctx.fillStyle = '#0f172a';
  config.headerLines.forEach((line, idx) => {
    ctx.font = idx === 0 ? 'bold 26px "Courier New", monospace' : 'bold 18px "Courier New", monospace';
    ctx.fillText(line, padX, y);
    y += idx === 0 ? 36 : 28;
  });

  // Divider
  y += 8;
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padX, y);
  ctx.lineTo(left + paperW - 44, y);
  ctx.stroke();
  y += 34;

  // Meta Lines
  ctx.font = 'bold 18px "Courier New", monospace';
  config.metaLines.forEach((line) => {
    ctx.fillText(line, padX, y);
    y += 30;
  });

  // Dashed Separator
  y += 8;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(padX, y);
  ctx.lineTo(left + paperW - 44, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += 32;

  // Table Header
  ctx.font = 'bold 18px "Courier New", monospace';
  ctx.fillText(config.tableHeader, padX, y);
  y += 14;

  ctx.beginPath();
  ctx.moveTo(padX, y);
  ctx.lineTo(left + paperW - 44, y);
  ctx.stroke();
  y += 34;

  // Items
  ctx.font = 'bold 18px "Courier New", monospace';
  config.itemLines.forEach((item) => {
    ctx.fillText(item, padX, y);
    y += 36;
  });

  // Bottom Separator
  y += 10;
  ctx.beginPath();
  ctx.moveTo(padX, y);
  ctx.lineTo(left + paperW - 44, y);
  ctx.stroke();
  y += 36;

  // Footer / Totals
  config.footerLines.forEach((fLine) => {
    const isGrand = fLine.toUpperCase().includes('GRAND TOTAL') || fLine.includes('कुल');
    ctx.font = isGrand ? 'bold 22px "Courier New", monospace' : 'bold 18px "Courier New", monospace';
    ctx.fillText(fLine, padX, y);
    y += isGrand ? 38 : 30;
  });

  // Optional Stamp
  if (config.stampText) {
    ctx.save();
    ctx.translate(left + paperW - 190, top + paperH - 130);
    ctx.rotate((-12 * Math.PI) / 180);
    ctx.strokeStyle = 'rgba(22, 163, 74, 0.75)';
    ctx.lineWidth = 3;
    ctx.strokeRect(-10, -28, 210, 44);
    ctx.fillStyle = 'rgba(22, 163, 74, 0.80)';
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillText(config.stampText, 6, 0);
    ctx.restore();
  }

  ctx.restore();
  return canvas;
}

/**
 * Builds a valid PDF 1.4 binary containing both:
 * 1) The rendered visual page JPEG image (so PDF viewers & scanned-PDF preview show the exact bill)
 * 2) Embedded coordinate text lines (so PDF text extraction also reads every line cleanly)
 */
function buildPdfFromCanvasAndText(canvas: HTMLCanvasElement, textLines: string[]): Uint8Array {
  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
  const base64 = jpegDataUrl.split(',')[1];
  const binaryStr = atob(base64);
  const jpegBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    jpegBytes[i] = binaryStr.charCodeAt(i);
  }

  const pageW = 595;
  const pageH = 842;

  const sanitizePdfAscii = (str: string) =>
    str
      .replace(/[^\x20-\x7E]/g, ' ')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');

  let contentOps = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
  let textY = pageH - 50;
  contentOps += `BT\n/F1 10 Tf\n3 Tr\n`; // 3 Tr = invisible searchable text layer over visual image
  for (const line of textLines) {
    const clean = sanitizePdfAscii(line);
    if (!clean.trim()) continue;
    contentOps += `1 0 0 1 40 ${textY} Tm (${clean}) Tj\n`;
    textY -= 18;
  }
  contentOps += `ET\n`;

  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0]; // index 0 unused, 1..6 for objects
  let currentOffset = 0;

  const pushStr = (s: string) => {
    const bytes = encoder.encode(s);
    chunks.push(bytes);
    currentOffset += bytes.length;
  };

  const pushBytes = (b: Uint8Array) => {
    chunks.push(b);
    currentOffset += b.length;
  };

  pushStr('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

  // 1 0 obj: Catalog
  offsets[1] = currentOffset;
  pushStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // 2 0 obj: Pages
  offsets[2] = currentOffset;
  pushStr('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  // 3 0 obj: Page
  offsets[3] = currentOffset;
  pushStr(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> /Font << /F1 5 0 R >> >> /Contents 6 0 R >>\nendobj\n`
  );

  // 4 0 obj: Image XObject
  offsets[4] = currentOffset;
  pushStr(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
  );
  pushBytes(jpegBytes);
  pushStr('\nendstream\nendobj\n');

  // 5 0 obj: Font
  offsets[5] = currentOffset;
  pushStr('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

  // 6 0 obj: Page Contents
  const contentBytes = encoder.encode(contentOps);
  offsets[6] = currentOffset;
  pushStr(`6 0 obj\n<< /Length ${contentBytes.length} >>\nstream\n`);
  pushBytes(contentBytes);
  pushStr('\nendstream\nendobj\n');

  // xref
  const xrefStart = currentOffset;
  pushStr('xref\n0 7\n0000000000 65535 f \n');
  for (let i = 1; i <= 6; i++) {
    const padded = String(offsets[i]).padStart(10, '0');
    pushStr(`${padded} 00000 n \n`);
  }

  pushStr(`trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`);

  const finalPdf = new Uint8Array(currentOffset);
  let pos = 0;
  for (const chunk of chunks) {
    finalPdf.set(chunk, pos);
    pos += chunk.length;
  }
  return finalPdf;
}

export async function generateSampleTestFile(spec: SampleTestFileSpec): Promise<File> {
  if (spec.assetUrl) {
    const res = await fetch(spec.assetUrl);
    const blob = await res.blob();
    const mime =
      spec.fileType === 'PDF'
        ? 'application/pdf'
        : spec.fileType === 'JPG'
          ? 'image/jpeg'
          : 'image/png';
    return new File([blob], spec.fileName, { type: mime });
  }

  const config = getReceiptConfig(spec.id);
  const canvas = renderReceiptCanvas(config);

  if (spec.fileType === 'PDF') {
    const pdfBytes = buildPdfFromCanvasAndText(canvas, config.pdfTextLines);
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    return new File([blob], spec.fileName, { type: 'application/pdf' });
  } else {
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to create PNG blob'));
      }, 'image/png');
    });
    return new File([blob], spec.fileName, { type: 'image/png' });
  }
}

export async function downloadSampleTestFile(spec: SampleTestFileSpec): Promise<void> {
  const file = await generateSampleTestFile(spec);
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = spec.fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
