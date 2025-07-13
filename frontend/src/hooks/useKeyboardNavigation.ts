import { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSidebar, toggleSound, setShowControls, setShowSettings, closeAllModals } from '../store/slices/uiSlice';
import { setNodeExpanded, toggleNode, setFocusArea } from '../store/slices/navigationSlice';
import { navigationTree, backstageTree, NavNode } from '../config/navigation';

interface FlatNode {
  node: NavNode;
  depth: number;
  path: string[]; // Path of node IDs from root to this node
}

export function useKeyboardNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  // Bottom button actions
  const bottomButtons = [
    { id: 'toggle-sidebar', action: () => dispatch(toggleSidebar()), title: 'Toggle Sidebar (⌘E)' },
    { id: 'settings', action: () => dispatch(setShowSettings(true)), title: 'Settings (⌘S)' },
    { id: 'toggle-sound', action: () => dispatch(toggleSound()), title: 'Toggle Sound (⌘M)' },
    { id: 'controls', action: () => dispatch(setShowControls(true)), title: 'Show keyboard controls (⌘?)' },
  ];
  
  // UI state
  const showControls = useAppSelector(state => state.ui.showControls);
  const showSettings = useAppSelector(state => state.ui.showSettings);
  const backstageUnlocked = useAppSelector(state => state.ui.backstageUnlocked);
  const sidebarVisible = useAppSelector(state => state.ui.sidebarVisible);
  
  // Navigation state
  const expandedIds = useAppSelector(state => state.navigation.expandedIds);
  const focusArea = useAppSelector(state => state.navigation.focusArea);
  
  // Focus state
  const [sidebarFocusIndex, setSidebarFocusIndex] = useState(-1);
  const [bottomButtonIndex, setBottomButtonIndex] = useState(-1);
  const [mainFocusIndex, setMainFocusIndex] = useState(-1);
  
  // Track last focused element on a per-path basis
  const lastMainFocusIndex = useRef<Record<string, number>>({});
  
  // Track the last location we initialized focus for
  const lastFocusedLocation = useRef<string | null>(null);

  // Build full navigation tree including backstage if unlocked
  const fullTree = useMemo(() => {
    const tree = [...navigationTree];
    if (backstageUnlocked) {
      tree.push(backstageTree);
    }
    return tree;
  }, [backstageUnlocked]);

  // Flatten the tree to get all visible nodes
  const flattenTree = useCallback((nodes: NavNode[], depth = 0, parentPath: string[] = []): FlatNode[] => {
    const result: FlatNode[] = [];
    
    nodes.forEach(node => {
      const path = [...parentPath, node.id];
      result.push({ node, depth, path });
      
      if (node.children && expandedIds[node.id]) {
        result.push(...flattenTree(node.children, depth + 1, path));
      }
    });
    
    return result;
  }, [expandedIds]);

  // Get flattened list of visible nodes
  const visibleNodes = useMemo(() => flattenTree(fullTree), [flattenTree, fullTree]);

  // Find node by path
  const findNodeByPath = useCallback((pathname: string): FlatNode | null => {
    return visibleNodes.find(flat => flat.node.path === pathname) || null;
  }, [visibleNodes]);

  // Set initial focus based on current page
  useEffect(() => {
    if (!sidebarVisible) {
      dispatch(setFocusArea('main'));
      lastFocusedLocation.current = null;
      return;
    }

    // Skip if we've already set focus for this location
    if (lastFocusedLocation.current === location.pathname) {
      return;
    }
    lastFocusedLocation.current = location.pathname;

    dispatch(setFocusArea('sidebar'));
    
    // Find current page in flattened nodes
    const currentNode = findNodeByPath(location.pathname);
    if (currentNode) {
      const index = visibleNodes.indexOf(currentNode);
      setSidebarFocusIndex(index);
      
      // Auto-expand parent nodes if needed
      currentNode.path.slice(0, -1).forEach(parentId => {
        if (!expandedIds[parentId]) {
          dispatch(setNodeExpanded({ id: parentId, expanded: true }));
        }
      });
    } else {
      // Try to find parent node if exact path not found
      const parentPaths = location.pathname.split('/').filter(Boolean);
      for (let i = parentPaths.length; i > 0; i--) {
        const parentPath = '/' + parentPaths.slice(0, i).join('/');
        const parentNode = findNodeByPath(parentPath);
        if (parentNode) {
          const index = visibleNodes.indexOf(parentNode);
          setSidebarFocusIndex(index);
          break;
        }
      }
    }
  }, [location.pathname, dispatch, sidebarVisible, findNodeByPath, visibleNodes, expandedIds]);

  // Get currently focused node
  const getFocusedNode = useCallback((): FlatNode | null => {
    if (sidebarFocusIndex >= 0 && sidebarFocusIndex < visibleNodes.length) {
      return visibleNodes[sidebarFocusIndex];
    }
    return null;
  }, [sidebarFocusIndex, visibleNodes]);

  const switchToMainArea = useCallback(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    const focusableElements = Array.from(mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')) as HTMLElement[];
    if (focusableElements.length === 0) return;

    dispatch(setFocusArea('main'));

    // 1. Check for a remembered focus index for the current page
    const rememberedIndex = lastMainFocusIndex.current[location.pathname];
    if (rememberedIndex !== undefined && focusableElements[rememberedIndex]) {
      const element = focusableElements[rememberedIndex];
      const rect = element.getBoundingClientRect();
      // Check if the element is in the viewport
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        setMainFocusIndex(rememberedIndex);
        return;
      }
    }

    // 2. Find the element closest to the sidebar focus
    const focusedNode = getFocusedNode();
    if (focusedNode) {
        const sidebarItem = document.querySelector(`[data-node-id='${focusedNode.node.id}']`);
        if (sidebarItem) {
          const sidebarRect = sidebarItem.getBoundingClientRect();
          const sidebarCenterY = sidebarRect.top + sidebarRect.height / 2;
          
          const visibleElementsWithIndex = focusableElements
            .map((el, index) => ({ el, index, rect: el.getBoundingClientRect() }))
            .filter(({ rect }) => rect.top >= 0 && rect.bottom <= window.innerHeight);

          if (visibleElementsWithIndex.length > 0) {
            const closestElement = visibleElementsWithIndex
              .map(({ index, rect }) => {
                const elCenterY = rect.top + rect.height / 2;
                const distance = Math.abs(elCenterY - sidebarCenterY);
                return { index, distance };
              })
              .reduce((prev, curr) => {
                return prev.distance < curr.distance ? prev : curr;
              });

            setMainFocusIndex(closestElement.index);
            return;
          }
        }
    }
    
    // 3. Fallback to the first visible element
    for (let i = 0; i < focusableElements.length; i++) {
      const rect = focusableElements[i].getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        setMainFocusIndex(i);
        return;
      }
    }

    // 4. If nothing is visible, fallback to the first element
    setMainFocusIndex(0);

  }, [dispatch, location.pathname, getFocusedNode]);

  // Navigate sidebar vertically
  const navigateSidebar = useCallback((direction: 'up' | 'down') => {
    if (direction === 'up') {
      if (bottomButtonIndex >= 0) {
        // From bottom buttons, go to last visible node
        setBottomButtonIndex(-1);
        setSidebarFocusIndex(visibleNodes.length - 1);
      } else if (sidebarFocusIndex > 0) {
        setSidebarFocusIndex(sidebarFocusIndex - 1);
      } else if (sidebarFocusIndex === 0) {
        // Loop to bottom buttons
        setSidebarFocusIndex(-1);
        setBottomButtonIndex(bottomButtons.length - 1);
      }
    } else {
      if (bottomButtonIndex >= 0) {
        // From bottom buttons, loop to top
        setBottomButtonIndex(-1);
        setSidebarFocusIndex(0);
      } else if (sidebarFocusIndex < visibleNodes.length - 1) {
        setSidebarFocusIndex(sidebarFocusIndex + 1);
      } else if (sidebarFocusIndex === visibleNodes.length - 1) {
        // Go to bottom buttons
        setSidebarFocusIndex(-1);
        setBottomButtonIndex(0);
      }
    }
  }, [sidebarFocusIndex, bottomButtonIndex, visibleNodes.length, bottomButtons.length]);

  // Navigate sidebar horizontally
  const navigateSidebarHorizontal = useCallback((direction: 'left' | 'right') => {
    // Handle bottom buttons
    if (bottomButtonIndex >= 0) {
      if (direction === 'right') {
        setBottomButtonIndex((bottomButtonIndex + 1) % bottomButtons.length);
      } else {
        setBottomButtonIndex(bottomButtonIndex === 0 ? bottomButtons.length - 1 : bottomButtonIndex - 1);
      }
      return;
    }

    const focusedNode = getFocusedNode();
    if (!focusedNode) return;

    if (direction === 'right') {
      // Expand node or switch to main
      if (focusedNode.node.children && focusedNode.node.children.length > 0 && !expandedIds[focusedNode.node.id]) {
        dispatch(toggleNode(focusedNode.node.id));
      } else {
        // Switch to main area
        switchToMainArea();
      }
    } else {
      // Collapse node or move to parent
      if (focusedNode.node.children && expandedIds[focusedNode.node.id]) {
        dispatch(toggleNode(focusedNode.node.id));
      } else if (focusedNode.depth > 0) {
        // Move focus to parent node
        const parentId = focusedNode.path[focusedNode.path.length - 2];
        const parentIndex = visibleNodes.findIndex(n => n.node.id === parentId);
        if (parentIndex >= 0) {
          setSidebarFocusIndex(parentIndex);
        }
      } else {
        // At root level, switch to main area (wraps around)
        switchToMainArea();
      }
    }
  }, [bottomButtonIndex, bottomButtons.length, getFocusedNode, expandedIds, dispatch, visibleNodes, switchToMainArea]);

  // Handle main area navigation
  const navigateMainArea = useCallback((key: string, event: KeyboardEvent) => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    
    const focusableElements = Array.from(mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')) as HTMLElement[];
    if (focusableElements.length === 0) return;

    const getElementCenter = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, element, rect };
    };

    const elements = focusableElements.map((el, index) => ({ ...getElementCenter(el), index }));
    const current = mainFocusIndex >= 0 && mainFocusIndex < elements.length ? 
                   elements[mainFocusIndex] : null;

    // Calculate angle between two points (in degrees, 0° is right, 90° is down)
    const getAngle = (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      // Normalize to 0-360
      if (angle < 0) angle += 360;
      return angle;
    };

    // Check if angle is within a sector (handles wrap-around at 0/360)
    const isAngleInSector = (angle: number, sectorCenter: number, sectorWidth: number) => {
      const halfWidth = sectorWidth / 2;
      let diff = Math.abs(angle - sectorCenter);
      if (diff > 180) diff = 360 - diff;
      return diff <= halfWidth;
    };

    // Define overlapping sectors for each direction
    // Each sector is 120° wide, creating 60° overlaps
    const sectors = {
      'ArrowRight': { center: 0, width: 120 },    // -60° to 60°
      'ArrowDown': { center: 90, width: 120 },   // 30° to 150°
      'ArrowLeft': { center: 180, width: 120 },  // 120° to 240°
      'ArrowUp': { center: 270, width: 120 }      // 210° to 330°
    };

    const findBestCandidate = (candidates: typeof elements) => {
      if (candidates.length === 0) return null;
      
      // Sort by distance
      return candidates.reduce((prev, curr) => {
        const prevDist = Math.hypot(current!.x - prev.x, current!.y - prev.y);
        const currDist = Math.hypot(current!.x - curr.x, current!.y - curr.y);
        return currDist < prevDist ? curr : prev;
      });
    };

    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        if (!event.metaKey && !event.ctrlKey) event.preventDefault();
        
        if (current) {
          const sector = sectors[key];
          
          // Find all elements in the direction's sector
          const candidates = elements.filter(el => {
            if (el === current) return false;
            
            // Must be at least 10px away to avoid selecting the same element
            const distance = Math.hypot(el.x - current.x, el.y - current.y);
            if (distance < 10) return false;
            
            const angle = getAngle(current, el);
            return isAngleInSector(angle, sector.center, sector.width);
          });
          
          const best = findBestCandidate(candidates);
          if (best) {
            setMainFocusIndex(best.index);
          } else if (key === 'ArrowLeft' && sidebarVisible) {
            // Special case: if no element found on left and sidebar is visible, switch to it
            dispatch(setFocusArea('sidebar'));
          }
        } else {
          setMainFocusIndex(0);
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (mainFocusIndex >= 0 && mainFocusIndex < focusableElements.length) {
          focusableElements[mainFocusIndex].click();
        }
        break;
    }
  }, [mainFocusIndex, sidebarVisible, dispatch]);

  // Main keyboard handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't handle when typing
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Tab to switch focus areas
    if (event.key === 'Tab') {
      event.preventDefault();
      if (focusArea === 'sidebar' && sidebarVisible) {
        switchToMainArea();
      } else if (sidebarVisible) {
        dispatch(setFocusArea('sidebar'));
      }
      return;
    }

    // Global shortcuts
    if ((event.metaKey || event.ctrlKey) && !showControls && !showSettings) {
      switch (event.key.toLowerCase()) {
        case 's':
          event.preventDefault();
          dispatch(setShowSettings(true));
          return;
        case 'm':
          event.preventDefault();
          dispatch(toggleSound());
          return;
        case '/':
        case '?':
          event.preventDefault();
          dispatch(setShowControls(true));
          return;
        case 'e':
          event.preventDefault();
          dispatch(toggleSidebar());
          return;
      }
    }

    // ESC to close modals or return focus to sidebar
    if (event.key === 'Escape') {
      event.preventDefault();
      if (showControls || showSettings) {
        dispatch(closeAllModals());
      } else {
        // Always return focus to sidebar unless it's not visible
        if (sidebarVisible) {
          dispatch(setFocusArea('sidebar'));
          // Set focus to the current page's nav item if we can find it
          if (sidebarFocusIndex === -1 && visibleNodes.length > 0) {
            setSidebarFocusIndex(0);
            setBottomButtonIndex(-1);
          }
        }
      }
      return;
    }

    // Don't process navigation keys when modals are open
    if (showControls || showSettings) return;

    // Don't process arrow navigation when Cmd/Ctrl is pressed
    if ((event.metaKey || event.ctrlKey) && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return;
    }

    // Route to appropriate handler
    if (focusArea === 'main') {
      navigateMainArea(event.key, event);
    } else if (focusArea === 'sidebar' && sidebarVisible) {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          navigateSidebar('up');
          break;
        case 'ArrowDown':
          event.preventDefault();
          navigateSidebar('down');
          break;
        case 'ArrowLeft':
          event.preventDefault();
          navigateSidebarHorizontal('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateSidebarHorizontal('right');
          break;
        case 'Enter':
          event.preventDefault();
          if (bottomButtonIndex >= 0) {
            // Execute bottom button action
            const button = bottomButtons[bottomButtonIndex];
            button.action();
          } else {
            // Navigate to selected item
            const focusedNode = getFocusedNode();
            if (focusedNode && focusedNode.node.path) {
              navigate(focusedNode.node.path);
            } else if (focusedNode && focusedNode.node.children) {
              // Toggle expansion if no path
              dispatch(toggleNode(focusedNode.node.id));
            }
          }
          break;
      }
    }
  }, [dispatch, showControls, showSettings, focusArea, sidebarVisible, navigateSidebar, navigateSidebarHorizontal, navigateMainArea, getFocusedNode, navigate, bottomButtonIndex, bottomButtons, mainFocusIndex, sidebarFocusIndex, visibleNodes.length, switchToMainArea]);

  // Set up event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Remember the last focused item in the main area
  useEffect(() => {
    if (focusArea === 'main' && mainFocusIndex !== -1) {
      lastMainFocusIndex.current[location.pathname] = mainFocusIndex;
    }
  }, [mainFocusIndex, focusArea, location.pathname]);

  // Apply visual focus to main area elements
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    
    const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    
    if (focusArea === 'main') {
      focusableElements.forEach((element, index) => {
        if (index === mainFocusIndex) {
          element.classList.add('ring-2', 'ring-black', 'ring-offset-2', 'rounded');
          
          // Scroll element into view with padding
          const elementRect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;
          
          // Check if element is outside viewport
          const isOutOfView = elementRect.top < 0 || 
                             elementRect.bottom > viewportHeight ||
                             elementRect.left < 0 ||
                             elementRect.right > viewportWidth;
          
          if (isOutOfView) {
            // Calculate the desired scroll position with 25% padding
            const scrollPaddingPercent = 0.25;
            
            // For vertical scrolling
            if (elementRect.top < 0 || elementRect.bottom > viewportHeight) {
              const elementCenterY = elementRect.top + elementRect.height / 2 + window.scrollY;
              const targetScrollY = elementCenterY - (viewportHeight / 2);
              
              // Add padding based on direction
              let adjustedScrollY = targetScrollY;
              if (elementRect.top < 0) {
                // Element is above viewport, add padding to top
                adjustedScrollY = elementRect.top + window.scrollY - (viewportHeight * scrollPaddingPercent);
              } else {
                // Element is below viewport, add padding to bottom
                adjustedScrollY = elementRect.bottom + window.scrollY - viewportHeight + (viewportHeight * scrollPaddingPercent);
              }
              
              window.scrollTo({
                top: Math.max(0, adjustedScrollY),
                behavior: 'smooth'
              });
            }
            
            // For horizontal scrolling (if needed)
            if (elementRect.left < 0 || elementRect.right > viewportWidth) {
              const elementCenterX = elementRect.left + elementRect.width / 2 + window.scrollX;
              const targetScrollX = elementCenterX - (viewportWidth / 2);
              
              window.scrollTo({
                left: Math.max(0, targetScrollX),
                behavior: 'smooth'
              });
            }
          }
        } else {
          element.classList.remove('ring-2', 'ring-black', 'ring-offset-2', 'rounded');
        }
      });
    } else {
      focusableElements.forEach((element) => {
        element.classList.remove('ring-2', 'ring-black', 'ring-offset-2', 'rounded');
      });
    }
    
    return () => {
      focusableElements.forEach((element) => {
        element.classList.remove('ring-2', 'ring-black', 'ring-offset-2', 'rounded');
      });
    };
  }, [mainFocusIndex, focusArea, location.pathname]);

  return useMemo(() => ({
    sidebarFocusIndex,
    bottomButtonIndex,
    mainFocusIndex,
    visibleNodes,
    getFocusedNode,
    bottomButtons,
  }), [sidebarFocusIndex, bottomButtonIndex, mainFocusIndex, visibleNodes, getFocusedNode, bottomButtons]);
} 