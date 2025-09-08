import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar, toggleSound, setShowSettings, setShowControls } from '../../store/slices/uiSlice';
import { useRandomQuote } from '../../hooks/useRandomQuote';
import SidebarNode from '../sidebar/SidebarNode';
import { mainNavigationTree, backstageTree } from '../../utils/buildNavigation';
import { Icons } from '../../config/icons';

interface NavigationContentProps {
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

function NavigationContent({ keyboardNavigation }: NavigationContentProps) {
  const dispatch = useAppDispatch();
  const { soundEnabled } = useAppSelector(state => state.ui);
  const { quote } = useRandomQuote();
  
  // Destructure the keyboard navigation state
  const { sidebarFocusIndex, bottomButtonIndex, visibleNodes } = keyboardNavigation;
  
  // Build the focus path from the currently focused node
  const focusedPath: string[] = [];
  if (sidebarFocusIndex >= 0 && sidebarFocusIndex < visibleNodes.length) {
    const focusedNode = visibleNodes[sidebarFocusIndex];
    focusedPath.push(...focusedNode.path);
  }

  return (
    <div className="h-full flex flex-col p-8">
      <Link to="/" className="text-2xl font-normal no-underline hover:underline">
        Inner Cosmos
      </Link>
      
      <p className="text-sm text-gray-600 mt-2 mb-8">
        {quote}
      </p>

      <nav className="space-y-2 flex-1 overflow-y-auto">
        {mainNavigationTree.map((node) => {
          const nodeIndex = visibleNodes.findIndex(n => n.node.id === node.id && n.depth === 0);
          return (
            <SidebarNode
              key={node.id}
              node={node}
              depth={0}
              isFocused={sidebarFocusIndex === nodeIndex}
              focusedPath={focusedPath}
            />
          );
        })}
        
        {/* Backstage section - always visible */}
        <div className="h-8" />
        <SidebarNode
          node={backstageTree}
          depth={0}
          isFocused={sidebarFocusIndex === visibleNodes.findIndex(n => n.node.id === 'backstage' && n.depth === 0)}
          focusedPath={focusedPath}
        />
      </nav>

      {/* Bottom buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${
            bottomButtonIndex === 0 ? 'ring-2 ring-black ring-offset-1' : ''
          }`}
          title="Toggle Sidebar (⌘E)"
        >
          <Icons.toggleSidebar className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => dispatch(setShowSettings(true))}
          className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${
            bottomButtonIndex === 1 ? 'ring-2 ring-black ring-offset-1' : ''
          }`}
          title="Settings (⌘S)"
        >
          <Icons.settings className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => dispatch(toggleSound())}
          className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${
            bottomButtonIndex === 2 ? 'ring-2 ring-black ring-offset-1' : ''
          }`}
          title={soundEnabled ? "Sound On (⌘M or ⌘⇧M)" : "Sound Off (⌘M or ⌘⇧M)"}
        >
          {soundEnabled ? <Icons.soundOn className="w-4 h-4" /> : <Icons.soundOff className="w-4 h-4" />}
        </button>
        
        <button
          onClick={() => dispatch(setShowControls(true))}
          className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-sm font-medium ${
            bottomButtonIndex === 3 ? 'ring-2 ring-black ring-offset-1' : ''
          }`}
          title="Show keyboard controls (⌘?)"
        >
          <Icons.help className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default NavigationContent; 