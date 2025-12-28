# PowerShell script to kill process on a specific port
# Usage: .\kill-port.ps1 -Port 5000

param(
    [Parameter(Mandatory=$true)]
    [int]$Port
)

Write-Host "🔍 Searching for process on port $Port..." -ForegroundColor Yellow

# Find process using the port
$process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    $processId = $process
    $processInfo = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    if ($processInfo) {
        Write-Host "📌 Found process: $($processInfo.ProcessName) (PID: $processId)" -ForegroundColor Cyan
        
        # Kill the process
        Stop-Process -Id $processId -Force
        Write-Host "✅ Process $processId terminated successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Process ID $processId not found" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  No process found on port $Port" -ForegroundColor Blue
}



