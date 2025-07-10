import { useEffect } from 'react';
import Page from '../../components/Page';
import { useCachedContent } from '../../hooks/usePrefetch';
import { CONTENT_KEYS, Quote } from '../../utils/contentFetchers';

function Quotes() {
  const { data: quotes, isLoading, isError, refetch } = useCachedContent<Quote[]>(CONTENT_KEYS.QUOTES);
  
  // If not cached yet, fetch immediately
  useEffect(() => {
    if (!quotes && !isLoading && !isError) {
      refetch();
    }
  }, [quotes, isLoading, isError, refetch]);

  if (isLoading) {
    return (
      <Page dark>
        <p>Loading quotes...</p>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page dark>
        <p className="text-red-400">Error loading quotes</p>
      </Page>
    );
  }
  
  if (!quotes) {
    return (
      <Page dark>
        <p>No quotes available</p>
      </Page>
    );
  }

  return (
    <Page title="Quotes.yaml" dark>
      <div className="space-y-6">
        {quotes.map((quote, index) => (
          <blockquote 
            key={index} 
            className="border-l-2 border-gray-600 pl-6 py-2 italic text-gray-100"
          >
            <p className="mb-2">{quote.text}</p>
            <cite className="text-sm text-gray-400 not-italic">— {quote.author}</cite>
          </blockquote>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800 text-sm text-gray-400">
        <p>Total quotes: {quotes.length}</p>
      </div>
    </Page>
  );
}

export default Quotes; 