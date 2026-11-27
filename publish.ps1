# Rebuilds the game, commits, and publishes it to https://sizzentra.github.io/driftline/
# Run:  powershell -ExecutionPolicy Bypass -File publish.ps1 "What changed"
param([string]$Message = 'Update Driftline')
Set-Location $PSScriptRoot
powershell -ExecutionPolicy Bypass -File build.ps1
git add -A
git commit -q -m $Message -m 'Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>'
git push -q origin main
# Since Foundation F2 (2026-11-26) live is published from the live branch: record the new pages there, then publish that branch.
powershell -NoProfile -ExecutionPolicy Bypass -File tools/live_take_main.ps1 -Message $Message
if ($LASTEXITCODE -ne 0) { Write-Error 'publish: the live branch was not updated; nothing was published.'; exit 1 }
powershell -NoProfile -ExecutionPolicy Bypass -File tools/push_live.ps1
if ($LASTEXITCODE -ne 0) { Write-Error 'publish: the live publish failed.'; exit 1 }
Write-Output 'Published. Live in about a minute at https://sizzentra.github.io/driftline/'
