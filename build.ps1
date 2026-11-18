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
$root = $PSScriptRoot
$v = (Get-Date).ToString('yyyy.MM.dd-HHmm')
$utf8 = New-Object System.Text.UTF8Encoding $false
$core = 'a_head.html','a2_v3ui.js','b_data.js','az_fish036.js','b2_wear.js','c_logic.js','n_play.js','k_controls.js','d_draw.js','d2_extra.js','d3_update.js','d4_style.js','d5_v16.js','d6_preview.js','d7_v20.js','m_home.js','d8_v21.js','d9_link.js','d10_lily.js','d11_pair.js','f_v3scene.js','f2_areas.js','f3_foliage.js','ao_maps033.js','ap_weather033.js','aq_life033.js','ar_ember033.js','as_depth033.js','at_starfall033.js','av_sea034.js','bf_depth036.js','g_angler.js','l_wear.js','ag_hatfit.js','h_pets.js','i_fish.js','ba_art036.js','j_music.js','q_boardwalk.js','w_wardrobe.js','ah_fabric.js','ak_side.js','s_odd.js','bb_odd036.js','t_board.js','u_tackle.js','v_shop.js','o_sort.js','p_games.js','r_rest.js','x_sections.js','y_pass.js','ab_decor.js','ac_dockart.js','ad_tankart.js','ae_tankart2.js','al_decor04.js','be_decor036.js','z_stats.js','aj_events.js','af_smooth.js','am_shoptools.js','an_small04.js','ai_cooler.js','au_fix034.js','aw_menu035.js','ax_trophy035.js','mobile:mobile/ay_phone035.js','bg_angler036.js','bh_platform036.js','bi_hats036.js','bc_voyage036.js','bd_ui036.js','bj_polish036.js','bk_events036.js','bl_hunts04.js','bo_guard04.js','bm_ui04.js','bq_feat04.js','bs_rules05.js'
# each platform's own files, added after the core (empty lists are ready for that platform's own work)
$layers = @{ pc = @('pc/br_pc05.js'); android = @(); ios = @() }
$names = @{ pc = 'PC'; android = 'Android'; ios = 'iPhone' }
$top0 = [IO.File]::ReadAllText((Join-Path $root 'src\shell_top.html')).Replace('__VERSION__', $v)
$bottom = [IO.File]::ReadAllText((Join-Path $root 'src\shell_bottom.html'))
$router = [IO.File]::ReadAllText((Join-Path $root 'src\router.html')).Replace('__VERSION__', $v)
$out = if ($Preview) { Join-Path $root 'site\next' } else { Join-Path $root 'site' }
New-Item -ItemType Directory -Force $out | Out-Null
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
    $badge = '<div class="dlprev" style="position:fixed;right:10px;bottom:10px;z-index:30;background:#2a2048cc;color:#ffd59a;border:1px solid #ffd59a88;border-radius:999px;padding:4px 10px;font:700 11px system-ui,sans-serif;pointer-events:none">preview · ' + $names[$p] + '</div>'
  }
  [IO.File]::WriteAllText((Join-Path $out "$p.html"), $top + $body + $badge + $bottom, $utf8)
}
$r = $router
if ($Preview) { $r = $r.Replace('href="icon-192.png"', 'href="../icon-192.png"').Replace('content="Driftline">', 'content="DL Test">') }
[IO.File]::WriteAllText((Join-Path $out 'index.html'), $r, $utf8)
[IO.File]::WriteAllText((Join-Path $out 'version.txt'), $v, $utf8)
if ($Preview) {
  # the preview is its own home-screen app on phones ("Driftline Test", like the PC test app): it opens /next/ (the router
  # picks the iPhone or Android preview build), never the live game, and has its own offline helper so phones install it
  $man = '{"name":"Driftline Test","short_name":"DL Test","description":"Driftline preview build for testing","start_url":"./","scope":"./","id":"./","display":"standalone","orientation":"any","background_color":"#0a161d","theme_color":"#2a2048","icons":[{"src":"../icon-192.png","sizes":"192x192","type":"image/png","purpose":"any"},{"src":"../icon-512.png","sizes":"512x512","type":"image/png","purpose":"any"},{"src":"../icon-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}'
  [IO.File]::WriteAllText((Join-Path $out 'manifest.webmanifest'), $man, $utf8)
  $sw = [IO.File]::ReadAllText((Join-Path $root 'site\sw.js')).Replace("const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];", "const CORE = ['./', 'index.html', 'manifest.webmanifest'];")
  [IO.File]::WriteAllText((Join-Path $out 'sw.js'), $sw, $utf8)
}
if ($Preview) { Write-Output "Built PREVIEW version $v (pc, android, ios)" } else { Write-Output "Built version $v (pc, android, ios)" }
