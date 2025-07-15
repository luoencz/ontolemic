# Backend - Inner Cosmos

Unified backend service for the Inner Cosmos personal website.

## Services

**Stats Tracking API** (FastAPI) - Port 8000
- Session and activity tracking
- Real-time statistics via WebSocket
- Heartbeat monitoring

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

## API Endpoints

**Stats API (Port 8000)**
- `GET /` - Health check
- `POST /api/stats/heartbeat` - Session tracking
- `WS /live-stats` - Real-time statistics updates
- `GET /docs` - Interactive API documentation 