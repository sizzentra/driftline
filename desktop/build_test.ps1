# Builds "Driftline Test", the director's local testing app (preview build, full screen), and installs it with a desktop
# shortcut. Not published: it is a tool for this PC. Uses the .NET Framework compiler and the WebView2 files that ship with
# Visual Studio, like build_desktop.ps1.
$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot; $root = Split-Path $here
$fw = 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319'
$vs = 'C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\PrivateAssemblies'
$out = Join-Path $here 'dist\DriftlineTest'
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Force $out | Out-Null

# the same icon as the game
Copy-Item (Join-Path $here 'dist\Driftline\driftline.ico') (Join-Path $out 'driftline.ico') -ErrorAction SilentlyContinue
if (-not (Test-Path (Join-Path $out 'driftline.ico'))) {
  Add-Type -AssemblyName System.Drawing
  $src = [System.Drawing.Image]::FromFile((Join-Path $root 'site\icon-512.png'))
  $bmp = New-Object System.Drawing.Bitmap 256, 256
  $gr = [System.Drawing.Graphics]::FromImage($bmp); $gr.InterpolationMode = 'HighQualityBicubic'; $gr.DrawImage($src, 0, 0, 256, 256); $gr.Dispose(); $src.Dispose()
  $ms = New-Object System.IO.MemoryStream; $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png); $png = $ms.ToArray(); $bmp.Dispose()
  $ico = New-Object System.IO.MemoryStream; $w = New-Object System.IO.BinaryWriter $ico
  $w.Write([UInt16]0); $w.Write([UInt16]1); $w.Write([UInt16]1)
  $w.Write([Byte]0); $w.Write([Byte]0); $w.Write([Byte]0); $w.Write([Byte]0); $w.Write([UInt16]1); $w.Write([UInt16]32); $w.Write([UInt32]$png.Length); $w.Write([UInt32]22); $w.Write($png); $w.Flush()
  [IO.File]::WriteAllBytes((Join-Path $out 'driftline.ico'), $ico.ToArray())
}

Copy-Item (Join-Path $vs 'Microsoft.Web.WebView2.Core.dll'), (Join-Path $vs 'Microsoft.Web.WebView2.Wpf.dll'), (Join-Path $vs 'WebView2Loader.dll') $out
$refs = @("$fw\WPF\PresentationFramework.dll","$fw\WPF\PresentationCore.dll","$fw\WPF\WindowsBase.dll","$fw\System.Xaml.dll","$fw\System.Drawing.dll","$fw\System.dll",
  (Join-Path $out 'Microsoft.Web.WebView2.Core.dll'), (Join-Path $out 'Microsoft.Web.WebView2.Wpf.dll')) | ForEach-Object { "/reference:`"$_`"" }
& "$fw\csc.exe" /nologo /target:winexe /platform:x64 /optimize+ "/win32icon:$(Join-Path $out 'driftline.ico')" "/out:$(Join-Path $out 'DriftlineTest.exe')" @refs (Join-Path $here 'DriftlineTest.cs')
if ($LASTEXITCODE -ne 0) { throw 'compile failed' }
Write-Output ("Built " + (Join-Path $out 'DriftlineTest.exe'))
