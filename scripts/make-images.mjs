// Vyne web görselleri: og-image (link paylaşımı) + favicon.
//
// ÇALIŞTIRMA: sharp bu depoda kurulu değil, geçici kur:
//   npm install --no-save sharp && node scripts/make-images.mjs
//
// librsvg TUZAĞI: gömülü fontu CSS SINIFI üzerinden verilen her ağırlıkta
// uygulamıyor — 900 ve 600 çalışıyor, 800 ve 700 serif'e düşüyor. Bu yüzden
// font-family/font-weight presentation ATTRIBUTE olarak veriliyor ve sadece
// çalıştığı doğrulanmış ağırlıklar kullanılıyor. Yeni ağırlık eklersen ÜRETİLEN
// PNG'ye gözle bak, serif'e düşmüş mü diye.
// Uygulamanın kendi görsel dilini kullanır: yeşil merkez baloncuk + pastel
// dallar (CAT paletinden gerçek renkler), Nunito ile "vyne" kelime markası.
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..') + '/';
const FONT = OUT + 'fonts/nunito-latin.woff2';

const GREEN = '#6E9468';
const INK = '#2C2A26';
const SLATE = '#6C6860';
const BG = '#F8F6F0';
// Uygulamanın gerçek CAT renkleri (constants.js)
const BRANCH = ['#BEA8EE', '#96BEE8', '#EE96BA', '#EEE096', '#96EEC8', '#F0D8A8'];

// Fontu base64 gömüyoruz: sharp'ın SVG renderer'ı (librsvg) sistemde kurulu
// olmayan bir fontu bulamaz, @font-face ile gömmek tek güvenilir yol.
const fontB64 = readFileSync(FONT).toString('base64');
const fontFace = `@font-face{font-family:'NunitoEmbed';src:url(data:font/woff2;base64,${fontB64}) format('woff2');font-weight:200 1000;}`;

// Merkezden dışa doğru dallar — her biri bir bezier, ucunda kart.
function branches(cx, cy, scale, withCards) {
  const defs = [
    { dx: -1, dy: -0.75, c: 0 }, { dx: -1, dy: -0.25, c: 1 },
    { dx: -1, dy: 0.45, c: 2 }, { dx: 1, dy: -0.75, c: 3 },
    { dx: 1, dy: -0.2, c: 4 }, { dx: 1, dy: 0.5, c: 5 },
  ];
  return defs.map(b => {
    const ex = cx + b.dx * 250 * scale, ey = cy + b.dy * 200 * scale;
    const mx = cx + b.dx * 130 * scale;
    const d = `M ${cx + b.dx * 62 * scale} ${cy + b.dy * 18 * scale} C ${mx} ${cy + b.dy * 40 * scale}, ${mx} ${ey}, ${ex} ${ey}`;
    const card = withCards
      ? `<rect x="${b.dx < 0 ? ex - 96 * scale : ex}" y="${ey - 17 * scale}" width="${96 * scale}" height="${34 * scale}" rx="${11 * scale}" fill="${BRANCH[b.c]}" opacity="0.32"/>`
      : '';
    return `<path d="${d}" stroke="${BRANCH[b.c]}" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" opacity="0.9"/>${card}`;
  }).join('');
}

// NOT: librsvg, gömülü fontu CSS SINIFI üzerinden verilen her ağırlıkta
// uygulamıyordu (900 çalışıp 700 serif'e düşüyordu). font-family/font-weight
// presentation ATTRIBUTE olarak verilince hepsi doğru render ediliyor.
const T = (x, y, size, weight, fill, extra = '') =>
  `font-family="NunitoEmbed" font-weight="${weight}" font-size="${size}" fill="${fill}" x="${x}" y="${y}" ${extra}`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<style>${fontFace}</style>
<rect width="1200" height="630" fill="${BG}"/>
<g transform="translate(818,315)">
  ${branches(0, 0, 0.92, true)}
  <circle cx="0" cy="0" r="68" fill="none" stroke="${GREEN}" stroke-width="4" opacity="0.35"/>
  <circle cx="0" cy="0" r="56" fill="${GREEN}"/>
</g>
<text ${T(96, 288, 112, 900, INK, 'letter-spacing="-4"')}>vyne<tspan fill="${GREEN}">.</tspan></text>
<text ${T(100, 348, 36, 600, INK)}>hayatın, tek bir yerden</text>
<text ${T(100, 392, 30, 600, SLATE)}>your life, from one place</text>
<rect x="100" y="428" width="72" height="5" rx="2.5" fill="${GREEN}"/>
<text ${T(100, 488, 24, 600, SLATE)}>alışkanlık · dal · seri · çevrimdışı</text>
</svg>`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<rect width="512" height="512" rx="112" fill="${BG}"/>
<g transform="translate(256,256)">
  ${branches(0, 0, 0.62, false)}
  <circle cx="0" cy="0" r="46" fill="none" stroke="${GREEN}" stroke-width="4" opacity="0.4"/>
  <circle cx="0" cy="0" r="37" fill="${GREEN}"/>
</g>
</svg>`;

await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(OUT + 'og-image.png');
await sharp(Buffer.from(icon)).resize(180, 180).png({ compressionLevel: 9 }).toFile(OUT + 'apple-touch-icon.png');
await sharp(Buffer.from(icon)).resize(64, 64).png({ compressionLevel: 9 }).toFile(OUT + 'favicon.png');
writeFileSync(OUT + 'favicon.svg', icon.replace(/\n/g, ''));

for (const f of ['og-image.png', 'apple-touch-icon.png', 'favicon.png']) {
  const m = await sharp(OUT + f).metadata();
  console.log(`${f}: ${m.width}x${m.height}, ${(m.size / 1024).toFixed(0)}KB`);
}
