# Brief: rebuild the Vyne marketing site with the "Alex" demo screenshots

Date: 2026-10-26. For the agent that rebuilds the site in this repo (`hasankalkanDEV/vyne-website`).
Hasan approved publishing these screenshots in this public repo. Nothing here is live until a page references it.

## 1. What Vyne is

A personal life-map app (Expo / React Native, iPhone + Android, English and Turkish). The profile
bubble branches into categories (Health, Mind, People, Work, Home) with habits, due dates and
statistics. Around the map: a calendar (Schedule, Day, 3 Days, Week, Month, Year), Stats with leaf
calendars, a daily journal, lists and notes on paper themes, a People list, Time Clock, an optional
cycle tracker, and a Mood check-in. A missed habit day can be covered by a "leaf" (gentle streaks,
no guilt). Tone: calm, human, no pressure. The goal is human benefit, never engagement or dependency.

## 2. The demo data

"Alex" is a fake one-year demo profile (Jan to Oct 2026): 8 people (Dad, Grandma Rose, Jordan, Leo,
Maya, Mom, Priya, Sam), 7 habits, 103 journal days, 12 cycles. All names and texts are invented.
iPhone shots were taken 2026-10-26 on build 1.5.1; Android shots the same morning.
Privacy check done before upload: no real names, no phone numbers, no other-app notifications, no
account info. The only real string is the public support address `vyneapp.help@gmail.com` (IMG_0236,
IMG_0237); those two are marked "do not use" anyway.

## 3. Hard rules for the site

1. **Milestone / celebration screens (7, 30, 66, 100 days) must NEVER appear on the site as images.**
   They are a surprise for users. Saying in text that Vyne celebrates milestones is fine. None of
   the files in this folder is a milestone screen (the "A Leaf Fell" modal is a leaf, not a milestone);
   if a future shot is, do not use it.
2. **Mood is not a headline feature.** It is a quiet personal routine, not in store text. Do not put
   Mood in the hero, the feature list headline or the store-style copy. Mood shots below are tagged
   "ASK HASAN": ask before using any of them on the site.
3. The cycle tracker is sensitive. Tag "ASK HASAN" before any cycle shot goes on the site.
4. **No names of rival apps** anywhere (copy, alt text, comparisons, file names).
5. Do not use screenshots that show known bugs or old behaviour (see Status and "Use on site?").
   Prefer the Re-shoot list at the end: capture again, then use.
6. Never show real user data. All files here are demo data, keep it that way.

## 4. Existing site structure (read `CLAUDE.md` in the repo root first)

- GitHub Pages serves `main`: **a push to `main` is live in about a minute.** Adding unreferenced files
  (like this folder) changes nothing.
- Two languages from one source: English at `/`, Turkish at `/tr/`. Texts in the source are written as
  `⟪Turkce¦English⟫`.
- **Sources (edit these):** `site/head.html`, `site/style.css`, `site/body.html`, `site/app.js`,
  `site/live.json` (store-status flags), `site/glyphs.json`, `site/templates.json`, `site/mocks.html`
  (the current drawn app screens: HTML/CSS mocks, not screenshots).
- **Build:** `node scripts/build-site.mjs` produces `index.html`, `tr/index.html` and `en/index.html`.
  **Never edit those three generated files by hand.** The script stops on an unresolved marker.
- Other scripts: `scripts/check-site.js`, `scripts/app-shots/` (shot helpers, og images), `scripts/make-images.mjs`.
- Assets: `fonts/` (local only, no CDN), `app-icon.png`, `og-image.png`, `og-image-tr.png`, `site/qr-*.svg`.
- Site flow today: `#giris` `#nasil` `#ozellikler` `#hikaye` `#oyuncaklar` `#yenilikler` `#sozler` `#sorular` `#indir`,
  plus an "app view" with branch cards. Keep the section anchors.
- Photos are large (the PNG screenshots are ~0.5 MB each). Convert to WebP/JPEG at display size in the
  build step before referencing them; do not ship full-size PNGs in the page.

## 5. What shipped AFTER these shots (screens marked CHANGED-SINCE)

Everything below shipped by OTA on 1.5.1 / 1.5.0 on 2026-10-26 and later. The screenshots were taken before it.

**Package 1 polish (~25 fixes):** journal count on the Notes hub (was "0 pages"); Stats sentences
(no false "1358 more than your usual" in year one; one definition of "usual" and of "leaves kept";
"Week 44" label; weekly-habit units); hour labels on the 3 Days / Week grids; "None" badges hidden on
branch cards and in Search; "Good progress, don't stop!" pressure copy removed; month names in Stats
Activity no longer break; Mood year cell seam and week axis labels; Android Mood-options check mark;
Android Status donut; cycle full-screen day panel.

