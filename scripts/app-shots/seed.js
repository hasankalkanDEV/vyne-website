// Örnek profil (gerçek kişi değil) — sitenin ekran görüntüleri için. lang: 'tr' | 'en'
module.exports = function seedScript(lang, opt = {}) {
  return `(() => {
  if (localStorage.getItem('seeded')) return;
  if (${JSON.stringify(!!opt.noseed)}) return;
  const L = ${JSON.stringify(lang)}; const OPT = ${JSON.stringify(opt)};
  const T = (tr, en) => L === 'tr' ? tr : en;
  const pad = n => String(n).padStart(2, '0');
  const ds = (off) => { const d = new Date(); d.setDate(d.getDate() + off); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const range = (from, to, skip = []) => { const out = []; for (let i = from; i <= to; i++) if (!skip.includes(i)) out.push(ds(-i)); return out; };
  const old = new Date(Date.now() - 60 * 864e5).toISOString();
  const base = (id, title, emoji, theme, parentId, extra = {}) => ({ id, title, emoji, theme, status: 'None', completedAt: null, note: '', dueDate: '', dueTime: '', recurrence: null, stackAfter: null, remindMe: true, amount: 0, amountUnit: '💵', children: [], parentId, createdAt: old, ...extra });
  const n = {};
  const add = (node) => { n[node.id] = node; if (node.parentId) n[node.parentId].children.push(node.id); };
  add(base('h', T('Sağlık', 'Health'), '❤️', 'health', null));
  add(base('h1', T('Koşu', 'Running'), '🏃', 'health', 'h', { recurrence: { type: 'daily', history: range(1, 13, [6, 9]).concat([ds(-6)]), protectedDates: [ds(-6)], leaves: 1, rest: { [ds(-9)]: 'sick' } }, dueTime: '07:30' }));
  add(base('h2', T('Su içmek', 'Drink water'), '💧', 'health', 'h', { recurrence: { type: 'daily', history: range(OPT.fresh ? 1 : 0, 21), leaves: 2 } }));
  add(base('h3', T('Uyku düzeni', 'Sleep routine'), '😴', 'health', 'h'));
  add(base('w', T('İş', 'Work'), '💼', 'work', null));
  add(base('w1', T('Sunum', 'Presentation'), '📊', 'work', 'w', { dueDate: ds(3) }));
  add(base('w2', T('Toplantı notları', 'Meeting notes'), '📝', 'work', 'w'));
  add(base('w3', T('Rapor', 'Report'), '📄', 'work', 'w', { dueDate: ds(1) }));
  add(base('s', T('Öğrenme', 'Learning'), '📚', 'study', null));
  add(base('s1', T('Okuma', 'Reading'), '📖', 'study', 's', { recurrence: { type: 'daily', history: range(OPT.fresh ? 1 : 0, 8), leaves: 1 } }));
  add(base('s2', T('İspanyolca', 'Spanish'), '🗣️', 'study', 's', { recurrence: { type: 'weekly', days: [1, 3, 5], history: [] } }));
  add(base('e', T('Ev', 'Home'), '🏠', 'home', null));
  add(base('e1', T('Kira', 'Rent'), '💵', 'home', 'e', { dueDate: ds(5) }));
  add(base('e2', T('Temizlik', 'Cleaning'), '🧹', 'home', 'e', { recurrence: { type: 'weekly', days: [6], history: [] } }));
  add(base('f', T('Aile', 'Family'), '👨‍👩‍👧', 'family', null));
  add(base('f1', T('Annemi ara', 'Call mom'), '☎️', 'family', 'f', { recurrence: { type: 'weekly', days: [0], history: [] } }));
  const pid = 'deniz';
  const state = { profiles: [{ id: pid, name: 'Deniz', color: '#7A9D74', avatar: 'vy:gardener', avatarChar: '', nodes: n, rootIds: ['h', 'w', 's', 'e', 'f'], notepad: [], notepadTheme: 'sage' }], activeProfileId: pid, appTheme: OPT.theme || 'light', cardDensity: 'full', cardCustom: { status: true, due: true, amount: true, streak: false, consistency: false, progress: false }, dailyDigestEnabled: true, digestHour: 20, digestMinute: 0, weeklyNoteEnabled: false, thoughtCloudEnabled: true, thoughtCloudFolded: false, schemaVersion: 1 };
  const now = new Date().toISOString();
  const e = (id, text, done = false, indent = 0) => ({ id, text, done, indent, doneAt: done ? now : null });
  const items = {};
  const it = (o) => { items[o.id] = { parentId: null, children: [], paper: 'sage', pages: [], lastPage: 0, createdAt: old, updatedAt: now, ...o }; if (o.parentId) items[o.parentId].children.push(o.id); };
  it({ id: 'inbox', type: 'list', title: T('Gelen Kutusu', 'Inbox'), inbox: true, entries: [e('i1', T('Pazartesi raporu at', 'Send the report on Monday')), e('i2', T('Salı dişçi', 'Dentist on Tuesday')), e('i3', T('Balkona saksı', 'Pots for the balcony'))], showDone: true, listPages: [] });
  it({ id: 'fh', type: 'folder', title: T('Ev', 'Home') });
  it({ id: 'l1', type: 'list', title: T('Market', 'Groceries'), parentId: 'fh', entries: [e('m1', T('Süt', 'Milk'), true), e('m2', T('Yumurta', 'Eggs'), true), e('m3', T('Domates', 'Tomatoes')), e('m4', T('Kahve', 'Coffee'))], showDone: true, listPages: [] });
  it({ id: 'r1', type: 'reminders', title: T('Faturalar', 'Bills'), parentId: 'fh', entries: [e('b1', T('Elektrik', 'Electricity')), e('b2', T('İnternet', 'Internet'))], showDone: true, listPages: [] });
  it({ id: 'fs', type: 'folder', title: T('Okul', 'School') });
  it({ id: 'n1', type: 'note', title: T('Tatil fikirleri', 'Holiday ideas'), pages: [T('Kapadokya, balon için erken kalk.\\nMardin, taş evler.\\nKaş, deniz.', 'Cappadocia, get up early for the balloons.\\nMardin, stone houses.\\nKaş, the sea.')], paper: 'bloom' });
  it({ id: 'dj', type: 'dailyJournal', title: T('Günlük', 'Journal'), paper: OPT.jpaper || 'galaxy', days: { [ds(0)]: T('Sabah yürüyüşü. Yağmur vardı ama yine de çıktık. Dönüşte simit.', 'A morning walk. It rained and we went anyway. Warm bread on the way back.'), [ds(-1)]: T('Sunumun yarısı bitti.', 'Half the slides are done.'), [ds(-3)]: T('Hastaydım, bütün gün çay.', 'Sick, tea all day.') } });
  it({ id: 'wd', type: 'weeklyDiary', title: T('Haftalık defter', 'Weekly diary'), paper: 'matcha', days: { [ds(0)]: T('yağmurda yürüdük', 'walked in the rain'), [ds(-1)]: T('annemi aradım', 'called mom'), [ds(-2)]: T('erken yattım', 'early night') } });
  const md = (off) => { const d = new Date(); d.setDate(d.getDate() + off); return pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  it({ id: 'pp', type: 'people', title: T('Çevre', 'People'), people: [
    { id: 'p1', name: T('Annem', 'Mom'), emoji: '🌷', birthday: md(3), notifyAt: null, fields: [], log: [{ id: 'g1', date: ds(-2), text: T('Bahçeye domates ekmiş.', 'Planted tomatoes in the garden.'), time: null, remindAt: null }], createdAt: old, updatedAt: now },
    { id: 'p2', name: 'Can', emoji: '🎸', birthday: null, notifyAt: null, fields: [], log: [{ id: 'g2', date: ds(-5), text: T('Yeni işe başladı.', 'Started a new job.'), time: null, remindAt: null }], createdAt: old, updatedAt: now },
    { id: 'p3', name: 'Ece', emoji: '📚', birthday: null, notifyAt: null, fields: [], log: [], createdAt: old, updatedAt: now }] });
  const notes = { version: 1, items, rootIds: ['inbox', 'fh', 'fs', 'n1', 'dj', 'wd', 'pp'] };
  localStorage.setItem('vyne2', JSON.stringify(state));
  localStorage.setItem('vyne2_onboarded', '1');
  localStorage.setItem('vyne2_notes_' + pid, JSON.stringify(notes));
  localStorage.setItem('seeded', '1');
})();`;
};
