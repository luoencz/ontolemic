import { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSidebar, toggleSound, setShowControls, setShowSettings, closeAllModals } from '../store/slices/uiSlice';
import { setProjectsOpen, setResearchOpen, setBackstageOpen, setFocusArea } from '../store/slices/navigationSlice';
import { navItems, projectItems, researchItems, backstageItems } from '../components/Sidebar';

// Define navigation node structure
interface NavigationNode {
  id: string;
  path: string;
  label: string;
  expandable?: boolean;
  children?: NavigationNode[];
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
  const projectsOpen = useAppSelector(state => state.navigation.projectsOpen);
  const researchOpen = useAppSelector(state => state.navigation.researchOpen);
  const backstageOpen = useAppSelector(state => state.navigation.backstageOpen);
  const focusArea = useAppSelector(state => state.navigation.focusArea);
  
  // Focus state - using a single object for all focus indices
  const [focusState, setFocusState] = useState({
    navIndex: -1,
    projectIndex: -1,
    researchIndex: -1,
    backstageIndex: -1,
    bottomButtonIndex: -1,
    mainIndex: -1,
  });
  
  // Track the last location we initialized focus for
  const lastFocusedLocation = useRef<string | null>(null);

  // Build navigation tree dynamically based on current state
  const buildNavigationTree = useCallback((): NavigationNode[] => {
    const tree: NavigationNode[] = navItems.map((item, index) => ({
      id: `nav-${index}`,
      path: item.path,
      label: item.label,
      expandable: item.isDropdown,
      children: item.isDropdown ? (
        item.path === '/projects' ? 
          projectItems.map((proj, idx) => ({
            id: `project-${idx}`,
            path: proj.path,
            label: proj.label,
          })) :
          researchItems.map((res, idx) => ({
            id: `research-${idx}`,
            path: res.path,
            label: res.label,
          }))
      ) : undefined,
    }));

    // Add backstage if unlocked
    if (backstageUnlocked) {
      tree.push({
        id: 'backstage',
        path: '/backstage',
        label: '// Backstage',
        expandable: true,
        children: backstageItems.map((item, idx) => ({
          id: `backstage-${idx}`,
          path: item.path,
          label: item.label,
        })),
      });
    }

    return tree;
  }, [backstageUnlocked]);

  // Get expansion state for a section
  const isExpanded = useCallback((node: NavigationNode): boolean => {
    if (!node.expandable) return false;
    switch (node.path) {
      case '/projects': return projectsOpen;
      case '/research': return researchOpen;
      case '/backstage': return backstageOpen;
      default: return false;
    }
  }, [projectsOpen, researchOpen, backstageOpen]);

  // Toggle expansion for a section
  const toggleExpansion = useCallback((node: NavigationNode) => {
    switch (node.path) {
      case '/projects': dispatch(setProjectsOpen(!projectsOpen)); break;
      case '/research': dispatch(setResearchOpen(!researchOpen)); break;
      case '/backstage': dispatch(setBackstageOpen(!backstageOpen)); break;
    }
  }, [dispatch, projectsOpen, researchOpen, backstageOpen]);

