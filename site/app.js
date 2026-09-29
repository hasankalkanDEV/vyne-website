(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var PAGE_LANG = '{{LANG}}', ready = false;
  /* Uygulamanın kuralları (vyne/src/constants.js). Değer site/live.json'da, derlemede buraya yazılır. */
  var LEAF_EVERY = {{LEAF_EVERY}}, LEAF_CAP = {{LEAF_CAP}};
  var ANDROID_LIVE = {{#android}}true{{/android}}{{^android}}false{{/android}};
  var IOS_URL = '{{IOS_URL}}', PLAY_URL = '{{PLAY_URL}}';
  var SHOT = {home:'{{P}}shots/app-home.webp', stats:'{{P}}shots/app-stats.webp', notes:'{{P}}shots/app-notes.webp', wheel:'{{P}}shots/app-wheel.webp', branch:'{{P}}shots/app-branch.webp'};
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function store(k,v){ try{ if(v === undefined) return localStorage.getItem(k); if(v === null) localStorage.removeItem(k); else localStorage.setItem(k,v); }catch(e){ return null; } }
  function $(id){ return document.getElementById(id); }
  var G = {}; [].forEach.call($('glyphs').children, function(s){ G[s.dataset.g] = s.innerHTML; });
  /* Eski sitenin (sürükleyerek açılan) kayıtları artık kullanılmıyor. */
  ['vyne-site-grown','vyne-site-map','vyne-site-guest'].forEach(function(k){ store(k, null); });

  /* ---------- Platform: iPhone, Android ya da bilgisayar ---------- */
  var ua = navigator.userAgent || '';
  var isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);
  var directUrl = isIOS ? IOS_URL : (isAndroid && ANDROID_LIVE) ? PLAY_URL : null;

  /* ---------- Ses (isteğe bağlı) ---------- */
  var soundOn = false, actx = null;
  function tick(freq){
    if(!soundOn) return;
    try{
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.value = freq || 660; g.gain.setValueAtTime(0.0001, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.08, actx.currentTime + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.18);
      o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + 0.2);
    }catch(e){}
  }
  var soundBtn = $('soundBtn');
  soundBtn.addEventListener('click', function(){ soundOn = !soundOn; soundBtn.setAttribute('aria-pressed', String(soundOn)); soundBtn.textContent = soundOn ? '⟪Açık¦On⟫' : '⟪Kapalı¦Off⟫'; tick(880); });

  /* ---------- Görünüm: tema + kâğıt (bu tarayıcıda hatırlanır) ---------- */
  var lookBtn = $('lookBtn'), look = $('look');
  lookBtn.addEventListener('click', function(){ look.hidden = !look.hidden; lookBtn.setAttribute('aria-expanded', String(!look.hidden)); });
  document.addEventListener('click', function(e){ if(!look.hidden && !look.contains(e.target) && !lookBtn.contains(e.target)){ look.hidden = true; lookBtn.setAttribute('aria-expanded','false'); } });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !look.hidden){ look.hidden = true; lookBtn.setAttribute('aria-expanded','false'); lookBtn.focus(); } });
  var vtChips = [].slice.call(document.querySelectorAll('.chip[data-vt]')), paperChips = [].slice.call(document.querySelectorAll('.chip[data-paper]'));
  var lookState = {}; try{ lookState = JSON.parse(store('vyne-site-look') || '{}') || {}; }catch(e){ lookState = {}; }
  function saveLook(){ store('vyne-site-look', JSON.stringify(lookState)); }
  function setPaper(p, keep){
    if(!p || p === 'none') root.removeAttribute('data-paper'); else root.setAttribute('data-paper', p);
    paperChips.forEach(function(o){ o.setAttribute('aria-pressed', String(o.dataset.paper === (p || 'none'))); });
    if(keep !== false){ lookState.paper = p; saveLook(); }
    $('nightChip').hidden = true;
    redrawAll();
  }
  function setVt(v, keep){
    if(v) root.setAttribute('data-vt', v); else root.removeAttribute('data-vt');
    vtChips.forEach(function(o){ o.setAttribute('aria-pressed', String(o.dataset.vt === v)); });
    if(keep !== false){ lookState.vt = v; saveLook(); }
  }
  vtChips.forEach(function(b){ b.addEventListener('click', function(){ setVt(b.dataset.vt); if(root.getAttribute('data-paper')) setPaper('none'); tick(520); redrawAll(); }); });
  paperChips.forEach(function(b){ b.addEventListener('click', function(){ setPaper(b.dataset.paper); tick(600); }); });
  if(lookState.vt) setVt(lookState.vt, false);
  if(lookState.paper && lookState.paper !== 'none') setPaper(lookState.paper, false);

  /* Gece: kendiliğinden değiştirmek yerine sor (ilk kez gelen biri site bozuldu sanmasın). */
  var hr = new Date().getHours(), nightChip = $('nightChip'), nightAsked = false;
  try{ nightAsked = sessionStorage.getItem('vyne-site-night') === '1'; }catch(e){}
  if((hr >= 22 || hr < 6) && !lookState.paper && !nightAsked) nightChip.hidden = false;
  function nightDone(){ nightChip.hidden = true; try{ sessionStorage.setItem('vyne-site-night','1'); }catch(e){} }
  $('nightYes').addEventListener('click', function(){ setPaper('galaxy'); nightDone(); });
  $('nightNo').addEventListener('click', nightDone);
  root.style.setProperty('--season', ['#9DB4EA','#9DB4EA','#96EEC8','#96EEC8','#96EEC8','#EEE096','#EEE096','#EEE096','#F0B87A','#F0B87A','#F0B87A','#9DB4EA'][new Date().getMonth()]);

  /* ---------- Tekrar hoş geldin (uygulamadaki gibi: 3+ gün sonra) ---------- */
  var last = +store('vyne-site-last') || 0, nowMs = Date.now();
  if(last && nowMs - last > 3*864e5) $('returnCard').hidden = false;
  store('vyne-site-last', String(nowMs));
  $('returnClose').addEventListener('click', function(){ $('returnCard').hidden = true; });

  /* ---------- Eski sitenin dal adresleri yeni bölümlere gider ---------- */
  var OLD = {sen:'giris', mektup:'hikaye', dene:'nasil', kuyu:'yaprak', gun:'gun', defter:'kagitlar', neler:'ozellikler', oyun:'oyuncaklar', neden:'neden', yeni:'yenilikler', soz:'sozler', yok:'giris'};
  function routeHash(){
    var h = location.hash.slice(1);
    if(h === 'vyneos'){ openOS(); return; }
    if(OLD[h] && OLD[h] !== h){ try{ history.replaceState(null, '', '#'+OLD[h]); }catch(e){} var el = $(OLD[h]); if(el) el.scrollIntoView(); }
  }
  addEventListener('hashchange', routeHash);

  /* ---------- Menü: bulunduğun bölüm işaretlenir ---------- */
  var navLinks = [].slice.call(document.querySelectorAll('#nav a'));
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(ents){
      ents.forEach(function(en){ if(en.isIntersecting){ navLinks.forEach(function(a){ a.setAttribute('aria-current', String(a.getAttribute('href') === '#'+en.target.id)); }); } });
    }, {rootMargin:'-45% 0px -50% 0px'});
    ['giris','nasil','ozellikler','hikaye','oyuncaklar','yenilikler','sozler','sorular','indir'].forEach(function(id){ var el = $(id); if(el) io.observe(el); });
  }

  /* ---------- İndir: tek dokunuş. Telefonda doğrudan mağazaya gider. ---------- */
  var dock = $('dock'), dockBtn = $('dockBtn'), navDl = document.querySelector('.nav-dl');
  var dockOn = true;
  if(directUrl){
    [dockBtn, navDl].forEach(function(a){ a.href = directUrl; a.target = '_blank'; a.rel = 'noopener'; });
    dockBtn.textContent = isIOS ? '⟪App Store\'dan indir¦Get it on the App Store⟫' : '⟪Google Play\'den indir¦Get it on Google Play⟫';
  } else if(isAndroid){ dockOn = false; }
  if(dockOn){
    var heroStores = $('heroStores'), indir = $('indir'), dockQ = false;
    function upd(){
      dockQ = false;
      var on = heroStores.getBoundingClientRect().bottom < 0 && indir.getBoundingClientRect().top > innerHeight - 40;
      if(on === dock.classList.contains('show')) return;
      dock.classList.toggle('show', on); dock.setAttribute('aria-hidden', String(!on)); dockBtn.tabIndex = on ? 0 : -1;
    }
    addEventListener('scroll', function(){ if(!dockQ){ dockQ = true; requestAnimationFrame(upd); } }, {passive:true});
    addEventListener('resize', upd); upd();
  }

  /* ---------- Logoya basılı tut → VyneOS ---------- */
  var brand = $('brand'), holdT = null, heldBrand = false, osWrap = $('osWrap');
  function openOS(){ osWrap.hidden = false; $('osClose').focus(); tick(300); }
  function closeOS(){ osWrap.hidden = true; if(location.hash === '#vyneos'){ try{ history.replaceState(null, '', location.pathname); }catch(e){} } brand.focus(); }
  brand.addEventListener('pointerdown', function(){ heldBrand = false; holdT = setTimeout(function(){ heldBrand = true; if(navigator.vibrate) navigator.vibrate(15); openOS(); }, 650); });
  ['pointerup','pointerleave','pointercancel'].forEach(function(ev){ brand.addEventListener(ev, function(){ clearTimeout(holdT); }); });
  brand.addEventListener('click', function(e){ e.preventDefault(); if(heldBrand){ heldBrand = false; return; } window.scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}); });
  brand.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  $('osClose').addEventListener('click', closeOS);
  osWrap.addEventListener('click', function(e){ if(e.target === osWrap) closeOS(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !osWrap.hidden) closeOS(); });
  var desktop = $('desktop'), zTop = 5;
  [].forEach.call(desktop.querySelectorAll('.icon'), function(ic){ ic.addEventListener('click', function(){ var w = $(ic.dataset.w); w.hidden = false; w.style.zIndex = ++zTop; tick(300); }); });
  [].forEach.call(desktop.querySelectorAll('.win'), function(w){
    w.querySelector('.tb button').addEventListener('click', function(e){ e.stopPropagation(); w.hidden = true; });
    var tb = w.querySelector('.tb');
    tb.addEventListener('pointerdown', function(e){ if(e.target.tagName === 'BUTTON') return; tb.setPointerCapture(e.pointerId); w.style.zIndex = ++zTop;
      var dr = desktop.getBoundingClientRect(), wr = w.getBoundingClientRect(), ox = e.clientX-wr.left, oy = e.clientY-wr.top;
      function mv(ev){ w.style.left = Math.max(0,Math.min(dr.width-wr.width, ev.clientX-dr.left-ox))+'px'; w.style.top = Math.max(0,Math.min(dr.height-40, ev.clientY-dr.top-oy))+'px'; }
      function up(){ tb.removeEventListener('pointermove',mv); tb.removeEventListener('pointerup',up); }
      tb.addEventListener('pointermove',mv); tb.addEventListener('pointerup',up); });
  });
  function osTick(){ var d = new Date(); $('osClock').textContent = String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
  osTick(); setInterval(osTick, 30000);

  /* ---------- Konami: yaprak yağmuru ---------- */
  var KON = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'], kpos = 0;
  addEventListener('keydown', function(e){ var k = e.key.length === 1 ? e.key.toLowerCase() : e.key; kpos = (k === KON[kpos]) ? kpos+1 : (k === KON[0] ? 1 : 0); if(kpos === KON.length){ kpos = 0; rain(); } });
  function rain(){
    if(reduce) return;
    var box = document.createElement('div'); box.className = 'leafrain'; document.body.appendChild(box);
    for(var i=0;i<40;i++){ var s = document.createElement('span'); s.innerHTML = Math.random() < .2 ? G.sprig : G.leafC; s.style.left = (Math.random()*100)+'%'; s.style.animationDuration = (3+Math.random()*4)+'s'; s.style.animationDelay = (Math.random()*2)+'s'; box.appendChild(s); }
    setTimeout(function(){ box.remove(); }, 9000);
  }

  /* ---------- Süs: tomurcuğu sağa çek, sarmaşık büyüsün (içerik buna bağlı değil) ---------- */
  var stRow = $('stRow'), stSvg = $('stSvg'), stBud = $('stBud'), stDone = $('stDone'), stX = 0, stDrag = false, stSx = 0, stMoved = false, stFinished = false;
  var ST_B = [['⟪İş¦Work⟫','#BEA8EE'],['⟪Sağlık¦Health⟫','#96BEE8'],['⟪Ev¦Home⟫','#EE96BA'],['⟪Aile¦Family⟫','#96EEC8']], stLabels = [];
  ST_B.forEach(function(b){ var l = document.createElement('span'); l.className = 'st-label'; l.style.setProperty('--c', b[1]); l.textContent = b[0]; l.setAttribute('aria-hidden','true'); stRow.appendChild(l); stLabels.push(l); });
  function stMax(){ return Math.max(60, stRow.clientWidth - 64 - 52); }
  function stDraw(){
    var W = stRow.clientWidth, H = stRow.clientHeight, mid = H/2, x = 64 + stX, p = stX / stMax(), out = '';
    stBud.style.translate = stX+'px 0';
    out += '<path d="M 56 '+mid+' C '+(56+(x-56)*0.3)+' '+(mid-10)+', '+(56+(x-56)*0.7)+' '+(mid+10)+', '+(x+8)+' '+mid+'" stroke="var(--green)" stroke-width="4"/>';
    ST_B.forEach(function(b,i){
      var f = 0.18 + i*0.22, on = p >= f, l = stLabels[i];
      l.classList.toggle('on', on);
      if(!on) return;
      var sx = 64 + f*stMax() + 10, up = i % 2 === 0, ly = up ? 22 : H - 22;
      l.style.left = (sx + 16)+'px'; l.style.top = (up ? 8 : H - 36)+'px';
      out += '<path d="M '+sx+' '+mid+' C '+(sx+6)+' '+mid+', '+(sx+4)+' '+ly+', '+(sx+16)+' '+ly+'" stroke="'+b[1]+'" stroke-width="3"/>';
    });
    stSvg.setAttribute('viewBox','0 0 '+W+' '+H); stSvg.innerHTML = out;
  }
  function stFinish(){
    if(stFinished) return; stFinished = true; stBud.classList.remove('idle');
    var from = stX, to = stMax(), t0 = performance.now();
    (function step(t){ var k = reduce ? 1 : Math.min(1, (t-t0)/700); stX = from + (to-from)*(1-Math.pow(1-k,3)); stDraw(); if(k < 1) requestAnimationFrame(step); })(t0);
    stDone.textContent = '⟪İşte böyle: sen soldasın, hayatın sağa doğru dallanıyor. Uygulama da tam olarak böyle.¦That\'s it: you\'re on the left and your life branches to the right. The app works exactly like this.⟫';
    tick(880); if(navigator.vibrate) navigator.vibrate(15);
  }
  stBud.addEventListener('pointerdown', function(e){ stDrag = true; stMoved = false; stSx = e.clientX - stX; stBud.setPointerCapture(e.pointerId); stBud.classList.remove('idle'); });
  stBud.addEventListener('pointermove', function(e){ if(!stDrag || stFinished) return; var x = Math.max(0, Math.min(stMax(), e.clientX - stSx)); if(Math.abs(x - stX) > 3) stMoved = true; stX = x; stDraw(); if(x >= stMax()*0.92){ stDrag = false; stFinish(); } });
  function stRelease(){ if(!stDrag) return; stDrag = false; if(stX > stMax()*0.6) stFinish(); }
  stBud.addEventListener('pointerup', stRelease); stBud.addEventListener('pointercancel', stRelease);
  stBud.addEventListener('click', function(){ if(!stMoved) stFinish(); });
  stBud.addEventListener('keydown', function(e){ if(e.key === 'ArrowRight'){ e.preventDefault(); stX = Math.min(stMax(), stX + stMax()*0.25); stDraw(); if(stX >= stMax()) stFinish(); } });

  /* ---------- Düz liste ↔ sarmaşık (sağa) ---------- */
  var ITEMS = [['⟪İş¦Work⟫','#BEA8EE',1],['⟪Sağlık¦Health⟫','#96BEE8',1],['⟪Ev¦Home⟫','#EE96BA',1],['⟪Rapor teslim¦Report due⟫','#BEA8EE'],['⟪Süt al¦Buy milk⟫','#EE96BA'],['⟪Su içmek¦Drink water⟫','#96BEE8'],['⟪Toplantı notu¦Meeting notes⟫','#BEA8EE'],['⟪Kira¦Rent⟫','#EE96BA'],['⟪10 dk yürüyüş¦10 min walk⟫','#96BEE8'],['⟪Dişçi¦Dentist⟫','#96BEE8'],['⟪Çamaşır¦Laundry⟫','#EE96BA'],['⟪Sunum¦Slides⟫','#BEA8EE']];
  var box = $('flipbox'), fsvg = $('flipSvg'), itEls = [], vineMode = false;
  ITEMS.forEach(function(it){ var d = document.createElement('div'); d.className = 'it'; d.style.setProperty('--c', it[1]); d.innerHTML = '<i></i>'+esc(it[0]); box.appendChild(d); itEls.push(d); });
  function layoutFlip(){
    var W = box.clientWidth, H = box.clientHeight; if(!W) return;
    if(!vineMode){ itEls.forEach(function(d,i){ d.style.transform = 'translate('+Math.max(4, W/2-80)+'px,'+(2+i*27)+'px)'; }); fsvg.innerHTML = ''; return; }
    var hubX = 16, hubY = H/2, colX = Math.max(46, W*0.16), paths = '', heads = {'#BEA8EE':{y:H*0.17,n:0},'#96BEE8':{y:H*0.5,n:0},'#EE96BA':{y:H*0.83,n:0}}, headW = 0;
    itEls.forEach(function(d,i){ if(ITEMS[i][2]) headW = Math.max(headW, d.offsetWidth); });
    var leafX = Math.min(colX + headW + Math.max(28, W*0.12), W - 130);
    itEls.forEach(function(d,i){ var it = ITEMS[i]; if(!it[2]) return; var h = heads[it[1]]; d.style.transform = 'translate('+colX+'px,'+(h.y-12)+'px)';
      paths += '<path d="M '+(hubX+12)+' '+hubY+' C '+(hubX+40)+' '+hubY+', '+(colX-30)+' '+h.y+', '+colX+' '+h.y+'" stroke="'+it[1]+'" stroke-width="3" fill="none" stroke-linecap="round"/>'; });
    itEls.forEach(function(d,i){ var it = ITEMS[i]; if(it[2]) return; var h = heads[it[1]], y = h.y - 27 + h.n*27; h.n++; d.style.transform = 'translate('+leafX+'px,'+(y-12)+'px)';
      paths += '<path d="M '+(colX+headW)+' '+h.y+' C '+(colX+headW+20)+' '+h.y+', '+(leafX-20)+' '+y+', '+leafX+' '+y+'" stroke="'+it[1]+'" stroke-width="2" fill="none" opacity=".8"/>'; });
    paths += '<circle cx="'+hubX+'" cy="'+hubY+'" r="12" fill="#6E9468"/>'; fsvg.setAttribute('viewBox','0 0 '+W+' '+H); fsvg.innerHTML = paths;
  }
  $('flipBtn').addEventListener('click', function(){ vineMode = !vineMode; box.classList.toggle('vine', vineMode); this.textContent = vineMode ? '⟪Düz listeye döndür¦Back to a flat list⟫' : '⟪Sarmaşığa çevir¦Turn it into a vine⟫'; $('flatTitle').textContent = vineMode ? '⟪Aynı şeyler, sarmaşıkta¦The same things, as a vine⟫' : '⟪Düz bir liste¦A flat list⟫'; layoutFlip(); tick(vineMode?760:420); });

  /* ---------- Kendi sarmaşığın: gerçek piksel boyutunda çizilir, yazılar telefonda da okunur ---------- */
  var COLORS = ['#BEA8EE','#96BEE8','#EE96BA','#EEE096','#96EEC8','#F0D8A8'];
  var SUGG = ['⟪Sağlık¦Health⟫','⟪İş¦Work⟫','⟪Ev¦Home⟫','⟪Para¦Money⟫','⟪Okul¦School⟫','⟪Spor¦Sports⟫','⟪Aile¦Family⟫','⟪Hobi¦Hobby⟫'];
  var TWIGS = {}; [['⟪Su içmek¦Drink water⟫','⟪Uyku¦Sleep⟫'],['⟪Rapor¦Report⟫','⟪Toplantı¦Meeting⟫'],['⟪Çamaşır¦Laundry⟫','⟪Kira¦Rent⟫'],['⟪Bütçe¦Budget⟫','⟪Birikim¦Savings⟫'],['⟪Sınav¦Exam⟫','⟪Tekrar¦Review⟫'],['⟪Yürüyüş¦Walk⟫','⟪Antrenman¦Workout⟫'],['⟪Annemi ara¦Call mom⟫','⟪Doğum günü¦Birthday⟫'],['⟪Okumak¦Reading⟫','⟪Gitar¦Guitar⟫']].forEach(function(t,i){ TWIGS[SUGG[i]] = t; });
  var branches = [SUGG[0], SUGG[1], SUGG[2]], pick = $('bPick'), bvine = $('bVine'), vbox = $('bVineBox');
  function fit(s, n){ return s.length > n ? s.slice(0, n-1)+'…' : s; }
  function drawVine(grown){
    var W = Math.max(280, vbox.clientWidth || 520), n = branches.length, rowH = 66, H = Math.max(300, n*rowH + 40);
    var hubX = 30, hubY = H/2, colX = Math.round(W*0.22), nodeW = Math.round(Math.min(160, W*0.34)), twX = colX + nodeW + Math.round(W*0.09), out = '';
    var labelMax = Math.floor((nodeW - 34)/8.6), twMax = Math.floor((W - twX - 8)/7.6);
    branches.forEach(function(b,i){
      var y = 20 + (H-40)/n*(i+0.5), c = COLORS[i];
      out += '<path class="br'+(grown===b?' grow':'')+'" pathLength="1" stroke="'+c+'" d="M '+(hubX+22)+' '+hubY+' C '+(hubX+60)+' '+hubY+', '+(colX-40)+' '+y+', '+colX+' '+y+'"/>';
      var tw = TWIGS[b] || [b+' · 1', b+' · 2'];
      tw.forEach(function(t,k){ var ty = y + (k ? 15 : -15); out += '<path class="tw" stroke="'+c+'" d="M '+(colX+nodeW)+' '+y+' C '+(colX+nodeW+20)+' '+y+', '+(twX-18)+' '+ty+', '+twX+' '+ty+'"/><text class="tw" x="'+(twX+6)+'" y="'+(ty+5)+'">'+esc(fit(t, twMax))+'</text>'; });
      out += '<g><rect class="nb" x="'+colX+'" y="'+(y-19)+'" width="'+nodeW+'" height="38" rx="12"/><circle cx="'+(colX+16)+'" cy="'+y+'" r="6" fill="'+c+'"/><text x="'+(colX+29)+'" y="'+(y+5)+'">'+esc(fit(b, labelMax))+'</text></g>';
    });
    out += '<circle cx="'+hubX+'" cy="'+hubY+'" r="29" fill="none" stroke="#6E9468" stroke-width="2.5" opacity=".4"/><circle cx="'+hubX+'" cy="'+hubY+'" r="22" fill="#6E9468"/><text x="'+hubX+'" y="'+(hubY+50)+'" text-anchor="middle" class="tw">⟪sen¦you⟫</text>';
    bvine.setAttribute('viewBox','0 0 '+W+' '+H); bvine.setAttribute('width', W); bvine.setAttribute('height', H); bvine.innerHTML = out;
  }
  function drawPick(){ pick.innerHTML = ''; SUGG.forEach(function(s){ var b = document.createElement('button'); b.type = 'button'; b.textContent = s; b.setAttribute('aria-pressed', String(branches.indexOf(s)>-1)); b.addEventListener('click', function(){ toggleB(s); }); pick.appendChild(b); }); }
  function toggleB(s){ var i = branches.indexOf(s); if(i>-1){ if(branches.length>1) branches.splice(i,1); drawVine(); } else if(branches.length<6){ branches.push(s); drawVine(reduce?null:s); tick(700); } drawPick(); }
  $('bForm').addEventListener('submit', function(e){ e.preventDefault(); var inp = $('bInput'), v = inp.value.trim(); if(!v) return; v = v.charAt(0).toLocaleUpperCase(PAGE_LANG) + v.slice(1); if(branches.indexOf(v)===-1 && branches.length<6){ branches.push(v); drawVine(reduce?null:v); drawPick(); tick(700); } inp.value = ''; });
  /* Poster: sarmaşığı PNG olarak indir. CSS değişkenleri SVG'de tek başına çözülmediği için renkler burada yazılır. */
  $('posterBtn').addEventListener('click', function(){
    var cs = getComputedStyle(root), v = function(n){ return cs.getPropertyValue(n).trim(); };
    var W = +bvine.getAttribute('width'), H = +bvine.getAttribute('height'), k = Math.min(1120/W, 740/H);
    var svg = bvine.cloneNode(true); svg.setAttribute('xmlns','http://www.w3.org/2000/svg'); svg.setAttribute('width', Math.round(W*k)); svg.setAttribute('height', Math.round(H*k));
    [].forEach.call(svg.querySelectorAll('path.br'), function(e){ e.removeAttribute('class'); e.setAttribute('fill','none'); e.setAttribute('stroke-width','3.2'); e.setAttribute('stroke-linecap','round'); });
    [].forEach.call(svg.querySelectorAll('path.tw'), function(e){ e.removeAttribute('class'); e.setAttribute('fill','none'); e.setAttribute('stroke-width','2'); e.setAttribute('opacity','.7'); });
    [].forEach.call(svg.querySelectorAll('.nb'), function(e){ e.removeAttribute('class'); e.setAttribute('fill', v('--card')); e.setAttribute('stroke', v('--border')); e.setAttribute('stroke-width','1.5'); });
    [].forEach.call(svg.querySelectorAll('text'), function(e){ var tw = e.getAttribute('class') === 'tw'; e.removeAttribute('class'); e.setAttribute('font-family','Nunito, system-ui, sans-serif'); e.setAttribute('font-weight', tw ? '700' : '800'); e.setAttribute('font-size', tw ? '14' : '15'); e.setAttribute('fill', v(tw ? '--slate' : '--ink')); });
    var img = new Image();
    img.onload = function(){
      var c = document.createElement('canvas'); c.width = 1200; c.height = 900; var g = c.getContext('2d');
      g.fillStyle = v('--bg'); g.fillRect(0,0,1200,900);
      g.fillStyle = v('--ink'); g.font = '900 44px Nunito, system-ui, sans-serif'; g.fillText('vyne', 60, 88);
      g.fillStyle = v('--slate'); g.font = '700 28px Caveat, cursive'; g.fillText('⟪hayatımın haritası¦the map of my life⟫', 170, 86);
      g.drawImage(img, (1200 - W*k)/2, 120 + (740 - H*k)/2, W*k, H*k);
      c.toBlob(function(b){ if(!b) return; var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = '⟪vyne-haritam.png¦vyne-my-map.png⟫'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000); $('posterNote').textContent = '⟪İndirildi: vyne-haritam.png¦Downloaded: vyne-my-map.png⟫'; tick(880); });
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  });
  drawPick();

  /* ---------- Yaprak ve dinlenme: uygulamanın kuralıyla simülasyon ----------
     Her gün sırayla işlenir. Yapılan gün seriyi 1 artırır; seri LEAF_EVERY'nin
     katına ulaşınca +1 yaprak (en fazla LEAF_CAP). Dinlenme günü seriyi ne artırır
     ne bozar, yaprak harcamaz. Boş gün: yaprak varsa ve bir önceki gün de boş
     değilse yaprak o günü kurtarır; yoksa seri kopar. */
  var N = 14, kdays = [], mode = 'done';
  function resetK(){ kdays = []; for(var i=0;i<N;i++) kdays.push(null); }
  function demoK(){ kdays = ['done','done','done','done','done','done','done','miss','done','sick','sick','done','done','done']; }
  demoK();
  function simulate(){
    var streak = 0, leaves = 0, out = [], earnedAt = [];
    for(var i=0;i<N;i++){
      var d = kdays[i];
      if(d === 'done'){ streak++; if(streak % LEAF_EVERY === 0 && leaves < LEAF_CAP){ leaves++; earnedAt.push(i); } out.push('done'); }
      else if(d === 'rest' || d === 'sick' || d === 'travel'){ out.push(d); }
      else if(d === 'miss'){
        var prevMissed = i > 0 && kdays[i-1] === 'miss';
        if(!prevMissed && leaves > 0){ leaves--; streak++; out.push('leaf'); if(streak % LEAF_EVERY === 0 && leaves < LEAF_CAP){ leaves++; earnedAt.push(i); } }
        else { if(i > 0 && out[i-1] === 'leaf'){ out[i-1] = 'broken'; } streak = 0; out.push('broken'); }
      } else out.push(null);
    }
    return {out:out, streak:streak, leaves:leaves, earnedAt:earnedAt};
  }
  var kDaysEl = $('kDays'), kLeaves = $('kLeaves');
  for(var li=0; li<LEAF_CAP; li++) kLeaves.insertAdjacentHTML('beforeend', G.leaf);
  var GL = {rest:G.moon, sick:G.thermo, travel:G.plane, leaf:G.leaf};
  var DAYNAME = {done:'⟪yapıldı¦done⟫', leaf:'⟪yaprak korudu¦kept by a leaf⟫', rest:'⟪dinlenme¦rest⟫', sick:'⟪hasta¦sick⟫', travel:'⟪yolculuk¦travel⟫', broken:'⟪seri koptu¦streak broke⟫'};
  function drawK(){
    var r = simulate(); kDaysEl.innerHTML = '';
    r.out.forEach(function(s,i){
      var b = document.createElement('button'); b.type = 'button';
      var cls = s === 'done' ? 'done' : s === 'leaf' ? 'leaf' : (s === 'rest' || s === 'sick' || s === 'travel') ? 'rest' : s === 'broken' ? 'broken' : '';
      b.className = 'dy ' + cls + (i === N-1 ? ' today' : '');
      b.innerHTML = GL[s] || String(i+1);
      if(r.earnedAt.indexOf(i) > -1) b.insertAdjacentHTML('beforeend', '<span class="plus">'+G.leaf+'</span>');
      b.setAttribute('aria-label', '⟪'+(i+1)+'. gün: ¦Day '+(i+1)+': ⟫' + (DAYNAME[s] || '⟪işaretsiz¦unmarked⟫') + (r.earnedAt.indexOf(i) > -1 ? '⟪, yaprak kazanıldı¦, leaf earned⟫' : ''));
      b.addEventListener('click', function(){ kdays[i] = (kdays[i] === mode) ? null : mode; drawK(); tick(s === 'done' ? 520 : 680); });
      kDaysEl.appendChild(b);
    });
    $('kStreak').textContent = r.streak;
    [].forEach.call(kLeaves.children, function(sp,k){ sp.classList.toggle('on', k < r.leaves); });
    kLeaves.setAttribute('aria-label', '⟪Yaprak: ¦Leaves: ⟫' + r.leaves + ' / ' + LEAF_CAP);
    var msg, lastDay = r.out.filter(function(x){ return x; }).slice(-1)[0];
    if(r.out.indexOf('broken') > -1 && lastDay !== 'done' && lastDay !== 'leaf') msg = '⟪Seri koptu. Ya yaprağın yoktu ya da iki gün üst üste boş kaldı. Yeniden başlamak serbest.¦The streak broke. Either you had no leaf, or two days in a row were empty. Starting again is always allowed.⟫';
    else if(r.out.indexOf('leaf') > -1) msg = r.streak+'⟪ günlük seri. Kaçan bir günü yaprak kurtardı: "Bir Yaprak Düştü".¦-day streak. A leaf saved a missed day: "A Leaf Fell".⟫';
    else if(r.out.some(function(x){ return x === 'rest' || x === 'sick' || x === 'travel'; })) msg = r.streak+'⟪ günlük seri. Dinlenme günlerinde serin bekledi: ne uzadı, ne bozuldu.¦-day streak. On rest days your streak waited: it didn\'t grow, it didn\'t break.⟫';
    else msg = r.streak+'⟪ günlük seri. ¦-day streak. ⟫'+LEAF_EVERY+'⟪ gün üst üste yapınca ilk yaprak gelir.¦ days in a row earns your first leaf.⟫';
    $('kMsg').textContent = msg;
  }
  [].forEach.call(document.querySelectorAll('.mode button'), function(b){ b.addEventListener('click', function(){ mode = b.dataset.mode; [].forEach.call(b.parentNode.children, function(o){ o.setAttribute('aria-pressed', String(o === b)); }); }); });
  $('kReset').addEventListener('click', function(){ resetK(); drawK(); });
  $('kDemo').addEventListener('click', function(){ demoK(); drawK(); });
  drawK();

  var MARKS = [
    {d:1, t:'⟪Gün 1¦Day 1⟫', s:'⟪Kolay. İkincisi de kolay.¦Easy. So is day two.⟫'},
    {d:4, t:'⟪Gün 4 · bir hasta günü¦Day 4 · a sick day⟫', s:'⟪"Hasta" işaretledin. Serin seni bekler: ne uzar, ne bozulur. Yaprak harcanmaz.¦You marked it "Sick". Your streak waits: it doesn\'t grow, it doesn\'t break. No leaf is spent.⟫', k:'rest'},
    {d:LEAF_EVERY, t:'⟪Gün ¦Day ⟫'+LEAF_EVERY+'⟪ · ilk yaprak¦ · first leaf⟫', s:LEAF_EVERY+'⟪ gün üst üste yaptın; alışkanlık artık alışkanlık. Burada küçük bir sürpriz de var, uygulamada görürsün.¦ days in a row; the habit is a habit now. There\'s also a small surprise here. You\'ll see it in the app.⟫', k:'leaf'},
    {d:LEAF_EVERY*2, t:'⟪Gün ¦Day ⟫'+(LEAF_EVERY*2)+'⟪ · ikinci yaprak¦ · second leaf⟫', s:'⟪Artık iki yaprağın var. Daha fazlası birikmez.¦Now you hold two leaves. You can\'t hold more.⟫', k:'leaf'},
    {d:18, t:'⟪Gün 18 · dün unuttun¦Day 18 · you forgot yesterday⟫', s:'⟪Bugün açtığında bir yaprak dünü kurtarmış: "Bir Yaprak Düştü." Seri sürüyor.¦When you open the app today, a leaf has saved yesterday: "A Leaf Fell." The streak goes on.⟫', k:'leaf'},
    {d:20, t:'⟪Gün 20 · "aslında yapmıştım"¦Day 20 · "I actually did it"⟫', s:'⟪Dünü ya da önceki günü sonradan düzeltebilirsin. Yaprak geri gelir.¦You can fix yesterday and the day before. The leaf comes back.⟫'},
    {d:30, t:'⟪Gün 30¦Day 30⟫', s:'⟪Otuzuncu gün zor gün. Buraya geldin. Bir sürpriz daha.¦Day thirty is the hard one. You got here. Another surprise.⟫'},
    {d:41, t:'⟪Gün 41 · yolculuk¦Day 41 · travel⟫', s:'⟪Yoldasın, "Yolculuk" işaretledin. Seri bekler, dönünce devam.¦You\'re on the road and marked "Travel". The streak waits and carries on when you\'re back.⟫', k:'rest'},
    {d:52, t:'⟪Gün 52 · üç gündür yoksun¦Day 52 · three days away⟫', s:'⟪Uygulamayı açınca: "Tekrar hoş geldin. Yetişmen gereken bir şey yok."¦Open the app and it says "Welcome back. Nothing to catch up on."⟫'},
    {d:66, t:'⟪Gün 66 · gerçek eşik¦Day 66 · a real threshold⟫', s:'⟪Uydurma değil: Phillippa Lally\'nin (UCL) çalışmasında bir alışkanlığın kendiliğinden olmaya başladığı ortanca süre.¦Not made up: in Phillippa Lally\'s study at UCL, the median time for a habit to become automatic.⟫'},
    {d:100, t:'⟪Gün 100¦Day 100⟫', s:'⟪Dibe geldin. Kurallar hep aynıydı: yaprak kazanılır, sadece dünü kurtarır, dinlenmek serbest.¦You reached the bottom. The rules never changed: leaves are earned, a leaf only saves yesterday, rest is free.⟫'}
  ];
  var wellInner = $('wellInner'), well = $('well'), depth = $('depth'), prevY = -999, WH = 2700, pad = 60;
  MARKS.sort(function(a,b){ return a.d-b.d; }).forEach(function(m){
    var y = Math.max(pad + (m.d-1)/99*(WH-2*pad), prevY + 110); prevY = y;
    var el = document.createElement('div'); el.className = 'mark'+(m.k?' '+m.k:'')+(y/WH > 0.57 ? ' deep' : ''); el.style.top = y+'px';
    el.innerHTML = '<span class="dotm"></span><span>'+esc(m.t)+'<small>'+esc(m.s)+'</small></span>'; wellInner.appendChild(el);
  });
  well.addEventListener('scroll', function(){ var p = well.scrollTop/(well.scrollHeight - well.clientHeight); depth.textContent = '⟪Gün ¦Day ⟫' + Math.max(1, Math.round(1 + p*99)); }, {passive:true});

  /* ---------- Sıradan bir gün ---------- */
  var now = new Date();
  var DOW = ['⟪Pazar¦Sunday⟫','⟪Pazartesi¦Monday⟫','⟪Salı¦Tuesday⟫','⟪Çarşamba¦Wednesday⟫','⟪Perşembe¦Thursday⟫','⟪Cuma¦Friday⟫','⟪Cumartesi¦Saturday⟫'];
  var MON = ['⟪Ocak¦January⟫','⟪Şubat¦February⟫','⟪Mart¦March⟫','⟪Nisan¦April⟫','⟪Mayıs¦May⟫','⟪Haziran¦June⟫','⟪Temmuz¦July⟫','⟪Ağustos¦August⟫','⟪Eylül¦September⟫','⟪Ekim¦October⟫','⟪Kasım¦November⟫','⟪Aralık¦December⟫'];
  var CAP_SHOT = '⟪Uygulamadan gerçek ekran (arayüz şimdilik İngilizce)¦A real screen from the app⟫', CAP_DRAW = '⟪Çizim: uygulamadaki ekranın sade hâli¦Drawing: a simplified version of the app screen⟫';
  var STOPS = [
    {t:'⟪07:30¦7:30⟫', part:'⟪sabah¦morning⟫', sky:['#F6E2BE','#F8F6F0'], title:'⟪Güne bakmak, beş uygulama açmadan¦See the day without opening five apps⟫', dert:'⟪"Bugün ne yapacaktım?" derken telefonu elimden bırakamıyordum.¦"What was I supposed to do today?" and I couldn\'t put the phone down.⟫', how:'⟪Bugünün alışkanlıkları en üstte; hepsi bitince küçük bir kutlama. Altında hayatın sağa doğru dal dal duruyor.¦Today\'s habits sit at the top; when they\'re all ticked it says "All done!". Below, your life branches out to the right.⟫', shot:'home'},
    {t:'12:40', part:'⟪öğle¦midday⟫', sky:['#CFE3F2','#F8F6F0'], title:'⟪Aklına geleni buluta yaz¦Write it on the cloud⟫', dert:'⟪Toplantıda aklıma bir şey geliyor, doğru yeri bulana kadar uçup gidiyor.¦A thought hits me in a meeting and flies away before I find the right place for it.⟫', how:'⟪Profil balonundan yükselen küçük buluta dokun, yaz. Gelen Kutusu\'na düşer; akşam "Gönder…" ile doğru klasöre yollarsın.¦Tap the little cloud rising from your profile bubble and write. It lands in your Inbox; in the evening, "Send to…" puts it in the right folder.⟫', scr:'cloud'},
    {t:'17:15', part:'⟪akşamüstü¦late afternoon⟫', sky:['#F2D2B5','#F5EFE0'], title:'⟪Liste de hatırlatıcı da tek yerde¦Lists and reminders, in one place⟫', dert:'⟪Market listesi bir yerde, kira hatırlatıcısı başka yerde.¦The grocery list lives in one app, the rent reminder in another.⟫', how:'⟪Logonun altındaki "notes"a dokun, sonra Ekle: klasör, not, liste, hatırlatıcı, çevre, haftalık defter, günlük. Kâğıdını da orada seçersin.¦Tap "notes" under the logo, then Add: folder, note, list, reminders, people, weekly diary, daily journal. You pick the paper right there.⟫', shot:'notes'},
    {t:'19:00', part:'⟪akşam¦evening⟫', sky:['#E6C7D8','#F7F2F6'], title:'⟪Karar veremeyince çarkı çevir¦Can\'t decide? Spin for one⟫', dert:'⟪Yorgunum, nereden başlayacağımı bilmiyorum. Sonuç: hiçbiri.¦I\'m tired and don\'t know where to start. So I start nothing.⟫', how:'⟪Başlıktaki çark düğmesine dokun, çark bugünün alışkanlıklarından birini seçer. Tek kural: sadece 2 dakika başla.¦Tap "Can\'t decide? Spin for one" in the header and the wheel picks one of today\'s habits. Just 2 minutes: that\'s the whole rule.⟫', shot:'wheel'},
    {t:'21:00', part:'⟪hasta bir akşam¦a sick evening⟫', sky:['#DCE6F5','#F2F4F8'], title:'⟪Bugün hastayım, seri ne olacak?¦I\'m sick today. What about my streak?⟫', dert:'⟪Hasta olunca seri gidiyor, sonra hepsini bırakıyorum.¦When I get sick the streak goes, and then I drop everything.⟫', how:'⟪Dalın sayfasını aç, takvimde günü seç, "ya da bugün ara ver" → Hasta. Serin seni bekler: ne uzar, ne bozulur. Dünü ve önceki günü sonradan da düzeltebilirsin.¦Open the branch page, pick the day, "or take a break today" → Sick. Your streak waits: it doesn\'t grow, it doesn\'t break. You can also fix yesterday and the day before.⟫', shot:'branch'},
    {t:'22:30', part:'⟪gece¦night⟫', sky:['#1B1E3A','#12142A'], night:true, title:'⟪Günlük, istersen bir soruyla¦A journal, with a question if you want one⟫', dert:'⟪Günlük tutmak istiyorum ama boş sayfa korkutuyor.¦I want to keep a journal, but the blank page scares me.⟫', how:'⟪Her gün bir sayfa. Ne yazacağını bilmiyorsan bir soru önerir. "1 yıl önce bugün" ne yazdığını da gösterir.¦One page a day. If you don\'t know what to write, it offers a question. It also shows what you wrote a year ago today.⟫', scr:'journal'},
    {t:'⟪Pazartesi¦Monday⟫', part:'⟪hafta¦the week⟫', sky:['#DCE9D4','#F3F1DE'], title:'⟪Haftaya bir bakış¦A look back at the week⟫', dert:'⟪Hafta nasıl geçti, hiç düşünmüyorum.¦I never stop to think about how the week went.⟫', how:'⟪İstatistik günleri, haftanın şeklini ve son 12 haftayı gösterir. Gri kare sadece "o gün bir şey olmadı" demek, fazlası değil. Pazartesileri günlükte haftaya bakan üç soru daha çıkar.¦Stats shows your days, your week\'s shape and the last 12 weeks. Grey means nothing happened. Nothing more. On Mondays the journal adds three questions about the week.⟫', shot:'stats'}
  ];
  var SCR = {
    cloud: '<div class="scr" role="img" aria-label="⟪Düşünce bulutu çizimi¦Drawing of the thought cloud⟫"><div class="logo"><span class="pbub">[[c:gardener]]</span><span class="cloudb">[[g:cloud]]⟪Aklında ne var?¦What\'s on your mind?⟫</span></div>' +
      '<div class="field">⟪Pazartesi raporu at¦Send the report on Monday⟫<small>⟪Gelen Kutusu\'na düştü¦Landed in your Inbox⟫</small></div>' +
      '<h5>[[g:tray]]⟪Gelen Kutusu¦Inbox⟫</h5><div class="row">[[g:tooth]]⟪Salı dişçi¦Dentist, Tuesday⟫<span class="tagx">⟪Gönder…¦Send to…⟫</span></div><div class="row">[[g:books]]⟪Kitap önerisi¦A book tip⟫</div><div class="row">[[g:bulb]]⟪Balkona saksı¦Pots for the balcony⟫</div></div>',
    journal: function(){ return '<div class="scr jr" role="img" aria-label="⟪Günlük sayfası çizimi¦Drawing of a journal page⟫"><span class="big">'+now.getDate()+'</span><span>'+MON[now.getMonth()]+' · '+DOW[now.getDay()]+'</span>' +
      '<p class="q">[[g:thought]]<span>⟪Bugün ne iyi gitti, neden?¦What went well today, and why?⟫</span></p><p class="w">⟪Sabah yürüyüşü. Yağmur vardı ama yine de çıktık.¦A morning walk. It rained, and we went anyway.⟫</p><p class="w">&nbsp;</p>' +
      '<div class="ago">[[g:calendar]] ⟪1 yıl önce bugün ne yazdığını da gösterir.¦It also shows what you wrote a year ago today.⟫</div></div>'; }
  };
  var day = $('day'), stopsEl = $('dStops'), dscr = $('dScreen'), di = 0;
  STOPS.forEach(function(s,i){ var b = document.createElement('button'); b.type = 'button'; b.textContent = s.t; b.addEventListener('click', function(){ showDay(i); }); stopsEl.appendChild(b); });
  function showDay(i){
    di = (i + STOPS.length) % STOPS.length; var s = STOPS[di];
    day.style.setProperty('--sky1', s.sky[0]); day.style.setProperty('--sky2', s.sky[1]); day.classList.toggle('night', !!s.night);
    $('dClock').textContent = s.t; $('dPart').textContent = s.part;
    $('dTitle').textContent = s.title; $('dDert').textContent = s.dert; $('dHow').textContent = s.how;
    dscr.innerHTML = s.shot ? '<img alt="'+esc(s.title)+'" src="'+SHOT[s.shot]+'">' : (typeof SCR[s.scr] === 'function' ? SCR[s.scr]() : SCR[s.scr]);
    $('dCap').textContent = s.shot ? CAP_SHOT : CAP_DRAW;
    [].forEach.call(stopsEl.children, function(b,k){ b.setAttribute('aria-current', String(k === di)); });
    tick(460 + di*40);
  }
  day.addEventListener('keydown', function(e){ if(e.key === 'ArrowRight'){ e.preventDefault(); showDay(di+1); } if(e.key === 'ArrowLeft'){ e.preventDefault(); showDay(di-1); } });
  $('dPrev').addEventListener('click', function(){ showDay(di-1); });
  $('dNext').addEventListener('click', function(){ showDay(di+1); });
  showDay(0);

  /* ---------- Şablon denemesi: uygulamanın 9 şablonunun adları gerçek, dallar temsili ---------- */
  var TPL = [
    {n:'⟪Sınav Dönemi¦Exam Period⟫', q:'⟪Sınav ne zaman?¦When is the exam?⟫', b:[['⟪Günlük tekrar¦Daily review⟫',['⟪Her gün 1 konu¦One topic a day⟫','⟪Hafta sonu genel tekrar¦Weekend recap⟫']],['⟪Pratik sorular¦Practice⟫',['⟪Çıkmış sorular¦Past papers⟫','⟪Yanlış defteri¦Mistakes notebook⟫']],['⟪Dinlenme¦Rest⟫',['⟪Uyku düzeni¦Sleep routine⟫']]]},
    {n:'⟪Taşınma¦Moving House⟫', q:'⟪Taşınma ne zaman?¦When do you move?⟫', b:[['⟪Hazırlık¦Getting ready⟫',['⟪Kutu ve bant¦Boxes and tape⟫','⟪Eşya ayıklama¦Declutter⟫']],['⟪Evrak¦Paperwork⟫',['⟪Adres değişikliği¦Change of address⟫','⟪Abonelikler¦Subscriptions⟫']],['⟪Taşınma günü¦Moving day⟫',['⟪Nakliye¦Movers⟫','⟪Anahtar teslimi¦Hand over keys⟫']]]},
    {n:'⟪Yeni İş¦New Job⟫', q:'⟪İlk gün ne zaman?¦When is your first day?⟫', b:[['⟪İlk hafta¦First week⟫',['⟪İnsanlarla tanış¦Meet people⟫','⟪Araçları kur¦Set up your tools⟫']],['⟪Öğrenme¦Learning⟫',['⟪Notlar¦Notes⟫','⟪Sorular listesi¦Questions list⟫']],['⟪Kendin¦You⟫',['⟪Aylık bir değerlendirme¦A monthly check-in⟫']]]},
    {n:'⟪Bütçe¦Budget⟫', q:'⟪Hangi aydan başlasın?¦Which month does it start?⟫', b:[['⟪Gelir¦Income⟫',['⟪Maaş¦Salary⟫']],['⟪Giderler¦Expenses⟫',['⟪Kira¦Rent⟫','⟪Market¦Groceries⟫','⟪Faturalar¦Bills⟫']],['⟪Birikim¦Savings⟫',['⟪Aylık hedef¦Monthly goal⟫']]]},
    {n:'⟪Yeni Bebek¦New Baby⟫', q:'⟪Tahmini tarih?¦Due date?⟫', b:[['⟪Hazırlık¦Getting ready⟫',['⟪Hastane çantası¦Hospital bag⟫','⟪Oda¦The room⟫']],['⟪Sağlık¦Health⟫',['⟪Kontroller¦Check-ups⟫']],['⟪Destek¦Support⟫',['⟪Kimden ne yardım¦Who helps with what⟫']]]},
    {n:'⟪Yeni Başlangıç¦Fresh Start⟫', q:'⟪Ne zaman başlıyorsun?¦When do you start?⟫', b:[['⟪Bırakılacaklar¦Let go of⟫',['⟪Bir alışkanlık¦One habit⟫']],['⟪Eklenecekler¦Add⟫',['⟪Küçük bir rutin¦A small routine⟫']],['⟪Hatırlatma¦Reminder⟫',['⟪Neden başladım?¦Why did I start?⟫']]]},
    {n:'⟪Bırakıyorum¦Quitting⟫', q:'⟪Bırakma günü?¦Quit day?⟫', b:[['⟪Tetikleyiciler¦Triggers⟫',['⟪Ne zaman, nerede¦When and where⟫']],['⟪Yerine¦Instead⟫',['⟪Kısa bir yürüyüş¦A short walk⟫']],['⟪Destek¦Support⟫',['⟪Kime söyleyeceğim¦Who I\'ll tell⟫']]]},
    {n:'⟪Düğün¦Wedding⟫', q:'⟪Düğün ne zaman?¦When is the wedding?⟫', b:[['⟪Mekân¦Venue⟫',['⟪Görüşmeler¦Visits⟫','⟪Kapora¦Deposit⟫']],['⟪Davetliler¦Guests⟫',['⟪Liste¦List⟫','⟪Davetiye¦Invitations⟫']],['⟪Gün¦The day⟫',['⟪Program¦Schedule⟫','⟪Müzik¦Music⟫']]]},
    {n:'⟪Yeni Dönem¦New Semester⟫', q:'⟪Dönem ne zaman başlıyor?¦When does the semester start?⟫', b:[['⟪Dersler¦Classes⟫',['⟪Program¦Timetable⟫','⟪Kaynaklar¦Materials⟫']],['⟪Düzen¦Routine⟫',['⟪Haftalık plan¦Weekly plan⟫']],['⟪Sosyal¦Social⟫',['⟪Kulüpler¦Clubs⟫']]]}
  ];
  var tplSel = $('tplSel'), tplDate = $('tplDate'), tplOut = $('tplOut');
  tplSel.innerHTML = TPL.map(function(t,i){ return '<option value="'+i+'">'+esc(t.n)+'</option>'; }).join('');
  var d0 = new Date(Date.now() + 30*864e5); tplDate.value = d0.getFullYear()+'-'+String(d0.getMonth()+1).padStart(2,'0')+'-'+String(d0.getDate()).padStart(2,'0');
  function drawTpl(){
    var t = TPL[+tplSel.value]; $('tplQ').textContent = t.q;
    var dd = tplDate.value ? new Date(tplDate.value+'T12:00:00') : null, days = dd ? Math.round((dd - new Date())/864e5) : null;
    tplOut.innerHTML = '<p class="eyebrow">⟪Bunlar oluşturulacak¦This will be created⟫</p><div class="lvl" style="--c:#6E9468"><i></i><b>'+esc(t.n)+'</b>'+(days!=null?'<small style="margin-left:6px">'+(days>0?days+'⟪ gün kaldı¦ days to go⟫':'⟪bugün¦today⟫')+'</small>':'')+'</div>'+
      t.b.map(function(b,i){ return '<div class="lvl d2" style="--c:'+COLORS[i]+'"><i></i><span><b>'+esc(b[0])+'</b><br><small>'+b[1].map(esc).join(' · ')+'</small></span></div>'; }).join('')+
      '<p class="draftnote">⟪Şablon adları uygulamadan; içindeki dallar örnek.¦Template names are from the app; the branches inside are examples.⟫</p>';
  }
  tplSel.addEventListener('change', drawTpl); tplDate.addEventListener('change', drawTpl); drawTpl();

  /* ---------- Beş kâğıt: parmakla kaydırılan sayfalar ---------- */
  var pagesEl = $('pages'), pgs = [].slice.call(pagesEl.children), cur = 0, mc = $('miniCal');
  for(var k=0;k<30;k++){ var ii = document.createElement('i'); if(k === 12) ii.className = 'l'; if(k === 21 || k === 22) ii.className = 'r'; mc.appendChild(ii); }
  function pageAt(){ var mid = pagesEl.scrollLeft + pagesEl.clientWidth/2, best = 0, bd = 1e9; pgs.forEach(function(p,i){ var c = p.offsetLeft + p.offsetWidth/2, d = Math.abs(c - mid); if(d < bd){ bd = d; best = i; } }); return best; }
  function label(){ $('cNo').textContent = (cur+1)+' / '+pgs.length+' · '+pgs[cur].dataset.paper; }
  function goPage(n){ cur = Math.max(0, Math.min(pgs.length-1, n)); var p = pgs[cur]; pagesEl.scrollTo({left: p.offsetLeft - (pagesEl.clientWidth - p.offsetWidth)/2, behavior: reduce ? 'auto' : 'smooth'}); label(); tick(560); }
  var pgT = null; pagesEl.addEventListener('scroll', function(){ clearTimeout(pgT); pgT = setTimeout(function(){ var n = pageAt(); if(n !== cur){ cur = n; label(); } }, 80); }, {passive:true});
  $('cPrev').addEventListener('click', function(){ goPage(cur-1); });
  $('cNext').addEventListener('click', function(){ goPage(cur+1); });
  pagesEl.addEventListener('keydown', function(e){ if(e.key === 'ArrowRight'){ e.preventDefault(); goPage(cur+1); } if(e.key === 'ArrowLeft'){ e.preventDefault(); goPage(cur-1); } });
  /* Farede de sürükleyerek çevrilir (dokunmatik zaten kayar). */
  var pgDrag = null;
  pagesEl.addEventListener('pointerdown', function(e){ if(e.pointerType !== 'mouse') return; pgDrag = {x:e.clientX, s:pagesEl.scrollLeft}; });
  addEventListener('pointerup', function(e){ if(!pgDrag) return; var dx = e.clientX - pgDrag.x; pgDrag = null; if(Math.abs(dx) > 40) goPage(cur + (dx < 0 ? 1 : -1)); });
  label();
  function drawStars(){ [].forEach.call(document.querySelectorAll('canvas.stars'), function(cv){ var r = cv.getBoundingClientRect(); if(!r.width) return; cv.width = r.width; cv.height = r.height; var g = cv.getContext('2d'), seed = +cv.dataset.seed || 7; function rnd(){ seed = (seed*9301+49297)%233280; return seed/233280; } for(var s=0;s<90;s++){ g.globalAlpha = .3+rnd()*.6; g.fillStyle = '#DFE2EC'; g.beginPath(); g.arc(rnd()*r.width, rnd()*r.height, rnd()*1.4+.3, 0, 7); g.fill(); } }); }

  /* ---------- Masa: bilgisayarda notlar taşınır, telefonda düz sütun ---------- */
  var desk = $('desk');
  [].forEach.call(desk.querySelectorAll('.sticky'), function(n){
    n.addEventListener('pointerdown', function(e){
      if(desk.clientWidth < 740) return;
      e.preventDefault(); n.setPointerCapture(e.pointerId);
      var dr = desk.getBoundingClientRect(), nr = n.getBoundingClientRect(), ox = e.clientX-nr.left, oy = e.clientY-nr.top; n.style.zIndex = 5;
      function mv(ev){ n.style.left = Math.max(0,Math.min(dr.width-nr.width, ev.clientX-dr.left-ox))+'px'; n.style.top = Math.max(0,Math.min(dr.height-nr.height, ev.clientY-dr.top-oy))+'px'; }
      function up(){ n.removeEventListener('pointermove',mv); n.removeEventListener('pointerup',up); n.style.zIndex = 3; tick(500); }
      n.addEventListener('pointermove',mv); n.addEventListener('pointerup',up);
    });
  });

  /* ---------- Oyuncak: çark ---------- */
  var wheel = $('wheel'), rot = 0, tInt = null;
  wheel.style.background = 'conic-gradient(#BEA8EE 0 120deg,#96BEE8 120deg 240deg,#EE96BA 240deg 360deg)';
  $('spinBtn').addEventListener('click', function(){
    var opts = ['w1','w2','w3'].map(function(id){ return $(id).value.trim() || '⟪Bir iş¦Something⟫'; }), pickI = Math.floor(Math.random()*3);
    var target = 360 - (pickI*120 + 60); rot += 360*4 + ((target - rot%360) + 360) % 360; wheel.style.transform = 'rotate('+rot+'deg)';
    var tEl = $('timer'); clearInterval(tInt); tEl.textContent = '⟪Dönüyor…¦Spinning…⟫'; tick(400);
    setTimeout(function(){ var left = 120; function tk(){ var m = Math.floor(left/60), s = left%60; tEl.textContent = '"'+opts[pickI]+'⟪" · sadece 2 dakika: ¦" · just 2 minutes: ⟫'+m+':'+(s<10?'0':'')+s; if(left-- <= 0){ clearInterval(tInt); tEl.textContent = '⟪Güzel, başladın.¦Nice, you started.⟫'; } } tk(); tick(880); tInt = setInterval(tk, 1000); }, reduce ? 0 : 3200);
  });
  /* Oyuncak: hangi şablon sensin */
  var QUIZ = [
    {q:'⟪Bu ay hayatında en çok ne değişiyor?¦What\'s changing most in your life this month?⟫', a:[['⟪Okul ya da sınav¦School or exams⟫',[0,8]],['⟪İş ya da ev¦Work or home⟫',[1,2]],['⟪Ailem büyüyor¦My family is growing⟫',[4,7]],['⟪Kendim¦Me⟫',[5,6]]]},
    {q:'⟪En çok neye ihtiyacın var?¦What do you need most?⟫', a:[['⟪Düzen¦Some order⟫',[0,3]],['⟪Hazırlık listesi¦A to-do list for getting ready⟫',[1,4,7]],['⟪Sakin bir başlangıç¦A calm start⟫',[2,5,8]],['⟪Bir alışkanlığı bırakmak¦To quit a habit⟫',[6]]]},
    {q:'⟪Sence iyi bir gün nasıl biter?¦How does a good day end?⟫', a:[['⟪Tekrarımı bitirmişim¦My revision is done⟫',[0,8]],['⟪Kutular azalmış¦Fewer boxes left⟫',[1]],['⟪Hesabım tutmuş¦The numbers add up⟫',[3]],['⟪İçim rahat¦I feel at peace⟫',[4,5,6,7,2]]]}
  ];
  var quiz = $('quiz'), qi = 0, score = [];
  function drawQuiz(){
    if(qi === 0) score = TPL.map(function(){ return 0; });
    if(qi < QUIZ.length){
      var q = QUIZ[qi]; quiz.innerHTML = '<p class="qq">'+(qi+1)+'/3 · '+esc(q.q)+'</p><div class="qa">'+q.a.map(function(a,i){ return '<button type="button" data-i="'+i+'">'+esc(a[0])+'</button>'; }).join('')+'</div>';
      [].forEach.call(quiz.querySelectorAll('.qa button'), function(b){ b.addEventListener('click', function(){ q.a[+b.dataset.i][1].forEach(function(t){ score[t]++; }); qi++; tick(600); drawQuiz(); }); });
    } else {
      var best = score.indexOf(Math.max.apply(null, score)), t = TPL[best];
      quiz.innerHTML = '<div class="res"><span class="eyebrow" style="color:#4A6E45">⟪Sana uyan şablon¦The template for you⟫</span><b>'+esc(t.n)+'</b><p>⟪İlk üç dalın: ¦Your first three branches: ⟫'+t.b.map(function(b){ return esc(b[0]); }).join(', ')+'.</p><div class="row-btns"><a class="btn2 primary" href="#sablon" id="quizTry" style="text-decoration:none">⟪Şablonu dene¦Try the template⟫</a><button class="btn2" type="button" id="quizAgain">⟪Tekrar¦Again⟫</button></div></div>';
      $('quizTry').addEventListener('click', function(){ tplSel.value = best; drawTpl(); });
      $('quizAgain').addEventListener('click', function(){ qi = 0; drawQuiz(); }); tick(990);
    }
  }
  drawQuiz();
  /* Oyuncak: yıl yaprakları (kural: LEAF_EVERY günde yaprak, en fazla LEAF_CAP, dinlenme serbest) */
  var yc = $('year'), yseed = 11;
  function yrnd(){ yseed = (yseed*9301+49297)%233280; return yseed/233280; }
  function drawYear(){
    var r = yc.getBoundingClientRect(); if(!r.width) return; var dpr = window.devicePixelRatio||1; yc.width = r.width*dpr; yc.height = r.height*dpr;
    var g = yc.getContext('2d'); g.scale(dpr,dpr); var W = r.width, H = r.height; g.clearRect(0,0,W,H); var s0 = yseed;
    var pts = []; for(var i=0;i<365;i++){ var t = i/364; pts.push([24+t*(W-48), H/2+Math.sin(t*Math.PI*5)*H*0.26*(0.6+0.4*Math.sin(t*9))]); }
    g.strokeStyle = 'rgba(166,203,158,.55)'; g.lineWidth = 2; g.beginPath(); pts.forEach(function(p,i){ i ? g.lineTo(p[0],p[1]) : g.moveTo(p[0],p[1]); }); g.stroke();
    var leaves = 0, streak = 0, prevMiss = false;
    pts.forEach(function(p,i){
      var roll = yrnd(), type = roll < 0.05 ? 'rest' : roll < 0.12 ? 'miss' : 'done';
      if(type === 'done'){ streak++; if(streak % LEAF_EVERY === 0 && leaves < LEAF_CAP) leaves++; prevMiss = false; }
      else if(type === 'miss'){ if(!prevMiss && leaves > 0){ leaves--; streak++; type = 'leaf'; prevMiss = false; } else { streak = 0; prevMiss = true; } }
      var col = type === 'done' ? '#8FBF86' : type === 'leaf' ? '#E8C87A' : type === 'rest' ? '#96BEE8' : 'rgba(223,226,236,.18)';
      var side = i%2 ? 1 : -1, len = 7+yrnd()*4, ang = side*(0.9+yrnd()*0.5);
      g.save(); g.translate(p[0],p[1]); g.rotate(ang); g.fillStyle = col; g.beginPath(); g.moveTo(0,0); g.quadraticCurveTo(len*0.5,-len*0.45,len,0); g.quadraticCurveTo(len*0.5,len*0.45,0,0); g.fill(); g.restore();
    });
    yseed = s0;
    g.fillStyle = '#DFE2EC'; g.font = '800 14px Nunito, sans-serif'; g.fillText('⟪bir yıl · 365 yaprak¦one year · 365 leaves⟫', 24, 24);
    g.font = '800 13px Nunito, sans-serif';
    g.fillStyle = '#8FBF86'; g.fillText('● ⟪yapıldı¦done⟫', 24, H-14); g.fillStyle = '#E8C87A'; g.fillText('● ⟪yaprak¦leaf⟫', 112, H-14); g.fillStyle = '#96BEE8'; g.fillText('● ⟪dinlenme¦rest⟫', 186, H-14);
  }
  $('yearBtn').addEventListener('click', function(){ yseed = Math.floor(Math.random()*9999)+1; drawYear(); tick(700); });

  /* ---------- Almanak: gerçek ay evresi ---------- */
  var SEASON = ['⟪kış¦winter⟫','⟪kış¦winter⟫','⟪ilkbahar¦spring⟫','⟪ilkbahar¦spring⟫','⟪ilkbahar¦spring⟫','⟪yaz¦summer⟫','⟪yaz¦summer⟫','⟪yaz¦summer⟫','⟪sonbahar¦autumn⟫','⟪sonbahar¦autumn⟫','⟪sonbahar¦autumn⟫','⟪kış¦winter⟫'];
  var QS = ['⟪Bugün ne iyi gitti, neden?¦What went well today, and why?⟫','⟪Yarın için tek bir şey.¦One thing for tomorrow.⟫','⟪Bugün neyi yoluna koydun?¦What did you sort out today?⟫','⟪Her şey olabileceği kadar iyi gitseydi...¦If everything went as well as it could...⟫','⟪Bugün neler yaşadın?¦What happened today?⟫'];
  var doy = Math.floor((now - new Date(now.getFullYear(),0,0))/864e5);
  var age = (((now - Date.UTC(2000,0,6,18,14))/864e5) % 29.530588 + 29.530588) % 29.530588;
  var phase = age<1.8?'⟪yeni ay¦new moon⟫':age<7.4?'⟪hilal¦waxing crescent⟫':age<9.2?'⟪ilk dördün¦first quarter⟫':age<14.8?'⟪büyüyen ay¦waxing gibbous⟫':age<16.6?'⟪dolunay¦full moon⟫':age<22.1?'⟪küçülen ay¦waning gibbous⟫':age<23.9?'⟪son dördün¦last quarter⟫':'⟪son hilal¦waning crescent⟫';
  $('almDow').textContent = DOW[now.getDay()] + ' · ' + SEASON[now.getMonth()] + (now.getDay() === 1 ? '⟪ · haftaya bakma günü¦ · a day to look back at the week⟫' : '');
  $('almDay').textContent = now.getDate();
  $('almMonth').textContent = MON[now.getMonth()] + ' ' + now.getFullYear();
  $('almMoon').textContent = '⟪gökyüzü: ¦sky: ⟫' + phase + '⟪ · yılın ¦ · day ⟫' + doy + '⟪. günü¦ of the year⟫';
  $('almQ').textContent = QS[doy % QS.length];
  var ac = $('almCanvas');
  function drawAlm(){
    var r = ac.getBoundingClientRect(); if(!r.width) return; ac.width = r.width; ac.height = r.height;
    var g = ac.getContext('2d'), W = r.width, H = r.height, sd = now.getFullYear()*1000 + doy;
    function rr(){ sd = (sd*9301+49297)%233280; return sd/233280; }
    var grd = g.createLinearGradient(0,0,0,H); grd.addColorStop(0,'#1B1E3A'); grd.addColorStop(1,'#0C0E1F'); g.fillStyle = grd; g.fillRect(0,0,W,H);
    for(var i=0;i<140;i++){ g.globalAlpha = .25+rr()*.7; g.fillStyle = '#DFE2EC'; g.beginPath(); g.arc(rr()*W, rr()*H, rr()*1.3+.3, 0, 7); g.fill(); }
    g.globalAlpha = 1; var mx = W*0.8, my = H*0.26, mr = Math.min(W,H)*0.09, lit = age/29.53;
    g.fillStyle = '#E8E4D0'; g.beginPath(); g.arc(mx,my,mr,0,7); g.fill();
    var sx = lit < 0.5 ? mx - (lit/0.5)*2*mr : mx + (1-(lit-0.5)/0.5)*2*mr;
    g.fillStyle = '#16193A'; g.beginPath(); g.arc(sx, my, mr*1.02, 0, 7); g.fill();
    g.strokeStyle = getComputedStyle(root).getPropertyValue('--season').trim() || '#E8C87A'; g.globalAlpha = .5; g.lineWidth = 2; g.beginPath();
    for(var x=0;x<=W;x+=8){ var y = H-18 + Math.sin(x/40)*6; x ? g.lineTo(x,y) : g.moveTo(x,y); } g.stroke(); g.globalAlpha = 1;
  }

  /* ---------- Boyuta bağlı çizimler ---------- */
  var lastW = 0; ready = true;
  function redrawAll(){ if(!ready) return; stDraw(); layoutFlip(); drawVine(); drawStars(); drawYear(); drawAlm(); }
  addEventListener('resize', function(){ if(innerWidth === lastW) return; lastW = innerWidth; requestAnimationFrame(redrawAll); });
  lastW = innerWidth; redrawAll();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ layoutFlip(); drawVine(); drawYear(); });
  routeHash();

  /* ---------- Dil: düğme tercihi hatırlar ve aynı yerde kalır. Tercih yoksa ve tarayıcı dili
     bu sayfanın dili değilse öteki dile küçük bir öneri gösterilir (yönlendirme YOK). ---------- */
  var langA = $('langSw'), langH = $('langHint'), saved = store('vyne-site-lang');
  if(!saved && (navigator.language||'').toLowerCase().indexOf(PAGE_LANG) !== 0) langH.hidden = false;
  [langA, langH].forEach(function(el){ el.addEventListener('click', function(e){ e.preventDefault(); store('vyne-site-lang', langA.dataset.lang); location.href = el.getAttribute('href') + location.hash; }); });
})();
