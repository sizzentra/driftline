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
- Tap targets are at least 44 px. No hover effects on touch screens.
- Menu taps act when the finger lifts.

**Upright**
- The game fits one screen: the water stays fixed and the page scrolls inside its own area.
- The category bar sits under the water.

**Sideways**
- The categories sit in a rail on the right, both on the water and in menus.
- Short screens get compact top-bar chips.

**Forms**
- Labels sit above fields.
- Tabs that don't fit scroll sideways in one row instead of wrapping.

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
| Corners of the water | top left = status corner (time + weather chip, then boost timers, then the weather note); bottom left = Rest and Bait buttons; nothing drawn on the water may sit under a button | same |

**Taps:** every button you can see must take the tap: nothing (no layer, label, guard or fade) may sit on top of its middle. A guard against a phone's follow-up tap covers only the spot under the finger, never the whole screen.

**The check (required before anything goes to the test apps or live):** `window.__spec()` in a test build (`?test`) measures the screen you are on against these numbers and lists every break, including covered buttons and the status corner reaching the Rest button. Run it on the water and on every menu page (scrolled top and bottom) at every phone size below, on BOTH the Android and iPhone builds; it must return nothing. `__qa()` and `__layoutQC()` must also pass.

**Phone test sizes:** upright 375×667, 390×844, 430×932; sideways 667×375, 734×360, 844×390, 932×430 (the director's iPhone is 932×430 sideways). iPhone with `?test&ios`.

**Release order (director's QC rule):** fix → `__spec` + `__qa` on both phone builds → phone test apps (`publish_testapps.ps1`) → the director checks them on real phones → only then live, and only when the director says so.

## Shared across platforms
- **Shared look:** the same colour language everywhere. Rarity colours come from `RAR`. Gold means rewards, teal means actions, red means warnings.
- **Copy:** plain, short, friendly words with a light cozy humour; never jargon.
- **Rewards and data:** worked out once in the shared core, so every platform shows the same numbers.
