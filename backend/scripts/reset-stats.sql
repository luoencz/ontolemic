-- Reset Statistics Tables
-- This script clears all data from statistics tables while preserving structure

-- Delete in correct order to respect foreign key constraints
DELETE FROM user_interactions;
DELETE FROM page_engagement;
DELETE FROM active_sessions;
DELETE FROM external_links;
DELETE FROM daily_stats;
DELETE FROM visits;
DELETE FROM sessions;
DELETE FROM pages;

-- Reset autoincrement counters
DELETE FROM sqlite_sequence WHERE name IN (
  'visits', 
  'active_sessions', 
  'page_engagement', 
  'user_interactions',
  'external_links'
);

-- Verify tables are empty
SELECT 'active_sessions' as table_name, COUNT(*) as row_count FROM active_sessions
UNION ALL
SELECT 'page_engagement', COUNT(*) FROM page_engagement
UNION ALL
SELECT 'user_interactions', COUNT(*) FROM user_interactions
UNION ALL
SELECT 'external_links', COUNT(*) FROM external_links
UNION ALL
SELECT 'visits', COUNT(*) FROM visits
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions
UNION ALL
SELECT 'pages', COUNT(*) FROM pages
UNION ALL
SELECT 'daily_stats', COUNT(*) FROM daily_stats; 