# Stats Database Design

## Overview

The stats system uses SQLite as the database engine for several reasons:
- **Lightweight**: No server required, perfect for edge deployments
- **Queryable**: Full SQL support for custom queries
- **Portable**: Single file database that can be easily backed up
- **Fast**: Excellent read performance for analytics queries

## Database Schema

### `visits` table
Primary table for tracking individual page visits.

```sql
CREATE TABLE visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,  -- SHA256 hash for privacy
  country TEXT,
  city TEXT,
  session_id TEXT,
  duration INTEGER, -- Time spent on page in seconds
  
  INDEX idx_timestamp (timestamp),
  INDEX idx_path (path),
  INDEX idx_session (session_id)
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