import { ReactNode, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useSearchHighlight } from '../hooks/useSearchHighlight';
import Sidebar from './Sidebar';
import SidebarToggle from './SidebarToggle';
import ControlsModal from './modals/ControlsModal';
import SettingsModal from './modals/SettingsModal';
import { Search } from './Search';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const dispatch = useAppDispatch();
  const sidebarVisible = useAppSelector(state => state.ui.sidebarVisible);
  const { focusedIndex, focusedProjectIndex, focusedBackstageIndex, bottomButtonFocused } = useKeyboardNavigation();
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
    <div className="relative min-h-screen bg-white">
      <Sidebar 
        focusedIndex={focusedIndex} 
        focusedProjectIndex={focusedProjectIndex}
        focusedBackstageIndex={focusedBackstageIndex}
        bottomButtonFocused={bottomButtonFocused}
      />
      
      <main className={`transition-all duration-300 ease-in-out ${
        sidebarVisible ? 'ml-64' : 'ml-0'
      } p-8`}>
        {children}
      </main>

      {/* Sidebar toggle when hidden */}
      {!sidebarVisible && <SidebarToggle />}
      
      {/* Search modal */}
      <Search isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Modals */}
      <ControlsModal />
      <SettingsModal />
    </div>
  );
} 