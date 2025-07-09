# Inner Cosmos - Personal Website

A minimal, powerful personal website enabling on-demand Python code execution with React/TypeScript frontend.

## Documentation

- **[Website Architecture Guide](docs/WEBSITE_ARCHITECTURE.md)** - Overview of architectural patterns and solutions
- **[Search Functionality Architecture](docs/SEARCH_ARCHITECTURE.md)** - Deep dive into the search implementation

## Architecture

- **Frontend**: React + TypeScript + Vite + Redux Toolkit
- **Backend**: FastAPI (Python) with uv + pyproject.toml
- **Communication**: REST API + WebSocket
- **State Management**: Redux Toolkit for global UI state and navigation

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
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Layout.tsx   # Main layout wrapper
│   │   │   ├── Sidebar.tsx  # Navigation sidebar
│   │   │   └── modals/      # Modal components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Redux store configuration
│   │   │   ├── slices/      # Redux slices (ui, navigation)
│   │   │   ├── hooks.ts     # Typed Redux hooks
│   │   │   └── index.ts     # Store configuration
│   │   └── pages/           # Page components
├── backend/           # FastAPI Python server
│   ├── pyproject.toml # Python dependencies & config
│   ├── .venv/         # Virtual environment (auto-created)
│   └── main.py        # FastAPI application
├── shared/            # Shared TypeScript types
└── package.json       # Root scripts and deps
```

## Frontend Architecture

The frontend uses a modular component architecture with Redux for state management:

### State Management
- **UI Slice**: Manages global UI state (sidebar visibility, modals, sound settings)
- **Navigation Slice**: Handles navigation state (dropdown menus, focus areas)

### Key Components
- **Layout**: Main layout wrapper that orchestrates the app structure
- **Sidebar**: Navigation component with keyboard navigation support
- **Modals**: Reusable modal components for settings and controls

### Custom Hooks
- **useKeyboardNavigation**: Comprehensive keyboard navigation throughout the app
- **useRandomQuote**: Fetches and displays random quotes in the sidebar

## Key Features

### Accessibility
- **Full Keyboard Navigation**: Complete keyboard-only operation with Tab, arrows, and shortcuts
- **Focus Management**: Visual indicators and logical focus flow
- **Custom Search**: Override browser search (Cmd+F) with full-text search across all pages

### UI/UX
- **Minimalist Design**: Clean black and white interface
- **Smooth Animations**: Subtle transitions and hover effects
- **Responsive Layout**: Collapsible sidebar with persistent state
- **Modal System**: Centralized modal management for settings and controls

### Developer Experience
- **TypeScript**: Full type safety across the codebase
- **Hot Module Replacement**: Instant updates during development
- **Redux DevTools**: Debug state changes easily
- **Modular Architecture**: Clear separation of concerns

For detailed implementation information, see the [documentation](docs/). 