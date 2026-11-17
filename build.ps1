# Builds site/index.html from the game source in src/ and stamps a new version.
# Run:  powershell -ExecutionPolicy Bypass -File build.ps1
# Preview build (0.3 work in progress, its own save):  powershell -ExecutionPolicy Bypass -File build.ps1 -Preview
#   -> site/next/index.html, live at https://sizzentra.github.io/driftline/next/
param([switch]$Preview)
$root = $PSScriptRoot
$v = (Get-Date).ToString('yyyy.MM.dd-HHmm')
$utf8 = New-Object System.Text.UTF8Encoding $false
$parts = 'a_head.html','a2_v3ui.js','b_data.js','b2_wear.js','c_logic.js','n_play.js','k_controls.js','d_draw.js','d2_extra.js','d3_update.js','d4_style.js','d5_v16.js','d6_preview.js','d7_v20.js','m_home.js','d8_v21.js','d9_link.js','d10_lily.js','d11_pair.js','f_v3scene.js','f2_areas.js','f3_foliage.js','g_angler.js','l_wear.js','ag_hatfit.js','h_pets.js','i_fish.js','j_music.js','q_boardwalk.js','w_wardrobe.js','ah_fabric.js','s_odd.js','t_board.js','u_tackle.js','v_shop.js','o_sort.js','p_games.js','r_rest.js','x_sections.js','y_pass.js','ab_decor.js','ac_dockart.js','ad_tankart.js','ae_tankart2.js','z_stats.js','af_smooth.js','ai_cooler.js','e_ui.js'
$game = $parts | ForEach-Object { [IO.File]::ReadAllText((Join-Path $root "src\$_")) }
$top = [IO.File]::ReadAllText((Join-Path $root 'src\shell_top.html')).Replace('__VERSION__', $v)
$bottom = [IO.File]::ReadAllText((Join-Path $root 'src\shell_bottom.html'))
$body = $game -join ''
if ($Preview) {
  # own save key; copies the real save once on first open and never writes to it
  $body = $body.Replace("const LS_KEY = 'driftline-save-v1';", "const LS_KEY = 'driftline-save-next'; try{ if(!localStorage.getItem(LS_KEY)){ const m=localStorage.getItem('driftline-save-v1'); if(m) localStorage.setItem(LS_KEY,m); } }catch(e){}")
  $top = $top.Replace("window.DL_VERSION=", "window.DL_PREVIEW=true; window.DL_VERSION=").Replace('href="manifest.webmanifest"', 'href="../manifest.webmanifest"').Replace('href="icon-192.png"', 'href="../icon-192.png"')
  $badge = '<div style="position:fixed;right:10px;bottom:10px;z-index:30;background:#2a2048cc;color:#ffd59a;border:1px solid #ffd59a88;border-radius:999px;padding:4px 10px;font:700 11px system-ui,sans-serif;pointer-events:none">0.3 preview</div>'
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
