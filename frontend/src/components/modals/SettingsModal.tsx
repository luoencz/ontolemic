import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setShowSettings, toggleSound } from '../../store/slices/uiSlice';

function SettingsModal() {
  const dispatch = useAppDispatch();
  const { showSettings, soundEnabled } = useAppSelector(state => state.ui);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSettings && target.classList.contains('modal-backdrop')) {
        dispatch(setShowSettings(false));
      }
    };

    if (showSettings) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSettings, dispatch]);

  if (!showSettings) return null;

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
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dark Mode</span>
            <button className="w-12 h-6 bg-gray-200 rounded-full relative transition-colors">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Animations</span>
            <button className="w-12 h-6 bg-blue-500 rounded-full relative transition-colors">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sound Effects</span>
            <button 
              onClick={() => dispatch(toggleSound())}
              className={`w-12 h-6 rounded-full relative transition-colors ${soundEnabled ? 'bg-blue-500' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${soundEnabled ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
        <button
          onClick={() => dispatch(setShowSettings(false))}
          className="mt-6 w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Click anywhere to close
        </button>
      </div>
    </div>
  );
}

export default SettingsModal; 