**Package 2 (design and scale):**
- Home: a **Today card above the vine** (next event, habits, mood and journal state); the **+N chip removed**;
  the **Mood chip now sits in Today's habits** (calendar Schedule and Home).
- **Stats with meaning:** values on bars, axes on charts, proper nouns on tiles, an **insight card**.
- **Calendar:** Year is a **heat map**; Month has **two-line titles and a day list** under the grid; hour labels fixed.
- **Journal:** month headers and **search** in "Days written".
- **"How Vyne works"** page in More (branch, habit, leaf, status, notes, calendar).
- **Account screen:** sign-in, backup and encryption moved out of Settings into their own screen.
- **Holidays follow the phone country** (new installs); the demo showed Turkiye holidays.

## 6. How to read the table

Use on site? `good` = looks right and the screen is still accurate. `weak` = usable only for a small
detail or with a crop; `do not use` = shows a bug, an old design, an unfinished state or private strings.
Status `current` = the screen still looks like this in the app. `CHANGED-SINCE` = looks different now;
do not use it as the face of the new design: wait for the re-shoot. Files are in `ios/` and `android/` next to this brief.

## 7. iPhone (56 files, 1.5.1)

| File | Platform | Screen | What it shows | Use on site? | Status |
|---|---|---|---|---|---|
| `IMG_0204.PNG` | iOS | Home (vine) | Vine map with 5 branch cards, today strip (Mood, Morning walk, Stretch) 0/7. Grey "None" badges on every card. Home now has a Today card above the vine; None badges and the +N chip are gone; Mood chip now sits in Today's habits. | weak | CHANGED-SINCE |
| `IMG_0205.PNG` | iOS | Home + "A Leaf Fell" modal | Leaf-caught-your-day modal over Home, 5-day strip. Modal is current; Home behind it changed (Today card, no None badges). | good | CHANGED-SINCE |
| `IMG_0206.PNG` | iOS | Spin for one | Wheel with 7 habit slices. | good | current |
| `IMG_0207.PNG` | iOS | Mood check-in (top) | Faces, optional energy bars, sleep, who you were with. ASK HASAN before any use (mood is not a headline feature). | good | current |
| `IMG_0208.PNG` | iOS | Mood check-in (bottom) | Movement, outside, stress, caffeine, note, Save. ASK HASAN (mood). | good | current |
| `IMG_0209.PNG` | iOS | Mood page, Week | 7-day dot chart, energy bars, day card, week summary. Y-axis labels were cut ("Very g..."); fixed in polish. ASK HASAN (mood). | weak | CHANGED-SINCE |
| `IMG_0210.PNG` | iOS | Mood page, Week (scrolled) | Correlation sliders, most used words, export. Same correlation block repeats on every tab. ASK HASAN (mood). | weak | current |
| `IMG_0211.PNG` | iOS | Mood page, Month | October colour calendar and "Through the month" strip. ASK HASAN (mood). | good | current |
| `IMG_0212.PNG` | iOS | Mood page, Month (scrolled) | Month summary bar, correlations, words. ASK HASAN (mood). | weak | current |
| `IMG_0213.PNG` | iOS | Mood page, Year | One square a day, 251 days logged. Filled cells had a faint diagonal seam; fixed. ASK HASAN (mood). | weak | CHANGED-SINCE |
| `IMG_0214.PNG` | iOS | Mood page, Year (scrolled) | Year distribution, correlations, words. ASK HASAN (mood). | weak | current |
| `IMG_0215.PNG` | iOS | Mood day sheet (May 19) | Day detail with factors, Edit / Open journal. ASK HASAN (mood). | good | current |
| `IMG_0216.PNG` | iOS | Mood day sheet (Oct 17) | Day detail, Bad day. ASK HASAN (mood). | good | current |
| `IMG_0217.PNG` | iOS | Mood "What should I track?" | Option chips. Cycle line says "turn on cycle tracking" although it is on. Known wrong message in the demo data. | weak | current |
| `IMG_0218.PNG` | iOS | Calendar, Schedule | Today's habits chips, events Tue-Thu, Turkiye holidays, FAB over last card. Today's habits now has a Mood chip; holidays now follow the phone country (this shot shows Turkiye holidays). | weak | CHANGED-SINCE |
| `IMG_0219.PNG` | iOS | Calendar, 3 Days | Time grid WITHOUT hour labels. Hour labels were missing; fixed in polish. | do not use | CHANGED-SINCE |
| `IMG_0220.PNG` | iOS | Calendar, Week | Week grid without hour labels, titles cut to 4 letters. Hour labels fixed; Week titles changed. | do not use | CHANGED-SINCE |
| `IMG_0221.PNG` | iOS | Calendar, Month | Month grid, past events grey, titles cut at ~5 letters. Month now has two-line titles and a day list under the grid. | weak | CHANGED-SINCE |
| `IMG_0222.PNG` | iOS | Calendar, Year | 12 plain number grids, no data. Year is now a heat map. | do not use | CHANGED-SINCE |
| `IMG_0223.PNG` | iOS | Calendar options sheet | Show only / branch filters, Labels, settings, import, phone calendars. | good | current |
| `IMG_0224.PNG` | iOS | Labels sheet | Label list; demo has two "Work" labels (Blue and Orange). Duplicate-name demo data looks like a bug. | do not use | current |
| `IMG_0225.PNG` | iOS | Stats, Week | Week number "44", habit rows with streaks, one-line story. Stats now has values, axes, units and an insight card; "Week 44" label. | weak | CHANGED-SINCE |
| `IMG_0226.PNG` | iOS | Stats, Month | October leaf calendar, 126 check-ins. Story sentence and "usual" band redefined. | weak | CHANGED-SINCE |
| `IMG_0227.PNG` | iOS | Stats, Year | Month tiles; story says "1358 more than your usual". First-year comparison bug fixed; counts unified. | do not use | CHANGED-SINCE |
| `IMG_0228.PNG` | iOS | Year in leaves | Vine Jan to Oct, 297 days / 68 gold leaves / 103 notes. Leaf counts unified with Stats (was 78 vs 68). | good | CHANGED-SINCE |
| `IMG_0229.PNG` | iOS | Habit sheet: Morning walk | 61 days in a row, calendar with leaf protection. Empty SUB-BRANCHES box at the bottom. | good | current |
| `IMG_0230.PNG` | iOS | Stats Year (scrolled) | Done per month bars, Activity list with month names broken mid-word. Month names fixed; bars now have values. | do not use | CHANGED-SINCE |
| `IMG_0231.PNG` | iOS | Stats Month (scrolled) | Weekly bars, Activity icon wall. Activity redesigned. | weak | CHANGED-SINCE |
| `IMG_0232.PNG` | iOS | Stats Year (lower) | Upcoming 0, navy week-shape bars, heatmap, "Good progress, don't stop!" tiles. Pressure copy removed; navy bars and heatmap redrawn with axes. | do not use | CHANGED-SINCE |
| `IMG_0233.PNG` | iOS | More: Profile + Appearance | Alex profile row, Light/Warm/Dark/Midnight themes. Settings list reorganised later (Account screen); themes unchanged. | good | current |
| `IMG_0234.PNG` | iOS | More: Seasons ... Cycle tracking | Seasons, card detail, language, cycle toggle. | weak | current |
| `IMG_0235.PNG` | iOS | More: Cycle settings + Cloud Backup | Cycle options, Cloud Backup sign-in card. Sign-in moved to the Account screen. | do not use | CHANGED-SINCE |
| `IMG_0236.PNG` | iOS | More: Sign-in form + Local Backup | Inline email/password form, export/import. Shows the public support email. Sign-in is no longer in Settings. | do not use | CHANGED-SINCE |
| `IMG_0237.PNG` | iOS | More: About | Support, Privacy, Terms, version string. Shows build string and support email. | do not use | current |
| `IMG_0238.PNG` | iOS | Search tab | Template category chips, recently added rows. None badges removed. | weak | CHANGED-SINCE |
| `IMG_0239.PNG` | iOS | Notes hub | 6 notes grid; Journal says "0 pages". Journal count fixed. | weak | CHANGED-SINCE |
| `IMG_0240.PNG` | iOS | Notes Add sheet | Name, 8 note types, paper colours. | good | current |
| `IMG_0241.PNG` | iOS | Daily journal, today | Empty page, "One line is enough". Empty page. | weak | current |
| `IMG_0242.PNG` | iOS | Journal prompt sheet | Prompt list; one prompt says "What did Alex get up to today?". | weak | current |
| `IMG_0243.PNG` | iOS | Journal "Days written" | Flat list of excerpts. Journal now has month headers and search. | weak | CHANGED-SINCE |
| `IMG_0244.PNG` | iOS | Journal calendar | Month calendar with dots on written days. | good | current |
| `IMG_0245.PNG` | iOS | People list | 8 people, A-Z headers, Maya birthday banner. Header repeats "8 people". | good | current |
| `IMG_0246.PNG` | iOS | New person | Name field with keyboard. Keyboard-only screen. | do not use | current |
| `IMG_0247.PNG` | iOS | Person "H" | New person detail with raw "MM-DD" placeholder. | do not use | current |
| `IMG_0248.PNG` | iOS | Groceries list | Checklist on a cream paper. Big "1" header and margin line through title. | weak | current |
| `IMG_0249.PNG` | iOS | Garden ideas note | Note on a pink-blue gradient paper. Header reads "1 / GARDEN IDEAS". | good | current |
| `IMG_0250.PNG` | iOS | Time Clock | Time card, week total 38:58, slide to clock in. Likely polished (clipped digits, range label); verify. | weak | CHANGED-SINCE |
| `IMG_0251.PNG` | iOS | Cycle: This cycle | Day 15, temperature chart, period, mucus, LH rows, facts from 12 cycles. "Stays on this phone" line. Sensitive topic; ASK HASAN for the site. | good | current |
| `IMG_0252.PNG` | iOS | Cycle log (top) | Temperature, period, mucus, LH. Sensitive; ASK HASAN. | weak | current |
| `IMG_0253.PNG` | iOS | Cycle log (bottom) | Cervix, body symptoms, energy, sex drive. Sensitive; ASK HASAN. | weak | current |
| `IMG_0255.PNG` | iOS | Cycle full screen (landscape) | Rotated chart with blank right panel. Layout bugs. | weak | current |
| `IMG_0256.PNG` | iOS | Cycle full screen + Day 1 panel | Label wraps one syllable per line. | do not use | current |
| `IMG_0257.PNG` | iOS | Cycle full screen, compare on | Dotted previous-cycle line. | weak | current |
| `IMG_0258.PNG` | iOS | Cycle 12 compare | Full 29-day cycle with temperature shift. | weak | current |
| `IMG_0259.PNG` | iOS | Cycle 12, Day 15 | Highlight band, LH positive, egg white. | weak | current |
| `IMG_0260.PNG` | iOS | Cycle 12, compare off | Chart without dotted line. | weak | current |

