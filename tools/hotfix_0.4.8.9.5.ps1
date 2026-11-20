# Hotfix 0.4.8.9.5 for the live PC page (live tags hold 0.4.9 work, so live hotfixes are patched into the built pages; see docs/LESSONS.md).
#   PC (full screen, 1800x950 and up): Rods > "In your hands" was squeezed to the screen and its hidden overflow cut off the attachment
#   slot; the column scrolls instead. Found by the content check (__contentQC) on 2026-11-20, incident #133.
# PC only: android.html, ios.html, index.html and version-phone.txt are copied unchanged, so phones see no update.
# The same script makes the check copy (testapps/hotfix/) and, after the director's "Push it live", the live pages (site/): byte-identical.
# Usage:  powershell -ExecutionPolicy Bypass -File tools\hotfix_0.4.8.9.5.ps1 -From site -To testapps\hotfix -Stamp 2026.11.20-xxxx
#         powershell -ExecutionPolicy Bypass -File tools\hotfix_0.4.8.9.5.ps1 -From site -To site -Stamp <same stamp>
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

$notesAnchor = "PATCHES.unshift({v:'0.4.8.9.4', name:'Hotfix', items:['Oddities: long names wrap onto a second line instead of being cut off in smaller windows.','Pets: the pets still to find show only under Find more, not on Your pets and Customize.']});"
$pcNote = "PATCHES.unshift({v:'0.4.8.9.5', name:'Hotfix', items:['Rods (full screen): the rod in your hands shows its attachment slots again, so you can fit attachments.']});"
$rodOld = 'body.pc-fhd #panel .fhd-rodpair .fhd-you .fhd-body2{display:flex!important;flex-direction:column;gap:10px}'
$rodNew = $rodOld + "`n" + 'body.pc-fhd #panel .fhd-rodpair .fhd-you .fhd-body2 > *{flex-shrink:0} /* 0.4.8.9.5 hotfix: the column squeezed the In your hands card to the screen and its hidden overflow cut off the attachment slot; the column scrolls instead */'

$t = [IO.File]::ReadAllText("$From\pc.html", $enc)
$t = Once $t "window.DL_VERSION='$OldStamp'" "window.DL_VERSION='$Stamp'" 'pc stamp'
$t = Once $t "const GAME_VERSION = '0.4.8.9.4';" "const GAME_VERSION = '0.4.8.9.5';" 'pc version'
$t = Once $t $notesAnchor ($notesAnchor + "`n" + $pcNote) 'pc notes'
$t = Once $t $rodOld $rodNew 'pc rod card'
[IO.File]::WriteAllText("$To\pc.html", $t, $enc)

# phones and the router stay exactly as they are (copied only when writing a separate check copy)
if ((Resolve-Path $From).Path -ne (Resolve-Path $To).Path) { foreach ($f in 'android.html','ios.html','index.html','version-phone.txt') { Copy-Item "$From\$f" "$To\$f" -Force } }
if (([IO.File]::ReadAllText("$From\version.txt", $enc)).Trim() -ne $OldStamp) { throw "version.txt is not $OldStamp" }
[IO.File]::WriteAllText("$To\version.txt", $Stamp, $enc)
Write-Output "Hotfix 0.4.8.9.5 (PC only) written to $To with stamp $Stamp"
