# The automatic check (phase 2, 2026-11-19): ONE command, Chrome's engine, nothing installed.
#   powershell -ExecutionPolicy Bypass -File check.ps1
# Checks the test build that is built right now (site/next/ and testapps/; run build.ps1 -Preview first), never rebuilds it:
#   1. code rules (tools/code_rules.ps1: the same rules build.ps1 refuses on), stamps and copies
#   2. the parse gate: every script on every page compiles
#   3. each build at the real screen sizes: the director's iPhone 16 Pro Max, Cam's Pixel 10, PC 1920x1080 and 1440x900. In each:
#      the logic tests (__qa), the layout of every page (__layoutQC), the phone frame on every page (__spec), Search and Quests,
#      how long each page takes to open, and every error during the run (src/testonly/check_runner.js)
# Prints PASS or FAIL and a "Not verified" list (never empty), and writes checks/report-<stamp>.txt plus checks/latest.json.
# publish_testapps.ps1 and publish_preview.ps1 refuse to run unless checks/latest.json says PASS for the stamp being published.
# The browser runs headless (no window) with its own empty profile, so it never touches your Chrome, its sign-ins or the game save.
# -Pane: don't start Chrome; print the addresses to open in Claude's built-in browser instead and wait for their results.
# -Only iphone,pc900: run only those screens (for proving one check); the result is then PARTIAL, which never unlocks a publish.
param([int]$Port = 8767, [switch]$Pane, [int]$TimeoutSec = 420, [string[]]$Only)
$ErrorActionPreference = 'Stop'
$repo = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding $false
$t0 = Get-Date
$lines = New-Object System.Collections.Generic.List[string]
$notVerified = New-Object System.Collections.Generic.List[string]
$fail = 0
function Say([string]$s) { $lines.Add($s); Write-Output $s }
function Sec([string]$name, [bool]$ok, [string]$detail, $problems) {
  $script:fail += [int](-not $ok)
  Say ("  {0}  {1}{2}" -f $(if ($ok) { 'PASS' } else { 'FAIL' }), $name, $(if ($detail) { ": $detail" } else { '' }))
  foreach ($p in @($problems | Where-Object { $_ } | Select-Object -First 25)) { Say "          - $p" }
}

$stamp = ([IO.File]::ReadAllText((Join-Path $repo 'site\next\version.txt'))).Trim()
Say "Driftline automatic check, test build $stamp ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))"

# ---------- 1. code rules, stamps and copies ----------
Say ''; Say 'Code rules and build files'
. (Join-Path $repo 'tools\code_rules.ps1')
$buildText = [IO.File]::ReadAllText((Join-Path $repo 'build.ps1'))
$coreLine = [regex]::Match($buildText, '(?m)^\$core = (.+)$').Groups[1].Value
$core = [regex]::Matches($coreLine, "'([^']+)'") | ForEach-Object { $_.Groups[1].Value }
$coreFiles = ($core + 'e_ui.js') | Where-Object { $_ -notmatch '^(pc|mobile|android|ios):' }
$src = Test-SourceRules $repo $coreFiles
Sec 'source rules (platform code stays in its own files; no function replaced and left behind)' ($src.Count -eq 0) '' $src
$read = { param($p) [IO.File]::ReadAllText((Join-Path $repo $p)) }
$prev = @{ pc = (& $read 'site\next\pc.html'); android = (& $read 'site\next\android.html'); ios = (& $read 'site\next\ios.html') }
$rel = @{ pc = (& $read 'site\pc.html'); android = (& $read 'site\android.html'); ios = (& $read 'site\ios.html') }
$b1 = Test-BuiltRules $repo $prev -Preview
Sec 'test build pages (no function twice, no dead function, own platform files only, no look-behind on phones)' ($b1.Count -eq 0) '' $b1
$b2 = @(Test-BuiltRules $repo $rel | Where-Object { $_ -notlike 'dead function*' -and $_ -notlike '*is missing from*' -and $_ -notlike '*ended up in*' })
Sec 'live pages (no test code, no look-behind on phones)' ($b2.Count -eq 0) '' $b2
$st = @()
$stampOf = { param($t) [regex]::Match($t, "window\.DL_VERSION='([^']+)'").Groups[1].Value }
foreach ($p in 'pc','android','ios') { $s = & $stampOf $prev[$p]; if ($s -ne $stamp) { $st += "site/next/$p.html has stamp $s, version.txt says $stamp" } }
$vp = (& $read 'site\next\version-phone.txt').Trim(); if ($vp -ne $stamp) { $st += "site/next/version-phone.txt says $vp" }
foreach ($pair in @(@('android','android','Android'), @('iphone','ios','iPhone'))) {
  $ta = & $read "testapps\$($pair[0])\index.html"
  foreach ($vf in 'version.txt','version-phone.txt') { $v = (& $read "testapps\$($pair[0])\$vf").Trim(); if ($v -ne $stamp) { $st += "testapps/$($pair[0])/$vf says $v, the test build is $stamp" } }
  if ($ta.Replace('content="DL Test ' + $pair[2] + '">', 'content="DL Test">') -ne $prev[$pair[1]]) { $st += "testapps/$($pair[0]) is not the same build as site/next/$($pair[1]).html (rebuild with build.ps1 -Preview)" }
}
$liveV = (& $read 'site\version.txt').Trim(); $livePV = (& $read 'site\version-phone.txt').Trim()
if ((& $stampOf $rel['pc']) -ne $liveV) { $st += "live pc.html has stamp $(& $stampOf $rel['pc']) but version.txt says $liveV (endless update bar, incident #43)" }
foreach ($p in 'android','ios') { if ((& $stampOf $rel[$p]) -ne $livePV) { $st += "live $p.html has stamp $(& $stampOf $rel[$p]) but version-phone.txt says $livePV (endless update bar, incident #43)" } }
Sec 'stamps match their version files; the phone test apps are exactly this build' ($st.Count -eq 0) "test build $stamp, live $liveV" $st

