param(
    [string]$InputPath = "artifacts\synthetic-reference.mp4",
    [string]$OutputDir = "artifacts\replay-output",
    [string]$ExtractorPath = "upstream\scripts\extract_video.py"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptRoot

if (-not [System.IO.Path]::IsPathRooted($InputPath)) {
    $InputPath = Join-Path $projectRoot $InputPath
}

if (-not [System.IO.Path]::IsPathRooted($OutputDir)) {
    $OutputDir = Join-Path $projectRoot $OutputDir
}

if (-not [System.IO.Path]::IsPathRooted($ExtractorPath)) {
    $ExtractorPath = Join-Path $projectRoot $ExtractorPath
}

if (-not (Test-Path -LiteralPath $InputPath -PathType Leaf)) {
    $syntheticPath = Join-Path $projectRoot "artifacts\synthetic-reference.mp4"
    if ([System.IO.Path]::GetFullPath($InputPath) -eq [System.IO.Path]::GetFullPath($syntheticPath)) {
        & (Join-Path $scriptRoot "create_reference_video.ps1") -OutputPath $InputPath
    }
    else {
        throw "Input video not found: $InputPath"
    }
}

if (-not (Test-Path -LiteralPath $ExtractorPath -PathType Leaf)) {
    throw "Upstream extractor not found: $ExtractorPath. Follow docs/上游依赖与获取.md or pass -ExtractorPath."
}

& python $ExtractorPath `
    $InputPath `
    --out-dir $OutputDir `
    --fps 2 `
    --max-frames 120 `
    --width 540 `
    --extract-audio

if ($LASTEXITCODE -ne 0) {
    throw "extract_video.py failed with exit code $LASTEXITCODE"
}
