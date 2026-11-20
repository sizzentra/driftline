# Proves the device report (phase 2): opens tools/check/devreport_proof.html in headless Chrome (own empty profile) through a
# temporary copy of the local server, waits for its report and prints it. Run: powershell -ExecutionPolicy Bypass -File tools/check/devreport_proof.ps1
$repo = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$out = Join-Path $repo 'checks\parts\devreport.json'; if (Test-Path $out) { Remove-Item $out -Force }
$srv = Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File',(Join-Path $repo 'tools\serve_local.ps1'),'-Port','8767' -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 2
$chrome = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
$prof = Join-Path $env:TEMP 'dl-check-devreport'; if (Test-Path $prof) { Remove-Item $prof -Recurse -Force -ErrorAction SilentlyContinue }
$c = Start-Process $chrome -ArgumentList '--headless=new','--disable-gpu','--no-first-run','--mute-audio','--disable-background-timer-throttling','--disable-renderer-backgrounding',"--user-data-dir=$prof",'--window-size=1000,600','http://localhost:8767/_check/devreport_proof.html' -PassThru -WindowStyle Hidden
$limit = (Get-Date).AddSeconds(90); while (-not (Test-Path $out) -and (Get-Date) -lt $limit) { Start-Sleep -Milliseconds 500 }
Start-Sleep -Milliseconds 300
& taskkill.exe /PID $c.Id /T /F 2>&1 | Out-Null; & taskkill.exe /PID $srv.Id /T /F 2>&1 | Out-Null
Remove-Item $prof -Recurse -Force -ErrorAction SilentlyContinue
if (Test-Path $out) { (Get-Content $out -Raw -Encoding UTF8 | ConvertFrom-Json).text; Remove-Item $out -Force } else { 'NO REPORT (timed out)' }
