# Vyne sitesi — proje hafızası

Bu dosya bu klasörde çalışan her oturumun başında otomatik yükleniyor. Amacı:
yeni bir sohbet, aşağıdakileri baştan keşfetmek zorunda kalmasın.

Uygulamanın kendisi ayrı bir depo ve ayrı bir hafıza dosyası: `../vyne/CLAUDE.md`.
Orası ürünün durumunu (build, mağaza, sürüm) tutar; burası SADECE pazarlama
sitesini. İkisi çelişirse **mağaza/sürüm konusunda `vyne/CLAUDE.md` haklıdır.**

## Ne olduğu ve nerede yayınlandığı

Statik tanıtım sitesi, iki dilli. **Ana site İngilizce (kök adres), Türkçe `/tr/`**
(Hasan, 2026-09-29). İki sayfa tek kaynaktan üretiliyor:

| Dosya | Ne |
|---|---|
| `site/head.html`, `site/style.css`, `site/body.html`, `site/app.js` | **KAYNAK.** Metinler `⟪Türkçe¦English⟫` biçiminde |
| `site/live.json` | Mağaza durumu bayrakları + yaprak kuralı (aşağıda) |
| `site/glyphs.json` | Uygulamanın çizimleri (`scripts/export-glyphs.mjs` üretir) |
| `site/templates.json` | Uygulamanın 9 şablonu, bütün dallarıyla (`scripts/export-templates.mjs` üretir) |
| `scripts/build-site.mjs` | Kaynaktan `index.html` (EN), `tr/index.html` (TR) ve `en/index.html` (eski adres → köke yönlendirme) üretir |
| `index.html`, `tr/index.html`, `en/index.html` | **ÜRETİLMİŞ. Elle düzenleme**, `site/`'ı düzenle ve derle |
| `404.html` | "Bu dal henüz büyümedi"; elle yazılmış, tek başına |
| `site/mocks.html` | **Uygulama ekranlarının çizimleri** (ekran görüntüsü değil): her özelliğin sadece anahtar kısmı, 300 px'te tasarlanmış HTML/CSS, iki dilli. `app.js` kutusuna sığdırır |
| `og-image.png`, `og-image-tr.png` | Paylaşım görselleri; sayfadaki çizilmiş telefondan (`scripts/app-shots/og.js`, sunucu açıkken) |
| `site/qr-ios.svg`, `site/qr-play.svg` | İndir bölümündeki QR'lar (bilgisayarda görünür) |
| `app-icon.png` | Uygulama ikonu (`../vyne/assets/icon-512.png` kopyası) |
| `fonts/` | Nunito, Caveat, VT323. **Dış CDN yok**, her şey yerel |

Değişiklikten sonra: `node scripts/build-site.mjs`. Betik çözülmemiş bir işaret
kalırsa durur. Kaynaktaki diğer işaretler betiğin başında anlatılıyor
(`{{P}}` varlık yolu, `[[g:leaf]]` uygulamanın çizimi, `{{#android}}…{{/android}}`).

Depo: `hasankalkanDEV/vyne-website`. **GitHub Pages `main` dalından yayınlıyor.**
Yani `main`'e push = canlıya çıkma, ~1 dakika sonra.
Canlı: https://hasankalkandev.github.io/vyne-website/ (EN) ve `/tr/` (TR). Eski `/en/` köke yönlenir.
Kökteki İngilizce sayfa Türkçe tarayıcıya "Bu sayfayı Türkçe oku →" şeridi gösterir; kendiliğinden yönlendirme YOK.

Önizleme: `cd /home/user && python3 -m http.server 8766` → `localhost:8766/vyne-website/`.

## 🌿 Site nasıl (2026-09-29 akşamından beri, "tek sayfa")

Hasan'ın telefon incelemesi (`../vyne/docs/WEBSITE-REVIEW-2026-09-29.md`) üzerine
sürükleyerek açılan "sarmaşık site" bırakıldı. **Artık her şey baştan açık, aşağı
kaydırarak okunuyor.** Sürükleme sadece süs: girişteki "tomurcuğu sağa çek" şeridi.

