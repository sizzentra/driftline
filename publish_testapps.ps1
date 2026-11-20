# Publishes the phone test apps (built into testapps/ by build.ps1 -Preview) to https://sizzentra.github.io/driftline-test/
#   /android/ = "DL Test Android"    /iphone/ = "DL Test iPhone"
# They have their own GitHub Pages project so Android never mixes them up with the live Driftline app.
# Run after a preview build:  powershell -ExecutionPolicy Bypass -File publish_testapps.ps1
Set-Location $PSScriptRoot
git add testapps
git commit -q -m 'Phone test apps: new preview build' -m 'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>'
git subtree push --prefix testapps https://github.com/sizzentra/driftline-test.git gh-pages
Write-Output 'Phone test apps published. Live in about a minute at https://sizzentra.github.io/driftline-test/'
