import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleNode } from '../../store/slices/navigationSlice';
import { NavNode } from '../../config/navigation';
import { Icons } from '../../config/icons';

interface SidebarNodeProps {
  node: NavNode;
  depth: number;
  isFocused: boolean;
  focusedPath: string[];
}

function SidebarNode({ node, depth, isFocused, focusedPath }: SidebarNodeProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const expandedIds = useAppSelector(state => state.navigation.expandedIds);
  
  const isExpanded = expandedIds[node.id] || false;
  const hasChildren = node.children && node.children.length > 0;
  const isActive = node.path === location.pathname;
  
  const indentStyle = depth > 0 ? { marginLeft: `${depth * 1}rem` } : {};
  
  const focusedId = focusedPath.length > 0 ? focusedPath[focusedPath.length - 1] : null;

  const handleClick = (e: React.MouseEvent) => {
    if (node.path && e.currentTarget === e.target) {
      navigate(node.path);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleNode(node.id));
  };

  return (
    <div style={indentStyle} data-node-id={node.id}>
      <div
        className={`flex items-center w-full py-1 text-sm no-underline hover:underline text-left select-none ${
          isActive ? 'font-bold' : ''
        }`}
      >
        <div className="w-4 h-4 mr-1.5 flex items-center justify-center flex-shrink-0">
          {hasChildren ? (
            <button
              onClick={handleToggle}
              className="p-0 focus:outline-none"
              style={{ 
                outline: 'none',
                border: 'none',
                boxShadow: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <Icons.expandSection 
                className={`w-3 h-3 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
          ) : (
            <Icons.nonExpandableItem className="w-3 h-3" />
          )}
        </div>
        
        {node.path ? (
          <Link
            to={node.path}
            onClick={handleClick}
            className="flex-1 no-underline"
          >
            {node.label}
          </Link>
        ) : (
          <span className="flex-1 cursor-pointer" onClick={handleClick}>
            {node.label}
          </span>
        )}
        
        {isFocused && (
          <Icons.currentItem className="w-3 h-3 ml-2 stroke-3" />
        )}
      </div>
      
      {isExpanded && hasChildren && (
        <div className="mt-1 space-y-1">
          {node.children!.map((child) => (
            <SidebarNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isFocused={focusedId === child.id}
              focusedPath={focusedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SidebarNode; 