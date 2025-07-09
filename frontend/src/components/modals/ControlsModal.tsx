import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setShowControls } from '../../store/slices/uiSlice';

function ControlsModal() {
  const dispatch = useAppDispatch();
  const showControls = useAppSelector(state => state.ui.showControls);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showControls && target.classList.contains('modal-backdrop')) {
        dispatch(setShowControls(false));
      }
    };

    if (showControls) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showControls, dispatch]);

  if (!showControls) return null;

  return (
    <div 
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
      }}
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-xl font-semibold mb-4">Keyboard Controls</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="font-semibold text-gray-900 mb-2">Navigation</div>
          <div className="flex justify-between pl-4">
            <span className="font-medium">Switch Focus Area:</span>
            <span>Tab key</span>
          </div>
          <div className="flex justify-between pl-4">
            <span className="font-medium">Navigate items:</span>
            <span>↑↓ ←→ arrow keys</span>
          </div>
          <div className="flex justify-between pl-4">
            <span className="font-medium">Expand/Collapse Projects:</span>
            <span>→ / ← arrow keys</span>
          </div>
          <div className="flex justify-between pl-4">
            <span className="font-medium">Select:</span>
            <span>Enter key</span>
          </div>
          
          <div className="font-semibold text-gray-900 mt-4 mb-2">Quick Actions</div>
          <div className="flex justify-between pl-4">
            <span className="font-medium">Search:</span>
            <span>⌘ Cmd + F</span>
          </div>
          <div className="flex justify-between pl-4">
            <span className="font-medium">Toggle Sidebar:</span>
            <span>⌘ Cmd + E</span>
          </div>
          <div className="flex justify-between pl-4">
            <span className="font-medium">Open Settings:</span>
            <span>⌘ Cmd + S</span>
          </div>
          <div className="flex justify-between pl-4">
            <span className="font-medium">Toggle Sound:</span>
            <span>⌘ Cmd + M</span>
          </div>
          <div className="flex justify-between pl-4">
            <span className="font-medium">Show Help:</span>
            <span>⌘ Cmd + ?</span>
          </div>
          <div className="flex justify-between pl-4">
            <span className="font-medium">Close modals:</span>
            <span>Escape key</span>
          </div>
          
          <div className="text-xs text-gray-500 mt-3 pl-4">
            <span className="font-medium">Note:</span> Hold Shift with shortcuts to avoid system conflicts (e.g., ⌘⇧M instead of ⌘M)
          </div>
        </div>
        <button
          onClick={() => dispatch(setShowControls(false))}
          className="mt-6 w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Click anywhere to close
        </button>
      </div>
    </div>
  );
}

export default ControlsModal; 