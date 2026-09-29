# Vyne sitesi — proje hafızası

Bu dosya bu klasörde çalışan her oturumun başında otomatik yükleniyor. Amacı:
yeni bir sohbet, aşağıdakileri baştan keşfetmek zorunda kalmasın.

Uygulamanın kendisi ayrı bir depo ve ayrı bir hafıza dosyası: `../vyne/CLAUDE.md`.
Orası ürünün durumunu (build, mağaza, sürüm) tutar; burası SADECE pazarlama
sitesini. İkisi çelişirse **mağaza/sürüm konusunda `vyne/CLAUDE.md` haklıdır.**

## Ne olduğu ve nerede yayınlandığı

Statik tanıtım sitesi, iki dilli. **İki sayfa tek kaynaktan üretiliyor:**

| Dosya | Ne |
|---|---|
| `site/head.html`, `site/style.css`, `site/body.html`, `site/app.js` | **KAYNAK.** Metinler `⟪Türkçe¦English⟫` biçiminde |
| `site/live.json` | Mağaza durumu bayrakları + yaprak kuralı (aşağıda) |
| `site/glyphs.json` | Uygulamanın çizimleri (`scripts/export-glyphs.mjs` üretir) |
| `scripts/build-site.mjs` | Kaynaktan `index.html` (TR) ve `en/index.html` (EN) üretir |
| `index.html`, `en/index.html` | **ÜRETİLMİŞ. Elle düzenleme**, `site/`'ı düzenle ve derle |
| `404.html` | "Bu dal henüz büyümedi"; elle yazılmış, tek başına |
| `shots/app-*.webp` | 1.4.0 ekranları, 924 px (`scripts/make-app-shots.mjs`) |
| `app-icon.png` | Uygulama ikonu (`../vyne/assets/icon-512.png` kopyası) |
| `fonts/` | Nunito, Caveat, VT323. **Dış CDN yok**, her şey yerel |

Değişiklikten sonra: `node scripts/build-site.mjs`. Betik çözülmemiş bir işaret
kalırsa durur. Kaynaktaki diğer işaretler betiğin başında anlatılıyor
(`{{P}}` varlık yolu, `[[g:leaf]]` uygulamanın çizimi, `{{#android}}…{{/android}}`).

Depo: `hasankalkanDEV/vyne-website`. **GitHub Pages `main` dalından yayınlıyor.**
Yani `main`'e push = canlıya çıkma, ~1 dakika sonra.
Canlı: https://hasankalkandev.github.io/vyne-website/ (TR) ve `/en/` (EN).

Önizleme: `cd /home/user && python3 -m http.server 8766` → `localhost:8766/vyne-website/`.

## 🌿 Site nasıl (2026-09-29 akşamından beri, "tek sayfa")

Hasan'ın telefon incelemesi (`../vyne/docs/WEBSITE-REVIEW-2026-09-29.md`) üzerine
sürükleyerek açılan "sarmaşık site" bırakıldı. **Artık her şey baştan açık, aşağı
kaydırarak okunuyor.** Sürükleme sadece süs: girişteki "tomurcuğu sağa çek" şeridi.

