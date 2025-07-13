import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar, toggleSound, setShowSettings, setShowControls } from '../../store/slices/uiSlice';
import { useRandomQuote } from '../../hooks/useRandomQuote';
import SidebarNode from '../sidebar/SidebarNode';
import { navigationTree, backstageTree } from '../../config/navigation';

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
  const { soundEnabled, backstageUnlocked } = useAppSelector(state => state.ui);
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
        {navigationTree.map((node) => {
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
        
        {/* Backstage section - only visible when unlocked */}
        {backstageUnlocked && (
          <>
            <div className="h-8" /> {/* Wider gap for separation */}
            <SidebarNode
              node={backstageTree}
              depth={0}
              isFocused={sidebarFocusIndex === visibleNodes.findIndex(n => n.node.id === 'backstage' && n.depth === 0)}
              focusedPath={focusedPath}
            />
          </>
        )}
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => dispatch(setShowSettings(true))}
          className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${
            bottomButtonIndex === 1 ? 'ring-2 ring-black ring-offset-1' : ''
          }`}
          title="Settings (⌘S)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        <button
          onClick={() => dispatch(toggleSound())}
          className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${
            bottomButtonIndex === 2 ? 'ring-2 ring-black ring-offset-1' : ''
          }`}
          title={soundEnabled ? "Sound On (⌘M or ⌘⇧M)" : "Sound Off (⌘M or ⌘⇧M)"}
        >
          {soundEnabled ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
        
        <button
          onClick={() => dispatch(setShowControls(true))}
          className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-sm font-medium ${
            bottomButtonIndex === 3 ? 'ring-2 ring-black ring-offset-1' : ''
          }`}
          title="Show keyboard controls (⌘?)"
        >
          ?
        </button>
      </div>
    </div>
  );
}

export default NavigationContent; 