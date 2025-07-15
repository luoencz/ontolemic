import { useState, useEffect } from 'react';
import Page from '../../components/pages/Page';
import { useLiveStats } from '../../hooks/useLiveStats';
import React from 'react';

/**
 * Generate a random hash string for session display using Web Crypto API
 */
async function generateSessionHash(sessionId: number): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`session-${sessionId}-inner-cosmos`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  // Return first 8 characters of the hash
  return hashHex.substring(0, 8);
}

function Stats() {
  const { stats, connected, lastUpdate, reconnect } = useLiveStats();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionHashes, setSessionHashes] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (stats) {
      setLoading(false);
      setError(null);
    }
  }, [stats]);

  // Generate hashes for active sessions
  useEffect(() => {
    const activeSessions = stats?.recentSessions?.filter(session => session.isActive) || [];
    
    activeSessions.forEach(async (session) => {
      if (!sessionHashes.has(session.id)) {
        const hash = await generateSessionHash(session.id);
        setSessionHashes(prev => new Map(prev).set(session.id, hash));
      }
    });
  }, [stats?.recentSessions, sessionHashes]);

  if (loading) {
    return <Page title="Stats.db" dark className="font-mono text-sm text-gray-500">Loading live stats...</Page>;
  }

  if (error) {
    return <Page title="Stats.db" dark className="font-mono text-sm text-red-400">Error: {error}</Page>;
  }

  // Filter only active sessions
  const activeSessions = stats?.recentSessions?.filter(session => session.isActive) || [];

  return (
    <Page title="Stats.db" dark className="space-y-8">
      <div className="font-mono text-sm text-gray-300 space-y-6">
        {/* Live Status */}
        <div>
          <div className="text-gray-500 mb-2">## LIVE_STATUS</div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-1">
            <div>connection</div>
            <div className={connected ? 'text-green-400' : 'text-red-400'}>
              {connected ? 'CONNECTED' : 'DISCONNECTED'}
            </div>
            <div>
              {!connected && (
                <button onClick={reconnect} className="text-blue-400 hover:text-blue-300">
                  RECONNECT
                </button>
              )}
            </div>
            <div>last_update</div>
            <div>{lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'never'}</div>
            <div></div>
          </div>
        </div>

        {stats && (
          <>
            {/* Overview */}
            <div>
              <div className="text-gray-500 mb-2">## OVERVIEW</div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                <div>unique_visitors</div><div>{stats.totalVisitors}</div>
                <div>total_sessions</div><div>{stats.totalSessions}</div>
              </div>
            </div>
            
            {/* Visitor Countries */}
            {stats.visitorCountries && stats.visitorCountries.length > 0 && (
              <div>
                <div className="text-gray-500 mb-2">## VISITOR_COUNTRIES</div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  {stats.visitorCountries.map((loc: any) => (
                    <React.Fragment key={loc.countryCode}>
                      <div>{loc.countryCode}</div>
                      <div>{loc.count}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
            
            {/* Active Sessions */}
            {activeSessions.length > 0 && (
              <div>
                <div className="text-gray-500 mb-2">## ACTIVE_SESSIONS</div>
                <div className="space-y-1">
                  {activeSessions.map((session: any) => (
                    <div key={session.id} className="grid grid-cols-5 gap-x-8">
                      <div>session_{sessionHashes.get(session.id) || 'loading'}</div>
                      <div>{new Date(session.startTime).toLocaleString()}</div>
                      <div>
                        {session.actionCount} actions
                      </div>
                      <div>
                        {session.visitorLocation ? 
                          `${session.visitorLocation.city || 'Unknown'}, ${session.visitorLocation.region || ''}, ${session.visitorLocation.countryCode}` 
                          : 'Unknown'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Page>
  );
}

export default Stats; 