import { useState, useEffect } from 'react';
import Page from '../../components/pages/Page';
import { useLiveStats } from '../../hooks/useLiveStats';

function Stats() {
  const { stats, connected, lastUpdate, reconnect } = useLiveStats();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stats) {
      setLoading(false);
      setError(null);
    }
  }, [stats]);

  if (loading) {
    return <Page title="Stats.db" dark className="font-mono text-sm text-gray-500">Loading live stats...</Page>;
  }

  if (error) {
    return <Page title="Stats.db" dark className="font-mono text-sm text-red-400">Error: {error}</Page>;
  }

  return (
    <Page title="Stats.db" dark className="space-y-8">
      <div className="font-mono text-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-gray-500">## LIVE_STATUS</div>
            <div className={`flex items-center space-x-2 ${connected ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>{connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
            </div>
            {!connected && (
              <button onClick={reconnect} className="text-blue-400 hover:text-blue-300">
                RECONNECT
              </button>
            )}
          </div>
          <div className="text-gray-500">
            last_update: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'never'}
          </div>
        </div>
        {stats && (
          <div className="space-y-6">
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-green-400 mb-2">## OVERVIEW</h3>
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <div>Total Visitors: {stats.totalVisitors}</div>
                <div>Total Sessions: {stats.totalSessions}</div>
                <div>Active Sessions: <span className="text-green-400">{stats.activeSessions}</span></div>
                <div>Avg Session Duration: {stats.avgSessionDuration}s</div>
                <div>Avg Actions/Session: {stats.avgActionsPerSession}</div>
              </div>
            </div>
            
            {stats.recentSessions && stats.recentSessions.length > 0 && (
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-green-400 mb-2">## RECENT_SESSIONS</h3>
                <div className="space-y-2 text-gray-300">
                  {stats.recentSessions.map((session: any) => (
                    <div key={session.id} className="border-l-2 border-gray-700 pl-2">
                      <div className="flex justify-between">
                        <span>Session #{session.id}</span>
                        <span className={session.isActive ? 'text-green-400' : 'text-gray-500'}>
                          {session.isActive ? 'ACTIVE' : 'ENDED'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Started: {new Date(session.startTime).toLocaleString()}
                        {session.duration && ` | Duration: ${session.duration}s`}
                        {` | Actions: ${session.actionCount}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <details className="bg-gray-900 p-4 rounded-lg">
              <summary className="text-green-400 cursor-pointer">## RAW_DATA</summary>
              <pre className="text-gray-300 mt-2 overflow-auto">
                {JSON.stringify(stats, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </Page>
  );
}

export default Stats; 