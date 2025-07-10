import { useEffect, useState } from 'react';
import yaml from 'js-yaml';
import Page from '../../components/Page';

interface Quote {
  text: string;
  author: string;
}

interface QuotesData {
  quotes: Quote[];
}

function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/quotes.yaml')
      .then(response => response.text())
      .then(text => {
        const data = yaml.load(text) as QuotesData;
        setQuotes(data.quotes);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Page dark>
        <p>Loading quotes...</p>
      </Page>
    );
  }

  if (error) {
    return (
      <Page dark>
        <p className="text-red-400">Error loading quotes: {error}</p>
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