# Driftline platform design standards

What every screen looks like on each platform. New screens follow these rules; anything they don't cover is added here
first (asking the director when it is a real design choice). Platform ground rules live in CLAUDE.md.

## PC (src/pc/)
The director plays full screen at 1920×1080. The full-HD layout (`body.pc-fhd`) switches on at 1800×950 and up; smaller PC
windows use the regular PC layout (`body.pch-on`).

**Frame**
- **Header:** one row, always the same size and always visible, including while a menu is open. Menus open below it and nothing shifts.
- **Header buttons:**
  - Teal (`#1f8a86 → #14666a`, border `#7fe3c4`) means "click me". Gold (`#ffe08a → #f3b94e`, dark text) means "open now".
  - Clicking a lit button closes its page again.
  - No shape indicators (no chevrons or ✕): colour alone shows state.
- **Sections:** Fishing, Upgrades, Collection, Challenges, Boardwalk, Customize.
- **Pages reached from header buttons:** Cooler, Aquarium, Fish Log, Stats.
- **Every page lives in exactly one place.** No name is shown twice on one screen.

**Size**
- One fixed size on every page: no automatic zoom. Text and headers never change size between tabs.
- Everything fits one screen. Long lists scroll inside their own box; the page itself doesn't scroll.

**Layout patterns** (the Fish Log is the reference the director called "almost exactly what we're looking for")
- **Browse pages:** left rail of filters with progress bars, even cards in the middle, details of the picked item on the right. Used by Fish Log, Pets, Oddities and Feats.
- **Workspace pages:** a preview on top, then two side-by-side boxes that scroll on their own. Used by Aquarium and Dock. Wardrobe uses rail | preview | option cards.
- **Data pages:** even columns that end on the same line. Used by Stats and Events.
- Cards in one grid are all the same size. Section titles are small uppercase labels (gold for card titles, grey-blue for rail labels).
- **Column boards always line up in rows** (director, 2026-11-18: "make that a priority even when making changes"). Skills is the example: the columns share one grid (`subgrid`), so card N of every column starts at the same height. Never let columns stack independently.
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
| Second row | top 46 (water: location + goal; menus: page tabs) | none: page tabs sit in the top row, height 38 |
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
| Badge (every count: bottom tabs, rail, page tabs, section tabs) | 18 px, 10.5 px bold | same |
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
| Pixel 9 / 10 | 412×915 | 0 → cutout 32 on one side |
| Galaxy S24 / S25 | 360×780 | 0 → cutout 32 on one side |

Run `__spec` at each, upright and sideways, with its safe areas simulated. The older small sizes (375×667, 667×375, 734×360) no longer have to pass. iPhone with `?test&ios`.

**Speed:** a menu page must open in about one frame's budget on top of building the page. Never paint or build what is not on screen when a page opens (e.g. the Aquarium's 45 hidden decoration pictures are painted in small batches right after it shows), and never do heavy one-time work inside a tap (the music and ambience buffers are built 0.4 s after the first tap; the tap only unlocks audio). Measure with `__fnTime(names, fn)`.

**Release order (director's QC rule):** fix → `__spec` + `__qa` on both phone builds → phone test apps (`publish_testapps.ps1`) → the director checks them on real phones → only then live, and only when the director says so.

## Shared across platforms
- **Shared look:** the same colour language everywhere. Rarity colours come from `RAR`. Gold means rewards, teal means actions, red means warnings.
- **Copy:** plain, short, friendly words with a light cozy humour; never jargon.
- **Rewards and data:** worked out once in the shared core, so every platform shows the same numbers.
