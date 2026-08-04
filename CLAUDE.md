# Vyne sitesi — proje hafızası

Bu dosya bu klasörde çalışan her oturumun başında otomatik yükleniyor. Amacı:
yeni bir sohbet, aşağıdakileri baştan keşfetmek zorunda kalmasın.

Uygulamanın kendisi ayrı bir depo ve ayrı bir hafıza dosyası: `../vyne/CLAUDE.md`.
Orası ürünün durumunu (build, mağaza, sürüm) tutar; burası SADECE pazarlama
sitesini. İkisi çelişirse **mağaza/sürüm konusunda `vyne/CLAUDE.md` haklıdır.**

## Ne olduğu ve nerede yayınlandığı

Tek dosyalık statik tanıtım sitesi: `index.html` (HTML + CSS + JS hepsi içinde,
dış CDN yok, fontlar bile yerel). Depo: `hasankalkanDEV/vyne-website`.

**GitHub Pages `main` dalından yayınlıyor.** Yani `main`'e push = canlıya çıkma.
Deneyimlenen süre: push'tan ~15-30 saniye sonra yayında.
Canlı adres: https://hasankalkandev.github.io/vyne-website/

Önizleme sunucusu `.claude/launch.json`'da tanımlı, adı `vyne-website`, port 4321.
**Bash ile sunucu başlatma** — `preview_start` aracını kullan.

## 🔴 GÜNCEL DURUM — 2026-08-03

**iOS YAYINDA, Android değil.** Site 2026-08-03'te buna göre güncellendi
(commit `2ccc9da`). Öncesinde her yerde "kapalı testte" yazıyordu ve indirme
yerine e-posta istiyordu; uygulama 24 Temmuz'da App Store'a çıktığı için bunun
tamamı yanlış olmuştu.

- App Store: `https://apps.apple.com/app/id6790837181` (bundle
  `com.hasankalkan.vyne`, `../vyne/app.json` ile doğrulandı)
- Play Store: 2026-08-03 itibarıyla **404** — Android gerçekten yayında değil.
- Mağaza adresi bilerek **bölgesiz** (`/tr/` yok): Apple ziyaretçiyi 301 ile
  kendi ülkesinin mağazasına yönlendiriyor.

### ⏭️ ANDROID ÇIKINCA TAM OLARAK ŞUNLAR DEĞİŞECEK

Bu, sitedeki tek bilinen zamanlanmış iş. Üç yer:

1. **Hero + kapanış bandındaki `.alt-link` bağlantıları SİLİNİR.** Şu an
   Android bekleme listesi bilerek ikinci bir `.btn` değil, sessiz bir metin
   bağlantısı — iki eşit düğme yan yana ikisi de hazırmış gibi okunuyor ve
   ziyaretçi Android'e tıklayıp e-posta formuyla karşılaşınca aldatılmış
   hissediyor. Android çıkınca CTA iki gerçek mağaza düğmesine bölünür.
2. **SSS `q1` ve `q6`** (TR gövdede, EN sözlükte) — "Android sürümü hâlâ
   testte" cümleleri kalkar.
3. **Hero rozeti** `kicker` — "App Store'da yayında" yerine iki platform.

## Ekran görüntüsü hattı — `scripts/make-shots.mjs`

Sitedeki 5 kare (`home`, `wheel`, `stats`, `themes`, `templates`) bu scriptle
üretiliyor. Ham kareler **depo dışında**: `../appscrenshots/selected ios <dil>/`.
Depoyu tek başına klonlarsan script çalışmaz; üretilmiş JPEG'ler depoda olduğu
için siteyi kurmak yine de sorun değil.

```bash
npm install --no-save sharp && node scripts/make-shots.mjs
```

- **iOS kareleri kullanılıyor, Android değil.** Android kareleri koyu durum
  çubuğu + 5G/Gmail ikonlarıyla geliyor ve web'de gürültü yapıyor.
