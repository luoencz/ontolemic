import { ReactNode, useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRandomQuote } from '../hooks/useRandomQuote';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const { quote, loading } = useRandomQuote();

  const navItems = [
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog and Research' },
    { path: '/projects', label: 'Projects', isDropdown: true },
    { path: '/contact', label: 'Contact' },
  ];

  const projectItems = [
    { path: '/projects', label: 'All Projects' },
    { path: '/projects/web-dev', label: 'Web Development' },
    { path: '/projects/ai-ml', label: 'AI & Machine Learning' },
    { path: '/projects/open-source', label: 'Open Source' },
    { path: '/projects/research', label: 'Research Papers' },
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.target !== document.body) return; // Only handle when no input is focused

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => {
          const newIndex = prev <= 0 ? navItems.length - 1 : prev - 1;
          return newIndex;
        });
        break;

      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => {
          const newIndex = prev >= navItems.length - 1 ? 0 : prev + 1;
          return newIndex;
        });
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (focusedIndex === 2 && navItems[2].isDropdown) { // Projects index
          setProjectsOpen(true);
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (focusedIndex === 2 && navItems[2].isDropdown) { // Projects index
          setProjectsOpen(false);
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < navItems.length) {
          const item = navItems[focusedIndex];
          if (item.isDropdown) {
            setProjectsOpen(!projectsOpen);
          } else {
            navigate(item.path);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        setProjectsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  }, [focusedIndex, navItems.length, projectsOpen, navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Set initial focus to current page
  useEffect(() => {
    const currentIndex = navItems.findIndex(item => 
      item.path === location.pathname || 
      (item.isDropdown && location.pathname.startsWith('/projects'))
    );
    if (currentIndex !== -1) {
      setFocusedIndex(currentIndex);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 p-8">
        <Link to="/" className="text-2xl font-normal hover:underline">
          Inner Cosmos
        </Link>
        
        <p className="text-sm text-gray-600 mt-2 mb-8">
          {loading ? 'this, too, is it' : quote}
        </p>

        {/* Keyboard navigation hint */}
        <div className="text-xs text-gray-400 mb-4 p-2 border border-gray-200 rounded">
          <div>Navigate: ↑↓ arrows</div>
          <div>Projects: → open, ← close</div>
          <div>Select: Enter</div>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ path, label, isDropdown }, index) => (
            <div key={path}>
              {isDropdown ? (
                <div className="relative">
                  <button
                    onClick={() => setProjectsOpen(!projectsOpen)}
                    className={`flex items-center justify-between w-full py-1 text-sm hover:underline text-left select-none focus:outline-none focus:ring-0 focus:border-none active:outline-none active:ring-0 active:border-none ${
                      location.pathname.startsWith('/projects') ? 'font-bold' : ''
                    } ${
                      focusedIndex === index ? 'bg-gray-100 px-2 -mx-2 rounded' : ''
                    }`}
                    style={{ 
                      outline: 'none',
                      border: 'none',
                      boxShadow: 'none',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    <span>Projects</span>
                    <svg 
                      className={`w-3 h-3 ml-2 transition-transform duration-200 ${
                        projectsOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {projectsOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {projectItems.map(({ path: projectPath, label: projectLabel }) => (
                        <Link
                          key={projectPath}
                          to={projectPath}
                          className={`block py-1 text-sm hover:underline ${
                            location.pathname === projectPath ? 'font-bold' : 'text-gray-600'
                          }`}
                        >
                          {projectLabel}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={path}
                  className={`block py-1 text-sm hover:underline ${
                    location.pathname === path ? 'font-bold' : ''
                  } ${
                    focusedIndex === index ? 'bg-gray-100 px-2 -mx-2 rounded' : ''
                  }`}
                >
                  {label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default Layout; 