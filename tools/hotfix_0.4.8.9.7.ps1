# Hotfix 0.4.8.9.7 for the live phone pages (live tags hold 0.4.9 work, so live hotfixes are patched into the built pages; see docs/LESSONS.md).
#   Catch cards: after a shiny or mythic fish, the next card (junk, an oddity) could keep showing that fish, because the fish's sparkle
#   animation kept repainting the card picture. The card lets the old animation go before it draws. The same fix went live on PC as
#   0.4.8.9.6 on 2026-11-21; this brings it to Android and iPhone (0.4.8.9.5 and 0.4.8.9.6 were PC-only numbers).
# Phones only: pc.html, index.html and version.txt are copied unchanged, so PC sees no update.
# Usage:  powershell -ExecutionPolicy Bypass -File tools\hotfix_0.4.8.9.7.ps1 -From site -To testapps\hotfix -Stamp 2026.11.22-xxxx
#         powershell -ExecutionPolicy Bypass -File tools\hotfix_0.4.8.9.7.ps1 -From site -To site -Stamp <same stamp>
param([Parameter(Mandatory)][string]$From, [Parameter(Mandatory)][string]$To, [Parameter(Mandatory)][string]$Stamp)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot)
$enc = New-Object System.Text.UTF8Encoding($false)
$OldStamp = '2026.11.19-2100'
New-Item -ItemType Directory -Force $To | Out-Null

function Once([string]$text, [string]$find, [string]$repl, [string]$what) {
  $n = ([regex]::Matches($text, [regex]::Escape($find))).Count
  if ($n -ne 1) { throw "$what : expected exactly 1 match, found $n" }
  return $text.Replace($find, $repl)
}

$note = "PATCHES.unshift({v:'0.4.8.9.7', name:'Hotfix', items:['Catch cards always show what you caught: after a shiny or mythic fish, the next card could keep showing that fish.']});"
$cardOld = "function showCard(o){`n  o.draw(`$('cardfish'));"
$cardNew = "function showCard(o){`n  spkDrop(`$('cardfish')); /* 0.4.8.9.7 hotfix: the last card's sparkle animation repainted its fish over the next card */ o.draw(`$('cardfish'));"

foreach ($f in 'android.html','ios.html') {
  $t = [IO.File]::ReadAllText("$From\$f", $enc)
  $t = Once $t "window.DL_VERSION='$OldStamp'" "window.DL_VERSION='$Stamp'" "$f stamp"
  $t = Once $t "const GAME_VERSION = '0.4.8.9.4';" "const GAME_VERSION = '0.4.8.9.7';" "$f version"
  $i = $t.IndexOf("PATCHES.unshift({v:'0.4.8.9.4'"); if ($i -lt 0) { throw "$f notes anchor missing" }
  $e = $t.IndexOf("`n", $i); if ($e -lt 0) { throw "$f notes anchor has no line end" }
  $t = $t.Substring(0, $e) + "`n" + $note + $t.Substring($e)
  $t = Once $t $cardOld $cardNew "$f catch card"
  [IO.File]::WriteAllText("$To\$f", $t, $enc)
}
if ((Resolve-Path $From).Path -ne (Resolve-Path $To).Path) { foreach ($f in 'pc.html','index.html','version.txt') { Copy-Item "$From\$f" "$To\$f" -Force } }
if (([IO.File]::ReadAllText("$From\version-phone.txt", $enc)).Trim() -ne $OldStamp) { throw "version-phone.txt is not $OldStamp" }
[IO.File]::WriteAllText("$To\version-phone.txt", $Stamp, $enc)
Write-Output "Hotfix 0.4.8.9.7 (phones only) written to $To with stamp $Stamp"
