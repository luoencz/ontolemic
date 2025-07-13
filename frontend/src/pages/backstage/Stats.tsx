import { useState, useEffect } from 'react';
import Page from '../../components/pages/Page';

const STATS_API_URL = 'https://home.the-o.space/stats';

interface StatsData {
  totalVisits: number;
  totalPageViews: number;
  uniqueVisitors: number;
  lastUpdate: string;
  topPages: Array<{ path: string; visits: number; percentage: number }>;
  visitorLocations: Array<{ country: string; city?: string; visits: number }>;
  recentVisits: Array<{ timestamp: string; path: string; referrer?: string }>;
  topExternalLinks: Array<{ domain: string; clicks: number; unique_clickers: number; last_clicked: string }>;
  recentExternalLinks: Array<{ timestamp: string; url: string; domain: string; page_path: string; click_context?: string }>;
  activeSessionStats?: {
    avgSessionDuration: number;
    avgPagesPerSession: number;
    topEngagedPages: Array<{
      page_path: string;
      unique_sessions: number;
      total_time: number;
      avg_time: number;
      avg_scroll_depth: number;
      total_interactions: number;
    }>;
    sessionsByDuration: Array<{
      duration_bucket: string;
      session_count: number;
    }>;
  };
  recentActiveSessions?: Array<{
    start_time: string;
    end_time: string;
    total_duration: number;
    page_count: number;
    interaction_count: number;
    ip_hash: string;
  }>;
}

