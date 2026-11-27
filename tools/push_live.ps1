# Publishes the live game from the "live" branch (Foundation F2, 2026-11-26).
# The live site and the PC test build share one Pages branch: the live files at its top come from the live branch's site/
# folder, the test build in next/ comes from main. This script puts live's site/ on the Pages branch and keeps next/ exactly
# as it is published now, as one new commit, then checks the published files are identical to the live branch.
# It publishes what is on the remote live branch, so commit and push live first.
# See what it would do, changing nothing:  powershell -ExecutionPolicy Bypass -File tools/push_live.ps1 -DryRun
# Publish (only on the rules of the live-and-hotfix skill):  powershell -ExecutionPolicy Bypass -File tools/push_live.ps1
param([string]$Remote = 'origin', [string]$Branch = 'gh-pages', [string]$LiveBranch = 'live', [string]$Message = '', [switch]$DryRun)
Set-Location (Split-Path $PSScriptRoot -Parent)
git fetch -q $Remote $LiveBranch
if ($LASTEXITCODE -ne 0) { Write-Error "push_live: could not read $LiveBranch from $Remote."; exit 1 }
$live = git rev-parse FETCH_HEAD
$local = git rev-parse -q --verify "refs/heads/$LiveBranch"
if ($local -and $local -ne $live) { Write-Error "push_live: the local $LiveBranch branch ($local) is not what is on $Remote ($live); push it first."; exit 1 }
$liveSite = git rev-parse "${live}:site"
if ($LASTEXITCODE -ne 0 -or -not $liveSite) { Write-Error "push_live: $LiveBranch has no site folder."; exit 1 }
if (git ls-tree $liveSite next) { Write-Error "push_live: $LiveBranch holds a next folder; the test build belongs to main."; exit 1 }
git fetch -q $Remote $Branch
if ($LASTEXITCODE -ne 0) { Write-Error "push_live: could not read $Branch from $Remote."; exit 1 }
$parent = git rev-parse FETCH_HEAD
$old = git rev-parse "${parent}^{tree}"
# The new published folder: live's site/ plus the published next/ (built in a throwaway index; the checkout is not touched).
$idx = Join-Path ([IO.Path]::GetTempPath()) ("dl_push_live_" + [Guid]::NewGuid().ToString('N') + ".index")
$env:GIT_INDEX_FILE = $idx
try {
  git read-tree $liveSite
  if ($LASTEXITCODE -ne 0) { throw 'read-tree (live) failed' }
  if (git ls-tree $old next) { git read-tree --prefix=next/ "${old}:next"; if ($LASTEXITCODE -ne 0) { throw 'read-tree (next) failed' } }
  $tree = git write-tree
  if ($LASTEXITCODE -ne 0 -or -not $tree) { throw 'write-tree failed' }
} catch { Write-Error "push_live: could not put the published folder together: $_"; exit 1 }
finally { Remove-Item Env:\GIT_INDEX_FILE; Remove-Item $idx -ErrorAction SilentlyContinue }
$short = $live.Substring(0, 7)
if ($tree -eq $old) { Write-Output "push_live: the published live files are already identical to $LiveBranch ($short); nothing to publish."; exit 0 }
$changes = git diff-tree -r --name-status $old $tree
if ($changes | Where-Object { $_ -match "`tnext/" }) { Write-Error 'push_live: the test build (next/) would change; stopping.'; exit 1 }
if ($DryRun) { Write-Output "push_live (dry run): publishing $LiveBranch ($short) would change these live files:"; $changes; exit 0 }
if (-not $Message) { $Message = "Publish live from $short" }
$commit = git commit-tree $tree -p $parent -m $Message
if ($LASTEXITCODE -ne 0 -or -not $commit) { Write-Error 'push_live: could not make the publish commit.'; exit 1 }
git push -q $Remote "${commit}:refs/heads/$Branch"
if ($LASTEXITCODE -ne 0) { Write-Error "push_live: push to $Remote $Branch failed."; exit 1 }
git fetch -q $Remote $Branch
$now = git rev-parse "FETCH_HEAD^{tree}"
if ($now -ne $tree) { Write-Error "push_live: published tree $now differs from the expected tree $tree."; exit 1 }
Write-Output "push_live: $LiveBranch ($short) published to $Remote $Branch (live files identical to the branch, next/ unchanged)."
