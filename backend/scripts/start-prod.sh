#!/bin/bash
# Start Inner Cosmos backend service

cd /opt/Inner-Cosmos/backend

# Start the Python FastAPI server
echo "Starting FastAPI server on port 8000..."
/opt/Inner-Cosmos/backend/.venv/bin/python -m uvicorn src.app:app --host 0.0.0.0 --port 8000 &
API_PID=$!

# Function to handle shutdown
cleanup() {
    echo "Shutting down service..."
    kill $API_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "FastAPI server started successfully"
echo "API: http://localhost:8000"
echo "Docs: http://localhost:8000/docs"

# Wait for the process
wait $API_PID 