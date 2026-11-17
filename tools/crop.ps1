param([string]$src,[string]$dst,[int]$x,[int]$y,[int]$w,[int]$h,[double]$s=2)
# test helper: cut a region out of a contact sheet and enlarge it (for close inspection)
Add-Type -AssemblyName System.Drawing
$i=[System.Drawing.Image]::FromFile($src)
$b=New-Object System.Drawing.Bitmap ([int]($w*$s)),([int]($h*$s))
$g=[System.Drawing.Graphics]::FromImage($b)
$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($i,(New-Object System.Drawing.Rectangle 0,0,$b.Width,$b.Height),(New-Object System.Drawing.Rectangle $x,$y,$w,$h),[System.Drawing.GraphicsUnit]::Pixel)
$b.Save($dst); $i.Dispose(); $b.Dispose()
