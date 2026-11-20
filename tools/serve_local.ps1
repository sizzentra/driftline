# Serves site/ at http://localhost:8766/ for testing. Add ?test to the URL for a test hook (window.__dl) and a steady frame timer.
# Run: powershell -ExecutionPolicy Bypass -File tools/serve_local.ps1   (stop with Ctrl+C)
$root = Join-Path (Split-Path $PSScriptRoot -Parent) 'site'
$types = @{'.html'='text/html; charset=utf-8';'.js'='text/javascript';'.png'='image/png';'.webmanifest'='application/manifest+json';'.txt'='text/plain; charset=utf-8';'.json'='application/json'}
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add('http://localhost:8766/')
$l.Start()
while ($l.IsListening) {
  $ctx = $l.GetContext()
  # QC: POST /shot/<name> with a PNG data URL saves it to tools/shots/<name>.png for close inspection
  if ($ctx.Request.HttpMethod -eq 'POST' -and $ctx.Request.Url.AbsolutePath.StartsWith('/shot/')) {
    $name = ($ctx.Request.Url.AbsolutePath.Substring(6) -replace '[^A-Za-z0-9_\-]','_')
    $sr = New-Object IO.StreamReader($ctx.Request.InputStream); $data = $sr.ReadToEnd(); $sr.Close()
    $i = $data.IndexOf(','); if ($i -ge 0) { $data = $data.Substring($i+1) }
    $dir = Join-Path $PSScriptRoot 'shots'; New-Item -ItemType Directory -Force $dir | Out-Null
    [IO.File]::WriteAllBytes((Join-Path $dir ($name + '.png')), [Convert]::FromBase64String($data))
    $ctx.Response.StatusCode = 204; $ctx.Response.Close(); continue
  }
  # sweep: POST /report/<name> with JSON saves it to tools/shots/<name>.json (the one-click sweep's report, readable from disk)
  if ($ctx.Request.HttpMethod -eq 'POST' -and $ctx.Request.Url.AbsolutePath.StartsWith('/report/')) {
    $name = ($ctx.Request.Url.AbsolutePath.Substring(8) -replace '[^A-Za-z0-9_\-]','_')
    $sr = New-Object IO.StreamReader($ctx.Request.InputStream, [Text.Encoding]::UTF8); $data = $sr.ReadToEnd(); $sr.Close()
    $dir = Join-Path $PSScriptRoot 'shots'; New-Item -ItemType Directory -Force $dir | Out-Null
    [IO.File]::WriteAllText((Join-Path $dir ($name + '.json')), $data, (New-Object Text.UTF8Encoding($false)))
    $ctx.Response.StatusCode = 204; $ctx.Response.Close(); continue
  }
  $p = $ctx.Request.Url.AbsolutePath.TrimStart('/'); if ($p -eq '' -or $p.EndsWith('/')) { $p = $p + 'index.html' }
  $f = Join-Path $root $p
  if ($p -eq 'sweep.html') { $f = Join-Path $PSScriptRoot 'sweep.html' }  # the one-click sweep page lives in tools/, never in a build
  if (Test-Path $f -PathType Leaf) {
    $b = [IO.File]::ReadAllBytes($f)
    # pages opened by the sweep (?sweep): record every error from the very first line, and keep the frame loop running in a hidden pane
    if ($p.EndsWith('.html') -and $p -ne 'sweep.html' -and $ctx.Request.Url.Query -match 'sweep') { $h=[Text.Encoding]::UTF8.GetString($b); $i=$h.IndexOf('<head>'); if ($i -ge 0) { $h=$h.Insert($i+6,'<script>window.__bootErr=[];addEventListener("error",function(e){__bootErr.push(String(e.message||e)+(e.lineno?" (line "+e.lineno+")":""))});addEventListener("unhandledrejection",function(e){__bootErr.push("promise: "+String(e.reason&&e.reason.message||e.reason))});window.requestAnimationFrame=function(f){return setTimeout(function(){f(performance.now())},16)};window.cancelAnimationFrame=function(i){clearTimeout(i)};</script>'); $b=[Text.Encoding]::UTF8.GetBytes($h) } }
    if ($p.EndsWith('index.html') -and $ctx.Request.Url.Query -match 'test') { $h=[Text.Encoding]::UTF8.GetString($b).Replace('<body>','<body><script>window.requestAnimationFrame=function(f){return setTimeout(function(){f(performance.now())},33)};</script>'); $b=[Text.Encoding]::UTF8.GetBytes($h) }
    $ext = [IO.Path]::GetExtension($f); $ctx.Response.ContentType = $types[$ext]
    $ctx.Response.ContentLength64 = $b.Length; $ctx.Response.OutputStream.Write($b,0,$b.Length)
  } else { $ctx.Response.StatusCode = 404 }
  $ctx.Response.Close()
}
