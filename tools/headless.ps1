# Foundation F1 (2026-11-26): shared helpers for the one-command checks (tools/sweep_all.ps1, tools/baseline.ps1).
# They open a page of the local test builds in an invisible browser (Edge or Chrome, already on this PC; nothing to install) with a
# throw-away profile, and wait for the page to post its report to the local server (tools/shots/<name>.json).
$script:Root = Split-Path $PSScriptRoot -Parent
$script:Shots = Join-Path $PSScriptRoot 'shots'
$script:ExtraArgs = @()
function Get-Browser {
  foreach ($p in @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Google\Chrome\Application\chrome.exe")) { if (Test-Path $p) { return $p } }
  throw 'No Edge or Chrome found for the invisible browser.'
}
function Test-Server { try { (Invoke-WebRequest 'http://localhost:8766/version.txt' -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200 } catch { $false } }
# starts tools/serve_local.ps1 when it is not running; returns the process it started (or $null), so the caller can stop it again
function Start-ServerIfNeeded {
  if (Test-Server) { return $null }
  $p = Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File',(Join-Path $PSScriptRoot 'serve_local.ps1') -WindowStyle Hidden -PassThru
  for ($i = 0; $i -lt 40 -and -not (Test-Server); $i++) { Start-Sleep -Milliseconds 250 }
  if (-not (Test-Server)) { throw 'The local server did not start (tools/serve_local.ps1).' }
  return $p
}
# opens $Url invisibly; returns a handle to pass to Wait-Report / Stop-Page
function Start-Page([string]$Url, [string]$Report) {
  $file = Join-Path $script:Shots ($Report + '.json')
  $before = if (Test-Path $file) { (Get-Item $file).LastWriteTimeUtc } else { [datetime]::MinValue }
  $prof = Join-Path $env:TEMP ('dl-headless-' + [guid]::NewGuid().ToString('N'))
  $a = @('--headless=new', "--user-data-dir=$prof", '--no-first-run', '--no-default-browser-check', '--mute-audio', '--window-size=1600,1000', '--screen-info={1920x1080}',
         '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows') + @($script:ExtraArgs) + @($Url)
  $p = Start-Process (Get-Browser) -ArgumentList $a -PassThru
  return @{ proc = $p; prof = $prof; file = $file; before = $before; url = $Url; started = Get-Date }
}
function Test-Report($h) { (Test-Path $h.file) -and ((Get-Item $h.file).LastWriteTimeUtc -gt $h.before) }
function Stop-Page($h) {
  try { & taskkill /PID $h.proc.Id /T /F 2>$null | Out-Null } catch {}
  Get-CimInstance Win32_Process -Filter "Name='msedge.exe' OR Name='chrome.exe'" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*$($h.prof)*" } | ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop } catch {} }
  Start-Sleep -Milliseconds 400
  try { Remove-Item -Recurse -Force $h.prof -ErrorAction Stop } catch {}
}
# waits for every page's report (or the time limit); returns the handles that finished
function Wait-Reports($handles, [int]$TimeoutMin) {
  $end = (Get-Date).AddMinutes($TimeoutMin)
  while ((Get-Date) -lt $end -and ($handles | Where-Object { -not (Test-Report $_) })) { Start-Sleep -Seconds 3 }
  return @($handles | Where-Object { Test-Report $_ })
}
function Read-Json([string]$Path) { Get-Content $Path -Raw -Encoding UTF8 | ConvertFrom-Json }
