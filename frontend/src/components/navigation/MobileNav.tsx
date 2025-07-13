import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/uiSlice';

function MobileNav() {
  const dispatch = useAppDispatch();

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40 lg:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="p-2 focus:outline-none"
        aria-label="Toggle navigation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Site title */}
      <Link 
        to="/" 
        className="text-lg font-normal hover:text-blue-600 transition-colors"
      >
        Inner Cosmos
      </Link>

      {/* Placeholder for spacing to balance flex */}
      <div className="w-6" />
    </div>
  );
}

export default MobileNav; 