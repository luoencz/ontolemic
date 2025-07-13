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
      ip_hash TEXT
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

  console.log('Database initialized successfully');
}

// Initialize on module load
initializeDatabase(); 