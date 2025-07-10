import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface MobileNavSectionProps {
  path: string;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

function MobileNavSection({
  path,
  label,
  isOpen,
  onToggle,
  children
}: MobileNavSectionProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between py-4 px-6 bg-gray-50 rounded-lg">
        <Link
          to={path}
          className="flex-1 text-lg font-medium hover:text-blue-600 transition-colors"
        >
          {label}
        </Link>
        {children && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggle();
            }}
            className="ml-4 p-2 hover:bg-gray-200 rounded-md transition-colors"
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      
      {isOpen && children && (
        <div className="mt-2 ml-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

export default MobileNavSection; 