  // Set initial focus based on current page - only when location or sidebar visibility changes
  useEffect(() => {
    if (!sidebarVisible) {
      dispatch(setFocusArea('main'));
      lastFocusedLocation.current = null; // Reset when sidebar is hidden
      return;
    }

    // Skip if we've already set focus for this location
    if (lastFocusedLocation.current === location.pathname) {
      return;
    }
    lastFocusedLocation.current = location.pathname;

    dispatch(setFocusArea('sidebar'));
    

    const tree: NavigationNode[] = navItems.map((item, index) => ({
      id: `nav-${index}`,
      path: item.path,
      label: item.label,
      expandable: item.isDropdown,
      children: item.isDropdown ? (
        item.path === '/projects' ? 
          projectItems.map((proj, idx) => ({
            id: `project-${idx}`,
            path: proj.path,
            label: proj.label,
          })) :
          researchItems.map((res, idx) => ({
            id: `research-${idx}`,
            path: res.path,
            label: res.label,
          }))
      ) : undefined,
    }));

    // Add backstage if unlocked
    if (backstageUnlocked) {
      tree.push({
        id: 'backstage',
        path: '/backstage',
        label: '// Backstage',
        expandable: true,
        children: backstageItems.map((item, idx) => ({
          id: `backstage-${idx}`,
          path: item.path,
          label: item.label,
        })),
      });
    }
    
    // Find current page in navigation tree
    let foundFocus = false;
    tree.forEach((node, navIndex) => {
      if (node.path === location.pathname) {
        setFocusState(prev => ({ ...prev, navIndex }));
        foundFocus = true;
      } else if (node.children) {
        node.children.forEach((child, childIndex) => {
          if (child.path === location.pathname) {
            setFocusState(prev => ({
              ...prev,
              navIndex,
              projectIndex: node.path === '/projects' ? childIndex : -1,
              researchIndex: node.path === '/research' ? childIndex : -1,
              backstageIndex: node.path === '/backstage' ? childIndex : -1,
            }));
            
            // Auto-expand parent section
            switch (node.path) {
              case '/projects': dispatch(setProjectsOpen(true)); break;
              case '/research': dispatch(setResearchOpen(true)); break;
              case '/backstage': dispatch(setBackstageOpen(true)); break;
            }
            foundFocus = true;
          }
        });
      }
    });

    if (!foundFocus) {
      setFocusState(prev => ({ ...prev, navIndex: -1 }));
    }
  }, [location.pathname, dispatch, sidebarVisible, backstageUnlocked]);

  // Helper to get currently focused section
  const getFocusedSection = useCallback(() => {
    const tree = buildNavigationTree();
    const node = tree[focusState.navIndex];
    if (!node) return null;
    
    return {
      node,
      childIndex: node.path === '/projects' ? focusState.projectIndex :
                  node.path === '/research' ? focusState.researchIndex :
                  node.path === '/backstage' ? focusState.backstageIndex : -1,
    };
  }, [buildNavigationTree, focusState]);

  // Navigate sidebar vertically
  const navigateSidebar = useCallback((direction: 'up' | 'down') => {
    const tree = buildNavigationTree();
    const section = getFocusedSection();

    if (direction === 'up') {
      // Handle bottom buttons navigation
      if (focusState.bottomButtonIndex >= 0) {
        const lastNavIndex = backstageUnlocked ? tree.length - 1 : navItems.length - 1;
        setFocusState(prev => ({ ...prev, bottomButtonIndex: -1, navIndex: lastNavIndex }));
        return;
      }

      // Handle navigation within expanded sections
      if (section && section.node.expandable && isExpanded(section.node) && section.childIndex >= 0) {
        if (section.childIndex === 0) {
          // Exit child navigation
          setFocusState(prev => ({
            ...prev,
            projectIndex: -1,
            researchIndex: -1,
            backstageIndex: -1,
          }));
        } else {
          // Navigate to previous child
          const key = section.node.path === '/projects' ? 'projectIndex' :
                     section.node.path === '/research' ? 'researchIndex' : 'backstageIndex';
          setFocusState(prev => ({ ...prev, [key]: section.childIndex - 1 }));
        }
        return;
      }

      // Navigate between top-level items
      if (focusState.navIndex > 0) {
        setFocusState(prev => ({ ...prev, navIndex: prev.navIndex - 1 }));
      } else if (focusState.navIndex === 0) {
        // Loop to bottom buttons
        setFocusState(prev => ({ ...prev, navIndex: -1, bottomButtonIndex: bottomButtons.length - 1 }));
      }
    } else {
      // Handle down navigation
      if (focusState.bottomButtonIndex >= 0) {
        // From bottom buttons, loop to top
        setFocusState(prev => ({ ...prev, bottomButtonIndex: -1, navIndex: 0 }));
        return;
      }

      // Handle navigation within expanded sections
      if (section && section.node.expandable && isExpanded(section.node)) {
        if (section.childIndex === -1 && section.node.children && section.node.children.length > 0) {
          // Enter child navigation
          const key = section.node.path === '/projects' ? 'projectIndex' :
                     section.node.path === '/research' ? 'researchIndex' : 'backstageIndex';
          setFocusState(prev => ({ ...prev, [key]: 0 }));
          return;
        } else if (section.childIndex >= 0 && section.node.children && 
                  section.childIndex < section.node.children.length - 1) {
          // Navigate to next child
          const key = section.node.path === '/projects' ? 'projectIndex' :
                     section.node.path === '/research' ? 'researchIndex' : 'backstageIndex';
          setFocusState(prev => ({ ...prev, [key]: section.childIndex + 1 }));
          return;
        }
      }

      // Navigate between top-level items
      if (focusState.navIndex < tree.length - 1) {
        setFocusState(prev => ({ 
          ...prev, 
          navIndex: prev.navIndex + 1,
          projectIndex: -1,
          researchIndex: -1,
          backstageIndex: -1,
        }));
      } else {
        // Go to bottom buttons
        setFocusState(prev => ({ ...prev, navIndex: -1, bottomButtonIndex: 0 }));
      }
    }
  }, [buildNavigationTree, getFocusedSection, focusState, isExpanded, backstageUnlocked]);

