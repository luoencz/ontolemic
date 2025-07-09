import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSidebar, toggleSound, setShowSettings, setShowControls } from '../store/slices/uiSlice';
import { toggleProjects } from '../store/slices/navigationSlice';
import { useRandomQuote } from '../hooks/useRandomQuote';

interface SidebarProps {
  focusedIndex: number;
  focusedProjectIndex: number;
  bottomButtonFocused: number;
}

export const navItems = [
  { path: '/about', label: 'About' },
  { path: '/blog', label: 'Blog and Research' },
  { path: '/projects', label: 'Projects', isDropdown: true },
  { path: '/contact', label: 'Contact' },
];

export const projectItems = [
  { path: '/projects/web-dev', label: 'Web Development' },
  { path: '/projects/ai-ml', label: 'AI & Machine Learning' },
  { path: '/projects/open-source', label: 'Open Source' },
  { path: '/projects/research', label: 'Research Papers' },
];

function Sidebar({ focusedIndex, focusedProjectIndex, bottomButtonFocused }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sidebarVisible, soundEnabled } = useAppSelector(state => state.ui);
  const { projectsOpen } = useAppSelector(state => state.navigation);
  const { quote, loading } = useRandomQuote();

  return (
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
                      dispatch(toggleProjects());
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
      <div className="flex justify-between mt-8">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${
            bottomButtonFocused === 0 ? 'ring-2 ring-black ring-offset-1' : ''
          }`}
          title="Toggle Sidebar (⌘E)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => dispatch(setShowSettings(true))}
          className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${
            bottomButtonFocused === 1 ? 'ring-2 ring-black ring-offset-1' : ''
          }`}
          title="Settings (⌘S)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        <button
          onClick={() => dispatch(toggleSound())}
          className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${
            bottomButtonFocused === 2 ? 'ring-2 ring-black ring-offset-1' : ''
          }`}
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
          onClick={() => dispatch(setShowControls(true))}
          className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-sm font-medium ${
            bottomButtonFocused === 3 ? 'ring-2 ring-black ring-offset-1' : ''
          }`}
          title="Show keyboard controls (⌘?)"
        >
          ?
        </button>
      </div>
    </div>
  );
}

export default Sidebar; 