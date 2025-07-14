import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

export class RealtimeStatsService {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();
  private statsCache: any = null;
  private updateTimer: ReturnType<typeof setInterval> | null = null;

  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/api/live-stats'
    });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket client connected for live stats');
      this.clients.add(ws);

      this.sendStatsToClient(ws);

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log('WebSocket client disconnected');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });

    this.startPeriodicUpdates();
    
    console.log('Real-time stats WebSocket server initialized');
  }

  private startPeriodicUpdates() {
    if (this.updateTimer) return;
    
    this.updateTimer = setInterval(() => {
      this.broadcastStats();
    }, 2000);
  }

  private stopPeriodicUpdates() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }

  private async sendStatsToClient(ws: WebSocket) {
    try {
      const stats = {};
      const message = JSON.stringify({
        type: 'stats-update',
        data: stats,
        timestamp: new Date().toISOString()
      });
      
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    } catch (error) {
      console.error('Error sending stats to client:', error);
    }
  }

  async broadcastStats() {
    if (this.clients.size === 0) return;

    try {
      const stats = {};
      
      const message = JSON.stringify({
        type: 'stats-update',
        data: stats,
        timestamp: new Date().toISOString()
      });

      this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        } else {
          this.clients.delete(client);
        }
      });
    } catch (error) {
      console.error('Error broadcasting stats:', error);
    }
  }

  async forceUpdate() {
    await this.broadcastStats();
  }

  getClientCount(): number {
    return this.clients.size;
  }

  shutdown() {
    this.stopPeriodicUpdates();
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    });
    
    this.clients.clear();
    
    if (this.wss) {
      this.wss.close();
    }
  }
}

export const realtimeStatsService = new RealtimeStatsService(); 