  // Navigate sidebar horizontally
  const navigateSidebarHorizontal = useCallback((direction: 'left' | 'right') => {
    // Handle bottom buttons
    if (focusState.bottomButtonIndex >= 0) {
      if (direction === 'right') {
        setFocusState(prev => ({ 
          ...prev, 
          bottomButtonIndex: (prev.bottomButtonIndex + 1) % bottomButtons.length 
        }));
      } else {
        setFocusState(prev => ({ 
          ...prev, 
          bottomButtonIndex: prev.bottomButtonIndex === 0 ? bottomButtons.length - 1 : prev.bottomButtonIndex - 1
        }));
      }
      return;
    }

    const section = getFocusedSection();
    if (!section) return;

    if (direction === 'right') {
      // Expand section or switch to main
      if (section.node.expandable && !isExpanded(section.node)) {
        toggleExpansion(section.node);
      } else {
        // Switch to main area
        const mainElement = document.querySelector('main');
        if (mainElement) {
          const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
          if (focusableElements.length > 0) {
            dispatch(setFocusArea('main'));
            if (focusState.mainIndex === -1) {
              setFocusState(prev => ({ ...prev, mainIndex: 0 }));
            }
          }
        }
      }
    } else {
      // Collapse section or switch to main
      if (section.node.expandable && isExpanded(section.node)) {
        toggleExpansion(section.node);
        // Clear child focus
        setFocusState(prev => ({
          ...prev,
          projectIndex: -1,
          researchIndex: -1,
          backstageIndex: -1,
        }));
      } else {
        // Switch to main area (wraps around)
        const mainElement = document.querySelector('main');
        if (mainElement) {
          const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
          if (focusableElements.length > 0) {
            dispatch(setFocusArea('main'));
            if (focusState.mainIndex === -1) {
              setFocusState(prev => ({ ...prev, mainIndex: 0 }));
            }
          }
        }
      }
    }
  }, [focusState, getFocusedSection, isExpanded, toggleExpansion, dispatch]);

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
    const current = focusState.mainIndex >= 0 && focusState.mainIndex < elements.length ? 
                   elements[focusState.mainIndex] : null;

    const findClosest = (candidates: typeof elements) => 
      candidates.reduce((prev, curr) => {
        const prevDist = Math.hypot(current!.x - prev.x, current!.y - prev.y);
        const currDist = Math.hypot(current!.x - curr.x, current!.y - curr.y);
        return currDist < prevDist ? curr : prev;
      });