# ---------- 2 + 3. in Chrome's engine ----------
$parts = Join-Path $repo 'checks\parts'
New-Item -ItemType Directory -Force $parts | Out-Null
Get-ChildItem $parts -Filter *.json | Remove-Item -Force
$targets = @(
  @{ id = 'gate';   label = 'parse gate';                          url = '/_check/gate.html'; w = 1200; h = 800 },
  @{ id = 'iphone'; label = 'iPhone 16 Pro Max (956x440, camera and corners simulated)'; url = '/next/ios.html?test&iphone'; w = 956; h = 440; safe = '59,59,0,21' },
  @{ id = 'pixel';  label = 'Pixel 10 (915x412)';                  url = '/next/android.html?test'; w = 915; h = 412 },
  @{ id = 'pc1080'; label = 'PC 1920x1080';                        url = '/next/pc.html?test'; w = 1920; h = 1080 },
  @{ id = 'pc900';  label = 'PC 1440x900';                         url = '/next/pc.html?test'; w = 1440; h = 900 }
)
if ($Only) { $targets = @($targets | Where-Object { $_.id -eq 'gate' -or $Only -contains $_.id }) }
$server = $null
try { Invoke-WebRequest "http://localhost:$Port/version.txt" -UseBasicParsing -TimeoutSec 2 | Out-Null } catch {
  $server = Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File',(Join-Path $repo 'tools\serve_local.ps1'),'-Port',$Port -WindowStyle Hidden -PassThru
  for ($i = 0; $i -lt 40; $i++) { Start-Sleep -Milliseconds 250; try { Invoke-WebRequest "http://localhost:$Port/version.txt" -UseBasicParsing -TimeoutSec 2 | Out-Null; break } catch {} }
}
$chrome = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LocalAppData\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome -and -not $Pane) { Say ''; Sec 'Chrome engine' $false 'neither Chrome nor Edge was found on this PC (run with -Pane and use the built-in browser)' @() }
$results = @{}; $dw = 0; $dh = 0  # the headless window keeps a border for itself; measured on the gate page, then added to every size
try {
  foreach ($tg in $targets) {
    if (-not $chrome -and -not $Pane) { break }
    $url = "http://localhost:$Port$($tg.url)"
    if ($tg.id -ne 'gate') { $url += "&autocheck=$($tg.id)&w=$($tg.w)&h=$($tg.h)" + $(if ($tg.safe) { "&safe=$($tg.safe)" } else { '' }) }
    $out = Join-Path $parts "$($tg.id).json"; $proc = $null; $prof = $null
    if ($Pane) { Write-Output "  open in the built-in browser at $($tg.w)x$($tg.h): $url" }
    else {
      $prof = Join-Path $env:TEMP "dl-check-$($tg.id)"; if (Test-Path $prof) { Remove-Item $prof -Recurse -Force -ErrorAction SilentlyContinue }
      $cargs = @('--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-extensions','--mute-audio','--hide-scrollbars','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows',"--user-data-dir=$prof","--window-size=$($tg.w + $dw),$($tg.h + $dh)",$url)
      $proc = Start-Process $chrome -ArgumentList $cargs -PassThru -WindowStyle Hidden
    }
    $limit = (Get-Date).AddSeconds($(if ($tg.id -eq 'gate') { 60 } else { $TimeoutSec }))
    while (-not (Test-Path $out) -and (Get-Date) -lt $limit) { Start-Sleep -Milliseconds 500 }
    Start-Sleep -Milliseconds 300
    if ($proc) { & taskkill.exe /PID $proc.Id /T /F 2>&1 | Out-Null; Start-Sleep -Milliseconds 500; Remove-Item $prof -Recurse -Force -ErrorAction SilentlyContinue }
    if (Test-Path $out) { $results[$tg.id] = Get-Content $out -Raw -Encoding UTF8 | ConvertFrom-Json }
    else {
      $pg = Join-Path $parts "$($tg.id)-progress.json"; $at = if (Test-Path $pg) { (Get-Content $pg -Raw | ConvertFrom-Json).at } else { 'before the check started (the page did not boot)' }
      $results[$tg.id] = [pscustomobject]@{ ok = $false; steps = @([pscustomobject]@{ name = 'finished in time'; ok = $false; detail = "no result after the time limit; it stopped at: $at" }) }
    }
    if ($tg.id -eq 'gate') { if (-not $results['gate'].ok) { break }; if ($results['gate'].win -and -not $Pane) { $dw = $tg.w - $results['gate'].win.w; $dh = $tg.h - $results['gate'].win.h } }  # a script that does not compile makes every later result meaningless
  }
} finally { if ($server) { & taskkill.exe /PID $server.Id /T /F 2>&1 | Out-Null } }

