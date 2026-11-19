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
$core = 'a_head.html','a2_v3ui.js','a3_plat.js','b_data.js','az_fish036.js','b2_wear.js','c_logic.js','n_play.js','k_controls.js','d_draw.js','d2_extra.js','d3_update.js','d4_style.js','d5_v16.js','d6_preview.js','d7_v20.js','m_home.js','d8_v21.js','d9_link.js','d10_lily.js','d11_pair.js','f_v3scene.js','f2_areas.js','f3_foliage.js','ao_maps033.js','ap_weather033.js','aq_life033.js','ar_ember033.js','as_depth033.js','at_starfall033.js','av_sea034.js','bf_depth036.js','g_angler.js','l_wear.js','ag_hatfit.js','h_pets.js','i_fish.js','ba_art036.js','j_music.js','q_boardwalk.js','w_wardrobe.js','ah_fabric.js','ak_side.js','s_odd.js','bb_odd036.js','t_board.js','u_tackle.js','v_shop.js','o_sort.js','p_games.js','r_rest.js','x_sections.js','y_pass.js','ab_decor.js','ac_dockart.js','ad_tankart.js','ae_tankart2.js','al_decor04.js','be_decor036.js','z_stats.js','aj_events.js','af_smooth.js','am_shoptools.js','an_small04.js','ai_cooler.js','au_fix034.js','aw_menu035.js','ax_trophy035.js','mobile:mobile/ay_phone035.js','bg_angler036.js','bh_platform036.js','bi_hats036.js','bc_voyage036.js','bd_ui036.js','bj_polish036.js','bk_events036.js','bl_hunts04.js','bo_guard04.js','bm_ui04.js','bq_feat04.js','bs_rules05.js','bu_home05.js','bv_catch06.js','bw_bait06.js','bx_qol06.js','bz_rods06.js','ca_shiny06.js','cb_wearfx06.js','cc_river06.js','cd_efficiency.js','bt_testnotes.js'
# each platform's own files, added after the core (empty lists are ready for that platform's own work)
$layers = @{ pc = @('pc/br_pc05.js','pc/ui_round5.js','pc/ui_round6.js','pc/notes_release.js','pc/notes_test.js'); android = @('mobile/perf_round6.js','mobile/ui_modern06.js','mobile/home06.js','mobile/pages06.js','mobile/theme07.js','mobile/aquarium07.js','mobile/perf07.js','mobile/fishlog07.js','mobile/fullscreen07.js','mobile/boosts07.js','mobile/weather07.js','mobile/scene08.js','mobile/settings08.js','mobile/landscape08.js','mobile/tablet08.js','mobile/dock08.js','mobile/waters08.js','mobile/quests08.js','mobile/pages08.js','mobile/header08.js','mobile/fight08.js','mobile/polish08.js','mobile/frame07.js','android/notes_release.js','android/notes_test.js'); ios = @('mobile/perf_round6.js','mobile/ui_modern06.js','mobile/home06.js','mobile/pages06.js','mobile/theme07.js','mobile/aquarium07.js','mobile/perf07.js','mobile/fishlog07.js','mobile/fullscreen07.js','mobile/boosts07.js','mobile/weather07.js','mobile/scene08.js','mobile/settings08.js','mobile/landscape08.js','mobile/tablet08.js','mobile/dock08.js','mobile/waters08.js','mobile/quests08.js','mobile/pages08.js','mobile/header08.js','mobile/fight08.js','mobile/polish08.js','mobile/frame07.js','ios/notes_release.js','ios/notes_test.js') }
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
$platBaseline = @{ 'af_smooth.js'=1; 'aw_menu035.js'=2; 'bd_ui036.js'=3; 'bh_platform036.js'=15; 'bj_polish036.js'=56; 'bm_ui04.js'=75; 'd_draw.js'=2; 'f_v3scene.js'=3; 'x_sections.js'=1 }
$coreFiles = ($core + 'e_ui.js') | Where-Object { $_ -notmatch '^(pc|mobile|android|ios):' }
$broken = @()
foreach ($f in $coreFiles) {
  $n = $platWords.Matches([IO.File]::ReadAllText((Join-Path $root "src\$f"))).Count
  $allowed = if ($platBaseline.ContainsKey($f)) { $platBaseline[$f] } else { 0 }
  if ($n -gt $allowed) { $broken += "$f has $n platform-specific mentions (allowed: $allowed)" }
}
if ($broken.Count) { throw ("GROUND RULE BROKEN: platform-specific code was added to a shared file. Move it into src/pc, src/mobile or src/ios.`n  " + ($broken -join "`n  ")) }

