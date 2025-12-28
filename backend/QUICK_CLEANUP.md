# Quick Cleanup Commands

## 🚨 Kill Process on Port 5000

### Windows PowerShell
```powershell
# Quick one-liner
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }

# Or use the script
.\kill-port.ps1 -Port 5000
```

### Windows CMD
```cmd
# Find PID
netstat -ano | findstr :5000

# Kill (replace <PID> with actual number)
taskkill /PID <PID> /F
```

### macOS / Linux
```bash
# Quick one-liner
lsof -ti:5000 | xargs kill -9

# Or use the script
chmod +x kill-port.sh
./kill-port.sh 5000
```

## 🔄 Restart Server

After cleanup:
```bash
cd backend
npm run dev
```

## ✅ Verify Port is Free

### Windows
```powershell
Test-NetConnection -ComputerName localhost -Port 5000
```

### macOS / Linux
```bash
lsof -i:5000
# Should return nothing if free
```



