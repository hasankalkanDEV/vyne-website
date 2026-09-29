const { chromium } = require('playwright');
const AND = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36';
const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';
(async () => {
  const b = await chromium.launch();
  // Kullanım: cd /home/user && python3 -m http.server 8766 &  ;  NODE_PATH=$(npm root -g) node vyne-website/scripts/check-site.js
const base = process.env.BASE || 'http://localhost:8766/vyne-website/';
  async function check(url, w, ua, label) {
    const ctx = await b.newContext({ viewport: { width: w, height: 800 }, userAgent: ua });
    const p = await ctx.newPage(); const errs = [];
    p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
    p.on('pageerror', e => errs.push('PAGEERR '+e.message));
    p.on('requestfailed', r => errs.push('REQFAIL '+r.url()));
    await p.goto(url, { waitUntil: 'networkidle' });
    const r = await p.evaluate(() => {
      const cw = document.documentElement.clientWidth; let small = 0, wide = [];
      document.querySelectorAll('body *').forEach(el => {
        if (el.closest('[hidden]') || el.closest('svg')) return;
        const cs = getComputedStyle(el), rc = el.getBoundingClientRect(); if (!rc.width || cs.display==='none') return;
        if ([...el.childNodes].some(n => n.nodeType===3 && n.textContent.trim()) && parseFloat(cs.fontSize) < 13) small++;
        if (rc.right > cw + 1 && !el.closest('.pages') && !el.closest('.dock')) wide.push(el.className||el.tagName);
      });
      const stores = [...document.querySelectorAll('#heroStores .store')].map(s => s.className + '@' + Math.round(s.getBoundingClientRect().left) + ',' + Math.round(s.getBoundingClientRect().top));
      return { sw: document.documentElement.scrollWidth, cw, small, wide: wide.slice(0,5), stores, dock: document.getElementById('dockBtn').getAttribute('href') };
    });
    // scroll to middle: is dock shown?
    await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 3000); }); await p.waitForTimeout(600);
    r.dockShown = await p.evaluate(() => document.getElementById('dock').classList.contains('show'));
    await p.evaluate(() => document.getElementById('indir').scrollIntoView()); await p.waitForTimeout(600);
    r.dockAtIndir = await p.evaluate(() => document.getElementById('dock').classList.contains('show'));
    console.log(label, w, JSON.stringify(r), errs.length ? 'ERR '+errs.join(' | ') : 'no errors');
    await ctx.close();
  }
  for (const u of [base, base+'en/']) {
    await check(u, 390, IOS, 'ios'); await check(u, 390, AND, 'android'); await check(u, 768, undefined, 'tablet'); await check(u, 1280, undefined, 'desk'); await check(u, 320, IOS, 'small');
  }
  // old hash → new section, lang switch keeps hash, VyneOS
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p = await ctx.newPage();
  await p.goto(base + '#kuyu', { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
  console.log('old #kuyu ->', await p.evaluate(() => location.hash + ' y=' + Math.round(document.getElementById('yaprak').getBoundingClientRect().top)));
  await p.goto(base + '#sorular', { waitUntil: 'networkidle' });
  await p.click('#langSw'); await p.waitForLoadState('networkidle');
  console.log('lang switch ->', p.url(), await p.evaluate(() => document.documentElement.lang));
  const bb = await p.locator('#brand').boundingBox();
  await p.mouse.move(bb.x+20, bb.y+10); await p.mouse.down(); await p.waitForTimeout(900); await p.mouse.up();
  console.log('vyneos open:', await p.evaluate(() => !document.getElementById('osWrap').hidden));
  await p.keyboard.press('Escape');
  console.log('vyneos closed:', await p.evaluate(() => document.getElementById('osWrap').hidden));
  await p.goto(base + '#vyneos', { waitUntil: 'networkidle' });
  console.log('#vyneos open:', await p.evaluate(() => !document.getElementById('osWrap').hidden));
  await b.close();
})();
