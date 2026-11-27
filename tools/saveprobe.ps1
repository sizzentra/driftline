# Foundation F6 slice 1 (2026-11-26): proves that a change to loading or saving (migrate, save, the start-up pass) alters no save.
#   powershell -ExecutionPolicy Bypass -File tools/saveprobe.ps1 -Make     BEFORE the change: record what the test builds make of every save
#   powershell -ExecutionPolicy Bypass -File tools/saveprobe.ps1 -Check    AFTER it (rebuilt): record again and compare character for character
# Each run opens next/saveprobe.html in an invisible browser: the PC, iPhone and Android test builds, seven start-up situations, thirteen
# save texts each (what is loaded, what is then written). The texts land in tools/shots/saveprobe_<base|now>__<build>_<start>.json; they
# are not kept in git: the record belongs to one change. Build first (build.ps1 -Preview). A run takes about two minutes.
param([switch]$Make, [switch]$Check, [int]$TimeoutMin = 10)
. (Join-Path $PSScriptRoot 'headless.ps1')
$tag = if ($Make) { 'base' } else { 'now' }
Get-ChildItem $script:Shots -Filter "saveprobe_${tag}__*.json" -ErrorAction SilentlyContinue | Remove-Item -Force
$srv = Start-ServerIfNeeded
$h = Start-Page "http://localhost:8766/next/saveprobe.html?go&tag=$tag" "saveprobe_$tag"
$done = Wait-Reports @($h) $TimeoutMin; Stop-Page $h
if ($srv) { try { Stop-Process -Id $srv.Id -Force } catch {} }
if (-not $done) { Write-Output "FAIL  no result within $TimeoutMin minutes"; exit 1 }
$j = Read-Json $h.file
if ($j.error) { Write-Output "FAIL  $($j.error)"; exit 1 }
$n = @($j.prints.PSObject.Properties).Count
if ($Make) { Write-Output "MADE  $n texts recorded from build $($j.stamp)"; exit 0 }
$baseFiles = @(Get-ChildItem $script:Shots -Filter 'saveprobe_base__*.json')
if (-not $baseFiles.Count) { Write-Output 'FAIL  nothing to compare with (run -Make on the build before the change)'; exit 1 }
$bad = 0; $same = 0; $utf8 = New-Object Text.UTF8Encoding $false
foreach ($bf in $baseFiles) {
  $nf = Join-Path $script:Shots ($bf.Name -replace '^saveprobe_base__', 'saveprobe_now__'); $what = ($bf.BaseName -replace '^saveprobe_base__', '')
  if (-not (Test-Path $nf)) { Write-Output "FAIL  $what : no result after the change"; $bad++; continue }
  $a = [IO.File]::ReadAllText($bf.FullName, $utf8); $b = [IO.File]::ReadAllText($nf, $utf8)
  if ([string]::CompareOrdinal($a, $b) -eq 0) { $same += @((ConvertFrom-Json $a).PSObject.Properties).Count; continue }
  # which texts differ, and where the first difference is
  $ja = ConvertFrom-Json $a; $jb = ConvertFrom-Json $b
  foreach ($p in $ja.PSObject.Properties) { $x = [string]$p.Value; $y = [string]$jb.($p.Name)
    if ([string]::CompareOrdinal($x, $y) -eq 0) { $same++; continue }
    $bad++; $i = 0; $m = [Math]::Min($x.Length, $y.Length); while ($i -lt $m -and $x[$i] -ceq $y[$i]) { $i++ }
    $from = [Math]::Max(0, $i - 60)
    Write-Output "FAIL  $what | $($p.Name) : differs at character $i"
    Write-Output ("        before: " + $x.Substring($from, [Math]::Min(160, $x.Length - $from)))
    Write-Output ("        after:  " + $y.Substring($from, [Math]::Min(160, $y.Length - $from))) }
  foreach ($p in $jb.PSObject.Properties) { if ($null -eq $ja.PSObject.Properties[$p.Name]) { $bad++; Write-Output "FAIL  $what | $($p.Name) : new after the change" } }
}
$newFiles = @(Get-ChildItem $script:Shots -Filter 'saveprobe_now__*.json').Count
if ($newFiles -ne $baseFiles.Count) { $bad++; Write-Output "FAIL  $newFiles result files after the change, $($baseFiles.Count) before" }
if ($bad) { Write-Output "FAIL  $bad texts differ, $same identical"; exit 1 }
Write-Output "PASS  all $same texts identical, character for character ($($baseFiles.Count) files; build $($j.stamp))"; exit 0
