import { useState } from 'react';
import Page from '../../components/pages/Page';
import { ChartBarIcon, GlobeAltIcon, ClockIcon, LinkIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

interface StatsData {
  totalVisits: number;
  uniqueVisitors: number;
  lastUpdate: string;
  topPages: Array<{ path: string; visits: number; percentage: number }>;
  visitorLocations: Array<{ country: string; city?: string; visits: number }>;
  recentVisits: Array<{ timestamp: string; path: string; referrer?: string }>;
}

// Mock data for now - will be replaced with real API calls
const mockStats: StatsData = {
  totalVisits: 1234,
  uniqueVisitors: 567,
  lastUpdate: new Date().toISOString(),
  topPages: [
    { path: '/about', visits: 345, percentage: 28 },
    { path: '/projects/cue', visits: 234, percentage: 19 },
    { path: '/blog', visits: 189, percentage: 15 },
    { path: '/research', visits: 156, percentage: 13 },
    { path: '/contact', visits: 123, percentage: 10 },
  ],
  visitorLocations: [
    { country: 'United States', city: 'San Francisco', visits: 234 },
    { country: 'United Kingdom', city: 'London', visits: 189 },
    { country: 'Germany', city: 'Berlin', visits: 156 },
    { country: 'Japan', city: 'Tokyo', visits: 123 },
    { country: 'Australia', city: 'Sydney', visits: 89 },
  ],
  recentVisits: [
    { timestamp: '2024-01-13T10:30:00Z', path: '/about', referrer: 'google.com' },
    { timestamp: '2024-01-13T10:25:00Z', path: '/projects/cue' },
    { timestamp: '2024-01-13T10:20:00Z', path: '/blog', referrer: 'twitter.com' },
  ],
};

function Stats() {
  const [customQuery, setCustomQuery] = useState('');
  const [queryResults, setQueryResults] = useState<any>(null);
  const [showQueryEditor, setShowQueryEditor] = useState(false);

  const handleQuerySubmit = () => {
    // TODO: Implement actual SQL query execution
    console.log('Executing query:', customQuery);
    // For now, just show a placeholder result
    setQueryResults({
      columns: ['path', 'visits'],
      rows: [
        ['/about', 345],
        ['/projects/cue', 234],
      ],
    });
  };

  return (
    <Page title="Stats.db" className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Visits</p>
              <p className="text-2xl font-bold">{mockStats.totalVisits.toLocaleString()}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold">{mockStats.uniqueVisitors.toLocaleString()}</p>
            </div>
            <GlobeAltIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Update</p>
              <p className="text-sm font-mono">{new Date(mockStats.lastUpdate).toLocaleString()}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5" />
          Top Pages
        </h2>
        <div className="space-y-3">
          {mockStats.topPages.map((page, index) => (
            <div key={page.path} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-4">{index + 1}.</span>
                <span className="font-mono text-sm">{page.path}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${page.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{page.visits}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visitor Locations */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GlobeAltIcon className="w-5 h-5" />
          Visitor Locations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockStats.visitorLocations.map((location) => (
            <div key={`${location.country}-${location.city}`} className="flex justify-between">
              <span className="text-sm">
                {location.city ? `${location.city}, ${location.country}` : location.country}
              </span>
              <span className="text-sm text-gray-600">{location.visits}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Query Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CodeBracketIcon className="w-5 h-5" />
            Custom Query
          </h2>
          <button
            onClick={() => setShowQueryEditor(!showQueryEditor)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showQueryEditor ? 'Hide Editor' : 'Show Editor'}
          </button>
        </div>
        
        {showQueryEditor && (
          <div className="space-y-4">
            <textarea
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="SELECT * FROM visits WHERE path LIKE '/projects%' ORDER BY timestamp DESC LIMIT 10"
              className="w-full h-32 p-3 font-mono text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleQuerySubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Execute Query
            </button>
            
            {queryResults && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {queryResults.columns.map((col: string) => (
                        <th key={col} className="text-left py-2 px-4 font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResults.rows.map((row: any[], index: number) => (
                      <tr key={index} className="border-b">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="py-2 px-4">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Database Schema Info */}
      <div className="text-sm text-gray-600 space-y-2">
        <p className="font-semibold">Database Schema:</p>
        <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
{`-- visits table
CREATE TABLE visits (
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

-- pages table  
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