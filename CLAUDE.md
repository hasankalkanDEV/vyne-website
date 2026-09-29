# Vyne sitesi — proje hafızası

Bu dosya bu klasörde çalışan her oturumun başında otomatik yükleniyor. Amacı:
yeni bir sohbet, aşağıdakileri baştan keşfetmek zorunda kalmasın.

Uygulamanın kendisi ayrı bir depo ve ayrı bir hafıza dosyası: `../vyne/CLAUDE.md`.
Orası ürünün durumunu (build, mağaza, sürüm) tutar; burası SADECE pazarlama
sitesini. İkisi çelişirse **mağaza/sürüm konusunda `vyne/CLAUDE.md` haklıdır.**

## Ne olduğu ve nerede yayınlandığı

Statik tanıtım sitesi, iki dilli, iki dosya:

| Dosya | Ne |
|---|---|
| `index.html` | Türkçe site (HTML + CSS + JS hepsi içinde) |
| `en/index.html` | İngilizce site, aynı yapı. Varlık yolları `../` ile başlar |
| `404.html` | "Bu dal henüz büyümedi"; GitHub Pages bilinmeyen adreste kendisi gösterir |
| `shots/app-*.webp` | 1.4.0 ekranları (home, stats, notes, wheel, branch) |
| `shot-*.{tr,en}.jpg` | 1.3.0 kareleri, "Neler var"daki küçük görsellerde hâlâ kullanılıyor |
| `app-icon.png` | Yeni uygulama ikonu (`../vyne/assets/icon-512.png` kopyası) |
| `fonts/` | Nunito, Caveat, VT323. **Dış CDN yok**, fontlar dahil her şey yerel |

Depo: `hasankalkanDEV/vyne-website`. **GitHub Pages `main` dalından yayınlıyor.**
Yani `main`'e push = canlıya çıkma, ~15-30 saniye sonra.
Canlı: https://hasankalkandev.github.io/vyne-website/ (TR) ve `/en/` (EN).

Önizleme sunucusu `.claude/launch.json`'da tanımlı, adı `vyne-website`, port 4321.
**Bash ile sunucu başlatma** — `preview_start` aracını kullan.

## 🌿 Site nasıl çalışıyor (2026-09-29'dan beri, "sarmaşık site")

Site uygulama gibi kurulu: ortada **"sen"**, ondan **sağa** doğru 10 dal
(uygulama da sağa dallanıyor; iki yana dallandırmak yanıltıcı bulundu).
Her dal bir "oda", `#adres` ile açılır:

`mektup` · `dene` · `kuyu` (seri kuyusu) · `gun` (bir günümüz) · `defter` ·
`neler` (neler var) · `oyun` · `neden` (neden defteri) · `yeni` (neler değişti) ·
`soz` (sözlerimiz). Gizli: `vyneos` (logoya basılı tut). Olmayan adres → `yok`.

**Akış (Hasan'ın isteği):** ilk ziyarette dallara tıklanmaz. "sen"in yanındaki
tomurcuk **sağa sürüklenince** dallar sırayla açılır; her odanın sonunda
sıradakinin tomurcuğu var. Üstte kök çubuğu. 10. daldan sonra harita açılır ve
site serbest gezilir. İlerleme `localStorage`'da (`vyne-site-grown`,
`vyne-site-map`). Paylaşılan bir dal bağlantısı o dala kadar açar. Klavyede
→ / Enter da büyütür (erişilebilirlik; fareyle tek tık sadece kıpırdatır).

Sitenin her yerinde: TR/EN düğmesi (aynı dalda kalır, tercih `vyne-site-lang`),
öteki dil için öneri şeridi (yönlendirme YOK, Google iki sayfayı da görsün),
4 tema + 5 kâğıt, gece 22:00 sonrası Galaxy, almanak kartı (gerçek ay evresi),
mevsim rengi, isteğe bağlı dokunuş sesi, 3+ gün sonra "Tekrar hoş geldin",
indirme düğmesinde basılı tut → yaprak dolar, Konami kodu → yaprak yağmuru.

**Kurallar uygulamanın kodundan:** yaprak `LEAF_EVERY = 7` günde bir, en fazla
`LEAF_CAP = 2`, sadece bir önceki kaçan günü kurtarır. Dinlenme günleri 🌙🤒✈️
sınırsız, seri bekler, yaprak harcanmaz. Sitede bu iki sayı JS'in başında tek
yerde (`var LEAF_EVERY = 7, LEAF_CAP = 2`); uygulamada değişirse orada değiştir.

