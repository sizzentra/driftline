# Foundation F1 (2026-11-26): the baseline "pictures" as fingerprints, for proving that a change altered nothing a player sees.
#   powershell -ExecutionPolicy Bypass -File tools/baseline.ps1 -Check    compare the test builds as they are now with the agreed set
#   powershell -ExecutionPolicy Bypass -File tools/baseline.ps1 -Make     run now and store the result as the agreed set (tools/baseline/)
# Each run opens next/baseline.html for the three test saves (tools/saves/) in an invisible browser: every water at dawn, day, dusk and
# night and every menu page, on the PC, iPhone and Android test builds. Build first (build.ps1 -Preview). -Saves new,mid picks saves.
# The agreed set belongs to this PC's browser version: after a browser update, make it again from an unchanged build before trusting it.
# A save that differs is run a second time: a real change differs both times; a one-off wobble (about 1 run in 15 when measured, a
# timed pop-up or a busy PC) passes the second time and is reported as a wobble. -Make runs twice and refuses if its two runs differ.
param([switch]$Make, [switch]$Check, [string[]]$Saves = @('new','mid','heavy'), [int]$TimeoutMin = 15)
. (Join-Path $PSScriptRoot 'headless.ps1')
$Saves = @($Saves | ForEach-Object { $_ -split ',' } | Where-Object { $_ })   # "new,mid" arrives as one word when the script is started with -File
if (-not $Make -and -not $Check) { $Check = $true }
# drawn without the graphics card: the card gives slightly different pixels from run to run, plain software drawing gives the same ones every time (measured 2026-11-26)
$script:ExtraArgs = @('--disable-gpu')
$store = Join-Path $PSScriptRoot 'baseline'; New-Item -ItemType Directory -Force $store | Out-Null
function Get-Prints($j) { $m = @{}; foreach ($b in $j.builds.PSObject.Properties) { foreach ($kind in 'scenes','pages') { foreach ($p in $b.Value.$kind.PSObject.Properties) { $m["$($b.Name) $kind $($p.Name)"] = [string]$p.Value } } }; return $m }
function Compare-Prints($a, $b) { $d = @(); foreach ($k in $a.Keys) { if (-not $b.ContainsKey($k)) { $d += "$k : gone" } elseif ($b[$k] -ne $a[$k]) { $d += "$k : changed" } }; foreach ($k in $b.Keys) { if (-not $a.ContainsKey($k)) { $d += "$k : new" } }; return ,@($d | Sort-Object) }
# runs the page for each save; returns save -> result object, or an error text
function Invoke-Run([string[]]$list) {
  $hs = @{}; foreach ($s in $list) { $hs[$s] = Start-Page "http://localhost:8766/next/baseline.html?go&save=$s" "baseline_$s" }
  $done = Wait-Reports @($hs.Values) $TimeoutMin; $out = @{}
  foreach ($s in $list) { Stop-Page $hs[$s]
    if (-not ($done | Where-Object { $_.file -eq $hs[$s].file })) { $out[$s] = "no result within $TimeoutMin minutes"; continue }
    $j = Read-Json $hs[$s].file; if ($j.error) { $out[$s] = [string]$j.error } else { $out[$s] = $j } }
  return $out
}
$srv = Start-ServerIfNeeded
$bad = 0; $first = Invoke-Run $Saves
if ($Make) {
  $second = Invoke-Run $Saves
  foreach ($s in $Saves) {
    if ($first[$s] -is [string]) { Write-Output "FAIL  $s : $($first[$s])"; $bad++; continue }
    if ($second[$s] -is [string]) { Write-Output "FAIL  $s : $($second[$s])"; $bad++; continue }
    $a = Get-Prints $first[$s]; $d = Compare-Prints $a (Get-Prints $second[$s])
    if ($d.Count) { $bad++; Write-Output "FAIL  $s : two runs of the same build differ in $($d.Count) of $($a.Count) (not stored; run -Make again)"; $d | Select-Object -First 10 | ForEach-Object { "        $_" }; continue }
    Copy-Item (Join-Path $script:Shots "baseline_$s.json") (Join-Path $store "$s.json") -Force
    Write-Output "MADE  $s : $($a.Count) fingerprints, the same in two runs, build $($first[$s].stamp)"
  }
} else {
  $again = @(); $diffs = @{}
  foreach ($s in $Saves) {
    $old = Join-Path $store "$s.json"
    if ($first[$s] -is [string]) { Write-Output "FAIL  $s : $($first[$s])"; $bad++; continue }
    if (-not (Test-Path $old)) { Write-Output "FAIL  $s : no agreed set yet (run with -Make)"; $bad++; continue }
    $o = Get-Prints (Read-Json $old); $d = Compare-Prints $o (Get-Prints $first[$s])
    if ($d.Count) { $again += $s; $diffs[$s] = $d } else { Write-Output "PASS  $s : all $($o.Count) fingerprints match the agreed set" }
  }
  if ($again.Count) {
    $second = Invoke-Run $again
    foreach ($s in $again) {
      if ($second[$s] -is [string]) { Write-Output "FAIL  $s : $($second[$s])"; $bad++; continue }
      $oj = Read-Json (Join-Path $store "$s.json"); $o = Get-Prints $oj; $d2 = Compare-Prints $o (Get-Prints $second[$s])
      if ($d2.Count) { $bad++; Write-Output "FAIL  $s : $($d2.Count) of $($o.Count) differ from the agreed set, in two runs (build $($oj.stamp) -> $($second[$s].stamp))"; $d2 | Select-Object -First 40 | ForEach-Object { "        $_" } }
      else { Write-Output "PASS  $s : all $($o.Count) fingerprints match the agreed set (the first run wobbled in $($diffs[$s].Count), the second matched)" }
    }
  }
}
if ($srv) { try { Stop-Process -Id $srv.Id -Force } catch {} }
if ($bad) { exit 1 } else { exit 0 }
