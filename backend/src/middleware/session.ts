import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Session middleware to ensure sessionId is available for all requests
export function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  // Check for existing session ID in cookie
  let sessionId = req.cookies?.sessionId;
  
  if (!sessionId) {
    // Generate new session ID
    sessionId = crypto.randomUUID();
    
    // Set session cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }
  
  // Always set sessionId on request
  req.sessionId = sessionId;
  
  next();
} 