# Serves site/ at http://localhost:8766/ for testing. Add ?test to the URL for a test hook (window.__dl) and a steady frame timer.
# Run: powershell -ExecutionPolicy Bypass -File tools/serve_local.ps1   (stop with Ctrl+C)
# tools/check.ps1 starts its own copy on another port (-Port 8767) for the automatic check and stops it afterwards. Extra paths:
#   /_testapps/...      the phone test apps (testapps/), so the check can read exactly what publish_testapps.ps1 sends
#   /_check/...         the check's own pages (tools/check/)
#   POST /report/<name> the check's results, written to checks/parts/<name>.json
param([int]$Port = 8766)
$repo = Split-Path $PSScriptRoot -Parent
$root = Join-Path $repo 'site'
$types = @{'.html'='text/html; charset=utf-8';'.js'='text/javascript';'.png'='image/png';'.webmanifest'='application/manifest+json';'.txt'='text/plain; charset=utf-8';'.json'='application/json'}
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
while ($l.IsListening) {
  $ctx = $l.GetContext()
  $path = $ctx.Request.Url.AbsolutePath
  # QC: POST /shot/<name> with a PNG data URL saves it to tools/shots/<name>.png for close inspection
  if ($ctx.Request.HttpMethod -eq 'POST' -and ($path.StartsWith('/shot/') -or $path.StartsWith('/report/'))) {
    $isShot = $path.StartsWith('/shot/')
    $name = ($path.Substring($(if ($isShot) { 6 } else { 8 })) -replace '[^A-Za-z0-9_\-.]','_')
    $sr = New-Object IO.StreamReader($ctx.Request.InputStream, [Text.Encoding]::UTF8); $data = $sr.ReadToEnd(); $sr.Close()
    if ($isShot) {
      $i = $data.IndexOf(','); if ($i -ge 0) { $data = $data.Substring($i+1) }
      $dir = Join-Path $PSScriptRoot 'shots'; New-Item -ItemType Directory -Force $dir | Out-Null
      [IO.File]::WriteAllBytes((Join-Path $dir ($name + '.png')), [Convert]::FromBase64String($data))
    } else {
      $dir = Join-Path $repo 'checks\parts'; New-Item -ItemType Directory -Force $dir | Out-Null
      [IO.File]::WriteAllText((Join-Path $dir ($name + '.json')), $data, (New-Object System.Text.UTF8Encoding $false))
    }
    $ctx.Response.StatusCode = 204; $ctx.Response.Close(); continue
  }
  $p = $path.TrimStart('/'); if ($p -eq '' -or $p.EndsWith('/')) { $p = $p + 'index.html' }
  $base = $root
  if ($p.StartsWith('_testapps/')) { $base = Join-Path $repo 'testapps'; $p = $p.Substring(10) }
  elseif ($p.StartsWith('_check/')) { $base = Join-Path $PSScriptRoot 'check'; $p = $p.Substring(7) }
  $f = Join-Path $base $p
  if ((Test-Path $f -PathType Leaf) -and ([IO.Path]::GetFullPath($f)).StartsWith([IO.Path]::GetFullPath($base))) {
    $b = [IO.File]::ReadAllBytes($f)
    if ($p.EndsWith('index.html') -and $ctx.Request.Url.Query -match 'test') { $h=[Text.Encoding]::UTF8.GetString($b).Replace('<body>','<body><script>window.requestAnimationFrame=function(f){return setTimeout(function(){f(performance.now())},33)};</script>'); $b=[Text.Encoding]::UTF8.GetBytes($h) }
    $ext = [IO.Path]::GetExtension($f); $ctx.Response.ContentType = $types[$ext]
    $ctx.Response.Headers.Add('Cache-Control', 'no-store')
    $ctx.Response.ContentLength64 = $b.Length; $ctx.Response.OutputStream.Write($b,0,$b.Length)
  } else { $ctx.Response.StatusCode = 404 }
  $ctx.Response.Close()
}
