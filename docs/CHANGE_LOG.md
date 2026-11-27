# Driftline change log: what each round changed

The dated record of every round's changes (moved out of docs/SYSTEMS_MAP.md on 2026-11-21, Sharper Tools: the map keeps only what affects what).
New rounds add a section at the bottom. History only: when a change also adds a lasting "what affects what" row, that row goes into SYSTEMS_MAP.md.

## Added in 0.4.8.1
| Piece | Defined in | Shows up in |
|---|---|---|
| `shinyFxDraw(c,t,o)`, `sfxFlare`, `SFX_PAL` (shiny FX library) | `ca_shiny06.js` | still pictures (via fishCanvas/paintFish), fish in the water and tank (`shinyFxWater`, called from `al_decor04.js`), Starry cape twinkles (`l_wear.js`), cosmetics FX (`cb_wearfx06.js`) |
| `A3FXP` anchors (hat / torso / neck transforms) | filled in `g_angler.js` (a3Body) | read by `wearFxDraw` in `cb_wearfx06.js`, called at the end of `drawAngler3` when `o.t` is given (animated) |
| Legs, seat, stance | `g_angler.js` a3Body | every angler drawing (scene, Wardrobe, Boardwalk, Tide Pass, boards, previews) |
| Back items (wings, jetpack, capes, lantern, flag) | `l_wear.js` a3Back | same as the angler |
| Saltmarsh seal | `ao_maps033.js` | Saltmarsh Coast only |
| Phone Aquarium header, Cooler guide | `mobile/pages06.js` | Android + iPhone |
| Phone side panel (sideways) | `mobile/ui_modern06.js` (`#catdock`, `#menuov .secbar`) | Android + iPhone held sideways |

