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

**Phone tests:** 375×812 upright and 734×360 sideways; iPhone with `?test&ios`.

## Shared across platforms
- **Shared look:** the same colour language everywhere. Rarity colours come from `RAR`. Gold means rewards, teal means actions, red means warnings.
- **Copy:** plain, short, friendly words with a light cozy humour; never jargon.
- **Rewards and data:** worked out once in the shared core, so every platform shows the same numbers.
