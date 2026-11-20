param(
    [int]$Port = 3000
)

$rootDir = $PSScriptRoot
if (-not $rootDir) { $rootDir = (Get-Location).Path }

# Find available port
$maxTries = 10
$listener = $null
for ($i = 0; $i -lt $maxTries; $i++) {
    $currentPort = $Port + $i
    try {
        $tempListener = New-Object System.Net.HttpListener
        $prefix = "http://localhost:$currentPort/"
        $tempListener.Prefixes.Add($prefix)
        $tempListener.Start()
        $listener = $tempListener
        $Port = $currentPort
        break
    } catch {
        if ($tempListener) { $tempListener.Close() }
    }
}

if (-not $listener) {
    Write-Error "Could not bind to any port starting from $Port"
    exit 1
}

Write-Host "=========================================================="
Write-Host " MediSlot AI Local Server running!" -ForegroundColor Green
Write-Host " URL: http://localhost:$Port/" -ForegroundColor Cyan
Write-Host " Serving directory: $rootDir"
Write-Host " Press Ctrl+C in this terminal to stop."
Write-Host "=========================================================="

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.sql'  = 'text/plain; charset=utf-8'
    '.txt'  = 'text/plain; charset=utf-8'
    '.md'   = 'text/markdown; charset=utf-8'
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS headers
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        # Mock API /api/env
        $rawPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
        if ($rawPath -eq '/api/env' -or $rawPath -eq '/stitch_medislot_ai_appointment_system/api/env') {
            $envData = @{
                SUPABASE_URL = "https://dbiiejpqecascguowhwy.supabase.co"
                SUPABASE_ANON_KEY = "sb_publishable_achLmIKrIfrJmKRgpC91nA_m0qWe29J"
            }
            $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $envData))
            $response.ContentType = 'application/json; charset=utf-8'
            $response.ContentLength64 = $jsonBytes.Length
            $response.OutputStream.Write($jsonBytes, 0, $jsonBytes.Length)
            $response.Close()
            continue
        }

        # Resolve file path
        $relPath = $rawPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($relPath)) {
            $relPath = 'index.html'
        }

        $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($rootDir, $relPath))

        # Check if directory
        if (Test-Path $fullPath -PathType Container) {
            $fullPath = [System.IO.Path]::Combine($fullPath, 'index.html')
        }

        # Security check: must remain inside root directory
        if (-not $fullPath.StartsWith($rootDir, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
            
            $fileBytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentType = $mime
            $response.ContentLength64 = $fileBytes.Length
            $response.StatusCode = 200

            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
            }
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found: $rawPath</h1>")
            $response.ContentType = 'text/html; charset=utf-8'
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }

        $response.Close()
    }
} finally {
    if ($listener) {
        $listener.Stop()
        $listener.Close()
    }
}
