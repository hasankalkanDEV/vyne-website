// Uygulamanın çizimlerini (vyne/src/glyphData.js) siteye kopyalar: site/glyphs.json.
// Uygulamada çizimler değişirse:  node scripts/export-glyphs.mjs  (vyne deposu ../vyne'da olmalı)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
let src = readFileSync(join(here, '../../vyne/src/glyphData.js'), 'utf8');
src = src.replace(/^import .*$/m, "const GLYPH_INK = { ink: '#2C2A26' };").replace(/^export /gm, '');
const m = new Function(src + '\nreturn { ICONS, CHARACTER_PARTS, CHARACTER_PRINT, K };')();
const out = { K: m.K, icons: m.ICONS, chars: m.CHARACTER_PARTS, charPrint: m.CHARACTER_PRINT };
writeFileSync(join(here, '../site/glyphs.json'), JSON.stringify(out));
console.log(Object.keys(out.icons).length, 'ikon,', Object.keys(out.chars).length, 'karakter');
