#!/bin/bash
# Start all Inner Cosmos backend services

cd /opt/Inner-Cosmos/backend

# Build TypeScript
echo "Building TypeScript..."
npx tsc

# Start the stats tracking server (TypeScript)
echo "Starting stats tracking server on port 3001..."
node dist/server.js &
STATS_PID=$!

# Start the Python code execution API
echo "Starting Python API server on port 8000..."
/opt/Inner-Cosmos/backend/.venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
API_PID=$!

# Function to handle shutdown
cleanup() {
    echo "Shutting down services..."
    kill $STATS_PID $API_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "All services started successfully"
echo "Stats server: http://localhost:3001"
echo "Python API: http://localhost:8000"

# Wait for both processes
wait $STATS_PID $API_PID 