# Backend - Inner Cosmos API

FastAPI backend with safe Python code execution.

## Quick Setup

```bash
# Create virtual environment and install dependencies
uv venv
uv sync

# Run development server
uv run uvicorn main:app --reload --port 8000
```

## Dependencies

- **FastAPI**: Web framework for building APIs
- **uvicorn**: ASGI server for FastAPI
- **pydantic**: Data validation using Python type annotations
- **websockets**: WebSocket support for real-time communication

## Adding Dependencies

```bash
# Add runtime dependency
uv add package-name

# Add development dependency
uv add --dev package-name

# Update dependencies
uv sync
```

## API Endpoints

- `GET /` - Health check
- `POST /execute` - Execute Python code (REST)
- `WS /ws` - Execute Python code (WebSocket)
- `GET /docs` - Interactive API documentation

## Security

The execution environment is sandboxed with restricted built-ins and only safe modules:
- `math`, `random`, `datetime`, `json`
- Standard built-ins: `print`, `len`, `range`, etc.
- No file system or network access 