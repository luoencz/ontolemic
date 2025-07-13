import { db } from '../db/init';
import crypto from 'crypto';
import { Request } from 'express';
import { geoService } from './geoService';

interface TrackVisitParams {
  path: string;
  referrer?: string;
  userAgent?: string;
  ip: string;
  sessionId: string;
  title?: string;
}

interface TrackLinkParams {
  url: string;
  pagePath: string;
  sessionId: string;
  ip: string;
  context?: string;
}

interface TrackActivityParams {
  sessionId: string;
  ip: string;
  pagePath: string;
  pageTitle?: string;
  interactionType: 'click' | 'scroll' | 'keypress' | 'mousemove' | 'focus';
  details?: any;
  userAgent?: string;
}

interface UpdatePageEngagementParams {
  sessionId: string;
  pagePath: string;
  duration: number;
  scrollDepth?: number;
}

export class StatsService {
  // Hash IP for privacy
  private hashIP(ip: string): string {
    return crypto.createHash('sha256').update(ip).digest('hex');
  }

  // Track a page visit
  async trackVisit(params: TrackVisitParams): Promise<void> {
    const ipHash = this.hashIP(params.ip);
    
    // Check if this is a new visit (new active session) or just internal navigation
    const existingActiveSession = db.prepare(`
      SELECT id FROM active_sessions 
      WHERE session_id = ? 
        AND is_active = 1 
        AND datetime(COALESCE(end_time, start_time), '+60 seconds') > datetime('now')
      LIMIT 1
    `).get(params.sessionId);
    
    const isNewVisit = !existingActiveSession;
    
    // Get geolocation data
    const location = await geoService.getLocation(params.ip);
    
    // Only record in visits table if this is a new visit (not internal navigation)
    if (isNewVisit) {
      // Insert visit record
      const stmt = db.prepare(`
        INSERT INTO visits (path, referrer, user_agent, ip_hash, session_id, country, city)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        params.path,
        params.referrer || null,
        params.userAgent || null,
        ipHash,
        params.sessionId,
        location.country,
        location.city
      );
    }

    // Update or create session
    const sessionStmt = db.prepare(`
      INSERT INTO sessions (id, user_agent, ip_hash, country, city)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        last_seen = CURRENT_TIMESTAMP,
        page_count = page_count + 1,
        country = COALESCE(country, ?),
        city = COALESCE(city, ?)
    `);
    
    sessionStmt.run(
      params.sessionId, 
      params.userAgent || null, 
      ipHash,
      location.country,
      location.city,
      location.country,
      location.city
    );

    // Update page stats - only increment total_visits for new visits
    if (isNewVisit) {
      const pageStmt = db.prepare(`
        INSERT INTO pages (path, title, first_visit, last_visit, total_visits)
        VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
        ON CONFLICT(path) DO UPDATE SET
          last_visit = CURRENT_TIMESTAMP,
          total_visits = total_visits + 1,
          title = COALESCE(?, title)
      `);
      
      pageStmt.run(params.path, params.title || null, params.title || null);
    } else {
      // For internal navigation, just update the last_visit time
      const pageStmt = db.prepare(`
        INSERT INTO pages (path, title, first_visit, last_visit, total_visits)
        VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
        ON CONFLICT(path) DO UPDATE SET
          last_visit = CURRENT_TIMESTAMP,
          title = COALESCE(?, title)
      `);
      
      pageStmt.run(params.path, params.title || null, params.title || null);
    }
  }

  // Track external link click
  async trackExternalLink(params: TrackLinkParams): Promise<void> {
    const ipHash = this.hashIP(params.ip);
    
    // Extract domain from URL
    let domain = 'unknown';
    try {
      const urlObj = new URL(params.url);
      domain = urlObj.hostname;
    } catch (e) {
      // Invalid URL, use as-is
      domain = params.url.substring(0, 50);
    }
    
    const stmt = db.prepare(`
      INSERT INTO external_links (url, domain, page_path, session_id, ip_hash, click_context)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      params.url,
      domain,
      params.pagePath,
      params.sessionId,
      ipHash,
      params.context || null
    );
  }

  // Get or create active session
  async getOrCreateActiveSession(sessionId: string, ip: string, userAgent?: string): Promise<number> {
    const ipHash = this.hashIP(ip);
    
    // Check for existing active session (last activity within 60 seconds)
    const existing = db.prepare(`
      SELECT id FROM active_sessions 
      WHERE session_id = ? 
        AND is_active = 1 
        AND datetime(COALESCE(end_time, start_time), '+60 seconds') > datetime('now')
      ORDER BY start_time DESC 
      LIMIT 1
    `).get(sessionId) as { id: number } | undefined;
    
    if (existing) {
      return existing.id;
    }
    
    // Mark any old sessions as inactive
    // For sessions with no activity (end_time is NULL), set end_time = start_time and duration = 0
    db.prepare(`
      UPDATE active_sessions 
      SET is_active = 0,
          end_time = COALESCE(end_time, start_time),
          total_duration = CASE 
            WHEN end_time IS NULL THEN 0 
            ELSE total_duration 
          END
      WHERE session_id = ? AND is_active = 1
    `).run(sessionId);
    
    // Create new active session
    const result = db.prepare(`
      INSERT INTO active_sessions (session_id, ip_hash, user_agent)
      VALUES (?, ?, ?)
    `).run(sessionId, ipHash, userAgent || null);
    
    return result.lastInsertRowid as number;
  }

  // Track user activity
  async trackActivity(params: TrackActivityParams): Promise<void> {
    const activeSessionId = await this.getOrCreateActiveSession(
      params.sessionId, 
      params.ip, 
      params.userAgent
    );
    
    // Update active session interaction count
    db.prepare(`
      UPDATE active_sessions 
      SET interaction_count = interaction_count + 1,
          end_time = CURRENT_TIMESTAMP,
          total_duration = CAST((julianday(CURRENT_TIMESTAMP) - julianday(start_time)) * 86400 AS INTEGER)
      WHERE id = ?
    `).run(activeSessionId);
    
    // Get or create page engagement record
    const pageEngagement = db.prepare(`
      SELECT id FROM page_engagement 
      WHERE active_session_id = ? AND page_path = ?
      ORDER BY start_time DESC 
      LIMIT 1
    `).get(activeSessionId, params.pagePath) as { id: number } | undefined;
    
    if (!pageEngagement) {
      db.prepare(`
        INSERT INTO page_engagement (active_session_id, page_path, page_title)
        VALUES (?, ?, ?)
      `).run(activeSessionId, params.pagePath, params.pageTitle || null);
      
      // Update page count in active session
      db.prepare(`
        UPDATE active_sessions 
        SET page_count = page_count + 1 
        WHERE id = ?
      `).run(activeSessionId);
    }
    
    // Record the interaction
    db.prepare(`
      INSERT INTO user_interactions (active_session_id, interaction_type, page_path, details)
      VALUES (?, ?, ?, ?)
    `).run(
      activeSessionId,
      params.interactionType,
      params.pagePath,
      params.details ? JSON.stringify(params.details) : null
    );
    
    // Update page engagement interaction count
    db.prepare(`
      UPDATE page_engagement 
      SET interaction_count = interaction_count + 1,
          end_time = CURRENT_TIMESTAMP,
          duration = CAST((julianday(CURRENT_TIMESTAMP) - julianday(start_time)) * 86400 AS INTEGER)
      WHERE active_session_id = ? AND page_path = ?
    `).run(activeSessionId, params.pagePath);
  }

  // Update page engagement metrics
  async updatePageEngagement(params: UpdatePageEngagementParams): Promise<void> {
    // Get active session
    const session = db.prepare(`
      SELECT id FROM active_sessions 
      WHERE session_id = ? AND is_active = 1
      ORDER BY start_time DESC 
      LIMIT 1
    `).get(params.sessionId) as { id: number } | undefined;
    
    if (!session) return;
    
    // Update page engagement
    const updateStmt = db.prepare(`
      UPDATE page_engagement 
      SET duration = ?,
          scroll_depth = CASE WHEN ? > scroll_depth THEN ? ELSE scroll_depth END,
          end_time = CURRENT_TIMESTAMP
      WHERE active_session_id = ? AND page_path = ?
    `);
    
    updateStmt.run(
      params.duration,
      params.scrollDepth || 0,
      params.scrollDepth || 0,
      session.id,
      params.pagePath
    );
  }

  // Get overview stats
  getOverviewStats() {
    // Total visits = number of visit records (new sessions only)
    const totalVisits = db.prepare('SELECT COUNT(*) as count FROM visits').get() as { count: number };
    
    // Total page views = sum of all page counts from sessions
    const totalPageViews = db.prepare('SELECT SUM(page_count) as count FROM sessions').get() as { count: number };
    
    // Add completed active sessions that haven't been counted yet
    const totalActiveSessions = db.prepare('SELECT COUNT(*) as count FROM active_sessions').get() as { count: number };
    
    // Unique visitors based on IP hash from sessions table (tracks all unique visitors)
    const uniqueVisitors = db.prepare('SELECT COUNT(DISTINCT ip_hash) as count FROM sessions').get() as { count: number };
    
    // Last update from most recent activity
    const lastUpdate = db.prepare('SELECT MAX(timestamp) as timestamp FROM visits').get() as { timestamp: string };

    return {
      totalVisits: totalVisits.count + totalActiveSessions.count, // Include active sessions
      totalPageViews: totalPageViews.count || 0,
      uniqueVisitors: uniqueVisitors.count,
      lastUpdate: lastUpdate.timestamp || new Date().toISOString()
    };
  }

  // Get top pages
  getTopPages(limit: number = 10) {
    // Use pages table which tracks all page visits (not just new sessions)
    const totalVisits = db.prepare('SELECT SUM(total_visits) as count FROM pages').get() as { count: number };
    
    const stmt = db.prepare(`
      SELECT 
        path,
        title,
        total_visits as visits,
        ROUND(total_visits * 100.0 / ?, 1) as percentage
      FROM pages
      WHERE total_visits > 0
      ORDER BY total_visits DESC
      LIMIT ?
    `);
    
    return stmt.all(totalVisits.count || 1, limit);
  }

  // Get visitor locations
  getVisitorLocations(limit: number = 20) {
    // This shows where visitors initially arrived from (first page of their session)
    // which is reasonable for understanding visitor origins
    const stmt = db.prepare(`
      SELECT 
        country,
        city,
        COUNT(DISTINCT ip_hash) as visitors
      FROM visits
      WHERE country IS NOT NULL
      GROUP BY country, city
      ORDER BY visitors DESC
      LIMIT ?
    `);
    
    return stmt.all(limit);
  }

  // Get recent visits
  getRecentVisits(limit: number = 20) {
    // Show all recent page views from page engagement data
    const stmt = db.prepare(`
      SELECT 
        pe.start_time as timestamp,
        pe.page_path as path,
        pe.page_title as title,
        pe.duration,
        pe.scroll_depth,
        CASE 
          WHEN pe.active_session_id IN (
            SELECT MIN(id) FROM active_sessions WHERE session_id = asess.session_id
          ) THEN 'New Visit'
          ELSE 'Page View'
        END as visit_type
      FROM page_engagement pe
      JOIN active_sessions asess ON pe.active_session_id = asess.id
      ORDER BY pe.start_time DESC
      LIMIT ?
    `);
    
    return stmt.all(limit);
  }

  // Get top external links
  getTopExternalLinks(limit: number = 20) {
    const stmt = db.prepare(`
      SELECT 
        domain,
        COUNT(*) as clicks,
        COUNT(DISTINCT session_id) as unique_clickers,
        MAX(timestamp) as last_clicked
      FROM external_links
      GROUP BY domain
      ORDER BY clicks DESC
      LIMIT ?
    `);
    
    return stmt.all(limit);
  }

  // Get external link clicks by page
  getExternalLinksByPage(limit: number = 20) {
    const stmt = db.prepare(`
      SELECT 
        page_path,
        domain,
        COUNT(*) as clicks
      FROM external_links
      GROUP BY page_path, domain
      ORDER BY clicks DESC
      LIMIT ?
    `);
    
    return stmt.all(limit);
  }

  // Get recent external link clicks
  getRecentExternalLinks(limit: number = 20) {
    const stmt = db.prepare(`
      SELECT 
        timestamp,
        url,
        domain,
        page_path,
        click_context
      FROM external_links
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
      
      const columns = Object.keys(rows[0] as Record<string, any>);
      const data = rows.map((row: any) => columns.map(col => row[col]));
      
      return { columns, rows: data };
    } catch (error) {
      throw new Error(`Query error: ${(error as Error).message}`);
    }
  }

  // Get active session analytics
  getActiveSessionStats() {
    const avgSessionDuration = db.prepare(`
      SELECT AVG(total_duration) as avg_duration
      FROM active_sessions
      WHERE is_active = 0 AND total_duration > 0
    `).get() as { avg_duration: number };
    
    const avgPagesPerSession = db.prepare(`
      SELECT AVG(page_count) as avg_pages
      FROM active_sessions
      WHERE page_count > 0
    `).get() as { avg_pages: number };
    
    const topEngagedPages = db.prepare(`
      SELECT 
        page_path,
        COUNT(DISTINCT active_session_id) as unique_sessions,
        SUM(duration) as total_time,
        AVG(duration) as avg_time,
        AVG(scroll_depth) as avg_scroll_depth,
        SUM(interaction_count) as total_interactions
      FROM page_engagement
      WHERE duration > 0
      GROUP BY page_path
      ORDER BY total_time DESC
      LIMIT 10
    `).all();
    
    // Session count by duration buckets
    const sessionsByDuration = db.prepare(`
      SELECT 
        CASE 
          WHEN total_duration < 30 THEN '<30s'
          WHEN total_duration < 60 THEN '30-60s'
          WHEN total_duration < 180 THEN '1-3m'
          WHEN total_duration < 300 THEN '3-5m'
          ELSE '>5m'
        END as duration_bucket,
        COUNT(*) as session_count
      FROM active_sessions
      WHERE is_active = 0
      GROUP BY duration_bucket
      ORDER BY 
        CASE duration_bucket
          WHEN '<30s' THEN 1
          WHEN '30-60s' THEN 2
          WHEN '1-3m' THEN 3
          WHEN '3-5m' THEN 4
          ELSE 5
        END
    `).all();
    
    return {
      avgSessionDuration: Math.round(avgSessionDuration?.avg_duration || 0),
      avgPagesPerSession: Math.round(avgPagesPerSession?.avg_pages || 0),
      topEngagedPages,
      sessionsByDuration
    };
  }

  // Get recent active sessions
  getRecentActiveSessions(limit: number = 20) {
    return db.prepare(`
      SELECT 
        start_time,
        end_time,
        total_duration,
        page_count,
        interaction_count,
        ip_hash
      FROM active_sessions
      ORDER BY start_time DESC
      LIMIT ?
    `).all(limit);
  }

  // Get all stats for the dashboard
  getAllStats() {
    return {
      ...this.getOverviewStats(),
      topPages: this.getTopPages(),
      visitorLocations: this.getVisitorLocations(),
      recentVisits: this.getRecentVisits(),
      topExternalLinks: this.getTopExternalLinks(),
      recentExternalLinks: this.getRecentExternalLinks(10),
      activeSessionStats: this.getActiveSessionStats(),
      recentActiveSessions: this.getRecentActiveSessions(10)
    };
  }
}

export const statsService = new StatsService(); 