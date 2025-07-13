import { db } from '../db/init';
import crypto from 'crypto';
import { Request } from 'express';

interface TrackVisitParams {
  path: string;
  referrer?: string;
  userAgent?: string;
  ip: string;
  sessionId: string;
  title?: string;
}

export class StatsService {
  // Hash IP for privacy
  private hashIP(ip: string): string {
    return crypto.createHash('sha256').update(ip).digest('hex');
  }

  // Track a page visit
  trackVisit(params: TrackVisitParams): void {
    const ipHash = this.hashIP(params.ip);
    
    // Insert visit record
    const stmt = db.prepare(`
      INSERT INTO visits (path, referrer, user_agent, ip_hash, session_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      params.path,
      params.referrer || null,
      params.userAgent || null,
      ipHash,
      params.sessionId
    );

    // Update or create session
    const sessionStmt = db.prepare(`
      INSERT INTO sessions (id, user_agent, ip_hash)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        last_seen = CURRENT_TIMESTAMP,
        page_count = page_count + 1
    `);
    
    sessionStmt.run(params.sessionId, params.userAgent || null, ipHash);

    // Update page stats
    const pageStmt = db.prepare(`
      INSERT INTO pages (path, title, first_visit, last_visit, total_visits)
      VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
      ON CONFLICT(path) DO UPDATE SET
        last_visit = CURRENT_TIMESTAMP,
        total_visits = total_visits + 1,
        title = COALESCE(?, title)
    `);
    
    pageStmt.run(params.path, params.title || null, params.title || null);
  }

  // Get overview stats
  getOverviewStats() {
    const totalVisits = db.prepare('SELECT COUNT(*) as count FROM visits').get() as { count: number };
    const uniqueVisitors = db.prepare('SELECT COUNT(DISTINCT ip_hash) as count FROM visits').get() as { count: number };
    const lastUpdate = db.prepare('SELECT MAX(timestamp) as timestamp FROM visits').get() as { timestamp: string };

    return {
      totalVisits: totalVisits.count,
      uniqueVisitors: uniqueVisitors.count,
      lastUpdate: lastUpdate.timestamp || new Date().toISOString()
    };
  }

  // Get top pages
  getTopPages(limit: number = 10) {
    const totalVisits = (db.prepare('SELECT COUNT(*) as count FROM visits').get() as { count: number }).count;
    
    const stmt = db.prepare(`
      SELECT 
        path,
        COUNT(*) as visits,
        ROUND(COUNT(*) * 100.0 / ?, 1) as percentage
      FROM visits
      GROUP BY path
      ORDER BY visits DESC
      LIMIT ?
    `);
    
    return stmt.all(totalVisits, limit);
  }

  // Get visitor locations
  getVisitorLocations(limit: number = 20) {
    const stmt = db.prepare(`
      SELECT 
        country,
        city,
        COUNT(DISTINCT ip_hash) as visits
      FROM visits
      WHERE country IS NOT NULL
      GROUP BY country, city
      ORDER BY visits DESC
      LIMIT ?
    `);
    
    return stmt.all(limit);
  }

  // Get recent visits
  getRecentVisits(limit: number = 20) {
    const stmt = db.prepare(`
      SELECT 
        timestamp,
        path,
        referrer
      FROM visits
      ORDER BY timestamp DESC
      LIMIT ?
    `);
    
    return stmt.all(limit);
  }

  // Execute custom query (read-only)
  executeQuery(query: string): { columns: string[], rows: any[][] } {
    // Basic SQL injection prevention - only allow SELECT
    const normalizedQuery = query.trim().toUpperCase();
    if (!normalizedQuery.startsWith('SELECT')) {
      throw new Error('Only SELECT queries are allowed');
    }
    
    // Additional checks for dangerous keywords
    const dangerousKeywords = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'EXEC', 'EXECUTE'];
    for (const keyword of dangerousKeywords) {
      if (normalizedQuery.includes(keyword)) {
        throw new Error(`Query contains forbidden keyword: ${keyword}`);
      }
    }

    try {
      const stmt = db.prepare(query);
      const rows = stmt.all();
      
      if (rows.length === 0) {
        return { columns: [], rows: [] };
      }
      
      const columns = Object.keys(rows[0]);
      const data = rows.map(row => columns.map(col => row[col]));
      
      return { columns, rows: data };
    } catch (error) {
      throw new Error(`Query error: ${error.message}`);
    }
  }

  // Get all stats for the dashboard
  getAllStats() {
    return {
      ...this.getOverviewStats(),
      topPages: this.getTopPages(),
      visitorLocations: this.getVisitorLocations(),
      recentVisits: this.getRecentVisits()
    };
  }
}

export const statsService = new StatsService(); 