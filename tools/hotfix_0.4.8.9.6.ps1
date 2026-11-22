# Hotfix 0.4.8.9.6 for the live PC page (live tags hold 0.4.9 work, so live hotfixes are patched into the built pages; see docs/LESSONS.md).
#   Catch cards: after a shiny or mythic fish, the next card (junk, an oddity) kept showing that fish, because the fish's sparkle
#   animation kept repainting the card picture. The card lets the old animation go before it draws. Reported by the director on
#   live PC 2026-11-21 (Toaster card showing a fish; Brass Spyglass card showing a crab), incident logged in docs/qc_incidents.csv.
#   (The phone hotfix once planned under this number was dropped and never shipped: tools/hotfix_0.4.8.9.6_phones_dropped.ps1.)
# PC only: android.html, ios.html, index.html and version-phone.txt are copied unchanged, so phones see no update.
# Usage:  powershell -ExecutionPolicy Bypass -File tools\hotfix_0.4.8.9.6.ps1 -From site -To testapps\hotfix -Stamp 2026.11.21-xxxx
#         powershell -ExecutionPolicy Bypass -File tools\hotfix_0.4.8.9.6.ps1 -From site -To site -Stamp <same stamp>
param([Parameter(Mandatory)][string]$From, [Parameter(Mandatory)][string]$To, [Parameter(Mandatory)][string]$Stamp)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot)
$enc = New-Object System.Text.UTF8Encoding($false)
$OldStamp = '2026.11.20-0238'
New-Item -ItemType Directory -Force $To | Out-Null

function Once([string]$text, [string]$find, [string]$repl, [string]$what) {
  $n = ([regex]::Matches($text, [regex]::Escape($find))).Count
  if ($n -ne 1) { throw "$what : expected exactly 1 match, found $n" }
  return $text.Replace($find, $repl)
}

$notesAnchor = "PATCHES.unshift({v:'0.4.8.9.5', name:'Hotfix', items:['Rods (full screen): the rod in your hands shows its attachment slots again, so you can fit attachments.']});"
$pcNote = "PATCHES.unshift({v:'0.4.8.9.6', name:'Hotfix', items:['Catch cards always show what you caught: after a shiny or mythic fish, the next card kept showing that fish.']});"
$cardOld = "function showCard(o){`n  o.draw(`$('cardfish'));"
$cardNew = "function showCard(o){`n  spkDrop(`$('cardfish')); /* 0.4.8.9.6 hotfix: the last card's sparkle animation repainted its fish over the next card */ o.draw(`$('cardfish'));"

$t = [IO.File]::ReadAllText("$From\pc.html", $enc)
$t = Once $t "window.DL_VERSION='$OldStamp'" "window.DL_VERSION='$Stamp'" 'pc stamp'
$t = Once $t "const GAME_VERSION = '0.4.8.9.5';" "const GAME_VERSION = '0.4.8.9.6';" 'pc version'
$t = Once $t $notesAnchor ($notesAnchor + "`n" + $pcNote) 'pc notes'
$t = Once $t $cardOld $cardNew 'pc catch card'
[IO.File]::WriteAllText("$To\pc.html", $t, $enc)

if ((Resolve-Path $From).Path -ne (Resolve-Path $To).Path) { foreach ($f in 'android.html','ios.html','index.html','version-phone.txt') { Copy-Item "$From\$f" "$To\$f" -Force } }
if (([IO.File]::ReadAllText("$From\version.txt", $enc)).Trim() -ne $OldStamp) { throw "version.txt is not $OldStamp" }
[IO.File]::WriteAllText("$To\version.txt", $Stamp, $enc)
Write-Output "Hotfix 0.4.8.9.6 (PC only) written to $To with stamp $Stamp"
