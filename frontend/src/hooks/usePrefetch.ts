import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchContent, 
  setPrefetching, 
  removeFromPrefetchQueue,
  addToPrefetchQueue 
} from '../store/slices/contentSlice';
import { contentFetchers, CONTENT_KEYS } from '../utils/contentFetchers';

// Delay before starting prefetch (ms)
const PREFETCH_DELAY = 2000;

// Delay between prefetch requests (ms)
const PREFETCH_INTERVAL = 1000;

export function usePrefetch() {
  const dispatch = useAppDispatch();
  const { prefetchQueue, isPrefetching, cache } = useAppSelector(state => state.content);

  // Initialize prefetch queue on mount
  useEffect(() => {
    // Add all content types to prefetch queue
    const allContentKeys = Object.values(CONTENT_KEYS);
    dispatch(addToPrefetchQueue(allContentKeys));
  }, [dispatch]);

  // Process prefetch queue
  const processPrefetchQueue = useCallback(async () => {
    if (prefetchQueue.length === 0 || isPrefetching) {
      return;
    }

    dispatch(setPrefetching(true));

    // Process queue items one by one with delay
    for (const contentKey of prefetchQueue) {
      // Skip if already cached
      if (cache[contentKey]?.status === 'succeeded') {
        dispatch(removeFromPrefetchQueue(contentKey));
        continue;
      }

      // Get the fetcher for this content type
      const fetcher = contentFetchers[contentKey as keyof typeof contentFetchers];
      if (!fetcher) {
        console.warn(`No fetcher found for content key: ${contentKey}`);
        dispatch(removeFromPrefetchQueue(contentKey));
        continue;
      }

      try {
        // Fetch content
        await dispatch(fetchContent({ key: contentKey, fetcher })).unwrap();
        dispatch(removeFromPrefetchQueue(contentKey));
        
        // Wait before next fetch to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, PREFETCH_INTERVAL));
      } catch (error) {
        console.error(`Failed to prefetch ${contentKey}:`, error);
        dispatch(removeFromPrefetchQueue(contentKey));
      }
    }

    dispatch(setPrefetching(false));
  }, [prefetchQueue, isPrefetching, cache, dispatch]);

  // Start prefetching after initial delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      processPrefetchQueue();
    }, PREFETCH_DELAY);

    return () => clearTimeout(timeoutId);
  }, [processPrefetchQueue]);

  // Return helper functions
  return {
    isPrefetching,
    prefetchQueue,
    cache,
  };
}

// Hook to use cached content
export function useCachedContent<T>(contentKey: string) {
  const dispatch = useAppDispatch();
  const cached = useAppSelector(state => state.content.cache[contentKey]);

  const refetch = useCallback(async () => {
    if (contentKey in contentFetchers) {
      const fetcher = contentFetchers[contentKey as keyof typeof contentFetchers];
      return dispatch(fetchContent({ key: contentKey, fetcher })).unwrap();
    }
    throw new Error(`No fetcher found for content key: ${contentKey}`);
  }, [contentKey, dispatch]);

  return {
    data: cached?.data as T | undefined,
    isLoading: cached?.status === 'loading',
    isError: cached?.status === 'failed',
    isSuccess: cached?.status === 'succeeded',
    timestamp: cached?.timestamp,
    refetch,
  };
} 