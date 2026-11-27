# Builds the game from src/ and stamps a new version. Since 2026-11-17 every platform has its OWN build (director: "separate
# PC and mobile... Android and iPhones will need their own updates and changes"):
#   pc.html, android.html, ios.html  = the shared core ($core) + that platform's own layer ($layers)
#   index.html                       = a tiny router that sends each device to its build (src/router.html)
# All builds sit side by side on the same site address, so they share one save.
# Run:  powershell -ExecutionPolicy Bypass -File build.ps1            -> site/ (the live game; publish.ps1 calls this)
#       powershell -ExecutionPolicy Bypass -File build.ps1 -Preview   -> site/next/ (preview, its own save)
# New work for ONE platform goes into src/pc/, src/mobile/ (Android + iPhone), src/android/ or src/ios/: either listed in
# $layers, or placed inside a shared file with a line "//@layer <platform> <file>". The core is for things every platform
# shares: the game itself, its rules and the save.
param([switch]$Preview)
$TempAndroidUsesIos = $false   # set to $true to make the Android test app run the iPhone build (comparison; used 2026-11-18)
$root = $PSScriptRoot
$v = (Get-Date).ToString('yyyy.MM.dd-HHmm')
$utf8 = New-Object System.Text.UTF8Encoding $false
$core = 'a_head.html','a2_v3ui.js','a3_plat.js','b_data.js','az_fish036.js','cm_waters.js','cu_names.js','b2_wear.js','c_logic.js','n_play.js','c2_fightfeel.js','k_controls.js','d_draw.js','d2_extra.js','d3_update.js','d4_style.js','d5_v16.js','d6_preview.js','d7_v20.js','m_home.js','d8_v21.js','d9_link.js','d10_lily.js','d11_pair.js','f_v3scene.js','f2_areas.js','f3_foliage.js','ao_maps033.js','ap_weather033.js','aq_life033.js','ar_ember033.js','as_depth033.js','at_starfall033.js','av_sea034.js','bf_depth036.js','w_pond.js','w_river.js','w_coast.js','w_frost.js','w_reef.js','w_shelf.js','w_deep.js','w_trench.js','w_ember.js','w_starfall.js','g_angler.js','l_wear.js','ag_hatfit.js','h_pets.js','i_fish.js','ba_art036.js','j_music.js','q_boardwalk.js','w_wardrobe.js','ah_fabric.js','ak_side.js','s_odd.js','bb_odd036.js','t_board.js','u_tackle.js','v_shop.js','o_sort.js','p_games.js','r_rest.js','x_sections.js','y_pass.js','ab_decor.js','ad_tankart.js','ae_tankart2.js','al_decor04.js','be_decor036.js','z_stats.js','aj_events.js','af_smooth.js','am_shoptools.js','an_small04.js','ai_cooler.js','au_fix034.js','aw_menu035.js','ax_trophy035.js','mobile:mobile/ay_phone035.js','bg_angler036.js','bh_platform036.js','bi_hats036.js','bc_voyage036.js','bd_ui036.js','bj_polish036.js','bk_events036.js','bl_hunts04.js','bo_guard04.js','bm_ui04.js','bq_feat04.js','bs_rules05.js','bv_catch06.js','bw_bait06.js','bx_qol06.js','bz_rods06.js','ca_shiny06.js','cb_wearfx06.js','cc_river06.js','cd_efficiency.js','ce_nibbles.js','cz_inspect.js','cf_foods.js','cg_paths.js','ch_voyage.js','ci_boardwalk.js','cj_tidepass.js','cl_faces.js','cn_waterart.js','w_rockies.js','w_keys.js','w_amazon.js','w_farm.js','w_buffet.js','w_corporate.js','w_nile.js','w_circuit.js','w_olympus.js','cv_homefmt.js','cw_homekit.js','cw_basehome.js','cw_pondhouse.js','cw_millhouse.js','cw_saltshack.js','cw_icehut.js','cw_bungalow.js','cw_skiff.js','cw_sportfisher.js','cw_palafito.js','cw_trawler.js','cw_castaway.js','cw_bathhouse.js','cw_observatory.js','cw_barn.js','cw_ginger.js','cw_officebox.js','cw_reedboat.js','cw_capsule.js','cw_temple.js','cw_homes.js','w_maple.js','cq_traits.js','co_oddities.js','cs_tank.js','ct_hair.js','cw_pages08.js','cx_pages.js','cy_install.js','ck_bootfix.js','bt_testnotes.js'
# each platform's own files, added after the core (empty lists are ready for that platform's own work)
$layers = @{ pc = @('pc/br_pc05.js','pc/ui_round5.js','pc/ui_round6.js','pc/notes_release.js','pc/notes_test.js','pc/ui_display.js','pc/pages_pc.js'); android = @('mobile/perf_round6.js','mobile/ui_modern06.js','mobile/theme07.js','mobile/page_aquarium.js','mobile/perf07.js','mobile/fishlog07.js','mobile/fullscreen07.js','mobile/boosts07.js','mobile/scene08.js','mobile/settings08.js','mobile/landscape08.js','mobile/tablet08.js','mobile/waters08.js','mobile/page_cooler.js','mobile/quests08.js','mobile/pages08.js','mobile/header08.js','mobile/polish08.js','mobile/frame07.js','mobile/notes_release.js','mobile/notes_test.js'); ios = @('mobile/perf_round6.js','mobile/ui_modern06.js','mobile/theme07.js','mobile/page_aquarium.js','mobile/perf07.js','mobile/fishlog07.js','mobile/fullscreen07.js','mobile/boosts07.js','mobile/scene08.js','mobile/settings08.js','mobile/landscape08.js','mobile/tablet08.js','mobile/waters08.js','mobile/page_cooler.js','mobile/quests08.js','mobile/pages08.js','mobile/header08.js','mobile/polish08.js','mobile/frame07.js','mobile/notes_release.js','mobile/notes_test.js') }
$names = @{ pc = 'PC'; android = 'Android'; ios = 'iPhone' }
$top0 = [IO.File]::ReadAllText((Join-Path $root 'src\shell_top.html')).Replace('__VERSION__', $v)
$bottom = [IO.File]::ReadAllText((Join-Path $root 'src\shell_bottom.html'))
$router = [IO.File]::ReadAllText((Join-Path $root 'src\router.html')).Replace('__VERSION__', $v)
$out = if ($Preview) { Join-Path $root 'site\next' } else { Join-Path $root 'site' }

