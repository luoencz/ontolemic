import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setShowSettings, setShowControls } from '../store/slices/uiSlice';
import { useRandomQuote } from '../hooks/useRandomQuote';
import Page from '../components/Page';
import MobileNavSection from '../components/mobile/MobileNavSection';
import MobileNavItem from '../components/mobile/MobileNavItem';
import { navItems, projectItems, researchItems, backstageItems } from '../config/navigation';

function NavigationPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { backstageUnlocked } = useAppSelector(state => state.ui);
  const { quote, loading } = useRandomQuote();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const [backstageOpen, setBackstageOpen] = useState(false);

  // Redirect to home on desktop
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Page className="lg:hidden">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-normal mb-2">Inner Cosmos</h1>
          <p className="text-sm text-gray-600">
            {loading ? 'this, too, is it' : quote}
          </p>
        </div>

        {/* Navigation Items */}
        <div className="space-y-4">
          {navItems.map(({ path, label, isDropdown }) => (
            <div key={path}>
              {isDropdown ? (
                <MobileNavSection
                  path={path}
                  label={label}
                  isOpen={path === '/projects' ? projectsOpen : researchOpen}
                  onToggle={() => path === '/projects' ? setProjectsOpen(!projectsOpen) : setResearchOpen(!researchOpen)}
                >
                  {path === '/projects' ? (
                    projectItems.map(({ path: projectPath, label: projectLabel }) => (
                      <MobileNavItem
                        key={projectPath}
                        path={projectPath}
                        label={projectLabel}
                        isNested
                      />
                    ))
                  ) : (
                    researchItems.map(({ path: researchPath, label: researchLabel }) => (
                      <MobileNavItem
                        key={researchPath}
                        path={researchPath}
                        label={researchLabel}
                        isNested
                      />
                    ))
                  )}
                </MobileNavSection>
              ) : (
                <Link
                  to={path}
                  className="block py-4 px-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-lg font-medium">{label}</span>
                </Link>
              )}
            </div>
          ))}
          
          {/* Backstage section - only visible when unlocked */}
          {backstageUnlocked && (
            <>
              <div className="h-4" />
              <MobileNavSection
                path="/backstage"
                label="// Backstage"
                isOpen={backstageOpen}
                onToggle={() => setBackstageOpen(!backstageOpen)}
              >
                {backstageItems.map(({ path: backstagePath, label: backstageLabel }) => (
                  <MobileNavItem
                    key={backstagePath}
                    path={backstagePath}
                    label={backstageLabel}
                    isNested
                  />
                ))}
              </MobileNavSection>
            </>
          )}
        </div>
        
        {/* Bottom controls */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex justify-around items-center">
            <button
              onClick={() => dispatch(setShowSettings(true))}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
            <Link
              to="/"
              className="px-6 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              <span className="text-lg font-medium text-blue-600">Back to Home</span>
            </Link>
            
            <button
              onClick={() => dispatch(setShowControls(true))}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-sm font-medium"
              title="Keyboard controls"
            >
              ?
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default NavigationPage; 