// Siteyi tek kaynaktan iki dile üretir:  node scripts/build-site.mjs
//
// Kaynak site/ klasöründe:  head.html + style.css + body.html + app.js  →  index.html (EN, ana site) ve tr/index.html (TR)
// index.html ile tr/index.html'i ELLE DÜZENLEME; site/ içindekini düzenle, sonra bu betiği çalıştır.
//
// Kaynaktaki işaretler:
//   ⟪Türkçe¦English⟫        iki dilli metin (içinde ⟫ olmasın; JS dizesindeyse ' yerine \' yaz)
//   {{P}}                   varlık yolu öneki: EN'de (kök) boş, TR'de ../
//   {{TEMPLATES}}           uygulamanın şablonları, sayfanın dilinde (site/templates.json)
//   {{LANG}}                tr ya da en
//   [[g:leaf]]              uygulamanın çizimi (site/glyphs.json), baskı tarzı (B)
//   [[g:leaf:C]]            aynı çizim, düz kâğıt tarzı (C)
//   [[c:plagueDoctor]]      uygulamanın karakterlerinden biri
//   {{#android}}…{{/android}}   sadece site/live.json'da android: true ise
//   {{^android}}…{{/android}}   sadece android: false ise   (v140 için de aynısı)
//   {{LEAF_EVERY}} {{LEAF_CAP}}  uygulamanın yaprak kuralı (site/live.json'da; uygulamada değişirse orada değiştir)
//
// Mağaza durumu değişince SADECE site/live.json'u değiştir ve betiği çalıştır.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFileSync(join(root, f), 'utf8').replace(/\r\n/g, '\n');
const LIVE = JSON.parse(read('site/live.json'));
const G = JSON.parse(read('site/glyphs.json'));
const K = G.K;

/* ---------- Çizim motoru: vyne/src/glyphs.js body() ile aynı kurallar (B baskı, C kâğıt) ---------- */
const S = { bOffset: 1.4, bStroke: 1.8, detail: 'rgba(44,42,38,.32)' };
const isShape = (e) => ['p', 'c', 'e', 'r'].includes(e[0]);
const colorOf = (e) => (e[0] === 'p' ? e[2] : e[0] === 'c' ? e[4] : e[0] === 'e' ? e[5] : e[0] === 'r' ? e[6] : null);
const isRgba = (c) => typeof c === 'string' && c.startsWith('rgba');
const ROUND = 'stroke-linejoin="round" stroke-linecap="round"';
function shapeSvg(e, paint) {
  switch (e[0]) {
    case 'p': return `<path d="${e[1]}" ${paint}/>`;
    case 'c': return `<circle cx="${e[1]}" cy="${e[2]}" r="${e[3]}" ${paint}/>`;
    case 'e': return `<ellipse cx="${e[1]}" cy="${e[2]}" rx="${e[3]}" ry="${e[4]}" ${paint}/>`;
    case 'r': return `<rect x="${e[1]}" y="${e[2]}" width="${e[3]}" height="${e[4]}" rx="${e[5] || 0}" ${paint}/>`;
  }
  return '';
}
const lineSvg = (d, stroke, w) => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" ${ROUND}/>`;
function drawGlyph(parts, mode) {
  let out = '';
  if (mode === 'B') {
    let fills = '';
    for (const e of parts) {
      const col = isShape(e) ? colorOf(e) : null;
      if (isShape(e) && col !== 'none') fills += shapeSvg(e, `fill="${col}"`);
      else if (e[0] === 'l' && e[2] && !isRgba(e[2]) && e[2] !== K) fills += lineSvg(e[1], e[2], (e[3] || 2) + 1);
    }
    out += `<g class="gf" transform="translate(${S.bOffset} ${S.bOffset})">${fills}</g>`;
  }
  for (const e of parts) {
    if (isShape(e)) {
      const col = colorOf(e);
      if (col === 'none') continue;
      if (mode === 'B') out += shapeSvg(e, `fill="${col === K ? K : 'none'}" stroke="currentColor" stroke-width="${S.bStroke}" ${ROUND}`);
      else out += shapeSvg(e, `fill="${col}"`);
    } else if (e[0] === 'l') {
      const w = e[3] || 1.8;
      if (mode === 'B') {
        if (isRgba(e[2])) continue;
        out += lineSvg(e[1], e[2] === K ? K : 'currentColor', e[2] === K ? w : S.bStroke);
      } else out += lineSvg(e[1], e[2] || S.detail, w);
    } else if (e[0] === 'd') {
      out += `<circle cx="${e[1]}" cy="${e[2]}" r="${e[3] || 1.4}" fill="${K}"/>`;
    }
  }
  return out;
}
const used = new Set();
function glyph(kind, name, mode) {
  const parts = kind === 'c' ? G.chars[name] : G.icons[name];
  if (!parts) throw new Error(`çizim yok: ${kind}:${name}`);
  const m = mode || (kind === 'c' ? (G.charPrint.includes(name) ? 'B' : 'C') : 'B');
  used.add(`${kind}:${name}`);
  return `<svg class="g" viewBox="-1 -1 35 35" aria-hidden="true" focusable="false">${drawGlyph(parts, m)}</svg>`;
}

