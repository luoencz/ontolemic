import { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useSearchHighlight } from '../hooks/useSearchHighlight';
import Sidebar from './Sidebar';
import SidebarToggle from './SidebarToggle';
import MobileNav from './MobileNav';
import ControlsModal from './modals/ControlsModal';
import SettingsModal from './modals/SettingsModal';
import { Search } from './Search';

const PageContentLoader = () => (
  <div className="flex items-center justify-center w-full" style={{ minHeight: 'calc(100vh - 12rem)'}}>
  </div>
);

export function Layout() {
  const sidebarVisible = useAppSelector(state => state.ui.sidebarVisible);
  const keyboardNavigation = useKeyboardNavigation();
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Enable search highlighting on all pages
  useSearchHighlight();

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
      
      {/* Sidebar - desktop only */}
      <div className="hidden lg:block">
        <Sidebar keyboardNavigation={keyboardNavigation} />
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