    switch (key) {
      case 'ArrowUp':
        if (!event.metaKey && !event.ctrlKey) event.preventDefault();
        if (current) {
          const candidates = elements.filter(el => 
            el.y < current.y - 10 && 
            Math.abs(el.x - current.x) < Math.max(el.rect.width, current.rect.width)
          );
          if (candidates.length > 0) {
            setFocusState(prev => ({ ...prev, mainIndex: findClosest(candidates).index }));
          }
        } else {
          setFocusState(prev => ({ ...prev, mainIndex: 0 }));
        }
        break;

      case 'ArrowDown':
        if (!event.metaKey && !event.ctrlKey) event.preventDefault();
        if (current) {
          const candidates = elements.filter(el => 
            el.y > current.y + 10 && 
            Math.abs(el.x - current.x) < Math.max(el.rect.width, current.rect.width)
          );
          if (candidates.length > 0) {
            setFocusState(prev => ({ ...prev, mainIndex: findClosest(candidates).index }));
          }
        } else {
          setFocusState(prev => ({ ...prev, mainIndex: 0 }));
        }
        break;

      case 'ArrowLeft':
        if (!event.metaKey && !event.ctrlKey) event.preventDefault();
        if (current) {
          const candidates = elements.filter(el => 
            el.x < current.x - 10 && 
            Math.abs(el.y - current.y) < Math.max(el.rect.height, current.rect.height) / 2
          );
          if (candidates.length > 0) {
            setFocusState(prev => ({ ...prev, mainIndex: findClosest(candidates).index }));
          } else if (sidebarVisible) {
            dispatch(setFocusArea('sidebar'));
          }
        } else {
          setFocusState(prev => ({ ...prev, mainIndex: 0 }));
        }
        break;

      case 'ArrowRight':
        if (!event.metaKey && !event.ctrlKey) event.preventDefault();
        if (current) {
          const candidates = elements.filter(el => 
            el.x > current.x + 10 && 
            Math.abs(el.y - current.y) < Math.max(el.rect.height, current.rect.height) / 2
          );
          if (candidates.length > 0) {
            setFocusState(prev => ({ ...prev, mainIndex: findClosest(candidates).index }));
          }
        } else {
          setFocusState(prev => ({ ...prev, mainIndex: 0 }));
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (focusState.mainIndex >= 0 && focusState.mainIndex < focusableElements.length) {
          focusableElements[focusState.mainIndex].click();
        }
        break;
    }
  }, [focusState, sidebarVisible, dispatch]);

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
        const mainElement = document.querySelector('main');
        if (mainElement) {
          const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
          if (focusableElements.length > 0) {
            dispatch(setFocusArea('main'));
            if (focusState.mainIndex === -1) {
              setFocusState(prev => ({ ...prev, mainIndex: 0 }));
            }
          }
        }
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

    // ESC to close modals or collapse sections
    if (event.key === 'Escape') {
      event.preventDefault();
      if (showControls || showSettings) {
        dispatch(closeAllModals());
      } else {
        dispatch(setProjectsOpen(false));
        dispatch(setResearchOpen(false));
        dispatch(setBackstageOpen(false));
        setFocusState({
          navIndex: -1,
          projectIndex: -1,
          researchIndex: -1,
          backstageIndex: -1,
          bottomButtonIndex: -1,
          mainIndex: focusState.mainIndex,
        });
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
          navigateSidebar('up');
          break;
        case 'ArrowDown':
          navigateSidebar('down');
          break;
        case 'ArrowLeft':
          navigateSidebarHorizontal('left');
          break;
        case 'ArrowRight':
          navigateSidebarHorizontal('right');
          break;
        case 'Enter':
          event.preventDefault();
          if (focusState.bottomButtonIndex >= 0) {
            // Execute bottom button action
            const button = bottomButtons[focusState.bottomButtonIndex];
            button.action();
          } else {
            // Navigate to selected item
            const section = getFocusedSection();
            if (section) {
              if (section.childIndex >= 0 && section.node.children) {
                navigate(section.node.children[section.childIndex].path);
              } else {
                navigate(section.node.path);
              }
            }
          }
          break;
      }
    }
  }, [dispatch, showControls, showSettings, focusArea, sidebarVisible, navigateSidebar, navigateSidebarHorizontal, navigateMainArea, getFocusedSection, navigate, focusState]);

  // Set up event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Apply visual focus to main area elements
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    
    const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    
    if (focusArea === 'main') {
      focusableElements.forEach((element, index) => {
        if (index === focusState.mainIndex) {
          element.classList.add('ring-2', 'ring-black', 'ring-offset-2', 'rounded');
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
  }, [focusState.mainIndex, focusArea, location.pathname]);

  return useMemo(() => ({
    focusState,
    getFocusedSection,
    isExpanded,
    toggleExpansion,
    bottomButtons,
  }), [focusState, getFocusedSection, isExpanded, toggleExpansion]);
} 