foreach ($tg in $targets) {
  if (-not $results.ContainsKey($tg.id)) { continue }
  $r = $results[$tg.id]
  Say ''; Say ("{0}{1}" -f $tg.label, $(if ($r.stamp -and $r.stamp -ne $stamp) { "  (page stamp $($r.stamp)!)" } else { '' }))
  if ($r.stamp -and $r.stamp -ne $stamp) { Sec 'the page tested is this build' $false "it showed $($r.stamp)" @() }
  foreach ($s in $r.steps) { Sec $s.name ([bool]$s.ok) "$($s.detail)$(if ($s.ms -gt 3000) { " ($([math]::Round($s.ms/1000)) s)" })" $s.problems }
}
$ran = @($targets | Where-Object { $results.ContainsKey($_.id) }).Count
if ($ran -lt $targets.Count) { $fail++; Say ''; Say "  FAIL  only $ran of $($targets.Count) browser runs happened (see above)" }

# ---------- Not verified (never empty: these are what no check here can see) ----------
$notVerified.Add('Real phones: the director''s iPhone (Safari''s engine; this check runs Chrome''s only) and Cam''s Pixel. The 5-minute phone script and the device reports cover them.')
$notVerified.Add('Touch and the installed app: real fingers, scrolling inside the water, taps after Back, opening from the home screen, full screen. Chrome here uses a mouse and a plain window.')
$notVerified.Add('Speed on the phones: this PC is far faster than a phone; real frame rates only come from the device reports.')
$notVerified.Add('Feel: whether fishing, menus and animations feel right. Only the director and Cam can judge that.')
$notVerified.Add('Pixel 10 screen size is assumed to be 915x412 until Cam''s device report gives the real one; split-screen sizes are not checked.')
$notVerified.Add('Looks: nothing here compares pictures of the pages; a page can pass every check and still look wrong.')
if ($Pane) { $notVerified.Add('Run in the built-in browser pane: if the pane was hidden, frame-based checks may have run without frames.') }
Say ''; Say 'Not verified'
foreach ($n in $notVerified) { Say "  - $n" }

$result = if ($fail -gt 0) { 'FAIL' } elseif ($Only) { 'PARTIAL' } else { 'PASS' }
$mins = [math]::Round(((Get-Date) - $t0).TotalMinutes, 1)
Say ''; Say "RESULT: $result for test build $stamp ($fail failed, $mins min)"
$dir = Join-Path $repo 'checks'
if ($Only) {
  # a partial run never replaces the full report or checks/latest.json (the publish gate reads only full runs)
  [IO.File]::WriteAllText((Join-Path $dir "report-$stamp-partial.txt"), ($lines -join "`r`n") + "`r`n", $utf8)
} else {
  [IO.File]::WriteAllText((Join-Path $dir "report-$stamp.txt"), ($lines -join "`r`n") + "`r`n", $utf8)
  . (Join-Path $repo 'tools\check_gate.ps1')
  $latest = [ordered]@{ stamp = $stamp; result = $result; failed = $fail; written = (Get-Date -Format 's'); report = "checks/report-$stamp.txt"; fingerprint = (Get-BuildFingerprint $repo) }
  [IO.File]::WriteAllText((Join-Path $dir 'latest.json'), ($latest | ConvertTo-Json), $utf8)
}
Get-ChildItem $parts -Filter *.json | Remove-Item -Force
if ($fail) { exit 1 }
