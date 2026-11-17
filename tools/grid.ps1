param([string]$out,[int]$cols=2,[Parameter(ValueFromRemainingArguments=$true)][string[]]$names)
# test helper: lay several shots from tools/shots side by side into one image
Add-Type -AssemblyName System.Drawing
$dir='C:\Users\sizze\Driftline\tools\shots'
$ims=@(); foreach($n in $names){ $ims+=[System.Drawing.Image]::FromFile("$dir\$n.png") }
$w=$ims[0].Width; $h=$ims[0].Height; $rows=[math]::Ceiling($ims.Count/$cols)
$b=New-Object System.Drawing.Bitmap ($w*$cols),($h*$rows); $g=[System.Drawing.Graphics]::FromImage($b)
for($i=0;$i -lt $ims.Count;$i++){ $g.DrawImage($ims[$i],($i%$cols)*$w,[math]::Floor($i/$cols)*$h,$w,$h); $ims[$i].Dispose() }
$b.Save("$dir\$out.png"); $b.Dispose()
