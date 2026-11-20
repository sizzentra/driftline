# Publishes the phone test apps (built into testapps/ by build.ps1 -Preview) to https://sizzentra.github.io/driftline-test/
#   /android/ = "DL Test Android"    /iphone/ = "DL Test iPhone"
# They have their own GitHub Pages project so Android never mixes them up with the live Driftline app.
# Run after a preview build and a passing check:  powershell -ExecutionPolicy Bypass -File publish_testapps.ps1
# Refuses unless check.ps1 passed for exactly this build (tools/check_gate.ps1).
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
. (Join-Path $PSScriptRoot 'tools\check_gate.ps1')
Assert-CheckPassed $PSScriptRoot
git add testapps checks
git commit -q -m 'Phone test apps: new preview build' -m 'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>'
git subtree push --prefix testapps https://github.com/sizzentra/driftline-test.git gh-pages
Write-Output 'Phone test apps published. Live in about a minute at https://sizzentra.github.io/driftline-test/'