## 8. Android (48 files)

| File | Platform | Screen | What it shows | Use on site? | Status |
|---|---|---|---|---|---|
| `Screenshot_20261026_101400_vyne.jpg` | Android | Mood page, Week | Dot chart, energy bars, summary. Y label cut ("Very go..."). ASK HASAN (mood). Axis fixed. | weak | CHANGED-SINCE |
| `Screenshot_20261026_101406_vyne.jpg` | Android | Mood Week (scrolled) | Correlations, words, export. ASK HASAN (mood). | weak | current |
| `Screenshot_20261026_101412_vyne.jpg` | Android | Mood Month | October colour calendar. ASK HASAN (mood). | good | current |
| `Screenshot_20261026_101429_vyne.jpg` | Android | Mood Month (scrolled) | Day card, month summary, correlations. ASK HASAN (mood). | weak | current |
| `Screenshot_20261026_101434_vyne.jpg` | Android | Mood Month (bottom) | Correlations, words, export. ASK HASAN (mood). | weak | current |
| `Screenshot_20261026_101442_vyne.jpg` | Android | Mood Year | One square a day, 251 days. Cell seam fixed. ASK HASAN (mood). | weak | CHANGED-SINCE |
| `Screenshot_20261026_101446_vyne.jpg` | Android | Mood Year (scrolled) | Year summary, correlations. ASK HASAN (mood). | weak | current |
| `Screenshot_20261026_101451_vyne.jpg` | Android | Mood Year (bottom) | Top words, export. ASK HASAN (mood). | weak | current |
| `Screenshot_20261026_101503_vyne.jpg` | Android | Mood day sheet (Aug 19) | Bad day, factors, Edit / Open journal. ASK HASAN (mood). Cycle day chips visible. | good | current |
| `Screenshot_20261026_101517_vyne.jpg` | Android | Mood day sheet (Oct 22) | Very good day. ASK HASAN (mood). | good | current |
| `Screenshot_20261026_101524_vyne.jpg` | Android | Mood "What should I track?" | Unselected chips show a check mark (Android bug). Android check-mark bug fixed. | do not use | CHANGED-SINCE |
| `Screenshot_20261026_101547_vyne.jpg` | Android | Calendar, Schedule | Today has habits only, events Oct 27-30, Turkiye holidays. Mood chip in Today's habits; holidays follow phone country. | weak | CHANGED-SINCE |
| `Screenshot_20261026_101600_vyne.jpg` | Android | Calendar, 3 Days | Time grid without hour labels. Hour labels fixed. | do not use | CHANGED-SINCE |
| `Screenshot_20261026_101611_vyne.jpg` | Android | Calendar, Week | Week grid without hour labels. Hour labels fixed; titles changed. | do not use | CHANGED-SINCE |
| `Screenshot_20261026_101616_vyne.jpg` | Android | Calendar, Month | Month grid with week numbers, cut titles. Two-line titles, day list. | weak | CHANGED-SINCE |
| `Screenshot_20261026_101627_vyne.jpg` | Android | Calendar, Year | 12 plain mini months, FAB over December. Year is now a heat map. | do not use | CHANGED-SINCE |
| `Screenshot_20261026_101637_vyne.jpg` | Android | Stats, Week 44 | "4 fewer than usual", 0 check-ins, habit list 0%. Stats redesigned with values and insight card. | do not use | CHANGED-SINCE |
| `Screenshot_20261026_101644_vyne.jpg` | Android | Stats, Month October | Story, leaf calendar, 124 check-ins. Stats redesigned. | weak | CHANGED-SINCE |
| `Screenshot_20261026_101648_vyne.jpg` | Android | Stats Month (scrolled) | Habits 85% with 7-day strips, Done per week. Weekly habit units ("9d") fixed. | weak | CHANGED-SINCE |
| `Screenshot_20261026_101655_vyne.jpg` | Android | Habit sheet: Read 20 pages | 20 in a row, October calendar, leaf protection. Empty SUB-BRANCHES box. | good | current |
| `Screenshot_20261026_101659_vyne.jpg` | Android | Stats Month Activity | Icon rows by day, "Show 16 earlier days". Activity redesigned. | weak | CHANGED-SINCE |
| `Screenshot_20261026_101707_vyne.jpg` | Android | Day sheet, Sun Oct 25 | Habits, branches, written, checked off. Demo journal text says "Slow Saturday" on a Sunday. | good | current |
| `Screenshot_20261026_101715_vyne.jpg` | Android | Stats Month (lower) | Finished by category, Upcoming 0/0, navy week-shape, heatmap. Redrawn with axes and values. | do not use | CHANGED-SINCE |
| `Screenshot_20261026_101720_vyne.jpg` | Android | Stats "Right now" | 28/11/39%, status donut shows 100% Done. Donut fixed; pressure copy removed. | do not use | CHANGED-SINCE |
| `Screenshot_20261026_101726_vyne.jpg` | Android | Stats Year | Story "1356 more than your usual", month leaf grid. Comparison bug fixed. | do not use | CHANGED-SINCE |
| `Screenshot_20261026_101735_vyne.jpg` | Android | Year in leaves (all) | Vine Jan to Oct. Leaf counts unified. | good | CHANGED-SINCE |
| `Screenshot_20261026_101742_vyne.jpg` | Android | Year in leaves (Mind + People) | Filtered vine. Counts unified. | weak | CHANGED-SINCE |
| `Screenshot_20261026_101746_vyne.jpg` | Android | Year in leaves (Mind) | Filtered vine. Counts unified. | weak | CHANGED-SINCE |
| `Screenshot_20261026_101801_vyne.jpg` | Android | Stats Year: Activity | Activity by month, month names broken mid-word. Month names fixed; bars have values. | do not use | CHANGED-SINCE |
| `Screenshot_20261026_101822_vyne.jpg` | Android | Cycle: This cycle | Day 15, BBT chart, period, mucus, LH. Sensitive; ASK HASAN. | good | current |
| `Screenshot_20261026_101828_vyne.jpg` | Android | Cycle chart full screen | Rotated window (gesture bar on the wrong side). | weak | current |
| `Screenshot_20261026_101836_vyne.jpg` | Android | Full-screen chart, Day 4 | Day panel. | weak | current |
| `Screenshot_20261026_101844_vyne.jpg` | Android | Full-screen chart, compare | Dotted last-cycle line. | weak | current |
| `Screenshot_20261026_101901_vyne.jpg` | Android | Full-screen chart, Cycle 12 Day 15 | Panel label wraps per syllable. | do not use | current |
| `Screenshot_20261026_101922_vyne.jpg` | Android | Home + "A Leaf Fell" modal | Leaf modal over Home list. Home behind it changed. | good | CHANGED-SINCE |
| `Screenshot_20261026_101948_vyne.jpg` | Android | Spin for one | Wheel with 6 slices. | good | current |
| `Screenshot_20261026_101954_vyne.jpg` | Android | Spin result: Morning walk | 2-minute timer prompt. | good | current |
| `Screenshot_20261026_102009_vyne.jpg` | Android | Water "How much?" sheet | 500 ml of 2 L, quick amounts, undo toast. Toast layout slightly off. | good | current |
| `Screenshot_20261026_102015_vyne.jpg` | Android | Home map, loading | Only the Alex bubble, no branches. Slow-draw bug. | do not use | CHANGED-SINCE |
| `Screenshot_20261026_102028_vyne.jpg` | Android | Home map, "All done!" | Still no branches. Slow-draw bug. | do not use | CHANGED-SINCE |
| `Screenshot_20261026_102043_vyne.jpg` | Android | Home map with branches | Cycle card, Health/Mind Done, People/Work/Home None. Today card above the vine; None badges gone. | weak | CHANGED-SINCE |
| `Screenshot_20261026_102055_vyne.jpg` | Android | Journal with Calendar sheet | Oct 22 page with month calendar. | good | current |
| `Screenshot_20261026_102101_vyne.jpg` | Android | Journal "Days written" | Flat list of excerpts. Month headers and search. | weak | CHANGED-SINCE |
| `Screenshot_20261026_102132_vyne.jpg` | Android | People list | 8 people (D section header missing on Android). | weak | current |
| `Screenshot_20261026_102156_vyne.jpg` | Android | Groceries list | Bloom paper checklist. Big "1" header. | good | current |
| `Screenshot_20261026_102210_vyne.jpg` | Android | Books to read list | Cream paper list. Big "1" header. | good | current |
| `Screenshot_20261026_102219_vyne.jpg` | Android | Garden ideas on Galaxy paper | Dark paper note; status bar icons illegible. | weak | current |
| `Screenshot_20261026_102318_vyne.jpg` | Android | Time Clock | Closed sign, previous week, header truncated. Likely polished; verify. | weak | CHANGED-SINCE |

