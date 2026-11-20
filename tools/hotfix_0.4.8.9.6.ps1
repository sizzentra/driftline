# Hotfix 0.4.8.9.6 for the live phone pages (live tags hold 0.4.9 work, so live hotfixes are patched into the built pages; see docs/LESSONS.md).
#   Android + iPhone: the Tide Pass page lost its Claim button (the phone page engine replaced the header box that held it with its
#   number strip), so rewards could not be claimed. The button now sits in the strip, like Sell all on the Cooler. Reported by Cam,
#   confirmed on live 2026-11-20, incident #140.
# Phones only: pc.html, index.html and version.txt are copied unchanged, so PC sees no update.
# The same script makes the check copy (testapps/hotfix/) and, once the phones confirm it, the live pages (site/): byte-identical.
# Usage:  powershell -ExecutionPolicy Bypass -File tools\hotfix_0.4.8.9.6.ps1 -From site -To testapps\hotfix -Stamp 2026.11.20-xxxx
#         powershell -ExecutionPolicy Bypass -File tools\hotfix_0.4.8.9.6.ps1 -From site -To site -Stamp <same stamp>
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

$dash = [char]0x2014
$passOld = "pass:{ cells:(P,hd)=>{ const t=hd&&hd.querySelector('.tile'); return [['Tide Pass',txt(t&&t.querySelector('.rar'))||'$dash'],['Progress',(txt(t&&t.querySelector('.meta'))||'').replace(/\s*to level.*`$/,'')||'$dash']]; } },"
$passNew = "pass:{ cells:(P,hd)=>{ const t=hd&&hd.querySelector('.tile'); return [['Tide Pass',txt(t&&t.querySelector('.rar'))||'$dash'],['Progress',(txt(t&&t.querySelector('.meta'))||'').replace(/\s*to level.*`$/,'')||'$dash']]; }, acts:P=>[P.querySelector('[data-act=`"passclaim`"]')] }, /* 0.4.8.9.6 hotfix: the Claim button sits in the strip (it went with the header box) */"
$notesAnchor = "PATCHES.unshift({v:'0.4.8.9.4', name:'Hotfix', items:['Top bar: with a live event on, the Bait button no longer gets squeezed to a sliver at waters with long names.']});"
$phoneNote = "PATCHES.unshift({v:'0.4.8.9.6', name:'Hotfix', items:['Tide Pass: the Claim button is back, so you can collect your rewards.']});"

foreach ($p in 'android','ios') {
  $t = [IO.File]::ReadAllText("$From\$p.html", $enc)
  $t = Once $t "window.DL_VERSION='$OldStamp'" "window.DL_VERSION='$Stamp'" "$p stamp"
  $t = Once $t "const GAME_VERSION = '0.4.8.9.4';" "const GAME_VERSION = '0.4.8.9.6';" "$p version"
  $t = Once $t $notesAnchor ($notesAnchor + "`n" + $phoneNote) "$p notes"
  $t = Once $t $passOld $passNew "$p tide pass claim"
  [IO.File]::WriteAllText("$To\$p.html", $t, $enc)
}
if ((Resolve-Path $From).Path -ne (Resolve-Path $To).Path) { foreach ($f in 'pc.html','index.html','version.txt') { Copy-Item "$From\$f" "$To\$f" -Force } }
if (([IO.File]::ReadAllText("$From\version-phone.txt", $enc)).Trim() -ne $OldStamp) { throw "version-phone.txt is not $OldStamp" }
[IO.File]::WriteAllText("$To\version-phone.txt", $Stamp, $enc)
Write-Output "Hotfix 0.4.8.9.6 (phones only) written to $To with stamp $Stamp"