function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState('');
  const [queryResults, setQueryResults] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${STATS_API_URL}/api/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${STATS_API_URL}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: customQuery })
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Query failed');
        return;
      }
      
      const results = await response.json();
      setQueryResults(results);
    } catch (err) {
      alert('Query error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (loading) {
    return <Page title="Stats.db" dark className="font-mono text-sm text-gray-500">Loading...</Page>;
  }

  if (error) {
    return <Page title="Stats.db" dark className="font-mono text-sm text-red-400">Error: {error}</Page>;
  }

  if (!stats) {
    return <Page title="Stats.db" dark className="font-mono text-sm text-gray-500">No data available</Page>;
  }

  return (
    <Page title="Stats.db" dark className="space-y-8">
      {/* Raw stats dump */}
      <div className="font-mono text-sm text-gray-300 space-y-6">
        {/* Overview */}
        <div>
          <div className="text-gray-500 mb-2">## OVERVIEW</div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            <div>total_visits</div><div>{stats.totalVisits}</div>
            <div>total_page_views</div><div>{stats.totalPageViews}</div>
            <div>unique_visitors</div><div>{stats.uniqueVisitors}</div>
            <div>last_update</div><div>{stats.lastUpdate}</div>
          </div>
        </div>

        {/* Top Pages */}
        <div>
          <div className="text-gray-500 mb-2">## TOP_PAGES</div>
          <div className="space-y-1">
            {stats.topPages.map((page) => (
              <div key={page.path} className="grid grid-cols-3 gap-x-8">
                <div>{page.path}</div>
                <div>{page.visits}</div>
                <div>{page.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div>
          <div className="text-gray-500 mb-2">## VISITOR_LOCATIONS</div>
          <div className="space-y-1">
            {stats.visitorLocations.map((location) => (
              <div key={`${location.country}-${location.city}`} className="grid grid-cols-3 gap-x-8">
                <div>{location.country}</div>
                <div>{location.city || 'N/A'}</div>
                <div>{location.visits}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Visits */}
        <div>
          <div className="text-gray-500 mb-2">## RECENT_VISITS</div>
          <div className="space-y-1">
            {stats.recentVisits.map((visit, index) => (
              <div key={index} className="grid grid-cols-3 gap-x-8">
                <div>{visit.timestamp}</div>
                <div>{visit.path}</div>
                <div>{visit.referrer || 'direct'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top External Links */}
        <div>
          <div className="text-gray-500 mb-2">## TOP_EXTERNAL_LINKS</div>
          <div className="space-y-1">
            {stats.topExternalLinks?.map((link) => (
              <div key={link.domain} className="grid grid-cols-4 gap-x-8">
                <div>{link.domain}</div>
                <div>{link.clicks} clicks</div>
                <div>{link.unique_clickers} users</div>
                <div>{link.last_clicked}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent External Link Clicks */}
        <div>
          <div className="text-gray-500 mb-2">## RECENT_EXTERNAL_CLICKS</div>
          <div className="space-y-1">
            {stats.recentExternalLinks?.map((link, index) => (
              <div key={index} className="grid grid-cols-4 gap-x-8">
                <div>{link.timestamp}</div>
                <div className="truncate">{link.domain}</div>
                <div>{link.page_path}</div>
                <div className="truncate">{link.click_context || 'N/A'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Session Overview */}
        {stats.activeSessionStats && (
          <div>
            <div className="text-gray-500 mb-2">## SESSION_ANALYTICS</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-4">
              <div>avg_session_duration</div>
              <div>{stats.activeSessionStats.avgSessionDuration}s</div>
              <div>avg_pages_per_session</div>
              <div>{stats.activeSessionStats.avgPagesPerSession}</div>
            </div>
          </div>
        )}

        {/* Session Duration Distribution */}
        {stats.activeSessionStats?.sessionsByDuration && (
          <div>
            <div className="text-gray-500 mb-2">## SESSION_DURATION_DISTRIBUTION</div>
            <div className="space-y-1">
              {stats.activeSessionStats.sessionsByDuration.map((bucket) => (
                <div key={bucket.duration_bucket} className="grid grid-cols-2 gap-x-8">
                  <div>{bucket.duration_bucket}</div>
                  <div>{bucket.session_count} sessions</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Engaged Pages */}
        {stats.activeSessionStats?.topEngagedPages && (
          <div>
            <div className="text-gray-500 mb-2">## TOP_ENGAGED_PAGES</div>
            <div className="space-y-1">
              {stats.activeSessionStats.topEngagedPages.map((page) => (
                <div key={page.page_path} className="grid grid-cols-5 gap-x-8">
                  <div>{page.page_path}</div>
                  <div>{Math.round(page.total_time / 60)}m total</div>
                  <div>{Math.round(page.avg_time)}s avg</div>
                  <div>{page.avg_scroll_depth}% viewed</div>
                  <div>{page.total_interactions} actions</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Active Sessions */}
        {stats.recentActiveSessions && (
          <div>
            <div className="text-gray-500 mb-2">## RECENT_ACTIVE_SESSIONS</div>
            <div className="space-y-1">
              {stats.recentActiveSessions.map((session, index) => (
                <div key={index} className="grid grid-cols-5 gap-x-8">
                  <div>{session.start_time}</div>
                  <div>{session.total_duration}s</div>
                  <div>{session.page_count} pages</div>
                  <div>{session.interaction_count} actions</div>
                  <div className="text-xs truncate">{session.ip_hash.substring(0, 8)}...</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Query Interface */}
      <div className="border-t border-gray-800 pt-8">
        <div className="text-gray-500 font-mono text-sm mb-4">## QUERY_INTERFACE</div>
        <form onSubmit={handleQuerySubmit} className="space-y-4">
          <textarea
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="SELECT * FROM visits WHERE path LIKE '/projects%' ORDER BY timestamp DESC LIMIT 10"
            className="w-full h-32 p-3 font-mono text-sm bg-gray-900 text-gray-300 border border-gray-700 rounded resize-none focus:outline-none focus:border-gray-600"
          />
          <button
            type="submit"
            className="px-4 py-2 font-mono text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            EXECUTE
          </button>
        </form>

        {queryResults && (
          <div className="mt-6 font-mono text-sm">
            <div className="text-gray-500 mb-2">## QUERY_RESULTS</div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-left">
                    {queryResults.columns.map((col: string) => (
                      <th key={col} className="pr-8 pb-2">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {queryResults.rows.map((row: any[], index: number) => (
                    <tr key={index}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="pr-8 py-1">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Schema */}
      <div className="border-t border-gray-800 pt-8 font-mono text-sm">
        <div className="text-gray-500 mb-4">## DATABASE_SCHEMA</div>
        <pre className="text-gray-400 overflow-x-auto">
{`CREATE TABLE visits (
  id INTEGER PRIMARY KEY,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  country TEXT,
  city TEXT,
  session_id TEXT
);

CREATE TABLE pages (
  path TEXT PRIMARY KEY,
  title TEXT,
  first_visit DATETIME,
  last_visit DATETIME,
  total_visits INTEGER DEFAULT 0
);

CREATE TABLE external_links (
  id INTEGER PRIMARY KEY,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  page_path TEXT NOT NULL,
  session_id TEXT,
  ip_hash TEXT,
  click_context TEXT
);

CREATE TABLE active_sessions (
  id INTEGER PRIMARY KEY,
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

CREATE TABLE page_engagement (
  id INTEGER PRIMARY KEY,
  active_session_id INTEGER NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_time DATETIME,
  duration INTEGER DEFAULT 0,
  interaction_count INTEGER DEFAULT 0,
  scroll_depth INTEGER DEFAULT 0,
  FOREIGN KEY (active_session_id) REFERENCES active_sessions(id)
);`}
        </pre>
      </div>
    </Page>
  );
}

export default Stats; 