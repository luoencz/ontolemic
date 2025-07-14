import { useEffect } from 'react';
import { debounce } from 'lodash'; 

const STATS_HEARTBEAT_URL = "https://home.the-o.space/api/stats/heartbeat";

export function useHeartbeat() {
  useEffect(() => {
    const sendHeartbeat = debounce(async (eventType: string) => {
      try {
        await fetch(`${STATS_HEARTBEAT_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ event_type: eventType }),
          credentials: 'include', 
        });
      } catch (error) {
        console.error('Heartbeat failed:', error);
      }
    }, 1000); 

    sendHeartbeat('page_load');

    const handleScroll = () => sendHeartbeat('scroll');
    const handleClick = () => sendHeartbeat('click');

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  }, []);
} 