# Serves site/ at http://localhost:8766/ for testing. Add ?test to the URL for a test hook (window.__dl) and a steady frame timer.
# Run: powershell -ExecutionPolicy Bypass -File tools/serve_local.ps1   (stop with Ctrl+C)
$root = Join-Path (Split-Path $PSScriptRoot -Parent) 'site'
$types = @{'.html'='text/html; charset=utf-8';'.js'='text/javascript';'.png'='image/png';'.webmanifest'='application/manifest+json';'.txt'='text/plain'}
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add('http://localhost:8766/')
$l.Start()
while ($l.IsListening) {
  $ctx = $l.GetContext()
  $p = $ctx.Request.Url.AbsolutePath.TrimStart('/'); if ($p -eq '') { $p = 'index.html' }
  $f = Join-Path $root $p
  if (Test-Path $f -PathType Leaf) {
    $b = [IO.File]::ReadAllBytes($f)
    if ($p -eq 'index.html' -and $ctx.Request.Url.Query -match 'test') { $h=[Text.Encoding]::UTF8.GetString($b).Replace('<body>','<body><script>window.requestAnimationFrame=function(f){return setTimeout(function(){f(performance.now())},33)};</script>'); $b=[Text.Encoding]::UTF8.GetBytes($h) }
    $ext = [IO.Path]::GetExtension($f); $ctx.Response.ContentType = $types[$ext]
    $ctx.Response.ContentLength64 = $b.Length; $ctx.Response.OutputStream.Write($b,0,$b.Length)
  } else { $ctx.Response.StatusCode = 404 }
  $ctx.Response.Close()
}