/* ---------- Şablon ---------- */
function build(lang) {
  const en = lang === 'en';
  let s = read('site/head.html') + '<style>\n' + read('site/style.css') + '</style>\n</head>\n' +
    read('site/body.html') + '<script>\n' + read('site/app.js') + '</script>\n</body>\n</html>\n';
  for (const [flag, on] of Object.entries(LIVE)) {
    if (typeof on !== 'boolean') continue;
    s = s.replace(new RegExp(`\\{\\{#${flag}\\}\\}([\\s\\S]*?)\\{\\{/${flag}\\}\\}`, 'g'), on ? '$1' : '')
         .replace(new RegExp(`\\{\\{\\^${flag}\\}\\}([\\s\\S]*?)\\{\\{/${flag}\\}\\}`, 'g'), on ? '' : '$1');
  }
  s = s.replace(/⟪([\s\S]*?)¦([\s\S]*?)⟫/g, (_, tr, e) => (en ? e : tr));
  s = s.replace(/\[\[(g|c):([A-Za-z]+)(?::([BC]))?\]\]/g, (_, k, n, m) => glyph(k, n, m));
  s = s.replaceAll('{{P}}', en ? '' : '../').replaceAll('{{LANG}}', lang)
       .replaceAll('{{PLAY_URL}}', LIVE.playUrl)
       .replaceAll('{{LEAF_EVERY}}', String(LIVE.leafEvery)).replaceAll('{{LEAF_CAP}}', String(LIVE.leafCap)).replaceAll('{{IOS_URL}}', LIVE.iosUrl);
  s = s.replace('{{TEMPLATES}}', () => templatesFor(lang))
       .replace('{{QR_IOS}}', () => read('site/qr-ios.svg').trim()).replace('{{QR_PLAY}}', () => read('site/qr-play.svg').trim());
  const left = s.match(/⟪|⟫|¦|\{\{[#^/]?[A-Za-z_]+\}\}|\[\[[gc]:/);
  if (left) throw new Error(`${lang}: çözülmemiş işaret: ${s.slice(left.index - 60, left.index + 60)}`);
  return s.replace(/\n/g, '\r\n');
}
/* Uygulamanın gerçek şablonları (site/templates.json) sayfanın diline göre JS'e yazılır; çizimleri bir kez. */
function templatesFor(lang) {
  const T = JSON.parse(read('site/templates.json')), gl = {};
  const node = (n) => { if (n.g) gl[n.g] = 1; const o = { t: n[lang], g: n.g, k: n.kind };
    for (const f of ['rec', 'days', 'dom', 'off']) if (n[f] !== undefined) o[f] = n[f];
    if (n.children) o.c = n.children.map(node); return o; };
  const list = T.map((t) => { if (t.g) gl[t.g] = 1; return { id: t.id, g: t.g, n: t.name[lang], d: t.desc[lang], q: t.q ? t.q[lang] : null, c: t.children.map(node) }; });
  const G2 = {}; for (const n of Object.keys(gl)) G2[n] = glyph('g', n);
  return JSON.stringify({ list, glyphs: G2 }).replace(/<\//g, '<\\/');
}

// İngilizce ana site (kök), Türkçe /tr/. Eski /en/ adresi köke yönlenir (paylaşılmış bağlantılar kırılmasın).
mkdirSync(join(root, 'tr'), { recursive: true });
writeFileSync(join(root, 'index.html'), build('en'));
writeFileSync(join(root, 'tr/index.html'), build('tr'));
writeFileSync(join(root, 'en/index.html'), ['<!doctype html>', '<html lang="en"><head><meta charset="utf-8">',
  '<title>Vyne</title><link rel="canonical" href="https://hasankalkandev.github.io/vyne-website/">',
  '<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=../">',
  '<script>location.replace("../" + location.hash);</script></head>',
  '<body><a href="../">Vyne</a></body></html>', ''].join('\r\n'));
console.log('index.html (EN) + tr/index.html (TR) + en/ yönlendirmesi yazıldı ·', used.size, 'çizim ·', JSON.stringify(LIVE));
