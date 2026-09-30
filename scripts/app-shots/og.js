// Paylaşım görselleri (og-image.png EN, og-image-tr.png TR). Sunucu açıkken: cd /home/user && python3 -m http.server 8766
const { chromium } = require('playwright');
const R = '/home/user/vyne-website/';
const T = { en: ['Habits that forgive a bad day.', 'One calm place for your habits, your journal and your notes. Free, no ads, no account.', 'made by one person'],
            tr: ['Bir günü kaçırmak dert değil.', 'Alışkanlıkların, günlüğün ve notların için tek, sakin bir yer. Ücretsiz, reklamsız, hesapsız.', 'tek kişinin elinden'] };
(async () => {
  const b = await chromium.launch();
  for (const l of ['en', 'tr']) {
    const sp = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
    await sp.goto('http://localhost:8766/vyne-website/' + (l === 'tr' ? 'tr/' : ''), { waitUntil: 'networkidle' }); await sp.waitForTimeout(600);
    await sp.locator('.hero .phone').screenshot({ path: '/home/user/og-phone.png' }); await sp.close();
    const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
    const html = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:N;src:url(/vyne-website/fonts/nunito-latin.woff2)}@font-face{font-family:N;src:url(/vyne-website/fonts/nunito-latin-ext.woff2);unicode-range:U+0100-02BA}
@font-face{font-family:C;src:url(/vyne-website/fonts/caveat-latin-700.woff2)}@font-face{font-family:C;src:url(/vyne-website/fonts/caveat-latin-ext-700.woff2);unicode-range:U+0100-02BA}
body{margin:0;width:1200px;height:630px;background:radial-gradient(70% 90% at 85% 40%,#E4F4E0,#F8F6F0 60%);font-family:N;color:#2C2A26;display:grid;grid-template-columns:1fr 360px;overflow:hidden}
.l{padding:70px 0 0 80px;display:grid;align-content:start;gap:22px}.brand{display:flex;align-items:center;gap:14px;font-weight:900;font-size:40px}
.brand img{width:64px;height:64px;border-radius:16px}h1{font-size:66px;line-height:1.05;margin:10px 0 0;font-weight:900;letter-spacing:-.02em}
p{font-size:26px;line-height:1.4;color:#5E5A53;margin:0;max-width:640px;font-weight:600}.s{font-family:C;font-size:34px;color:#3F5FA8}
.ph{margin-top:50px;width:300px}.ph img{width:100%;display:block;filter:drop-shadow(0 24px 40px rgba(0,0,0,.22))}</style>
<div class=l><div class=brand><img src="/vyne-website/app-icon.png">vyne</div><h1>${T[l][0]}</h1><p>${T[l][1]}</p><div class=s>${T[l][2]}</div></div>
<div><div class=ph><img src="/og-phone.png"></div></div>`;
    require('fs').writeFileSync('/home/user/og-tmp.html', html); await p.goto('http://localhost:8766/og-tmp.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
    await p.screenshot({ path: R + (l === 'en' ? 'og-image.png' : 'og-image-tr.png') });
  }
  await b.close();
  require('fs').rmSync('/home/user/og-tmp.html', { force: true }); require('fs').rmSync('/home/user/og-phone.png', { force: true });
})();
