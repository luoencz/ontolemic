import { db } from '../db/init';

export class SessionCleanupService {
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;
  
  // Start the cleanup service
  start(intervalSeconds: number = 30) {
    console.log(`Starting session cleanup service (runs every ${intervalSeconds}s)`);
    
    // Run cleanup immediately on start
    this.cleanupInactiveSessions();
    
    // Then run periodically
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveSessions();
    }, intervalSeconds * 1000);
  }
  
  // Stop the cleanup service
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('Stopped session cleanup service');
    }
  }
  
  // Clean up sessions that haven't had activity in over 60 seconds
  private cleanupInactiveSessions() {
    try {
      // Mark sessions as inactive
      // For sessions with no activity (end_time is NULL), set end_time = start_time and duration = 0
      // For sessions with activity, their end_time and duration are already correct from the last activity
      const result = db.prepare(`
        UPDATE active_sessions 
        SET is_active = 0,
            end_time = COALESCE(end_time, start_time),
            total_duration = CASE 
              WHEN end_time IS NULL THEN 0 
              ELSE total_duration 
            END
        WHERE is_active = 1 
          AND datetime(COALESCE(end_time, start_time), '+60 seconds') < datetime('now')
      `).run();
      
      if (result.changes > 0) {
        console.log(`Cleaned up ${result.changes} inactive sessions`);
      }
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }
}

export const sessionCleanupService = new SessionCleanupService(); 