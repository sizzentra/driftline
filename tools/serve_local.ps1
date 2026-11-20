# Serves site/ at http://localhost:8766/ for testing. Add ?test to the URL for a test hook (window.__dl) and a steady frame timer.
# Run: powershell -ExecutionPolicy Bypass -File tools/serve_local.ps1   (stop with Ctrl+C)
$root = Join-Path (Split-Path $PSScriptRoot -Parent) 'site'
$types = @{'.html'='text/html; charset=utf-8';'.js'='text/javascript';'.png'='image/png';'.webmanifest'='application/manifest+json';'.txt'='text/plain'}
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
  $p = $ctx.Request.Url.AbsolutePath.TrimStart('/'); if ($p -eq '' -or $p.EndsWith('/')) { $p = $p + 'index.html' }
  $f = Join-Path $root $p
  if (Test-Path $f -PathType Leaf) {
    $b = [IO.File]::ReadAllBytes($f)
    if ($p.EndsWith('index.html') -and $ctx.Request.Url.Query -match 'test') { $h=[Text.Encoding]::UTF8.GetString($b).Replace('<body>','<body><script>window.requestAnimationFrame=function(f){return setTimeout(function(){f(performance.now())},33)};</script>'); $b=[Text.Encoding]::UTF8.GetBytes($h) }
    $ext = [IO.Path]::GetExtension($f); $ctx.Response.ContentType = $types[$ext]
    $ctx.Response.ContentLength64 = $b.Length; $ctx.Response.OutputStream.Write($b,0,$b.Length)
  } else { $ctx.Response.StatusCode = 404 }
  $ctx.Response.Close()
}
