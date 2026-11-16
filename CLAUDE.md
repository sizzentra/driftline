# Driftline: Project Brief

A cozy fishing game in the browser, made for the director and their friends. It installs as an app on phones and PCs, plays offline, and updates itself. It's a side project, separate from OutPace.

## ▶ Where we left off (read first)
- **Live version: 2.2.2** (2026-11-16) at https://sizzentra.github.io/driftline/. Every release is committed on `main`; `gh-pages` holds the published `site/`.
- **Recent releases:**
  - **2.1 "More of Everything":** new content of every kind, two pets at once (★ favourite plus companion), and the tab grid.
  - **2.2 "Closer Together":** moving progress with a 6-digit code, gift codes, and Lily.
  - **2.2.1:** the 6-digit transfer now goes through a relay, so it works on every network.
  - **2.2.2:** a hide/show menus button for phones held sideways.
- **Waiting on the director:**
  - Confirm the 6-digit transfer works between their real phone and PC. It was only tested in two windows on one PC. The first, direct-connection version failed on their phone, which is why it now uses a relay.
  - Confirm Lily looks right to Cam. Lily is his exclusive pet, drawn from a photo of his dog (see "Exclusive gifts").
  - Confirm the sidebar button is the one they meant: landscape phones only. They may also want a toggle in portrait.
- **Next:** pick from the roadmap below with the director.

## Roles
- **The user is the director:** a non-programmer who sets the vision, play-tests and approves. Explain things in plain words and guide step by step.
- **Claude is the lead developer:** builds, tests on PC and phone sizes, publishes, and writes the patch notes.

## Ground rules (director)
- **Fishing stays the core.** Everything else supports it.
- **Equal care for PC and mobile,** in both portrait AND landscape. Test all three sizes before publishing: 1280×800, 375×812 and 844×390.
- **Cozy and homey,** with light humour everywhere but never as the focus.
- **Try before you buy:** every purchase has a preview.
- **Don't over-buff,** but make every choice meaningful (skills, paths, gear).
- **No easy way to delete progress:** the reset needs a typed DELETE and makes a backup first.
- **Patch notes for every update, spoiler-free:**
  - Be vague but complete: "21 new fish", never their names.
  - Mention every change, including small fixes, renames and shortcuts.
  - Once a version is published, keep its notes exactly as they shipped. New work gets a new version entry, so players who already read the notes still see the change.
  - If several things are requested in one round, they ship together as one update.
- **It should feel like a real app** (the director compared it to PokéBonk), with a clean look on phone and PC.

## How it's built
- **One HTML file**, built from parts in `src/` by `build.ps1`, in this order: `a_head.html` (layout + CSS), `b_data.js` (data), `c_logic.js`, `d_draw.js`, `d2_extra.js`, `d3_update.js`, `d4_style.js`, `d5_v16.js`, `d6_preview.js`, `d7_v20.js`, `d8_v21.js`, `d9_link.js`, `d10_lily.js`, `e_ui.js`. Around them sit `shell_top.html` and `shell_bottom.html`. The output is `site/index.html` plus `site/version.txt`.
- **Each big update added its own file:**
  - d5 = 1.6
  - d6 = previews
  - d7 = 2.0
  - d8 = 2.1 content
  - d9 = device transfer, tab grid, two-pet actions
  - d10 = Lily
- **Saves:**
  - Saves live in `localStorage` under `driftline-save-v1`, and `migrate()` validates every load.
  - **Data that saves are checked against must live in `b_data.js`** (it loads before the logic): PETS, HATS, PERKS, BAIT, SP.
  - Later files may push into other lists (RODS, ATTS, DECOR, DOCK_DECOR, JUNK, RELICS, OUTFITS, PRIZES, FEATS), but then they must update the matching lookup tables.
  - `fresh()` and `migrate()` may only use plain values or `b_data` constants.
- **Panel buttons:**
  - Buttons use `data-act`. The handler in `e_ui.js` falls through to `extraAct` (d2), which chains `extraAct2` through `extraAct7`.
  - Each returns `undefined` (not handled), `'render'` or `'skip'`.
  - New actions go into `extraAct7` in `d9_link.js` (or a new link in the chain).