New-Item -ItemType Directory -Force $out | Out-Null
$built = @{}; $pages = @{}
foreach ($p in 'pc','android','ios') {
  $parts = $core + $layers[$p]
  if ($Preview) { $parts = $parts + 'bn_qa04.js' }  # the QA suite only exists in previews, never in the live game
  $parts = $parts + 'e_ui.js'
  # a part named "pc:...", "mobile:..." (Android + iPhone), "android:..." or "ios:..." belongs to those builds only
  $want = @($p); if ($p -ne 'pc') { $want += 'mobile' }
  $parts = $parts | Where-Object { $_ -notmatch '^(pc|mobile|android|ios):' -or $want -contains ($_ -split ':')[0] } | ForEach-Object { ($_ -split ':')[-1] }
  # inside a shared file, a line "//@layer <platform> <file>" is replaced by that platform file's code (same spot, same order)
  # in that platform's build, and by nothing in the others
  $layerLine = [regex]'(?m)^//@layer (pc|mobile|android|ios) (\S+)\s*$'
  $body = ($parts | ForEach-Object { $layerLine.Replace([IO.File]::ReadAllText((Join-Path $root "src\$_")), { param($m) if ($want -contains $m.Groups[1].Value) { [IO.File]::ReadAllText((Join-Path $root ('src\' + $m.Groups[2].Value))) } else { '' } }) }) -join ''
  $top = $top0.Replace("window.DL_VERSION=", "window.DL_BUILD='$p'; window.DL_VERSION=")
  $badge = ''
  if ($Preview) {
    # own save key; copies the real save once on first open and never writes to it
    $body = $body.Replace("const LS_KEY = 'driftline-save-v1';", "const LS_KEY = 'driftline-save-next'; try{ if(!localStorage.getItem(LS_KEY)){ const m=localStorage.getItem('driftline-save-v1'); if(m) localStorage.setItem(LS_KEY,m); } }catch(e){}")
    $top = $top.Replace("window.DL_VERSION=", "window.DL_PREVIEW=true; window.DL_VERSION=").Replace('href="icon-192.png"', 'href="../icon-192.png"').Replace('content="Driftline">', 'content="DL Test">')
    # the test label: a fixed small pill (it stretched into a tall shape on iPhone held sideways), plain ASCII text (a "·" was
    # read as "Â·" by Windows PowerShell)
    $badge = '<span class="dlprev" style="position:fixed!important;' + $(if($p -eq 'pc'){'right:10px!important;bottom:10px!important;top:auto!important;left:auto!important;'}else{''}) + 'z-index:30;display:inline-block!important;width:auto!important;height:auto!important;min-height:0!important;max-height:22px!important;white-space:nowrap!important;background:#2a2048cc;color:#ffd59a;border:1px solid #ffd59a88;border-radius:999px;padding:3px 10px!important;margin:0!important;font:700 11px/14px system-ui,sans-serif!important;pointer-events:none;box-sizing:border-box">test build - ' + $names[$p] + '</span>'
    # phones: above the bottom tabs when upright, top left of the water when held sideways (the side menu is on the right)
    if($p -ne 'pc'){ $badge = '<style>html body span.dlprev.dlprev{transform:none!important;right:10px!important;left:auto!important;top:auto!important;bottom:calc(env(safe-area-inset-bottom) + 84px)!important}@media (orientation:landscape){html body span.dlprev.dlprev{right:auto!important;left:calc(env(safe-area-inset-left) + 22px)!important;bottom:auto!important;top:calc(env(safe-area-inset-top) + 92px)!important}}</style>' + $badge }
  }
  # each phone build carries its own version number (shown in Settings and used for "what's new"); they had been stuck on the
  # shared 0.4.8.1. A ghost patch adds a sub-number without a new patch note. PC keeps its own (set by its release).
  $platVer = @{ pc = '0.4.8.9'; android = '0.4.8.9'; ios = '0.4.8.9' }   # one number for all three since 0.4.8.7 (they release together)
  if ($platVer.ContainsKey($p)) { $body = [regex]::Replace($body, "const GAME_VERSION = '[^']*';", "const GAME_VERSION = '" + $platVer[$p] + "';") }
  $built[$p] = $body
  # ---------- GROUND RULE CHECK 3: no top-level function declared twice ----------
  # All files share one scope, so a second "function name(" silently replaces the first (0.4.8.9: a new oddSil hid the old one and
  # every oddity fight crashed the scene). Replace on purpose with "name = function(...)"; never declare a name twice.
  $dups = [regex]::Matches($body, '(?m)^function ([A-Za-z_$][A-Za-z0-9_$]*)\(') | ForEach-Object { $_.Groups[1].Value } | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object { $_.Name }
  if ($dups) { throw ("GROUND RULE BROKEN: function declared twice in the $p build (the first is silently lost): " + ($dups -join ', ')) }
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
  $sw = [IO.File]::ReadAllText((Join-Path $root 'site\sw.js')).Replace("const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];", "const CORE = ['./', 'index.html', 'manifest.webmanifest'];")
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
