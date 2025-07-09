import { useState, useEffect } from 'react';
import yaml from 'js-yaml';

interface QuotesData {
  quotes: string[];
}

export const useRandomQuote = () => {
  const [quote, setQuote] = useState<string>('this, too, is it');
  const [loading, setLoading] = useState(true);

  const getRandomQuote = async () => {
    try {
      const response = await fetch('/data/quotes.yaml');
      const yamlText = await response.text();
      const data = yaml.load(yamlText) as QuotesData;
      
      if (data.quotes && data.quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.quotes.length);
        setQuote(data.quotes[randomIndex]);
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
      // Keep default quote on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  return { quote, loading, refreshQuote: getRandomQuote };
}; 