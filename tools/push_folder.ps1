# Publishes one folder of the last commit as a GitHub Pages branch, without re-reading the project's history.
# (2026-11-26: "git subtree push" re-walked every commit on each publish, 3 to 4.5 minutes per folder on this PC.)
# The folder's files are already stored in the last commit as one "tree"; this puts that exact tree on top of the
# published branch as one new commit and pushes it. The published files are identical by construction: the script
# checks that the remote branch's tree equals HEAD:<folder> afterwards and fails loudly if not.
# Run (after committing):  powershell -ExecutionPolicy Bypass -File tools/push_folder.ps1 -Prefix site -Remote origin
param([Parameter(Mandatory=$true)][string]$Prefix, [Parameter(Mandatory=$true)][string]$Remote, [string]$Branch = 'gh-pages', [string]$Message = '', [string]$LiveBranch = 'live')
Set-Location (Split-Path $PSScriptRoot -Parent)
$dirty = git status --porcelain --untracked-files=no -- $Prefix
if ($dirty) { Write-Error "push_folder: $Prefix has uncommitted changes; commit first."; exit 1 }
$tree = git rev-parse "HEAD:$Prefix"
if ($LASTEXITCODE -ne 0 -or -not $tree) { Write-Error "push_folder: no folder $Prefix in the last commit."; exit 1 }
# The live guard (Foundation F2, 2026-11-26): site/ holds the live pages next to the test build (site/next/), so publishing
# site/ also publishes this commit's copy of the live pages. The live branch says what players have; a copy that differs
# (a hotfix made on live and not brought over, or a live page changed here by mistake) would change the live game. Refuse.
if ($Prefix -eq 'site') {
  git fetch -q $Remote $LiveBranch
  if ($LASTEXITCODE -ne 0) { Write-Error "push_folder: could not read the $LiveBranch branch from $Remote."; exit 1 }
  $off = git diff-tree -r --name-only "FETCH_HEAD:site" $tree | Where-Object { $_ -notlike 'next/*' }
  if ($LASTEXITCODE -ne 0) { Write-Error "push_folder: could not compare site with the $LiveBranch branch."; exit 1 }
  if ($off) { Write-Error ("push_folder: these live files differ from the $LiveBranch branch, so this publish would change the live game: " + ($off -join ', ') + ". After a hotfix on live: git checkout $Remote/$LiveBranch -- site, commit, publish again. Live itself is published with tools/push_live.ps1 (live-and-hotfix skill)."); exit 1 }
}
git fetch -q $Remote $Branch
if ($LASTEXITCODE -ne 0) { Write-Error "push_folder: could not read $Branch from $Remote."; exit 1 }
$parent = git rev-parse FETCH_HEAD
$old = git rev-parse "FETCH_HEAD^{tree}"
if ($old -eq $tree) { Write-Output "push_folder: $Prefix is already published as it is (tree $tree)."; exit 0 }
if (-not $Message) { $Message = "Publish $Prefix from " + (git rev-parse --short HEAD) }
$commit = git commit-tree $tree -p $parent -m $Message
if ($LASTEXITCODE -ne 0 -or -not $commit) { Write-Error 'push_folder: could not make the publish commit.'; exit 1 }
git push -q $Remote "${commit}:refs/heads/$Branch"
if ($LASTEXITCODE -ne 0) { Write-Error "push_folder: push to $Remote $Branch failed."; exit 1 }
git fetch -q $Remote $Branch
$now = git rev-parse "FETCH_HEAD^{tree}"
if ($now -ne $tree) { Write-Error "push_folder: published tree $now differs from $Prefix tree $tree."; exit 1 }
Write-Output "push_folder: $Prefix published to $Remote $Branch (tree $tree, identical to the commit)."
