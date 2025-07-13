# Stats Database Design

## Overview

The stats system uses SQLite as the database engine for several reasons:
- **Lightweight**: No server required, perfect for edge deployments
- **Queryable**: Full SQL support for custom queries
- **Portable**: Single file database that can be easily backed up
- **Fast**: Excellent read performance for analytics queries

## Database Schema

### `visits` table
Primary table for tracking website visits (new sessions only, not internal navigation).

```sql
CREATE TABLE visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  path TEXT NOT NULL,              -- Landing page of the visit
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,                    -- SHA256 hash for privacy
  country TEXT,
  city TEXT,
  session_id TEXT,
  duration INTEGER,                -- Time spent on page in seconds
  
  INDEX idx_timestamp (timestamp),
  INDEX idx_path (path),
  INDEX idx_session (session_id)
);
```

### `external_links` table
Tracks clicks on external links to understand where visitors go from your site.

```sql
CREATE TABLE external_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  url TEXT NOT NULL,           -- Full URL clicked
  domain TEXT NOT NULL,        -- Extracted domain for grouping
  page_path TEXT NOT NULL,     -- Which page the link was clicked from
  session_id TEXT,             -- Link to session
  ip_hash TEXT,                -- SHA256 hash for privacy
  click_context TEXT,          -- Link text or title for context
  
  INDEX idx_links_timestamp (timestamp),
  INDEX idx_links_domain (domain),
  INDEX idx_links_page (page_path)
);
```

### `active_sessions` table
Tracks continuous periods of user activity to measure true engagement.

```sql
CREATE TABLE active_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  ip_hash TEXT NOT NULL,              -- Links to visitor location data when needed
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_time DATETIME,
  total_duration INTEGER DEFAULT 0,     -- Total active time in seconds
  page_count INTEGER DEFAULT 0,         -- Pages visited in this session
  interaction_count INTEGER DEFAULT 0,  -- Total interactions
  user_agent TEXT,
  is_active BOOLEAN DEFAULT 1,
  
  INDEX idx_active_sessions_session (session_id),
  INDEX idx_active_sessions_start (start_time),
  INDEX idx_active_sessions_active (is_active),
  INDEX idx_active_sessions_ip (ip_hash)
);
```

### `page_engagement` table
Detailed engagement metrics for each page within active sessions.

```sql
CREATE TABLE page_engagement (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  active_session_id INTEGER NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_time DATETIME,
  duration INTEGER DEFAULT 0,          -- Time spent on page in seconds
  interaction_count INTEGER DEFAULT 0, -- Clicks, scrolls, etc.
  scroll_depth INTEGER DEFAULT 0,      -- Max % of content viewed (0-100)
  
  FOREIGN KEY (active_session_id) REFERENCES active_sessions(id),
  INDEX idx_page_engagement_session (active_session_id),
  INDEX idx_page_engagement_path (page_path)
);
```

### `user_interactions` table
Granular interaction tracking for behavior analysis.

```sql
CREATE TABLE user_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  active_session_id INTEGER NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  interaction_type TEXT NOT NULL,  -- click, scroll, keypress, etc.
  page_path TEXT NOT NULL,
  details TEXT,                    -- JSON details about the interaction
  
  FOREIGN KEY (active_session_id) REFERENCES active_sessions(id),
  INDEX idx_interactions_session (active_session_id),
  INDEX idx_interactions_type (interaction_type)
);
```

### `pages` table
Aggregated statistics per page for fast lookups.

```sql
CREATE TABLE pages (
  path TEXT PRIMARY KEY,
  title TEXT,
  first_visit DATETIME,
  last_visit DATETIME,
  total_visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_duration INTEGER DEFAULT 0
);
```

### `sessions` table
Track user sessions for unique visitor counting.

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,  -- UUID
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  page_count INTEGER DEFAULT 1,
  total_duration INTEGER DEFAULT 0,
  user_agent TEXT,
  ip_hash TEXT
);
```

### `daily_stats` table
Pre-aggregated daily statistics for performance.

```sql
CREATE TABLE daily_stats (
  date DATE,
  path TEXT,
  visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_duration INTEGER DEFAULT 0,
  PRIMARY KEY (date, path)
);
```

## Example Queries

### Most popular pages today
```sql
SELECT path, COUNT(*) as visits 
FROM visits 
WHERE DATE(timestamp) = DATE('now')
GROUP BY path 
ORDER BY visits DESC 
LIMIT 10;
```

### Visitor geography
```sql
SELECT country, city, COUNT(DISTINCT ip_hash) as unique_visitors
FROM visits
WHERE timestamp > datetime('now', '-7 days')
GROUP BY country, city
ORDER BY unique_visitors DESC;
```

### Traffic sources
```sql
SELECT 
  CASE 
    WHEN referrer LIKE '%google%' THEN 'Google'
    WHEN referrer LIKE '%twitter%' THEN 'Twitter'
    WHEN referrer LIKE '%github%' THEN 'GitHub'
    WHEN referrer IS NULL THEN 'Direct'
    ELSE 'Other'
  END as source,
  COUNT(*) as visits
