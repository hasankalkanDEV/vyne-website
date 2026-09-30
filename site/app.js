(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var PAGE_LANG = '{{LANG}}', ready = false;
  /* Uygulamanın kuralları (vyne/src/constants.js). Değer site/live.json'da, derlemede buraya yazılır. */
  var LEAF_EVERY = {{LEAF_EVERY}}, LEAF_CAP = {{LEAF_CAP}};
  var ANDROID_LIVE = {{#android}}true{{/android}}{{^android}}false{{/android}};
  var IOS_URL = '{{IOS_URL}}', PLAY_URL = '{{PLAY_URL}}';
  /* ---------- Uygulamanın ekranlarının çizimleri (site/mocks.html) ----------
     Her çizim 300 px genişlikte; kutusuna sığacak kadar büyütülür/küçültülür. */
  var MOCKS = {}; [].forEach.call(document.querySelectorAll('#mocks template'), function(t){ MOCKS[t.dataset.mock] = t; });
  function fitMock(m){
    var k = m.firstElementChild; if(!k) return;
    var cw = m.clientWidth, ch = m.clientHeight, ih = k.offsetHeight; if(!cw || !ih) return;
    var s = Math.min(cw / 300, ch ? ch / ih : 9, +(m.dataset.max || 1.35));
    k.style.transform = 'translateX(-50%) scale(' + s + ')';
    k.style.top = Math.max(0, (ch - ih * s) / 2) + 'px';
  }
  var mockRO = 'ResizeObserver' in window ? new ResizeObserver(function(es){ es.forEach(function(e){ fitMock(e.target); }); }) : null;
  function mountMock(m, name){
    var t = MOCKS[name || m.dataset.mock]; if(!t) return;
    m.innerHTML = ''; m.appendChild(t.content.cloneNode(true)); m.setAttribute('aria-hidden', m.getAttribute('role') ? 'false' : 'true');
    fillToday(m); fitMock(m); if(mockRO) mockRO.observe(m);
  }
  function fillToday(root){
    var d = new Date();
    [].forEach.call(root.querySelectorAll('[data-today="d"]'), function(e){ e.textContent = d.getDate(); });
    [].forEach.call(root.querySelectorAll('[data-today="label"]'), function(e){ e.textContent = ['⟪Pazar¦Sunday⟫','⟪Pazartesi¦Monday⟫','⟪Salı¦Tuesday⟫','⟪Çarşamba¦Wednesday⟫','⟪Perşembe¦Thursday⟫','⟪Cuma¦Friday⟫','⟪Cumartesi¦Saturday⟫'][d.getDay()] + ' · ' + ['⟪Ocak¦January⟫','⟪Şubat¦February⟫','⟪Mart¦March⟫','⟪Nisan¦April⟫','⟪Mayıs¦May⟫','⟪Haziran¦June⟫','⟪Temmuz¦July⟫','⟪Ağustos¦August⟫','⟪Eylül¦September⟫','⟪Ekim¦October⟫','⟪Kasım¦November⟫','⟪Aralık¦December⟫'][d.getMonth()]; });
  }
  [].forEach.call(document.querySelectorAll('.mock[data-mock]'), function(m){ mountMock(m); });
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ [].forEach.call(document.querySelectorAll('.mock'), fitMock); });
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

  /* İlk görünüşte kendiliğinden bir kez sarmaşığa döner: düğmeye basmadan da fikir görülsün. */
  if('IntersectionObserver' in window && !reduce){
    var flatIO = new IntersectionObserver(function(en){ if(en[0].isIntersecting){ flatIO.disconnect(); setTimeout(function(){ if(!vineMode) $('flipBtn').click(); }, 900); } }, {threshold:.6});
    flatIO.observe(box);
  }

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
  var wellInner = $('wellInner'), well = $('well'), depth = $('depth'), pad = 60;
  /* Bilgisayarda notlar ipin iki yanına dizilir (sol/sağ), kuyu kısalır. Telefonda tek sütun. */
  var wide = window.matchMedia('(min-width:900px)').matches, WH = wide ? 1150 : 1900, prevY = -999, side = [-999, -999], marks = [];
  if(wide) well.classList.add('two');
  MARKS.sort(function(a,b){ return a.d-b.d; }).forEach(function(m, i){
    var s = wide ? i % 2 : 0;
    var y = Math.max(pad + (m.d-1)/99*(WH-2*pad), side[s] + 118, prevY + (wide ? 56 : 118)); prevY = y; side[s] = y;
    var el = document.createElement('div'); el.className = 'mark'+(m.k?' '+m.k:'')+(wide ? (s ? ' r' : ' l') : ''); el.style.top = y+'px';
    el.innerHTML = '<span class="dotm"></span><span>'+esc(m.t)+'<small>'+esc(m.s)+'</small></span>'; wellInner.appendChild(el); marks.push([el, y]);
  });
  /* Son durak (Gün 100) yazısıyla birlikte tam görünsün: kuyu en alttaki notun altında biter. */
  var wellH = prevY + wellInner.lastElementChild.offsetHeight + 90; wellInner.style.height = wellH + 'px';
  marks.forEach(function(p){ if(p[1]/wellH > 0.57) p[0].classList.add('deep'); });
  well.addEventListener('scroll', function(){ var p = well.scrollTop/(well.scrollHeight - well.clientHeight); depth.textContent = '⟪Gün ¦Day ⟫' + Math.max(1, Math.round(1 + p*99)); }, {passive:true});

  /* ---------- Sıradan bir gün ---------- */
  var now = new Date();
  var DOW = ['⟪Pazar¦Sunday⟫','⟪Pazartesi¦Monday⟫','⟪Salı¦Tuesday⟫','⟪Çarşamba¦Wednesday⟫','⟪Perşembe¦Thursday⟫','⟪Cuma¦Friday⟫','⟪Cumartesi¦Saturday⟫'];
  var MON = ['⟪Ocak¦January⟫','⟪Şubat¦February⟫','⟪Mart¦March⟫','⟪Nisan¦April⟫','⟪Mayıs¦May⟫','⟪Haziran¦June⟫','⟪Temmuz¦July⟫','⟪Ağustos¦August⟫','⟪Eylül¦September⟫','⟪Ekim¦October⟫','⟪Kasım¦November⟫','⟪Aralık¦December⟫'];
  var STOPS = [
    {t:'⟪07:30¦7:30⟫', part:'⟪sabah¦morning⟫', sky:['#F6E2BE','#F8F6F0'], title:'⟪Güne bakmak, beş uygulama açmadan¦See the day without opening five apps⟫', dert:'⟪"Bugün ne vardı?" Cevap beş ayrı uygulamaya dağılmış.¦"What\'s on today?" The answer is spread across five apps.⟫', how:'⟪Bugünün alışkanlıkları en üstte; hepsi bitince küçük bir kutlama. Altında hayatın sağa doğru dal dal duruyor.¦Today\'s habits sit at the top; when they\'re all ticked it says "All done!". Below, your life branches out to the right.⟫', mock:'home'},
    {t:'12:40', part:'⟪öğle¦midday⟫', sky:['#CFE3F2','#F8F6F0'], title:'⟪Aklına geleni buluta yaz¦Write it on the cloud⟫', dert:'⟪Toplantıda aklına bir şey geliyor; doğru yeri bulana kadar uçup gidiyor.¦A thought hits you in a meeting and flies away before you find the right place for it.⟫', how:'⟪Profil balonundan yükselen küçük buluta dokun, yaz. Gelen Kutusu\'na düşer; akşam "Gönder…" ile doğru klasöre yollarsın.¦Tap the little cloud rising from your profile bubble and write. It lands in your Inbox; in the evening, "Send to…" puts it in the right folder.⟫', mock:'cloud'},
    {t:'17:15', part:'⟪akşamüstü¦late afternoon⟫', sky:['#F2D2B5','#F5EFE0'], title:'⟪Liste de hatırlatıcı da tek yerde¦Lists and reminders, in one place⟫', dert:'⟪Market listen bir yerde, kira hatırlatıcın başka yerde.¦Your grocery list lives in one app, the rent reminder in another.⟫', how:'⟪Logonun altındaki "notes"a dokun, sonra Ekle: klasör, not, liste, hatırlatıcı, çevre, haftalık defter, günlük. Kâğıdını da orada seçersin.¦Tap "notes" under the logo, then Add: folder, note, list, reminders, people, weekly diary, daily journal. You pick the paper right there.⟫', mock:'notes'},
    {t:'19:00', part:'⟪akşam¦evening⟫', sky:['#E6C7D8','#F7F2F6'], title:'⟪Karar veremeyince çarkı çevir¦Can\'t decide? Spin for one⟫', dert:'⟪Yorgunsun, yapacak çok şey var, hiçbirine başlayasın gelmiyor.¦You\'re tired, there\'s a lot to do, and you don\'t feel like starting any of it.⟫', how:'⟪Başlıktaki çark düğmesine dokun, çark bugünün alışkanlıklarından birini seçer. Tek kural: sadece 2 dakika başla.¦Tap "Can\'t decide? Spin for one" in the header and the wheel picks one of today\'s habits. Just 2 minutes: that\'s the whole rule.⟫', mock:'wheel'},
    {t:'21:00', part:'⟪hasta bir akşam¦a sick evening⟫', sky:['#DCE6F5','#F2F4F8'], title:'⟪Hasta bir gün, seri ne olacak?¦A sick day. What about the streak?⟫', dert:'⟪Hasta olunca seri gider, sonra insan hepsini bırakır.¦Get sick, lose the streak, and it\'s easy to drop everything.⟫', how:'⟪Dalın sayfasını aç, takvimde günü seç, "ya da bugün ara ver" → Hasta. Serin seni bekler: ne uzar, ne bozulur. Dünü ve önceki günü sonradan da düzeltebilirsin.¦Open the branch page, pick the day, "or take a break today" → Sick. Your streak waits: it doesn\'t grow, it doesn\'t break. You can also fix yesterday and the day before.⟫', mock:'branch'},
    {t:'22:30', part:'⟪gece¦night⟫', sky:['#1B1E3A','#12142A'], night:true, title:'⟪Günlük, istersen bir soruyla¦A journal, with a question if you want one⟫', dert:'⟪Günlük tutmak istiyorsun ama boş sayfa korkutuyor.¦You want to keep a journal, but the blank page is scary.⟫', how:'⟪Her gün bir sayfa. Ne yazacağını bilmiyorsan bir soru önerir. "1 yıl önce bugün" ne yazdığını da gösterir.¦One page a day. If you don\'t know what to write, it offers a question. It also shows what you wrote a year ago today.⟫', mock:'journal'},
    {t:'⟪Pazartesi¦Monday⟫', part:'⟪hafta¦the week⟫', sky:['#DCE9D4','#F3F1DE'], title:'⟪Haftaya bir bakış¦A look back at the week⟫', dert:'⟪Hafta nasıl geçti, durup düşünmeye vakit olmuyor.¦There\'s never time to stop and think about how the week went.⟫', how:'⟪İstatistik günleri, haftanın şeklini ve son 12 haftayı gösterir. Gri kare sadece "o gün bir şey olmadı" demek, fazlası değil. Pazartesileri günlükte haftaya bakan üç soru daha çıkar.¦Stats shows your days, your week\'s shape and the last 12 weeks. Gray means nothing happened. Nothing more. On Mondays the journal adds three questions about the week.⟫', mock:'stats'}
  ];
  var day = $('day'), stopsEl = $('dStops'), dscr = $('dScreen'), di = 0;
  STOPS.forEach(function(s,i){ var b = document.createElement('button'); b.type = 'button'; b.textContent = s.t; b.addEventListener('click', function(){ showDay(i); }); stopsEl.appendChild(b); });
  function showDay(i){
    di = (i + STOPS.length) % STOPS.length; var s = STOPS[di];
    day.style.setProperty('--sky1', s.sky[0]); day.style.setProperty('--sky2', s.sky[1]); day.classList.toggle('night', !!s.night);
    $('dClock').textContent = s.t; $('dPart').textContent = s.part;
    $('dTitle').textContent = s.title; $('dDert').textContent = s.dert; $('dHow').textContent = s.how;
    mountMock($('dMock'), s.mock); $('dScreen').setAttribute('aria-label', s.title);
    $('dCount').textContent = (di+1)+' / '+STOPS.length;
    [].forEach.call(stopsEl.children, function(b,k){ b.setAttribute('aria-current', String(k === di)); });
    var cur = stopsEl.children[di]; stopsEl.scrollTo({ left: cur.offsetLeft - (stopsEl.clientWidth - cur.offsetWidth)/2, behavior: reduce ? 'auto' : 'smooth' });
    tick(460 + di*40);
  }
  /* Parmakla yana kaydırınca bir sonraki durak */
  var dsx = null, dsy = 0;
  day.addEventListener('touchstart', function(e){ if(e.target.closest('.stops')) return; dsx = e.touches[0].clientX; dsy = e.touches[0].clientY; }, {passive:true});
  day.addEventListener('touchend', function(e){ if(dsx === null) return; var dx = e.changedTouches[0].clientX - dsx, dy = e.changedTouches[0].clientY - dsy; dsx = null; if(Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)*1.5) showDay(di + (dx < 0 ? 1 : -1)); }, {passive:true});
  day.addEventListener('keydown', function(e){ if(e.key === 'ArrowRight'){ e.preventDefault(); showDay(di+1); } if(e.key === 'ArrowLeft'){ e.preventDefault(); showDay(di-1); } });
  $('dPrev').addEventListener('click', function(){ showDay(di-1); });
  $('dNext').addEventListener('click', function(){ showDay(di+1); });
  showDay(0);

  /* ---------- Şablon denemesi: uygulamanın 9 şablonu, bütün dallarıyla (vyne/src/constants.js → site/templates.json) ---------- */
  var TD = {{TEMPLATES}}, TPL = TD.list, TG = TD.glyphs, tplI = 0;
  var tplPick = $('tplPick'), tplDate = $('tplDate'), tplOut = $('tplOut');
  var WDAY = ['⟪Pazar¦Sunday⟫','⟪Pazartesi¦Monday⟫','⟪Salı¦Tuesday⟫','⟪Çarşamba¦Wednesday⟫','⟪Perşembe¦Thursday⟫','⟪Cuma¦Friday⟫','⟪Cumartesi¦Saturday⟫'];
  var MSHORT = ['⟪Oca¦Jan⟫','⟪Şub¦Feb⟫','⟪Mar¦Mar⟫','⟪Nis¦Apr⟫','⟪May¦May⟫','⟪Haz¦Jun⟫','⟪Tem¦Jul⟫','⟪Ağu¦Aug⟫','⟪Eyl¦Sep⟫','⟪Eki¦Oct⟫','⟪Kas¦Nov⟫','⟪Ara¦Dec⟫'];
  var TCOL = ['#E7DFFA','#DDF3E8','#DCE6F5','#F7EFC9','#F7DCE8','#F4E4CF','#E4F4E0','#EDE3F2'];
  TPL.forEach(function(t,i){ var b = document.createElement('button'); b.type = 'button'; b.innerHTML = (TG[t.g] || '') + esc(t.n); b.addEventListener('click', function(){ tplI = i; drawTpl(); tick(560); }); tplPick.appendChild(b); });
  var d0 = new Date(Date.now() + 30*864e5); tplDate.value = d0.getFullYear()+'-'+String(d0.getMonth()+1).padStart(2,'0')+'-'+String(d0.getDate()).padStart(2,'0');
  function tagOf(n, anchor){
    if(n.k === 'habit'){
      var txt = n.rec === 'daily' ? '⟪her gün¦every day⟫' : n.rec === 'weekly' ? '⟪her ¦every ⟫'+(n.days||[]).map(function(d){ return WDAY[d]; }).join(', ') : n.rec === 'monthly' ? '⟪ayda bir¦monthly⟫' : '⟪alışkanlık¦habit⟫';
      return '<span class="tag h">'+esc(txt)+'</span>';
    }
    if(n.k === 'due' && anchor){ var dd = new Date(anchor.getTime() + (n.off||0)*864e5); return '<span class="tag d">'+dd.getDate()+' '+MSHORT[dd.getMonth()]+'</span>'; }
    return '';
  }
  function drawTpl(){
    var t = TPL[tplI], anchor = tplDate.value ? new Date(tplDate.value+'T12:00:00') : null, count = {all:0, habit:0, due:0};
    [].forEach.call(tplPick.children, function(b,k){ b.setAttribute('aria-pressed', String(k === tplI)); });
    $('tplDesc').textContent = t.d;
    $('tplDateBox').hidden = !t.q; if(t.q) $('tplQ').textContent = t.q;
    if(!t.q) anchor = null;
    function row(n, i, depth){
      count.all++; if(n.k === 'habit') count.habit++; if(n.k === 'due') count.due++;
      var h = '<div class="tn'+(n.c ? ' has' : '')+'" style="--c:'+TCOL[i % TCOL.length]+'"><span class="gi">'+(TG[n.g]||'')+'</span><b>'+esc(n.t)+'</b>'+tagOf(n, anchor)+(n.c ? '<button type="button" class="tk" aria-expanded="false">+'+n.c.length+'<span class="vh">⟪ alt dal¦ sub-branches⟫</span></button>' : '')+'</div>';
      if(n.c) h += '<div class="kids deep">'+n.c.map(function(x,k){ return row(x, i+k+1, depth+1); }).join('')+'</div>';
      return h;
    }
    var kids = t.c.map(function(n,i){ return row(n, i, 1); }).join('');
    var days = anchor ? Math.round((anchor - new Date())/864e5) : null;
    tplOut.innerHTML = '<p class="eyebrow">⟪Bunlar oluşturulacak¦This will be created⟫</p>' +
      '<div class="tree"><div class="tn root"><span class="gi" style="--c:#fff">'+(TG[t.g]||'')+'</span><b>'+esc(t.n)+'</b>'+(days!=null?'<span class="tag">'+(days>0?days+'⟪ gün kaldı¦ days to go⟫':'⟪bugün¦today⟫')+'</span>':'')+'</div><div class="kids">'+kids+'</div></div>' +
      '<p class="tpl-sum">'+count.all+'⟪ dal¦ branches⟫'+(count.habit?' · '+count.habit+(count.habit === 1 ? '⟪ alışkanlık¦ habit⟫' : '⟪ alışkanlık¦ habits⟫'):'')+(count.due?' · '+count.due+(count.due === 1 ? '⟪ tarihli iş¦ dated step⟫' : '⟪ tarihli iş¦ dated steps⟫'):'')+'</p>';
  }
  tplDate.addEventListener('change', drawTpl); drawTpl();
  /* Telefonda alt dallar katlı; "+3" düğmesi açar. */
  tplOut.addEventListener('click', function(e){
    var b = e.target.closest('.tk'); if(!b) return;
    var open = b.parentNode.classList.toggle('open'); b.setAttribute('aria-expanded', String(open)); b.firstChild.nodeValue = open ? '−' : '+'+b.parentNode.nextElementSibling.children.length;
  });
  /* Yenilikler: son sürümün ilk 5 maddesi, gerisi "Tümünü gör" ile. */
  (function(){
    var ul = document.querySelector('.log > .ver ul'); if(!ul || ul.children.length < 7) return;
    var n = ul.children.length; ul.classList.add('clip');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'more-btn'; b.textContent = '⟪Tümünü gör¦See all⟫ ('+n+')';
    b.addEventListener('click', function(){ ul.classList.remove('clip'); b.remove(); });
    ul.parentNode.appendChild(b);
  })();

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
  [].forEach.call(document.querySelectorAll('.pg-apply'), function(b){ b.addEventListener('click', function(){ setPaper(b.dataset.paper); tick(600); }); });
  function drawStars(){ [].forEach.call(document.querySelectorAll('canvas.stars'), function(cv){ var r = cv.getBoundingClientRect(); if(!r.width) return; cv.width = r.width; cv.height = r.height; var g = cv.getContext('2d'), seed = +cv.dataset.seed || 7; function rnd(){ seed = (seed*9301+49297)%233280; return seed/233280; } for(var s=0;s<90;s++){ g.globalAlpha = .3+rnd()*.6; g.fillStyle = '#DFE2EC'; g.beginPath(); g.arc(rnd()*r.width, rnd()*r.height, rnd()*1.4+.3, 0, 7); g.fill(); } }); }

  /* ---------- Telefonda yana kayan sıralar: "3 / 11" sayacı ---------- */
  [].forEach.call(document.querySelectorAll('.feats, .garden'), function(sc){
    var hint = sc.classList.contains('feats') ? sc.closest('.group').querySelector('.swipehint') : sc.previousElementSibling && sc.previousElementSibling.querySelector('.swipehint');
    if(!hint || !hint.classList.contains('swipehint')) return;
    var n = sc.children.length;
    var nav = document.createElement('span'); nav.className = 'rownav';
    nav.innerHTML = '<button type="button" aria-label="⟪Önceki¦Previous⟫">‹</button><button type="button" aria-label="⟪Sonraki¦Next⟫">›</button>';
    hint.after(nav);
    var bp = nav.children[0], bn = nav.children[1];
    function step(){ return sc.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(sc).columnGap || 14); }
    function perView(){ return Math.max(1, Math.round(sc.clientWidth / step())); }
    function upd(){ var k = Math.round(sc.scrollLeft / step()), pv = perView(), last = Math.min(n, k + pv);
      hint.textContent = (pv > 1 ? (k + 1) + '–' + last : last) + ' / ' + n;
      bp.disabled = sc.scrollLeft < 4; bn.disabled = sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 4; }
    bp.addEventListener('click', function(){ sc.scrollBy({left: -step() * perView(), behavior: reduce ? 'auto' : 'smooth'}); });
    bn.addEventListener('click', function(){ sc.scrollBy({left: step() * perView(), behavior: reduce ? 'auto' : 'smooth'}); });
    sc.addEventListener('scroll', function(){ requestAnimationFrame(upd); }, {passive:true}); addEventListener('resize', upd); upd();
  });

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

  /* ---------- Oyuncak: çark (uygulamadaki gibi: dilimler, çizimler, sadece 2 dakika) ---------- */
  var WCOL = ['#BEA8EE','#A8E6C8','#96BEE8','#EEE096','#CDBDF2','#F2C4A6'];
  var WKEY = [[/yürü|koş|walk|run|jog/i,'runner'],[/oku|kitap|sayfa|read|book|page/i,'openbook'],[/mutfak|topla|temiz|tidy|clean|kitchen|dust/i,'broom'],[/\bsu\b|water|drink/i,'drop'],[/ara\b|call|phone|telefon/i,'phone'],[/yaz|günlük|write|journal|note/i,'pencil'],[/spor|antrenman|gym|workout|egzersiz/i,'dumbbell'],[/müzik|gitar|piyano|music|guitar|piano/i,'music'],[/kahve|çay|coffee|tea/i,'coffee'],[/uyku|yat|sleep|nap/i,'bed']];
  var WFALL = ['sprout','star','heart','sun','bulb','leafB'];
  var wItems = ['⟪10 dk yürüyüş¦10 min walk⟫','⟪Mutfağı topla¦Tidy the kitchen⟫','⟪Bir sayfa oku¦Read one page⟫','⟪Annemi ara¦Call mom⟫'];
  var wheelSvg = $('wheel'), wList = $('wList'), wRes = $('wRes'), wPointer = $('wPointer'), wRot = 0, wSpinning = false, wInt = null;
  function wGlyph(t, i){ for(var k=0;k<WKEY.length;k++) if(WKEY[k][0].test(t)) return WKEY[k][1]; return WFALL[i % WFALL.length]; }
  function inSvg(name, x, y, s){ return (G[name] || '').replace('<svg class="g"', '<svg x="'+(x-s/2)+'" y="'+(y-s/2)+'" width="'+s+'" height="'+s+'" class="gw"'); }
  function drawWheel(win){
    var n = wItems.length, R = 140, s = 360/n, out = '<circle r="162" fill="none" stroke="#E9D9B4" stroke-width="10" opacity=".7"/><g id="wRot" transform="rotate('+wRot+')">';
    wItems.forEach(function(t,i){
      var a0 = (i*s - 90)*Math.PI/180, a1 = ((i+1)*s - 90)*Math.PI/180, am = (a0+a1)/2;
      out += '<path class="sl'+(i === win ? ' win' : '')+'" fill="'+WCOL[i % WCOL.length]+'" d="M0 0 L'+(R*Math.cos(a0)).toFixed(2)+' '+(R*Math.sin(a0)).toFixed(2)+' A'+R+' '+R+' 0 '+(s > 180 ? 1 : 0)+' 1 '+(R*Math.cos(a1)).toFixed(2)+' '+(R*Math.sin(a1)).toFixed(2)+' Z"/>';
      out += '<g transform="rotate('+((i+0.5)*s)+')">'+inSvg(wGlyph(t,i), 0, -R*0.62, 38)+'</g>';
      out += '<circle cx="'+(152*Math.cos(a0)).toFixed(2)+'" cy="'+(152*Math.sin(a0)).toFixed(2)+'" r="4" fill="#fff" stroke="#D9C392" stroke-width="1.5"/>';
    });
    out += '</g><circle r="22" fill="#fff" stroke="#E8E4DC" stroke-width="2"/>'+inSvg('sprout', 0, 0, 28);
    wheelSvg.innerHTML = out; wheelSvg.classList.toggle('picked', win != null);
  }
  function drawWList(){
    wList.innerHTML = '';
    wItems.forEach(function(t,i){
      var r = document.createElement('div'); r.className = 'wrow2';
      r.innerHTML = '<span class="sw" style="background:'+WCOL[i % WCOL.length]+'">'+(G[wGlyph(t,i)]||'')+'</span><input maxlength="28" aria-label="⟪İş ¦Task ⟫'+(i+1)+'"><button type="button" aria-label="⟪Sil¦Remove⟫">×</button>';
      var inp = r.querySelector('input'); inp.value = t;
      inp.addEventListener('input', function(){ wItems[i] = inp.value; r.querySelector('.sw').innerHTML = G[wGlyph(inp.value,i)] || ''; drawWheel(); });
      var del = r.querySelector('button'); del.disabled = wItems.length <= 2; del.style.visibility = wItems.length <= 2 ? 'hidden' : 'visible';
      del.addEventListener('click', function(){ wItems.splice(i,1); drawWList(); drawWheel(); });
      wList.appendChild(r);
    });
    $('wAdd').disabled = wItems.length >= 6; $('wAdd').style.display = wItems.length >= 6 ? 'none' : '';
  }
  $('wAdd').addEventListener('click', function(){ if(wItems.length >= 6) return; wItems.push(''); drawWList(); drawWheel(); var ins = wList.querySelectorAll('input'); ins[ins.length-1].focus(); });
  function underPointer(){ var n = wItems.length, s = 360/n; return Math.floor((((360 - wRot) % 360) + 360) % 360 / s) % n; }
  function showResult(i){
    var t = (wItems[i] || '').trim() || '⟪Bir iş¦Something⟫', total = 120, left = total, C = 2*Math.PI*24;
    wRes.hidden = false;
    wRes.innerHTML = '<span class="ic" style="background:'+WCOL[i % WCOL.length]+'">'+(G[wGlyph(t,i)]||'')+'</span><b>'+esc(t)+'</b><span>⟪Sadece 2 dakika. Başla, gerisi gelir.¦Just 2 minutes. Start, the rest follows.⟫</span>' +
      '<span class="ring"><svg viewBox="0 0 58 58"><circle cx="29" cy="29" r="24" fill="none" stroke="#EFE9DA" stroke-width="6"/><circle id="wArc" cx="29" cy="29" r="24" fill="none" stroke="#6E9468" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="0"/></svg><em id="wT">2:00</em></span>' +
      '<span class="acts"><button type="button" id="wDone">⟪Başladım¦I started⟫</button><button type="button" id="wAgain">⟪Tekrar çevir¦Spin again⟫</button></span>';
    clearInterval(wInt);
    wInt = setInterval(function(){ left--; var m = Math.floor(left/60), s = left%60, el = $('wT'), arc = $('wArc'); if(!el){ clearInterval(wInt); return; }
      el.textContent = m+':'+(s<10?'0':'')+s; arc.setAttribute('stroke-dashoffset', (C*(1 - left/total)).toFixed(1));
      if(left <= 0){ clearInterval(wInt); el.textContent = '✓'; tick(990); } }, 1000);
    $('wDone').addEventListener('click', function(){ clearInterval(wInt); wRes.innerHTML = '<span class="ic" style="background:#E4F4E0">'+G.leafB+'</span><b>⟪Güzel, başladın.¦Nice, you started.⟫</b><span>⟪Uygulamada bu, günün yaprağına sayılır.¦In the app, this counts for today.⟫</span>'; tick(880); });
    $('wAgain').addEventListener('click', spin);
  }
  function spin(){
    if(wSpinning) return;
    wItems = wItems.map(function(t){ return t.trim(); }).filter(Boolean); while(wItems.length < 2) wItems.push('⟪Bir iş¦Something⟫');
    drawWList(); clearInterval(wInt); wRes.hidden = true;
    var n = wItems.length, s = 360/n, win = Math.floor(Math.random()*n), jitter = (Math.random()-0.5)*s*0.6;
    var target = ((360 - (win+0.5)*s - jitter) % 360 + 360) % 360, from = wRot, to = from + 360*5 + ((target - from % 360) + 360) % 360;
    var dur = reduce ? 0 : 4200, t0 = performance.now(), last = underPointer(); wSpinning = true; $('spinBtn').disabled = true; drawWheel();
    (function step(t){
      var k = dur ? Math.min(1, (t - t0)/dur) : 1; wRot = from + (to - from)*(1 - Math.pow(1-k, 4));
      var g = $('wRot'); if(g) g.setAttribute('transform', 'rotate('+wRot+')');
      var u = underPointer(); if(u !== last){ last = u; wPointer.classList.remove('flick'); void wPointer.offsetWidth; wPointer.classList.add('flick'); tick(1200); }
      if(k < 1) requestAnimationFrame(step);
      else { wRot = to % 360; wSpinning = false; $('spinBtn').disabled = false; drawWheel(win); showResult(win); if(navigator.vibrate) navigator.vibrate(20); tick(880); }
    })(t0);
  }
  $('spinBtn').addEventListener('click', spin);
  drawWList(); drawWheel();
  /* ---------- Boyuta bağlı çizimler ---------- */
  var lastW = 0; ready = true;
  function redrawAll(){ if(!ready) return; layoutFlip(); drawVine(); drawStars(); }
  addEventListener('resize', function(){ if(innerWidth === lastW) return; lastW = innerWidth; requestAnimationFrame(redrawAll); });
  lastW = innerWidth; redrawAll();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ layoutFlip(); drawVine(); });
  routeHash();

  /* ---------- Dil: düğme tercihi hatırlar ve aynı yerde kalır. Tercih yoksa ve tarayıcı dili
     bu sayfanın dili değilse öteki dile küçük bir öneri gösterilir (yönlendirme YOK). ---------- */
  var langA = $('langSw'), langH = $('langHint'), langT = $('langToast'), saved = store('vyne-site-lang');
  if(!saved && (navigator.language||'').toLowerCase().indexOf(PAGE_LANG) !== 0) langT.hidden = false;
  $('langClose').addEventListener('click', function(){ langT.hidden = true; store('vyne-site-lang', PAGE_LANG); });
  [langA, langH].forEach(function(el){ el.addEventListener('click', function(e){ e.preventDefault(); store('vyne-site-lang', langA.dataset.lang); location.href = el.getAttribute('href') + location.hash; }); });
})();
