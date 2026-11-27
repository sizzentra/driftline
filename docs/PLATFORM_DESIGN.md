# Driftline platform design standards

What every screen looks like on each platform. New screens follow these rules; anything they don't cover is added here
first (asking the director when it is a real design choice). Platform rules and all process live in CLAUDE.md.

## PC (src/pc/)
The director plays full screen at 1920×1080. The full-HD layout (`body.pc-fhd`) switches on at 1800×950 and up; smaller PC
windows use the regular PC layout (`body.pch-on`).

**PC Reborn (director, 2026-11-21):** PC gets every system, page and name the phones have (checked by the sweep's "PC has what phones have", `__menuMap`), laid out for a big screen; everything PC-related lives in the one header row.

**Frame**
- **Header:** one row, always the same size and always visible, including while a menu is open. Menus open below it and nothing shifts.
  - Left: brand, Level (opens Skills), Coins (opens Stats).
  - Middle: the sections, filling the free space, each an icon over its name: **Quests, Map, Upgrades, Collection, Challenges, Customize, Prestige** (the phones' sections; Stats is the header chip on PC).
  - Right: the page chips **Cooler, Aquarium, Home, Fish Log, Bounties, Stats**, then full screen, search and settings.
  - Under it, the slim strip: Fishing at (opens Map), Bait (opens Bait), the goal chip (opens its page; shows "Live …" during an event), Rest.
- **Header buttons:**
  - Teal (`#1f8a86 → #14666a`, border `#7fe3c4`) means "click me". Gold (`#ffe08a → #f3b94e`, dark text) means "open now"; a gold border means a reward waits (Bounties; the box was called Tasks until daily tasks and weekly quests went, 2026-11-27).
  - Clicking a lit button closes its page again.
  - No shape indicators (no chevrons or ✕): colour alone shows state.
  - Everything in the header that can open a page does.
- **Every page lives in exactly one place.** No name is shown twice on one screen.

**Pages (the phones' organisation, `src/cx_pages.js`):** a strip with the page's key numbers and main action, the page's sections as ONE row of tabs, and one scrolling body under them. Exceptions with their own PC layout: **Fish Log** (the director: "fish log looks great on pc"), **Aquarium** and **Your home** (preview on top, boxes under it), **Wardrobe** (rail | preview | option cards).

**Size: PC_UI (`src/pc/pages_pc.js`, checked by `__pcSpec` at 1920×1080, 2560×1440, 1440×900)**
| Part | Size |
|---|---|
| Body text | 15 px |
| Small text, notes | 13 px |
| Card titles | 16 px |
| Page headings | 22 px |
| Strip key numbers | 20 px (labels 11 px uppercase) |
| Tabs | 42 px tall, 15 px |
| Buttons | 36 px (small 32 px), chips 36 px, strip actions 40 px |
- Text appears only in the standard sizes (11, 12, 13, 14, 15, 16, 18, 20, 22 px); controls only at 32, 36, 40 or 42 px; no text cut off.
- Bigger windows (1440p, 4K) zoom the whole interface to the same look (`UIZ`); smaller ones stay at 100%.
- Everything fits one screen. Long lists scroll inside the page body; the page itself doesn't scroll.
- **Picture:** Auto quality draws the water at 1.5× (sharper edges and detail); Sharp at 2×; Balanced and Fast for older PCs. Moving detail (rain rings and other particles) is drawn 1.5× as dense as on phones (`PLAT.detail`, `src/pc/ui_display.js`).
- Cards in one grid are all the same size. Section titles are small uppercase labels (gold for card titles, grey-blue for rail labels).
- **Column boards always line up in rows** (director, 2026-11-18: "make that a priority even when making changes"): columns share one grid (`subgrid`), so card N of every column starts at the same height. Never let columns stack independently.
- A setting with many options in a small space becomes one compact picker per line (Rods' attachment slots), never a tall list that pushes other controls out of sight.
- Pinned controls stay put while their list scrolls: sort, filter and status bars sit above the scrolling area, never inside it (Your home's cozy level and decoration sorting).

**Panels and help**
- **Panels:** dark navy cards (`#0e1a2c`, border `#ffffff14`, radius 14–16 px). Inner boxes `#0a1424`.
- **Explanations:** a short visible line or a small guide box. Tooltips use the game's own style (`#dltip`), never the browser's.

**Speed**
- The fishing scene isn't drawn while a full-HD menu covers it (except on Dock, whose preview is the live scene).
- Page changes and clicks never move buttons under the cursor.

## Android and iPhone (src/mobile/, src/android/, src/ios/)

**Touch**
- Tap targets (as built, measured): chips and small buttons 32 px tall sideways, 36 upright; regular buttons 38 sideways, 40 upright; top rows 38 / 36; categories 40 (rail) / 50 (bottom card). See "Controls: one look per kind". No hover effects on touch screens.
- Menu taps act when the finger lifts.

**Upright**
- The game fits one screen: the water stays fixed and the page scrolls inside its own area.
- The category bar sits under the water.

**Sideways**
- The categories sit in a rail on the right, both on the water and in menus.
- Short screens get compact top-bar chips.

**Forms**
- Labels sit above fields.
- Rows of tabs never scroll by a few pixels: header page tabs always fit (they squeeze, and show names only below 760 px wide); in-page section bars fit their row. A picker with more than 4 options (Wardrobe: 7 categories) uses icon-over-label tiles, like the upright page tabs.

**iPhone only**
- Safe areas are handled for the home-screen app.
- No magnifier while holding the water.
- No focus zoom.

**Phone frame: set measurements** (director, 2026-11-18: "standards and set measurements for each platform"). The numbers live in ONE place in the code, `MB_FRAME` at the top of `src/mobile/frame07.js`; change them there and here together. **The water screen is the master: a menu matches it wherever the same thing appears**, so nothing moves or changes size when a menu opens or closes.

| | Upright | Sideways |
|---|---|---|
| Screen edges (left / right) | 8 px | 8 px |
| Top row (every chip, Back, coins, search, settings) | top 6, height 36 | top 6, height 38 |
| Second row | top 46, height 36 (water: Cooler, Aquarium, Home, Fish Log; the first row holds Coins / Level / Fishing at and the gear); water from top 90 (narrow windows only: phones are landscape-only) | none: page tabs sit in the top row, height 38 |
| Water / page area | full width minus the edges | starts at top 49, ends 6 px above the bottom, right edge 6 px left of the rail |
| Categories | bottom card: 8 px from the sides, 6 px from the bottom, 58 tall, padding 3; buttons 50 tall | right rail: 124 wide (56 collapsed), 8 px from the right edge, from top 49 to 6 px above the bottom (same on the water and in menus); buttons 40 tall, 5 apart |
| Notices in menus | centred at the bottom | centred over the page (not the whole screen) |
| Page tabs in the top row | 4 per row grid (existing upright layout) | one row that never scrolls; badges poke out of the tab's top corner like the side rail's and never cover the name; side padding follows the screen width; names only (no icons) below 760 px wide |
| Corners of the water | top left = status corner (time + weather chip, then boost timers, then the weather note); bottom left = Rest and Bait buttons; nothing drawn on the water may sit under a button | same |

**Controls: one look per kind** (director, 2026-11-18: "cross reference everything that's connected, we need this to stop being so inconsistent"). Numbers in ONE place: `MB_UI` in `src/mobile/frame07.js`; `__spec` checks every one on every page.

| Kind | Upright | Sideways |
|---|---|---|
| Regular button (`.btn`) | 40 tall, 15 px text | 38 tall, 15 px text |
| Small button (`.btn.sm`, the aquarium bar pair) | 36 tall, 13 px | 32 tall, 13 px |
| Button labels | one line; a label too wide for its button shrinks (never under 12 px) instead of wrapping | same |
| Section tab (Gear / Bait, Waters / Set sail again...) | 34 tall, 12 px, bold 800, corners 10 | 32 tall, 13 px, bold 800, corners 10 |
| Badge (every count: bottom tabs, rail, page tabs, section tabs) | 16 px, 10 px bold (was 18: a 2-3 digit count in the rail corner touched the name; 16 ends above the name, the 5 px gap above is the limit) | same |
| Category labels (bottom tabs / rail), water and menus alike | 10.5 px | 11.5 px |
| Chip (filters, choices, toggles) | 32 tall, bold 700, corners 10 | same |
| Description text (`p.sub`) | 12.5 px, #97abc2 | same |
| Card title (`h4`) | 14.5 px | 15 px |
| Page heading (`h2`, Trophy Room title, Events / Tide Pass headings) | 21 px, bold 800, white | 18 px, bold 800, white |
| "Next goal" chip | one row (30 tall) like the location chip; long goals end in "…", progress as a thin line along its bottom | (in the top row) |

**Rows:** a row of buttons either fits or is a real scroll area. Never a row that scrolls by a few pixels (it turns taps into tiny scrolls and shifts under the finger). Held sideways, the header tab row never scrolls at all (it always fits, so badges can sit on the tab corners). Labels are never cut.

**Taps:** every button you can see must take the tap: nothing (no layer, label, guard or fade) may sit on top of its middle. A guard against a phone's follow-up tap covers only the spot under the finger, never the whole screen.

**The check (required before anything goes to the test apps or live):** `window.__spec()` in a test build (`?test`) measures the screen you are on against these numbers and lists every break, including covered buttons and the status corner reaching the Rest button. Run it on the water and on every menu page (scrolled top and bottom) at every phone size below, on BOTH the Android and iPhone builds; it must return nothing. `__qa()` and `__layoutQC()` must also pass.

**Safe areas (director, 2026-11-18, iPhone 17 Pro Max: menus "cut off by my front cameras", "iPhones and Pro Maxes aren't the same size"):** every edge is `max(standard, env(safe-area-inset-*))`, the same rule as the fishing screen, so menus clear the Dynamic Island / camera cutout, the rounded corners and the home bar and match the water on every model. A desktop browser has zero insets, which hid this: **always test with `window.__safeSim(left, right, top, bottom)`** (test builds only; rewrites every `env(safe-area-inset-*)` to the given points). `__spec` fails any button, heading, text or chip that reaches into a simulated inset.

**Phone test sizes = the modern models (director: "stick to the more modern sizes", "15s should have support too"; one standard for all):** CSS points, safe areas upright → sideways.

| Model | Upright | Safe areas (upright → sideways) |
|---|---|---|
| iPhone 16 / 17 Pro Max (the director's) | 440×956 | top 62, bottom 34 → left/right 62, bottom 21 |
| iPhone Air | 420×912 | top 68 → left/right 68, bottom 21 |
| iPhone 15 Plus / 15 Pro Max / 16 Plus | 430×932 | top 59, bottom 34 → 59, bottom 21 |
| iPhone 16 Pro / 17 / 17 Pro | 402×874 | top 62, bottom 34 → 62, bottom 21 |
| iPhone 15 / 15 Pro / 16 | 393×852 | top 59, bottom 34 → 59, bottom 21 |
| iPhone XS Max / 11 Pro Max (6.5", notch; App Store size class) | 414×896 | top 44, bottom 34 → left/right 44, bottom 21 |
| Pixel 9 / 10 | 412×915 | 0 → cutout 32 on one side |
| Galaxy S24 / S25 | 360×780 | 0 → cutout 32 on one side |

Run `__spec` at each, upright and sideways, with its safe areas simulated. Reference (director's screenshots of the Claude app on the 17 Pro Max, 2026-11-18): upright, the header starts 62 pt down and the input ends 34 pt above the bottom; sideways, the bottom bar ends 21 pt up and the corner buttons sit 38 pt from the sides (the camera is mid-edge, so the top corners are free). The table's numbers match it; Driftline keeps everything 62 pt in on both sides for now. The older small sizes (375×667, 667×375, 734×360) no longer have to pass. iPhone with `?test&ios`.

**Speed:** a menu page must open in about one frame's budget on top of building the page. Never paint or build what is not on screen when a page opens (e.g. the Aquarium's 45 hidden decoration pictures are painted in small batches right after it shows), and never do heavy one-time work inside a tap (the music and ambience buffers are built 0.4 s after the first tap; the tap only unlocks audio). Measure with `__fnTime(names, fn)`.

**iPhone is landscape only (director, 2026-11-18: "a full forced landscape across the board... just for iPhone").** iPhone browsers and Home Screen apps cannot lock orientation (no `screen.orientation.lock`, manifest `orientation` ignored; checked against caniuse/WebKit status), and rotating the page with CSS breaks taps, safe areas and the keyboard. So `src/ios/landscape08.js` shows a full "Turn your iPhone sideways" screen whenever an iPhone is upright, pauses the game underneath (no update, no drawing) and blocks taps; it tells players how to switch off Portrait Orientation Lock. iPads are not affected (they keep every orientation). **iPhone checks therefore cover sideways sizes only**, plus the turn screen upright (`?test&iphone` simulates an iPhone). Android keeps both orientations.

**Settings belong to the device (director: "settings options separate to specific devices").** `src/mobile/settings08.js`: sound, controls, display, performance and layout choices (`DEV_KEYS`) are kept per device in `localStorage['dl-device-settings-v1']`; any save that arrives (6-digit transfer, save code, cloud, backup, progress reset) keeps this device's settings, while progress and gameplay choices (protect rare fish, mini-games, auto bait, sell filters) travel with the save. A new device setting must be added to `DEV_KEYS`.
- **Show only what works on the device:** iPhone hides Vibration (no vibration in iPhone browsers); no phone shows a Full screen option: phones are always full screen (iPhone home-screen mode, Android manifest display fullscreen + re-enter on tap; director 2026-11-18); help texts speak about touch only.
- **Frame rate** (phones): 30 · Saver / 60 / Max (Android; Max = the screen's own rate), 30 / 60 on iPhone (browsers stop at 60). Steady pacing, verified at 60/90/120/144 Hz screens. The existing on/off is named "Frame rate counter".
- **Not yet (needs the director, bigger layout work):** text size, left-handed / menu side, bigger tap targets, colour-blind help for rarity colours.

**Tablets and iPads use the phone layouts, scaled (director, 2026-11-18: "proper tablet and iPad support").** `src/mobile/tablet08.js`: a touch device whose shorter side is at least 600 pt sets its viewport to a phone-shaped page with a fixed zoom (initial = minimum = maximum scale): sideways the page is 540 tall (sideways phone layout), upright 600 wide (upright phone layout). Everything is 1.2–1.9× bigger (tablet-sized taps), layout/taps/media queries stay exact, and every phone standard and check applies unchanged. Turning the tablet or resizing a split-screen window measures again; the keyboard never does. `html.dl-tablet` marks it (tablets have a status bar on top when sideways, so the sideways water and menus keep clear of it). Effective sizes to check: sideways 648–864 × 540 (Fold 648, iPad Pro 13 720, iPad 11 777, iPad mini 822, Galaxy Tab 864), upright 600 × 720–960. Test in a desktop browser with `?test&tabletview` at those sizes.

**The Dock is laid out exactly like the aquarium (director: "the dock reworked and organized exactly like the aquarium").** `src/mobile/page_home.js` reuses the aquarium's classes (`aq07-*`), so both pages share one look and one set of checks: the live dock view fills the page, a strip under it (Cozy, Bonus, Placed, Options), and an Options panel with two tabs (Your <home>: wood, style, light / hull, your docks; Decorations: small cards, tap to try or place, Buy / Stop in the strip while trying). The view keeps the dock's zoom whatever the space (canvas 900 wide, height from the space), never blinks on re-render, and rebuilds on turning. A change to one of the two pages must keep them matching.

**Every page follows the aquarium / Dock organisation (director, 2026-11-18: "Docks and aquarium are pinnacle layouts... update every tab to the new standard organization and performance"; "players on mobile have to think too hard to find things. That's unacceptable").** `src/mobile/pages08.js` is one engine using the aquarium's own `aq07-*` classes:
- **Page with a picture** (Aquarium, Dock, Wardrobe): the live view fills the page, a strip under it (key numbers + Options), an Options panel with the sections as tabs over one scrolling body.
- **Page without a picture** (Cooler, Waters, Tackle, Rods, Skills, Paths, Bounties, Tide Pass, Feats, Events, Fish Log, Pets, Trophy Room, Boardwalk, Settings, Stats, Save): a summary strip on top (the page's key numbers and its main action, e.g. Sell all, Reset skills), then the sections as tabs over one scrolling body; the page never scrolls. Sideways: summary + intro on the left, sections on the right.
- **Finding things:** every page shows its key numbers and main action first, its sections as tabs at the top (up to 4 in a row, 5-6 in rows of 3), long pages are split into sections (Bounties is one list without tabs since 2026-11-27; Events: Calendar / Challenges / Derby), and badges show where a reward is waiting.
- **Place kept:** a refresh of the page you are on keeps the scroll (restored once, after the page is built); opening a page or switching section starts at the top.
- **A new page** must get an entry in `CFG` (cells, main actions, sections if long). Test: the sweep clicks every section tab of every page (scroll top and bottom).
- **Speed rules learnt:** never set `scrollTop` while a page is being built (it forces an extra layout: Fish Log 56 → 90 ms); restore in a microtask. Pictures off screen are drawn after the page shows (Pet Customize preview, Dock decoration cards, aquarium decorations).

**Phones are landscape only, iPhone AND Android (director, 2026-11-18).** `src/mobile/landscape08.js`: a phone (iPhone, or Android with a shorter screen side under 600 pt) held upright shows the full "Turn your phone sideways" screen and pauses the game; it uses the device's orientation, so split-screen windows are not interrupted; on Android, full screen also locks the screen to landscape. Tablets keep both orientations. Upright layouts now serve tablets and split-screen windows only.

**Top bar (sideways): one flex row** (`src/mobile/header08.js`). Chips at their natural size, spare room shared evenly; never a second row. Contents: Coins, Level, Fishing at, **Goal** (compact: "1/8 species", "Open Stonebrook", "Cooler full"; gold when ready; tap = the exact page and place), **Live** (only while an event or challenge runs; tap = Events), **Bounties** (how many are ready to claim, else how many wait at this water; tap = Bounties; called Tasks until 2026-11-27), **Tide Pass** (level, gold when a reward waits; tap = Tide Pass), Cooler, Aquarium, Fish Log, search, settings. When a narrow phone runs out of room, Tide Pass hides first, then Bounties, then Live shortens and hides; last of all (2026-11-20, #155) every chip trims its side padding to 3 px (`.mb-compact`) before any word is cut; the info box never squeezes its words. Upright (tablets): Goal (+ Live) on the second row.

**Your home shows the real home of every water** (`src/mobile/page_home.js`): the live scene of the current water (dock, pier, boat, trawler, raft, ice camp, beach, stone ledge, crystal shelf), cropped on the angler and home below the weather label, 30 fps while the page is open (menus otherwise pause the scene). Options per water from `HOME_FEATURES` (wood / style / hull / light); headings say "Your boat", "Your homes".

**Colour choices** are round 32 px swatches with the chosen name in the heading ("Light · Golden"); the name stays as the button's label (screen readers, contrast check). Notes and descriptions: one short line in the description colour.

**Fish fight on phones** (`src/mobile/fight08.js`, director: "too hard to watch on top of watching your line breaking"): everything at the fish. A tension ring around it (green / yellow / red, shakes and glows near breaking, red zone marked), the instruction right above it, a small card with distance, Fight, Temper and line out; a soft light under the fish. No meter at the far edge, no corner panel. The card and words stay inside the water, clear of the corner buttons.

**Top bar vs side panel (director, 2026-11-18):** things you check or use while fishing live in the top bar and open only from there (Cooler, Aquarium, Home, Bait, Fish Log, Bounties); the side panel holds the menu sections (Quests, Waters, Upgrades, Collection, Stats, Challenges, Customize, Prestige). Never both. Every page tab has a line icon (no squares).

**Menu pages sideways (director: "so much empty space wasted"):** pages without a picture never spend a side column on a few numbers: numbers go in one slim strip on top, content gets the full width, and section tabs carry a badge only when it means something to do (Skills: none; skill points are the badge).

**Mountains on phones** (`src/mobile/scene08.js`): never paint scenery as many thin side-by-side strips; Safari on iPhone can leave seams between them. Paint one shape with a gradient instead (also far cheaper).

**Words:** on phones, text about any water says "home", not "dock" (`DEDOCK` in pages08: Home page, feats, Tide Pass rewards, notices, Search). Item and flavour names stay ("Dock Gnome", "a dock regular").

**Scene cost budget** (desktop, phone layout, measured per water × weather × day/night with `__findWx` + `__drawCost`): 1–4.5 ms; phones lower the picture's sharpness automatically when frames drop (perf_round6). Re-measure after any scene change. Starfall storm was 6 ms; the colour helper cache (perf07) brought it to 2.9 ms.

**Turning the phone:** a 500 ms size check sends a missed resize (some iPhone Home Screen apps and the test browser skip it), so the layout always switches after the turn screen.

**Screen shapes, not pixel sizes (director, 2026-11-18, Android + Apple guidance).** Driftline lays out in CSS points (iOS points / Android dp), never device pixels; device pixel ratio only sets how sharp the canvas is drawn.
- **Which layout a screen gets** (decided by shape, `ay_phone035` + `bj_polish036`): any window up to 700 pt wide that is not a short sideways screen → upright phone layout (`phone-app`; includes split-screen, pop-up windows and very tall 21:9 phones); sideways and at most 560 pt tall → sideways phone layout (`phone-land`); tablets, iPads and unfolded foldables → the phone layouts scaled up (see "Tablets and iPads" above).
- **Range to test:** tall phones 19.5:9 to 21:9 (360×840, 393×852 … 440×956 and sideways), split-screen (e.g. 440×460), and at the other end 4:3 / 3:2 tablets (820×1180, 1180×820) and foldables. Nothing may scroll sideways or fall off screen at any of them.
- **Safe areas:** the scene renders inside its frame; every button and text stays inside `env(safe-area-inset-*)` (see above). Never put tap controls right against the bottom edge (home bar / gesture bar).
- **Touch targets:** Apple asks 44 pt, Android 48 dp. Phone controls are 32–40 pt today (`MB_UI`), chosen to fit the dense rows; growing them (or extending their invisible tap area where rows have room) needs the director's call.
- **Render scale:** phones draw the canvas at a capped pixel ratio that steps down automatically (2 → 1.15) when frames drop (`perf_round6`), so UI text stays sharp while the scene protects frame rate and heat.
- **Fairness:** a wider or taller screen must not show more of anything that matters to play (fish, hotspots, bites). Not yet measured across screen shapes.

**Release order:** see "The round checklist" and "Publishing" in CLAUDE.md (the one place for process).

## Shared across platforms
- **Shared look:** the same colour language everywhere. Rarity colours come from `RAR`. Gold means rewards, teal means actions, red means warnings.
- **Copy:** plain, short, friendly words with a light cozy humour; never jargon.
- **Rewards and data:** worked out once in the shared core, so every platform shows the same numbers.

**One place for each thing (director, 2026-11-18: "things that appear in multiple locations... tabs, headers").** A tab, section or summary value appears once per screen. Settings and Save are separate tabs (no Save section inside Settings); a page's summary strip and intro never repeat each other; the menu top row's coins are not repeated in a page summary. Shortcuts in the fishing top bar (Cooler, Aquarium, Fish Log, Tasks, Tide Pass, Level → Stats) are status + quick opens by design. Stats has its own side-panel button (director: "makes no sense to be in collection"); the settings gear holds Settings and Save.

## Content standard (all platforms; director approved 2026-11-20)
What goes *inside* cards and pages. The frame rules above say how big the boxes are; these say what the boxes must hold. Checked by `window.__contentQC()` in test builds (see "The check" below). A new page or card gets its empty, full and extreme look written here (or in its feature's notes) **before** it is built.

1. **Nothing is ever cut by a box edge.** Every text has one declared behaviour:
   - **Names** (fish, oddities, baits, pets, waters, items) on cards wrap to at most 2 lines.
   - **Names in buttons and chips:** one line; shrink to 12 px at least, then end in "…".
   - **Sentences and descriptions** wrap freely; text never sits in a fixed-height box.
   - Anything shortened with "…" shows in full where you tap into it.
2. **Numbers fit at their biggest.** Up to 99,999 in full (`fmt`); above that the short form (5.38M, `fmtShort`) on cards and chips, the full number in details. Prices and fees are round (`niceNum`). Every number box fits the biggest value the game can reach.
3. **Every list, page and card has a designed empty look:** one line saying what goes here and how to get it, plus the card's picture if it has one. Never a blank box and never a shrunken page.
4. **Cards in a group match:** if one card in a group has a picture, every card in the group has one, in every state (idle, empty, playing, result). A PC card with no room for its picture is listed here with the reason.
   - *Exception (approved 2026-11-20):* PC Boardwalk › Fishmonger's Gamble has no idle picture (the card is full; a picture pushed the message out).
5. **Content stays inside its card:** nothing overlaps another part or spills past the card's edge. On phones, after you act on a card its result and its main buttons are visible together without scrolling.
6. **Alignment:** results and messages line up with the controls under them; centred text only for pictures and single big numbers.
7. **Sizes it must hold at:** PC 1920×1080 (the director's), 1440×900, 1024×640; phones 956×440 (the director's iPhone), 915×412 (Cam's Pixel), 667×375, split-screen 440×460.
8. **New things follow it from day one** (rule above the list).

**The check:** `window.__contentQC()` (test builds) opens every page and tab and looks for: text cut by its box (no "…"), parts spilling out of their card, parts overlapping each other, cards with nothing in their body, and card groups where some cards have a picture and others don't. Run it at each size in rule 7 with three saves: **empty** (a brand-new game), **normal**, and **extreme** (`__contentQC({extreme:true})`: the longest name in every list, the biggest numbers, a full cooler, everything owned; the save is put back afterwards). It was proven on known bugs before use (see docs/LESSONS.md).

## Fish decorations: none (director, 2026-11-22)
Fish wear no water costumes (the ears, ties, circuits, toppings, headdresses, ankhs and laurels of `cq_traits.js` were removed: "I don't like the idea of adding the custom map apparel to the fish. This is bad design"). A fish is drawn as just the fish: its family's body, fins, head, pattern and colors (`fishDesign` in `i_fish.js`). Rarity marks (the legendary crown, shiny glow) stay. Proposing any decoration on fish again is a look call for the director.
