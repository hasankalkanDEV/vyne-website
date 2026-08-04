// Vyne sitesi ekran görüntüleri: uygulamanın ham karelerinden web'e hazır JPEG.
//
// ÇALIŞTIRMA: sharp bu depoda kurulu değil, geçici kur:
//   npm install --no-save sharp && node scripts/make-shots.mjs
//
// KAYNAK DEPONUN DIŞINDA. Ham kareler `../appscrenshots/selected ios <dil>/`
// altında duruyor, yani bu depoyu tek başına klonlarsan script çalışmaz —
// üretilmiş JPEG'ler depoda olduğu için siteyi kurmak yine de sorun değil.
// Ham kareleri kaybetme; yeni sürüm çekince tek yapman gereken aynı dosya
// adlarıyla değiştirip bu scripti bir kez daha çalıştırmak.
//
// NEDEN iOS: Android kareleri koyu durum çubuğu + 5G/Gmail ikonlarıyla geliyor
// ve web'de gürültü yapıyor. Android setini mağaza listelemesi için sakla.
//
// NEDEN DURUM ÇUBUĞU KIRPILIYOR: sitedeki `.phone` sarmalayıcısı zaten koyu bir
// telefon çerçevesi çiziyor, ekranın içinde ikinci bir "telefon kabuğu" (saat,
// pil, sinyal) fazlalık. Üstelik bu karelerde iOS "SOS" gösteriyor (şebeke yok)
// — pazarlama görselinde bozuk görünür. Kırpma noktası GÖZLE DEĞİL ÖLÇÜLDÜ:
// piksel taramasında satır 140 hâlâ durum çubuğu (255,255,255 / dimmed 139,138,136),
// satır 141'de uygulama arka planı başlıyor (248,246,240). Yeni cihazdan kare
// gelirse bu sayıyı yeniden ölç, varsayma.
//
// NEDEN İKİ DİL: sitenin TR/EN seçicisi metni çeviriyordu ama ekran görüntüleri
// İngilizce kalıyordu. Türkçe okuyan biri "Today's Habits" yazan bir kare
// görünce site kendi vaadini bozuyor. Artık her kare iki dilde üretiliyor ve
// index.html içindeki setLang() `data-shot` taşıyan <img>'lerin src'sini
// değiştiriyor. YENİ KARE EKLERSEN İKİ DİLDE DE EKLE, yoksa dil değişince
// kırık görsel çıkar.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, '..', 'appscrenshots');

const STATUS_BAR = 141;   // ölçülmüş: bkz. yukarıdaki not
const WIDTH = 640;        // sitede en büyük kullanım 280px CSS → 2x retina fazlasıyla yeter

// Sitedeki yerleri: home büyük durur (Yakından bölümü), diğerleri alttaki şerit.
// Kaynak dosya adları iki dil klasöründe de AYNI olmalı.
const SHOTS = {
  home:      '01_hero_branches',
  wheel:     '02_spin_wheel',
  stats:     '03_stats_overview',
  themes:    '06_themes',
  templates: '08_templates',
};

const LANGS = { tr: 'selected ios turkish', en: 'selected ios english' };

let ratio = null;
for (const [lang, folder] of Object.entries(LANGS)) {
  for (const [name, file] of Object.entries(SHOTS)) {
    const src = join(SRC, folder, file + '.png');
    const out = join(ROOT, `shot-${name}.${lang}.jpg`);
    const { width, height } = await sharp(src).metadata();
    const info = await sharp(src)
      .extract({ left: 0, top: STATUS_BAR, width, height: height - STATUS_BAR })
      .resize({ width: WIDTH })
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toFile(out);
    const r = `${info.width}/${info.height}`;
    // Tek bir en-boy oranı şart: index.html'deki .phone img{aspect-ratio}
    // TEK bir değer taşıyor. Karışık oran gelirse görseller ezilir.
    if (ratio && r !== ratio) throw new Error(`Oran uyuşmuyor: ${name}.${lang} ${r}, beklenen ${ratio}`);
    ratio = r;
    console.log(`shot-${name}.${lang}.jpg  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
  }
}
console.log(`\nindex.html icin en-boy orani: aspect-ratio:${ratio}`);