- **Version and patch notes:** `GAME_VERSION` and `PATCHES` sit at the top of `d3_update.js`. A new version shows its notes once to returning players.
- **Bonuses:**
  - `bonus(k)` adds up buffs, aquarium, pets and rod, with caps.
  - The favourite pet gives its full bonus. The companion gives `compShare()`: 50% plus 2% per bond level.
- **Moving progress:**
  - Save codes: `DL1:` + deflate + base64.
  - Links: `#load=` + a URL-safe code.
  - **6-digit transfer:** Send puts the save code as a file in an ntfy.sh topic named `driftline-move-<code>`. Get progress reads the newest one from the last 3 hours, then posts to `<code>-ok`, so the sender shows "All done".
  - The QR on the sender encodes `#pair=<code>`, which opens Get progress with the code already filled in.
  - The device-to-device connection (PeerJS/WebRTC) was removed because routers blocked it.
- **Hosting:** GitHub Pages (`sizzentra/driftline`, `gh-pages` branch = `site/`). The service worker fetches the network first and always revalidates. The in-game banner checks `version.txt`, and the Update button bypasses the cache.
- **Windows app:**
  - `desktop/Driftline.cs` is a WPF + WebView2 wrapper that loads the live site, so it updates by itself.
  - `desktop/build_desktop.ps1` builds `site/download/Driftline-Setup.zip`.
  - The app installs to `%LOCALAPPDATA%\Programs\Driftline`; `--portable` skips installing (use it for tests).
  - Rebuild the zip only when `Driftline.cs` changes.

## Workflow
1. Edit `src/`.
2. Build: `powershell -ExecutionPolicy Bypass -File build.ps1`.
3. Test locally: `powershell -ExecutionPolicy Bypass -File tools/serve_local.ps1`, then open `http://localhost:8766/?test`.
   - `window.__dl.S()` returns the save and `__dl.G` the game state.
   - Game functions are not global, so drive the game by clicking `data-act` / `data-tab` buttons from scripts.
   - Check every tab opens without errors at all three sizes.
4. Publish (builds, commits with the attribution trailer, pushes `main`, pushes `site/` to `gh-pages`): `powershell -ExecutionPolicy Bypass -File publish.ps1 -Message "Driftline X.Y: what changed"`.
5. Check that `https://sizzentra.github.io/driftline/version.txt` shows the new stamp. It takes about a minute.

Gotchas:
- Multi-line edits with `sed` fail on these files; use an editor or awk. In bash, `$` and backticks inside heredocs need care.
- A `//` comment inserted mid-line silently eats the rest of that line.
- The local server's `?test` swaps in a steady frame timer, so animations play in background tabs.

## Exclusive gifts
- **Lily** (`d10_lily.js`) is Cam's exclusive pet. Cam is the director's friend, and Lily is a tricolour mini Aussie drawn from a photo of his real dog.
  - **Unlocking:** she unlocks only with a gift code redeemed in Settings. The code is stored base64-encoded in `redeemGift`; the director has it.
  - **Hidden from others:** she has `src:'gift'`, so she's hidden from other players' pet list and doesn't count toward the "own all pets" feat.
  - **Animations:** she sits facing you, like in the photo, with head tilts, sniffing, giving paw, zoomies with paw prints, belly-up rolls every third pet, a "Boof!" when a fish is landed, and night naps.
  - **Patch notes:** redeeming the code shows Cam's own notes card (`LILY_PATCH`), which then stays in his patch-notes list. Public notes only mention "a gift code box".
- To make another one: copy the Lily pattern (a `'gift'` pet in `b_data.js`, a drawing, a code in `redeemGift`, a personal notes card).

