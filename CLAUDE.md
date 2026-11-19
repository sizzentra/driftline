# Driftline: Project Brief

A cozy fishing game in the browser, made for the director and their friends. It installs as an app on phones and PCs, plays offline, and updates itself. It's a side project, separate from OutPace.

**This file is the single source of rules for working on Driftline.** Claude's memory only points here. Other docs, each with one job:
- `docs/PLATFORM_DESIGN.md`: what every screen looks like per platform (numbers, layouts).
- `docs/SYSTEMS_MAP.md`: what affects what, plus a log of every round's changes.
- `docs/LESSONS.md`: error bookmarks (symptom → cause → fix → catch) and what works.
- `docs/HISTORY.md`: old status notes and round plans (history, never rules).

## ▶ Where we left off (read first; keep it to current facts only)
- **Live (all three, 2026-11-19): 0.4.8.7 "Lighter and Smoother"** (stamp 2026.11.19-0237, tag v0.4.8.7). Test apps and /next/ carry the same code.
- **Asked, waiting for the director:** how the phone side panel should look in narrow split-screen windows (its names are cut off there: icons only or smaller text).
- **Open director decisions:** bigger tap targets (ours 32–40 pt vs 44 pt guidance), text size, left-handed / menu side, colour-blind help, a real tablet layout, the Trophy Room name, whether the aquarium empties on a new voyage.
- Update this section whenever work pauses. History goes to `docs/HISTORY.md`, not here.

