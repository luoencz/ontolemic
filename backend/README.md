# Backend - Inner Cosmos

Unified backend service running both stats tracking and Python code execution API.

## Services

2. **Python Code Execution API** (FastAPI) - Port 8000
   - Safe Python code execution environment
   - WebSocket support for real-time execution
   - Sandboxed with restricted built-ins

## Production Deployment

The backend runs as a systemd service called `inner-cosmos-backend`.

```bash
# Build and restart the service
npm run prod

# Check service status
npm run status

# View logs
npm run logs
```

## Manual Development

For development without systemd:

```bash
# Install dependencies
npm install

# Run the production script directly
./scripts/start-prod
```

## Security

The Python execution environment is sandboxed with:
- Restricted built-ins only
- Safe modules: `math`, `random`, `datetime`, `json`
- No file system or network access
- Timeout protection

## API Endpoints

**Python API (Port 8000)**
- `GET /` - Health check
- `POST /execute` - Execute Python code (REST)
- `WS /ws` - Execute Python code (WebSocket)
- `GET /docs` - Interactive API documentation 