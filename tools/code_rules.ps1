# Driftline code rules: one place for every rule a tool can check in the code (CLAUDE.md rules 6 and 7, plus the code rules in
# docs/REFERENCE.md that code can see). build.ps1 refuses to build when one is broken; tools/check.ps1 runs them again on the
# finished pages. Each function returns a list of problems (empty = clean). Dot-source this file to use it.

# ---------- rule 7: platform code never grows inside a shared file ----------
# Each shared file may mention platform layouts at most as often as it did when the split was made (2026-11-17). The numbers
# may only go DOWN (when old code moves into src/pc, src/mobile or src/ios). If a number goes down, lower it here too.
$script:platWords = [regex]'MOB\(|pch-on|pc-fhd|pc-app|pc-wide|PC_APP|pchead|phone-app|phone-land|plat-ios|plat-android|plat-pc'
$script:platBaseline = @{ 'af_smooth.js'=1; 'aw_menu035.js'=2; 'bd_ui036.js'=3; 'bh_platform036.js'=15; 'bj_polish036.js'=56; 'bm_ui04.js'=63; 'd_draw.js'=2; 'f_v3scene.js'=3; 'x_sections.js'=1 }

function Test-SourceRules([string]$root, [string[]]$coreFiles) {
  $out = @()
  foreach ($f in $coreFiles) {
    $n = $script:platWords.Matches([IO.File]::ReadAllText((Join-Path $root "src\$f"))).Count
    $allowed = if ($script:platBaseline.ContainsKey($f)) { $script:platBaseline[$f] } else { 0 }
    if ($n -gt $allowed) { $out += "platform code in a shared file: $f has $n platform-specific mentions (allowed: $allowed); move it into src/pc, src/mobile or src/ios" }
  }
  # ---------- rule 6: no function fully replaced with its original left behind (2026-11-19) ----------
  # A later file that replaces a whole function ("name = function(...)") without keeping the old one ("const _x = name") leaves the
  # original as dead code. Edit the original, or move it. Wrappers that keep the old one are fine; a platform file replacing a
  # shared default is an override.
  $allSrc = Get-ChildItem (Join-Path $root 'src') -Recurse -Filter *.js | Where-Object { $_.Name -ne 'bn_qa04.js' }
  $texts = @{}; foreach ($f in $allSrc) { $texts[$f.FullName] = [IO.File]::ReadAllText($f.FullName) }
  $declared = @{}; foreach ($k in $texts.Keys) { foreach ($m in [regex]::Matches($texts[$k], '(?m)^function ([A-Za-z0-9_$]+)\(')) { $declared[$m.Groups[1].Value] = $k } }
  $platDir = [regex]'\\src\\(pc|mobile|android|ios|testonly)\\'
  $dead = @()
  foreach ($k in $texts.Keys) {
    if ($platDir.IsMatch($k)) { continue }
    foreach ($m in [regex]::Matches($texts[$k], '(?m)^\s*([A-Za-z0-9_$]+)\s*=\s*function\b')) {
      $n = $m.Groups[1].Value
      if ($declared.ContainsKey($n) -and -not [regex]::IsMatch($texts[$k], '=\s*' + [regex]::Escape($n) + '\s*[;,]')) {
        $dead += "function replaced and its original left behind: $n (replaced in $(Split-Path $k -Leaf), original in $(Split-Path $declared[$n] -Leaf))"
      }
    }
  }
  $out += $dead | Sort-Object -Unique
  return ,$out
}

# ---------- rules on the built pages ----------
# $pages: @{ pc = <page text>; android = ...; ios = ... } (all three builds of one kind: release or preview)
function Test-BuiltRules([string]$root, [hashtable]$pages, [switch]$Preview) {
  $out = @()
  foreach ($p in 'pc','android','ios') {
    $t = $pages[$p]
    # all files share one scope, so a second "function name(" silently replaces the first (0.4.8.9: oddity fights crashed)
    $dups = [regex]::Matches($t, '(?m)^function ([A-Za-z_$][A-Za-z0-9_$]*)\(') | ForEach-Object { $_.Groups[1].Value } | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object { $_.Name }
    foreach ($d in $dups) { $out += "function declared twice in the $p build (the first is silently lost): $d" }
    # no regex look-behind in phone builds (older iPhones fail to parse the whole page; incident #23)
    if ($p -ne 'pc' -and $t.Contains('(?<')) {
      foreach ($m in [regex]::Matches($t, '\(\?<[=!]')) { $s = [Math]::Max(0, $m.Index - 40); $out += "regex look-behind in the $p build (older iPhones cannot read the page): ..." + $t.Substring($s, 60).Replace("`n", ' ') + '...'; break }
    }
    # a release page never holds test-only code
    if (-not $Preview) {
      foreach ($w in 'DL_PREVIEW=true', 'window.__qa=', 'dl-devreport') { if ($t.Contains($w)) { $out += "the $p release page contains test-only code ($w)" } }
    }
  }
  # dead functions: declared, never used anywhere in any of the three builds (a name that appears once is its own declaration)
  $all = $pages['pc'] + "`n" + $pages['android'] + "`n" + $pages['ios']
  $names = foreach ($p in 'pc','android','ios') { [regex]::Matches($pages[$p], '(?m)^\s*function ([A-Za-z_$][\w$]*)\(') | ForEach-Object { $_.Groups[1].Value } }
  foreach ($n in ($names | Sort-Object -Unique)) {
    $used = $false
    foreach ($p in 'pc','android','ios') { if ([regex]::Matches($pages[$p], '(?<![\w$.])' + [regex]::Escape($n) + '(?![\w$])').Count -gt 1) { $used = $true; break } }
    if (-not $used) { $out += "dead function (declared, never called in any build): $n" }
  }
  # rule 7: every build holds exactly its own platform's files
  $owners = @{ pc = @('pc'); mobile = @('android','ios'); android = @('android'); ios = @('ios') }
  foreach ($dir in 'pc','mobile','android','ios') {
    $d = Join-Path $root "src\$dir"; if (-not (Test-Path $d)) { continue }
    foreach ($file in Get-ChildItem $d -Filter *.js) {
      $sig = [IO.File]::ReadAllText($file.FullName); if (-not $sig) { continue }
      foreach ($p in 'pc','android','ios') {
        $has = $pages[$p].Contains($sig); $should = $owners[$dir] -contains $p
        if ($has -and -not $should) { $out += "src\$dir\$($file.Name) ended up in the $p build" }
        if ($should -and -not $has) { $out += "src\$dir\$($file.Name) is missing from the $p build (add it to `$layers or place a //@layer line)" }
      }
    }
  }
  return ,$out
}
