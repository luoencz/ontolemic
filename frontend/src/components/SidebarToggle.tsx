import { useAppDispatch } from '../store/hooks';
import { setSidebarVisible } from '../store/slices/uiSlice';

function SidebarToggle() {
  const dispatch = useAppDispatch();

  return (
    <>
      {/* Invisible hover zone on the left edge */}
      <div className="fixed left-0 top-0 w-8 h-full z-40 group">
        {/* Button appears on hover */}
        <button
          onClick={() => dispatch(setSidebarVisible(true))}
          className="fixed left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-full"
          title="Show Sidebar (⌘E)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </>
  );
}

export default SidebarToggle; 