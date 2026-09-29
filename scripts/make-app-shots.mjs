// 1.4.0 ekran kareleri → shots/app-*.webp (924 px, telefonda net görünsün diye tam genişlik).
// Kullanım: npm install --no-save sharp && node scripts/make-app-shots.mjs <kare-klasörü>
// Klasörde home, stats, notes, wheel, branch adlı .png/.jpg/.webp dosyaları olmalı.
// Durum çubuğu kırpılır (sadece site için; mağazaya yüklenen kareler kırpılmaz).
// PATCH: gerçek profildeki bütçe tutarını kapatan yama. Örnek profille çekilen karelerde boşalt.
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
const dir = process.argv[2];
if (!dir) { console.error('kare klasörünü ver'); process.exit(1); }
const NAMES = ['home', 'stats', 'notes', 'wheel', 'branch'];
const PATCH = { home: { left: 350, top: 552, w: 104, h: 38, fill: 'rgb(242,238,233)' } };
const STATUS_BAR = 95 / 924; // durum çubuğu yüksekliği, genişliğe oranla
for (const n of NAMES) {
  const file = ['png', 'jpg', 'webp'].map((e) => join(dir, `${n}.${e}`)).find(existsSync);
  if (!file) { console.log('yok:', n); continue; }
  let img = sharp(file);
  const { width, height } = await img.metadata();
  const p = PATCH[n];
  if (p) {
    const k = width / 924;
    const svg = `<svg width="${Math.round(p.w * k)}" height="${Math.round(p.h * k)}"><rect width="100%" height="100%" fill="${p.fill}"/></svg>`;
    img = sharp(await img.composite([{ input: Buffer.from(svg), left: Math.round(p.left * k), top: Math.round(p.top * k) }]).toBuffer());
  }
  const top = Math.round(width * STATUS_BAR);
  const out = join('shots', `app-${n}.webp`);
  await img.extract({ left: 0, top, width, height: height - top }).resize({ width: Math.min(width, 924) }).webp({ quality: 80 }).toFile(out);
  console.log(out);
}
