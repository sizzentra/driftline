# Driftline: Project Brief

A cozy fishing game in the browser, made for the director and their friends. It installs as an app on phones and PCs, plays offline, and updates itself. It's a side project, separate from OutPace.

**Sessions start in this folder (`C:\Users\sizze\Driftline`), never in OutPace's** (director, 2026-11-19): a mixed session loads OutPace's long rulebook and Driftline's rules slip. Driftline has its own memory; one round per session.

**This file is the single source of rules for working on Driftline.** Claude's memory only points here. Other docs, each with one job:
- `docs/PLATFORM_DESIGN.md`: what every screen looks like per platform (numbers, layouts).
- `docs/SYSTEMS_MAP.md`: what affects what, plus a log of every round's changes.
- `docs/LESSONS.md`: error bookmarks (symptom → cause → fix → catch) and what works.
- `docs/PLAN.md`: the active work list.
- `docs/HISTORY.md`: old status notes and round plans (history, never rules).

## ▶ Where we left off (read first; keep it to current facts only)
- **Live (all three, 2026-11-19): 0.4.8.9.2** (stamp 2026.11.19-1022, tag v0.4.8.9.2): batches 1 + 2 + hotfixes (menu rail safety net; oddity/hat fights no longer blank the scene). **Bugs first, always** (director): fixes for live players ship as hotfixes built from the live tag (a worktree at the tag + only the fix) as soon as they pass QC.
- **Test builds 2026-11-19 stamp 1531: outsider QC round 2 done (Tide Pass picture showcase + Wardrobe tab, Paths two columns, round fees, full-width Boons, end-game waters heading, PC Waters buttons aligned, phone Bait chip crush fixed; QA 96/96 PC 1920+1440, Android, iPhone; all phone sweeps clean). The Bait chip crush is also on live phones: hotfix candidate.**
- **Test builds 2026-11-19 stamp 1710, code cleanup round (director: "What do we do when there's a problem? Do we fix it?"):** 32 dead functions removed (~260 lines, ~40 KB per build) and a build rule now refuses new ones; `__ui.open` test hook calls the live menu; `fight()` guard; aquarium draw order cached. QA 96/96 on all builds, sweeps clean. **Open:** drawing the aquarium fish costs roughly 0.5 ms per fish in a forced-sync test (24 fish ≈ 10 ms over an empty tank); real-frame cost on phones not measured yet (the browser pane was hidden). The fix (cached tail-wag frames per fish) changes the animation slightly, so it needs the director's eye.
- **Live: 0.4.8.9.3 hotfix (2026-11-19, stamp 1402): Waters strength line wraps on phones (patched straight into site/*.html: the v0.4.8.9.x tags contain 0.4.9 work, see LESSONS).** **Test builds: 0.4.9, the whole big patch is in (2026-11-19, part 3; then real aquarium sizes + depth, hair rebuilt (ct_hair.js), build silhouettes):** batches 3–5 complete plus the director’s additions: 15 Paths, voyage rework (Pearl shop, 16 Boons, 32 milestones, 21 relics, old pearls kept), Boardwalk (gamble, chests, jackpots), Tide Pass overhaul (100 levels, exclusives), looks (reel hand, faces, eyes, wizard hat, pet colours), 4 new waters + 6 end-game waters (520 fish, own platforms and fish features), 300 oddities, PC display (interface size, picture quality), fight rework (fish must be tired out; holding through rare runs snaps) and caps. QA 94 on each build. **Nothing from 0.4.9 goes live until the director has tested it on every platform.** Next: the director’s bug reports; then the end-of-project clean-up passes. Any new PC CSS must use `calc(N*var(--uvh,1vh))`, never raw vh/dvh (PC zoom). Later save rules must be in `ck_bootfix.js` keys if they add fields (the start-up load runs before later files).
- **Waiting for the director:** bug reports from players and testing; how the fights feel.
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
The order comes from the incident data (`docs/QC_ANALYSIS.md`, `docs/qc_incidents.csv`): cheapest and most severe first, slow and device-specific last, nothing edited after the final gate.
1. Edit `src/`. Pick shared vs platform (rule 3 above). New page / chip / section / water / currency: run "Adding new things" below. A new check is **proven when it is written**: put the old bug back once and watch it fail (3 of 6 new checks on 2026-11-19 passed with their bug present until proven).
2. `build.ps1 -Preview`, then **gate 1: parse every built page** (`new Function`) and boot each changed build once. Script breaks were all severity 3 and this catches them in seconds; if it fails, nothing after it means anything.
3. **`__qa()` on Android, iPhone and PC, PC at 1920×1080 and 1440×900** (test hooks and the async pattern under "Testing"; one build at a time; the PC Fish Log was cut only at 1440×900). It covers logic plus page tabs, no-name-twice, menu top row, page bars, empty pages, the rail and sleeping pets on **every page** (`qaAllPages()`). A failure caused by the save's state is a test bug: make the test state-independent.
4. **Layout sweep, one tool at a time** (back-to-back runs collide): `__spec` at every phone size with `__safeSim` safe areas **and** split-screen (440×460, 375×812, 360×780), `__layoutQC`, `__searchQC`, `__questsQC`; PC: every page opens, full screen simulated, and a phone-only change leaves `site/next/pc.html` identical to HEAD (stamps normalized). Layout cuts are the largest category (14, 8 reached players).
5. **Only when it applies:**
   - Per-frame code or saves changed: every water × dawn/day/dusk/night (× weather) with `__drawCost` on a heavy save and a fresh one; the 120 Hz frame-loop copy; scenery rebuild counts through transitions.
   - Art changed: `__fishParts()`, `__fishSheet({loc})` for every water, every pet × pose × accessory, every area × time × weather.
   - Balance changed: `__bal`. Taps: `__fnTime(names, fn)` (no heavy work inside a tap).
   - Systems touched: walk `docs/SYSTEMS_MAP.md` and test every listed place on every platform.
6. **Device risks (escaped 100% so far):** touch / installed-app paths (finger scroll inside `#stage`, activation on pointerup, `display-mode: fullscreen`, taps normal / slid / redrawn / after Back) and anything Safari could size differently (see "Code rules"). These go in the closing message as "needs a real-phone check".
7. Read every new text as that platform's player ("click" and "Space" are wrong on phones), then a harsh per-platform critique: hard to find for new players? what is missing? how good does it look here?
8. **Notes** (`notes_release.js`, `notes_test.js` for every changed build), **docs** (SYSTEMS_MAP, PLATFORM_DESIGN when a standard changed, LESSONS, "Where we left off", PLAN marks), and **one row per new bug in `docs/qc_incidents.csv`** (who found it, where, severity, what catches it now).
9. **Gate 2, after the LAST edit:** parse every page again and check each page's stamp against the version file it fetches (the one live outage came from an edit after QC). Then commit, `publish_preview.ps1` / `publish_testapps.ps1`; live only per "Publishing"; check the published stamps.
10. **Closing message:** where it is + stamp, what changed, what was found and fixed, what could not be verified (real devices, Safari).

## End of every project (automatic, never asked for)
When a project or a batch of the plan is finished, before reporting it done:
1. **Clean-up pass on the code:** dead code (builders whose output is hidden or never shown, unused functions, styles that never match), the same work done twice (two blocks owning one element, save/restore workarounds copied into callers, duplicated helpers), per-frame or per-second work that could be event-driven or cached, and leftovers from moved features. Fix them, then the full checklist above.
2. **Clean-up pass on the rules:** remove rules that no longer apply, merge duplicates, correct anything the code contradicts (this file, PLATFORM_DESIGN, LESSONS; memory only points here).
3. **Re-run the QC numbers** in `docs/QC_ANALYSIS.md` from the incident log; if a category keeps escaping, change the checklist order or add a check, and say what changed.

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
- **Split-screen sizes in test mode:** the turn screen follows the window's shape there (real phones use how the phone is held), so hide `#dl-turn` before `__spec` at 440×460 / 375×812 / 360×780.
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

## Code rules (details and history in docs/LESSONS.md)
- One-line style files: a `//` comment mid-line eats the rest of the line; use `/* */`.
- `e_ui.js` comes after the platform layers: never read its `let/const` at load from a platform file; wrap functions only.
- Check whether a name is `const` or `function` before wrapping it (wrapping a const kills the page).
- Never replace a whole function from a later file and leave the original behind: edit the original, or delete it and make the replacement the one `function name(...)`. The build refuses a full replacement that doesn't keep the old one (`const _x = name`); a platform file overriding a shared default is allowed. Test hooks call functions through a wrapper, never by value.
- Older phone CSS rules often carry extra ids/classes and silently win; measure the rendered result, and list the matching rules when a new one loses.
- No regex look-behind `(?<=` in phone code (older iPhones fail to parse the whole page).
- Shell edits: `sed`/`perl` mangle `$`, backslashes and `\b`, and multi-line patterns fail on CRLF; use the Edit tool for those, and `grep -rlP "\x08" src` after shell edits. A line-based insert or delete lands by line number, not by meaning (one went inside a multi-line function, one removed a closing brace): print the lines around it right after.
- `git checkout -- site/next` serves an old build locally until you rebuild.
- **Safari sizes things differently from Chrome:** never let a layout hang on one mechanism (a rail sized only by being stretched collapsed on iPhone); when a phone screenshot shows something Chrome can't reproduce, fix it robustly, add a check that forces the failing condition, and say it is not verified on Safari.
- **No `!important` on `display`** for anything that can sit in a tabbed page (page tabs hide with an inline `display:none`); if unavoidable, add `:not([style*="display: none"])`.
- **One owner per element:** one block creates, places and hides it; find page parts by their title or a data attribute, never by a styling class or an old class a page engine may drop.
- **Compare what the player sees:** tab names from the shown text (`tabShownName`), never from `data-sect` ("Dock" shows as "Your boat").
- **Scene state (night, weather, the angler's pose) is put back by the code that set it;** a save-and-restore copied into several callers means the source is wrong: fix the source, delete the copies.
- **A layout change runs `__spec` at every size it touches;** when the new size is right, MB_FRAME and the PLATFORM_DESIGN table change in the same commit.
- **When a feature moves, its old builder and hiding rules are deleted in the same change** (an old on-water Bait button was still built every second and hidden by CSS).

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

## Plan
The one active work list is `docs/PLAN.md` (the director's list in batches, plus older open items). Update its status marks every round.

## Future plans (ideas, nothing decided)
- **Cam's concepts:** per-water events with a gameplay hook on one shared event system; a backyard pond (breeding, after the trophy room). (The new maps are in docs/PLAN.md.)
- **Friends without accounts:** visit a dock from a code, send gifts/fish by code, a weekly friends' derby leaderboard.
- **Seasonal and live content:** holiday decorations, limited-time fish, weekend derbies, seasonal waters.
- **More personal gifts** using the Lily pattern.
- **New places:** a deep-sea boat trip, a night market, a secret pond behind a feat chain.
- **Cozy activities:** cooking your catch for short buffs, a grumpy lighthouse keeper story, boat upgrades.
- **Aquarium:** fish that interact, themed tanks with bonuses, visitors who comment.
- **More Boardwalk games,** kept light and fair.
- **Controller support** on PC, haptics on phones.
- **Optional cloud backup** via a code.
