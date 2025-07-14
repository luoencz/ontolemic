import { useState, useEffect, useRef, useCallback } from 'react';

const STATS_WS_URL = 'wss://home.the-o.space/api/live-stats';

export interface StatsData {
  totalVisitors: number;
  totalSessions: number;
  activeSessions: number;
  avgSessionDuration: number;
  avgActionsPerSession: number;
  recentSessions: Array<{
    id: number;
    startTime: string;
    endTime?: string;
    duration?: number;
    actionCount: number;
    isActive: boolean;
  }>;
  lastUpdate: string; 
};


interface LiveEvent {
  type: string;
  eventType: string;
  data: any;
  timestamp: string;
}

export function useLiveStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    try {
      console.log('Connecting to live stats WebSocket...');
      wsRef.current = new WebSocket(STATS_WS_URL);

      wsRef.current.onopen = () => {
        console.log('Live stats WebSocket connected');
        setConnected(true);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'stats-update') {
            setStats(message.data);
            setLastUpdate(message.timestamp);
          } else if (message.type === 'live-event') {
            const liveEvent: LiveEvent = {
              type: message.type,
              eventType: message.eventType,
              data: message.data,
              timestamp: message.timestamp
            };
            
            setLiveEvents(prev => [liveEvent, ...prev.slice(0, 19)]); // Keep last 20 events
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('Live stats WebSocket disconnected');
        setConnected(false);
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          reconnectAttempts.current++;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('Live stats WebSocket error:', error);
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setConnected(false);
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Clear live events
  const clearLiveEvents = useCallback(() => {
    setLiveEvents([]);
  }, []);

  return {
    stats,
    connected,
    lastUpdate,
    liveEvents,
    clearLiveEvents,
    reconnect: connect
  };
} 