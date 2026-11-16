# Builds site/index.html from the game source in src/ and stamps a new version.
# Run:  powershell -ExecutionPolicy Bypass -File build.ps1
$root = $PSScriptRoot
$v = (Get-Date).ToString('yyyy.MM.dd-HHmm')
$utf8 = New-Object System.Text.UTF8Encoding $false
$game = 'a_head.html','b_data.js','c_logic.js','d_draw.js','d2_extra.js','d3_update.js','d4_style.js','e_ui.js' | ForEach-Object { [IO.File]::ReadAllText((Join-Path $root "src\$_")) }
$top = [IO.File]::ReadAllText((Join-Path $root 'src\shell_top.html')).Replace('__VERSION__', $v)
$bottom = [IO.File]::ReadAllText((Join-Path $root 'src\shell_bottom.html'))
[IO.File]::WriteAllText((Join-Path $root 'site\index.html'), $top + ($game -join '') + $bottom, $utf8)
[IO.File]::WriteAllText((Join-Path $root 'site\version.txt'), $v, $utf8)
Write-Output "Built version $v"