- **Durum çubuğu kırpılıyor** (üstten 141px). `.phone` sarmalayıcısı zaten
  telefon çerçevesi çiziyor, ikinci bir kabuk fazlalık; üstelik karelerde iOS
  "SOS" gösteriyor (şebeke yok), pazarlama görselinde bozuk durur. **141 sayısı
  piksel taramasıyla ÖLÇÜLDÜ, göz kararı değil** — yeni cihazdan kare gelirse
  yeniden ölç.
  > ⚠️ Bu kırpma SADECE SİTE İÇİN. **Mağaza yüklemelerinde durum çubuğunu
  > KIRPMA** — Apple kesin ölçü istiyor (1284×2778) ve kırpmak ölçüyü bozup
  > reddedilmeye yol açıyor. Ayrıntı: `../vyne/CLAUDE.md`, ekran görüntüsü
  > sırası tablosu.
- **Her kare iki dilde.** TR/EN seçicisi metni çevirirken karede "Today's
  Habits" yazması sitenin kendi vaadini bozuyordu. `<img data-shot="home">` +
  `apply()` içindeki üç satır `src`'yi `shot-home.<dil>.jpg` olarak kuruyor.
  **YENİ KARE EKLERSEN İKİ DİLE DE EKLE**, yoksa dil değişince kırık görsel.
- **Tek en-boy oranı zorunlu**: `index.html`'de `.phone img{aspect-ratio}` TEK
  bir değer taşıyor (`640/1314`). Script her çalıştığında bütün karelerin aynı
  oranda olduğunu doğruluyor ve uymayan varsa hata verip duruyor. Kare setini
  yenilersen scriptin son satırdaki çıktısını CSS'e yaz.

`scripts/make-images.mjs` ayrı bir iş yapıyor: `og-image.png` (link paylaşım
kartı) + favicon'lar. Onun kendi tuzağı başlığında yazılı (librsvg font ağırlığı).

## 🚫 GÖSTERİLMEYECEK: kilometre taşı kutlamaları

7 / 30 / 66 / 100. gün kutlama ekranları siteye **konmaz**. Hasan'ın kararı
(2026-08-03): *"sürpriz bunlar, görürse tadı kaçar."*

Varlıklarını **metinle** söylemek serbest ve isteniyor — `s2` ve `ccap2` bunu
yapıyor ("7, 30, 66 ve 100. günde küçük kutlamalar bekler"). Beklenti yaratır,
sürprizi bozmaz. Bozan şey kutlama ekranının GÖRÜNTÜSÜ. `../appscrenshots/`
altında kutlama kareleri mevcut olsa bile kullanılmaz.

## 📌 Açık işler

- **Demo verisi zayıf.** İstatistik karesinde "🔥 1d, Best: 1d", "Bu hafta 1 /
  Geçen hafta 0", "40 dal başlatılmayı bekliyor" yazıyor. **Sitede zararsız** —
  kare 190px'te duruyor, rakamlar okunmuyor. **Mağazada sorun** — orada kareler
  tam ekran ve her rakam okunuyor; "en iyi seri: 1 gün" uygulamayı
  kullanılmamış gösterir. Sağlıklı verili bir demo profili gerekiyor.
