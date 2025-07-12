#!/bin/bash

# Inner Cosmos Production Server Management Script

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

case "$1" in
  start)
    echo -e "${GREEN}Starting Inner Cosmos production servers...${NC}"
    cd /opt/Inner-Cosmos
    npm run prod &
    echo $! > /tmp/inner-cosmos-prod.pid
    echo -e "${GREEN}Production servers started. PID saved to /tmp/inner-cosmos-prod.pid${NC}"
    echo -e "${GREEN}Frontend: http://localhost:4173${NC}"
    echo -e "${GREEN}Backend API: http://localhost:8000${NC}"
    ;;
    
  stop)
    echo -e "${RED}Stopping Inner Cosmos production servers...${NC}"
    pkill -f "node.*concurrently.*prod" || true
    pkill -f "python.*uvicorn main:app" || true
    pkill -f "vite preview" || true
    rm -f /tmp/inner-cosmos-prod.pid
    echo -e "${RED}Production servers stopped.${NC}"
    ;;
    
  restart)
    $0 stop
    sleep 2
    $0 start
    ;;
    
  status)
    echo "Checking Inner Cosmos production server status..."
    if ps aux | grep -E "(python.*main:app|vite preview)" | grep -v grep > /dev/null; then
      echo -e "${GREEN}Production servers are running:${NC}"
      ps aux | grep -E "(python.*main:app|vite preview)" | grep -v grep
    else
      echo -e "${RED}Production servers are not running.${NC}"
    fi
    ;;
    
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac 