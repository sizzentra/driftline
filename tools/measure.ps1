# Measures the game from the inside: runs tools/measure/<Script>.js inside the test build (through the __inGame hook of a ?test page)
# on each test save and stores what it returns as docs/reviews/data/<Script>_<save>.json. Nothing in the game or in any save changes.
#   powershell -ExecutionPolicy Bypass -File tools/measure.ps1 -Script stats [-Saves new,mid,heavy]
param([Parameter(Mandatory=$true)][string]$Script, [string[]]$Saves = @('new','mid','heavy'), [int]$BudgetMs = 30000)
. (Join-Path $PSScriptRoot 'headless.ps1')
$root = Split-Path $PSScriptRoot -Parent
$js = Join-Path $PSScriptRoot ("measure\" + $Script + ".js"); if (-not (Test-Path $js)) { throw "No such script: $js" }
$null = Start-ServerIfNeeded
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($js))
$pageDir = Join-Path $root 'site\next\_ab'; New-Item -ItemType Directory -Force $pageDir | Out-Null
$page = Join-Path $pageDir 'measure.html'
$html = @"
<!doctype html><meta charset="utf-8"><pre id="out">WAIT</pre>
<script>
(async()=>{ const q=new URLSearchParams(location.search), sv=q.get('save')||'heavy';
  const j=await (await fetch('../saves/'+sv+'.json')).json(); localStorage.setItem('driftline-save-next', j.save);
  const f=document.createElement('iframe'); f.style.cssText='width:1600px;height:900px;border:0'; f.src='../pc.html?test'; document.body.appendChild(f);
  const wait=ms=>new Promise(r=>setTimeout(r,ms)); await new Promise(r=>f.onload=r); await wait(3500); const w=f.contentWindow; let res;
  const code=new TextDecoder().decode(Uint8Array.from(atob('$b64'),c=>c.charCodeAt(0)));
  try{ res=w.__inGame('const SAVE_NAME='+JSON.stringify(sv)+';\n'+code); }catch(e){ res=JSON.stringify({error:String(e), stack:(e.stack||'').slice(0,600)}); }
  document.getElementById('out').textContent='RESULT'+res+'END'; f.remove();
})();
</script>
"@
[IO.File]::WriteAllText($page, $html, (New-Object Text.UTF8Encoding $false))
$outDir = Join-Path $root 'docs\reviews\data'; New-Item -ItemType Directory -Force $outDir | Out-Null
try {
  foreach ($s in $Saves) {
    $prof = Join-Path $env:TEMP ('dl-measure-' + [guid]::NewGuid().ToString('N')); $dom = Join-Path $env:TEMP ('dl-measure-' + $s + '.txt'); $err = Join-Path $env:TEMP 'dl-measure-err.txt'
    $p = Start-Process (Get-Browser) -ArgumentList @('--headless=new', "--user-data-dir=$prof", '--no-first-run', '--mute-audio', "--virtual-time-budget=$BudgetMs", '--dump-dom', "http://localhost:8766/next/_ab/measure.html?save=$s") -RedirectStandardOutput $dom -RedirectStandardError $err -PassThru -WindowStyle Hidden
    $p | Wait-Process -Timeout 180 -ErrorAction SilentlyContinue; try { & taskkill /PID $p.Id /T /F 2>$null | Out-Null } catch {}
    $t = [IO.File]::ReadAllText($dom); $m = [regex]::Match($t, 'RESULT(.*?)END', 'Singleline')
    if ($m.Success) { $file = Join-Path $outDir ($Script + '_' + $s + '.json'); [IO.File]::WriteAllText($file, [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value), (New-Object Text.UTF8Encoding $false)); "$s : $((Get-Item $file).Length) bytes -> docs/reviews/data/$($Script)_$s.json" } else { "$s : NO RESULT" }
    try { Remove-Item -Recurse -Force $prof -ErrorAction Stop } catch {}
  }
} finally { Remove-Item $page -ErrorAction SilentlyContinue }
