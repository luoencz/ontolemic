import { ReactNode } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import Sidebar from './Sidebar';
import SidebarToggle from './SidebarToggle';
import ControlsModal from './modals/ControlsModal';
import SettingsModal from './modals/SettingsModal';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const dispatch = useAppDispatch();
  const sidebarVisible = useAppSelector(state => state.ui.sidebarVisible);
  const { focusedIndex, focusedProjectIndex, backstageFocused, bottomButtonFocused } = useKeyboardNavigation();

  return (
    <div className="relative min-h-screen bg-white">
      <Sidebar 
        focusedIndex={focusedIndex} 
        focusedProjectIndex={focusedProjectIndex}
        backstageFocused={backstageFocused}
        bottomButtonFocused={bottomButtonFocused}
      />
      
      <main className={`transition-all duration-300 ease-in-out ${
        sidebarVisible ? 'ml-64' : 'ml-0'
      } p-8`}>
        {children}
      </main>

      {/* Sidebar toggle when hidden */}
      {!sidebarVisible && <SidebarToggle />}

      {/* Modals */}
      <ControlsModal />
      <SettingsModal />
    </div>
  );
} 