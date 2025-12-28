#!/bin/bash
# Bash script to kill process on a specific port
# Usage: ./kill-port.sh 5000

PORT=$1

if [ -z "$PORT" ]; then
    echo "❌ Error: Port number required"
    echo "Usage: ./kill-port.sh <port>"
    exit 1
fi

echo "🔍 Searching for process on port $PORT..."

# Find process using the port (works on macOS and Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    PID=$(lsof -ti:$PORT)
else
    # Linux
    PID=$(lsof -ti:$PORT 2>/dev/null || fuser $PORT/tcp 2>/dev/null | awk '{print $1}')
fi

if [ -z "$PID" ]; then
    echo "ℹ️  No process found on port $PORT"
    exit 0
fi

echo "📌 Found process: PID $PID"
echo "🔪 Terminating process..."

kill -9 $PID 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Process $PID terminated successfully"
else
    echo "❌ Failed to terminate process $PID"
    exit 1
fi