## NEXT BIG FOCUS: Driftline 0.3 overhaul (director, 2026-11-16)
Version numbers (director): the overhaul is **0.3**, not 3.0, so each step up carries real weight. Style mockups (3 options, the director picks): https://claude.ai/artifact/326v8aADGzr8wbyemBtmPe
The director wants the whole game taken "up a notch, across the board". Lily showed what's possible. Things feel too simple; the game is missing a cohesive art style.
- **Scope (nearly everything):**
  - visuals, animations, effects, music, atmosphere
  - each map unique and gorgeous
  - a beautiful UI
  - equipment
  - pets, customization, clothes, hats, decor
- **Priorities:** optimization and gameplay.
- **Plan (each phase approved before the next):**
  1. **Art direction:** mockups of 2–3 styles. Each is a full scene (map, character in outfit + hat, pet, decorated dock, aquarium corner, UI panel). The director picks one.
  2. **Performance groundwork:** cache static layers, move water/light effects to the GPU, a quality setting, pause when hidden. Target smooth 60 fps on phones, measured.
  3. **Vertical slice:** one map fully redone (water, lighting, weather, wildlife), the character rebuilt with cast/reel/idle/celebration animations, the catch reveal, music + ambience, 3 pets with Lily-level personality, and a few clothes/hats/decor pieces. The director play-tests it.
  4. **Every map gets its own identity:** palette, landmarks, creatures, sounds, music theme.
  5. **Redraw every item** (pets, clothes, hats, decor) in the style, with deeper customization and bigger previews. Saves carry over.
  6. **UI makeover:** one theme, drawn icons, transitions, feedback.
  7. **Equipment and gameplay depth:** visible, distinct gear; visible effects; a richer reeling fight.
- **Rollout:** build on a separate preview link so friends keep playing the stable version. Ship as **0.3** with full spoiler-free notes.
- **Open choices:** the art style; music (richer generated layered themes vs free-licence recorded tracks, which mean a bigger download).

## Roadmap: things to work on (closest first)
1. **Confirm the open items** above with the director: the real phone ↔ PC transfer, Lily's look, and the sidebar toggle in portrait.
2. **Lily polish:**
   - At night her black coat is hard to see on a dark dock; consider a soft rim light.
   - Hats don't follow her head tilt exactly.
   - Get Cam's feedback.
3. **Transfer safety net:**
   - ntfy.sh is a free third-party relay (about 250 messages per day per IP, and files expire after about 3 hours).
   - If it ever becomes unreliable, move to our own tiny relay, for example a free Cloudflare Worker.
   - The link buttons stay as the fallback.
4. **Code tidy-up:**
   - One file per update and the `extraActN` chain have grown long.
   - Fold them into feature files (pets, gear, home, social) with one shared action registry, without changing saves.
5. **Performance check on an older phone:**
   - The scene, the Lily animation loop in the Pets tab, and the aquarium all redraw every frame.
   - Measure, and pause the redraws in background tabs.
6. **Accessibility:** rarity shown by more than colour (icons or patterns), a reduced-motion setting, bigger touch targets in the landscape tab grid.
7. **Save size:** saves grow with the fish journal. Keep codes and links compact (drop derived data before encoding).

## Future plans (ideas, nothing decided)
- **Friends without accounts:**
  - Visit a friend's dock from a code (read-only).
  - Send gifts or fish to a friend with a code (it can use the same relay).
  - A weekly friends' leaderboard for derby scores.
- **Seasonal and live content:** holiday decorations, limited-time fish, weekend derbies, seasonal waters (autumn lake, winter ice fishing).
- **More personal gifts:** exclusive pets or items for other friends, using the Lily pattern.
- **New waters and things to discover:**
  - A deep-sea trip by boat.
  - A night market.
  - A secret pond unlocked by a feat chain.
- **Cozy activities around fishing:**
  - Cooking your catch for short buffs.
  - A small story with a grumpy lighthouse keeper (light humour).
  - Boat upgrades.
- **Aquarium:** fish that behave differently together, themed tanks with bonuses, visitors who comment on your tank.
- **More Boardwalk games** and prizes, keeping the gambling-style games light and fair.
- **Controller support** on PC, and haptics on phones for bites and catches.
- **Optional cloud backup** of your save via a code, building on the transfer relay.
