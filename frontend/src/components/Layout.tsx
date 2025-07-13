import { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useSearchHighlight } from '../hooks/useSearchHighlight';
import { usePageTracking } from '../hooks/usePageTracking';
import { useExternalLinkTracking } from '../hooks/useExternalLinkTracking';
import { useActivityTracking } from '../hooks/useActivityTracking';
import DesktopNavigationWrapper from './navigation/DesktopNavigationWrapper';
import SidebarToggle from './sidebar/SidebarToggle';
import MobileNav from './navigation/MobileNav';
import MobileNavigationWrapper from './navigation/MobileNavigationWrapper';
import ControlsModal from './modals/ControlsModal';
import SettingsModal from './modals/SettingsModal';
import { Search } from './search/Search';
import PageContentLoader from './common/PageContentLoader';

export function Layout() {
  const sidebarVisible = useAppSelector(state => state.ui.sidebarVisible);
  const keyboardNavigation = useKeyboardNavigation();
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Enable search highlighting on all pages
  useSearchHighlight();
  
  // Track page views
  usePageTracking();
  
  // Track external link clicks
  useExternalLinkTracking();
  
  // Track user activity and engagement
  useActivityTracking();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Override browser search with Cmd+F or Ctrl+F
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        if (!searchOpen) {
          setSearchOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <div className="relative min-h-screen">
      {/* Mobile navigation */}
      <MobileNav />
      
      {/* Mobile navigation wrapper - full screen modal */}
      <MobileNavigationWrapper keyboardNavigation={keyboardNavigation} />
      
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <DesktopNavigationWrapper keyboardNavigation={keyboardNavigation} />
      </div>
      
      {/* Main content - responsive margins */}
      <main className={`transition-all duration-300 ease-in-out ${
        sidebarVisible ? 'lg:ml-64' : 'lg:ml-0'
      } p-4 lg:p-8 pt-20 lg:pt-8 min-h-screen`}>
        <Suspense fallback={<PageContentLoader />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Sidebar toggle when hidden - desktop only */}
      <div className="hidden lg:block">
        {!sidebarVisible && <SidebarToggle />}
      </div>
      
      {/* Search modal */}
      <Search isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Modals */}
      <ControlsModal />
      <SettingsModal />
    </div>
  );
} 