# Records a release on the "live" branch (Foundation F2, 2026-11-26): one new commit on live whose site/ folder is the
# last main commit's site/ without next/ (the test build). For releases, where the pages are built on main by build.ps1.
# A hotfix does not need this: it is committed on live directly (live-and-hotfix skill).
# Nothing is published by this script; tools/push_live.ps1 publishes the live branch afterwards.
# See what would change, changing nothing:  powershell -ExecutionPolicy Bypass -File tools/live_take_main.ps1 -DryRun
# Record it:  powershell -ExecutionPolicy Bypass -File tools/live_take_main.ps1 -Message "Live for ...: 0.5 ..."
param([string]$Message = '', [string]$Remote = 'origin', [string]$LiveBranch = 'live', [switch]$DryRun)
Set-Location (Split-Path $PSScriptRoot -Parent)
$dirty = git status --porcelain --untracked-files=no -- site
if ($dirty) { Write-Error 'live_take_main: site has uncommitted changes; commit first.'; exit 1 }
git fetch -q $Remote $LiveBranch
if ($LASTEXITCODE -ne 0) { Write-Error "live_take_main: could not read $LiveBranch from $Remote."; exit 1 }
$live = git rev-parse FETCH_HEAD
$local = git rev-parse -q --verify "refs/heads/$LiveBranch"
if ($local -and $local -ne $live) { Write-Error "live_take_main: the local $LiveBranch branch is not what is on $Remote; push or reset it first."; exit 1 }
$old = git rev-parse "${live}^{tree}"
# The new live folder, built in a throwaway index (the checkout is not touched): everything live has outside site/ stays
# (its README), site/ becomes main's site/ without next/.
$idx = Join-Path ([IO.Path]::GetTempPath()) ("dl_live_take_" + [Guid]::NewGuid().ToString('N') + ".index")
$env:GIT_INDEX_FILE = $idx
try {
  git read-tree $old
  if ($LASTEXITCODE -ne 0) { throw 'read-tree (live) failed' }
  git rm -r -q -f --cached site
  if ($LASTEXITCODE -ne 0) { throw 'removing the old site folder failed' }
  git read-tree --prefix=site/ "HEAD:site"
  if ($LASTEXITCODE -ne 0) { throw 'read-tree (main site) failed' }
  if (git ls-tree "HEAD:site" next) { git rm -r -q -f --cached site/next; if ($LASTEXITCODE -ne 0) { throw 'removing next failed' } }
  $tree = git write-tree
  if ($LASTEXITCODE -ne 0 -or -not $tree) { throw 'write-tree failed' }
} catch { Write-Error "live_take_main: could not put the live folder together: $_"; exit 1 }
finally { Remove-Item Env:\GIT_INDEX_FILE; Remove-Item $idx -ErrorAction SilentlyContinue }
if ($tree -eq $old) { Write-Output "live_take_main: $LiveBranch already holds main's live files; nothing to record."; exit 0 }
$changes = git diff-tree -r --name-status $old $tree
if ($DryRun) { Write-Output "live_take_main (dry run): $LiveBranch would get these changes from main:"; $changes; exit 0 }
if (-not $Message) { Write-Error 'live_take_main: give -Message (what goes live, with version and stamp).'; exit 1 }
$from = git rev-parse --short HEAD
$commit = git commit-tree $tree -p $live -m $Message -m "Pages taken from main commit $from." -m 'Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>'
if ($LASTEXITCODE -ne 0 -or -not $commit) { Write-Error 'live_take_main: could not make the commit.'; exit 1 }
git push -q $Remote "${commit}:refs/heads/$LiveBranch"
if ($LASTEXITCODE -ne 0) { Write-Error "live_take_main: push to $Remote $LiveBranch failed."; exit 1 }
git update-ref "refs/heads/$LiveBranch" $commit
Write-Output "live_take_main: $LiveBranch now holds main's live files (commit $commit). Not published yet: tools/push_live.ps1."
