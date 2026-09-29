# Sitenin ekran görüntüleri: uygulamanın kendisinden, örnek profille

`shots/tr/*.webp` ve `shots/en/*.webp` elle çekilmedi. Vyne'ın kendi kodu web'de
çalıştırılıp **örnek bir profille** ("Deniz", gerçek kişi değil) Playwright ile çekildi.
Gerçek kullanıcı verisi yok. Uygulama değişince aynı adımlarla yeniden üret.

1. Uygulamayı depoya DOKUNMADAN geçici bir klasöre kopyala ve web'e derle:

       git -C ../vyne archive HEAD | tar -x -C /tmp/vyne-web && cd /tmp/vyne-web
       npm install
       npm install react-dom@<react ile aynı> react-native-web@~0.21 @expo/metro-runtime@<expo ile aynı>
       cp <site>/scripts/app-shots/web-stubs/firebase.web.js src/firebase.web.js
       cp <site>/scripts/app-shots/web-stubs/expoDriver.web.js src/data/expoDriver.web.js
       cp <site>/scripts/app-shots/web-stubs/webShims.js . && sed -i "1i import './webShims';" index.js
       EXPO_OFFLINE=1 CI=1 npx expo export --platform web --output-dir dist-web
       (cd dist-web && python3 -m http.server 8777 &)

   Stub'lar sadece web önizlemesi için: SQLite yerine AsyncStorage yolu, Firebase web
   oturumu, web'de olmayan `Appearance.setColorScheme`. Uygulamanın deposuna girmezler.

2. Çek: `S=<çalışma klasörü> NODE_PATH=$(npm root -g) node capture.js`
   (`raw-<dil>-<ekran>.png`, 924×2000). `ONLY=home,stats` ile tek tek, `LANGS=tr` ile tek dil.
3. webp'ye çevir: `sharp raw-tr-home.png → shots/tr/home.webp` (kalite 80).

Ekranlar: welcome (karşılama), home, branch (dal sayfası, yaprak + hasta günü), stats,
notes, wheel (dönerken), pick (çarkın seçimi), cloud (düşünce bulutu), inbox, journal
(Gece Yarısı temasında Galaxy), people, templates (Yeni İş önizlemesi), search.
Kilometre taşı kutlamaları ASLA çekilmez (sitenin kuralı).
