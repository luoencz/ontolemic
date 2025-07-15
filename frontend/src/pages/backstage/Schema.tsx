import { useState } from 'react';
import Page from '../../components/pages/Page';

function Schema() {
  const [customQuery, setCustomQuery] = useState('SELECT * FROM visitors LIMIT 10');
  const [queryResults, setQueryResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQueryResults(null);
    
    try {
      const response = await fetch('https://home.the-o.space/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: customQuery }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      const data = await response.json();
      setQueryResults({
        columns: data.results.length > 0 ? Object.keys(data.results[0]) : [],
        rows: data.results.map((row: any) => Object.values(row))
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Schema.sql" dark className="space-y-8">
      <div className="font-mono text-sm text-gray-300 space-y-6">
        <div>
          <div className="text-gray-500 mb-2">## DATABASE_SCHEMA</div>
          <pre className="bg-gray-900 text-white rounded p-4 overflow-x-auto text-sm leading-6 border border-gray-800">
{`CREATE TABLE visitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cookie_id TEXT UNIQUE,
  ip_hash TEXT,
  created_at DATETIME,
  last_seen_at DATETIME,
  country_code TEXT,
  region TEXT,
  city TEXT
);

CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id INTEGER,
  start_time DATETIME,
  end_time DATETIME,
  last_heartbeat DATETIME,
  is_active BOOLEAN,
  action_count INTEGER,
  duration REAL,
  FOREIGN KEY (visitor_id) REFERENCES visitors(id)
);`}
          </pre>
        </div>
        
        {/* Query Interface */}
        <div className="border-t border-gray-800 pt-8">
          <div className="text-gray-500 mb-4">## QUERY_INTERFACE</div>
          <form onSubmit={handleQuerySubmit} className="space-y-4">
            <textarea
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="SELECT * FROM visits WHERE path LIKE '/projects%' ORDER BY timestamp DESC LIMIT 10"
              className="w-full h-32 p-3 font-mono text-sm bg-gray-900 text-gray-300 border border-gray-700 rounded resize-none focus:outline-none focus:border-gray-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 font-mono text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'EXECUTING...' : 'EXECUTE'}
            </button>
          </form>
        </div>
        
        {error && (
          <div className="mt-6 font-mono text-sm">
            <div className="text-gray-500 mb-2">## ERROR</div>
            <div className="text-red-400">{error}</div>
          </div>
        )}
        
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
                        <td key={cellIndex} className="pr-8 py-1">{JSON.stringify(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

export default Schema; 