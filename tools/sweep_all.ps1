# Foundation F1 (2026-11-26): the whole sweep from one command, in an invisible browser, on the three test saves kept in git.
#   powershell -ExecutionPolicy Bypass -File tools/sweep_all.ps1                 every check, on new, mid and heavy (one after another)
#   powershell -ExecutionPolicy Bypass -File tools/sweep_all.ps1 -Saves new      one save
#   powershell -ExecutionPolicy Bypass -File tools/sweep_all.ps1 -Only gate,qa   only those parts (the sweep page's ?only= names)
#   -Together runs the saves side by side (faster, but a busy PC can make time limits trip); -Build builds the preview first.
# Reports: tools/shots/sweep_<save>.json. Exit code 0 only when no check failed (held findings do not fail a run).
# The browser pane stays the place for looking at things; this is for proving. Needs no installs: it uses Edge or Chrome as they are.
param([string[]]$Saves = @('new','mid','heavy'), [string[]]$Only = @(), [switch]$Together, [switch]$Build, [switch]$NoAndroid, [int]$TimeoutMin = 60)
. (Join-Path $PSScriptRoot 'headless.ps1')
$Saves = @($Saves | ForEach-Object { $_ -split ',' } | Where-Object { $_ })   # "new,mid" arrives as one word when the script is started with -File
$Only = @($Only | ForEach-Object { $_ -split ',' } | Where-Object { $_ })
if ($Build) { & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $script:Root 'build.ps1') -Preview | Select-Object -Last 1 }
$srv = Start-ServerIfNeeded
$q = 'go'; if (-not $NoAndroid) { $q += '&android' }; if ($Only.Count) { $q += '&only=' + ($Only -join ',') }
$t0 = Get-Date; $bad = 0
function Show-Result([string]$s, $h, $done) {
  if (-not $done) { Write-Host "FAIL  $s : no report within $TimeoutMin minutes"; return 1 }
  $r = Read-Json $h.file
  $word = if ($r.failed) { 'FAIL ' } else { 'PASS ' }
  Write-Host "$word $s : $($r.checks) checks, $($r.failed) failed, $($r.held) held, $($r.minutes) min, build $($r.stamp)"
  foreach ($x in $r.results) { if ($x.ok -eq $false) { Write-Host "        $($x.sec) / $($x.name): $($x.detail)"; foreach ($y in $x.list) { if ($y -notmatch '  \[(held|shelved):') { Write-Host "            $y" } } } }
  if ($r.failed) { return 1 } else { return 0 }
}
if ($Together) {
  $hs = @{}; foreach ($s in $Saves) { $hs[$s] = Start-Page "http://localhost:8766/next/sweep.html?$q&save=$s" "sweep_$s" }
  $done = Wait-Reports @($hs.Values) $TimeoutMin
  foreach ($s in $Saves) { Stop-Page $hs[$s]; $bad += Show-Result $s $hs[$s] ([bool]($done | Where-Object { $_.file -eq $hs[$s].file })) }
} else {
  foreach ($s in $Saves) { $h = Start-Page "http://localhost:8766/next/sweep.html?$q&save=$s" "sweep_$s"; $done = Wait-Reports @($h) $TimeoutMin; Stop-Page $h; $bad += Show-Result $s $h ([bool]$done.Count) }
}
if ($srv) { try { Stop-Process -Id $srv.Id -Force } catch {} }
Write-Output ("Total: {0:N1} minutes" -f ((Get-Date) - $t0).TotalMinutes)
if ($bad) { exit 1 } else { exit 0 }
