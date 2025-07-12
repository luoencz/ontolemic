import { Link, LinkProps } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// Map of route paths to their lazy import functions
const routeModules: Record<string, () => Promise<any>> = {
  '/about': () => import('../pages/About'),
  '/blog': () => import('../pages/Blog'),
  '/contact': () => import('../pages/Contact'),
  '/projects': () => import('../pages/Projects'),
  '/research': () => import('../pages/Research'),
  '/navigation': () => import('../pages/NavigationPage'),
  '/backstage': () => import('../pages/backstage/Backstage'),
  '/backstage/quotes': () => import('../pages/backstage/Quotes'),
  '/projects/cue': () => import('../pages/projects/Cue'),
};

// Cache for already prefetched modules
const prefetchedModules = new Set<string>();

interface PrefetchLinkProps extends LinkProps {
  prefetchOn?: 'hover' | 'visible' | 'mount';
  prefetchDelay?: number;
}

export function PrefetchLink({ 
  to, 
  children, 
  prefetchOn = 'hover',
  prefetchDelay = 50,
  ...props 
}: PrefetchLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const prefetchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const prefetchRoute = async () => {
    const path = typeof to === 'string' ? to : to.pathname || '';
    
    // Skip if already prefetched or no module for this route
    if (prefetchedModules.has(path) || !routeModules[path]) {
      return;
    }

    setIsPrefetching(true);
    try {
      await routeModules[path]();
      prefetchedModules.add(path);
    } catch (error) {
      console.error(`Failed to prefetch route ${path}:`, error);
    } finally {
      setIsPrefetching(false);
    }
  };

  // Prefetch on mount
  useEffect(() => {
    if (prefetchOn === 'mount') {
      prefetchRoute();
    }
  }, [prefetchOn]);

  // Prefetch on visibility using Intersection Observer
  useEffect(() => {
    if (prefetchOn !== 'visible' || !linkRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchTimeoutRef.current = setTimeout(prefetchRoute, prefetchDelay);
          } else {
            if (prefetchTimeoutRef.current) {
              clearTimeout(prefetchTimeoutRef.current);
            }
          }
        });
      },
      { rootMargin: '50px' } // Start prefetching when link is within 50px of viewport
    );

    observer.observe(linkRef.current);

    return () => {
      observer.disconnect();
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, [prefetchOn, prefetchDelay]);

  // Prefetch on hover
  const handleMouseEnter = () => {
    if (prefetchOn === 'hover') {
      prefetchTimeoutRef.current = setTimeout(prefetchRoute, prefetchDelay);
    }
  };

  const handleMouseLeave = () => {
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
    }
  };

  return (
    <Link
      ref={linkRef}
      to={to}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-prefetching={isPrefetching}
      {...props}
    >
      {children}
    </Link>
  );
} 