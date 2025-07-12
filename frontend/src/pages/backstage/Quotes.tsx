import { useEffect, useState } from 'react';
import Page from '../../components/Page';
import { Quote, fetchQuotesData } from '../../utils/contentFetchers';

function Quotes() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        setIsLoading(true);
        const data = await fetchQuotesData();
        setQuotes(data);
      } catch (err) {
        setError('Failed to load quotes');
        console.error('Error loading quotes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuotes();
  }, []);

  if (isLoading) {
    return (
      <Page dark>
        <p>Loading quotes...</p>
      </Page>
    );
  }

  if (error) {
    return (
      <Page dark>
        <p className="text-red-400">{error}</p>
      </Page>
    );
  }
  
  if (!quotes || quotes.length === 0) {
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