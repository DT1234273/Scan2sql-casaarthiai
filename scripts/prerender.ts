import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import {
  getPrerenderedSeoHtml,
  getCanonicalSitemapEntries,
} from '../src/seoContent';

// ---------------------------------------------------------------------------
// 1. Minimal Valid PNG / ICO Binary Generator (Zero External Native Deps)
// ---------------------------------------------------------------------------
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makePngChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createSolidGradientPng(width: number, height: number): Buffer {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // Build scanlines with a clean LedgerSutra dark slate + teal/indigo accent band
  const rowSize = 1 + width * 3;
  const raw = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // filter type 0
    const isTopAccent = y < Math.max(4, Math.floor(height * 0.08));
    const isBottomAccent = y > height - Math.max(4, Math.floor(height * 0.06));
    for (let x = 0; x < width; x++) {
      const px = rowOffset + 1 + x * 3;
      if (isTopAccent) {
        // Teal -> Indigo bar (#0d9488 -> #4f46e5)
        const t = x / Math.max(1, width - 1);
        raw[px] = Math.round(13 * (1 - t) + 79 * t);
        raw[px + 1] = Math.round(148 * (1 - t) + 70 * t);
        raw[px + 2] = Math.round(136 * (1 - t) + 229 * t);
      } else if (isBottomAccent) {
        raw[px] = 15;
        raw[px + 1] = 118;
        raw[px + 2] = 110;
      } else {
        // Deep slate card background (#0b1120)
        raw[px] = 11;
        raw[px + 1] = 17;
        raw[px + 2] = 32;
      }
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    makePngChunk('IHDR', ihdr),
    makePngChunk('IDAT', compressed),
    makePngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function createFaviconIcoFromPng(png32: Buffer): Buffer {
  // Standard ICO header (6 bytes) + 1 Directory Entry (16 bytes) + PNG payload
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(1, 4); // 1 image

  const entry = Buffer.alloc(16);
  entry[0] = 32; // width 32px
  entry[1] = 32; // height 32px
  entry[2] = 0; // palette
  entry[3] = 0; // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png32.length, 8); // size of PNG data
  entry.writeUInt32LE(22, 12); // offset (6 + 16)

  return Buffer.concat([header, entry, png32]);
}

function ensureStaticBrandAssets(publicDir: string, distDir: string) {
  const ogPng = createSolidGradientPng(1200, 630);
  const iconPng32 = createSolidGradientPng(32, 32);
  const faviconIco = createFaviconIcoFromPng(iconPng32);

  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'og-default.png'), ogPng);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconIco);

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'og-default.png'), ogPng);
    fs.writeFileSync(path.join(distDir, 'favicon.ico'), faviconIco);
  }
}

// ---------------------------------------------------------------------------
// 2. Prerender HTML for Every Canonical Route into dist/
// ---------------------------------------------------------------------------
function injectRouteSeoIntoTemplate(rawHtml: string, routePath: string): string {
  const seo = getPrerenderedSeoHtml(routePath);
  const isHindi = routePath === '/hi' || routePath.startsWith('/hi/');
  let html = rawHtml;

  html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${isHindi ? 'hi' : 'en'}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${seo.title}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${seo.description.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${seo.robots}" />`
  );

  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>(\s*<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>)*/i,
    `<link rel="canonical" href="${seo.canonicalUrl}" />${seo.hreflangHtml ? `\n    ${seo.hreflangHtml}` : ''}`
  );

  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${seo.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${seo.description.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${seo.canonicalUrl}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${seo.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${seo.description.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<script type="application\/ld\+json" id="ledgersutra-jsonld">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json" id="ledgersutra-jsonld">${seo.jsonLdString}</script>`
  );
  html = html.replace('<!--SSR_OUTLET-->', seo.ssrBodyHtml);
  return html;
}

function runPrerender() {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  const distDir = path.join(rootDir, 'dist');

  ensureStaticBrandAssets(publicDir, distDir);

  const distIndexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(distIndexPath)) {
    console.log('[prerender] Generated public/og-default.png and public/favicon.ico (dist/ not built yet).');
    return;
  }

  const baseTemplate = fs.readFileSync(distIndexPath, 'utf-8');
  const entries = getCanonicalSitemapEntries();
  const routesToPrerender = new Set<string>(['/']);

  for (const entry of entries) {
    try {
      const u = new URL(entry.loc);
      routesToPrerender.add(u.pathname || '/');
    } catch {
      // ignore
    }
  }
  // Also prerender /app shell (with noindex, nofollow)
  routesToPrerender.add('/app');

  let count = 0;
  for (const routePath of routesToPrerender) {
    const renderedHtml = injectRouteSeoIntoTemplate(baseTemplate, routePath);
    if (routePath === '/') {
      fs.writeFileSync(distIndexPath, renderedHtml, 'utf-8');
    } else {
      const cleanRel = routePath.replace(/^\/+/, '');
      const routeDir = path.join(distDir, cleanRel);
      fs.mkdirSync(routeDir, { recursive: true });
      fs.writeFileSync(path.join(routeDir, 'index.html'), renderedHtml, 'utf-8');
      // Also write flat .html for cleanUrls compatibility on static hosts
      fs.writeFileSync(path.join(distDir, `${cleanRel}.html`), renderedHtml, 'utf-8');
    }
    count++;
  }

  console.log(`[prerender] Successfully prerendered ${count} routes + og-default.png & favicon.ico into dist/.`);
}

runPrerender();