## 9. Re-shoot list (CHANGED-SINCE screens Hasan should capture again)

Use the same Alex demo data, refreshed to today. Take iPhone first; Android only for the few starred (*).
Do NOT shoot milestone screens.

1. **Home** with the Today card above the vine (and Mood chip in Today's habits, no +N, no None badges). Was IMG_0204, 0205; Android 101922, 102043. (*)
2. **Calendar Year** heat map. Was IMG_0222; Android 101627. (*)
3. **Calendar Month** with two-line titles and the day list under the grid. Was IMG_0221; Android 101616.
4. **Calendar Week and 3 Days** with hour labels. Was IMG_0219, 0220; Android 101600, 101611.
5. **Calendar Schedule** with the Mood chip and the phone-country holidays (set a US phone/region). Was IMG_0218; Android 101547.
6. **Stats Week, Month, Year** (top: story + leaf calendar). Was IMG_0225, 0226, 0227; Android 101637, 101644, 101726. (*)
7. **Stats lower half** (values, axes, insight card, Activity): Year scrolled, Month scrolled, "Right now". Was IMG_0230, 0231, 0232; Android 101648, 101659, 101715, 101720, 101801.
8. **Year in leaves** (all branches). Was IMG_0228; Android 101735, 101742, 101746.
9. **Journal "Days written"** with month headers and the search field. Was IMG_0243; Android 102101. (*)
10. **Notes hub** with a correct Journal count. Was IMG_0239.
11. **Search tab** without None badges. Was IMG_0238.
12. **"How Vyne works"** page (new). No old shot exists. (*)
13. **Account screen** (new) and the slimmer **Settings / More**. Was IMG_0235, 0236; new shots; do not show an email field filled in.
14. **Time Clock** (check clipped digits and header range). Was IMG_0250; Android 102318.
15. **Mood Week and Year** only if Hasan allows Mood on the site (axis and cell seam fixed). Was IMG_0209, 0213; Android 101400, 101442.
16. **Android Mood "What should I track?"** and **Home map** only if needed for Android. Was Android 101524, 102015, 102028.

Also fix the demo generator before shooting: journal text says "Slow Saturday" on a Sunday and repeats;
duplicate "Work" labels (Blue and Orange); only 5 list items checked off for the whole year.
