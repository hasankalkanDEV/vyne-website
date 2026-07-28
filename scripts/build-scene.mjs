// Vyne site sahnesi — MERKEZDEN DIŞA AÇILAN hâl (Hasan'ın onayladığı sürüm).
//
// KARAR GEÇMİŞİ, tekrar değiştirmeden önce oku:
// Bu sahne bir ara (a) uygulamadaki gibi soldan sağa sütunlara, sonra (b)
// uygulamanın kart arayüzünün birebir taklidine çevrildi. İkisi de geri alındı:
// hero'da arayüz gereçleri (durum rozeti, ilerleme çubuğu, şevron) gürültü
// yapıyor ve sahne ekran görüntüsü taklidine dönüyor. Onaylanan hâl BUDUR:
// merkezde hub, dört yana açılan ince pastel kıvrımlar, sade etiketler ve
// aşağı kaydırdıkça geri çekilen kamera. Değiştirmeden önce Hasan'a sor.
//
// index.html'e üç şeyi birden yazar (üçü de aynı zamanlama tablosundan türer,
// böylece CSS ile JS yedeği arasında sessiz kayma imkânsız):
//   <!--SCENE-->  <!--SCENE-CSS-->  <!--SCENE-JS-->
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html');

// --- ZAMANLAMA: tek kaynak (yüzde = sticky sahnenin ekranda kaldığı sürenin %) ---
const T = {
  b1: [0, 34], b2: [4, 38], b3: [8, 42], b4: [12, 46], b5: [16, 50], b6: [20, 54],
  n1: [26, 38], n2: [30, 42], n3: [34, 46], n4: [38, 50], n5: [42, 54], n6: [46, 58],
  twig: [58, 84], leafdot: [66, 90],
  k1: [0, 24], k2: [24, 50], k3: [52, 76], k4: [78, 100],
};

const C = { c1: '#BEA8EE', c2: '#96BEE8', c3: '#EE96BA', c4: '#EEE096', c5: '#96EEC8', c6: '#F0D8A8' };

const node = (cls, x, y, emoji, key, label) => `<g class="node ${cls} anim">
  <rect class="node-box" x="${x}" y="${y}" width="162" height="52" rx="15"/>
  <text class="node-label" x="${x + 22}" y="${y + 33}">${emoji} <tspan data-i18n="${key}">${label}</tspan></text>
</g>`;

const svg = `<svg class="map" viewBox="0 0 900 620" role="img" aria-labelledby="mapdesc">
<desc id="mapdesc" data-i18n="map_desc">Ortada seni temsil eden yeşil bir baloncuk; ondan iş, sağlık, alışkanlıklar, çalışma, bütçe ve spor dallarına uzanan renkli eğriler, uçlarında etiketler ve daha küçük alt dallar.</desc>

<g>
  <path class="twig anim" stroke="${C.c1}" pathLength="1" d="M 250 118 C 214 92, 196 84, 168 66"/>
  <path class="twig anim" stroke="${C.c1}" pathLength="1" d="M 250 130 C 212 138, 196 148, 166 160"/>
  <path class="twig anim" stroke="${C.c3}" pathLength="1" d="M 244 440 C 208 456, 190 470, 160 490"/>
  <path class="twig anim" stroke="${C.c3}" pathLength="1" d="M 244 428 C 206 412, 188 400, 158 384"/>
  <path class="twig anim" stroke="${C.c4}" pathLength="1" d="M 656 122 C 692 96, 710 86, 740 68"/>
  <path class="twig anim" stroke="${C.c5}" pathLength="1" d="M 660 300 C 700 300, 716 300, 748 300"/>
  <path class="twig anim" stroke="${C.c6}" pathLength="1" d="M 652 468 C 690 486, 706 496, 736 514"/>
  <circle class="leafdot anim" cx="160" cy="62" r="9" fill="${C.c1}"/>
  <circle class="leafdot anim" cx="158" cy="164" r="9" fill="${C.c1}"/>
  <circle class="leafdot anim" cx="152" cy="494" r="9" fill="${C.c3}"/>
  <circle class="leafdot anim" cx="150" cy="380" r="9" fill="${C.c3}"/>
  <circle class="leafdot anim" cx="748" cy="64" r="9" fill="${C.c4}"/>
  <circle class="leafdot anim" cx="756" cy="300" r="9" fill="${C.c5}"/>
  <circle class="leafdot anim" cx="744" cy="518" r="9" fill="${C.c6}"/>
</g>

<path class="branch b1 anim" pathLength="1" d="M 412 288 C 356 250, 330 150, 258 124"/>
<path class="branch b2 anim" pathLength="1" d="M 408 306 C 340 306, 320 306, 258 306"/>
<path class="branch b3 anim" pathLength="1" d="M 412 324 C 356 366, 330 406, 252 434"/>
<path class="branch b4 anim" pathLength="1" d="M 488 288 C 544 250, 578 150, 642 126"/>
<path class="branch b5 anim" pathLength="1" d="M 492 306 C 560 306, 590 306, 642 306"/>
<path class="branch b6 anim" pathLength="1" d="M 488 324 C 544 366, 578 434, 638 462"/>

${node('n1', 98, 98, '💼', 'm_work', 'İş')}
${node('n2', 96, 280, '❤️', 'm_health', 'Sağlık')}
${node('n3', 92, 408, '🔁', 'm_habits', 'Alışkanlık')}
${node('n4', 640, 100, '📚', 'm_study', 'Çalışma')}
${node('n5', 640, 280, '💰', 'm_budget', 'Bütçe')}
${node('n6', 636, 436, '⚽', 'm_sports', 'Spor')}

<circle class="hub-ring" cx="450" cy="306" r="52"/>
<circle class="hub" cx="450" cy="306" r="42"/>
<text class="hub-label" x="450" y="382" data-i18n="m_you">sen</text>
</svg>`;

const css = Object.entries(T)
  .map(([k, [a, b]]) => `.motion .${k}{animation-range:contain ${a}% contain ${b}%}`).join('\n');
const js = '    var RANGES = {\n' + Object.entries(T)
  .map(([k, [a, b]]) => `      '${k}':[${a},${b}]`).join(',\n') + '\n    };\n';

let html = readFileSync(OUT, 'utf8');
const put = (tag, body) => {
  const re = new RegExp(`<!--${tag}-->[\\s\\S]*?<!--/${tag}-->`);
  if (!re.test(html)) throw new Error(`${tag} isaretcisi bulunamadi`);
  html = html.replace(re, `<!--${tag}-->\n${body}\n<!--/${tag}-->`);
};
put('SCENE', svg); put('SCENE-CSS', css); put('SCENE-JS', js);
writeFileSync(OUT, html, 'utf8');
console.log(`merkezden acilan sahne | ${Object.keys(T).length} zamanlama anahtari`);
