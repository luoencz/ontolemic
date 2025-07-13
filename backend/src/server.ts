import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { trackingMiddleware, trackingHeaders } from './middleware/tracking';
import { sessionMiddleware } from './middleware/session';
import { sessionCleanupService } from './services/sessionCleanup';
import statsRoutes from './routes/stats';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Global middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://home.the-o.space',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply tracking headers to all routes
app.use(trackingHeaders);

// Session middleware - must come after cookieParser
app.use(sessionMiddleware);

// Apply tracking middleware
app.use(trackingMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', statsRoutes);

// Tracking pixel endpoint
app.get('/t.gif', async (req, res, next) => {
  await trackingMiddleware(req, res, () => {
    // Return 1x1 transparent GIF
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
});

// Start server
app.listen(PORT, () => {
  console.log(`Stats server running on port ${PORT}`);
  console.log(`Database location: ${process.env.DB_PATH || './data/stats.db'}`);
  
  // Start the session cleanup service (runs every 30 seconds)
  sessionCleanupService.start(30);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  sessionCleanupService.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  sessionCleanupService.stop();
  process.exit(0);
}); 