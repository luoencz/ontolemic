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
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery(''); // Clear query when opening
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



  // Restore focus to document body when closing
  const handleClose = () => {
    // Return focus to document body to re-enable keyboard navigation
    document.body.focus();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (results.length > 0) {
          setSelectedIndex(prev => prev > 0 ? prev - 1 : results.length - 1);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (results.length > 0) {
          setSelectedIndex(prev => prev < results.length - 1 ? prev + 1 : 0);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          navigateToResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
    }
  };

  const navigateToResult = (result: SearchResult) => {
    // Store the search term in session storage for highlighting
    sessionStorage.setItem('searchTerm', query);
    sessionStorage.setItem('searchIndex', result.index.toString());
    
    navigate(result.pagePath);
    handleClose();
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-start justify-center pt-32 p-4 transition-all duration-200 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
      }}
      onClick={handleClose}
    >
      <div 
        ref={containerRef}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search pages..."
          className="w-full px-6 py-4 text-base focus:outline-none"
        />
        
        {results.length > 0 && (
          <div className="border-t border-gray-100 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <button
                key={`${result.pagePath}-${result.index}`}
                onClick={() => navigateToResult(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors ${
                  index === selectedIndex ? 'bg-gray-50' : ''
                }`}
              >
                <div className="font-medium text-sm text-gray-500 mb-1">
                  {result.pageTitle}
                </div>
                <div className="text-gray-700 text-sm leading-relaxed">
                  ...{highlightMatch(result.context, query)}...
                </div>
              </button>
            ))}
          </div>
        )}
        
        {query.length >= 2 && results.length === 0 && (
          <div className="px-6 py-4 text-sm text-gray-500 border-t border-gray-100">
            No results found
          </div>
        )}
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
          <mark key={i} className="bg-yellow-200 text-gray-900">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
} 