Sıra ve adresler (TR ve EN'de aynı, dil düğmesi aynı yerde kalır):
`#giris` · `#nasil` (düz liste↔sarmaşık, kendi sarmaşığın, `#yaprak` deneme +
yüz güne iniş, `#gun` sıradan bir gün) · `#ozellikler` (24 kart, `#sablon`,
`#kagitlar` beş kâğıt) · `#hikaye` (mektup masası, `#neden`) · `#oyuncaklar` ·
`#yenilikler` · `#sozler` · `#sorular` · `#indir`.
Üst menü: Nasıl çalışır · Özellikler · Sorular + İndir. Eski dal adresleri
(`#kuyu`, `#mektup`…) JS'te yeni bölümlere yönlenir; paylaşılmış linkler kırılmaz.

- **Her özellik kartında bir görsel var:** ya gerçek kare ya uygulamanın kendi
  çizimleriyle (glyph) küçük bir sahne. Emoji yok; ikonlar uygulamanın çizimleri.
- **İndir:** iki mağaza rozeti yan yana; Android cihazda Play önce. Telefonda
  alttaki çubuk ve üstteki "İndir" doğrudan mağazaya gider (tek dokunuş).
  Android'de Play henüz yokken alt çubuk hiç çıkmaz.
- Gece 22:00 sonrası kâğıt kendiliğinden DEĞİŞMEZ, bir şeritle sorulur.
- Logoya basılı tut → VyneOS (üstte açılan pencere, `#vyneos` de açar).
- Tema/kâğıt seçimi `vyne-site-look`, dil `vyne-site-lang`, son ziyaret
  `vyne-site-last` (3+ gün sonra "Tekrar hoş geldin"). Ziyaretçi defteri kaldırıldı
  (yaprak Hasan'a ulaşmıyordu); yerine `mailto:` bağlantısı.

## 🔴 GÜNCEL DURUM — 2026-09-29 — ve `site/live.json`

- 1.4.0 gönderildi: iOS App Review'da (onayda kendiliğinden yayın), Android
  versionCode 11 Play production incelemesinde (ilk Play sürümü, managed
  publishing açık: onaydan sonra Hasan yayınla der).
- `live.json` şu an `"android": false, "v140": false`:
  Play rozeti "çok yakında" (bağlantısız), SSS "Google Play incelemesinde",
  Yenilikler'de 1.4.0 "Eylül 2026 · incelemede", özellikler "1.4.0 ile geliyor".

### ⏭️ MAĞAZA DEĞİŞİNCE (Hasan haber verince)

1. iOS 1.4.0 yayında → `"v140": true`. 2. Play'de yayında → `"android": true`
   (rozet, SSS, alt çubuk kendiliğinden bağlantılı olur).
3. `node scripts/build-site.mjs`, kontrol, commit, `main`.

**Yaprak kuralı** uygulamanın kodundan: `leafEvery: 7`, `leafCap: 2` (live.json);
yaprak sadece bir önceki kaçan günü kurtarır. Dinlenme günleri (Dinlenme / Hasta /
Yolculuk) sınırsız, seri bekler, yaprak harcanmaz. Uygulamada değişirse live.json'da değiştir.

**Metinler mağazayla aynı ses:** TR başlık = App Store TR alt başlığı ("Bir
günü kaçırmak dert değil."), EN başlık = EN alt başlığı ("Habits that forgive
a bad day."). Mektup mağaza açıklamasından; Hasan'a göre mağazada artık
"rahatsız edici reklamlarla doluydu / full of annoying ads" (depodaki
`../vyne/docs/store-copy-1.4.0.html` hâlâ "azarlıyordu" diyor, oradaki eski).
EN metinler uygulamanın `en.json`'undan ve mağaza metninden, uydurma değil.
Türkçe ek: "Vyne'ı / Vyne'da" (okunuşu "vayn").

## Ekran görüntüleri

- **`shots/app-*.webp` (1.4.0):** Hasan'ın telefonundan İngilizce kareler.
  Durum çubuğu kırpıldı, 924 px, **ana ekrandaki bütçe tutarı yama ile kapatıldı**
  (gerçek profil). Yeniden üretmek: `npm install --no-save sharp && node
  scripts/make-app-shots.mjs <klasör>` (home/stats/notes/wheel/branch).
- **Türkçe sayfada da İngilizce kareler var; alt yazıda "arayüz şimdilik
  İngilizce" diyor.** Açık iş: Hasan'ın `screenshots/1.4.0-*` (TR, örnek profil)
  kareleri gelince `shots/` iki dile ayrılmalı (`shots/tr/`, `shots/en/`, kaynakta
  `{{P}}shots/⟪tr¦en⟫/…`) ve alt yazıdaki not kalkmalı.
- "Sıradan bir gün"de 12:40 (düşünce bulutu) ve 22:30 (günlük) gerçek kare
  değil, uygulamanın çizimleriyle yapılmış sade ekran; altında "Çizim" yazıyor.
  Gerçek kareleri gelince `app.js` → `STOPS` içinde `scr:` yerine `shot:`.
- 1.3.0 kareleri (`shot-*.jpg`) ve onları üreten `make-shots.mjs` silindi (git geçmişinde).
- `scripts/make-images.mjs`: `og-image.png` + favicon'lar. og-image hâlâ eski ikon.

## 🧓 Emekli: `scripts/build-scene.mjs`

Eski sitenin kaydırmalı harita sahnesini yazıyordu. **ÇALIŞTIRMA.** Eski
sürükleyerek açılan site `5fafe7f`'te, ondan önceki site `8e9df97`'de.

## 🚫 GÖSTERİLMEYECEK

- **Kilometre taşı kutlamaları (7 / 30 / 66 / 100):** ekran görüntüsü asla.
  Metinle anmak serbest ("burada küçük bir sürpriz var").
- **Eşi:** sitede eşinden hiç bahsedilmez (Hasan, 2026-09-28). Ses "tek başıma
  yaptım, ailem ve arkadaşlarım için".
- **Henüz olmayan özellik vaat edilmez:** ortak alan (eşle paylaşım), imza
  işaretleme, dal başına emoji/çizim 1.4.0'dan sonra.
- Sahte kullanıcı yorumu yok.

## 📌 Açık işler

- TR + EN 1.4.0 karelerini (örnek profil) al, `shots/`'u iki dile ayır.
- Düşünce bulutu ve günlük için gerçek kareler.
- og-image'ı yeni ikonla yenile.
- Hasan istersen sahneleri kendisi çizebileceğini söyledi; şimdilik uygulamanın çizimleri kullanılıyor.

## ⚠️ Tuzaklar — hepsi burada gerçekten yaşandı

- **`<style>` ya da `<script>` içine HTML yorumu (`<!-- -->`) KOYMA.** CSS
  bunları CDO/CDC belirteci sayar ve sonraki kuralı yutar.
- **Satır sonları CRLF.** Derleme betiği `index.html` / `en/index.html`'i CRLF
  yazar. Diff şişerse: `git diff --ignore-all-space`.
- **`overflow-x:hidden` KULLANMA** (body'de) — scroll olaylarını öldürür. `clip` kullan.
- **`[hidden]`:** stil dosyasında `[hidden]{display:none!important}` var; silme.
- **JS dizesi içinde EN metni:** `⟪…¦It\'s⟫` — kesme işaretini kaçır.
- `transform` + `rotate` özelliği birlikte: `rotate:` önce uygulanır, tomurcuğu
  `translate` ile taşı (yoksa çapraz gider).
- Görsellerde `width`/`height` özniteliği varsa CSS'te `height:auto` şart (yoksa ezilir).
- `Grep` çıktısı CSS yorum açıcısını `/*` yerine `\*` gösteriyor — görüntüleme
  tuhaflığı, dosyada hata yok.

## ✅ Doğrulama

Değişiklikten sonra: derle; iki sayfa da açılıyor mu, konsolda hata var mı;
320 / 390 / 768 / 1280 px'te yatay kaydırma var mı; 13 px altında yazı var mı;
iPhone ve Android tarayıcı kimliğiyle rozet sırası ve alt çubuk doğru mu; TR/EN
düğmesi aynı bölümde kalıyor mu. Playwright: `NODE_PATH=$(npm root -g) node scripts/check-site.js` (sunucu açıkken).

**Kontrast WCAG AA kabul kriteri.** Renkler `../vyne/src/tokens.js` ile aynı.

## Çalışma talimatı

- **Hasan geliştirici değil.** Komutları sen çalıştır, sade anlat.
- **Türkçe cevap ver**, kod/tanımlayıcılar İngilizce.
- **Hasan demeden hiçbir depoyu değiştirme** (Hasan'ın 1. kuralı). Fikirler önce
  ayrı önizleme olarak gösterilir.
- **`main` üzerindeysen önce dal aç**, sonra commit. `main`'e geçen her şey canlıdır.
- Bu dosyayı **iş bittikçe güncelle**. Buraya sadece HÂLÂ GEÇERLİ olan yazılır.
