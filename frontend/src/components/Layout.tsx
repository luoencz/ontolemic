import { ReactNode, useState, useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useSearchHighlight } from '../hooks/useSearchHighlight';
import Sidebar from './Sidebar';
import SidebarToggle from './SidebarToggle';
import ControlsModal from './modals/ControlsModal';
import SettingsModal from './modals/SettingsModal';
import { Search } from './Search';
import { PrefetchIndicator } from './PrefetchIndicator';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
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
      <Sidebar keyboardNavigation={keyboardNavigation} />
      
      <main className={`transition-all duration-300 ease-in-out ${
        sidebarVisible ? 'ml-64' : 'ml-0'
      } p-8 min-h-screen`}>
        {children}
      </main>

      {/* Sidebar toggle when hidden */}
      {!sidebarVisible && <SidebarToggle />}
      
      {/* Search modal */}
      <Search isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Modals */}
      <ControlsModal />
      <SettingsModal />
      
      {/* Prefetch indicator */}
      <PrefetchIndicator />
    </div>
  );
} 