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
  const [focusedProjectIndex, setFocusedProjectIndex] = useState(-1);
  const [showControls, setShowControls] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [focusArea, setFocusArea] = useState<'sidebar' | 'main'>('sidebar'); // Track which area has focus
  const [mainFocusedIndex, setMainFocusedIndex] = useState(-1); // Track focused element in main area
  const { quote, loading } = useRandomQuote();

  const navItems = [
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog and Research' },
    { path: '/projects', label: 'Projects', isDropdown: true },
    { path: '/contact', label: 'Contact' },
  ];

  const projectItems = [
    { path: '/projects/web-dev', label: 'Web Development' },
    { path: '/projects/ai-ml', label: 'AI & Machine Learning' },
    { path: '/projects/open-source', label: 'Open Source' },
    { path: '/projects/research', label: 'Research Papers' },
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.target !== document.body) return; // Only handle when no input is focused

    // Handle Tab key to switch focus areas
    if (event.key === 'Tab') {
      event.preventDefault();
      
      // Check if main area has focusable elements before switching
      if (focusArea === 'sidebar') {
        const mainElement = document.querySelector('main');
        if (mainElement) {
          const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
          if (focusableElements.length > 0) {
            setFocusArea('main');
          }
          // If no focusable elements, stay in sidebar
        }
      } else {
        // Always allow switching back to sidebar
        setFocusArea('sidebar');
      }
      
      // Don't reset focus indices - remember position when switching back
      return;
    }

    // Handle modal shortcuts with Command/Ctrl key
    if ((event.metaKey || event.ctrlKey) && !showControls && !showSettings) {
      switch (event.key.toLowerCase()) {
        case 's':
          event.preventDefault();
          setShowSettings(true);
          return;
        
        case 'm':
          event.preventDefault();
          setSoundEnabled(prev => !prev);
          return;
        
        case '/': // Handle both / and ? (Shift+/)
        case '?':
          event.preventDefault();
          setShowControls(true);
          return;
          
        case 'e':
          event.preventDefault();
          setSidebarVisible(prev => !prev);
          return;
      }
    }

    // Handle ESC to close modals
    if (event.key === 'Escape') {
      event.preventDefault();
      if (showControls || showSettings) {
        setShowControls(false);
        setShowSettings(false);
        return;
      }
      // Original ESC behavior when no modals are open
      setProjectsOpen(false);
      setFocusedIndex(-1);
      setFocusedProjectIndex(-1);
      return;
    }

    // Don't process navigation keys when modals are open
    if (showControls || showSettings) return;

    // Handle navigation based on focus area
    if (focusArea === 'main') {
      // Navigation in main content area
      const mainElement = document.querySelector('main');
      if (!mainElement) return;
      
      const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      const focusableArray = Array.from(focusableElements);
      
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          if (focusableArray.length > 0) {
            if (mainFocusedIndex <= 0) {
              setMainFocusedIndex(focusableArray.length - 1);
            } else {
              setMainFocusedIndex(mainFocusedIndex - 1);
            }
          }
          break;
          
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          if (focusableArray.length > 0) {
            if (mainFocusedIndex >= focusableArray.length - 1) {
              setMainFocusedIndex(0);
            } else {
              setMainFocusedIndex(mainFocusedIndex + 1);
            }
          }
          break;
          
        case 'Enter':
          event.preventDefault();
          if (mainFocusedIndex >= 0 && mainFocusedIndex < focusableArray.length) {
            const element = focusableArray[mainFocusedIndex] as HTMLElement;
            element.click();
          }
          break;
      }
      return;
    }

    // Only process navigation keys if focus is on sidebar
    if (focusArea !== 'sidebar') return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (projectsOpen && focusedIndex === 2 && focusedProjectIndex >= 0) {
          // Navigate within project items
          if (focusedProjectIndex === 0) {
            // At first project item, go back to Projects button
            setFocusedProjectIndex(-1);
          } else {
            // Move up within project items
            setFocusedProjectIndex(prev => prev - 1);
          }
        } else if (focusedIndex === 3) {
          // At Contact, check if projects are open
          if (projectsOpen) {
            // Jump to last project item
            setFocusedIndex(2); // Projects index
            setFocusedProjectIndex(projectItems.length - 1);
          } else {
            // Projects closed, go to Projects button
            setFocusedIndex(2);
          }
        } else {
          // Navigate main nav items
          setFocusedProjectIndex(-1);
          setFocusedIndex(prev => {
            const newIndex = prev <= 0 ? navItems.length - 1 : prev - 1;
            return newIndex;
          });
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (projectsOpen && focusedIndex === 2 && focusedProjectIndex >= 0) {
          // Navigate within project items
          if (focusedProjectIndex === projectItems.length - 1) {
            // At last project item, move to Contact (next main nav item)
            setFocusedProjectIndex(-1);
            setFocusedIndex(3); // Contact index
          } else {
            // Move down within project items
            setFocusedProjectIndex(prev => prev + 1);
          }
        } else if (projectsOpen && focusedIndex === 2 && focusedProjectIndex === -1) {
          // Move into project items from Projects button
          setFocusedProjectIndex(0);
        } else {
          // Navigate main nav items
          setFocusedProjectIndex(-1);
          setFocusedIndex(prev => {
            const newIndex = prev >= navItems.length - 1 ? 0 : prev + 1;
            return newIndex;
          });
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (focusedIndex === 2 && navItems[2].isDropdown) { // Projects index
          setProjectsOpen(true);
          if (!projectsOpen) {
            setFocusedProjectIndex(0); // Focus first project item when opening
          }
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (focusedIndex === 2 && navItems[2].isDropdown) { // Projects index
          setProjectsOpen(false);
          setFocusedProjectIndex(-1);
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (focusedProjectIndex >= 0 && projectsOpen) {
          // Navigate to selected project item
          const projectItem = projectItems[focusedProjectIndex];
          navigate(projectItem.path);
        } else if (focusedIndex >= 0 && focusedIndex < navItems.length) {
          const item = navItems[focusedIndex];
          // Always navigate, even for dropdown items
          navigate(item.path);
        }
        break;
    }
  }, [focusedIndex, focusedProjectIndex, navItems.length, projectItems.length, projectsOpen, navigate, showControls, showSettings, focusArea, mainFocusedIndex]);

  // Effect to apply focus styling to main area elements
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    
    const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    
    if (focusArea === 'main') {
      focusableElements.forEach((element, index) => {
        if (index === mainFocusedIndex) {
          element.classList.add('ring-2', 'ring-black', 'ring-offset-2', 'rounded');
        } else {
          element.classList.remove('ring-2', 'ring-black', 'ring-offset-2', 'rounded');
        }
      });
    } else {
      // Clean up all focus styling when switching to sidebar
      focusableElements.forEach((element) => {
        element.classList.remove('ring-2', 'ring-black', 'ring-offset-2', 'rounded');
      });
    }
    
    // Cleanup on unmount
    return () => {
      focusableElements.forEach((element) => {
        element.classList.remove('ring-2', 'ring-black', 'ring-offset-2', 'rounded');
      });
    };
  }, [mainFocusedIndex, focusArea]);

  // Close controls when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showControls && target.classList.contains('modal-backdrop')) {
        setShowControls(false);
      }
      if (showSettings && target.classList.contains('modal-backdrop')) {
        setShowSettings(false);
      }
    };

    if (showControls || showSettings) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showControls, showSettings]);

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
      
      // If we're on a project sub-page, also set project focus
      if (location.pathname.startsWith('/projects/')) {
        setProjectsOpen(true);
        const currentProjectIndex = projectItems.findIndex(item => item.path === location.pathname);
        if (currentProjectIndex !== -1) {
          setFocusedProjectIndex(currentProjectIndex);
        }
      }
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 p-8 flex flex-col transition-all duration-300 ease-in-out bg-white z-30 ${
        sidebarVisible ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Link to="/" className="text-2xl font-normal hover:underline">
          Inner Cosmos
        </Link>
        
        <p className="text-sm text-gray-600 mt-2 mb-8">
          {loading ? 'this, too, is it' : quote}
        </p>

        <nav className="space-y-2 flex-1">
          {navItems.map(({ path, label, isDropdown }, index) => (
            <div key={path}>
              {isDropdown ? (
                <div className="relative">
                  <Link
                    to={path}
                    onClick={(e) => {
                      // Allow navigation but don't auto-expand
                      if (e.currentTarget === e.target) {
                        navigate(path);
                      }
                    }}
                    className={`flex items-center justify-between w-full py-1 text-sm hover:underline text-left select-none ${
                      location.pathname === '/projects' ? 'font-bold' : ''
                    } ${
                      focusedIndex === index && focusedProjectIndex === -1 ? 'bg-gray-100 px-2 -mx-2 rounded' : ''
                    }`}
                  >
                    <span>Projects</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setProjectsOpen(!projectsOpen);
                      }}
                      className="ml-2 p-0.5 -m-0.5 focus:outline-none"
                      style={{ 
                        outline: 'none',
                        border: 'none',
                        boxShadow: 'none',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      <svg 
                        className={`w-3 h-3 transition-transform duration-200 ${
                          projectsOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </Link>
                  
                  {projectsOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {projectItems.map(({ path: projectPath, label: projectLabel }, projectIndex) => (
                        <Link
                          key={projectPath}
                          to={projectPath}
                          className={`block py-1 text-sm hover:underline ${
                            location.pathname === projectPath ? 'font-bold' : 'text-gray-600'
                          } ${
                            focusedProjectIndex === projectIndex ? 'bg-gray-100 px-2 -mx-2 rounded' : ''
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

        {/* Bottom buttons */}
        <div className="flex gap-2 mt-8">
          <button
            onClick={() => setSidebarVisible(!sidebarVisible)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Toggle Sidebar (⌘E)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Settings (⌘S)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title={soundEnabled ? "Sound On (⌘M or ⌘⇧M)" : "Sound Off (⌘M or ⌘⇧M)"}
          >
            {soundEnabled ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
          
          <button
            onClick={() => setShowControls(!showControls)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-sm font-medium"
            title="Show keyboard controls (⌘?)"
          >
            ?
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className={`flex-1 p-8 transition-all duration-300 ease-in-out ${
        sidebarVisible ? 'ml-64' : 'ml-0'
      }`}>
        {children}
      </main>

      {/* Hover zone and floating sidebar toggle when sidebar is hidden */}
      {!sidebarVisible && (
        <>
          {/* Invisible hover zone on the left edge */}
          <div className="fixed left-0 top-0 w-8 h-full z-40 group">
            {/* Button appears on hover */}
            <button
              onClick={() => setSidebarVisible(true)}
              className="fixed left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-full"
              title="Show Sidebar (⌘E)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Controls Modal */}
      {showControls && (
        <div 
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)' // Safari support
          }}
        >
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4">Keyboard Controls</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="font-semibold text-gray-900 mb-2">Navigation</div>
              <div className="flex justify-between pl-4">
                <span className="font-medium">Switch Focus Area:</span>
                <span>Tab key</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="font-medium">Navigate items:</span>
                <span>↑↓ ←→ arrow keys</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="font-medium">Expand/Collapse Projects:</span>
                <span>→ / ← arrow keys</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="font-medium">Select:</span>
                <span>Enter key</span>
              </div>
              
              <div className="font-semibold text-gray-900 mt-4 mb-2">Quick Actions</div>
              <div className="flex justify-between pl-4">
                <span className="font-medium">Toggle Sidebar:</span>
                <span>⌘ Cmd + E</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="font-medium">Open Settings:</span>
                <span>⌘ Cmd + S</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="font-medium">Toggle Sound:</span>
                <span>⌘ Cmd + M</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="font-medium">Show Help:</span>
                <span>⌘ Cmd + ?</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="font-medium">Close modals:</span>
                <span>Escape key</span>
              </div>
              
              <div className="text-xs text-gray-500 mt-3 pl-4">
                <span className="font-medium">Note:</span> Hold Shift with shortcuts to avoid system conflicts (e.g., ⌘⇧M instead of ⌘M)
              </div>
            </div>
            <button
              onClick={() => setShowControls(false)}
              className="mt-6 w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Click anywhere to close
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div 
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)' // Safari support
          }}
        >
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dark Mode</span>
                <button className="w-12 h-6 bg-gray-200 rounded-full relative transition-colors">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Animations</span>
                <button className="w-12 h-6 bg-blue-500 rounded-full relative transition-colors">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sound Effects</span>
                <button 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${soundEnabled ? 'bg-blue-500' : 'bg-gray-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${soundEnabled ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Click anywhere to close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout; 