FROM visits
WHERE timestamp > datetime('now', '-30 days')
GROUP BY source
ORDER BY visits DESC;
```

### User flow analysis
```sql
WITH session_paths AS (
  SELECT 
    session_id,
    GROUP_CONCAT(path, ' → ') as flow,
    COUNT(*) as pages_viewed
  FROM visits
  GROUP BY session_id
)
SELECT flow, COUNT(*) as occurrences
FROM session_paths
WHERE pages_viewed > 1
GROUP BY flow
ORDER BY occurrences DESC
LIMIT 20;
```

### External link analysis
```sql
-- Most clicked external domains
SELECT 
  domain,
  COUNT(*) as total_clicks,
  COUNT(DISTINCT session_id) as unique_users
FROM external_links
WHERE timestamp > datetime('now', '-30 days')
GROUP BY domain
ORDER BY total_clicks DESC
LIMIT 10;

-- External links by source page
SELECT 
  page_path,
  domain,
  COUNT(*) as clicks
FROM external_links
GROUP BY page_path, domain
ORDER BY page_path, clicks DESC;

-- Click patterns over time
SELECT 
  DATE(timestamp) as day,
  domain,
  COUNT(*) as daily_clicks
FROM external_links
WHERE timestamp > datetime('now', '-7 days')
GROUP BY day, domain
ORDER BY day DESC, daily_clicks DESC;
```

### Active session analysis
```sql
-- Session duration distribution
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
ORDER BY duration_bucket;

-- Join with location data when needed
SELECT 
  v.country,
  COUNT(DISTINCT s.id) as total_sessions,
  AVG(s.total_duration) as avg_duration,
  AVG(s.page_count) as avg_pages_visited
FROM active_sessions s
JOIN (
  SELECT DISTINCT ip_hash, country 
  FROM visits 
  WHERE country IS NOT NULL
) v ON s.ip_hash = v.ip_hash
WHERE s.is_active = 0
GROUP BY v.country
ORDER BY total_sessions DESC;

-- Most engaging pages
SELECT 
  pe.page_path,
  COUNT(DISTINCT pe.active_session_id) as unique_sessions,
  SUM(pe.duration) / 60.0 as total_minutes,
  AVG(pe.duration) as avg_seconds,
  AVG(pe.scroll_depth) as avg_scroll_depth,
  SUM(pe.interaction_count) as total_interactions
FROM page_engagement pe
JOIN active_sessions s ON pe.active_session_id = s.id
WHERE pe.duration > 5  -- Filter out bounces
GROUP BY pe.page_path
ORDER BY total_minutes DESC;

-- User behavior patterns
SELECT 
  interaction_type,
  COUNT(*) as count,
  COUNT(DISTINCT active_session_id) as unique_sessions
FROM user_interactions
GROUP BY interaction_type
ORDER BY count DESC;

-- Session depth analysis
SELECT 
  page_count,
  COUNT(*) as session_count,
  AVG(total_duration) as avg_duration
FROM active_sessions
WHERE is_active = 0
GROUP BY page_count
ORDER BY page_count;
```

## Privacy Considerations

- IP addresses are hashed using SHA256 before storage
- No personally identifiable information is collected
- Session IDs are random UUIDs with no user tracking
- Data retention policy: 90 days for raw visits, 1 year for aggregated stats

## Implementation Notes

1. **Write Performance**: Use WAL mode for better concurrent writes
2. **Read Performance**: Pre-aggregate common queries into daily_stats
3. **Backup**: Daily backup of the SQLite file to object storage
4. **Access Control**: Read-only access for the public query interface
5. **Query Limits**: 
   - Max execution time: 5 seconds
   - Max result rows: 1000
   - Restricted to SELECT statements only 