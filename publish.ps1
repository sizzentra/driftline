# Rebuilds the game, commits, and publishes it to https://sizzentra.github.io/driftline/
# Run:  powershell -ExecutionPolicy Bypass -File publish.ps1 "What changed"
param([string]$Message = 'Update Driftline')
Set-Location $PSScriptRoot
powershell -ExecutionPolicy Bypass -File build.ps1
git add -A
git commit -q -m $Message -m 'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>'
git push -q origin main
git subtree push --prefix site origin gh-pages
Write-Output 'Published. Live in about a minute at https://sizzentra.github.io/driftline/'
