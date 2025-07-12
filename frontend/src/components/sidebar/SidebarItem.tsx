import { PrefetchLink } from '../PrefetchLink';

interface SidebarItemProps {
  path: string;
  label: string;
  isActive: boolean;
  isFocused: boolean;
  isNested?: boolean;
}

function SidebarItem({ 
  path, 
  label, 
  isActive, 
  isFocused, 
  isNested = false 
}: SidebarItemProps) {
  return (
    <PrefetchLink
      to={path}
      className={`block py-1 text-sm hover:underline ${
        isActive ? 'font-bold' : isNested ? 'text-gray-600' : ''
      } ${
        isFocused ? 'bg-gray-100 px-2 -mx-2 rounded' : ''
      }`}
      prefetchOn="hover"
      prefetchDelay={100}
    >
      {label}
    </PrefetchLink>
  );
}

export default SidebarItem; 