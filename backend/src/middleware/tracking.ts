import { Request, Response, NextFunction } from 'express';
import { statsService } from '../services/statsService';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
    }
  }
}

// Tracking middleware
export async function trackingMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only track GET requests to avoid tracking API calls
  if (req.method !== 'GET') {
    return next();
  }

  // Skip tracking for static assets and API routes
  const skipPaths = ['/api/', '/static/', '/_next/', '.js', '.css', '.ico', '.png', '.jpg', '.webp'];
  if (skipPaths.some(path => req.path.includes(path))) {
    return next();
  }

  try {
    // sessionId is now set by session middleware
    const sessionId = req.sessionId;
    
    if (!sessionId) {
      console.error('No sessionId available in tracking middleware');
      return next();
    }

    // Get client IP (handle proxies)
    const ip = req.headers['x-forwarded-for'] as string || 
               req.headers['x-real-ip'] as string || 
               req.socket.remoteAddress || 
               'unknown';

    // Track the visit
    await statsService.trackVisit({
      path: req.path,
      referrer: req.headers.referer,
      userAgent: req.headers['user-agent'],
      ip: ip.split(',')[0].trim(), // Handle comma-separated IPs
      sessionId: sessionId
    });
  } catch (error) {
    console.error('Tracking error:', error);
  }

  next();
}

// CORS headers for tracking pixel
export function trackingHeaders(req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
} 