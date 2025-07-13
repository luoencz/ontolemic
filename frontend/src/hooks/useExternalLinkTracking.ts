import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const STATS_API_URL = 'https://home.the-o.space/stats';

export function useExternalLinkTracking() {
  const location = useLocation();

  useEffect(() => {
    const handleLinkClick = async (event: MouseEvent) => {
      // Get the clicked element
      let target = event.target as HTMLElement;
      
      // Traverse up to find the anchor element
      while (target && target.tagName !== 'A') {
        target = target.parentElement as HTMLElement;
        if (!target) return;
      }
      
      const anchor = target as HTMLAnchorElement;
      const href = anchor.href;
      
      // Check if it's an external link
      if (!href) return;
      
      try {
        const url = new URL(href);
        const currentHost = window.location.hostname;
        
        // Skip if it's an internal link or mailto/tel
        if (url.hostname === currentHost || 
            url.protocol === 'mailto:' || 
            url.protocol === 'tel:') {
          return;
        }
        
        // Track the external link click
        const context = anchor.textContent || anchor.title || 'No text';
        
        // Send tracking request (don't await to avoid delaying navigation)
        fetch(`${STATS_API_URL}/api/track-link`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            url: href,
            pagePath: location.pathname,
            context: context.substring(0, 100) // Limit context length
          })
        }).catch(error => {
          // Silently fail
          console.debug('Link tracking error:', error);
        });
        
      } catch (error) {
        // Invalid URL or tracking error
        console.debug('Link tracking error:', error);
      }
    };

    // Add click listener
    document.addEventListener('click', handleLinkClick, true);
    
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [location.pathname]);
} 