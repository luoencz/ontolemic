import { useState, useEffect } from 'react';
import Page from '../../components/pages/Page';

const STATS_API_URL = 'https://home.the-o.space/stats';

interface StatsData {
  totalVisits: number;
  uniqueVisitors: number;
  lastUpdate: string;
  topPages: Array<{ path: string; visits: number; percentage: number }>;
  visitorLocations: Array<{ country: string; city?: string; visits: number }>;
  recentVisits: Array<{ timestamp: string; path: string; referrer?: string }>;
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
);`}
        </pre>
      </div>
    </Page>
  );
}

export default Stats; 