# ---------- GROUND RULE CHECK 1: platform code never grows inside a shared file ----------
# Each shared file may mention platform layouts at most as often as it did when the split was made (2026-11-17). The numbers
# may only go DOWN (when old code moves into src/pc, src/mobile or src/ios). New platform UI belongs in a platform file; the
# build refuses to finish otherwise. If a number goes down, lower it here too.
$platWords = [regex]'MOB\(|pch-on|pc-fhd|pc-app|pc-wide|PC_APP|pchead|phone-app|phone-land|plat-ios|plat-android|plat-pc'
$platBaseline = @{ 'af_smooth.js'=1; 'aw_menu035.js'=2; 'bd_ui036.js'=3; 'bh_platform036.js'=15; 'bj_polish036.js'=56; 'bm_ui04.js'=61; 'd_draw.js'=2; 'f_v3scene.js'=3; 'x_sections.js'=1 }
$coreFiles = ($core + 'e_ui.js') | Where-Object { $_ -notmatch '^(pc|mobile|android|ios):' }
$broken = @()
foreach ($f in $coreFiles) {
  $n = $platWords.Matches([IO.File]::ReadAllText((Join-Path $root "src\$f"))).Count
  $allowed = if ($platBaseline.ContainsKey($f)) { $platBaseline[$f] } else { 0 }
  if ($n -gt $allowed) { $broken += "$f has $n platform-specific mentions (allowed: $allowed)" }
}
if ($broken.Count) { throw ("GROUND RULE BROKEN: platform-specific code was added to a shared file. Move it into src/pc, src/mobile or src/ios.`n  " + ($broken -join "`n  ")) }

# ---------- GROUND RULE CHECK: no dead functions (2026-11-19) ----------
# A later file that replaces a whole function ("name = function(...)") without keeping the old one ("const _x = name") leaves the
# original as dead code that ships but can never run (30 of them were found and removed on 2026-11-19). Edit the original instead,
# or move it: the replacement becomes "function name(...)" and the old one is deleted. Wrappers that keep the old one are fine.
$allSrc = Get-ChildItem (Join-Path $root 'src') -Recurse -Filter *.js | Where-Object { $_.Name -ne 'bn_qa04.js' }
$texts = @{}; foreach ($f in $allSrc) { $texts[$f.FullName] = [IO.File]::ReadAllText($f.FullName) }
$declared = @{}; foreach ($k in $texts.Keys) { foreach ($m in [regex]::Matches($texts[$k], '(?m)^function ([A-Za-z0-9_$]+)\(')) { $declared[$m.Groups[1].Value] = $k } }
$dead = @()
$platDir = [regex]'\\src\\(pc|mobile|android|ios)\\'  # a platform file replacing a shared default is an override, not dead code
foreach ($k in $texts.Keys) {
  if ($platDir.IsMatch($k)) { continue }
  foreach ($m in [regex]::Matches($texts[$k], '(?m)^\s*([A-Za-z0-9_$]+)\s*=\s*function\b')) {
    $n = $m.Groups[1].Value
    if ($declared.ContainsKey($n) -and -not [regex]::IsMatch($texts[$k], '=\s*' + [regex]::Escape($n) + '\s*[;,]')) {
      $dead += "$n (replaced in $(Split-Path $k -Leaf), original in $(Split-Path $declared[$n] -Leaf))"
    }
  }
}
if ($dead.Count) { throw ("GROUND RULE BROKEN: a function is fully replaced and its original is dead code.`n  " + (($dead | Sort-Object -Unique) -join "`n  ")) }

