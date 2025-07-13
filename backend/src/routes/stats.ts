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
    res.status(400).json({ error: (error as Error).message });
  }
});

// Track visit via API (for single-page apps)
router.post('/track', async (req: Request, res: Response) => {
  try {
    const { path, title } = req.body;
    
    if (!path) {
      return res.status(400).json({ error: 'Path is required' });
    }
    
    if (!req.sessionId) {
      return res.status(400).json({ error: 'No session ID available' });
    }

    const ip = req.headers['x-forwarded-for'] as string || 
               req.headers['x-real-ip'] as string || 
               req.socket.remoteAddress || 
               'unknown';

    await statsService.trackVisit({
      path,
      title,
      referrer: req.headers.referer,
      userAgent: req.headers['user-agent'],
      ip: ip.split(',')[0].trim(),
      sessionId: req.sessionId
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track visit' });
  }
});

// Track external link click
router.post('/track-link', async (req: Request, res: Response) => {
  try {
    const { url, pagePath, context } = req.body;
    
    if (!url || !pagePath) {
      return res.status(400).json({ error: 'URL and page path are required' });
    }
    
    if (!req.sessionId) {
      return res.status(400).json({ error: 'No session ID available' });
    }

    const ip = req.headers['x-forwarded-for'] as string || 
               req.headers['x-real-ip'] as string || 
               req.socket.remoteAddress || 
               'unknown';

    await statsService.trackExternalLink({
      url,
      pagePath,
      sessionId: req.sessionId,
      ip: ip.split(',')[0].trim(),
      context
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track link click' });
  }
});

// Track user activity
router.post('/track-activity', async (req: Request, res: Response) => {
  try {
    const { pagePath, pageTitle, interactionType, details } = req.body;
    
    if (!pagePath || !interactionType) {
      return res.status(400).json({ error: 'Page path and interaction type are required' });
    }
    
    if (!req.sessionId) {
      return res.status(400).json({ error: 'No session ID available' });
    }

    const ip = req.headers['x-forwarded-for'] as string || 
               req.headers['x-real-ip'] as string || 
               req.socket.remoteAddress || 
               'unknown';

    await statsService.trackActivity({
      sessionId: req.sessionId,
      ip: ip.split(',')[0].trim(),
      pagePath,
      pageTitle,
      interactionType,
      details,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track activity' });
  }
});

// Update page engagement metrics
router.post('/update-engagement', async (req: Request, res: Response) => {
  try {
    const { pagePath, duration, scrollDepth } = req.body;
    
    if (!pagePath || duration === undefined) {
      return res.status(400).json({ error: 'Page path and duration are required' });
    }
    
    if (!req.sessionId) {
      return res.status(400).json({ error: 'No session ID available' });
    }

    await statsService.updatePageEngagement({
      sessionId: req.sessionId,
      pagePath,
      duration,
      scrollDepth
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update engagement' });
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