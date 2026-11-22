# Scans a download with Windows Defender before it can be published (batch 2, 2026-11-21: "no malware warnings on any
# download from our sites"). Free, already on this PC. Throws (so the calling build stops) if Defender reports anything.
param([Parameter(Mandatory)][string]$Path)
$mp = Get-ChildItem 'C:\ProgramData\Microsoft\Windows Defender\Platform' -Directory | Sort-Object Name -Descending | Select-Object -First 1
$exe = Join-Path $mp.FullName 'MpCmdRun.exe'
if (-not (Test-Path $exe)) { throw 'Windows Defender (MpCmdRun.exe) not found: the download was not scanned' }
$out = (& $exe -Scan -ScanType 3 -File $Path -DisableRemediation) -join "`n"
if ($out -notmatch 'found no threats') { throw ("Windows Defender flagged " + $Path + ":`n" + $out) }
Write-Output ("Defender: no threats in " + (Split-Path $Path -Leaf))
