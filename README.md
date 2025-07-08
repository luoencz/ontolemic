# Inner Cosmos - Personal Website

A minimal, powerful personal website enabling on-demand Python code execution with React/TypeScript frontend.

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI (Python) with uv + pyproject.toml
- **Communication**: REST API + WebSocket

## Prerequisites

- Node.js (18+)
- [uv](https://github.com/astral-sh/uv) - Ultra-fast Python package installer

```bash
# Install uv if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Quick Start

```bash
# One-command setup
./setup.sh

# Start both servers concurrently
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Features

- **Monaco Editor**: VS Code-quality Python code editing
- **Real-time Execution**: Execute Python code via REST API or WebSocket
- **Safe Sandbox**: Restricted execution environment with common modules
- **Modern UI**: Clean, responsive React interface
- **Fast Development**: Vite for instant HMR, FastAPI for async performance

## Development

```bash
# Frontend only
npm run dev:frontend

# Backend only  
npm run dev:backend

# Backend with uv directly
cd backend && uv run uvicorn main:app --reload

# Add new Python dependencies
cd backend && uv add package-name

# Build for production
npm run build
```

## Project Structure

```
├── frontend/          # React + TypeScript app
├── backend/           # FastAPI Python server
│   ├── pyproject.toml # Python dependencies & config
│   ├── .venv/         # Virtual environment (auto-created)
│   └── main.py        # FastAPI application
├── shared/            # Shared TypeScript types
└── package.json       # Root scripts and deps
``` 