# ---------- REDUNDANCY COUNTER (director, 2026-11-20: "is there a sweep for redundant things?") ----------
# Six numbers per build that may only go DOWN, so old layering cannot grow back while it is cleaned up:
#   unused   functions declared and never used anywhere (tests count as use)                     -> refused at once, listed by name
#   wraps    later files re-wrapping a function ("name = function", e.g. renderPanel 52x on PC)  -> fold the change into the owner instead
#   hides    "display:none!important" rules (things built and then hidden; one owner shows/hides) -> don't build what is never shown
#   timers   setInterval loops (polling)                                                         -> update when the thing changes
#   watchers MutationObservers (reacting to other code's DOM changes)                            -> one owner per element
#   quiet    catches that pass over an error without reporting it, marked /* quiet: reason */    -> call oops('file:what', e) instead (NO SILENT CATCH, below)
# The allowed numbers live in tools/redundancy_baseline.json; when a number goes down the build lowers it there by itself.
$redFile = Join-Path $root 'tools\redundancy_baseline.json'
$redBase = if (Test-Path $redFile) { [IO.File]::ReadAllText($redFile) | ConvertFrom-Json } else { $null }
$qaText = [IO.File]::ReadAllText((Join-Path $root 'src\bn_qa04.js'))
$tokCount = New-Object 'System.Collections.Generic.Dictionary[string,int]'
foreach ($t in @($texts.Values) + $qaText) { foreach ($m in [regex]::Matches($t, '[A-Za-z_$][A-Za-z0-9_$]*')) { $k = $m.Value; if ($tokCount.ContainsKey($k)) { $tokCount[$k]++ } else { $tokCount[$k] = 1 } } }
$declN = @{}
foreach ($t in $texts.Values) {
  foreach ($m in [regex]::Matches($t, '(\S?)\s*\bfunction\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(')) { if ('(=,:?!&|' -notmatch [regex]::Escape($m.Groups[1].Value) -or $m.Groups[1].Value -eq '') { $declN[$m.Groups[2].Value] = 1 + [int]$declN[$m.Groups[2].Value] } }  # declarations only, not named function expressions
  foreach ($m in [regex]::Matches($t, '\b(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*(?:\([^()]*\)|[A-Za-z_$][A-Za-z0-9_$]*)\s*=>')) { $declN[$m.Groups[1].Value] = 1 + [int]$declN[$m.Groups[1].Value] }
}
$unused = @($declN.Keys | Where-Object { $tokCount[$_] -le $declN[$_] } | Sort-Object)
if ($unused.Count) { throw ("REDUNDANCY: functions that nothing uses (delete them, or use them): " + ($unused -join ', ')) }

