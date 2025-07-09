import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPages, SearchResult } from '../utils/searchIndex';
import { getSearchablePages } from '../utils/pageRegistry';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Search({ isOpen, onClose }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length >= 2) {
      const pages = getSearchablePages();
      const searchResults = searchPages(query, pages);
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : results.length - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < results.length - 1 ? prev + 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          navigateToResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const navigateToResult = (result: SearchResult) => {
    // Store the search term in session storage for highlighting
    sessionStorage.setItem('searchTerm', query);
    sessionStorage.setItem('searchIndex', result.index.toString());
    
    navigate(result.pagePath);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search across all pages..."
            className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        
        {results.length > 0 && (
          <div className="flex-1 overflow-y-auto">
            {results.map((result, index) => (
              <button
                key={`${result.pagePath}-${result.index}`}
                onClick={() => navigateToResult(result)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 ${
                  index === selectedIndex ? 'bg-gray-100' : ''
                }`}
              >
                <div className="font-medium text-sm text-gray-600">
                  {result.pageTitle}
                </div>
                <div className="text-sm text-gray-800 mt-1">
                  ...{highlightMatch(result.context, query)}...
                </div>
              </button>
            ))}
          </div>
        )}
        
        {query.length >= 2 && results.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No results found for "{query}"
          </div>
        )}
        
        <div className="p-4 border-t text-sm text-gray-500">
          <span className="mr-4">↑↓ Navigate</span>
          <span className="mr-4">Enter Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}

function highlightMatch(text: string, query: string): JSX.Element {
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-300">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
} 