**Metinler mağazayla aynı ses:** TR başlık = App Store TR alt başlığı ("Bir
günü kaçırmak dert değil."), EN başlık = EN alt başlığı ("Habits that forgive
a bad day."). Mektup ve "Neler değişti" 1.4.0 mağaza metninden
(`../vyne/docs/store-copy-1.4.0.html`). Mağaza metni değişirse burayı da değiştir.

## ⚠️ İki dil = iki dosya, ELLE eşit tut

Sözlük yok. Bir metni, bir odayı ya da bir JS davranışını değiştirirsen
**`index.html` ve `en/index.html`'in ikisinde de** değiştir. EN metinler
uygulamanın `en.json`'undan ve mağaza metninden alındı, uydurma değil.
Türkçe ek: mağaza "Vyne'ı / Vyne'da" diyor ve site de öyle (okunuşu "vayn").

## 🔴 GÜNCEL DURUM — 2026-09-29

- iOS yayında (App Store `https://apps.apple.com/app/id6790837181`, bölgesiz adres
  bilerek). **1.4.0 build bekliyor.** Android Play production'a 1.4.0 ile çıkacak.
- Site 1.4.0'ın özelliklerini "Neler var"da `yeni` etiketiyle anlatıyor ve
  "Neler değişti"de 1.4.0'ı "yolda" diye gösteriyor.

### ⏭️ ANDROID ÇIKINCA

1. Alt dokta "Android yakında" notu ve SSS'deki "Android ... bir sonraki sürümle"
   cümlesi (iki dilde) → Play Store düğmesi ve "Google Play'de" cümlesi.
2. "Neler değişti"de 1.4.0'ın "yolda" etiketi kalkar.

## Ekran görüntüleri

- **`shots/app-*.webp` (1.4.0):** Hasan'ın telefonundan gelen İngilizce kareler.
  Üstten 95 px durum çubuğu kırpıldı (924 px genişlikte; 1284 px'te 141 px'e
  denk), 640 px genişliğe küçültüldü, webp. **Ana ekrandaki bütçe tutarı bir
  yama ile kapatıldı** (gerçek profil). Türkçe sayfada da şimdilik bu İngilizce
  kareler var. **Açık iş:** örnek bir profille TR ve EN kareler çekilince
  `shots/` iki dile ayrılmalı.
- **`shot-*.{tr,en}.jpg` (1.3.0):** `scripts/make-shots.mjs` üretir
  (`npm install --no-save sharp && node scripts/make-shots.mjs`). Ham kareler
  depo dışında: `../appscrenshots/selected ios <dil> <sürüm>/`, `LANGS` sabiti
  her sürümde ELLE güncellenir. Durum çubuğu kırpma SADECE SİTE İÇİN; mağaza
  yüklemelerinde kırpma (Apple kesin ölçü ister).
- `scripts/make-images.mjs`: `og-image.png` + favicon'lar. og-image hâlâ eski
  tasarım ve eski ikon; yeni ikonla yenilenebilir.

## 🧓 Emekli: `scripts/build-scene.mjs`

Eski sitenin kaydırmalı harita sahnesini `index.html`'deki `<!--SCENE-->`,
`/*SCENE-CSS*/`, `/*SCENE-JS*/` işaretçilerine yazıyordu. **Yeni sitede bu
işaretçiler yok. ÇALIŞTIRMA**, eski yapıyı varsayıyor. Eski site git geçmişinde
(`8e9df97` ve öncesi).

## 🚫 GÖSTERİLMEYECEK

- **Kilometre taşı kutlamaları (7 / 30 / 66 / 100):** ekran görüntüsü asla.
  Metinle anmak serbest ("burada küçük bir sürpriz var").
- **Eşi:** sitede eşinden hiç bahsedilmez (Hasan, 2026-09-28). Ses "tek başıma
  yaptım, ailem ve arkadaşlarım için".
- **Henüz olmayan özellik vaat edilmez:** ortak alan (eşle paylaşım), imza
  işaretleme, dal başına emoji/çizim 1.4.0'dan sonra.
- Sahte kullanıcı yorumu yok. Ziyaretçi defterindeki iki yaprak "örnek"
  etiketli; ziyaretçinin yaprağı sadece kendi tarayıcısında kalır (sunucu yok).

## 📌 Açık işler

- 1.4.0 ekranlarını örnek profille TR + EN çek, `shots/`'u iki dile ayır.
- "Bir günümüz"ün öğle durağı (düşünce bulutu) hâlâ çizim; gerçek kare yok.
- og-image'ı yeni ikonla yenile.
- Ziyaretçi defteri herkese açık olsun istenirse küçük bir sunucu + moderasyon gerekir.
- `mailto:` yerine gerçek form: bilerek ertelendi.

## ⚠️ Tuzaklar — hepsi burada gerçekten yaşandı

- **`<style>` ya da `<script>` içine HTML yorumu (`<!-- -->`) KOYMA.** CSS
  bunları CDO/CDC belirteci sayar ve sonraki kuralı yutar.
- **Satır sonları CRLF.** `index.html` ve `en/index.html` baştan sona CRLF.
  Diff şişerse: `git diff --ignore-all-space`.
- **`overflow-x:hidden` KULLANMA** (body'de) — scroll olaylarını öldürür. `clip` kullan.
- **`[hidden]` + sınıf `display`.** `.growstage{display:grid}` gibi bir kural
  `hidden` özniteliğini ezer; her gizlenen sınıfa `X[hidden]{display:none}` yaz.
- `Grep` çıktısı CSS yorum açıcısını `/*` yerine `\*` gösteriyor — görüntüleme
  tuhaflığı, dosyada hata yok.

## ✅ Doğrulama

Değişiklikten sonra: iki sayfa da açılıyor mu, konsolda hata var mı, telefon
genişliğinde (390 px) yatay kaydırma var mı, tomurcuk sürüklenince dal açılıyor
mu, TR/EN düğmesi aynı dalda kalıyor mu. Geçişli bir şey ölçeceksen önce
`el.style.transition='none'` (tarayıcı paneli görünmezken geçişler ilerlemiyor).

**Kontrast WCAG AA kabul kriteri.** Renkler `../vyne/src/tokens.js` ile aynı.

## Çalışma talimatı

- **Hasan geliştirici değil.** Komutları sen çalıştır, sade anlat.
- **Türkçe cevap ver**, kod/tanımlayıcılar İngilizce.
- **Hasan demeden hiçbir depoyu değiştirme** (Hasan'ın 1. kuralı). Fikirler önce
  ayrı önizleme olarak gösterilir.
- **`main` üzerindeysen önce dal aç**, sonra commit. `main`'e geçen her şey canlıdır.
- Bu dosyayı **iş bittikçe güncelle**. Buraya sadece HÂLÂ GEÇERLİ olan yazılır.
