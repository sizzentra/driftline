# Foundation F4 (2026-11-26): finds, and with -Fix repairs, garbled characters (mojibake) in text files.
# Garbling happens when a script reads a UTF-8 file as Windows-1252 text and writes it back: "x" (times) turns into two odd letters, and
# each further pass garbles the result again. The repair turns each garbled pair or triple back into the character it came from and
# repeats until nothing changes; whatever it cannot repair is listed with its line number for a repair by hand.
#   powershell -ExecutionPolicy Bypass -File tools/mojibake.ps1 CLAUDE.md docs            list garbled runs (exit 1 when any)
#   powershell -ExecutionPolicy Bypass -File tools/mojibake.ps1 -Fix CLAUDE.md             repair in place (UTF-8, no byte-order mark, line ends kept)
# build.ps1 uses the same pattern as a gate. This file is ASCII only on purpose.
param([switch]$Fix, [Parameter(ValueFromRemainingArguments=$true)][string[]]$Paths)
$ch = { param($n) [string][char]$n }
$cont = '[' + (& $ch 0x80) + '-' + (& $ch 0xBF) + (-join (@(0x20AC,0x201A,0x0192,0x201E,0x2026,0x2020,0x2021,0x02C6,0x2030,0x0160,0x2039,0x0152,0x017D,0x2018,0x2019,0x201C,0x201D,0x2022,0x2013,0x2014,0x02DC,0x2122,0x0161,0x203A,0x0153,0x017E,0x0178) | ForEach-Object { [string][char]$_ })) + ']'
$script:MojiPattern = '[' + (& $ch 0xC2) + '-' + (& $ch 0xDF) + ']' + $cont + '|[' + (& $ch 0xE0) + '-' + (& $ch 0xEF) + ']' + $cont + $cont + '|[' + (& $ch 0xF0) + '-' + (& $ch 0xF4) + ']' + $cont + $cont + $cont
$enc1252 = [Text.Encoding]::GetEncoding(1252); $utf8 = New-Object Text.UTF8Encoding($false, $true)
# a character below 256 stands for its own byte (the "control" characters 128-159 never survive a round trip through Windows-1252 otherwise)
function Repair-Text([string]$t) {
  for ($pass = 0; $pass -lt 8; $pass++) {
    $before = $t
    $t = [regex]::Replace($t, $script:MojiPattern, { param($m) try { $b = New-Object byte[] $m.Value.Length; for ($i = 0; $i -lt $m.Value.Length; $i++) { $c = $m.Value[$i]; if ([int]$c -le 0xFF) { $b[$i] = [byte][int]$c } else { $b[$i] = $enc1252.GetBytes([string]$c)[0] } }; $utf8.GetString($b) } catch { $m.Value } })
    if ($t -ceq $before) { break }
  }
  return $t
}
$files = @(); foreach ($p in $Paths) { if (Test-Path $p -PathType Container) { $files += Get-ChildItem $p -Recurse -File -Include *.md,*.js,*.html,*.txt,*.csv,*.ps1 | ForEach-Object FullName } elseif (Test-Path $p) { $files += (Resolve-Path $p).Path } }
$total = 0
foreach ($f in $files) {
  $text = [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8)
  $n = [regex]::Matches($text, $script:MojiPattern).Count
  if (-not $n) { continue }
  if ($Fix) {
    $new = Repair-Text $text; $left = [regex]::Matches($new, $script:MojiPattern).Count
    [IO.File]::WriteAllText($f, $new, (New-Object Text.UTF8Encoding($false)))
    Write-Output "$f : $n garbled runs repaired, $left left"; $total += $left
    if ($left) { $i = 0; foreach ($line in ($new -split "`n")) { $i++; if ([regex]::IsMatch($line, $script:MojiPattern)) { Write-Output "    line $i" } } }
  } else { Write-Output "$f : $n garbled runs"; $total += $n }
}
if ($total) { exit 1 } else { exit 0 }