# ---------- NO SILENT CATCH (Foundation F6 slice 2, 2026-11-26) ----------
# 413 places caught an error and threw it away without a trace. Every catch that carries on now calls oops('file:what', e)
# (a3_plat.js), which records it where Tester tools and the checks can read it. A catch whose body is empty (or only a comment),
# and a promise's .catch(()=>{}), is refused here. Where reporting would be noise by design, the body says why:
# /* quiet: reason */ ; those are counted per build with the redundancy numbers below ("quiet"), so they can only get fewer.
$emptyBody = '\{(?:\s|/\*(?!\s*quiet:).*?\*/|//.*?\n)*\}'   # nothing inside but space and comments, and no "quiet:" mark
$silentRe = New-Object regex ("catch\s*(?:\(\s*\w*\s*\))?\s*$emptyBody|\.catch\(\s*(?:function\s*)?\(?\s*\w*\s*\)?\s*(?:=>)?\s*$emptyBody\s*\)"), 'Singleline'
$quietRe = [regex]'\{\s*/\*\s*quiet:'
$silent = @()
foreach ($f in (Get-ChildItem (Join-Path $root 'src') -Recurse -Include *.js,*.html)) {
  $t = [IO.File]::ReadAllText($f.FullName)
  foreach ($m in $silentRe.Matches($t)) { $silent += "$($f.FullName.Substring($root.Length + 5)) line $(($t.Substring(0, $m.Index) -split "`n").Count): $($m.Value)" }
}
# Widened in F6 slice 5 (2026-11-27): a catch that falls back to a default value ("return ''", "x=null", "continue") hid the error just
# as well (46 of them, qc 261). Every catch in the game's files must now report: call oops, or carry the quiet mark, or tell someone
# itself (a toast, the transfer status line, a prompt, the console). The test file is left out: its catches are the tests' own logic.
# The catch's text is found by counting brackets and skipping quoted text: a lone bracket inside a pattern (/}/) or a template text
# in a catch would mislead it; write such a catch so its oops call comes first.
$tells = [regex]'\boops\(|/\*\s*quiet:|\bconsole\.(?:error|warn)\(|\btoast\(|\bxfStat\(|\bprompt\('
$catchAt = [regex]'(?<=\})\s*catch\s*(?:\(\s*\w*\s*\))?\s*\{|\.catch\(\s*(?:function\b|\(?\s*\w*\s*\)?\s*=>)'
foreach ($f in (Get-ChildItem (Join-Path $root 'src') -Recurse -Include *.js,*.html | Where-Object { $_.Name -ne 'bn_qa04.js' })) {
  $t = [IO.File]::ReadAllText($f.FullName)
  foreach ($m in $catchAt.Matches($t)) {
    # the catch's own text: from its opening brace (or the bracket of ".catch(") to the one that closes it; text in quotes is skipped
    $open = if ($m.Value.TrimStart().StartsWith('.')) { '(' } else { '{' }; $close = if ($open -eq '(') { ')' } else { '}' }
    $i = if ($open -eq '(') { $m.Index + $m.Value.IndexOf('(') } else { $m.Index + $m.Length - 1 }; $d = 0; $j = $i; $q = [char]0
    while ($j -lt $t.Length) { $c = $t[$j]
      if ($q -ne [char]0) { if ($c -eq '\') { $j++ } elseif ($c -eq $q) { $q = [char]0 } }
      elseif ($c -eq "'" -or $c -eq '"') { $q = $c }
      elseif ($c -eq $open) { $d++ } elseif ($c -eq $close) { $d--; if ($d -eq 0) { break } }
      $j++ }
    $bodyTxt = $t.Substring($i, [Math]::Min($j, $t.Length - 1) - $i + 1)
    if (-not $tells.IsMatch($bodyTxt)) { $short = if ($bodyTxt.Length -gt 90) { $bodyTxt.Substring(0, 90) + '...' } else { $bodyTxt }; $silent += "$($f.FullName.Substring($root.Length + 5)) line $(($t.Substring(0, $m.Index) -split "`n").Count): catch $short" }
  }
}
if ($silent.Count) { throw ("SILENT CATCH REFUSED: an error is caught and thrown away, or only swapped for a default value. Call oops('file:what', e) in the catch, or say why it stays quiet with /* quiet: reason */ (build.ps1, NO SILENT CATCH):`n  " + ($silent -join "`n  ")) }

# ---------- ENCODING GATE (Foundation F4, 2026-11-26) ----------
# A script that reads a UTF-8 file as Windows-1252 and writes it back garbles every special character, and each later pass garbles it
# again: CLAUDE.md held 486 such runs and the game's Learn and Help texts 28 (shown to testers since build 0140) before this gate.
# tools/mojibake.ps1 finds them (and repairs with -Fix); the build refuses while any is left in the rulebook, the docs, the source or the tools.
$mojiOut = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root 'tools/mojibake.ps1') (Join-Path $root 'CLAUDE.md') (Join-Path $root 'README.md') (Join-Path $root 'build.ps1') (Join-Path $root 'docs') (Join-Path $root 'src') (Join-Path $root 'tools')
if ($LASTEXITCODE -ne 0) { throw ("ENCODING GATE: garbled characters (repair with tools/mojibake.ps1 -Fix <file>, then read the lines it changed):`n  " + ($mojiOut -join "`n  ")) }

# The bug log (docs/qc_incidents.csv, Sharper Tools 2026-11-21): fixed labels only, and every row says whether it is fixed and when.
# A new label goes into the lists below on purpose (one place), never by typing a new spelling into the log.
$bugLog = Join-Path $root 'docs\qc_incidents.csv'
if (Test-Path $bugLog) {
  $okBy = 'director','cam','claude','tester'
  $okAt = 'live','local','me_auto','me_manual','qa','real_android','real_device','real_iphone','sweep','test_app'
  $okSt = 'fixed','open','held'
  $okCat = 'art','balance','code-health','code-structure','content','crash','css-override','data','design','device','device-shape','duplicate-name','false-verified','layout','layout-cut','performance','process','release','safari-only','save','save-state','script-break','shared-state','start-up','tabs-state','test-bug','test-tool','text','tooling','touch-app','ui','ui-logic','wording'
  $logBad = @(); $ids = @{}
  foreach ($row in (Import-Csv $bugLog)) {
    $w = "row $($row.id)"
    if ($ids.ContainsKey($row.id)) { $logBad += "$w is listed twice" }; $ids[$row.id] = 1
    if ($okBy -cnotcontains $row.found_by) { $logBad += "$w found_by '$($row.found_by)' (use: $($okBy -join ', '))" }
    if ($okAt -cnotcontains $row.found_at) { $logBad += "$w found_at '$($row.found_at)' (use: $($okAt -join ', '))" }
    if ($okCat -cnotcontains $row.category) { $logBad += "$w category '$($row.category)' (use one of the listed categories in build.ps1)" }
    if ($okSt -cnotcontains $row.status) { $logBad += "$w status '$($row.status)' (use: $($okSt -join ', '))" }
    if ('0','1','2','3' -notcontains $row.severity) { $logBad += "$w severity '$($row.severity)' (0-3)" }
    if (-not $row.introduced_in) { $logBad += "$w has no introduced_in (a stamp, a version, or unknown)" }
    if ($row.status -ceq "fixed" -and -not $row.fixed_in) { $logBad += "$w is fixed but has no fixed_in" }
    if ($row.status -ne 'fixed' -and $row.fixed_in) { $logBad += "$w is $($row.status) but has a fixed_in" }
    if ($row.status -eq 'fixed' -and -not $row.caught_now_by) { $logBad += "$w is fixed but says nothing about what catches it now" }
  }
  if ($logBad.Count) { throw ("BUG LOG REFUSED (docs/qc_incidents.csv):`n  " + ($logBad -join "`n  ")) }
}
$redNow = @{}

