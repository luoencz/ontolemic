import { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useSearchHighlight } from '../hooks/useSearchHighlight';
import { useHeartbeat } from '../hooks/useHeartbeat';
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
  const location = useLocation();
  useHeartbeat();
  
  useSearchHighlight();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  useEffect(() => {
    fetch(`https://home.the-o.space/api/stats/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'navigation' }),
      credentials: 'include',
    });
  }, [location]);

  return (
    <div className="relative min-h-screen">
      <MobileNav />
      
      <MobileNavigationWrapper keyboardNavigation={keyboardNavigation} />
      
      <div className="hidden lg:block">
        <DesktopNavigationWrapper keyboardNavigation={keyboardNavigation} />
      </div>
      
      <main className={`transition-all duration-300 ease-in-out ${
        sidebarVisible ? 'lg:ml-64' : 'lg:ml-0'
      } p-4 lg:p-8 pt-20 lg:pt-8 min-h-screen`}>
        <Suspense fallback={<PageContentLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <div className="hidden lg:block">
        {!sidebarVisible && <SidebarToggle />}
      </div>
      
      <Search isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      <ControlsModal />
      <SettingsModal />
    </div>
  );
} 