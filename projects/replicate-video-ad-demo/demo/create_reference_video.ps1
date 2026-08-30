param(
    [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptRoot

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
    $OutputPath = Join-Path $projectRoot "artifacts\synthetic-reference.mp4"
} elseif (-not [System.IO.Path]::IsPathRooted($OutputPath)) {
    $OutputPath = Join-Path $projectRoot $OutputPath
}

$ffmpeg = Get-Command ffmpeg -ErrorAction Stop
$outputParent = Split-Path -Parent $OutputPath
New-Item -ItemType Directory -Force -Path $outputParent | Out-Null

$filter = @"
[0:v]drawbox=x=55:y=510:w=430:h=120:color=0xc2410c@0.88:t=fill,drawtext=text='COFFEE SPILL':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=548,drawtext=text='HOOK  0-3s':fontcolor=0x111827:fontsize=30:x=(w-text_w)/2:y=130,drawtext=text='A visible problem stops the scroll':fontcolor=0x374151:fontsize=23:x=(w-text_w)/2:y=185[v0];
[1:v]drawbox=x=35:y=430:w=470:h=250:color=0x9a3412@0.92:t=fill,drawbox=x=70:y=470:w=400:h=170:color=0xea580c@0.75:t=fill,drawtext=text='THE MESS SPREADS':fontcolor=white:fontsize=39:x=(w-text_w)/2:y=535,drawtext=text='ESCALATION  3-6s':fontcolor=0x111827:fontsize=29:x=(w-text_w)/2:y=130,drawtext=text='Make the consequence easy to see':fontcolor=0x374151:fontsize=22:x=(w-text_w)/2:y=185[v1];
[2:v]drawbox=x='40+105*t':y=505:w=170:h=235:color=0x2563eb@0.96:t=fill,drawbox=x='65+105*t':y=545:w=120:h=80:color=white@0.92:t=fill,drawtext=text='CLEANER':fontcolor=0x1d4ed8:fontsize=20:x='77+105*t':y=574,drawtext=text='PRODUCT ENTERS':fontcolor=0x111827:fontsize=40:x=(w-text_w)/2:y=130,drawtext=text='BRIDGE  6-9s':fontcolor=0x374151:fontsize=27:x=(w-text_w)/2:y=185[v2];
[3:v]drawbox=x=20:y=360:w=240:h=400:color=0x9a3412@0.90:t=fill,drawbox=x=280:y=360:w=240:h=400:color=0xd1fae5@0.95:t=fill,drawtext=text='BEFORE':fontcolor=white:fontsize=35:x=70:y=530,drawtext=text='AFTER':fontcolor=0x065f46:fontsize=35:x=345:y=530,drawtext=text='VISIBLE PROOF':fontcolor=0x111827:fontsize=40:x=(w-text_w)/2:y=130,drawtext=text='PROOF  9-12s':fontcolor=0x374151:fontsize=27:x=(w-text_w)/2:y=185[v3];
[4:v]drawbox=x=150:y=310:w=240:h=330:color=0x2563eb@0.96:t=fill,drawbox=x=180:y=365:w=180:h=105:color=white@0.94:t=fill,drawtext=text='YOUR':fontcolor=0x1d4ed8:fontsize=31:x=(w-text_w)/2:y=378,drawtext=text='PRODUCT':fontcolor=0x1d4ed8:fontsize=27:x=(w-text_w)/2:y=420,drawbox=x=105:y=715:w=330:h=82:color=0xf97316@0.98:t=fill,drawtext=text='LEARN MORE':fontcolor=white:fontsize=34:x=(w-text_w)/2:y=737,drawtext=text='PAYOFF + CTA  12-15s':fontcolor=0x111827:fontsize=29:x=(w-text_w)/2:y=130[v4];
[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0[v];
[5:a]volume=0.035[a]
"@ -replace "`r?`n", ""

$arguments = @(
    "-hide_banner", "-loglevel", "error", "-y",
    "-f", "lavfi", "-i", "color=c=0xfef3c7:s=540x960:d=3:r=24",
    "-f", "lavfi", "-i", "color=c=0xffedd5:s=540x960:d=3:r=24",
    "-f", "lavfi", "-i", "color=c=0xdbeafe:s=540x960:d=3:r=24",
    "-f", "lavfi", "-i", "color=c=0xf8fafc:s=540x960:d=3:r=24",
    "-f", "lavfi", "-i", "color=c=0xe0f2fe:s=540x960:d=3:r=24",
    "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=44100:duration=15",
    "-filter_complex", $filter,
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-shortest",
    $OutputPath
)

& $ffmpeg.Source @arguments
if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed with exit code $LASTEXITCODE"
}

Get-Item -LiteralPath $OutputPath | Select-Object FullName, Length, LastWriteTime
