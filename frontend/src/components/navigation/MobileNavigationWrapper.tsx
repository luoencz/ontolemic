import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/uiSlice';
import NavigationContent from './NavigationContent';

interface MobileNavigationWrapperProps {
  keyboardNavigation: any;
}

function MobileNavigationWrapper({ keyboardNavigation }: MobileNavigationWrapperProps) {
  const dispatch = useAppDispatch();
  const sidebarVisible = useAppSelector(state => state.ui.sidebarVisible);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (sidebarVisible && target.classList.contains('navigation-backdrop')) {
        dispatch(toggleSidebar());
      }
    };

    if (sidebarVisible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [sidebarVisible, dispatch]);

  return (
    <div 
      className={`navigation-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 lg:hidden ${
        sidebarVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
      }}
    >
      <div className={`bg-white w-full h-full rounded-2xl shadow-2xl transition-transform duration-300 overflow-hidden ${
        sidebarVisible ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <NavigationContent keyboardNavigation={keyboardNavigation} />
      </div>
    </div>
  );
}

export default MobileNavigationWrapper; 