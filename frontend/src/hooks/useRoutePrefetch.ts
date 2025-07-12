import { useEffect, useState, useCallback } from 'react';

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

interface UseRoutePrefetchOptions {
  // Start prefetching immediately on mount
  immediate?: boolean;
  // Delay before starting prefetch (ms)
  delay?: number;
  // Delay between prefetch requests (ms)
  interval?: number;
  // Routes to prefetch (defaults to all routes)
  routes?: string[];
  // Prefetch strategy
  strategy?: 'sequential' | 'parallel' | 'idle';
}

export function useRoutePrefetch(options: UseRoutePrefetchOptions = {}) {
  const {
    immediate = false,
    delay = 2000,
    interval = 100,
    routes = Object.keys(routeModules),
    strategy = 'sequential'
  } = options;

  const [isPrefetching, setIsPrefetching] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: routes.length });

  const prefetchRoute = async (route: string) => {
    if (prefetchedModules.has(route) || !routeModules[route]) {
      return;
    }

    try {
      await routeModules[route]();
      prefetchedModules.add(route);
      return true;
    } catch (error) {
      console.error(`Failed to prefetch route ${route}:`, error);
      return false;
    }
  };

  const prefetchSequential = async () => {
    setIsPrefetching(true);
    let completed = 0;

    for (const route of routes) {
      if (!prefetchedModules.has(route)) {
        await prefetchRoute(route);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
      completed++;
      setProgress({ current: completed, total: routes.length });
    }

    setIsPrefetching(false);
  };

  const prefetchParallel = async () => {
    setIsPrefetching(true);
    
    const unprefetchedRoutes = routes.filter(route => !prefetchedModules.has(route));
    await Promise.all(unprefetchedRoutes.map(route => prefetchRoute(route)));
    
    setProgress({ current: routes.length, total: routes.length });
    setIsPrefetching(false);
  };

  const prefetchIdle = async () => {
    if (!('requestIdleCallback' in window)) {
      // Fallback to sequential for browsers that don't support requestIdleCallback
      return prefetchSequential();
    }

    setIsPrefetching(true);
    let completed = 0;

    for (const route of routes) {
      if (prefetchedModules.has(route)) {
        completed++;
        continue;
      }

      await new Promise<void>(resolve => {
        window.requestIdleCallback(async () => {
          await prefetchRoute(route);
          completed++;
          setProgress({ current: completed, total: routes.length });
          resolve();
        }, { timeout: 5000 });
      });

      await new Promise(resolve => setTimeout(resolve, interval));
    }

    setIsPrefetching(false);
  };

  const startPrefetching = useCallback(async () => {
    if (isPrefetching) return;

    switch (strategy) {
      case 'parallel':
        await prefetchParallel();
        break;
      case 'idle':
        await prefetchIdle();
        break;
      case 'sequential':
      default:
        await prefetchSequential();
        break;
    }
  }, [strategy, routes, interval, isPrefetching]);

  // Auto-start prefetching if immediate is true
  useEffect(() => {
    if (immediate) {
      const timeoutId = setTimeout(startPrefetching, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [immediate, delay, startPrefetching]);

  return {
    startPrefetching,
    isPrefetching,
    progress,
    prefetchedCount: prefetchedModules.size,
  };
} 