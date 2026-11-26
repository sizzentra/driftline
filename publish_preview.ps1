# Publishes only the 0.3 preview (site/next/). Friends' live game (site/index.html) is not rebuilt or changed.
# Run:  powershell -ExecutionPolicy Bypass -File publish_preview.ps1 -Message "Preview: what changed"
param([string]$Message = 'Driftline 0.3 preview')
Set-Location $PSScriptRoot
powershell -ExecutionPolicy Bypass -File build.ps1 -Preview
git add -A
git commit -q -m $Message -m 'Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>'
git push -q origin main
powershell -NoProfile -ExecutionPolicy Bypass -File tools/push_folder.ps1 -Prefix site -Remote origin
Write-Output 'Preview published. Live in about a minute at https://sizzentra.github.io/driftline/next/'
