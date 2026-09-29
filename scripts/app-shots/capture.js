// Vyne'ın web derlemesinden, örnek profille, iki dilde site ekran görüntüleri.
const { chromium } = require('playwright');
const seed = require('./seed.js');
// Önce: vyne'ın web derlemesi http://localhost:8777'de çalışıyor olmalı (README.md).
const DSF = 924 / 390;
const W = { tr: { spin: 'Karar veremiyor musun? Çarkı çevir', go: 'Çevir', stats: 'İstatistik', search: 'Ara', tpl: 'Şablon kullan', job: 'Yeni İş', open: 'Sayfayı aç', cloud: 'Pazartesi raporu at', q: 'mar', plant: 'Dik', health: 'Sağlık', next: 'İleri' },
           en: { spin: "Can't decide? Spin for one", go: 'Spin', stats: 'Stats', search: 'Search', tpl: 'Use a template', job: 'New Job', open: 'Open page', cloud: 'Send the report on Monday', q: 'gro', plant: 'Plant it', health: 'Health', next: 'Next' } };
const SHOTS = (w) => ({
  welcome:  { opt: { noseed: 1 }, steps: [['fill', 'input', 'Deniz'], ['click', w.plant], ['wait', 2000], ['click', w.health], ['click', w.next], ['wait', 2500]] },
  home:     { steps: [['xy', 195, 430], ['wait', 900]] },
  branch:   { steps: [['xy', 195, 430], ['xy', 340, 196], ['wait', 700], ['xy', 250, 245], ['wait', 900], ['click', w.open], ['wait', 1600]] },
  stats:    { steps: [['click', w.stats], ['wait', 1600]] },
  notes:    { steps: [['click', 'notes'], ['wait', 1400]] },
  wheel:    { opt: { fresh: 1 }, steps: [['click', w.spin], ['wait', 1000], ['click', w.go], ['wait', 1250]] },
  pick:     { opt: { fresh: 1 }, steps: [['click', w.spin], ['wait', 1000], ['click', w.go], ['wait', 6500]] },
  cloud:    { steps: [['xy', 255, 380], ['wait', 900], ['fill', 'textarea, input', w.cloud], ['wait', 500]] },
  inbox:    { steps: [['click', 'notes'], ['wait', 1200], ['xy', 150, 122], ['wait', 1400]] },
  journal:  { opt: { theme: 'midnight' }, steps: [['click', 'notes'], ['wait', 1200], ['xy', 69, 345], ['wait', 2200]] },
  people:   { steps: [['click', 'notes'], ['wait', 1200], ['xy', 321, 345], ['wait', 1500]] },
  templates:{ steps: [['xy', 195, 430], ['wait', 600], ['click', w.tpl], ['wait', 1200], ['click', w.job], ['wait', 1500]] },
  search:   { steps: [['click', w.search], ['wait', 900], ['type', w.q], ['wait', 1200]] },
});
(async () => {
  const b = await chromium.launch();
  for (const lang of (process.env.LANGS || 'tr,en').split(',')) {
    const w = W[lang], shots = SHOTS(w), only = process.env.ONLY ? process.env.ONLY.split(',') : null;
    for (const [name, s] of Object.entries(shots)) {
      if (only && !only.includes(name)) continue;
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF, locale: lang === 'tr' ? 'tr-TR' : 'en-US', isMobile: true, hasTouch: true, timezoneId: 'Europe/Istanbul' });
      await ctx.addInitScript(seed(lang, s.opt || {}));
      const p = await ctx.newPage();
      await p.goto('http://localhost:8777/', { waitUntil: 'networkidle' });
      await p.addStyleTag({ content: '*:focus,*:focus-visible{outline:none!important} input,textarea{caret-color:transparent}' });
      await p.waitForTimeout(2500);
      for (const a of s.steps) {
        try {
          if (a[0] === 'xy') await p.mouse.click(a[1], a[2]);
          if (a[0] === 'click') await p.getByText(a[1], { exact: true }).first().click({ timeout: 4000 });
          if (a[0] === 'fill') await p.locator(a[1]).first().fill(a[2]);
          if (a[0] === 'type') await p.keyboard.type(a[1], { delay: 30 });
          if (a[0] === 'wait') await p.waitForTimeout(a[1]); else await p.waitForTimeout(700);
        } catch (e) { console.log(lang, name, 'FAIL', JSON.stringify(a)); }
      }
      await p.screenshot({ path: `${process.env.S}/work/raw-${lang}-${name}.png` });
      await ctx.close();
      console.log(lang, name);
    }
  }
  await b.close();
})();