- **Yaprak (🍃) karesi yok.** Sitenin en büyük iddiası ("bir gün kaçırdın, seri
  kırılmadı") şu an sadece SVG çizimiyle anlatılıyor, gerçek ekranla değil.
  **Hasan 2026-08-03'te "geç" dedi** — kendiliğinden gündeme getirme.
- **Mağaza listeleme kareleri** ayrı bir iş (site değil). `../appscrenshots/`
  altındaki 4 set (iOS/Android × TR/EN) bunun için hazırlanmış.
- **Hero→01 geçişi sert kesiliyor.** Sahnenin içi KİLİTLİ; dokunmadan önce
  Hasan'a sor (`scripts/build-scene.mjs` başlığındaki karar geçmişini oku).
- **`mailto:` → gerçek form** ve **sosyal kanıt**: bilerek ertelendi.

## ⚠️ Tuzaklar — hepsi burada gerçekten yaşandı

- **`<style>` ya da `<script>` içine HTML yorumu (`<!-- -->`) KOYMA.** CSS
  bunları CDO/CDC belirteci sayar, aradaki metin hatalı bir kural başlatır ve
  KENDİNDEN SONRAKİ kuralı yutar. Bir kez oldu: `.branch{fill:none}` yok olunca
  bütün dallar siyah kamalara döndü. CSS/JS içinde gerçek yorum sözdizimi kullan.
- **`.band p` seçici çakışması.** Kapanış bandındaki `<p>`'ler `.band p`
  (0,0,1,1) ile boyanıyor; oraya sınıflı bir `<p>` koyarsan üst boşluğu ve
  puntosu eziliyor. `.alt-link` bu yüzden çift yazılı: `.alt-link, .band
  p.alt-link`. Ölçüldü: önce düğmeyle arası 0px, düzeltince 14px.
- **Satır sonları.** `index.html` eskiden KARIŞIKTI (CRLF + LF); 2026-08-03'te
  düzenlemeler onu baştan sona **CRLF**'e normalize etti. O yüzden `b76e048`
  commit'i 567/535 satır değişmiş görünüyor, gerçek değişiklik 37/5'ti. Artık
  tutarlı, sonraki diff'ler temiz. Diff şişerse: `git diff --ignore-all-space`.
- **`overflow-x:hidden` KULLANMA** (body'de) — gerekçesi `index.html` içinde
  `body{}` bloğunda uzun uzun yazılı, scroll olaylarını tamamen öldürüyor.
- **`build-scene.mjs` işaretçileri**: `<!--SCENE-->`, `<!--CAL-->`,
  `/*SCENE-CSS*/`, `/*SCENE-JS*/` blokları ELLE düzenlenmez, script yazar.

## ✅ Doğrulama — neye güvenilir, neye güvenilmez

Değişiklikten sonra `preview_start` + tarayıcı araçlarıyla doğrula. Ama:

> **Tarayıcı paneli bu kurulumda çoğu zaman GÖRÜNMÜYOR ve o zaman sayfa kare
> üretmiyor.** Sonucu: `computer{action:"screenshot"}` çalışmaz VE **CSS
> geçişleri ilerlemez.** `body`'de 420ms'lik `background-color` geçişi var, bu
> yüzden tema değiştirip hemen `getComputedStyle` okursan ESKİ değeri alırsın.
> 2026-08-03'te bu yüzden koyu temada kontrast 2.47 ölçüldü ve neredeyse "site
> bozuk" diye rapor edildi — gerçek değer 6.38'di.
>
> **Kural:** animasyonlu/geçişli bir şey ölçeceksen önce
> `el.style.transition='none'` yap. Statik ölçümler (yerleşim, `naturalWidth`,
> `src`, metin, sınıf) güvenilir.

Ayrıca `Grep` çıktısı CSS yorum açıcısını `/*` yerine `\*` gösteriyor — bu bir
görüntüleme tuhaflığı, dosyada hata YOK. İki kez "bozuk yorum buldum" sanıldı;
şüphelenirsen `Read` ile doğrula.

**Kontrast WCAG AA burada kabul edilmiş kriter** (bkz. hafıza:
`project-vyne-design-ownership`). Son ölçüm 2026-08-03, dört temada da geçiyor:
hero bağlantısı 4.83–7.19, kapanış bandı 4.50–4.84.

## Çalışma talimatı

- **Hasan geliştirici değil.** Komutları sen çalıştır, terminal adımlarını sade
  anlat. Mağaza konsolu, kimlik/vergi formları ve yeni depo açma sadece onda.
- **Türkçe cevap ver**, kod/tanımlayıcılar İngilizce. Site metni TR birincil
  (TR sözlüğü HTML gövdesinden toplanıyor), EN `index.html` içindeki `EN`
  nesnesinde. **İkisini birlikte güncelle**, yoksa dil değişince eski metin çıkar.
- **`main` üzerindeysen önce dal aç**, sonra commit. Ama unutma: Pages `main`'den
  yayınlıyor, yani merge edilmeden canlı site değişmez — bunu Hasan'a söyle.
- Bu dosyayı **iş bittikçe güncelle**. Buraya sadece HÂLÂ GEÇERLİ olan yazılır.
