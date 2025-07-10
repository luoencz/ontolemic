import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPages, SearchResult } from '../utils/searchIndex';
import { getSearchablePages } from '../utils/pageRegistry';
import { useDispatch } from 'react-redux';
import { unlockBackstage } from '../store/slices/uiSlice';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Search({ isOpen, onClose }: SearchProps) {
  const [query, setQuery] = useState('');
  const [displayQuery, setDisplayQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isScrambling, setIsScrambling] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scrambleInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setDisplayQuery('');
      setResults([]);
      setSelectedIndex(0);
      setIsScrambling(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length >= 2) {
      // Easter egg: Check for "Backstage" input
      if (query.toLowerCase() === 'backstage') {
        setIsScrambling(true);
        setResults([{
          pagePath: '/backstage-unlock',
          pageTitle: '???',
          text: '???',
          context: '???',
          index: 0
        }]);
        setSelectedIndex(0);
        
        // Start scrambling effect
        const symbols = '!@#$%^&*()_+-={}[]|:;<>?,./~`';
        let scrambleCount = 0;
        
        scrambleInterval.current = setInterval(() => {
          const scrambled = query.split('').map(() => 
            symbols[Math.floor(Math.random() * symbols.length)]
          ).join('');
          setDisplayQuery(scrambled);
          
          scrambleCount++;
          if (scrambleCount > 20) {
            clearInterval(scrambleInterval.current!);
            setDisplayQuery('§̸̈́ͅẗ̴̰́ä̸͇́ĝ̶̱ë̵͇́');
          }
        }, 50);
        
        return;
      }
      
      setIsScrambling(false);
      if (scrambleInterval.current) {
        clearInterval(scrambleInterval.current);
      }
      
      const pages = getSearchablePages();
      const searchResults = searchPages(query, pages);
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
      setIsScrambling(false);
      if (scrambleInterval.current) {
        clearInterval(scrambleInterval.current);
      }
    }
    
    return () => {
      if (scrambleInterval.current) {
        clearInterval(scrambleInterval.current);
      }
    };
  }, [query]);

  // Update display query when not scrambling
  useEffect(() => {
    if (!isScrambling) {
      setDisplayQuery(query);
    }
  }, [query, isScrambling]);

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
        handleClose();
        break;
    }
  };

  const navigateToResult = (result: SearchResult) => {
    if (result.pagePath === '/backstage-unlock') {
      // Unlock backstage
      dispatch(unlockBackstage());
      localStorage.setItem('backstageUnlocked', 'true');
      handleClose();
      // Show a subtle indication that something happened
      setTimeout(() => {
        navigate('/backstage/quotes');
      }, 100);
      return;
    }
    
    sessionStorage.setItem('searchTerm', query);
    sessionStorage.setItem('searchIndex', result.index.toString());
    navigate(result.pagePath);
    handleClose();
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-start justify-center pt-20 lg:pt-32 p-4 transition-all duration-200 ${
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
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-2 lg:mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="search"
          value={displayQuery}
          onChange={(e) => {
            const newValue = e.target.value;
            setQuery(newValue);
            if (!isScrambling) {
              setDisplayQuery(newValue);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Input ..."
          className={`w-full px-6 py-4 text-base focus:outline-none focus:ring-0 focus:border-transparent ${
            isScrambling ? 'font-mono' : ''
          }`}
          style={{
            outline: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none'
          }}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          data-bwignore="true"
          data-form-type="other"
        />
        
        {(results.length > 0 || (query.length >= 2 && results.length === 0)) && (
          <div className="border-t border-gray-100" />
        )}
        
        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={`${result.pagePath}-${result.index}`}
                ref={(el) => resultsRefs.current[index] = el}
                onClick={() => navigateToResult(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`relative px-6 py-3 cursor-pointer transition-colors ${
                  index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                } ${index !== 0 ? 'border-t border-gray-100' : ''}`}
              >
                {index === selectedIndex && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-black" />
                )}
                <div className={`font-medium text-sm ${
                  result.pagePath === '/backstage-unlock' ? 'text-gray-800' : 'text-gray-500'
                } mb-1`}>
                  {result.pageTitle}
                </div>
                <div className={`text-sm leading-relaxed ${
                  result.pagePath === '/backstage-unlock' ? 'text-gray-600 font-mono' : 'text-gray-700'
                }`}>
                  {result.pagePath === '/backstage-unlock' 
                    ? result.context 
                    : (
                      <>
                        <span>...</span>
                        {highlightMatch(result.context, query)}
                        <span>...</span>
                      </>
                    )
                  }
                </div>
              </div>
            ))}
          </div>
        )}
        
        {query.length >= 2 && results.length === 0 && !isScrambling && (
          <div className="px-6 py-4 text-sm text-gray-500">
            No results found
          </div>
        )}
      </div>
    </div>
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