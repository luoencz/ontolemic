import { Router, Request, Response } from 'express';
import { statsService } from '../services/statsService';

const router = Router();

// Get all stats
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = statsService.getAllStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Execute custom query
router.post('/query', (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    const results = statsService.executeQuery(query);
    res.json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Track visit via API (for single-page apps)
router.post('/track', (req: Request, res: Response) => {
  try {
    const { path, title } = req.body;
    
    if (!path) {
      return res.status(400).json({ error: 'Path is required' });
    }

    const ip = req.headers['x-forwarded-for'] as string || 
               req.headers['x-real-ip'] as string || 
               req.socket.remoteAddress || 
               'unknown';

    statsService.trackVisit({
      path,
      title,
      referrer: req.headers.referer,
      userAgent: req.headers['user-agent'],
      ip: ip.split(',')[0].trim(),
      sessionId: req.sessionId || 'api-' + Date.now()
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track visit' });
  }
});

// Get database schema
router.get('/schema', (req: Request, res: Response) => {
  const schema = `
CREATE TABLE visits (
  id INTEGER PRIMARY KEY,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  country TEXT,
  city TEXT,
  session_id TEXT
);

CREATE TABLE pages (
  path TEXT PRIMARY KEY,
  title TEXT,
  first_visit DATETIME,
  last_visit DATETIME,
  total_visits INTEGER DEFAULT 0
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  page_count INTEGER DEFAULT 1,
  total_duration INTEGER DEFAULT 0,
  user_agent TEXT,
  ip_hash TEXT
);

CREATE TABLE daily_stats (
  date DATE,
  path TEXT,
  visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_duration INTEGER DEFAULT 0,
  PRIMARY KEY (date, path)
);`;

  res.type('text/plain').send(schema);
});

export default router; 