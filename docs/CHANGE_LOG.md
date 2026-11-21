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