Sıra ve adresler (TR ve EN'de aynı, dil düğmesi aynı yerde kalır):
`#giris` · `#nasil` (düz liste↔sarmaşık, kendi sarmaşığın, `#yaprak` deneme +
yüz güne iniş, `#gun` örnek bir gün) · `#ozellikler` (24 kart, `#sablon`,
`#kagitlar` beş kâğıt) · `#hikaye` (mektup masası, `#neden`) · `#oyuncaklar` ·
`#yenilikler` · `#sozler` · `#sorular` · `#indir`. (`#oyuncaklar` = çark bölümü.)
Özellik kartları ve "Neden böyle?" her yerde yana kayan sıra: telefonda 1, tablette 2, bilgisayarda 3 kart; sayaç ve ‹ › okları.
"Örnek bir gün" telefonda tek ekran (saat+başlık, çizim, dert, açıklama); yana kaydırınca durak değişir.
Telefonda: dört kısa madde tek sütun; şablon ağacında alt dallar katlı ("+3"); Yenilikler ilk 5 madde + "Tümünü gör". Bilgisayarda: yüz güne iniş iki sütun (ipin iki yanı), düz liste 780 px ortada.
**🌿 Uygulama görünümü (yayında, 2026-09-30):** üstte ağaç düğmesi ("Uygulama gibi") + girişte "Siteyi
uygulamaya çevir": ortada sen, sağda 8 dal kartı (`#sarmasik`); dala dokununca sadece o bölüm açılır, üstte
`sen › Özellikler` yolu ve alt dal düğmeleri. İçerik aynı bölümler (kopya yok), seçim `vyne-site-view`'da.
Kaynakta `{{#appview}}` bayrağı (build-site.mjs'te açık). Yeni bölüm eklenirse body.html'de `.ah-bc` kartı da ekle.
Kâğıt sayfalarındaki düğme siteyi o kâğıda geçirir. Dil önerisi ve gece sorusu altta kapatılabilir şerit.
Kaldırılanlar (2026-09-30, puanı düşüktü): tomurcuk süsü, şablon testi, yıl yaprakları, almanak.
Şablon denemesi uygulamanın gerçek verisini gösterir (alt dallar, alışkanlık sıklığı, tarihler);
uygulamada şablon değişirse `node scripts/export-templates.mjs` sonra derle. Çark 2–6 iş alır,
uygulamanın çizimleriyle dilimler, seçince 2 dakikalık sayaç.
Üst menü: Nasıl çalışır · Özellikler · Sorular + İndir. Eski dal adresleri
(`#kuyu`, `#mektup`…) JS'te yeni bölümlere yönlenir; paylaşılmış linkler kırılmaz.

- **Her özellik kartında bir görsel var:** uygulama ekranının çizilmiş anahtar kısmı ya da
  uygulamanın çizimleriyle (glyph) küçük bir sahne. Emoji yok; ekran görüntüsü yok.
- **İndir:** iki mağaza rozeti yan yana; Android cihazda Play önce. Telefonda
  alttaki çubuk ve üstteki "İndir" doğrudan mağazaya gider (tek dokunuş).
  Android'de Play henüz yokken alt çubuk hiç çıkmaz.
- Gece 22:00 sonrası kâğıt kendiliğinden DEĞİŞMEZ, bir şeritle sorulur.
- Logoya basılı tut → VyneOS (üstte açılan pencere, `#vyneos` de açar).
- Tema/kâğıt seçimi `vyne-site-look`, dil `vyne-site-lang`, son ziyaret
  `vyne-site-last` (3+ gün sonra "Tekrar hoş geldin"). Ziyaretçi defteri kaldırıldı
  (yaprak Hasan'a ulaşmıyordu); yerine `mailto:` bağlantısı.

## 🔴 GÜNCEL DURUM — 2026-09-30 — ve `site/live.json`

- **Android Google Play'de yayında** (Hasan, 2026-09-30): `"android": true`. Rozet, QR, alt çubuk
  ve SSS Play'e bağlı; Android cihazda Play önce, alt çubuk doğrudan Play'e gider.
- iOS 1.4.0 hâlâ `"v140": false` (Hasan "yayında" demedi). Bu durumda metinler:
  "Android'de yayında, iPhone sürümü App Store incelemesinde".

### ⏭️ MAĞAZA DEĞİŞİNCE (Hasan haber verince)

1. iOS 1.4.0 yayında → `"v140": true` (1.4.0 "incelemede" yazıları kendiliğinden kalkar).
2. `node scripts/build-site.mjs`, kontrol, commit, `main`.

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

### ✍️ Ses ve gerçekler (Hasan'ın cevapları, 2026-09-30)

- **Ses tekil birinci şahıs: "ben / I".** "Biz / we" hiçbir yerde yok (tek kişi).
- **Bildirimler:** "günde en fazla bir" YANLIŞ, yazma. Doğrusu: günlük hatırlatma
  kişinin SEÇTİĞİ saatte (akşam değil), alışkanlığa özel saat, hatırlatıcılar,
  doğum günleri. Suçluluk kelimesi yok, istemeyen kapatır.
- **Bulut yedeği:** uçtan uca şifreli değil; "okumak kolay değil ama zorlarsam okuyabilirim,
  okumuyorum". Şifreleme planından bahsetme.
- **Ücret:** söz verme ("değişirse söyleriz" yok). Amaç: ücretsiz, sade, Hasan'ın da
  ömür boyu kullanacağı uygulama; ancak bulut masrafı zorlarsa düşünülür.
- **Gerçek hikâye:** hayatının farklı dalları vardı, bazılarını unuttukça geride kalmış
  hissediyordu, her şeyi büyük resimde görmek istedi → dallanan yapı. Çark: yapacak çok
  şey varken hiçbir şey yapası gelmediği günler için. 2 dakika kuralı okuduğu bir kitaptan
  (kitap adı bilinmiyor, yazma). Notlar/günlük "not ve liste yazmayı sevenler için" (eşi
  için yaptı ama eşi ANILMAZ). Her gün kullanıyor, en çok alışkanlıkları.
- Şablonla açılmaması: "hazır şablon gerçek gelmedi, herkesin hayatı farklı".
- Kendini tanıtma yok: soyad, şehir, memleket YAZILMAZ. Mail'e süre sözü yok, "mutlaka dönüyorum".
- **Örnek isimler: Hasan ve Hannah** (çizimlerde profil Hasan). Başka isim gerekirse Hasan'a sor.
- "Sıradan bir gün" = **örnek bir gün**, "sen" diliyle; Hasan'ın kendi anısı değil.
- **EN metin Amerikan yazımı** (traveling, color, gray, behavior, vacation).

## Görseller: ekran görüntüsü YOK, çizim var (Hasan, 2026-09-30)

- Hasan: "birebir ss kullanmak yerine kendin görsel oluştur, sadece anahtar kısmı göster."
  Sitedeki bütün uygulama görselleri `site/mocks.html`'deki çizimler: homefull (giriş
  telefonu), home, vine, branch, stats, notes, wheel, pick, cloud, journal, people,
  templates, search, welcome. Uygulamanın renkleri (`CAT`), çizimleri (glyph) ve metinleri.
- Kullanım: `<div class="mock" data-mock="branch"></div>`; JS'te `mountMock(el, 'branch')`.
  Her çizim 300 px genişlikte; kutuya göre ölçeklenir. Kartlarda `.mk-top` (uygulama çubuğu)
  ve bazı ayrıntılar gizli (style.css sonu), sahne yüksekliği 270 px.
- Uygulamanın ekranı değişirse çizimi de güncelle. Gerçek ekranlara bakmak için
  `scripts/app-shots/` hâlâ çalışıyor (uygulamayı web'de örnek profille açıp çeker);
  çıkan kareler REFERANS içindir, siteye konmaz.

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
- Sahte kullanıcı yorumu yok. Eşinin beğenisi de paylaşılmaz (eşi anılmaz).

## 📌 Açık işler

- Hasan istersen sahneleri kendisi çizebileceğini söyledi; şimdilik uygulamanın çizimleri kullanılıyor.
- Gerçek kullanıcı yorumu gelirse (izinle) bir "ne dediler" bölümü. Uydurma yorum YOK.

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
- Grid içinde uzun içerik (input, çark) telefonda taşarsa: `grid-template-columns:minmax(0,1fr)`,
  flex içindeki input'a `width:0`.
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
