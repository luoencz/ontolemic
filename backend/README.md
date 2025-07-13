# Backend - Inner Cosmos

Unified backend service running both stats tracking and Python code execution API.

## Services

1. **Stats Tracking Server** (TypeScript) - Port 3001
   - Page visit tracking with session management
   - Visitor geolocation using IP addresses
   - SQLite database for analytics
   - Privacy-focused (IPs are hashed)

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

## Stats Tracking Features

### Geolocation
The service uses ipinfo.io for visitor geolocation:
- **Security**: HTTPS encryption for all requests
- **Rate limit**: 50,000 requests/month (free tier)
- **Privacy**: IPs are hashed before storage
- **Caching**: Results cached to minimize API calls
- **Fallback**: Graceful handling of errors and private IPs

Note: For production use with higher traffic, consider upgrading to a paid plan for:
- Higher rate limits
- SLA guarantees
- Priority support
- Advanced features

### API Endpoints

**Stats Service (Port 3001)**
- `GET /api/stats` - Get all stats
- `POST /api/query` - Execute custom SQL queries
- `GET /t.gif` - Tracking pixel
- `GET /health` - Health check

**Python API (Port 8000)**
- `GET /` - Health check
- `POST /execute` - Execute Python code (REST)
- `WS /ws` - Execute Python code (WebSocket)
- `GET /docs` - Interactive API documentation

## Security

The Python execution environment is sandboxed with:
- Restricted built-ins only
- Safe modules: `math`, `random`, `datetime`, `json`
- No file system or network access
- Timeout protection

## Database Schema

Stats are stored in SQLite at `./data/stats.db` with tables for:
- `visits` - Raw visit data with geolocation
- `pages` - Aggregated page statistics
- `sessions` - User session tracking
- `daily_stats` - Pre-aggregated daily metrics 