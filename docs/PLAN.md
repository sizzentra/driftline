# Driftline plan (the one active work list)

The director's list of 2026-11-19 (60 points), sorted into batches by dependency and size. Every batch goes to all three test
builds, through the round checklist in CLAUDE.md, before the next one starts. Status per line: ☐ to do, ◐ in progress, ☑ done
(test builds), ✔ live. The release is **0.4.9** (new content). Numbers in brackets = the director's line numbers.
Finished work leaves this list once it is live: batches 1–2 (live since 0.4.8.9) are in `docs/HISTORY.md`.

## Open now (the one place for open work and decisions; CLAUDE.md only points here)
**Found, not fixed yet** (2026-11-21)
- ☑ (fixed overnight batch 1, 2026-11-21: the color rows stay in place) PC at 1024×640, Pets › Customize: picking the Plush Crab Hat (owned, the last hat in the list) puts the page back at its top and the hat moves 69 px (`__snapQC({only:['pets']})` reproduces it every time on the test save). Not a try-on (no reveal). Not caused by the home pilot (that page is untouched); first seen on 2026-11-21 because this browser's save owns that hat.
- ◐ (fixed overnight batch 1: the game asks the Driftline Test app to switch; the app was rebuilt; waiting for the director's check) PC: the Full screen button does nothing (director, 2026-11-21). Owner: `src/pc/ui_settings.js` toggle (and `d2_extra.js` 'fullscreen'). Where (director, 2026-11-21): fails in the **Driftline Test** desktop app (`desktop/DriftlineTest.cs`, test build); works in the live Windows app. Compare the two wrappers' full-screen handling and the test build's PC code; reproduce before fixing (checklist 1b).
- ☐ PC 1440×900, Your home (an old-style home): picking another water's home to copy can jump the page to its top (10 px, seen once in the final QC, 2026-11-21). These pages are replaced by Homes for Every Water (batch 5); fix with it unless it shows up sooner.

**Sweep tool bookmark** (director, 2026-11-20: tool problems wait here; the game findings from the same runs were fixed first). From the real-phone runs on build 1946:
- ☐ iPhone 16 Pro Max (Safari view from Tester tools): 56 min for 29 checks (Pixel: 6.7 min for 28). The page reloaded (out of memory) during the test suite at 956×440, Content 440×460, Content (extreme) 667×375 and Fish decorations, even after the #151 memory fix. Likely cause: each check loads a whole 2.8 MB game into a frame inside the page, and Safari does not hand back a closed frame's memory quickly. Ideas: open each check as its own page instead of a frame (a fresh page frees everything), or run fewer, smaller checks on iPhone.
- ◐ iPhone: time-outs (Content 667×375 after 400 s; layout/search/quests after 120 s). Built 2026-11-21: the sweep measures the device first and stretches every time limit by how much slower it is than the PC (up to 12x; the report shows "time limits xN"). Waiting for the next iPhone run to confirm.
- ☑ The sweep in the Safari view uses its own storage, so phones always test a fresh save. Locally: a Fresh save part (2026-11-21) runs start-up, the content check, the phone layout check and the quests check on a brand-new save, phone and PC (clean apart from the two held picture items).
- ☐ Re-run Run every check on both phones once the tool is fixed, and read the game findings (director, 2026-11-20). Fixes from the first reports (build 2035): Bounties sideways row confirmed fixed on the iPhone (director); Market Rush with the Merchant Path and the phone Bait card counted as fixed until the next reports (Market Rush can only be tested while one is on).
- ☐ The Pixel reports its real screen as 924×412 (the checks used 915×412 for Android before); the sweep now uses the real size on phones. Keep.
**Shelved for the next build** (director, 2026-11-20: "we want them in the build, but shelf them for now")
- ☐ Fishmonger's Gamble, empty cooler, phones only: idle picture row 🐟 ⚖️ 🪙 above "Your cooler is empty…", like the other cards' idle art (before/after shown 2026-11-20, pictures in `tools/shots/gamble/`). PC stays as it is (no room: the picture pushed the message out of the card).
- ☐ Fishmonger's Gamble after a play (Android, likely iPhone): the result line pushes the 4 fish buttons down so the card is taller than the screen, and the centred result line sits over left-aligned buttons. Options to show the director first: a shorter result line, or the buttons in two columns.
- ☑ (fixed with the Boardwalk cards, 2026-11-20) PC Boardwalk › Games at 1920×1080 (test build): Mystery crates card text overlaps ("Small crate" over the description) and the Legendary crate row spills below the card. A bug, not a look choice: fix it with this batch, check whether live has it too.

**Found by the content check, first run (2026-11-20; all confirmed by measuring and pictures)**
- ✔ **Live and test, PC full HD:** Rods › "In your hands" was squeezed to the screen and hid its Upgrade button and attachment slot. Fixed in the test builds and live as hotfix 0.4.8.9.5 (PC only, 2026-11-20, director: "Push it live. It looks great"). Pictures: `tools/shots/rodslot/`.
- ☑ (fixed 2026-11-20: cards grow with their content, the games area scrolls) **Test, PC 1920×1080, Boardwalk › Games:** the cards have one fixed height, so content spills: Treasure chests' "Open" button sits under the Counter specials section (can't be clicked); Coin flip's 50% button and the Gamble fish buttons hang over the card edge; after a game is played, results overlap buttons on most cards (Duck pond, Scratch card, Claw machine, Gamble, Treasure chests). One cause, one fix (cards grow with their content). 1440×900 and 1024×640 are fine.
- ☑ (fixed 2026-11-20: milestones one per row) **Test, PC all sizes:** Map › Set sail again › Voyage milestones are squeezed into a narrow column (one word per line) and "after N voyages" is printed over the descriptions (like the old Boons bug, #114).
- ☐ **Decision (rule 4, pictures in a group):** Boardwalk › Mystery crates has no picture on every platform (7 of 9 game cards have one); Higher or lower loses its picture after a game on PC. Picture or listed exception.

**Look items noted, not fixed** (2026-11-19 outsider review)
- ☐ The empty Cooler page is mostly blank space.
- ☐ The aura previews in the Wardrobe › Tide Pass tab are small.

**Parked fixes** (undone with phase 2 on 2026-11-20; redo when the director wants)
- ☐ A brand-new save can lose some Wisdom Pearls on its first reload (`fresh()` has no `pearlV`, #121).
- ☐ Three functions nothing calls: `boardwalkBanner`, `clawHTML`, `pathOn` (#124).
- ☑ Flaky QA test: a random shiny broke the batch 5 waters price limit (#127): fixed 2026-11-20 (the test compares a plain fish).

**Needs the director's eye**
- ☐ Aquarium speed-up: drawing the fish costs ≈0.5 ms each (24 fish ≈ 10 ms, forced-sync test; phones not measured). The fix (cached tail-wag frames per fish) changes the animation slightly.

**Decisions waiting on the director**
- Bigger tap targets (ours 32–40 pt vs 44 pt guidance) · text size · left-handed / menu side · colour-blind help · a real tablet layout · the Trophy Room name · whether the aquarium empties on a new voyage.

## Checks overhaul (director, 2026-11-20: make every check as efficient as the content check)
- ☑ One-click sweep (`tools/sweep.html`): every automatic check, every build and size, one report, test save put back; covers the start-up check (also with every Path) and the test-tool problems (no collisions, no menu-open hang).
- ☑ Options stay put (`__snapQC`, in the sweep): picking any option on any page never moves it (C13).
- ☑ Strength table (`__strTable`) and creature outlines (`__creatureBox`): measuring tools for balance and fish pictures.
- ☑ Redundancy counter (build.ps1, 2026-11-20): unused functions refused; wrap layers, force-hide rules, polling timers and watchers per build may only go down (`tools/redundancy_baseline.json`, lowered by the build itself); proven by planting each of the six once; 5 unused functions deleted.
- ☐ Content recipes for fish, oddities, items and waters (every new thing has all its parts: name, art, lessons, search, notes).
- ☐ Saves check (old saves load, migrate keeps everything, save codes round-trip at extreme sizes).
- ☐ Speed budgets per page and per frame, checked by the sweep.
- ☐ Balance targets checked automatically (`__bal` against written targets).

## Direction (director and Cam, 2026-11-21) — read first
- **0.5 is the goal** (director, 2026-11-21): one large, polished update. 0.4.9 is the testing ground (the test builds), not a release target. Nothing new content-wise until past 0.5: improve what exists (Cam). The production queue below leads to 0.5; when 0.5 ships is the director's call, not an automatic last step.
- **Priority order (Cam):** 1. fishing feel (most urgent: "still poor"), 2. gameplay hotfixes, 3. balance (especially endgame), 4. visuals.
- **Balance comes at the end**, once it's decided what the update consists of. (Claude's "2 billion coins" point was wrong: that is the test save with everything maxed by Tester tools.)
- **Saving needs a safer option for real players** (an automatic backup or similar); today's setup suits testing, not players.
- **Testing:** lighter where it was heavy (quick path in CLAUDE.md). A future sit-down: Claude says what it wants to see from the testers' devices, and they give it through a recorded tool.
- **Clean Pages** (untangling the code) is very important and continues.

## Director's bug list (2026-11-21, being collected in spurts; STORED ONLY, not fixed until the director says the list is finished)
- PC: some maps run badly; Willow Pond's frame rate is very unstable. Fix it, and make sure no map has the problem.
- **Ongoing fish graphics revamp** (part bug, part new art): a pass so fish based on real fish look like them. Named: arowana; most catfish and catfish-like fish (the tiger shovelnose looks nothing like its description). Fish should become more recognisable; the fish models haven't had love in a while. The director sees it as a good test of a picture comparison tool (note: automatic picture comparisons were dropped 2026-11-20; what exists is the fish sheet `__fishSheet` for side-by-side pictures, to talk over).
  - **Decided (director, 2026-11-21):** the general fish recipe of the 10 newer waters learns real fish families (arowana, catfish, sturgeon / shovelnose, knifefish, piranha and every other family that is possible and realistic), each with its own body, head, fins, whiskers and pattern; every real-based fish with that family in its name picks it up; joke fish keep their gag on the proper body. **Scope: every fish where it is possible and realistic, in one go** (no pilot). Pictures before and after for the director to judge (sheets: tools/shots/fish_arowana.png, fish_catfish.png show today's look).
- Phones: when the catch card pops up after a catch, the right side panel disappears (director's screenshot: a Bullhead card at Willow Pond; the pencil in the corner is the director's screenshot tool, not the game).
- Phones (PC not checked yet): fish pictures in a scrolling list flash and reload as the scroll bar fades out; once it has faded, the picture reloads and the scroll bar shows again (director's video: C:UserssizzeDownloadsscreen-20261121-123130-1795282278162.mp4).
- **URGENT: Fish feel update** (pasted 2026-11-21, likely from Cam; stored word for word in meaning, not built yet):
  - Tension doesn't reset the moment a fish eases up: reeling constantly should still build the tension and temper bars.
  - Temper can drop quite fast while not reeling. A full temper bar makes the fish choose fight actions rapidly, each using much less of its fight.
  - When you ease up, tension falls at a steady rate (much more slowly while the fish is doing a fight action).
  - Reeling during any fight action (except a jump toward you) drains its fight bar faster.
  - Between fight actions the fish is in one of two unannounced states: staying still (today's reel-in feel) or swimming toward you (reel-in speed fluctuating 25-50% faster). Swimming toward you lasts at most 3 s and at least 0.25 s at a time; the higher the rarity, the less likely it stays in that state long (but it still can).
  - A tired fish reels in 10-60% faster by rarity (mythic 10%, legendary 20%, rare 30%, and so on).
  - Second wind: every fish gets 1; rares and epics can get 1 more; legendaries and mythics 2 more. Attempts past the first are less likely to succeed: a 50/50 coin flip after 5 s of tiring again, then again after 3 s, then after 1 s, until one succeeds. A legendary or mythic's 3rd attempt doubles those waits and gives only 25% fight.
  - Final pass: every modifier to fight dynamics, from any source, must make a real mathematical difference (tension, reel speed, temper-rate reduction).
  - In waters with dives, 2/3 of runs are normal runs and 1/3 are dives.
  - Perfect hooks can return to their former glory.
- Aquarium boosts show their net value when hybrids or other sources change them.
- Oddities still reel in slightly fast; this should ease off with rarer oddities.
- Cooler: add a "Hybrid" toggle to the Scrap / Sell filter, next to the Shinies toggle.
- **No malware warnings on any download from our sites** (director, 2026-11-21, after Defender flagged the Driftline Test download as a Trojan). Queue: batch 2, project 8b.

## Willow Pond home pilot: the director's notes (2026-11-21, being discussed slowly; NOTHING DECIDED, nothing built from these yet)
Taken from the director's phone screenshots (iPhone, Your home page, Lantern tab and the closed view). Feeds Homes for Every Water (batch 5) once talked through.
- **Good:** the scene inside the home page runs smoothly with no stutters; the page is laid out well and easy to follow.
- **6 elements, not 5:** the tab grid shows 5 parts and leaves an empty slot at the bottom right; it should be full (6 things to customise).
- **The 6th element: a seat** (director's idea, liked, 2026-11-21): every home gets a chair or seat that fits it (styles and colours like the other parts). Resting sits the angler in it, and the pets sit properly too ("sit everyone in all chairs"), on every home. Goes with the Pet Nap path (pets nap beside you while you rest).
- **Colours:** too few. **At least 16, on both versions** (the phone layout fits 8 per row, so 2 full rows), all matching the map's theme. **One colour list per home, shared by every part** (confirmed by the director), so parts can be set to the same shade and match.
- **Top of the page:** the coins and the settings button are not needed on this page; that space should go to fitting the page better, with the side panel open or closed.
- **The strip under the view:** "Your home: Willow Pon…" doesn't fit; "Parts: 5 to change" and "Cost: All free" mean nothing to players and should go.
- **Keep showing which water you're at** (knowing it's Willow Pond is good), but in a simpler way that takes little room, not a strip that eats space from the whole menu.
- **Canopy styles:** "Cloth pergola" and "Wooden shelter" are not side view. The **patio umbrella is the model**: it faces the right way and has depth in every direction.
- **Everything placed on the deck connects to the deck**, never to the rails.
- **The posts (both versions) don't blend down into the water:** they stop as hard blocks above the bottom of the screen; they should run down and fade into the water properly.
- **The rings around the posts** shouldn't keep growing and shrinking; something subtler, like the water flowing past the posts.
- **PC (director's PC screenshots, Lantern / Canopy / Rail tabs):**
  - Good: the small label on the preview ("Willow Pond · Willow Pond dock") says where you are without taking space (the kind of thing phones should do too). The PC header staying on this page is good: Back to fishing, or straight to any other menu.
  - The "Your dock" box covers the whole right side and shrinks the preview: remove it. PC needs no Options / Hide like phones; it should simply fit everything at full screen.
  - **The preview shows only the home** (director, clarified): on PC full screen and on phones, with the options open or closed, the view is framed on the area the whole home covers and the home fills it. No extra width of the fishing scene beside it (today the home is only about 40% of the width).
  - The home page is laggy on PC (at least the fishing scene behind it). To investigate: a bug, not a design choice.
  - Colour picking looks fantastic on phones and not on PC: they should look the same.
  - The "Parts of your dock" heading pushes the part tabs down, and with them Style and Color far down the page.
  - The umbrella connects to the rail instead of the deck on PC too.
  - **Same layout, look and behaviour on PC and phones**, with only these PC differences: more space, and the PC header stays. The phone changes (6 parts, 15+ colours, and so on) apply to PC too.

## Production queue to 0.5 (director, 2026-11-21; the active queue)
Each batch: a rollback tag first; quick checks per change, the full checks once at the end of the batch; then onto the test builds. Look and feel calls go to the director with pictures. Open questions are settled before a batch is built.

| Batch | Projects | Details | Open before building |
|---|---|---|---|
| **1. Fishing feel** (most urgent) | 1 Cam's fish feel update · 2 Oddities reel in more slowly · 3 Fight modifier audit | 1: tension keeps building while reeling, temper drops fast when not; full temper = rapid fight actions using much less fight; easing up drops tension steadily (slower during a fight action); reeling during a fight action drains fight faster (not during a jump toward you); hidden states between actions: still, or swimming toward you (reel 25-50% faster, 0.25-3 s, shorter for rarer fish); tired fish reel 10-60% faster by rarity (mythic 10, legendary 20, rare 30 …); second winds 1 for all, +1 rare/epic, +2 legendary/mythic, later ones on 50/50 flips after 5 / 3 / 1 s, a legendary/mythic's 3rd doubles the waits and gives 25% fight; dives = 1/3 of runs where they exist; perfect hooks back to their former glory. 2: easing for rarer oddities. 3: every source of tension, reel speed and temper changes makes a real difference. **Cam's answers and extra notes (dives 5-20 s, "Careful" message, fight speed, spool cap 200): "Cam's answers" below** | none (Cam answered 2026-11-21) |
| **2. Bugs and fixes** (every bug and fix goes here, ahead of everything else; director, 2026-11-21) | 4 Aquarium net boosts · 5 Hybrid toggle · 6 Catch card side panel · 7 Fish pictures flashing · 8 PC frame rate · 8b Safe downloads · 8c Old open items | 4: boosts show their real total with hybrids and other sources. 5: Cooler Scrap / Sell filter, next to Shinies. 6: phones, the side panel vanishes when the catch card shows. 7: phones (PC to check), pictures in scrolling lists reload as the scroll bar fades (director's video). 8: Willow Pond unstable on PC; **find what is wrong first** (director, 2026-11-21: "PCs can handle it", so lightening the load is not the answer): look for a fault such as work repeated every frame, rebuilds that shouldn't happen, timers piling up, a leak, or the frame loop itself stuttering; measure every water on PC full screen the same way; fix the cause, and lighten something only if a real cost remains after that. 8c (moved from batch 9, director, 2026-11-21): the Mystery crates picture, the Fishmonger's Gamble card height after a play, the empty Cooler page, the Wardrobe aura previews, the Aquarium speed-up; a first version of each, judged from pictures. 8b (director, 2026-11-21): **no malware warning on any download from any of our sites.** Found: Windows Defender called the Driftline Test download a Trojan; both Windows apps (Driftline.cs live, DriftlineTest.cs test) copy themselves into AppData, make shortcuts and restart themselves, unsigned, the pattern Defender's guesswork flags. Fix with free tools only: no self-copying (a normal free installer such as Inno Setup, or an app that runs where it is unzipped), submit each file to Microsoft's free false-positive check, scan every download on VirusTotal (free) before publishing, a build check that refuses a download that hasn't passed; then the Driftline Test app gets a working download link on the test site | (paid code signing is out: no paid tools) |
| **3. Safe saves + untangling** | 9 Automatic save backup · 10 Clean Pages 2-3 | 9: progress never lost by accident for real players (a device backup, a reminded backup file, or an optional cloud copy). 10: Clean Pages 2 and 3, see "Untangling plan" below | which backup idea |
| **4. Fish revamp + map updates** | 11 Real fish families · 12 Decoration check · 12b Map updates | 11: the newer waters' fish recipe learns real families (arowana, catfish, sturgeon / shovelnose, knifefish, piranha, cichlid, tetra, gar, lungfish, pike …) with their own body, head, fins, whiskers and pattern; every fish where possible and realistic; joke fish keep their gag. 12: decorations re-checked on the new shapes. 12b (director, 2026-11-21: map updates belong in the roadmap): the director and Cam's verdicts on the map pictures (Florida Keys, Amazon, and the new moments at Willow Pond, Saltmarsh Coast, Ember Springs, Animal Farm, The Buffet, Corporate Pond, the Nile), the map-standard rules no tool checks yet (nothing over the fishing area, reflections under objects, no gaps between layers) gone through water by water, and any map changes the director adds. Before / after pictures | which map changes the director wants beyond these |
| **5. Homes** | 13 Willow Pond pilot reworked · 14 Homes for every water | 13: from the director's notes ("Willow Pond home pilot" above): same on PC and phones, preview shows only the home, 6 parts with a seat, 16+ shared colours, side-view canopies, deck items on the deck, posts into the water, PC lag fixed. 14: **the same changes on every water's home** (director, 2026-11-21): the notes are rules for the home format, so every home gets the same page, preview, 6 parts with a seat, 16+ shared colours, side view, things standing on the deck, and supports running into the water with a subtle flow; each water's home idea approved before drawing | the pilot's open points; every home idea |
| **6. Goodbye Decorations + install** | 15 Remove decorations and cozy · 16 Install welcome | 15: as decided under P2 (aquarium decorations stay, Tide Pass gives aquarium decorations, feat removed, no refunds, cozy text gone, Pet Nap replaces Homebody). 16: P6 (once per device, Install in Settings) + a clean install of the Windows app on a fresh PC | |
| **7. Finish** | 17 Clean Pages 4-5 · 18 Device report session | 17: Clean Pages 4 (PC) and Clean Scenes 5, see "Untangling plan" below. 18: Claude says what it needs from the testers' devices; recorded with a tool set up together | the recording tool |
| **8. Balance** (last of the queue) | 19 Endgame balance targets | decided with the director and Cam once the content is set: how long things take, prestige clearly stronger; a tool checks them | the targets |
| **9. Added during the run** | (to fill) | everything the director or Cam add while the queue is in progress goes here (director, 2026-11-21); bugs still go to the front. When 0.5 ships is the director's call | |

Parked in Ideas: the Report a problem button.
### Decisions for the queue (director, 2026-11-21) so the work never has to stop
1. **Save backup = a backup copy on the device**, refreshed automatically (not on every save: at most every few minutes and when the app is hidden, so it costs nothing noticeable), restorable from Settings if the main save breaks; works offline.
2. **Homes: Claude writes every home's idea and side-view descriptions, reworks Willow Pond and draws them all**; the director judges the pictures afterwards. **First, a map theme guide** (docs/MAP_THEMES.md): every water's description, theme, culture, materials, colours, creatures and what does and doesn't belong, so new things (homes, creatures, moments) fit their water.
3. **Map updates: no extra list**; Claude goes through the map rules water by water, the director judges pictures.
4. **Fish revamp: built in full**, before / after pictures judged afterwards.
5. **Each finished batch goes onto the test builds at once** (live stays the director's call).
6. **Device reports: a Record mode on the Run every check page** (play, then Copy report: device, errors, what happened). **Plus, test builds only: when the game fails to open or something goes wrong, a "Copy error report" option right there**, working even when the game itself can't start.
7. **Batch 1 waited for Cam's answers**; the run started with batch 2 (director's go, 2026-11-21). Cam answered the same day, so batch 1 is built right after batch 2.
8. **Hotfix 0.4.8.9.6 dropped** (director, 2026-11-21): live waits for 0.5.
9. **PC Wardrobe converted to the phone layout** (batch 7, with Clean Pages 4).
10. **Older open items go into batch 2** (moved from batch 9, director, 2026-11-21: all bugs and fixes come first): Mystery crates picture, the Fishmonger's Gamble card height after a play, the empty Cooler page, the Wardrobe aura previews, the Aquarium speed-up. **Batch 9 holds what is added while the queue is in progress.**
11. **Checks overhaul: only the saves check is kept** (batch 3, with the save backup; the director wanted more detail first, given 2026-11-21); content recipes and speed budgets are dropped.
12. **Sound in map updates** (batch 4): every water has its own music and ambience **that fits its theme** (checked against the map theme guide); the director and Cam judge by ear.
### Untangling plan (Clean Pages and beyond; batches 3 and 7)
**Why:** each round added a layer on top of the last instead of changing the owner, so one page or water is drawn by several files that run in a fixed order. A change in one layer can silently break another (Ember Springs' geyser vanished under a later layer; the Cooler built a help box that another layer hid). Measured 2026-11-21: phones 300 wrap layers (renderPanel alone 43 in shared + phone files), PC 268; the scenes 48 extra layers (`m33wrap`) across 9 files.
**How (every step):** list the build's real wrapper order first; fold a page's layers into one place (its own file, or `pageDone` for touches after the page engine), keeping the order they ran in; delete dead builders and the rules that hid them; prove nothing visible changed (pages: the element fingerprint, every element's place, size and style before and after; scenes: a frame drawn at a frozen time compared pixel for pixel); the redundancy counter must go down. No look change anywhere; any difference is a bug.
- **Done (batch 1, 2026-11-21):** phones' Aquarium, Cooler, Settings + Save, Your home, Rods (wraps 311 to 300; a Rods watcher leak fixed; a hidden Cooler help box removed).
- **Clean Pages 2 (batch 3):** phones' Map, Wardrobe, Skills, Pets, Bounties (layers in waters08, pages08, polish08, ui_modern06, au_fix034).
- **Clean Pages 3 (batch 3):** phones' Trophy Room, Events, Feats, Stats, Shop / Bait, plus the layers that touch every page (text walker, swatches, section names, badges) given one owner each.
- **Clean Pages 4 (batch 7):** PC's own layers: Your home, Aquarium, Rods, Pets, Shop, Fish Log, and the PC-wide ones (fit, frame, header), in `src/pc/`.
- **Clean Scenes 5 (batch 7):** every water's drawing in one file per water (today a water such as Saltmarsh Coast is drawn by f2_areas, ao_maps033, aq_life033 and av_sea034); the shared weather and depth layers get one owner.
- **Afterwards (not in a batch yet):** the system wrappers (save 12, migrate 13, extraAct2 11, toast 9, draw 8, showCard 7).
- **Target:** phones' wrap layers under 200 after batch 3, under 150 after batch 7; scenes' `m33wrap` gone.

### Cam's answers (fish feel update, 2026-11-21; batch 1 is unblocked)
The 9 questions (Claude's suggestion in brackets) and Cam's answers, as the director passed them on:
1. **Perfect hooks** [old effect back, or stronger?]: the fish doesn't fight for **1.5 s base** after a perfect hook (today 0.7-1.4 s, before the new fight 0.5-0.9 s); if what exists is already stronger, keep it. 1.5 s is longer, so it applies.
2. **Temper drop when not reeling** [full to empty in about 3 s]: yes.
3. **Full temper, cost per action:** **proportional to how much faster the fish acts.** If full temper doubles how often it starts fight actions, each costs half; triple the rate, a third. (Replaces the suggested flat half.)
4. **Tension falling when you ease up** [about 35 a second, a third during a fight action]: yes. **Plus: tension rises slightly while reeling** (it didn't before). Reeling builds tension; not reeling drops it, more slowly during a fight action.
5. **Reeling during a fight action drains fight faster** [1.5 times]: yes.
6. **Tired fish reel-in by rarity** [common 60, uncommon 45, rare 30, epic 25, legendary 20, mythic 10 %]: yes.
7. **Swimming toward you** [a new choice every 1-2 s, less often for rarer fish]: yes.
8. **Second winds (corrected):** the **first second wind stays exactly as it is today.** Only the extra ones change: when the fish tires for the second time (and later), instead of a sure second wind after the wait, a 50/50 flip; success = another second wind, failure = try again after the intervals given (5 s, then 3 s, then 1 s). Purpose: no fish can be waited out with almost no input and then reeled in all at once.
9. **This update wins over FIGHT_FEEL.md:** yes. The first document built the systems; this one tunes the feel.

**Cam's extra notes (to build in batch 1):**
- **The feel he is after:** fights with common fish are too slow and not engaging; strong fish are slightly too overwhelming. A common fish's head shake shouldn't break the line but can't be ignored completely. The temper bar threatens nothing today and can be ignored while reeling (answer 3 fixes that). Tension shouldn't drop the moment a fish stops its action: not reeling is what drops it.
- **Dives:** last much longer, **5 s minimum base, scaling up to 20 s**, and **stop once tension stays inside the zone for 1.5 s**. They pull line out more slowly, but can pull out much more in total. Today dives end by themselves too quickly and there is almost no way to control tension.
- **"Careful" message:** does nothing now; it must mean something (warn of a real danger, matched to what happens).
- **Fight speed:** speed fishing up so a fight runs at roughly half the speed of the old fishing style with great gear (old style with great gear = the reference). **Feel call:** the first version is measured against the old fight and flagged.
- **Spool-out cap raised to 200.**


## Earlier production queue (2026-11-21 overnight run; history: batches 1-4 done, its open items are carried into the queue to 0.5 above)
One large overnight run, so testing happens once over many changes. Each item is built only when its concept is decided (status per item); open questions are settled in conversation first.
| # | Item | Concept status | Notes |
|---|---|---|---|
| P0 | **Cam's fishing feel, always first in the run** (director, 2026-11-21), with a rollback option for the fishing changes only. Source: **docs/cam/FIGHT_FEEL.md** (Cam's answered questionnaire, received 2026-11-21; original .docx beside it). It comes before everything else; the earlier doc only where it isn't clear (director, 2026-11-21) | ☑ answered (landing times, action shares 35/45/20, chains, second wind once, dive limits and magenta zone, spool-out at 150 m, snags faster); rollback (director, 2026-11-21): **both** a safety tag `rollback/before-fishing-feel` before any fishing change, and a Tester tools switch **"Fishing: New / Old"** (test builds only; covers Cam's fight rules, fast run turns #5, hotspot hook attempts #10; removed with the old code once the director approves) | Feel call items built as a first version and flagged |
| P0b | **Cam's fix list** (docs/cam/FIX_LIST.md, 13 items, received 2026-11-21): scrap text, slow water portraits, Florida Keys and Amazon upgrades, fast run turns, wrong badges, Scrap all beside Sell all, rarity sort, Nibble jitter, hotspot hook attempts, imperial/metric, Uncharted Waters, Hollow Trench depth | ☑ written; the hook-attempt numbers are a first version for the director and Cam | maps go with P4, run turns with P0 |
| P1 | **Homes for every water** to docs/HOME_STANDARD.md, with the Willow Pond lessons: no shore; 3 real styles plus "nothing" as a 4th where offered; side view; fits the deck exactly; lights stay at the light spot; color matters; sharp close-up | ☐ needs each water's home concept: its 4 parts + light, 3 styles each, curated colors (to be proposed and approved) | Stonebrook River gets its mill landing; old homes (dock, pier, ice, beach, boat, trawler, raft, stone, crystal) and the 10 new ones (bridge, ledge, skiff, stilts, hay dock, platter, steel pier, felucca, hover pad, marble) |
| P2 | **Remove decorations and the cozy bonus** everywhere (saves cleaned on load; Tide Pass, feats, quests, lessons, Help, search reworded) | ◐ decided (director, 2026-11-21): **home decorations and the cozy bonus are gone, with no replacement** (the +sell / +XP / bite bonus simply ends); **aquarium decorations stay**; the **Tide Pass gives aquarium decorations only**; the **"Home sweet home" feat is removed**; **no refunds** for home decorations already bought (they were cheap, and every home part is free); **every cozy text goes** (Stats "Cozy level", lessons, Help, search, notes). **Homebody is replaced by a new Rest path, "Pet Nap"** (director, 2026-11-21): while you rest, your pets nap beside you and their bond grows faster (how much faster: a first version, tuned in the later balance queue; the name can still change). Note for the build: Rest mode sits the angler in the Cozy Chair decoration when there is one; without decorations it always sits on the deck edge | follows P1 |
| P3 | **Untangle the pages** (item B below): fold the page layers into each page | ☑ concept decided (files by purpose, five most-opened pages first) | overnight-suited |
| P4 | **Map standard** (docs/MAP_STANDARD.md) for every water, old and new | ☑ decided (speed limit measured at the start of the run) | |
| P5 | Items F (notices removed, feedback lines kept) and **G: the PC overhaul** (System clean-up › G: phone systems and names on PC, header-only placement, one size for all menus, everything clickable, sharper and more detailed PC drawings) | ☑ F and G decided (2026-11-21) | PC Fish Log untouched |
| P6 | **Install welcome** (director, 2026-11-21: players can't find how to install; option B of three): when the game is opened in a browser (not installed), a welcome screen offers "Install Driftline on this device" with that device's own steps (iPhone: Share → Add to Home Screen; Android: a real Install button; PC: the Windows app download) and "Play in the browser"; it never shows once the game is installed. Install also gets an easy spot in Settings. The Windows download is live (440 KB, built 2026-11-16); a clean install on a fresh PC is not yet tested | ☑ decided (director, 2026-11-21): shown once per device; Install stays one tap away in Settings. Goal: everyone plays the installed version, not the browser | |
**Overnight roadmap batches (director, 2026-11-21):**
| Batch | Projects |
|---|---|
| 1 ☑ built 2026-11-21 (test build 0509) | 1 Fight Feel (P0 + Cam's list #5 fast run turns, #10 hotspot hook attempts; New / Old switch + safety tag) · 2 Squash Pass (Cam #1, #2, #6, #9, PC Full screen, PC pet hat jump) · 3 Cam's Small Changes (Cam #7, #8, #11, #12, #13) |
| 2 ☑ built 2026-11-21 (test build 0632) | 4 PC Reborn (P5 › G): shared sections and pages, header, one size (`__pcSpec`), parity (`__menuMap`), sharper picture. PC-only detail drawings go with Living Maps |
| 3 ☑ (Quiet Waters, Florida Keys, Amazon in 0654; the rest on the 2026-11-21 daytime run: every water checked by `__mapQC` (in the sweep, proven by planting); moments for Willow Pond, Saltmarsh Coast and Ember Springs; night life at Animal Farm and the Nile; life at Corporate Pond and The Buffet; bigger moments at Keys, Buffet, Corporate, Deep, Trench; rain that fits the water; Starfall drawn faster; PC draws moving detail 1.5x) | 5 Quiet Waters (P5 › F) · 6 Living Maps (P4; Florida Keys #3 and Amazon #4 first) |
| 4 ☑ (2026-11-21 daytime run: build refuses missing files; sweep time limits stretch by device speed; Fresh save pass; bug log labels, status, introduced_in / fixed_in checked by the build; SYSTEMS_MAP split from CHANGE_LOG; Clean Pages batch 1 of 5 on phones: Aquarium, Cooler, Settings + Save, Your home, Rods, each in one place, checked identical by an element-by-element fingerprint. Batches 2-5 of Clean Pages (the other pages, then PC's) follow the plan's "one test build per batch of five") | 7 Sharper Tools (sweep fixes, fresh-save pass, bug log, docs tidy) · 8 Clean Pages (P3) |
| 5 | 9 Homes for Every Water (P1) · 10 Goodbye Decorations (P2) |
| 6 (final) | 11 Balance Targets · 12 Report Button (director, 2026-11-21) |

**Night rules (director, 2026-11-21):**
1. Batches 1–4 run in order; Fight Feel always starts first. Batches 5–6 are **not built tonight**: the director and Claude go over them the next day.
2. A safety tag before each project (`rollback/before-<project>`).
3. Bugs and anything else found are fixed on the spot and ship with that batch.
4. **Batches 1–4 are finished in full:** nothing is skipped or left as a held first version; a problem is solved, not set aside. (Director, 2026-11-21: "flag and skip" applies only to batches 5–6.) The map art is still shown as pictures in the morning (see below).
5. (Batches 5–6 only, when they are built: look and feel calls as a flagged first version; a blocker written here and skipped.)
6. **Each batch (1–4) is published to the test builds as soon as it is done**, after the full checks; nothing goes live; 0.4.9 still waits for the director's testing on every platform.
7. After batches 1–4 and all fixes are published: **one final huge QC** over all of it and how it works with the current patch (every platform, the full checklist, the interactions between the batches), fixes published to the test builds.
8. Morning report: what is done, flagged and skipped, the pictures to judge, and testing directions for the director and Cam.

Map art (director, 2026-11-21): drawn overnight without approving descriptions first (Claude writes each piece's side-view line and draws to it); after all batches are done, the director and Cam look at the pictures in the morning and approve or send back.

Old order note (superseded by the batches): P1 → P2 → P4 → P3 → P5; one build at the end, one notes entry, pictures for every changed home.

## System clean-up (from the 2026-11-20 audit; going over each with the director)
- ☑ A. Redundancy counter (above). Starting numbers: PC 293 wrap layers, 67 force-hide rules, 31 timers, 16 watchers; phones 322 / 82 / 33 / 18.
- ✗ 1. Picture comparisons: dropped (director, 2026-11-20: “We will judge and tell you when necessary”; it adds work to every round and they would rather judge looks themselves). Look changes still go to them with before/after pictures, as before.
- ◐ B. (batch 1 of 5 done 2026-11-21: Aquarium, Cooler, Settings + Save, Your home, Rods on phones, each page in one place with the page engine’s pageDone step; next: the next five most-opened pages; overnight project, director 2026-11-20: done while the director and Cam are away; Claude reminds them now and then) Untangle one system at a time, pages first (choices offered: files named by what they do, the five most-opened pages first, one test build per batch of five; estimate 15–25 h of work in about 5 batches plus 3–5 h for shared layers, batch 1 about 4–6 h): fold wrap layers into each page’s own code, files named by what they do; no look change (checked by the existing checks, with before/after pictures of each untangled page for the director). (Ask: OK to move and rename files?) Measured: on phones about 90% of opening Settings is the layers, not the page.
- ☑ C. (first version on the test builds, 2026-11-20: docs/TEXT_STANDARD.md drafted, length limits approved; phone wording written at the source; text checks proven; tips and pop-ups shortened, list in docs/TEXT_CHANGES_2026-11-20.md) Text standard and check: tone, length per place, phone words (“Click or press Space” still in shared text), apostrophes, spoilers in notes. (Ask: draft the tone from the existing jokes, or the director writes it?)
- ☑ D. Map standard decided (docs/MAP_STANDARD.md and docs/HOME_STANDARD.md); building waits for the production queue. Was: what every water needs (from C35), added to the map check. **Homes part decided (director, 2026-11-21): docs/HOME_STANDARD.md**; build plan waiting for approval. Rest of the map list still to go over.
- ☑ E. Docs tidy (2026-11-21): SYSTEMS_MAP keeps the lasting map; the dated round log moved to docs/CHANGE_LOG.md; CLAUDE.md's status trimmed.
- ☑ 2. Bug log upgrade (2026-11-21): status (fixed / open / held), introduced_in and fixed_in columns in docs/qc_incidents.csv; build.ps1 refuses an unknown label, a fixed row without fixed_in or an open row with one (proven by planting).
- ✗ 3. “Report a problem” button: moved to Ideas (director, 2026-11-21: not worth it with two testers who text directly). Was decided: it opens the phone’s Share menu with the report (copy and paste on PC); nothing goes through an outside service. The report: build stamp, device and screen size, page and water, recent errors, a line the tester types. It sits at the top of Settings (director, 2026-11-21), test apps only, never in the live game.
- ✗ 4. Guided real-phone check: dropped (director, 2026-11-21: "we already play on phones"; the director and Cam report what they find).
- ◐ 5. Rest of the checks overhaul: saves check → production queue (no input needed); speed → map standard; **balance targets wanted** (director, 2026-11-21): numbers for how long things take, checked by a tool, and **after a prestige you must clearly feel more powerful**. Numbers to come from the director and Cam.
- ☐ F. Flavour text coverage (director, 2026-11-20): every kind of flavour text in the game (fish notes, item and oddity blurbs, quips, toasts, pet lines, loading and empty-page lines, catch cards) listed in one place, each with its rules (tone, length per place, spoilers, phone words) and a check that every item has its text and that the text follows them. Builds on C.
- ☑ G. PC review (director, 2026-11-20; questionnaire answered and the plan approved 2026-11-21: "the pc plan is right"; director: "pc feels like it's been overlooked for quite some time", so the run also tests every PC button and setting works). Goes into the production run as P5, with extra effort on detail.
  - **Decisions (director, 2026-11-21):**
    1. PC gets every system and naming change the phones got; phones are the reference for content, names, colors, icons and labels. Rules already set (notices removed, text standard, map and home standards) apply the same on PC.
    2. PC keeps its own placement: **everything PC-related lives in the top header** (no side panel). The **Fish Log stays as it is on PC** (the one PC page the director likes). Every other page is redone from its phone version, laid out for the big screen.
    3. Later, PC gets its own written UI rules (its own panels, expandables, layouts), but every system change still lands on both.
    4. **One size for all PC menus:** one text and control scale on every page (like the phones' MB_UI), text always fits, no shrink-to-fit; checked by a PC measurement check like the phones' `__spec`.
    5. **Everything that can be clicked through is clickable:** every chip, badge and count opens its page (the header's "Live: … left" opens Events at that event).
    6. **PC feels like PC:** the big fishing scene stays the priority; sharper pictures at full screen resolution; more detailed PC-only drawings for maps, homes, aquariums and other systems, within a PC speed budget higher than the phones'.
    7. Sizes: full screen 1920×1080 and 2560×1440 (both tested). Mouse only; controller later, not a priority.
    8. Fishing works the same on both (Cam's fishing feel changes come as their own production item once written).
    9. The header's Stats chip keeps letting the player pick what it shows.
  - **What PC lacks next to the phones (Claude's check, 2026-11-21, test build 0159):**
    - Sections: phones have Quests (Goals / Learn / Find / Help), Map, Upgrades, Collection, Stats, Challenges, Customize, Prestige. PC has Fishing, Upgrades, Collection, Challenges, Boardwalk, Customize: **no Quests, no Prestige section** (only tabs inside Waters), **no Stats section**, Boardwalk as its own section.
    - Names: PC "Equipment" = phones "Tackle"; PC "Waters" / "Fishing" = phones "Map". Bait and Oddities are separate PC pages; phones reach Bait from the top-bar chip and fold Oddities into Collection (Oddities / Treasures).
    - Header: phones have Tasks, Home and a labelled Search; PC still shows the old "Next goal" chip (phones moved goals into Quests).
    - Pages without their phone tabs on PC: Bait (Switch / Buy bait / Special lures), Rods (Your rods / Rod rack / Attachments), Bounties (Daily tasks / Weekly quests / Bounties), Aquarium (Your tank / Decorate), Oddities (Oddities / Treasures), Pets (Your pets / Customize), Skills (Catching / Rare finds / Fighting / Coins & XP / Tank & pets), Feats (To do / Done), Events (Calendar / Challenges / Derby), Save (Move progress / Save codes / App), Prestige (Set sail again / Pearl relics). Only Your home already matches.
    - While fishing: the phones' easier-to-watch fight (`mobile/fight08.js`) and boosts that are never hidden (`mobile/boosts07.js`).
  - **Proposed tool (rule 5c):** a PC-vs-phone check that compares sections, page names and page tabs and fails on any difference not listed as a PC exception, so PC can't fall behind again.
- Order (director, 2026-11-20): C, D, E, 4, 5, F, G, then B (overnight), then the report-related items last: 2 (bug log), 3 (Report a problem button) and the Sweep tool bookmark (top of Open now). Nothing jumps ahead of its place.

## Batch 6: the director and Cam's list (2026-11-20, test builds; 0.4.9)
Their words, sorted by area. ⚑ = a number or look the list leaves open: Claude builds it as asked and flags it (Feel call / suggested numbers) for the director and Cam to tune. Order of work: text and small fixes → UI → fishing and fights → economy → art and maps.
**Text and small fixes**
- ☑ C1 Non-fish catches: "Tap to dismiss" (phones) / "Click to dismiss" (PC), not "tap anywhere else to store in cooler".
- ☑ C2 Cast power text stays "cast power" over a hotspot; only its colour changes to the hotspot's colour.
- ☑ C3 Bites: "Reeled in early" and "Missed a bite" only. A missed bite keeps the line out; after 5 missed bites, reel in.
- ☑ C4 Stickleback flavour text: "This is how you remind me..."
- ☑ C5 Oddity on the line: just "Dead Weight" or "Snagged!".
- ☑ C6 Rising temper: "Careful!".
- ☑ C7 Running fish: "It's running!".
- ☑ C8 Strong fish: never "heavier"; "Prepare for a fight, this fish is strong!"; only at 10+ above your strength: "Good luck, this fish is out of your league!" (no number otherwise).
- ☑ C9 Heavy fog: "Heavy fog obscures fish, even the fish don't know if it's day or night." Weather pop-ups can be switched off in Settings.
- ☑ C10 Lily is a dog: no purring (done); on her back for belly rubs her paws keep the right orientation (paws flop over at the wrist, white tops with toe lines; first version, Cam to judge).
**UI**
- ☑ C11 "Scrap all" for Nibbles, like Sell all, with the same filters.
- ☑ C12 Colour choices: a highlighted box around the chosen colour, not the whole preview lit.
- ☑ C13 Customization (face styles first, then every customization menu): the menu never snaps or moves when an option is picked. One shared rule holds the tapped option in place (bo_guard04); PC preview bars keep a fixed slot; previews scroll only when hidden; `__snapQC` checks every page (0 of 175 taps move).
- ☑ C14 Cooler: sort by sell value, aquarium bonus, species, most/least recent; most recent after every restart, otherwise remembers the last choice.
- ☑ C15 Phones: a tab on the top bar (next to Settings) to switch between Aquarium and Cooler while in either.
- ☑ C16 Bait: every section and sub-section sorted by purchase price; "Everyday Bait", "Water Baits" and "Favourite Foods" can be folded, and the page opens folded.
- ☑ C17 Phones, Aquarium: no "bigger tank" benefit text; "How the aquarium works" adds "Increase your tank size for more fish, more buffs, and more income!"; the button reads "Expand Tank · price" with small "Next expansion: X fish" under it.
- ☑ C18 Treasure chests pop-up: the three chests centred (the outer two sit at the frame edge).
- ☑ C19 A big fish that has eaten smaller fish may take the cooler past its limit (the extras still go to the cooler).
**Fishing and fights**
- ☑ C20 A running fish turns to face the other way (fish only; never oddities or objects).
- ☑ C21 Jumps: one fluid motion out of the water, tilting down back in with a splash; a wind-up first (the shadow sinks, then comes up) as a warning. ⚑ timing (first version; ⚑ Feel call: numbers at the top of the fight constants in c_logic.js)
- ☑ C22 A predator eating a smaller fish takes line out gradually for a few seconds, unstoppable (can break the line), distance by rarity (maximum only for mythics), never snapping to the end. ⚑ distances (first version; ⚑ Feel call: numbers at the top of the fight constants in c_logic.js)
- ☑ C23 Letting go of a running fish: fish over 5 lb take line out but tension drops at once; reeling on, tension builds slightly faster and the fish takes no line. ⚑ rates (first version; ⚑ Feel call: numbers at the top of the fight constants in c_logic.js)
- ☑ C24 Second wind: a tiring fish's fight drops more slowly while its temper is high, and if temper stays too high its fight can rise again, a limited number of times by rarity (common 1, uncommon 2, …); 15% chance for common/uncommon, 30% for the rest; "Second wind!" shows briefly. ⚑ thresholds (first version; ⚑ Feel call: numbers at the top of the fight constants in c_logic.js)
**Economy and progression** (numbers are suggestions for the director and Cam)
- ☑ C25 Prestige: remove the "Boardwalk counts for at most a quarter" limit.
- ☑ C26 Deep Cooler boon: +1 cooler space every time you gain cooler space (instead of a flat +1).
- ☑ C27 Nibbles work for all fish of the same rarity.
- ☑ C28 Aquarium feeding: fish swim up to eat; each feed 20% chance a fish's buffs improve slightly (not its income), 5% chance of more income plus another stat. ⚑ sizes (first version; ⚑ Feel call: numbers in ce_nibbles.js FEED_* / c_logic.js HOT_*)
- ☑ C29 Hotspots revamp: colour by minimum rarity (uncommon most common … legendary rarest), better hybrid/shiny/titled odds, rising sparkles for a guaranteed shiny, every colour clearly readable. ⚑ odds and colours (first version; ⚑ Feel call: numbers in ce_nibbles.js FEED_* / c_logic.js HOT_*)
- ☑ C30 Angler strength: a little harder to reach, a few more strong fish when first entering a water, max strength lines up with the hardest waters, some strength held in a boon, strength purchases cost a bit more. ⚑ numbers (first version; ⚑ suggested numbers: Line levels and prices in b_data.js, Strong Arms 2% a rank, LOC_BASE 1.2, LOC_VOY .15 a voyage up to 10)
- ☑ C31 Water unlock coins scale up with voyages, and a slightly higher barrier from the start. ⚑ numbers (first version; ⚑ suggested numbers: Line levels and prices in b_data.js, Strong Arms 2% a rank, LOC_BASE 1.2, LOC_VOY .15 a voyage up to 10)
**Art and maps** (no cop-outs: every new map at the standard of the old ones)
- ☑ C32 Hair: curly back to how it was; no hair through hats; light texturing instead of a painted-on look. Curly is the hand-drawn 0.3.3.1 clusters again (restored from git); under a hat hair is cut at that hat's own lower edge (`hatClipY`, measured from the hat drawing) and big hair is pressed to volume 1.1; 13 fine strands per style. ⚑ look (texture strength, how much afro shows under a hat). Check: `__qa` C32 (proven).
- ☑ C33 Cherry Blossom Lake: wood and metal colour/material editable like every other dock; trees with more distinguishing features, petals resting and drifting on the lake, a nicer temple on shore, fake koi replaced by ducks and water lilies, Mount Fuji further away and larger with other mountains around; full quality pass. Done as asked (cn_waterart.js); the bridge offers wood and Lacquer. ⚑ look (all of it is a first version: Fuji size, tree shapes, pagoda, duck count).
- ☑ C34 Canadian Rockies (Cam): beavers (like Stonebrook's otters) and a beaver dam with a flowing river/waterfall; crystal-clear water showing rocks and weeds on the bottom; a moose; a Canadian flag by a reworked log cabin; Canadian Shield and Rockies close together; more flora and fauna (Canada geese); a fishing canoe with a nondescript angler; clear starry nights; a customizable home. Done as asked; the ledge offers wood and Canoe paint (a canoe on the ledge). ⚑ look (the river is only the waterfall: a river running down from the peaks read as smoke against the sky).
- ☑ C35 Every new map (the 4 new + 6 end-game waters): more populated, functional customizable homes, better effects, occasional map-specific animations, full polish. Every new home offers wood (wooden homes) and a named paint; every map gained shore/water life and one moment every 21-61 s (list in cn_waterart.js and SYSTEMS_MAP); Olympus clouds redone. ⚑ look. Check: `__qa` C33-C35 draws every scene through every moment by day and night and every home in all 72 looks (proven).
- ☑ C36 Fix the seahorse sprites (added by the director, 2026-11-20). Need data if the problem is not obvious on sight: which seahorse, which water, what looks wrong. Done: it had its seahorse drawing, but fish pictures were sized by width, so tall creatures (seahorse, leafy sea dragon, manta) were cut to a strip; they now fit by their real height.

## Batch 3: progression and economy
- ☑ [16] Next water needs 10 catches, +10 per voyage, capped at 50.
- ☑ [24] Rods cost Scales too, scaling with the rod.
- ☑ [23] Hybrids inside their normal weight range: value and aquarium income ×2 (common) to ×5 (mythic).
- ☑ [18] Titled shinies (ancestral, prismatic…) get real stat bonuses: several catch/economy buffs, more gold on later voyages, a boost to the tank's other fish.
- ☑ [19] Fish Nibbles: scrap fish for candy (odds by rarity, +2 shiny / hybrid / titled, max 7), feed a favourite in the Aquarium (drop animation, the fish swims up), passive income with diminishing returns, every 10 feeds a buff roll (10%, 50% at 30), half expire at voyage end, Fish Log shows candy, Trophy Room shows candy eaten.
- ☑ [12] Baits by fish: each fish has a favourite and least favourite bait (small effects); rarity-weighted prices; Epic+ favourites hidden until caught with it.
- ☑ [14] New rod attachments for the newer systems.
- ☑ [15] More skills and more ways to earn skill points.
- ☑ [11] Paths: 15 paths across every system, rarer mechanics deeper in; remove a choice; cost to change or remove rises with the feat's level; menu text fixed; reasons to return.
- ☑ [20] Voyage rework: up to 100 milestones, upgradeable end-of-voyage buffs (weight ranges, derby multipliers, streak buffs every 50/40/30/20/10 with ranks and cooldowns, many more), pearls harder per pearl within a voyage, pearl shop +1% gold / +1% XP (2 pearls a level, 100 levels), many one-level pearl relics; heavier late-game scaling.
- ☑ [52] Boardwalk: deeper and more varied; tickets first with occasional coin wins (never breaking pearls or the shop); maybe gamble with cooler fish.

## Batch 4: looks
- ☑ [10] Rod: gentle sway; the second hand turns the reel; left/right-handed setting; arm length and rod proportions.
- ☑ [50] Wizard hat effects redone.
- ☑ [57] Fish eyes: varied, blended into each fish.
- ☑ [59] Character models: new natural styles (keep the current ones), many more hair, face, nose, eye and mouth options.
- ☑ [1] More pet base colours: some in the shop, more as Boardwalk rewards.

## Batch 5: content
- ☑ [2] Oddities to 300 (memes, household objects, products, ancient and mythical treasures; one singing bass mount; some per water), rarities shown once found, conditions and odds on click, gold scaled to your highest water (a bit less in earlier waters), repeat finds worth more.
- ☑ [3] Amazon rainforest water (waterfalls, piranhas, arowana).
- ☑ [4] Cherry Blossom water (Japan, Mount Fuji, eels, carp, koi, anime-referenced fish).
- ☑ [5] Canadian Rockies water (sturgeon, trout, river monsters, clear water, a little syrup).
- ☑ [6] Florida Keys water (shallow saltwater sport fishing, chaotic Florida fauna).
- ☑ [7] Each new water at the standard (52 fish with meme/bonus/rarity split), placed where it fits; Hollow Trench stays last; stutter-tested and as lively as the others.
- ☑ [69] Six end-game waters (decided 2026-11-19: the director listed six themes for "5" slots and asked me to decide; all six stay, one more unlocks with each voyage from the 2nd to the 7th), outside normal progression, in this order: Animal Farm (voyage 2), Buffet (3), Corporate (4), Nile / Egyptian (5), Robot / cyberpunk (6), Olympus / Mythos (7). Working names: Animal Farm, The Buffet, Corporate Pond, The Nile, Circuit Lake, Mount Olympus.

## Added by the director during the big patch (2026-11-19)
- ☑ Tide Pass overhaul: 100 levels in 5 chapters, Pass-only auras / bobbers / lines / pet colours, pearls and Boon points, showcase.
- ☑ PC display: interface size by window (Auto, 85–200%), picture quality, viewport units undo the zoom (pc/ui_display.js).
- ☑ Visual originality pass: own platform per new water, water-specific fish features, varied body plans, per-oddity details.
- ☑ Real aquarium sizes and depth; hair rebuilt (`ct_hair.js`); build silhouettes.
- ☑ Batch 6, the fight meta: fish must be tired out (FIGHT_T by rarity), tension floor in runs, rare/epic surges; holding through runs loses rare+ even maxed. Caps: oddities 20%/cast, hotspots ×4, shiny 15%.

## Older roadmap (still open)
- Android native app (shelved by the director 2026-11-19, "later in the roadmap for sure"): a thin WebView wrapper like the PC desktop app, loading the Android build from the site (patches stay instant, the app shell rarely changes); true full screen, landscape lock, 60 Hz request, Back button, keep-awake, vibration; save moved once with the transfer code. Not a TWA (needs the domain root for Digital Asset Links). Needs the Android build tools (~1 GB, director's OK) and later optionally a Play Console account. Goal: Android as reliable as iPhone.
- Lily polish: a soft rim light so her black coat reads at night; hats following her head tilt.
- Transfer safety net: ntfy.sh is a free relay (~250 messages/day/IP, files expire after ~3 h); move to a tiny own relay if it gets unreliable.
- Code tidy-up: fold the per-update files and the `extraActN` chain into feature files with one action registry, without changing saves.
- Accessibility: rarity shown by more than colour, reduced motion, bigger touch targets (decision: see "Open now").
- Save size: keep codes compact.

## Ideas (nothing decided; moved from CLAUDE.md 2026-11-20)
- **Report a problem button** (parked 2026-11-21; revisit when there are more players than the two testers): at the top of Settings in the test apps; opens the Share menu (copy on PC) with the build stamp, device, screen size, page and water, recent errors and a typed line; nothing through an outside service.
- **Cam's concepts:** per-water events with a gameplay hook on one shared event system; a backyard pond (breeding, after the trophy room).
- **Friends without accounts:** visit a dock from a code, send gifts/fish by code, a weekly friends' derby leaderboard.
- **Seasonal and live content:** holiday decorations, limited-time fish, weekend derbies, seasonal waters.
- **More personal gifts** using the Lily pattern.
- **New places:** a deep-sea boat trip, a night market, a secret pond behind a feat chain.
- **Cozy activities:** cooking your catch for short buffs, a grumpy lighthouse keeper story, boat upgrades.
- **Aquarium:** fish that interact, themed tanks with bonuses, visitors who comment.
- **More Boardwalk games,** kept light and fair.
- **Optional cloud backup** via a code.
- **Patch test checklist** (archived by the director 2026-11-20): a per-patch list of what to try for each change, with iPhone / Pixel / PC ticks, so it's clear when a test build is ready to go live. Overlaps with the test card the testers already get (one short line per change); revisit only if the director asks.
- *(Removed: "controller support on PC, haptics on phones": already in the game since 0.3, `src/k_controls.js` (gamepad: A/Cross casts, right trigger reels; phone vibration on bite, near-snap and catch, Android only because iPhone browsers can't vibrate).)*
