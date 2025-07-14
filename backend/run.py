#!/usr/bin/env python3
"""
Run script for the Inner Cosmos backend.

Note: This script is for development/testing purposes.
In production, the backend is managed via systemctl:
  - Start/restart: sudo systemctl restart inner-cosmos-backend.service
  - Check status: systemctl status inner-cosmos-backend.service
  - View logs: sudo journalctl -u inner-cosmos-backend.service -f
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 