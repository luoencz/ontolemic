import { useAppSelector } from '../store/hooks';

export function PrefetchIndicator() {
  const { isPrefetching, prefetchQueue } = useAppSelector(state => state.content);
  
  if (!isPrefetching || prefetchQueue.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm opacity-75 transition-opacity">
      <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
      <span>Loading content ({prefetchQueue.length} remaining)</span>
    </div>
  );
} 