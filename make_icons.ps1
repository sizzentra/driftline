# Draws the app icons (a bobber on dark water). Run once; the PNGs are committed.
Add-Type -AssemblyName System.Drawing
function Make-Icon([int]$n, [string]$path) {
  $b = New-Object System.Drawing.Bitmap $n, $n
  $g = [System.Drawing.Graphics]::FromImage($b)
  $g.SmoothingMode = 'AntiAlias'
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml('#0a161d'))
  $s = $n / 512.0
  $water = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#173e42'))
  $g.FillRectangle($water, 0, [int](300*$s), $n, $n)
  $ring = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(110,255,255,255)), ([float](6*$s))
  $g.DrawEllipse($ring, [float](106*$s), [float](282*$s), [float](300*$s), [float](56*$s))
  $g.DrawEllipse($ring, [float](156*$s), [float](292*$s), [float](200*$s), [float](36*$s))
  $cream = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#f4f1ea'))
  $orange = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#ff6a3d'))
  $g.FillPie($cream, [float](171*$s), [float](146*$s), [float](170*$s), [float](170*$s), 0, 180)
  $g.FillPie($orange, [float](171*$s), [float](146*$s), [float](170*$s), [float](170*$s), 180, 180)
  $stick = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#f4f1ea'))
  $g.FillRectangle($stick, [float](248*$s), [float](96*$s), [float](16*$s), [float](56*$s))
  $line = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(200,235,240,235)), ([float](4*$s))
  $g.DrawLine($line, [float](256*$s), [float](96*$s), [float](300*$s), [float](20*$s))
  $b.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $b.Dispose()
}
Make-Icon 192 (Join-Path $PSScriptRoot 'site\icon-192.png')
Make-Icon 512 (Join-Path $PSScriptRoot 'site\icon-512.png')
Write-Output 'Icons done'
