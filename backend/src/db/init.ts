import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'stats.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initializeDatabase() {
  // Visits table - raw visit data
  db.exec(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      path TEXT NOT NULL,
      referrer TEXT,
      user_agent TEXT,
      ip_hash TEXT,
      country TEXT,
      city TEXT,
      session_id TEXT,
      duration INTEGER DEFAULT 0
    );
    
    CREATE INDEX IF NOT EXISTS idx_visits_timestamp ON visits(timestamp);
    CREATE INDEX IF NOT EXISTS idx_visits_path ON visits(path);
    CREATE INDEX IF NOT EXISTS idx_visits_session ON visits(session_id);
  `);

  // Pages table - aggregated page statistics
  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      path TEXT PRIMARY KEY,
      title TEXT,
      first_visit DATETIME,
      last_visit DATETIME,
      total_visits INTEGER DEFAULT 0,
      unique_visitors INTEGER DEFAULT 0,
      avg_duration INTEGER DEFAULT 0
    );
  `);

  // Sessions table - for tracking unique visitors
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
      page_count INTEGER DEFAULT 1,
      total_duration INTEGER DEFAULT 0,
      user_agent TEXT,
      ip_hash TEXT,
      country TEXT,
      city TEXT
    );
  `);

  // Daily stats table - pre-aggregated for performance
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_stats (
      date DATE,
      path TEXT,
      visits INTEGER DEFAULT 0,
      unique_visitors INTEGER DEFAULT 0,
      avg_duration INTEGER DEFAULT 0,
      PRIMARY KEY (date, path)
    );
  `);

  // External links table - track outbound clicks
  db.exec(`
    CREATE TABLE IF NOT EXISTS external_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      url TEXT NOT NULL,
      domain TEXT NOT NULL,
      page_path TEXT NOT NULL,
      session_id TEXT,
      ip_hash TEXT,
      click_context TEXT
    );
    
    CREATE INDEX IF NOT EXISTS idx_links_timestamp ON external_links(timestamp);
    CREATE INDEX IF NOT EXISTS idx_links_domain ON external_links(domain);
    CREATE INDEX IF NOT EXISTS idx_links_page ON external_links(page_path);
  `);

  // Active sessions table - track continuous activity periods
  db.exec(`
    CREATE TABLE IF NOT EXISTS active_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      ip_hash TEXT NOT NULL,
      start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      end_time DATETIME,
      total_duration INTEGER DEFAULT 0,
      page_count INTEGER DEFAULT 0,
      interaction_count INTEGER DEFAULT 0,
      user_agent TEXT,
      is_active BOOLEAN DEFAULT 1
    );
    
    CREATE INDEX IF NOT EXISTS idx_active_sessions_session ON active_sessions(session_id);
    CREATE INDEX IF NOT EXISTS idx_active_sessions_start ON active_sessions(start_time);
    CREATE INDEX IF NOT EXISTS idx_active_sessions_active ON active_sessions(is_active);
    CREATE INDEX IF NOT EXISTS idx_active_sessions_ip ON active_sessions(ip_hash);
  `);

  // Page engagement table - track time spent per page in active sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS page_engagement (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      active_session_id INTEGER NOT NULL,
      page_path TEXT NOT NULL,
      page_title TEXT,
      start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      end_time DATETIME,
      duration INTEGER DEFAULT 0,
      interaction_count INTEGER DEFAULT 0,
      scroll_depth INTEGER DEFAULT 0,
      FOREIGN KEY (active_session_id) REFERENCES active_sessions(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_page_engagement_session ON page_engagement(active_session_id);
    CREATE INDEX IF NOT EXISTS idx_page_engagement_path ON page_engagement(page_path);
  `);

  // User interactions table - track specific interactions
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      active_session_id INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      interaction_type TEXT NOT NULL,
      page_path TEXT NOT NULL,
      details TEXT,
      FOREIGN KEY (active_session_id) REFERENCES active_sessions(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_interactions_session ON user_interactions(active_session_id);
    CREATE INDEX IF NOT EXISTS idx_interactions_type ON user_interactions(interaction_type);
  `);

  console.log('Database initialized successfully');
}

// Initialize on module load
initializeDatabase(); 