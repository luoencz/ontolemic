import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { realtimeStatsService } from './services/realtimeStatsService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const server = createServer(app);

app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://home.the-o.space',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    websocketClients: realtimeStatsService.getClientCount()
  });
});

app.get('/t.gif', async (req, res, next) => {
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, private'
    });
    res.end(pixel);
});

server.listen(PORT, () => {
  console.log(`Stats server running on port ${PORT}`);
  console.log(`Database location: ${process.env.DB_PATH || './data/stats.db'}`);
  
  realtimeStatsService.initialize(server);
  
});

const shutdown = () => {
  console.log('Shutting down gracefully...');
  
  realtimeStatsService.shutdown();
  
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.log('Force exit');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown); 