# Hotfix 0.4.8.9.4 for the live pages (live tags hold 0.4.9 work, so live hotfixes are patched into the built pages; see docs/LESSONS.md).
#   Phones: the Bait chip on the top bar keeps its full width (a live event + a long water name squeezed it to a sliver).
#   PC:     oddity names wrap to a second line instead of being cut off in small windows.
# The same script makes the test copy (testapps/hotfix/) and, after both phones confirm, the live pages (site/), so both are byte-identical.
# Usage:  powershell -ExecutionPolicy Bypass -File tools\hotfix_0.4.8.9.4.ps1 -From site -To testapps\hotfix -Stamp 2026.11.19-2050
#         powershell -ExecutionPolicy Bypass -File tools\hotfix_0.4.8.9.4.ps1 -From site -To site -Stamp <same stamp>
param([Parameter(Mandatory)][string]$From, [Parameter(Mandatory)][string]$To, [Parameter(Mandatory)][string]$Stamp)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot)
$enc = New-Object System.Text.UTF8Encoding($false)
$OldStamp = '2026.11.19-1402'
New-Item -ItemType Directory -Force $To | Out-Null

function Once([string]$text, [string]$find, [string]$repl, [string]$what) {
  $n = ([regex]::Matches($text, [regex]::Escape($find))).Count
  if ($n -ne 1) { throw "$what : expected exactly 1 match, found $n" }
  return $text.Replace($find, $repl)
}

$notesAnchor = "PATCHES.unshift({v:'0.4.8.9.3', name:'Hotfix', items:['Waters: each water" + [char]0x2019 + "s fish strength line now wraps instead of running past its card on small screens.']});"
$phoneNote = "PATCHES.unshift({v:'0.4.8.9.4', name:'Hotfix', items:['Top bar: with a live event on, the Bait button no longer gets squeezed to a sliver at waters with long names.']});"
$pcNote    = "PATCHES.unshift({v:'0.4.8.9.4', name:'Hotfix', items:['Oddities: long names wrap onto a second line instead of being cut off in smaller windows.','Pets: the pets still to find show only under Find more, not on Your pets and Customize.']});"

$hudAnchor = "html body.phone-app.dl-fish .hud #searchbtn{grid-column:5!important;grid-row:2!important}`n</style>``);"
$hudFix = $hudAnchor + "`n/* 0.4.8.9.4 hotfix: with a live event and a long water name the Bait chip was squeezed to a sliver (the small chips could shrink, so the bar`n   never overflowed and the step-aside rule never ran). Small chips keep their full width; Tasks, then Live make room as designed. */`ndocument.head.insertAdjacentHTML('beforeend','<style>html body.phone-land .hud > .mb-x{flex-shrink:0!important;min-width:max-content!important}</style>');"

$overOld = "    const over=()=>hud.scrollWidth>hud.clientWidth+1, L="
$overNew = "    /* 0.4.8.9.4 hotfix: out of room also means the Bait name is being cut (the Bait chip may shrink, so it soaked up all the shortage and`n       Tasks and Live never stepped aside) */`n    const over=()=>{ if(hud.scrollWidth>hud.clientWidth+1) return true; const bb=document.querySelector('#mbbait > b'); return !!(bb&&bb.offsetParent&&bb.scrollWidth>bb.clientWidth+1); }, L="

$odOld ='body.pch-on #panel .od-card b{font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}'
$odNew = 'body.pch-on #panel .od-card b{font-size:12.5px;line-height:1.2;white-space:normal;overflow-wrap:anywhere;max-width:100%;text-align:center} /* 0.4.8.9.4 hotfix: names wrap to a second line instead of being cut at small windows */'

$petOld = 'body.pch-on #panel .tile.pet-hid{grid-column:span 2;display:grid!important;grid-template-columns:'
$petNew = 'body.pch-on #panel .tile.pet-hid:not([style*="display: none"]):not([style*="display:none"]){display:grid!important} /* 0.4.8.9.4 hotfix: a forced display kept "Still to find" on every Pets tab */' + "`n" + 'body.pch-on #panel .tile.pet-hid{grid-column:span 2;grid-template-columns:'

foreach ($p in 'android','ios','pc') {
  $t = [IO.File]::ReadAllText("$From\$p.html", $enc)
  $t = Once $t "window.DL_VERSION='$OldStamp'" "window.DL_VERSION='$Stamp'" "$p stamp"
  $t = Once $t "const GAME_VERSION = '0.4.8.9.3';" "const GAME_VERSION = '0.4.8.9.4';" "$p version"
  if ($p -eq 'pc') {
    $t = Once $t $notesAnchor ($notesAnchor + "`n" + $pcNote) "$p notes"
    $t = Once $t $odOld $odNew "$p oddity names"
    $t = Once $t $petOld $petNew "$p pets still to find"
  } else {
    $t = Once $t $notesAnchor ($notesAnchor + "`n" + $phoneNote) "$p notes"
    $t = Once $t $hudAnchor $hudFix "$p bait chip"
    $t = Once $t $overOld $overNew "$p bait chip step-aside"
  }
  [IO.File]::WriteAllText("$To\$p.html", $t, $enc)
}
$t = [IO.File]::ReadAllText("$From\index.html", $enc)
[IO.File]::WriteAllText("$To\index.html", (Once $t "Driftline $OldStamp" "Driftline $Stamp" 'index stamp'), $enc)
foreach ($v in 'version.txt','version-phone.txt') {
  if (([IO.File]::ReadAllText("$From\$v", $enc)).Trim() -ne $OldStamp) { throw "$v is not $OldStamp" }
  [IO.File]::WriteAllText("$To\$v", $Stamp, $enc)
}
Write-Output "Hotfix 0.4.8.9.4 written to $To with stamp $Stamp"