New-Item -ItemType Directory -Force $out | Out-Null
$built = @{}; $pages = @{}
foreach ($p in 'pc','android','ios') {
  $parts = $core + $layers[$p]
  if ($Preview) { $parts = $parts + 'bn_qa04.js' }  # the QA suite only exists in previews, never in the live game
  $parts = $parts + 'e_ui.js'
  # a part named "pc:...", "mobile:..." (Android + iPhone), "android:..." or "ios:..." belongs to those builds only
  $want = @($p); if ($p -ne 'pc') { $want += 'mobile' }
  $parts = $parts | Where-Object { $_ -notmatch '^(pc|mobile|android|ios):' -or $want -contains ($_ -split ':')[0] } | ForEach-Object { ($_ -split ':')[-1] }
  # a listed file that does not exist stops the build (2026-11-21: a deleted phone file was skipped silently and the build still finished)
  $miss = @($parts | Where-Object { -not (Test-Path (Join-Path $root "src\$_")) }); if ($miss.Count) { throw ("BUILD REFUSED: these listed files do not exist: " + ($miss -join ", ")) }
  # inside a shared file, a line "//@layer <platform> <file>" is replaced by that platform file's code (same spot, same order)
  # in that platform's build, and by nothing in the others
  $layerLine = [regex]'(?m)^//@layer (pc|mobile|android|ios) (\S+)\s*$'
  $body = ($parts | ForEach-Object { $layerLine.Replace([IO.File]::ReadAllText((Join-Path $root "src\$_")), { param($m) if ($want -contains $m.Groups[1].Value) { [IO.File]::ReadAllText((Join-Path $root ('src\' + $m.Groups[2].Value))) } else { '' } }) }) -join ''
  $top = $top0.Replace("window.DL_VERSION=", "window.DL_BUILD='$p'; window.DL_VERSION=")
  $badge = ''
  if ($Preview) {
    # own save key; copies the real save once on first open and never writes to it
    $body = $body.Replace("const LS_KEY = 'driftline-save-v1';", "const LS_KEY = 'driftline-save-next'; try{ if(!localStorage.getItem(LS_KEY)){ const m=localStorage.getItem('driftline-save-v1'); if(m) localStorage.setItem(LS_KEY,m); } }catch(e){ oops('preview:copy-save',e); }")
    # opened by the one-click sweep (?sweep, tools/sweep.html): record every error from the first line on, and keep the frame loop
    # running in a hidden browser pane (a timer instead of animation frames)
    $sweepRec = 'if(/[?&]sweep\b/.test(location.search)){ window.__bootErr=[]; addEventListener("error",function(e){ __bootErr.push(String(e.message||e)+(e.lineno?" (line "+e.lineno+")":"")); }); addEventListener("unhandledrejection",function(e){ __bootErr.push("promise: "+String(e.reason&&e.reason.message||e.reason)); }); window.requestAnimationFrame=function(f){ return setTimeout(function(){ f(performance.now()); },16); }; window.cancelAnimationFrame=function(i){ clearTimeout(i); }; } '
    # frozen start (?frozen, Clean Scenes 5, 2026-11-22): the same random numbers from the first line on and no frame loop, so two different
    # builds start in exactly the same state and a frame drawn by hand can be compared pixel for pixel (proof that moving code changed nothing)
    $frozenRec = 'if(/[?&]frozen\b/.test(location.search)){ var __fz=20261122; Math.random=function(){ __fz|=0; __fz=__fz+0x6D2B79F5|0; var t=Math.imul(__fz^__fz>>>15,1|__fz); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; var __fc=0, __pn=performance.now.bind(performance); performance.now=function(){ __fc+=0.01; return 100000+__fc; }; Date.now=function(){ return 1795300000000+Math.floor(__fc); }; window.__frozenClock=function(){ return __fc; }; window.requestAnimationFrame=function(){ return 0; }; window.cancelAnimationFrame=function(){}; } '
    # test builds: Tester tools › Time and Weather move the game clock (director, 2026-11-22: "I can't control the weather on the tester tools"); the jump is kept across reloads
    $clockRec = 'try{ window.__tOff=/[?&](test|sweep|frozen)\b/.test(location.search)?0:(+(localStorage.getItem("dl-test-toff")||0)||0); }catch(e){ window.__tOff=0; } (function(){ var rn=Date.now.bind(Date); Date.now=function(){ return rn()+window.__tOff; }; })(); '
    $top = $top.Replace("window.DL_VERSION=", "window.DL_PREVIEW=true; " + $sweepRec + $clockRec + $frozenRec + "window.DL_VERSION=").Replace('href="icon-192.png"', 'href="../icon-192.png"').Replace('content="Driftline">', 'content="DL Test">')
    # the test label: a fixed small pill (it stretched into a tall shape on iPhone held sideways), plain ASCII text (a "·" was
    # read as two characters by Windows PowerShell)
    $badge = '<span class="dlprev" style="position:fixed!important;' + $(if($p -eq 'pc'){'right:10px!important;bottom:10px!important;top:auto!important;left:auto!important;'}else{''}) + 'z-index:30;display:inline-block!important;width:auto!important;height:auto!important;min-height:0!important;max-height:22px!important;white-space:nowrap!important;background:#2a2048cc;color:#ffd59a;border:1px solid #ffd59a88;border-radius:999px;padding:3px 10px!important;margin:0!important;font:700 11px/14px system-ui,sans-serif!important;pointer-events:none;box-sizing:border-box">test build - ' + $names[$p] + '</span>'
    # phones: above the bottom tabs when upright, top left of the water when held sideways (the side menu is on the right)
    if($p -ne 'pc'){ $badge = '<style>html body span.dlprev.dlprev{transform:none!important;right:10px!important;left:auto!important;top:auto!important;bottom:calc(env(safe-area-inset-bottom) + 84px)!important}@media (orientation:landscape){html body span.dlprev.dlprev{right:auto!important;left:calc(env(safe-area-inset-left) + 22px)!important;bottom:auto!important;top:calc(env(safe-area-inset-top) + 92px)!important}}</style>' + $badge }
  }
  # each phone build carries its own version number (shown in Settings and used for "what's new"); they had been stuck on the
  # shared 0.4.8.1. A ghost patch adds a sub-number without a new patch note. PC keeps its own (set by its release).
  $platVer = @{ pc = '0.4.9'; android = '0.4.9'; ios = '0.4.9' }   # one number for all three since 0.4.8.7 (they release together)
  if ($platVer.ContainsKey($p)) { $body = [regex]::Replace($body, "const GAME_VERSION = '[^']*';", "const GAME_VERSION = '" + $platVer[$p] + "';") }
  $built[$p] = $body
  # ---------- GROUND RULE CHECK 3: no top-level function declared twice ----------
  # All files share one scope, so a second "function name(" silently replaces the first (0.4.8.9: a new oddSil hid the old one and
  # every oddity fight crashed the scene). Replace on purpose with "name = function(...)"; never declare a name twice.
  $dups = [regex]::Matches($body, '(?m)^function ([A-Za-z_$][A-Za-z0-9_$]*)\(') | ForEach-Object { $_.Groups[1].Value } | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object { $_.Name }
  if ($dups) { throw ("GROUND RULE BROKEN: function declared twice in the $p build (the first is silently lost): " + ($dups -join ', ')) }
  # redundancy counter: what this build ships (the test suite is left out)
  $rb = $body.Replace($qaText, '')
  $fnNames = @{}; foreach ($m in [regex]::Matches($rb, '\bfunction\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(')) { $fnNames[$m.Groups[1].Value] = 1 }
  $wr = @([regex]::Matches($rb, '(?<![A-Za-z0-9_$.])([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*function\b') | Where-Object { $fnNames.ContainsKey($_.Groups[1].Value) })
  $redNow[$p] = [ordered]@{ wraps = $wr.Count; hides = [regex]::Matches($rb, 'display\s*:\s*none\s*!important').Count; timers = [regex]::Matches($rb, '\bsetInterval\s*\(').Count; watchers = [regex]::Matches($rb, '\bnew\s+MutationObserver\b').Count; quiet = $quietRe.Matches($rb).Count }
  # phones check their OWN version file (director, 2026-11-18: "updates pop up without changes"): PC is frozen on its stamp, so the
  # shared version.txt keeps PC's stamp, and a phone page with a newer stamp saw "update ready" every 5 minutes forever (tapping it
  # reloaded the same page). Android + iPhone read version-phone.txt, which every build writes with the phone pages' stamp.
  $bot = $bottom; if ($p -ne 'pc') { $bot = $bottom.Replace("fetch('version.txt'", "fetch('version-phone.txt'") }
  $pages[$p] = $top + $body + $badge + $bot
  # Android opens the installed game full screen at once (director, 2026-11-18: "automatic for all mobile builds, like iPhone"):
  # the live Android page links its own manifest (display fullscreen); PC and iPhone keep manifest.webmanifest unchanged.
  if ($p -eq 'android' -and -not $Preview) { $pages[$p] = $pages[$p].Replace('<link rel="manifest" href="manifest.webmanifest">', '<link rel="manifest" href="manifest-android.webmanifest">') }
  [IO.File]::WriteAllText((Join-Path $out "$p.html"), $pages[$p], $utf8)
}

# redundancy counter: compare with the allowed numbers; up = refused, down = the allowed number is lowered for good
$redUp = @(); $redDown = $false; $newBase = [ordered]@{}
foreach ($p in 'pc','android','ios') { $nb = [ordered]@{}
  foreach ($k in $redNow[$p].Keys) { $now = $redNow[$p][$k]; $known = [bool]($redBase -and $redBase.$p -and $null -ne $redBase.$p.$k); $was = if ($known) { [int]$redBase.$p.$k } else { $now }
    if ($now -gt $was) { $redUp += "$($names[$p]) $k went up from $was to $now" }
    if ($now -lt $was -or -not $known) { $redDown = $true }  # lower, or a number counted for the first time: store it
    $nb[$k] = [Math]::Min($now, $was) }
  $newBase[$p] = $nb }
if ($redUp.Count) { throw ("REDUNDANCY WENT UP (these numbers may only go down; see the comment above `$redFile in build.ps1 for what to do instead):`n  " + ($redUp -join "`n  ")) }
if ($redDown -or -not $redBase) { [IO.File]::WriteAllText($redFile, ($newBase | ConvertTo-Json), $utf8) }
Write-Host ("Redundancy (may only go down): " + (($newBase.Keys | ForEach-Object { "$($names[$_]) " + (($newBase[$_].GetEnumerator() | ForEach-Object { "$($_.Key) $($_.Value)" }) -join ', ') }) -join ' | ') + "; unused functions 0")

# ---------- GROUND RULE CHECK 2: every build holds exactly its own platform's files ----------
# Each platform file is looked for in all three builds: it must be in the builds it belongs to and in no other.
$owners = @{ pc = @('pc'); mobile = @('android','ios'); android = @('android'); ios = @('ios') }
foreach ($dir in 'pc','mobile','android','ios') {
  $d = Join-Path $root "src\$dir"; if (-not (Test-Path $d)) { continue }
  foreach ($file in Get-ChildItem $d -Filter *.js) {
    $txt = [IO.File]::ReadAllText($file.FullName); $sig = $txt  # the file's whole text: it is copied into its builds unchanged, so it must appear there exactly, and nowhere else
    if (-not $sig) { continue }
    foreach ($p in 'pc','android','ios') {
      $has = $built[$p].Contains($sig); $should = $owners[$dir] -contains $p
      if ($has -and -not $should) { throw "GROUND RULE BROKEN: src\$dir\$($file.Name) ended up in the $p build." }
      if ($should -and -not $has) { throw "GROUND RULE BROKEN: src\$dir\$($file.Name) is missing from the $p build (add it to `$layers or place a //@layer line)." }
    }
  }
}
$r = $router
if ($Preview) { $r = $r.Replace('href="icon-192.png"', 'href="../icon-192.png"').Replace('content="Driftline">', 'content="DL Test">') }
[IO.File]::WriteAllText((Join-Path $out 'index.html'), $r, $utf8)
[IO.File]::WriteAllText((Join-Path $out 'version.txt'), $v, $utf8)
[IO.File]::WriteAllText((Join-Path $out 'version-phone.txt'), $v, $utf8)
if (-not $Preview) { $ma = [IO.File]::ReadAllText((Join-Path $root 'site\manifest.webmanifest')).Replace('"display": "standalone",', '"display": "fullscreen", "display_override": ["fullscreen", "standalone"],'); [IO.File]::WriteAllText((Join-Path $out 'manifest-android.webmanifest'), $ma, $utf8) }
if ($Preview) {
  # the preview is its own home-screen app on phones ("Driftline Test", like the PC test app): it opens /next/ (the router
  # picks the iPhone or Android preview build), never the live game, and has its own offline helper so phones install it
  $man = '{"name":"Driftline Test","short_name":"DL Test","description":"Driftline preview build for testing","start_url":"./","scope":"./","id":"./","display":"standalone","orientation":"any","background_color":"#0a161d","theme_color":"#2a2048","icons":[{"src":"../icon-192.png","sizes":"192x192","type":"image/png","purpose":"any"},{"src":"../icon-512.png","sizes":"512x512","type":"image/png","purpose":"any"},{"src":"../icon-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}'
  [IO.File]::WriteAllText((Join-Path $out 'manifest.webmanifest'), $man, $utf8)
  # the one-click sweep page sits beside the preview builds (localhost:8766/next/sweep.html, and /driftline/next/sweep.html on any device)
  Copy-Item (Join-Path $root 'tools\sweep.html') (Join-Path $out 'sweep.html') -Force
  # Foundation F1 (2026-11-26): the baseline page and the three test saves (tools/saves/) sit beside the preview builds too
  Copy-Item (Join-Path $root 'tools/baseline.html') (Join-Path $out 'baseline.html') -Force
  Copy-Item (Join-Path $root 'tools/saveprobe.html') (Join-Path $out 'saveprobe.html') -Force   # F6 slice 1: what loading and saving make of every save (tools/saveprobe.ps1)
  New-Item -ItemType Directory -Force (Join-Path $out 'saves') | Out-Null; Copy-Item (Join-Path $root 'tools/saves/*.json') (Join-Path $out 'saves') -Force
  $sw =[IO.File]::ReadAllText((Join-Path $root 'site\sw.js')).Replace("const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];", "const CORE = ['./', 'index.html', 'manifest.webmanifest'];")
  [IO.File]::WriteAllText((Join-Path $out 'sw.js'), $sw, $utf8)

  # ---------- phone test apps (director, 2026-11-18: Android recognised /next/ as the live app, because the live app's scope
  # covers every address under /driftline/). They live in their own GitHub Pages project, sizzentra.github.io/driftline-test/
  # (pushed from testapps/ with publish_testapps.ps1), outside the live app's scope, one app per phone:
  #   /android/  "DL Test Android" = the Android preview build      /iphone/  "DL Test iPhone" = the iPhone preview build
  # Same website, so the preview save is shared the same way as before.
  $ta = Join-Path $root 'testapps'
  foreach ($pair in @(@('android','android','Android'), @('iphone','ios','iPhone'))) {
    $dir = Join-Path $ta $pair[0]; New-Item -ItemType Directory -Force $dir | Out-Null
    $label = 'DL Test ' + $pair[2]
    # TEMPORARY (director, 2026-11-18: "temporarily send Android users the iPhone version"): the Android test app gets the iPhone build to compare; set $TempAndroidUsesIos = $false to undo
    $src = $pair[1]; if ($pair[0] -eq 'android' -and $TempAndroidUsesIos) { $src = 'ios' }; $page = $pages[$src].Replace('content="DL Test">', 'content="' + $label + '">')
    [IO.File]::WriteAllText((Join-Path $dir 'index.html'), $page, $utf8)
    [IO.File]::WriteAllText((Join-Path $dir 'version.txt'), $v, $utf8)
    [IO.File]::WriteAllText((Join-Path $dir 'version-phone.txt'), $v, $utf8)
    [IO.File]::WriteAllText((Join-Path $dir 'sw.js'), $sw, $utf8)
    $m = $man.Replace('"name":"Driftline Test"', '"name":"Driftline Test (' + $pair[2] + ')"').Replace('"short_name":"DL Test"', '"short_name":"' + $label + '"')
    # Android opens the installed app full screen at once (director, 2026-11-18: "full screen on iPhone happens right away, Android only in settings"): "standalone" keeps the status and navigation bars, and a page may only hide them after a tap
    if ($pair[0] -eq 'android') { $m = $m.Replace('"display":"standalone"', '"display":"fullscreen","display_override":["fullscreen","standalone"]') }
    [IO.File]::WriteAllText((Join-Path $dir 'manifest.webmanifest'), $m, $utf8)
  }
  foreach ($icon in 'icon-192.png','icon-512.png') { Copy-Item (Join-Path $root "site\$icon") (Join-Path $ta $icon) -Force }
  $chooser = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Driftline Test</title><link rel="icon" href="icon-192.png"></head><body style="margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#0a161d;color:#e6efe8;font:600 16px system-ui,sans-serif;text-align:center;padding:24px;box-sizing:border-box"><img src="icon-192.png" width="96" height="96" alt="" style="border-radius:22px"><h1 style="margin:0;font-size:24px">Driftline Test</h1><p style="margin:0;opacity:.8;max-width:360px">Pick your phone, then add it to your home screen. It is the preview build; your real game is never touched.</p><a href="iphone/" style="display:block;width:260px;padding:14px;border-radius:14px;background:#1f8a86;color:#fff;text-decoration:none">iPhone test app</a><a href="android/" style="display:block;width:260px;padding:14px;border-radius:14px;background:#1f8a86;color:#fff;text-decoration:none">Android test app</a><p style="margin:0;font-size:12px;opacity:.6">Version ' + $v + '</p></body></html>'
  [IO.File]::WriteAllText((Join-Path $ta 'index.html'), $chooser, $utf8)
  [IO.File]::WriteAllText((Join-Path $ta '.nojekyll'), '', $utf8)
}
if ($Preview) { Write-Output "Built PREVIEW version $v (pc, android, ios)" } else { Write-Output "Built version $v (pc, android, ios)" }
