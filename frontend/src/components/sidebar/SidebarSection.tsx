import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface SidebarSectionProps {
  path: string;
  label: string;
  isOpen: boolean;
  isActive: boolean;
  isFocused: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function SidebarSection({
  path,
  label,
  isOpen,
  isActive,
  isFocused,
  onToggle,
  children
}: SidebarSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <Link
        to={path}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            navigate(path);
          }
        }}
        className={`flex items-center justify-between w-full py-1 text-sm hover:underline text-left select-none ${
          isActive ? 'font-bold' : ''
        } ${
          isFocused ? 'bg-gray-100 px-2 -mx-2 rounded' : ''
        }`}
      >
        <span>{label}</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          className="ml-2 p-0.5 -m-0.5 focus:outline-none"
          style={{ 
            outline: 'none',
            border: 'none',
            boxShadow: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <svg 
            className={`w-3 h-3 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </Link>
      
      {isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

export default SidebarSection; 