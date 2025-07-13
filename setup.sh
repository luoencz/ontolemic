#!/bin/bash

echo "🌌 Setting up Inner Cosmos..."

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ uv is not installed. Please install it first:"
    echo "  curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Install backend dependencies
echo "Installing backend dependencies with uv..."
cd backend && uv venv && uv sync && cd ..

echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "Or start individually:"
echo "  npm run dev:frontend  (React app on :5173)"
echo "  npm run dev:backend   (FastAPI on :8000)" 