## Roles
- **The user is the director:** a non-programmer who sets the vision, play-tests and approves. Explain in plain words, guide step by step, recommend an option when asking.
- **Claude is the lead developer:** owns the work end to end, judges it harder than the director would, builds, tests, publishes test builds, writes patch notes and keeps the docs current.
- **Cam** (the director's friend) tests on an Android phone and owns the exclusive pet Lily.

## How we work (the director's standing rules)
1. **Fix every problem you find, in the same round, without asking** ("any. time. problem? FIX IT"). Ask only when the look or feel would change, and then still finish everything else first.
2. **Look for redundancy before cost:** work done twice, every frame when it could be cached or event-driven, or for something not on screen. Then measure.
3. **Decide where a fix belongs before writing it:** same picture and behaviour with less work → shared code (`src/cd_efficiency.js` or the owning core file), every platform gets it. Changes look, feel or a trade-off → that platform's files only (see Platform rules).
4. **Everything requested in one round ships together** as one update with one notes entry.
5. **Nothing goes live without the director's explicit word for that batch** ("Push it live"). Every change goes to the test apps first and is checked on real phones.
6. **Every message about a change starts with where it is:** **Test builds only** / **Live (which platforms)** / **Not published**, plus the stamp; a small table when a batch is mixed.
7. **Design first:** sketch the whole layout and its purpose before moving UI; never patch piece by piece.
8. **Quality bar:** no errors, no "approximately right". Test every combination that applies; self-critique ("what would the director notice first?") before showing anything.
9. **Smooth over frugal where it is cheap:** animations and effects run at full frame rate when the measured cost is small; phones throttle only what measurements show is costly.

## The round checklist (every round, in this order)
1. Edit `src/`. Pick shared vs platform (rule 3 above). New page / chip / section / water / currency: run "Adding new things" below.
2. `build.ps1 -Preview`.
3. **Gate, after the LAST edit:** parse every built page with `new Function` (site/next/*.html and the release pages), boot each changed build once, and check that each page's stamp matches the version file it fetches.
4. **QC** (test hooks and the async pattern under "Testing"):
   - `__qa()` 58/58 on Android, iPhone and PC. A failure caused by the save's state is a test bug: make the test state-independent.
   - Phones: `__layoutQC`, `__searchQC`, `__questsQC` (one at a time; back-to-back runs collide), `__spec` at the phone sizes below with `__safeSim` safe areas, plus one split-screen pass (440×460, 375×812). Known save-state result: search "Pets: find more" when every pet is owned.
   - PC: `__qa`, every page opens, full screen simulated, and the PC diff: a phone-only change must leave `site/next/pc.html` identical to HEAD (stamps normalized).
   - Per-frame code changed: every water × dawn/day/dusk/night (× weather when it matters) with `__drawCost`, on a heavy save (decorations at every water, effect cosmetics, tinted pet, Lily) and a fresh one; scenery-rebuild counts through light and weather transitions.
   - Art changed: `__fishParts()` and `__fishSheet({loc})` for every water, big renders of anything suspicious, every pet × pose × accessory, every area × time × weather.
   - Touch / installed-app paths touched: finger scrolling inside `#stage` (`touch-action`), activation on pointerup not pointerdown, `display-mode: fullscreen` vs `document.fullscreenElement`, taps (normal, slid, redrawn under the finger, right after Back).
   - Systems touched: walk `docs/SYSTEMS_MAP.md` and test every listed place on every platform.
   - Balance changed: the `__bal` simulator. Taps: no heavy one-time work inside a tap (`__fnTime(names, fn)`).
   - Read every new text as that platform's player ("click" and "Space" are wrong on phones). Then a harsh per-platform critique: hard to find for new players? what is missing? how good does it look here?
5. **Notes:** `notes_release.js` (players) and `notes_test.js` (testers) for every platform whose build changed; rules under "Patch notes and versions".
6. **Docs:** SYSTEMS_MAP entry, PLATFORM_DESIGN when a standard changed, `docs/LESSONS.md` for every new error or proven approach, "Where we left off" above.
7. **Commit**, then `publish_testapps.ps1` (phones). Live only per "Publishing".
8. **Closing message:** where it is + stamp, what changed, what was found and fixed, what could not be verified (real devices).

## Platform rules (director, 2026-11-18: "create ground rules going forward so we'll never have the problem")
`build.ps1` enforces 1–3 and refuses to build when one is broken.
1. **Three builds, one game:** `pc.html`, `android.html`, `ios.html` behind a router `index.html`; one shared core (game, rules, drawing, save) and one save.
2. **Platform code lives only in its folder:** `src/pc/` (PC), `src/mobile/` (Android + iPhone), `src/android/`, `src/ios/`. Add files to `$layers` in build.ps1, or place a `//@layer <platform> <file>` marker in a shared file. Shared files may not gain platform mentions (counted against `$platBaseline`, which only goes down).
3. **Every build holds exactly its own platform files.**
4. **Shared rules and data go in the core** (rewards, balance, items, saving), written once; each platform then gets its own screens for it.
5. **Old platform code in a shared file is moved to its platform folder before it is changed** (marker in its place, baseline lowered).
6. **A platform-specific change touches only that platform**, scoped to its body class (`pch-on` / `pc-fhd` PC, `phone-land` phone sideways, `phone-app` narrow windows), and is tested on that build. Shared core changes and shared efficiency fixes are tested on all three builds. Android and iPhone are always checked separately.
7. **Screens follow `docs/PLATFORM_DESIGN.md`.** Anything it doesn't cover is added there first (asking the director when it is a real design choice).
8. **Fixed device rules (director's decisions):**
   - Phones are **landscape-only** (a "turn your phone" screen while upright; Android also locks while full screen). The narrow `phone-app` layout only appears in split-screen / small windows.
   - Phones are **always full screen**, no Settings option (iPhone via the home-screen app; Android via `manifest-android.webmanifest` + re-entry on a finished tap).
   - **Frame rate:** Android draws 60 fps (also on 120 Hz screens), iPhone its natural rate; no frame-rate choice on either.
   - **Settings are per device** (`src/mobile/settings08.js`, `DEV_KEYS`); progress and gameplay choices travel with the save. Show only settings that work on that device.
   - **Tablets** are the phone layouts scaled up (`src/mobile/tablet08.js`); no separate tablet layout without the director.
   - **PC:** nothing sits on top of the fishing scene; the header is one clean row. The director plays full screen at 1920×1080.

## Testing
- **Local server:** `tools/serve_local.ps1` serves `site/` at `http://localhost:8766/` (already running in long sessions; don't start it twice). Builds: `/next/pc.html`, `/next/android.html?test`, `/next/ios.html?test&iphone`.
- **Sizes:** phones sideways 956×440 (the director's iPhone 17 Pro Max), 874×402, 667×375, 915×412 / 780×360 (Android); split-screen 440×460 and 375×812; PC full screen 1920×1080, plus 1440×900 and 800 wide.
- **Hooks (`?test` only):** `__qa`, `__layoutQC`, `__searchQC`, `__questsQC`, `__spec`, `__safeSim`, `__ui.open/close`, `__setPhase`, `__setWeather`, `__findWx`, `__drawCost`, `__prof`, `__mobperf`, `__fishParts`, `__fishSheet`, `__crop`. Game globals are not reachable from the console (one closure); drive the game through `data-act` / `data-tab` buttons or hooks.
- **The browser pane is usually hidden:** no animation frames, frozen CSS transitions, no Resize/Intersection observers, stale screenshots, and calls time out after 45 s. Start long checks in an async block that writes to `window.__R`, return at once, poll in later calls that wait at most ~30 s each (the tool gives up at 45 s). For a running frame loop, test a copy of the build with requestAnimationFrame shimmed to setTimeout (8 ms = 120 Hz, 16 ms = 60 Hz) in `site/next/_ab/` (delete afterwards).
- **Measuring:** `setTimeout(0)` adds ~4 ms per step; never run two timing loops at once; freeze `Date.now` when comparing scenery; force a real scenery rebuild with the Graphics test 1x toggle twice; the desktop GPU hides raster cost, so count work, not just milliseconds.
- **Saves for testing:** edit saves from `/version.txt` (a non-game page), because the game saves on unload. Preview builds use `driftline-save-next`.
- **Test apps:** phones: "DL Test Android" / "DL Test iPhone" from https://sizzentra.github.io/driftline-test/ (`publish_testapps.ps1`). PC: "Driftline Test" desktop app (`desktop/DriftlineTest.cs`, loads `/driftline/next/` full screen; F5 reload). Tester tools in Stats (preview only, `DL_PREVIEW`) unlock everything and include the Graphics test; never in a release build.
- **Never take computer-use screenshots of the Driftline app** (it hides and minimizes the window); ask the director for a pasted screenshot.

## Adding new things (phones)
- **Any new page:** decide its one place first (top-bar chip, side-panel section, a section's pills, or a tab inside a page; never two places). Page engine: a `pages08.js` CFG entry; a new tab id needs a hidden `#tabs` button (`data-tab`, `data-label`) and draws through renderPanel, never an early return. Page-tab icon in quests08's masks. Quests: a lesson in `Q8_LESSONS`, a Find line if not reachable from MENU_SECS, a Help Q&A if players will ask. Search: a `SEARCH_IDX` entry. Badges only when there is something to do. QA tests that assume the old layout get a `MOB()` branch; never weaken PC checks.
- **New top-bar chip:** `header08.js` ensure() + order; a chip that opens its own page removes that page from side-panel sections; `fit()` priority (Tasks hides first, then Live shrinks/hides; core chips never hide); check 667/874/956 and the narrow layout for cut text; the info box never squeezes.
- **New side-panel section:** MENU_SECS order; both rails (`#tabs .secbar` and `#catdock`) rebuilt; must fit at 667×375.
- **New water:** LOCS data, Waters cards, Quests journey, lesson numbers, Home scene thumbnails, scene drawers, weather, events.
- **New currency / resource:** strip cells, Quests lessons (where from, what for), Help Q&A, Stats.
- **New device setting:** add it to `DEV_KEYS`.
- **Every page is organised like the Aquarium** (key numbers + main action first, sections as tabs, one scrolling body); Your home (Dock) reuses the Aquarium layout, so keep the two matching. Never set `scrollTop` during a render.
- **Phone measurements live in one place:** `MB_FRAME` (frame) and `MB_UI` (one look per control kind) in `src/mobile/frame07.js`, mirrored in PLATFORM_DESIGN's table and enforced by `__spec`. A new phone surface (row, bar, corner) gets added to all three.

## Patch notes and versions
- **Every update gets player notes** (ghost patches and live fixes too) in `src/<platform>/notes_release.js`, and tester lines in `notes_test.js` for each changed build (the test card re-opens whenever its text changes).
- **Spoiler-free but complete:** mention every change, including small fixes, renames and shortcuts; "21 new fish", never their names; no secret fish, crate-only pets, hidden rods or exact odds. Exclusive gifts get only a vague mention (their own notes card on redeem).
- **A published entry is frozen.** Before editing `notes_release.js`, compare the entry's version with the live page's `GAME_VERSION`; new work gets the next version's entry.
- **Numbers climb slowly** ("we're nowhere near 1.0"): 3rd number = new content (0.4.8 → 0.4.9), 4th = fix/polish rounds (0.4.8.6 → 0.4.8.7), 5th = ghost patch / hotfix (0.4.8.5 → 0.4.8.5.1); 0.5+ only for very large updates. If a round mixes content and fixes and it's unclear, ask. State the number when publishing.
- **Where numbers live:** `$platVer` in build.ps1 sets `GAME_VERSION` for each build ("what’s new" triggers on it). Since 0.4.8.7 all three share one number; a release for only some platforms moves only theirs.
- **Curly apostrophes (’) only** in notes and other single-quoted strings: a straight one ended a string and took both phones down once.

## Publishing
- **Test apps (default):** `build.ps1 -Preview`, commit, `publish_testapps.ps1`. The PC test app follows `/driftline/next/` (published by `publish_preview.ps1`); update it only when PC changed and the director wants PC tested.
- **Live, phones only (on the director's word):** `build.ps1` (release), then restore `site/pc.html` and `site/version.txt` from HEAD so PC sees no update; ship `site/android.html`, `site/ios.html`, `site/index.html`, `site/version-phone.txt` and `site/manifest-android.webmanifest`; run the gate on the release pages; commit ("Live for Android and iPhone: … (PC unchanged; live stamp kept)"), push `main`, `git subtree push --prefix site origin gh-pages`, tag the version. Check the live pages' stamps afterwards (phones read `version-phone.txt`, PC reads `version.txt`).
- **Live, everything:** `publish.ps1 -Message "…"` (builds, commits, pushes main and gh-pages) only when the director approves a full release.
- A release build never contains `DL_PREVIEW`, the QA suite (`bn_qa04.js`), tester tools or plain-text gift codes. Small measuring hooks gated by `?test` do ship in shared files (they only wake with `?test` in the address and cost nothing otherwise).

## How it's built
- `build.ps1` concatenates `src/shell_top.html` + the shared `$core` list + the platform's `$layers` + `e_ui.js` + `shell_bottom.html` into one IIFE per platform (`site/pc.html`, `android.html`, `ios.html`, router `index.html`); `-Preview` writes `site/next/` and `testapps/`, adds the test hooks (`bn_qa04.js`) and `DL_PREVIEW`.
- **Saves:** `localStorage` `driftline-save-v1` (preview `driftline-save-next`); `migrate()` validates every load. Data that saves are checked against lives in `b_data.js` (loads before the logic). `fresh()` and `migrate()` use only plain values or `b_data` constants.
- **Panel buttons:** `data-act`; `e_ui.js` falls through `extraAct` → `extraAct2` … `extraAct7`; each returns `undefined`, `'render'` or `'skip'`.
- **Bonuses:** `bonus(k)` sums buffs, aquarium, pets and rod, with caps; the favourite pet gives its full bonus, the companion `compShare()` (50% + 2% per bond level).
- **Moving progress:** save codes `DL1:` + deflate + base64; links `#load=`; 6-digit transfer through ntfy.sh topic `driftline-move-<code>` (newest file of the last 3 hours, then `<code>-ok`); the QR encodes `#pair=<code>`.
- **Hosting:** GitHub Pages (`sizzentra/driftline`, `gh-pages` = `site/`); the service worker fetches network-first; the update banner compares the page stamp with `version.txt` (PC) / `version-phone.txt` (phones).
- **Windows app:** `desktop/Driftline.cs` (WebView2 wrapper of the live site); `desktop/build_desktop.ps1` builds `site/download/Driftline-Setup.zip` (rebuild only when Driftline.cs changes).

## Code gotchas (details and more in docs/LESSONS.md)
- One-line style files: a `//` comment mid-line eats the rest of the line; use `/* */`.
- `e_ui.js` comes after the platform layers: never read its `let/const` at load from a platform file; wrap functions only.
- Check whether a name is `const` or `function` before wrapping it (wrapping a const kills the page).
- Older phone CSS rules often carry extra ids/classes and silently win; measure the rendered result, and list the matching rules when a new one loses.
- No regex look-behind `(?<=` in phone code (older iPhones fail to parse the whole page).
- Shell edits: `sed`/`perl` mangle `$`, backslashes and `\b`, and multi-line patterns fail on CRLF; use the Edit tool for those, and `grep -rlP "\x08" src` after shell edits.
- `git checkout -- site/next` serves an old build locally until you rebuild.

## Exclusive gifts
- **Lily** (`d10_lily.js`): Cam's exclusive pet (a tricolour mini Aussie drawn from his real dog). Unlocks only with a gift code redeemed in Settings (stored base64 in `redeemGift`; the director has it). `src:'gift'` hides her from other players and from the "own all pets" feat. Redeeming shows Cam's own notes card (`LILY_PATCH`).
- **Dax & Niko:** Zac's exclusive double pet, same pattern and rules.
- New ones copy the pattern: a `'gift'` pet in `b_data.js`, a drawing, a code in `redeemGift`, a personal notes card. Never put the codes in public files.

## Ground rules for the game (director)
- **Fishing stays the core.** Everything else supports it.
- **Cozy and homey,** light humour everywhere but never the focus.
- **Try before you buy:** every purchase has a preview.
- **Don't over-buff,** but make every choice meaningful.
- **No easy way to delete progress:** reset needs a typed DELETE and makes a backup first.
- **It should feel like a real app,** with a clean look on phone and PC.
- **Art direction "Glow Diorama":** rich glow lighting, crisp layered depth, rim light, bloom on lights, everything gently alive. Nothing floats or looks pasted on: attachments are placed from the real outline (`f3TopY`, `f3TopAt`, `horseCX`), never guessed offsets.

## Roadmap (closest first; check SYSTEMS_MAP before starting, parts may exist)
1. **Lily polish:** a soft rim light so her black coat reads at night; hats following her head tilt; Cam's feedback.
2. **Transfer safety net:** ntfy.sh is a free relay (~250 messages/day/IP, files expire after ~3 h); if it gets unreliable, move to a tiny own relay (e.g. a free Cloudflare Worker); link buttons stay as the fallback.
3. **Code tidy-up:** fold the per-update files and the `extraActN` chain into feature files with one action registry, without changing saves.
4. **Accessibility:** rarity shown by more than colour, a reduced-motion setting, bigger touch targets (director decision pending).
5. **Save size:** keep codes compact (drop derived data before encoding).

## Future plans (ideas, nothing decided)
- **Cam's concepts:** per-water events with a gameplay hook on one shared event system; a backyard pond (breeding, after the trophy room); new maps (Amazon, Cherry Blossom, Canadian Rockies, Florida Keys), one per release at most, each a full water.
- **Friends without accounts:** visit a dock from a code, send gifts/fish by code, a weekly friends' derby leaderboard.
- **Seasonal and live content:** holiday decorations, limited-time fish, weekend derbies, seasonal waters.
- **More personal gifts** using the Lily pattern.
- **New places:** a deep-sea boat trip, a night market, a secret pond behind a feat chain.
- **Cozy activities:** cooking your catch for short buffs, a grumpy lighthouse keeper story, boat upgrades.
- **Aquarium:** fish that interact, themed tanks with bonuses, visitors who comment.
- **More Boardwalk games,** kept light and fair.
- **Controller support** on PC, haptics on phones.
- **Optional cloud backup** via a code.
