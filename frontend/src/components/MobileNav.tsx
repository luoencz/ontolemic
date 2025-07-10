import { Link, useLocation } from 'react-router-dom';

function MobileNav() {
  const location = useLocation();
  
  // Don't show the nav bar on the navigation page itself
  if (location.pathname === '/navigation') {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-center px-4 z-40 lg:hidden">
      {/* Clickable site title */}
      <Link 
        to="/navigation" 
        className="text-lg font-normal hover:text-blue-600 transition-colors"
      >
        Inner Cosmos
      </Link>
    </div>
  );
}

export default MobileNav; 