# The publish gate (CLAUDE.md rule 2, guarded since phase 2): a publish script dot-sources this file and calls Assert-CheckPassed.
# It refuses unless checks/latest.json (written by check.ps1) says PASS for exactly the files about to be published: same build
# stamp AND the same file contents (a fingerprint of every page), so an edit made after the check can't slip out.

# the pages a test-build publish sends, in a fixed order
function Get-CheckedFiles([string]$repo) { @('site\next\pc.html','site\next\android.html','site\next\ios.html','site\next\index.html','testapps\android\index.html','testapps\iphone\index.html') | ForEach-Object { Join-Path $repo $_ } }

function Get-BuildFingerprint([string]$repo) {
  $sha = [Security.Cryptography.SHA256]::Create()
  $all = foreach ($f in Get-CheckedFiles $repo) { if (Test-Path $f) { [BitConverter]::ToString($sha.ComputeHash([IO.File]::ReadAllBytes($f))).Replace('-', '') } else { 'missing' } }
  return [BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::ASCII.GetBytes(($all -join '|')))).Replace('-', '').Substring(0, 16)
}

function Assert-CheckPassed([string]$repo) {
  $stamp = ([IO.File]::ReadAllText((Join-Path $repo 'site\next\version.txt'))).Trim()
  $lj = Join-Path $repo 'checks\latest.json'
  $why = $null
  if (-not (Test-Path $lj)) { $why = 'there is no check report yet' }
  else {
    $l = Get-Content $lj -Raw | ConvertFrom-Json
    if ($l.stamp -ne $stamp) { $why = "the last check was for build $($l.stamp), this is $stamp" }
    elseif ($l.result -ne 'PASS') { $why = "the last check of $stamp FAILED ($($l.report))" }
    elseif ($l.fingerprint -ne (Get-BuildFingerprint $repo)) { $why = "the pages changed after the check of $stamp passed" }
  }
  if ($why) { throw "REFUSED: $why. Run check.ps1 on this build and fix it until it passes, then publish." }
  Write-Output "Check report: PASS for $stamp ($($l.report))."
}
