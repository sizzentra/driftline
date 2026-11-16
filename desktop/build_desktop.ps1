# Builds the Driftline Windows app and packs it into site/download/Driftline-Setup.zip
# Uses only what's already on this PC: the .NET Framework compiler and the WebView2 files that ship with Visual Studio.
$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot; $root = Split-Path $here
$fw = 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319'
$vs = 'C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\PrivateAssemblies'
$out = Join-Path $here 'dist\Driftline'
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Force $out, (Join-Path $out 'offline') | Out-Null

# icon: a PNG-in-ICO built from the 512px app icon
Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile((Join-Path $root 'site\icon-512.png'))
$bmp = New-Object System.Drawing.Bitmap 256, 256
$gr = [System.Drawing.Graphics]::FromImage($bmp); $gr.InterpolationMode = 'HighQualityBicubic'; $gr.DrawImage($src, 0, 0, 256, 256); $gr.Dispose(); $src.Dispose()
$ms = New-Object System.IO.MemoryStream; $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png); $png = $ms.ToArray(); $bmp.Dispose()
$ico = New-Object System.IO.MemoryStream; $w = New-Object System.IO.BinaryWriter $ico
$w.Write([UInt16]0); $w.Write([UInt16]1); $w.Write([UInt16]1)
$w.Write([Byte]0); $w.Write([Byte]0); $w.Write([Byte]0); $w.Write([Byte]0); $w.Write([UInt16]1); $w.Write([UInt16]32); $w.Write([UInt32]$png.Length); $w.Write([UInt32]22); $w.Write($png); $w.Flush()
[IO.File]::WriteAllBytes((Join-Path $out 'driftline.ico'), $ico.ToArray())

Copy-Item (Join-Path $vs 'Microsoft.Web.WebView2.Core.dll'), (Join-Path $vs 'Microsoft.Web.WebView2.Wpf.dll'), (Join-Path $vs 'WebView2Loader.dll') $out
Copy-Item (Join-Path $root 'site\index.html'), (Join-Path $root 'site\icon-192.png'), (Join-Path $root 'site\icon-512.png') (Join-Path $out 'offline')

$refs = @("$fw\WPF\PresentationFramework.dll","$fw\WPF\PresentationCore.dll","$fw\WPF\WindowsBase.dll","$fw\System.Xaml.dll","$fw\System.Drawing.dll","$fw\System.dll",
  (Join-Path $out 'Microsoft.Web.WebView2.Core.dll'), (Join-Path $out 'Microsoft.Web.WebView2.Wpf.dll')) | ForEach-Object { "/reference:`"$_`"" }
& "$fw\csc.exe" /nologo /target:winexe /platform:x64 /optimize+ "/win32icon:$(Join-Path $out 'driftline.ico')" "/out:$(Join-Path $out 'Driftline.exe')" @refs (Join-Path $here 'Driftline.cs')
if ($LASTEXITCODE -ne 0) { throw 'compile failed' }

$dl = Join-Path $root 'site\download'; New-Item -ItemType Directory -Force $dl | Out-Null
$zip = Join-Path $dl 'Driftline-Setup.zip'; if (Test-Path $zip) { Remove-Item $zip }
Compress-Archive -Path (Join-Path $out '*') -DestinationPath $zip
Write-Output ("Built " + $zip + " (" + [Math]::Round((Get-Item $zip).Length/1KB) + " KB)")
