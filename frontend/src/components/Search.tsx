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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRefs = useRef<(HTMLLIElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    } else {
      dialogRef.current?.close();
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

  // Auto-scroll to selected item
  useEffect(() => {
    if (results.length > 0 && resultsRefs.current[selectedIndex]) {
      resultsRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedIndex, results.length]);

  const handleClose = () => {
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
        e.stopPropagation();
        handleClose();
        break;
    }
  };

  const navigateToResult = (result: SearchResult) => {
    sessionStorage.setItem('searchTerm', query);
    sessionStorage.setItem('searchIndex', result.index.toString());
    navigate(result.pagePath);
    handleClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="backdrop:bg-black/30 backdrop:backdrop-blur-sm p-0 rounded-2xl shadow-2xl max-w-2xl w-[calc(100%-2rem)] bg-transparent"
      style={{
        margin: '0 auto',
        marginTop: '8rem',
        position: 'fixed',
        top: '0'
      }}
    >
      <form method="dialog" className="contents">
        <article className="bg-white rounded-2xl overflow-hidden">
          <header className="p-0">
            <input
              ref={inputRef}
              name="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search pages..."
              className="w-full px-6 py-4 text-base bg-white focus:outline-none focus:ring-0 focus:border-transparent"
              style={{
                outline: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
              autoComplete="off"
            />
          </header>
          
          {(results.length > 0 || (query.length >= 2 && results.length === 0)) && (
            <hr className="border-gray-100" />
          )}
          
          <section>
            {results.length > 0 && (
              <nav aria-label="Search results">
                <ul 
                  className="list-none m-0 p-0 overflow-y-auto"
                  style={{ maxHeight: '24rem' }}
                >
                  {results.map((result, index) => (
                    <li
                      key={`${result.pagePath}-${result.index}`}
                      ref={(el) => resultsRefs.current[index] = el}
                      className="m-0 p-0"
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToResult(result);
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`
                          block relative px-6 py-3 no-underline transition-colors
                          ${index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}
                          ${index !== 0 ? 'border-t border-gray-100' : ''}
                        `}
                      >
                        {index === selectedIndex && (
                          <span className="absolute inset-y-0 left-0 w-1 bg-black" aria-hidden="true" />
                        )}
                        
                        <div className="font-medium text-sm text-gray-500 mb-1">
                          {result.pageTitle}
                        </div>
                        <div className="text-gray-700 text-sm leading-relaxed">
                          ...{highlightMatch(result.context, query)}...
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            
            {query.length >= 2 && results.length === 0 && (
              <p className="px-6 py-4 text-sm text-gray-500 m-0">
                No results found
              </p>
            )}
          </section>
        </article>
      </form>
    </dialog>
  );
}

function highlightMatch(text: string, query: string): JSX.Element {
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-gray-900 font-medium">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
} 