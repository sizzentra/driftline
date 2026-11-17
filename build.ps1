# Builds site/index.html from the game source in src/ and stamps a new version.
# Run:  powershell -ExecutionPolicy Bypass -File build.ps1
# Preview build (0.3 work in progress, its own save):  powershell -ExecutionPolicy Bypass -File build.ps1 -Preview
#   -> site/next/index.html, live at https://sizzentra.github.io/driftline/next/
param([switch]$Preview)
$root = $PSScriptRoot
$v = (Get-Date).ToString('yyyy.MM.dd-HHmm')
$utf8 = New-Object System.Text.UTF8Encoding $false
$parts = 'a_head.html','a2_v3ui.js','b_data.js','az_fish036.js','b2_wear.js','c_logic.js','n_play.js','k_controls.js','d_draw.js','d2_extra.js','d3_update.js','d4_style.js','d5_v16.js','d6_preview.js','d7_v20.js','m_home.js','d8_v21.js','d9_link.js','d10_lily.js','d11_pair.js','f_v3scene.js','f2_areas.js','f3_foliage.js','ao_maps033.js','ap_weather033.js','aq_life033.js','ar_ember033.js','as_depth033.js','at_starfall033.js','av_sea034.js','bf_depth036.js','g_angler.js','l_wear.js','ag_hatfit.js','h_pets.js','i_fish.js','ba_art036.js','j_music.js','q_boardwalk.js','w_wardrobe.js','ah_fabric.js','ak_side.js','s_odd.js','bb_odd036.js','t_board.js','u_tackle.js','v_shop.js','o_sort.js','p_games.js','r_rest.js','x_sections.js','y_pass.js','ab_decor.js','ac_dockart.js','ad_tankart.js','ae_tankart2.js','al_decor04.js','be_decor036.js','z_stats.js','aj_events.js','af_smooth.js','am_shoptools.js','an_small04.js','ai_cooler.js','au_fix034.js','aw_menu035.js','ax_trophy035.js','ay_phone035.js','bg_angler036.js','bh_platform036.js','bi_hats036.js','bc_voyage036.js','bd_ui036.js','bj_polish036.js','bk_events036.js','bl_hunts04.js','bo_guard04.js','bm_ui04.js','bn_qa04.js','e_ui.js'
if (-not $Preview) { $parts = $parts | Where-Object { $_ -ne 'bn_qa04.js' } }  # the QA suite never ships
$game = $parts | ForEach-Object { [IO.File]::ReadAllText((Join-Path $root "src\$_")) }
$top = [IO.File]::ReadAllText((Join-Path $root 'src\shell_top.html')).Replace('__VERSION__', $v)
$bottom = [IO.File]::ReadAllText((Join-Path $root 'src\shell_bottom.html'))
$body = $game -join ''
if ($Preview) {
  # own save key; copies the real save once on first open and never writes to it
  $body = $body.Replace("const LS_KEY = 'driftline-save-v1';", "const LS_KEY = 'driftline-save-next'; try{ if(!localStorage.getItem(LS_KEY)){ const m=localStorage.getItem('driftline-save-v1'); if(m) localStorage.setItem(LS_KEY,m); } }catch(e){}")
  $top = $top.Replace("window.DL_VERSION=", "window.DL_PREVIEW=true; window.DL_VERSION=").Replace('href="manifest.webmanifest"', 'href="../manifest.webmanifest"').Replace('href="icon-192.png"', 'href="../icon-192.png"')
  $badge = '<div class="dlprev" style="position:fixed;right:10px;bottom:10px;z-index:30;background:#2a2048cc;color:#ffd59a;border:1px solid #ffd59a88;border-radius:999px;padding:4px 10px;font:700 11px system-ui,sans-serif;pointer-events:none">0.4 preview</div>'
  $out = Join-Path $root 'site\next'
  New-Item -ItemType Directory -Force $out | Out-Null
  [IO.File]::WriteAllText((Join-Path $out 'index.html'), $top + $body + $badge + $bottom, $utf8)
  [IO.File]::WriteAllText((Join-Path $out 'version.txt'), $v, $utf8)
  Write-Output "Built PREVIEW version $v"
} else {
  [IO.File]::WriteAllText((Join-Path $root 'site\index.html'), $top + $body + $bottom, $utf8)
  [IO.File]::WriteAllText((Join-Path $root 'site\version.txt'), $v, $utf8)
  Write-Output "Built version $v"
}
