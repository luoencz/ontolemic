import { useAppSelector } from '../../store/hooks';
import NavigationContent from './NavigationContent';

interface DesktopNavigationWrapperProps {
  keyboardNavigation: {
    sidebarFocusIndex: number;
    bottomButtonIndex: number;
    mainFocusIndex: number;
    visibleNodes: Array<{
      node: { id: string; label: string; path?: string; children?: any[] };
      depth: number;
      path: string[];
    }>;
    getFocusedNode: () => any;
    bottomButtons: Array<{
      id: string;
      action: () => void;
      title: string;
    }>;
  };
}

function DesktopNavigationWrapper({ keyboardNavigation }: DesktopNavigationWrapperProps) {
  const sidebarVisible = useAppSelector(state => state.ui.sidebarVisible);

  return (
    <div className={`fixed left-0 top-0 h-full w-64 flex flex-col transition-all duration-300 ease-in-out bg-white z-30 ${
      sidebarVisible ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <NavigationContent keyboardNavigation={keyboardNavigation} />
    </div>
  );
}

export default DesktopNavigationWrapper; 