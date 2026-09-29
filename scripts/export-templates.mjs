// Uygulamanın 9 şablonunu (vyne/src/constants.js → TEMPLATES) siteye kopyalar: site/templates.json.
// Türkçe adlar uygulamanın kendi sözlüğünden (suggestionTitlesTR.json, tr.json), emoji yerine
// uygulamanın çizimi (glyphs.js → EMOJI_GLYPH). Uygulamada şablon değişirse:
//   node scripts/export-templates.mjs   (vyne deposu ../vyne'da olmalı)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
const app = (f) => readFileSync(join(here, '../../vyne/src', f), 'utf8');

const c = app('constants.js');
const start = c.indexOf('export const TEMPLATES = [');
const end = c.indexOf('\n];', start) + 3;
const TEMPLATES = new Function(c.slice(start, end).replace('export const TEMPLATES =', 'return'))();

const g = app('glyphs.js');
const mapSrc = g.slice(g.indexOf('export const EMOJI_GLYPH = {'), g.indexOf('\n};', g.indexOf('export const EMOJI_GLYPH')) + 3);
const EMOJI_GLYPH = new Function(mapSrc.replace('export const EMOJI_GLYPH =', 'return'))();
// glyphs.js'teki gibi: önce elle yazılmış eşleme, sonra glyphData'nın SUGGESTION_EMOJI ve MORE_EMOJI'si.
const gd = app('glyphData.js').replace(/^import .*$/m, "const GLYPH_INK = { ink: '#2C2A26' };").replace(/^export /gm, '');
const { SUGGESTION_EMOJI, MORE_EMOJI } = new Function(gd + '\nreturn { SUGGESTION_EMOJI, MORE_EMOJI };')();
const strip = (e) => e.replace(/️/g, '');
const MAP = {};
for (const [e, n] of Object.entries(EMOJI_GLYPH)) MAP[strip(e)] = n;
for (const [n, list] of Object.entries(SUGGESTION_EMOJI)) for (const e of list) if (!MAP[strip(e)]) MAP[strip(e)] = n;
for (const [e, n] of Object.entries(MORE_EMOJI)) if (!MAP[strip(e)]) MAP[strip(e)] = n;
const glyphs = JSON.parse(readFileSync(join(here, '../site/glyphs.json'), 'utf8')).icons;
const glyphOf = (e) => { const n = MAP[strip(e)]; return n && glyphs[n] ? n : null; };

const TR = JSON.parse(app('i18n/suggestionTitlesTR.json'));
const trJ = JSON.parse(app('i18n/tr.json')).templates, enJ = JSON.parse(app('i18n/en.json')).templates;
const missing = [];
function node(n) {
  const tr = TR[n.title]; if (!tr) missing.push(n.title);
  const o = { en: n.title, tr: tr || n.title, g: glyphOf(n.emoji), kind: n.kind || 'plain' };
  if (!o.g) missing.push('glyph ' + n.emoji + ' ' + n.title);
  if (n.recType) { o.rec = n.recType; if (n.recDays) o.days = n.recDays; if (n.recDayOfMonth) o.dom = n.recDayOfMonth; }
  if (n.offsetDays !== undefined) o.off = n.offsetDays;
  if (n.children) o.children = n.children.map(node);
  return o;
}
const out = TEMPLATES.map((t) => ({
  id: t.id, g: glyphOf(t.root.emoji),
  name: { tr: trJ[t.id].name, en: enJ[t.id].name },
  desc: { tr: trJ[t.id].description, en: enJ[t.id].description },
  q: trJ[t.id].anchorQuestion ? { tr: trJ[t.id].anchorQuestion, en: enJ[t.id].anchorQuestion } : null,
  children: t.children.map(node),
}));
writeFileSync(join(here, '../site/templates.json'), JSON.stringify(out, null, 1));
console.log(out.length, 'şablon', missing.length ? 'EKSİK: ' + missing.join(', ') : 'eksiksiz');
