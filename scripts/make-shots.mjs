// "Uygulamanın kendisi" şeridinin görselleri:  NODE_PATH=$(npm root -g) node scripts/make-shots.mjs
//
// press/demo-2026-10-26/ içindeki tam boy ekran görüntülerinden siteye konacak küçük WebP'leri üretir
// (shots/*.webp, 600 x 1200). Üstteki durum çubuğu ve alttaki çizgi kesilir, hepsi aynı 1:2 oranda.
// Hangi kare neden seçildi: press/demo-2026-10-26/BRIEF.md ("good" + "current", isim yok, Mood/döngü yok).
// Şeride kare eklemek ya da çıkarmak için aşağıdaki listeyi ve site/body.html'deki #ekranlar'ı birlikte değiştir.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright'); // NODE_PATH ile bulunur (check-site.js gibi)
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'press/demo-2026-10-26');
// [çıktı adı, kaynak, üstten kesilen piksel]
const SHOTS = [
  ['wheel', 'android/Screenshot_20261026_101948_vyne.jpg', 140],
  ['pick', 'android/Screenshot_20261026_101954_vyne.jpg', 140],
  ['habit', 'ios/IMG_0229.PNG', 150],
  ['water', 'android/Screenshot_20261026_102009_vyne.jpg', 140],
  ['list', 'android/Screenshot_20261026_102156_vyne.jpg', 140],
  ['note', 'ios/IMG_0249.PNG', 150],
  ['journal', 'android/Screenshot_20261026_102055_vyne.jpg', 140],
];
const W = 600, H = 1200;

mkdirSync(join(root, 'shots'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, file, top] of SHOTS) {
  const type = file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const src = `data:${type};base64,${readFileSync(join(SRC, file)).toString('base64')}`;
  const b64 = await page.evaluate(async ({ src, top, W, H }) => {
    const img = new Image(); img.src = src; await img.decode();
    const sw = img.naturalWidth, sh = Math.round(sw * H / W);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
    g.drawImage(img, 0, top, sw, sh, 0, 0, W, H);
    return c.toDataURL('image/webp', 0.8).split(',')[1];
  }, { src, top, W, H });
  const buf = Buffer.from(b64, 'base64');
  writeFileSync(join(root, 'shots', `${name}.webp`), buf);
  console.log(`shots/${name}.webp  ${(buf.length / 1024).toFixed(0)} KB`);
}
await browser.close();
