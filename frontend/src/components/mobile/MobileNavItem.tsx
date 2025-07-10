import { Link } from 'react-router-dom';

interface MobileNavItemProps {
  path: string;
  label: string;
  isNested?: boolean;
}

function MobileNavItem({ 
  path, 
  label, 
  isNested = false 
}: MobileNavItemProps) {
  return (
    <Link
      to={path}
      className={`block py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors ${
        isNested ? 'text-gray-600' : ''
      }`}
    >
      <span className="text-lg">{label}</span>
    </Link>
  );
}

export default MobileNavItem; 