## Round 7e (2026-11-18)
| Piece | Defined in | Rule |
|---|---|---|
| PC Send / Get progress in Settings > Save & codes | `pc/ui_fhd.js` (end: `refreshXfer` wrapper) | the transfer section is drawn by `renderSave` inside Settings on PC, so it must be redrawn there when `XF` changes (core `refreshXfer` only handles the Save page). Live hotfix 0.4.8.2 prepared from tag v0.4.8.1 (PC file only) |
| Phone aquarium tank pacing | `mobile/perf_round6.js` section 2 | every frame at 60 Hz, every other frame at 120 Hz (measured), steady half rate while scrolling. Never a fixed ms cut-off |
| Phone aquarium full-width lists (sideways) | `mobile/aquarium07.js` (`AQ_FULL`, `.aq07-fs`, `.aq07-full`) | hides `.aq07-pin`; list rules must not use `display:...!important` on elements `x_sections.js` hides inline |
| Phone Fish Log Normal / Shiny | `mobile/fishlog07.js` (PC's own is in `pc/ui_fhd.js`) | resets to Normal for each new fish; Shiny only for caught species |

## Versions on live (2026-11-18)
PC is on **0.4.8.2** (PC-only hotfix; tag `v0.4.8.2` marks its source commit, the published file is main `63d9896`). Android and iPhone are on **0.4.8.6.2** (plus live fixes: update bar via version-phone.txt, tag `v0.4.8.6.2-upd`; 60 fps default, tag `v0.4.8.6.2-fps`) (ghost patch: notices below the water chips, badges never cover names, info cards close when a menu opens, Android full screen remembered + default, tester tools; tag `v0.4.8.6.2`), before that **0.4.8.6.1** (patch notes close, Aquarium layout, fps counter; tag `v0.4.8.6.1`), before that **0.4.8.6 "Tidy Up"** (tag `v0.4.8.6`, 2026-11-18 21:00, after the big pre-live QC on both phones at 667/874/956 incl. search, Quests, catch flow and a PC sanity run; same per-platform method: release build, `site/pc.html` + `site/version.txt` restored, only the phone pages + router committed). Before that 0.4.8.5(.1) and 0.4.8.4. Before that 0.4.8.3 (tag `v0.4.8.3`, published 2026-11-18 by building the release and committing only `site/android.html`, `site/ios.html` and the router; `site/pc.html` and `site/version.txt` were restored from HEAD and the phone pages keep the live build stamp `2026.11.18-0315`, so nobody gets an update bar: phones pick up 0.4.8.3 the next time the game opens, since the service worker always loads fresh). **Phone-only rounds never push `site/next` (the PC test app):** restore `site/next` from HEAD before committing and publish phones with `publish_testapps.ps1`. The next release on any platform must be 0.4.8.5 or higher; when PC catches up, it takes the shared changes since 0.4.8.1 (willow, open-sea chop, angler, effects) and needs a full PC test.

## Weather news on phones (0.4.8.3)
`mobile/weather07.js` wraps `toast` on phones: the two weather notices (`e_ui.js` "Weather: ..." when the weather changes, `bq_feat04.js`
"... weather starts in under a minute") become a small line `#mbwx` under the scene chip (pointer-events none, 5 s). Blocked while
`MENU_OPEN`, a popup card (`G.st==='event'`, `#evcard` visible, `ev-open`), a cast or a fish (`charging|flying|bite|reeling|landing`) or the
page is hidden: the newest note waits (1 s check only while one waits) and is dropped if no longer true. Every other notice is unchanged.
Change either weather message's wording: update the two patterns in `weather07.js`. Test hook (`?test`): `__wxNote()`.

## 0.4.9 big patch, part 3 (2026-11-19, test builds)
| System | Files | Touches |
|---|---|---|
| Paths (15 forks, ranks, remove) | `cg_paths.js`; hooks `pathMul/pathAdd/pathSave` inline in `c_logic.js` (junk, hotspots, unlock, pearls, eat, bait use, snag), `n_play.js` (hybrid, prism, hx, eat value), `d3_update.js`/`t_board.js` (spinEvery), `ce_nibbles.js`, `d5_v16.js` (offlineCap, specFee by level), `d7_v20.js` (cozy) | Paths page, bonus(), weather(), catchW, rollFish, landFish, saves (pathXP) |
| Voyages (pearl shop, Boons, milestones, relics) | `ch_voyage.js`; `c_logic.js` coinMult/xpMult/pearlsFor (PEARL_EXP, pearlOld, pshopLv) | Prestige page (PC Waters, phones prestige tab), retire handler, bonus(), pathMul wrapper, saves (pearlOld, pearlMig, pshop, boons, boonPts, boonMig) |
| Boardwalk additions | `ci_boardwalk.js` (wraps bwGamesHTML, addTickets) | Games view, bwEarn pearl cap |
| Tide Pass overhaul + pet colours | `cj_tidepass.js` (PASS_MAX 100 in d7_v20), line/bobber hooks in `d_draw.js` | Pass page, Wardrobe, drawAngler (auras), pets page, Boardwalk chests (petColourPrize), saves (owned.auras/bobs/lines, look.aura/bob/line, passMig) |
| Start-up save pass | `ck_bootfix.js` (LAST in core) | re-runs the full migrate chain on the stored save and copies the keys later rules own |
| Looks | reel hand `g_angler.js` (A3REEL, lefty), wizard `cb_wearfx06.js`, eyes `i_fish.js` (eyeS), faces/hair `cl_faces.js` | every angler/fish drawing |
| New waters | data `cm_waters.js` (BEFORE c_logic: the save loader must know them), scenes `cn_waterart.js`, platforms `cp_plats.js`, fish features `cq_traits.js` | LOCS order, bestLoot (excludes end-game), unlockMet/unlockLine, egOpenAdd, egScale in rollFish |
| Oddities to 300 | `co_oddities.js` (dedupe, ODD_NEW + ODD_SPARE, ODD_ART templates, oddDecor, oddBase, oddKV) | pickJunk, landJunk base, Oddities pages (PC br_pc05 + ui_fhd tier 4 = not found, phones/e_ui data-odd cards) |
| PC display | `pc/ui_display.js`; UIZ in `c_logic.js` resize; viewport units read `--uvh/--uvw` (41 rules) | every PC page; any new CSS on PC must use `calc(N*var(--uvh,1vh))`, never raw vh/dvh |
| Fight meta | `c_logic.js` FIGHT_T / FIGHT_LANDK / FIGHT_TEN_FLOOR / fightTireT; surges from RK≥.15 | every fight; QA "batch 6 fight" |

## Hotfix 0.4.8.9.4 + test builds stamp 2100 (2026-11-19)
| Change | Owner | Affects |
|---|---|---|
| Phone top bar "out of room" also counts a cut Bait name | `mobile/header08.js` fit() `over()`; QA hook `window.__hudFit` (`?test`) | Tasks / Live step-aside order, Bait chip ellipsis (polish08 `#mbbait.stat` may shrink); QA "Bait name is never cut" |
| PC Pets tile styles moved out of the shared file | `pc/ui_pets_find.js` (was `bm_ui04.js`, baseline 75 → 63) | Pets › Find more rows; page tabs hide `.pet-hid` tiles again |
| Live hotfix patch script | `tools/hotfix_0.4.8.9.4.ps1` (site → testapps/hotfix for the phone check, site → site to ship) | live pages only; test copy at /driftline-test/hotfix/ uses the live save |

## Phone notes merged (2026-11-20, test builds)
| Change | Owner | Affects |
|---|---|---|
| Android + iPhone release and test notes in one file each | `mobile/notes_release.js` (`phoneNotes()` picks per-phone lines by `DL_BUILD`), `mobile/notes_test.js` (label by `DL_BUILD`); `src/android/` emptied, `src/ios/notes_*` removed; build.ps1 `$layers` | What's new card and test card on both phones: output identical to before (checked entry by entry), plus two new test card lines |
| QA: Nibbles and Boardwalk prize tests clear Paths first | `bn_qa04.js` | `__qa` on saves with Paths chosen |

## Content standard and its check (2026-11-20, test builds only)
| Change | Owner | Affects |
|---|---|---|
| Content standard (8 rules) | docs/PLATFORM_DESIGN.md "Content standard" | every new or changed card and page, all platforms |
| `__contentQC(o)` (`{extreme}`, `{only:[pages]}`, `{keepOpen}`), `contentQCExtreme()`, `CONTENT_QC_EXCEPT`; `qaAllPages` moved to the top of the QA file (shared by `__qa` and the content check) | `bn_qa04.js` (test builds only, never in a release) | round checklist step 4 |

## Hotfix 0.4.8.9.5 (PC only) + test builds (2026-11-20)
| Change | Owner | Affects |
|---|---|---|
| Rods "In your hands" column scrolls instead of squeezing its cards (the card hid its Upgrade button and attachment slot at full HD) | `pc/ui_fhd.js` (`.fhd-you .fhd-body2 > *{flex-shrink:0}`); live: `tools/hotfix_0.4.8.9.5.ps1` (PC page only; phones copied unchanged) | PC full HD (1800×950 and up) Rods page; PC "what's new" 0.4.8.9.5 |

## One-click sweep (2026-11-20, tools only; no game change)
| Change | Owner | Affects |
|---|---|---|
| Sweep page: every automatic check of round-checklist step 2 in fresh game copies, one report, test save put back, new-since-last-run list | `tools/sweep.html` | the round checklist (CLAUDE.md steps 2 and 8) |
| `POST /report/<name>` (writes `tools/shots/<name>.json`) | `tools/serve_local.ps1` | local testing only |
| Sweep page copied to `site/next/sweep.html`; preview pages opened with `?sweep` record start-up errors and use a 16 ms frame timer (preview only) | `build.ps1` | preview builds |
| Tester tools › Run every check (link to the sweep; on phones it opens the published page, so the checks run in the real phone browser) | `src/z_stats.js` (inside `testerHTML`, preview only) | Stats on test builds |
| `__pathsAll()` (a Path in every tier, saved for real; for the #130 start-up check) | `src/bn_qa04.js` (preview builds only) | none in release builds |

## Batch 6, part 3 (2026-11-20, test builds): C10, C13, C20–C31, C36
| Change | Owner | Affects |
|---|---|---|
| An option you pick stays put: the tapped option's screen spot is held through the redraw (and ~0.35 s after) by moving its scroll box; empty room at the end when the page got shorter; lets go on wheel/touch/keys or a preview reveal | `bo_guard04.js` (shared) | every page with option buttons (aria-pressed), all platforms |
| PC preview slot: `pvHintHTML()` "Try before you buy" with invisible copies of the bar's buttons; shown only on PC (`pc/ui_fhd.js`), phone pages skip `.pvhint` | `d6_preview.js`, `d7_v20.js`, `a_head.html`, `pc/ui_fhd.js`, `mobile/aquarium07.js`, `mobile/dock08.js` | pets, Your home, aquarium |
| `pvReveal(id)`: try-on scrolls to the preview only when it is mostly out of sight | `d6_preview.js`, `d7_v20.js` | Wardrobe shop, aquarium, Your home |
| PC pets right column `scrollbar-gutter:stable` | `pc/ui_fhd.js` | PC pets |
| Phone no-name-twice runs again behind the page engine's tab switch | `mobile/polish08.js` | every phone page tab |
| Fights: fish faces its swim direction (G.face), jump wind-up (G.ev 'windup', JUMP_WINDUP), predator line pull (G.strip, EAT_STRIP*), letting go/reeling into runs (RUN_REEL_TEN, RUN_LINE_KG), second wind (SW_*, G.swN/hotT/swT) | `c_logic.js`, `n_play.js`, `d_draw.js`, `mobile/fight08.js` | every fight, both fight messages |
| Boardwalk coins count in full toward pearls (`bwEarn`) | `au_fix034.js`, `ch_voyage.js`, `ci_boardwalk.js` | Prestige pearls |
| Deep Cooler +rank for every cooler level; Strong Arms boon (+2% Angler strength a rank) | `ch_voyage.js`, `c_logic.js` (anglerStr) | cooler size, strength, fight tiring |
| Nibbles per rarity (`nibKey`, `nibFold`, `nibAdd`, `nibRarName`; saves fold species keys in `migrate`) | `ce_nibbles.js`, `c_logic.js`, `ci_boardwalk.js`, `co_oddities.js`, `e_ui.js`, `mobile/quests08.js` | Cooler scrap, Aquarium feed, Fish Log, Boardwalk and oddity prizes |
| Aquarium feeding: fish swim up (`feedMove`), `feedRoll` (fdb/fdi per fish, saved and validated) | `ce_nibbles.js`, `cs_tank.js`, `d2_extra.js`, `c_logic.js` | aquarium income and bonuses |
| Hotspot tiers (`HOT_TIERS`, `hotTier`, G.hotMin/G.hotShiny), colours in drawing and the aim marker | `c_logic.js`, `n_play.js`, `d_draw.js` | catches in hotspots |
| Line levels/prices (C30), water prices by voyage (`LOC_BASE`, `LOC_VOY`) | `b_data.js`, `d5_v16.js` | Tackle, Waters, Quests journey |
| Fish pictures fit by real height (`creatureBox`, `fishFit`) | `d_draw.js` | every fish thumbnail (only tall creatures change) |
| Lily belly-rub paws | `d10_lily.js` | Lily only |
| QA: `__snapQC`, `__strTable`, `__creatureBox`, tests C21–C31 | `bn_qa04.js`, `tools/sweep.html` (Options stay put) | test builds only |

## Batch 6, part 4 (2026-11-20, test builds): C32–C35 hair and maps
| Change | Where | Affects |
|---|---|---|
| C32 curly = the hand-drawn 0.3.3.1 clusters (`drawCurly3`, `CURLY_LOBES`), coils draw the same | `ct_hair.js` (drawHair3 routes curly/coils) | every angler drawing: game, Wardrobe previews, thumbnails, pets' riders |
| C32 hair cut at each hat's own lower edge (`hatClipY`, cached per hat, never above -63.9) for the head hair and the back hair; big hair pressed to `HAIR_HAT_VOL` 1.1 under a hat | `g_angler.js` (both hair clips), `ct_hair.js` | every covering hat × every style; open and full hats unchanged |
| C32 strand texture (`hairTexture`, 13 strokes clipped to the main mass) | `ct_hair.js` | every parametric style; the cost is a few strokes per angler draw |
| C33 Cherry Blossom scene rebuilt: `waFuji`, `waCherry`, `waPagoda`, `waToro`, `waLily`, `waDuck`; ducks replace the koi; petals on the water; gust every 47 s | `cn_waterart.js` | the blossom land cache (redrawn per phase), live layer, reflections |
| C34 Rockies scene rebuilt: Shield rocks, birches, cliff + waterfall (`WA_FALL`), beaver dam and lodge, beavers (26 s cycle), moose (drinks every 23 s), geese (V every 37 s), canoe angler, `waCabin` + `waFlag`, fireweed, clear-water rocks and weeds, `sky()` stars and Milky Way | `cn_waterart.js` | rockies land cache, live layer, sky hook (night only, skipped in gloom) |
| C35 every new map: `WA_MORE[id]` shore/water/live parts called from each scene (`waMore`); moments: Keys dolphins 29 s, Amazon boto 23 s, Farm tractor 61 s, Buffet meatball 33 s, Corporate plane 25 s / helicopter 53 s, Nile crocodile 21 s / caravan 110 s, Circuit glitch 31 s, Olympus Pegasus 41 s; Olympus clouds redone | `cn_waterart.js` | the eight scenes' land caches and live layers |
| C35 homes: wood on bridge/ledge/stilts/haydock/felucca (`waWood`: the starter oak keeps each home's natural wood), a named paint on all ten (`WA_PAINT` → `HOME_PAINT_NAMES`/`HOME_PAINT_PARTS`, drawn with `waPaint` = `homeHull`); the ledge got a canoe | `cp_plats.js`, `bu_home05.js` (`homePaintName`, `homePaintLine`), phone `home06.js`, PC `br_pc05.js` (heading and note) | Your home page on both platforms (Hull paint heading now named per home), try-before-you-buy wood preview (`DOCK_PV`), saves unchanged (`S.dock.wood/hull`) |
| Checks: `__qa` C32 (hair above each hat's edge read from the picture) and C33–C35 (every scene × day/night × t 0–130 s, every home × 72 looks); both proven with planted bugs | `bn_qa04.js` | `__qa` takes ~3 s longer |

## Redundancy counter (2026-11-20, build only; no game change)
| Change | Affects | Check |
|---|---|---|
| build.ps1 counts per build: unused functions (refused), wrap layers, force-hide rules, setInterval, MutationObserver (may only go down; `tools/redundancy_baseline.json`, lowered by the build) | every src file; a new timer, watcher, wrapper or hide rule anywhere refuses the build | planted each of the six once: refused; auto-lower tested |
| Deleted unused: boardwalkBanner (d3_update), clawHTML (d8_v21; the claw machine draws from t_board), pathOn (cg_paths), bountySlots (e_ui), specRow (d5_v16) | nothing: no callers | full sweep |

## Memory fix (#151, 2026-11-20, test builds)
| Change | Affects | Check |
|---|---|---|
| `renderPanel` (e_ui.js) releases the pictures the previous redraw dropped (only those no longer on the page), at the next redraw and once idle | every page on every build; anything that keeps a canvas element off the page and puts it back later would come back blank (none found) | qa memory test; full sweep |
| `drawAngler3` (g_angler.js): only the angler on the water keeps its own scratch canvases; every other picture shares one set per size (`A3SCR`, last 6 sizes) | wardrobe, previews, look sheets, hair check; same pixels (cleared each time, exact size) | qa memory test, C32 hair (pixel check), content checks |

## From the first real-phone sweep reports (#152–#156, 2026-11-20, test builds)
| Change | Affects | Check |
|---|---|---|
| `sellBase()` (c_logic.js): one sale price formula for `sellMult` and Market Rush's fx (bk_events036) | every sale price; Market Rush with the Merchant Path now a true 30% | qa Market Rush (with and without Merchant, ±0.5%; proven) |
| Phone Bait page (waters08.js): an invisible stand-in for "Switch to worms" keeps the Bait in use card one height | phones only | snapQC on a Worms + one bait save (proven) |
| C13 hold (bo_guard04.js): also puts a sideways-scrolling row back so the tapped option stays put; keys match option buttons only | every page with a sideways chip row, every build | snapQC at 667×375 with every water unlocked (proven) |
| Phone top bar fit() (header08.js): last step `.mb-compact` trims chip padding | phones sideways, narrow | __spec at 600 / 580 (proven), 667 / 956 unchanged |
| Tests: Twin Hook measured from a clean start; snapQC keys match option buttons only | tests only | |

## Text standard (C, 2026-11-20, test builds)
| Change | Affects | Check |
|---|---|---|
| `PLAT.touch()` (a3_plat.js; phones: always) and both wordings written at the source; the phone swap list (TOUCH_TXT, its 2 watchers and a renderPanel layer in pages08) and the frame07 bite/card patch deleted | hints, catch card, Fish Log hint, pet hint, transfer text, casting setting, frenzy feat | `__qa` text standard; `__contentQC` rule 6 (every visible line) |
| Catch card sets its bottom line every time (stayed on “dismiss” after an oddity) | every build | |
| Shorter hints, fight cues (d_draw + phone fight08, same lines) and pop-ups; jokes untouched | every build | `__qa` text standard (lengths) |
| Scrap and its tooltip name the Nibbles’ rarity (outdated since C27); weather warning “X in 1 min: …” (phone weather07 parses it) | every build | |
| `__textInv()` (test builds): every kind of player text with lengths; `__qa` keeps every pop-up it causes | tests | |

## Home format pilot: Willow Pond (2026-11-21, test builds; docs/HOME_STANDARD.md)
| Change | Affects | Check |
|---|---|---|
| `src/cv_homefmt.js`: HOMEF (format homes; pilot `pond`), HF geometry, stored picture (`hfPaintCache`, repainted on a choice, size or light step), live light/ripples (`hfDraw`), bank (`hfShore`), supports (`hfPost`), Home page (`renderHomeF`, `hfSections`, `hfFrame`), choices (`hfAct`, saved in `S.dock.el`) | Willow Pond only; every other water keeps the old home system | `__qa` home format test |
| Owner hooks: `v3Platform` (f_v3scene) draws format homes; `drawHome` (d7_v20) skips decorations; `renderHome` and `extraAct5` route to the format; `drawPetScene` (d3_update) ignores dragged pet spots; `dockCopy`/`DOCK_KEYS` (bm_ui04) carry `el`; `applySections` (x_sections) makes the 5 tabs | pond: no decorations, fixed pet spots, 5 tabs | `__qa`, `__spec`, content checks |
| Phone Home page (dock08): format branch (close-up, strip, 5 tabs), shared `mkTog`; crop → `hfFrame`; no dragging. home06 skips its light/hull block on format homes | phones | `__spec` 956×440 |
| PC Home page (br_pc05): format branch (close-up on top, parts underneath, taller view `dk-hfp`); `DK_CROP` → `hfFrame`; no dragging | PC | content checks |
| pages08: `.mb-swrow` display rule no longer overrides the tab engine's hiding (`:not([style*="display: none"])`) | every phone page with colour swatches in tabs | `__spec`; visible-rows check |

## Overnight batch 1 (2026-11-21, test builds): Fight Feel, Squash Pass, Cam's small changes
| What changed | Affects | Checked by |
|---|---|---|
| `src/c2_fightfeel.js` (new, core): Cam's fight (`fightNew`, `ffInit`, `ffStart`/`ffEnd`, `FF` numbers, `hookTries`, `waterDepthM`/`waterDeep`, `fightMsg`, `fightZone`). `fight()` (c_logic) hands over unless the Tester tools switch says Old (`FISH_OLD`, localStorage `dl-fish-old`, test builds only); `hookIt` calls `ffInit` | every fish fight, both HUDs, the fight simulator | QA "Cam's fight feel" (proven: no-reel escape planted), "fight pass", "fights: geared anglers", old-fight tests via `TOLD` |
| Missed bites (c_logic `update`): tries from `hookTries()`; all missed at a hotspot → `endFight('baited')` (bait and streak); elsewhere → line in, streak kept. `breakStreak(why)` puts the reason into the streak message | bites, streaks, bait | QA "Cam's fight feel" |
| Drawing: instant turn for a running fish, jumps away mirrored, dive depth on the shadow (d_draw); dive band on the PC line bar and the phone ring; one shared instruction `fightMsg` | PC + phones | QA fight tests (no picture check) |
| Oddities (`snagFight`): faster reel, sooner and stronger snags in the new fight | oddities, hats | QA "oddities snag" |
| Rod length (b_data GEAR.rod): described by its rare odds in the new fight (casts reach 40 m at the far edge) | Tackle, Stats | content check |
| Hollow Trench: 3,000 m +, uncommon +2.5, rare +3, epic +1 strength | trench fights, Waters card | QA "Cam's fight feel" (depth) |
| Uncharted Waters (cm_waters): end-game names and blurbs hidden until their voyage (getters), then opened for coins (`egCost` via `locCost`), kept in `S.egPaid` (BOOTFIX key); `locPrevOk` | Waters page (PC + phones), unlock action, prestige | QA "batch 5 waters" (rewritten) |
| Bounties badge: one count `bountyReady()` (bq_feat04) used by e_ui's hud; the second writer was removed | Bounties tab, rails | QA "Cam's fix list" (proven: old count planted) |
| Map pictures: kept in IndexedDB (`dl-thumbs`, per build and home), drawn back to back while the Map is open | Waters page | by hand after a restart |
| Nibbles: tier words in scrap messages; plain feeds patch the page (`nibPatch`) | Cooler, Aquarium | QA "Cam's fix list", Nibble test |
| Cooler: Scrap all beside Sell all (au_fix034; PC side panel ui_fhd; phone strip pages08); Rarity sort | Cooler PC + phones | QA "Cam's fix list" |
| Distances and depths: `dStr`, `depthStr` (c_logic), setting `dist` (device key) | fight HUDs, Waters cards, Settings | QA "Cam's fix list" |
| Pets › Customize: color rows always present (greyed when they don't apply) | Pets PC + phones | `__snapQC` pets |
| Driftline Test app (desktop/DriftlineTest.cs): Full screen by message from the game (pc/ui_settings) | PC test app only | director's check |

## Overnight batch 2 (2026-11-21, test builds): PC Reborn
| What changed | Affects | Checked by |
|---|---|---|
| Sections: one shared list in `bm_ui04.js` (Quests, Map, Upgrades, Collection, Stats, Challenges, Customize, Prestige); new tab buttons in `a_head.html` (quests, bait, oddities, prestige; Waters → Map). The phone files' own section edits were removed | every menu, both rails, the PC header | parity check (`__menuMap`), QA "every page in the menus exists" |
| `src/cw_pages08.js` (new, shared): Quests (lessons, Find, Help, goals; words per device through `q8dev`), Prestige, Bait (Switch / Buy bait / Special lures; Tackle shows Gear only), Oddities (two tabs, pictures drawn as they come into view), `liveNow`, one `renderCooler` hook (`SHARED_PAGES`) | PC + phones | QA, `__questsQC`, parity |
| `src/cx_pages.js` (new, shared): the page engine (strip, tabs, one body) and every page's parts (`CFG`), as `PAGES.before/after`; each platform hooks it in (mobile/pages08.js at its old place, pc/pages_pc.js last) and styles `.pg08`; `PAGES_SKIP` (PC: journal, aquarium, home); `PG_COLS` per platform; `__menuMap` | every page | `__pcSpec`, `__spec`, contentQC |
| `src/pc/pages_pc.js` (new): PC frame CSS, PC_UI sizes, Stats left out of the PC sections, Level/Coins links, `__pcSpec` | PC pages | sweep "PC sizes" at 1920, 2560, 1440 |
| Removed PC-only layouts: Fishing/Equipment/Boardwalk header restructure and PC Bait page (br_pc05), two PC Oddities pages (br_pc05, ui_fhd), Events / Tide Pass / Boardwalk / Rods / Pets / Cooler / Feats layouts (br_pc05), Skills+Save boards, Rods pair, Cooler side panel, Stats one screen (ui_fhd), Feats board and reader (bm_ui04), Settings "General" merge (ui_settings); dead styles with them | PC | QA, contentQC PC, parity |
| PC header: sections fill the middle (icon over name, br_pc05 header block); Home and Tasks chips (ui_fhd); goal chip opens its page (bj_polish036); Map label | PC header | header measured at 1920/1440 (no wrap, no cut text) |
| Fight display: the phones' tension ring is the shared `drawFightHUD` (d_draw); mobile/fight08.js deleted | PC + phones | QA fight tests |
| PC picture: Auto draws at 1.5× (pc/ui_display renderDPR) | PC water | `__drawCost` (0.92 ms either way) |
| Shared fixes found on the way: Bounties daily card `display:grid!important` (bm_ui04) beat the page tabs; Quests' live line never showed (liveNow was local to a phone file); Feats headings show the category bonus | PC + phones | QA "page tabs: a part hidden by a page tab never stays on screen" |

## Overnight batch 3, first part (2026-11-21, test builds 0632): Quiet Waters, Florida Keys
| What changed | Affects | Checked by |
|---|---|---|
| Quiet Waters: the weather-changed notice (e_ui hud), the event-live notice and the challenge-started notice (bk_events036), the special-weather-soon notice and its timer (bq_feat04) are gone; mobile/weather07.js (phone notice box) deleted; Settings › Weather pop-ups removed (d2_extra, DEV_KEYS, fresh) | fishing screen, Settings | QA text standard, contentQC |
| Florida Keys (cn_waterart.js): beaches, a bigger bridge with a hump (`keysDeck`), traffic on it (`keysVehicle`: car, van, box truck, semi; lights at night; fade at the ends), speedboats and sport-fishing boats (`keysFastBoat`), a fish school deep in the foreground right, gulls by day only | Keys scene, its Map picture | pictures (tools/shots/keys_*.png), `__drawCost` |
| Amazon (cn_waterart.js `V3SCENES.amazon`, `amzTree`): layered forest with emergent trees, cliff ledges/moss/boulders, falls ending in a foam pool, the island narrowing the channel, roots, lily pads and water lettuce; live: drifting branches, caiman, bullfrog, dragonflies, butterflies, macaws, fireflies; one moment a minute (dolphin 0–3 s in WA_MORE, anaconda 20–32 s, basilisk 40–43.5 s); dart frogs in `fore` | Amazon scene, its Map picture | pictures (tools/shots/amz*), QA "new maps draw through every moment" |
| Stilt deck (cp_plats.js `stilts`): stilts end in the water with ripples (they ran to the bottom of the screen), roof posts with real width | Amazon home | pictures |
| build.ps1: refuses a listed source file that does not exist | every build | proven by a planted missing name |

## Daytime run, batches 3 and 4 finished (2026-11-21, test builds)
- **Living Maps (batch 3):** every water checked against docs/MAP_STANDARD.md by the new `__mapQC` (bn_qa04.js, `MAP_STD`; sweep part Maps on the phone build and PC; proven by switching off the Ember geyser and planting a drawing error). New: Willow Pond's moment (ducklings by day, an owl at night, f_v3scene.js, every 50 s); Saltmarsh Coast's porpoises (f2_areas.js, every 42 s); Ember Springs' geyser (f2_areas.js, every 45 s; the 0.3.3 geyser had been lost, only its comment was left) and ravens; Animal Farm fireflies + barn owl at night, birds by day only, tractor every 55 s; Nile bats at night; Corporate Pond pigeons; a gummy raft at The Buffet; Stonebrook otters every 24 s. Bigger moments: Keys leapers, Buffet meatball, Corporate paper plane, Deep whale tail, Trench eyes. `WX_RAINLOOK` (d_draw.js). Starfall's constellation stroke drawn once into a stored picture (2.2 ms to 1.25 ms a frame on the phone build). `PLAT.detail` (PC 1.5x moving detail).
- **Sharper Tools (batch 4):** sweep time limits stretch by measured device speed (`SPEEDK`); Fresh save part (PC); bug log columns status / introduced_in / fixed_in, checked by build.ps1; SYSTEMS_MAP split from this log.
- **Clean Pages batch 1 (batch 4):** `pageDone(tab,fn)` in cx_pages.js; phone Aquarium (page_aquarium.js, was aquarium07 + parts of pages06 and polish08), Home (page_home.js, was dock08 + home06), Cooler (page_cooler.js, from waters08; pages06's hidden help box deleted), Settings / Save / Rods through `pageDone`. Phone wraps 311 to 300, watchers 17 to 16 (Rods made a new watcher on every redraw). Element fingerprints of the five pages identical before and after at 956×440 and 440×460.

## Test builds 2026.11.22-0501 (batches 4 part 1, 6, 8b parts 20-21, 7 part 1)
| Piece | Defined in | Shows up in |
|---|---|---|
| Real fish families (98 species), `d.fam` so the newer waters' random body leaves them alone, slim long families | `i_fish.js` (`fishDesign`), `cq_traits.js` | every fish picture: water, Fish Log, catch card, aquarium |
| Install welcome once per device in a browser, waits for idle; Settings tile | `cy_install.js`, `d2_extra.js` | first visit in a browser; Settings › Install Driftline |
| Light changes recorded and replayed in slices (`v3rec`, `v3play`, `v3land.job`, PC `J`), finish as last slice | `f_v3scene.js`, `pc/scene_light.js`, `bf_depth036.js` | dawn, dusk, weather on every water |
| Mountain ranges as one shaded shape (no clipped columns) | `f_v3scene.js` (`v3range`) | waters with mountains |
| One owner per water hook for the extra scenery (96 nested wrappers → a list per hook) | `ao_maps033.js` (`m33wrap`) | every water (pixel-identical) |

## Test builds 2026.11.22-0540
| Piece | Defined in | Shows up in |
|---|---|---|
| Install welcome on every visit that is not the installed app (director), starts after 6 s and waits for idle and closed cards | `cy_install.js` | every browser visit |
| Five PC page layers became PC_STEPS run by the PC page engine (wraps 257 → 252) | `pc/br_pc05.js`, `pc/ui_round5.js`, `pc/pages_pc.js` | PC Aquarium, Your home, Rods, Wardrobe (fingerprint-identical) |

## Test builds 2026.11.22-1436 (homes batch)
| Piece | Defined in | Shows up in |
|---|---|---|
| One plain swatch look for every feature (lantern glow removed) | `cv_homefmt.js` (`renderHomeF`), `pc/ui_round5.js` | Your home, phones and PC |
| Phone swatches: real circles sized by one number, 2 rows of 8, tighter gap on small phones | `mobile/page_home.js` | phone Your home |
| PC Your home: style picture cards zoomed on the feature (`dkPreviews`, `dkWith`), the home at a glance | `pc/br_pc05.js` | PC Your home |
| Map wording | `e_ui.js`, `c_logic.js` (`strStandHTML`), `mobile/waters08.js`, `bn_qa04.js` | Map page, phones and PC |
| Laurel on the measured outline (`traitProbe.prof`, `traitTopAt`) | `cq_traits.js` | Mount Olympus fish |
| Last four PC page layers as PC_STEPS (wraps 252 → 248) | `pc/ui_fit.js`, `pc/ui_fishlog.js`, `pc/ui_fhd.js`, `pc/ui_pets_find.js` | PC pages (fingerprint-identical) |

## Test builds 2026.11.22-1447
| Piece | Defined in | Shows up in |
|---|---|---|
| Water costumes on fish removed (director); `__traitQC` and its sweep step removed | `cq_traits.js` (only the newer waters' body variety is left), `bn_qa04.js`, `tools/sweep.html` | every fish picture |

## Test builds 2026.11.22-1509 (Clean Scenes 5)
| Piece | Defined in | Shows up in |
|---|---|---|
| One file per water (scene + every drawn piece in order; shared layers by name) | `src/w_<id>.js` (20), helpers in `ap_weather033.js`, `aq_life033.js`, `as_depth033.js`; `WA_MORE.<id>` for the newer ten | every water (pixel-identical) |
| `?frozen` start for comparing two builds | `build.ps1` (preview head) | test pages only |

## Test builds 2026.11.22-1605
| Piece | Defined in | Shows up in |
|---|---|---|
| Real fish keep their body (tuna, bill, flat, disc, ball by name; one `d.fam` flag skips the random body) | `i_fish.js`, `cq_traits.js` | newer waters' fish |
| Deeper teal button top `#197a76` (white text 5.1 : 1) | 7 UI files | main buttons, phones and PC |
| PC style cards cached (`DK_PV`), one stored picture per style, home-area diff | `pc/br_pc05.js` | PC Your home |
| Old-fight jump test checks the rule, not the first event | `bn_qa04.js` | test builds |

## Map redo batch (2026-11-22 evening, test builds)
Every water redone from the director's map-by-map notes and Claude's own review (PLAN › "Director's map-by-map review", "Claude's own review"); rollback tag `rollback/before-map-redo`.
- Shared: PC home preview drawn every frame (no after-image); resting rod under covers (`o.low`, d_draw); supports with caps, wet band, weed and bracing (`hfBraces`); lantern glass shows its colour; steady preview zoom (`hfFrame`); canvas reset in `v3prep`; weather sky behind clouds (`skyBack` hook), stars skip clouds, smooth aurora on high graphics, rainbow reflection mirrored like the land; softer rain mist band; snow instead of rain at Frostbite (`WX_SNOW`); hulls by material (jon, cruiser, steel); rock jetties rock-coloured.
- Scenery: Willow Pond forest ridge, deer on the bank, `pondWake`, new frog; Stonebrook arches, downstream drift, farmland; Cherry Blossom giants (`blossomGiant`), Fuji backdrop, second pagoda, torii; Saltmarsh terraces, harbour, beach huts; Frostbite faceted peaks; Rockies slab peaks, larches, rooted pine; Farm, Buffet, Corporate, Nile, Circuit, Olympus, Coral Shallows, Keys, Shelf, Amazon, Trench, Ember details (see the commits "Map redo (part 1-7)").
- Homes: new cover kinds (pergola, willow arbor, timber frame, wisteria, sail awning, log porch, tarp, canvas fly, palapa, scallop, shade sail, maloca, copper hood, pylon, crescent gate, planet), new features (Stonebrook mooring, Frostbite gear and ice shelf), new lights (davit lantern, harbour lamp, navigation buoy, wall bracket, pot-belly stove).
- Test tools: `__hfSheet(id)`, `__qcSheet(ids,name)`, `__cropShot`, `__mkSheet`.

## Rockies round 3 and Cam's fight asks (2026-11-23, test builds 0034 and the next)
- Rockies round 3 (test builds 0034): see docs/reviews/rockies.md › Round 3 (strata `rkStrata`, lake floor `rkLakebed`, `rkSpruce`, `rkDams`, otter corner `rkOtterNook`, canoeist home at night, green far bank; cabin Door/Windows split, `palS`/`hfPal`, seats `seatPal`, sod roof, chimneys, new seats `muskoka`/`stumpblanket`/`logrocker`, `seatX` as a function). Tools: `__timeSheet`, `__hfAll` colours per style.
- Cam's fight asks (c2_fightfeel.js, n_play.js, c_logic.js): Middle is the feel for every page but test pages; Feel lab knobs `tx` (temper curve), `runs` (darting and long runs), `groove`; temper adds move tension; dart chains and long-run rhythm pulls; groove +15% between 50-80% tension; big-catch landing; predator runs `EAT_RUN_M` 25-45 m, `EAT_RUN_MAX` 50 (test updated); middle `sw` .6.

## Test build 2026.11.24-0140: Cam's notes, round 5
| Piece | Defined in | Shows up in |
|---|---|---|
| `FF.TIRED_STRONG` (tired fish past 1.5x the tackle reel in (ratio/1.5)^2 slower; their tired clock is not slowed) | `c2_fightfeel.js` | every fight |
| `G.noCastT` (1 s no-cast after Fish Frenzy) | set in `d2_extra.js`, read by `startCharge` and the idle tap in `c_logic.js` | casting |
| `streakXP(n)` (2.5% a catch, same cap) | `c_logic.js` | catch XP, the streak line on the water (`d_draw.js`) and the PC header (`pc/ui_header.js`) |
| Voyage level reset (`lvl:1, xp:0, perks:{}`), `S.stats.bestLvl` | `e_ui.js` retireok | skills (points from feats and the Fish Log stay), `spec()` works only at or above its fork's level (`d5_v16.js`) |
| `bv(id)`, Boon values, Old Habits (`habits`), Deep Cooler as a share | `ch_voyage.js` | Prestige › Boons, bonuses, cooler size (`voyApplyCooler`) |
| Relics Quick Study (`headstart`, in `xpNeed`), Bounty Ledger (`seasoned`, bounty claim), Almanac (+5 in `ptsTotal`), Sweet Tooth (`nibOdds`), Feast Bowl (`nibFeed`), Dusk Lantern (`biteSpeed`) | `d5_v16.js`, `ch_voyage.js`, `c_logic.js`, `ce_nibbles.js`, `e_ui.js` | Prestige › Pearl relics |
| Rod presets step, now shared | `cx_pages.js` (`pageDone('rods')`) | Rods › Your rods on every build |
| Crates claim-only; a crate per feat; bounty bonuses `nib` and `crate` | `d2_extra.js`, `t_board.js`, `c_logic.js` checkFeats, `bs_rules05.js` | Boardwalk › Mystery crates, feats, bounties |
| `NIB_AMTS`, `nibAmt()`, `S.nibAmt`, multi-feed `nibFeed`, `nibStripHTML` | `ce_nibbles.js` (strip placed by `cx_pages.js`) | Aquarium |
| `sortBar`, `tankSort`, `TANK_SORTS`, `tankListOrder` | `e_ui.js` | Cooler and Aquarium lists |
| Inspect card (`inspectBtn`, `inspectOpen`, `inspectClose`) | `cz_inspect.js` | Cooler and Aquarium rows |
| Fish picture glow as an oval; `sparkles(..., box)` | `d_draw.js` fishCanvas | every still fish picture |
| Music: record crackle removed, seamless brown noise, `nz` and `mv` fade-ins | `d2_extra.js` | all music and ambience |
| Learn lessons and Help answers | `cw_pages08.js` | Quests › Learn and Help |

## Foundation (2026-11-26, test builds 1341 to the F4 build; nothing changes on screen unless noted)
| What | Where | Affects |
|---|---|---|
| Fast publish: the committed folder goes onto its Pages branch as one commit | `tools/push_folder.ps1`, `publish*.ps1` | every publish (8 minutes became 11 seconds) |
| A new save starts with `docks:{}` | `c_logic.js` fresh() | the save round-trip test on a brand-new save |
| Three test saves in git, made by `__mkSave` | `tools/saves/`, `bn_qa04.js` | every one-command check |
| One-command sweep in an invisible browser; `?save=<name>` on the sweep page; no full screen, no controller, nothing stored but the save for the game under test | `tools/sweep_all.ps1`, `tools/headless.ps1`, `tools/sweep.html` | all checks |
| Baseline fingerprints (`__baseline`, software drawing, pinned clock and random numbers) | `tools/baseline.ps1`, `tools/baseline.html`, `tools/baseline/`, `bn_qa04.js` | proving a change altered nothing on screen |
| Item names are not instructions for the device-words rule | `bn_qa04.js` textBad | `__contentQC`, `__qa` text tests |
| Feature switches; controllers off (visible: a connected controller does nothing) | `b_data.js` FEATURE, `k_controls.js` | controller input, the "Controller connected" pop-up |
| Garbled characters repaired; encoding gate in the build (visible: Learn and Help texts read correctly again) | `tools/mojibake.ps1`, `build.ps1`, `cw_pages08.js`, `CLAUDE.md` | Quests, Learn and Help on the test builds; every build |
| CLAUDE.md shortened; routines as skills; README rewritten | `CLAUDE.md`, `.claude/skills/`, `docs/HISTORY.md`, `README.md` | how every session works |
| F2: the `live` branch (what players have); live published from it; a test publish cannot change a live file (no build, nothing published) | `tools/push_live.ps1`, `tools/live_take_main.ps1`, `tools/push_folder.ps1`, `publish.ps1`, the live-and-hotfix and publish-test skills | every hotfix, every release, every PC test publish |

## Foundation F5 (2026-11-26, test builds; nothing changes on screen)
| What | Where | Affects |
|---|---|---|
| The 0.5 list: 89 lines in 8 groups, everything the test build has that live does not, with keep / switch off / remove boxes; the same as one message for Cam | `docs/reviews/0.5_list.md`, `docs/reviews/0.5_list_for_Cam.txt` | the director's and Cam's decisions for 0.5 |
| `FEATURE.fightFeel` (on): off = every `fishNew()` caller takes the earlier fight | `b_data.js`, `c2_fightfeel.js` (`fishNew`) | every fight, both fight displays, the rod length line, Rest mode, Stats |
| `FEATURE.inspect` (on): off = `inspectBtn` returns nothing | `b_data.js`, `cz_inspect.js` | Cooler and Aquarium rows |
| `FEATURE.boardwalkExtras` (on): off = the games page without the Gamble and Treasure chests cards, no coin jackpots | `b_data.js`, `ci_boardwalk.js` (the `bwGamesHTML` and `addTickets` wrappers) | Boardwalk › Games; `S.gstats.gambles` stays in the save |
| `FEATURE.installWelcome` (on): off = the install card never opens by itself (Settings › Install Driftline still shows it) | `b_data.js`, `cy_install.js` (`installWelcome`) | browser visits |
| Tests follow the switches: Cam's two fight tests, the Inspect line, the Boardwalk test (cards and jackpot) | `bn_qa04.js` | `__qa` with a switch off |

**Off-runs** (each switch off once, `tools/sweep_all.ps1 -Only gate,boot,qa,content`, 22 checks on each of the three saves; the game started clean every time):
- `fightFeel` off: first run failed only the two tests of Cam's fight (they forced the new fight on); after they followed the switch, see the result line below.
- `inspect` off: 0 failed on new, mid and heavy.
- `boardwalkExtras` off: first run failed only the jackpot line of the Boardwalk test; after it followed the switch, see the result line below.
- `installWelcome` off: 0 failed on new, mid and heavy.
- Second runs with the tests following the switch: `fightFeel` off 0 failed on all three saves (build 2057); `boardwalkExtras` off 0 failed on all three (build 2111; the held Gamble picture item is absent with it, 4 held instead of 8 on mid and heavy).

**Everything on (build 2026.11.26-2126, the committed build):** `tools/baseline.ps1 -Check` passes: new 424, mid 430, heavy 421 fingerprints match the agreed set (one wobble on new in the first run, matched in the second); `tools/sweep_all.ps1` passes on all three saves, 56 checks each, 0 failed (held as before: the Gamble picture, feat pop-ups 1 to 4 letters over, Market Rush 29.4% on the end-game save; 44 minutes).

## Foundation F6 slice 1: one loader, one saver (2026-11-26, test builds; nothing changes on screen or in any save)
Rollback tag `rollback/before-f6-1`. Before: `migrate` (loading and checking a save) was replaced 13 times by later files, each stacking its part on the one before (11 shared, 2 phone); `save` 3 times (1 shared, 2 phone). After: one `function migrate` and one `function save` in `c_logic.js`; every former layer is a step inside, in the same order, its code still in its owner's file.

| Was a layer in | What it does | Now |
|---|---|---|
| `ah_fabric.js` | old shirt designs refunded once | step `fabricMigrate(m)` |
| `ax_trophy035.js` | the Trophy vault is a list | one line in `migrate` |
| `bl_hunts04.js` | hunts cleaned | step `cleanHunts(m)` (with its fallback) |
| `bm_ui04.js` | unknown rods, more perk ranks than points, old home choices | steps `rodsClean`, `perksClean`, new `docksClean` |
| `bz_rods06.js` | rod presets cleaned; on save, the preset in use follows the rod held | step `rpClean(m)`; `save()` calls `rpSync()` once `rpLive` is on (set where the layer used to start) |
| `cg_paths.js` | Paths and their fish counts | step `pathsClean(m)` |
| `ch_voyage.js` | old pearls, the pearl shop, Boons | step `voyClean(m, raw)` |
| `cj_tidepass.js` (two layers) | Tide Pass exclusives owned; the ones an old save is already past | steps `passOwnedClean(m, raw)`, `passCatchUp(m, raw)` |
| `cl_faces.js` | face and eye shape | step `facesClean(m, raw)` |
| `cn_waterart.js` | end-game waters open for enough voyages | step `egOpenAdd(m)` |
| `mobile/settings08.js` (two on load, two on save) | this phone's own settings and newest notes seen | `deviceLoad` / `deviceSave`: one phone step at the end of `migrate()` and one at the start of `save()`, set by that file (PC has none) |

Left as they are, on purpose: the first read of the save in `c_logic.js` runs only the core checks (`migrate(o, true)`: the later files' lists do not exist yet) and `ck_bootfix.js` still runs the whole function afterwards and copies its keys; each owner file still runs its own step on `S` when it loads; the `save=function(){}` stand-ins in the tests (`bn_qa04.js`), which switch saving off during a test and put it back.

**Numbers:** wrap layers PC 242 to 230, Android and iPhone 272 to 256 (`tools/redundancy_baseline.json`); hides, timers and watchers unchanged; unused functions 0.

**New tool:** `tools/saveprobe.ps1` with `tools/saveprobe.html` and the hook `__saveProbe` (`bn_qa04.js`): what loading and saving make of a save, as text, before and after a change. 588 texts (3 builds, 7 start-up situations, 13 save texts each, loaded and written) identical character for character; proven by planting a removed load step (378 texts failed) and a removed save step (21 failed).

**Proof (build 2026.11.26-2236, the committed build):** `tools/saveprobe.ps1 -Check` 588 texts identical; `tools/baseline.ps1 -Check` passes: new 424, mid 430, heavy 421 fingerprints match the agreed set, no wobble; `tools/sweep_all.ps1` passes on all three saves, 56 checks each, 0 failed (held as before: the Gamble picture, feat pop-ups 1 to 4 letters over, Market Rush 29.4% on the end-game save; 44 minutes). `/simplify` (four reviewers) and one `/code-review` run before the final build: the probe page refuses to run off the local server, `migrate` cuts short only for exactly `true`.

**Found and left alone (behaviour kept identical):** a save whose `owned` part has no `hats` list cannot be loaded (qc 259); the start-up save skips the old-home-choices clean-up (qc 260, harmless).

## Foundation F6 slice 2: one reporter for errors that were passed over (2026-11-27, test builds 2026.11.27-0043; nothing changes on screen or in any save)
Rollback tag `rollback/before-f6-2`. Before: 413 places in `src/` caught an error and did nothing with it (`catch(e){}`), plus 10 promise versions (`.catch(()=>{})`); a real fault behind one of them left no trace. After: one function, `oops(where, e)` at the top of `a3_plat.js`.

| Kind (sorted by a text rule, so the numbers are rough) | How many | Now |
|---|---|---|
| a best-effort extra after the real work (tidying a page after it is drawn, a sound, a scroll) | 210 | reports |
| something a device may not have (storage, sound, full screen, vibration, animation) | 116 | reports |
| inside the test file `bn_qa04.js` | 41 | reports, labels start with `qa:` |
| a drawing step that must not stop the frame | 30 | reports |
| near saving or stored data | 16 | reports |
| promise versions | 10 | 1 reports (the transfer's "done" message); 9 quiet, see below |

**The reporter.** `oops('file:what', e)` keeps a list in memory: at most 60 places, a count per place, the first 3 different messages (read only during the first 20 repeats, so an error that repeats every frame costs one count). It never throws, shows nothing, stores nothing and sends nothing. It is a function declaration that keeps its list on itself, so any file can call it while the page is still loading. The release build runs the same code (so live and test do not differ), but no screen reads the list there.

**Where it is read.** Test builds: Stats, Tester tools shows a box "Errors the game passed over" once the list is not empty (a clean session looks as before). Checks: the hook `__errs` and the sweep's new last part, Passed-over errors, which collects the list from every game copy just before it is closed and fails the run on any line that is not held.

**Left quiet on purpose (12 places, each `/* quiet: reason */`):** four full-screen requests and the turn lock that a browser may refuse (the sweep itself refuses full screen on every tap, so these would be noise in every run); the reporter's own guard; two test probes found by the first run (the Quests check tries every target as a list, the safe-area test hook reads style sheets from other addresses); a cancelled animation in the test file (two places); two in the page shell, outside the game's script, where the reporter cannot be reached. The build counts the ones inside each game build (PC 3, phones 8; the test file and the page shell are outside that count).

**The build check.** `build.ps1` refuses a catch whose body is empty or only a comment, and an empty promise catch (proven by planting six kinds). The marked quiet ones are counted per build beside the redundancy numbers and may only go down.

**What it surfaced.** The first partial run recorded two places, both test probes (now quiet). The full sweep on the new, mid-game and end-game saves recorded nothing: 57 checks, 0 failed on each. A planted error was listed for all three builds.

**Proof.** `tools/saveprobe.ps1`: 588 save texts identical. `tools/baseline.ps1 -Check`: identical on the build before the tester note was written (424 / 430 / 421); with the note, one page differs, PC Settings, Patch notes, which shows the note; the agreed set was made again from this build for that reason. Redundancy: wraps 230 / 256, hides 63 / 82, timers 29 / 30, watchers 13 / 14, unchanged. Draw cost on Willow Pond, end-game save, phone build at 956 by 440 in the hidden pane: about 1 ms a frame before and after, and the reporter was not called once in 440 frames.

**Also changed:** three save-loading fallbacks now report before they fall back (hunts, rod presets, a save that cannot be read). **Not done, on purpose:** about 50 more catches that fall back to a default value (qc 261): each needs a look at whether the fallback is an expected probe or a hidden fault. The tools pages' own catches (`tools/*.html`) are not game code and were left.

## Foundation F6 slice 3: button presses as one table, page drawing as one list of steps (2026-11-27, build 2026.11.27-0142; nothing changes on screen or in any save)
Rollback tag `rollback/before-f6-3`. Wrap layers: PC 230 to 189, phones 256 to 206.

**Button presses.** Before: a press that `e_ui.js` did not know fell through `extraAct`, which asked `extraAct2`, `extraAct3` ... `extraAct7` in turn; 17 files had wrapped `extraAct2` or `extraAct7` again to add their own actions (18 wrap layers on each build), so one press was handed from function to function until one knew it. After: one table. A file adds its actions with `actOn('name other', fn)` (`d2_extra.js`); a press runs the one function for its name (`actRun`). The answers are the same (`'render'`, `'skip'`, `undefined`), and `extraAct` keeps its own list for the oldest actions. 23 files register 85 action names. A name added twice stops the page while it loads.

| Clash found (two handlers knew one action) | Who answered before | Now |
|---|---|---|
| `hilostart`, `hilo`, `hilocash`, `duckpick` | the newer handler in `bq_feat04.js` (tickets instead of coins), every time | that one handler; the four older cases in `d3_update.js` could never run and are deleted, with `newHilo`, which only they used |
| `tackleview` | `u_tackle.js`'s handler in the `extraAct2` group, every time | that one handler; a line in the `extraAct7` group that folded the bait groups again on "tackleview bait" never ran (qc 262) and is deleted |

**Page drawing.** Before: `renderPanel` was wrapped by 23 layers on PC and 32 on phones, each doing something before or after the draw, four of them drawing a page themselves. After: one `renderPanel` (`e_ui.js`); each former layer is a step, `panelStep({before(){ }, after(t){ }})`, added in the same place in the same file, so the order is the order the files load, as before. Every `before` runs from the last added to the first, then the draw, then every `after` from the first to the last; a `before` that drew the page itself (Stats, Events, Trophy room, Overview) answers `'drawn'` and the steps added before it are skipped, exactly as its wrapper skipped them. The pair-dog step keeps its "put it back even if the draw fails" part as `always`.

**Proof.** 588 save texts identical (the "before" record was made again from build 0043 the same night: the old record was a day old and the daily tasks carry the date); baseline 424 / 430 / 421 fingerprints unchanged; full sweep 57 checks and 0 failed on new, mid and heavy; Passed-over errors empty. The test file's direct calls (`extraAct7(b)`) now call `actRun(b)`; its stand-ins for `renderPanel` work unchanged.

## Foundation F6 slice 4: force-hide rules (2026-11-27, build 2026.11.27-0228; nothing changes on screen or in any save)
Rollback tag `rollback/before-f6-4`. Force-hide rules (`display:none!important`): PC 63 to 52, phones 82 to 75. Timers on PC 29 to 28.

Every rule was read from the built pages themselves (the browser's own list of style rules, with their screen-size conditions) and switched off one at a time on every menu page and on the water, to see which ones hide something there.

| Removed | Where | Why it was safe |
|---|---|---|
| the menu's title line `.mo-title`: the element, the code that wrote its text on every page change, and its three rules | `bm_ui04.js` | built and filled, never shown on any screen size |
| the PC header's coin readout `.pch-coin`: the element, its timer (every 0.4 s) and its two rules | `pc/ui_header_row.js`, `pc/ui_header.js` | built and updated, hidden whenever the header shows; coins are read from the stats row |
| `#menuov #panel > h2.dl-dup` | `bm_ui04.js` | the rule below it hides the same headings and more |
| the second `.st-log` rule for short sideways screens under 800 px | `bm_ui04.js` | same screens, same element, twice |
| `#buffchip, .hudbtns` on short sideways screens | `bm_ui04.js` | a later rule for the same screens hides both (`#buffchip` is the `.st-buff` chip) |
| section names with the dock collapsed, short sideways screens | `bm_ui04.js` | the rule for all short sideways screens already hides them |
| header labels under 1320 px, stat labels and the gear's dot under 1000 px | `pc/ui_header.js`, `pc/ui_header_narrow.js` | the same rules exist for everything under 1580 px |
| `display:none!important` beside `content:none!important` on four `::before` / `::after` rules | `pc/ui_fhd.js`, `mobile/header08.js`, `mobile/polish08.js` | `content:none` already removes the piece; the rules stay |

**Measured.** Besides the baseline (every menu page): every visible element on the whole screen (tag, text, box) on the water, on five menu pages and on the Overview, before and after, at PC 1920×1080, 1300×800, 900×700, 900×500, 780×500 and 760×700, phone 956×440, 700×375, 440×460 and 375×812, and with the dock collapsed: identical. One removal failed this test and was put back: `.hud > #goalchip` for phones looked like a copy of a wider rule, but in the narrow window layout a stronger rule shows the chip again and only this one hides it.

**What stays, and why (52 on PC, 75 on phones).** Almost all of them hide by state or by screen size, which is what a style rule is for: the fishing view against the menu (`dl-fish`, `menu-open`, `side-off`), a live challenge, the collapsed dock, short or narrow screens, an element's own `hidden` mark where a stronger layout rule would otherwise show it, one page's note or heading that the phone layout shows in its tab bar instead. The hidden tab buttons in `#tabs` are the game's list of pages. Left although the thing is built and then hidden, because the builder is shared and the hiding is one platform's: page headings and notes on phones (the PC shows them), the bait chip `.st-bait` (hidden on PC; on phones only proven hidden sideways), the goal chip and its `#mbgoal` copy on phones, the goal's sub-line `.gl-s`, the time-of-day and weather chips in the old top bar. Each of those needs a builder that knows the platform or a design decision, so they are follow-ups, not part of this slice.

**Proof.** 588 save texts identical; baseline 424 / 430 / 421 unchanged; full sweep 57 checks and 0 failed on three saves; Passed-over errors empty.

## Foundation F6 slice 5: the catches that fell back to a default value (2026-11-27, build 2026.11.27-0313; nothing changes on screen or in any save; closes qc 261)
Rollback tag `rollback/before-f6-5`. Slice 2 covered the catches that did nothing. 46 more caught an error and carried on with a stand-in value (`return ''`, `return null`, `return 0`, `continue`, a fallback drawing), which hid the error just as well. Each now calls `oops('file:what', e)` first and then falls back exactly as before: 37 in shared files, 7 in phone files, 2 in PC files (weather and goal texts, backup and device-setting reads, the hat and pet-tint drawing fallbacks, the sound set-up, the QR code, the tester tools).

Left as they were, because they already tell someone: the three that show the player a message (two "couldn't reach the internet" lines of the transfer, the "copy this link" prompt), the ones that show a toast, and the about 35 that write to the browser console.

**The build check, widened.** `build.ps1` (NO SILENT CATCH) now reads every catch in the game's files, also the promise form with a function in it: one that neither calls `oops`, nor carries the quiet mark, nor tells someone itself (toast, transfer status, prompt, console) stops the build. Proven by planting five (a returned default, an assigned default, a `continue`, two promise forms): all five refused, then removed. The test file is left out (its catches are test logic). The quiet count did not change (PC 3, phones 8).

**Proof.** 588 save texts identical; baseline 424 / 430 / 421 unchanged (the new save's first run wobbled and matched on the second and on two more runs); full sweep 57 checks and 0 failed on three saves; Passed-over errors empty, so none of the 46 fires in normal play or in the checks.

## Foundation F6 slice 6: nine more wrap families folded into their originals (2026-11-27, test builds 2026.11.27-0405; nothing changes on screen or in any save)
Rollback tag `rollback/before-f6-6`. Wrap layers: PC 189 to 154, phones 206 to 169. Since F6 began: PC 242 to 154 (36% fewer), phones 272 to 169 (38% fewer); the aim was about a third.

**One mechanism.** `stepOn('name', step)` in `a3_plat.js` (beside `oops`): a later file adds a step to a core function instead of wrapping it, and the function runs its own steps in the order the files load. Two kinds. Around the function: `{before(){ }, after(t){ }}`, run by `stepsRun` (every "before" from the last added to the first, the function, every "after" from the first to the last; `'drawn'` and `always` as in slice 3). After the function, on its value: `(value, ...args) => new value`, run by `thenRun`. `renderPanel`'s steps from slice 3 use the same runner now (`panelStep(s)` is `stepOn('renderPanel', s)`).

| Function | Layers folded | Its steps now (in order) |
|---|---|---|
| `bonus` (`c_logic.js`) | 5 | relics and voyages, timed events, feat categories, paths, boons and relic bonuses |
| `aqBuffsOf` (`n_play.js`) | 4 | weight, decorations, tiny hybrids, Nibbles and feeding |
| `aqFishBase` (`n_play.js`) | 3 | decorations, Nibbles and feeding, paths |
| `catchW` (`c_logic.js`) | 3 | hunts, favourite and hated foods, paths |
| `rollFish` (`n_play.js`) | 3 | paths, the Heavy boon, end-game waters |
| `landFish` (`c_logic.js`) | 4 | challenges, hunts, path ranks, Catch Surge and Second Hook |
| `showCard` (`e_ui.js`) | 7 | quick Sell and To aquarium buttons, the aquarium line, the shine, the open-card mark, the tiny-hybrid badge, the rarity effects, the hybrid numbers |
| `menuTidy2` (`bm_ui04.js`) | 3 shared, 2 phone | daily tasks side by side, path and rod marks, centring the chosen chip; on phones the Fish Log's two touches |
| `renderCooler` (`e_ui.js`) | 3 | the sell filters, the tank lines, the shared pages (Quests, Bait and the others draw in its place) |

**One thing needed care.** The events file had kept the bonus as it stood before its own layer and uses it for Market Rush's base; folded, that is `bonus(k, upto)`: the bonus with only the first so many steps.

**The clean-up and the review** (`/simplify`, `/code-review`) over the whole night's change found no fault in behaviour. Applied: four leftover brace pairs in action handlers from slice 3, three comments that still spoke of wrapping `renderPanel`, the limits of the step runner written beside it. Noted, not changed: the test-only hook `__bal` now hands out the full `rollFish`, `aqBuffsOf` and `bonus` (it used to hold the copies from the moment its file loaded; nothing reads them, qc 263); the build's catch check finds a catch's text by counting brackets; `PC_STEPS` and `PAGES.before/after` are older lists around the same draw that could become page steps one day.

**Frame cost** (`__drawCost`, the Rockies, 60 frames six times, twice per build): PC 1920×1080 medians 2.7 and 3.6 ms before, 3.3 and 3.1 ms after; phone 956×440 1.5 and 1.3 ms before, 1.1 and 1.3 ms after. The spread between two runs of the same build is larger than any difference, and none of the folded functions is called while a frame is drawn.

**What is left (154 on PC, 169 on phones) and why.** Not folded tonight, each needs its own look: the drawing families (`drawHat` 5, `drawFace` 4, `drawJunkZ` 4, `drawOutfit3` 3, `v3Thumb` 3, `draw` 2 and the angler parts), which run every frame and replace each other's pictures rather than add to them; `stageHOverride` (6), where each layer answers first or passes on and one phone file replaces the original; `setTab` (3), where a layer changes the value handed on; `nextGoal` (3), where two files use a half-wrapped copy on purpose; the page drawers (`renderJournal` 7, `renderSettings` 6, `renderStyle` 4 on PC), where most layers are one platform's own version, which the rules allow; and about 60 functions with one or two layers.

**Proof (the final build of the night, 2026.11.27-0405).** 588 save texts identical; baseline unchanged before the tester note was added, then identical except the PC Patch notes page, which shows the note (the agreed set was made again for that one page); full sweep 57 checks and 0 failed on new, mid and heavy; Passed-over errors empty. No edit after the sweep.
