import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// TODO: Make this configurable via environment variables
const STATS_API_URL = 'http://localhost:3001';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        // Get page title
        const title = document.title;

        // Send tracking request
        await fetch(`${STATS_API_URL}/api/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for session tracking
          body: JSON.stringify({
            path: location.pathname,
            title: title
          })
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.debug('Tracking error:', error);
      }
    };

    // Track after a small delay to ensure title is set
    const timer = setTimeout(trackPageView, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);
} 