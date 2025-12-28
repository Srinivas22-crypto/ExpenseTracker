# Backend Server Cleanup Guide

## 🚨 Problem: Server Not Stopping Properly

When you press `Ctrl+C` or close the terminal, the Node.js server might continue running in the background, occupying the port and preventing restarts.

### Why This Happens

1. **Socket.io Connections**: WebSocket connections can keep the process alive
2. **Database Connections**: MongoDB connections might not close properly
3. **Background Threads**: Node.js event loop keeps running if connections aren't closed
4. **Nodemon**: Development tool that might spawn child processes
5. **Zombie Processes**: Processes that don't receive termination signals properly

---

## 🛠️ Immediate Solution: Kill Running Processes

### Windows (PowerShell)

#### Option 1: Using the provided script
```powershell
cd backend
.\kill-port.ps1 -Port 5000
```

#### Option 2: Manual PowerShell commands
```powershell
# Find process on port 5000
$process = Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess -Unique

# Kill the process
Stop-Process -Id $process -Force
```

#### Option 3: Using netstat and taskkill (CMD)
```cmd
# Find process ID
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID from above)
taskkill /PID <PID> /F
```

### macOS / Linux

#### Option 1: Using the provided script
```bash
cd backend
chmod +x kill-port.sh
./kill-port.sh 5000
```

#### Option 2: Manual commands
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or using fuser (Linux)
fuser -k 5000/tcp
```

#### Option 3: Find all Node processes
```bash
# Find all node processes
ps aux | grep node

# Kill specific process
kill -9 <PID>

# Kill all node processes (use with caution!)
pkill -9 node
```

---

## ✅ Permanent Solution: Graceful Shutdown Handler

The `server.js` file has been updated with proper shutdown handlers that:

1. ✅ Close HTTP server gracefully
2. ✅ Close Socket.io connections
3. ✅ Close MongoDB connections
4. ✅ Handle SIGTERM and SIGINT signals
5. ✅ Force shutdown after 10 seconds if needed

### How It Works

When you press `Ctrl+C`:
1. Node.js receives `SIGINT` signal
2. Server stops accepting new connections
3. Socket.io closes all WebSocket connections
4. MongoDB connection closes
5. Process exits cleanly

---

## 🔧 Nodemon Configuration

If you're using `nodemon`, it should now handle shutdowns properly. However, you can add a `nodemon.json` configuration file for better control:

```json
{
  "watch": ["."],
  "ext": "js,json",
  "ignore": ["node_modules", "*.test.js"],
  "delay": 1000,
  "signal": "SIGTERM",
  "killTimeout": 5000
}
```

### Nodemon Cleanup

If nodemon itself gets stuck:

**Windows:**
```powershell
Get-Process nodemon | Stop-Process -Force
```

**macOS/Linux:**
```bash
pkill -9 nodemon
```

---

## 🚀 Safe Restart Commands

After cleaning up processes, restart your server:

### Development (with nodemon)
```bash
cd backend
npm run dev
# or
npm run server
```

### Production
```bash
cd backend
npm start
```

### Manual Start
```bash
cd backend
node server.js
```

---

## 🔍 Verify Port is Free

Before restarting, verify the port is free:

### Windows
```powershell
Test-NetConnection -ComputerName localhost -Port 5000
```

### macOS/Linux
```bash
lsof -i:5000
# Should return nothing if port is free
```

---

## 📋 Quick Reference Commands

### Windows PowerShell
```powershell
# Kill process on port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }

# Find all node processes
Get-Process node

# Kill all node processes
Get-Process node | Stop-Process -Force
```

### macOS/Linux
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Find all node processes
ps aux | grep node

# Kill all node processes
pkill -9 node
```

---

## 🐛 Troubleshooting

### Issue: Port still occupied after killing process

**Solution:**
1. Wait 30-60 seconds (port might be in TIME_WAIT state)
2. Check if another process is using the port
3. Restart your computer if necessary (last resort)

### Issue: Multiple node processes running

**Solution:**
```bash
# Kill all node processes
# Windows:
Get-Process node | Stop-Process -Force

# macOS/Linux:
pkill -9 node
```

### Issue: Nodemon not restarting properly

**Solution:**
1. Kill all nodemon processes
2. Clear nodemon cache: `rm -rf node_modules/.cache`
3. Restart with: `npm run dev`

---

## 💡 Best Practices

1. **Always use Ctrl+C** to stop the server (don't just close terminal)
2. **Wait 2-3 seconds** after Ctrl+C before restarting
3. **Check port status** if restart fails
4. **Use the cleanup scripts** provided in this guide
5. **Monitor processes** if issues persist: `ps aux | grep node`

---

## 📝 Notes

- The graceful shutdown handler has a 10-second timeout
- Socket.io connections are closed before HTTP server
- MongoDB connections are closed last
- All shutdowns are logged with colored output



