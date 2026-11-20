# Publishes the test build in site/next/ (the PC test app and /driftline/next/). Friends' live game (site/*.html) is not rebuilt.
# Run after build.ps1 -Preview and a passing check:  powershell -ExecutionPolicy Bypass -File publish_preview.ps1 -Message "Preview: what changed"
# It no longer rebuilds (a rebuild makes a new, unchecked build); it refuses unless check.ps1 passed for exactly this build.
param([string]$Message = 'Driftline preview')
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
. (Join-Path $PSScriptRoot 'tools\check_gate.ps1')
Assert-CheckPassed $PSScriptRoot
git add -A
git commit -q -m $Message -m 'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>'
git push -q origin main
git subtree push --prefix site origin gh-pages
Write-Output 'Preview published. Live in about a minute at https://sizzentra.github.io/driftline/next/'
