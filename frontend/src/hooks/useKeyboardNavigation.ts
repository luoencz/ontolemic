import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSidebar, toggleSound, setShowControls, setShowSettings, closeAllModals } from '../store/slices/uiSlice';
import { setProjectsOpen, setBackstageOpen, setFocusArea } from '../store/slices/navigationSlice';
import { navItems, projectItems, backstageItems } from '../components/Sidebar';

export function useKeyboardNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const showControls = useAppSelector(state => state.ui.showControls);
  const showSettings = useAppSelector(state => state.ui.showSettings);
  const backstageUnlocked = useAppSelector(state => state.ui.backstageUnlocked);
  const sidebarVisible = useAppSelector(state => state.ui.sidebarVisible);
  const projectsOpen = useAppSelector(state => state.navigation.projectsOpen);
  const backstageOpen = useAppSelector(state => state.navigation.backstageOpen);
  const focusArea = useAppSelector(state => state.navigation.focusArea);
  
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [focusedProjectIndex, setFocusedProjectIndex] = useState(-1);
  const [focusedBackstageIndex, setFocusedBackstageIndex] = useState(-1);
  const [mainFocusedIndex, setMainFocusedIndex] = useState(-1);
  const [bottomButtonFocused, setBottomButtonFocused] = useState(-1);

  // Set initial focus to current page
  useEffect(() => {
    // Only set sidebar focus if sidebar is visible
    if (sidebarVisible) {
      // Always reset focus to sidebar when navigating to a new page
      dispatch(setFocusArea('sidebar'));
      
      const currentIndex = navItems.findIndex(item => 
        item.path === location.pathname || 
        (item.isDropdown && location.pathname.startsWith('/projects'))
      );
      if (currentIndex !== -1) {
        setFocusedIndex(currentIndex);
        
        if (location.pathname.startsWith('/projects/')) {
          dispatch(setProjectsOpen(true));
          const currentProjectIndex = projectItems.findIndex(item => item.path === location.pathname);
          if (currentProjectIndex !== -1) {
            setFocusedProjectIndex(currentProjectIndex);
          }
        }
      } else if (location.pathname.startsWith('/backstage')) {
        // Handle backstage focus
        setFocusedIndex(navItems.length); // Backstage is after all nav items
        
        // Only auto-expand if we're on a sub-page, not the main backstage page
        if (location.pathname !== '/backstage') {
          dispatch(setBackstageOpen(true));
          const currentBackstageIndex = backstageItems.findIndex(item => item.path === location.pathname);
          if (currentBackstageIndex !== -1) {
            setFocusedBackstageIndex(currentBackstageIndex);
          }
        }
      }
    } else {
      // If sidebar is hidden, focus on main area
      dispatch(setFocusArea('main'));
    }
  }, [location.pathname, dispatch, sidebarVisible]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't handle keyboard navigation when typing in input fields or textareas
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Handle Tab key to switch focus areas
    if (event.key === 'Tab') {
      event.preventDefault();
      
      if (focusArea === 'sidebar') {
        const mainElement = document.querySelector('main');
        if (mainElement) {
          const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
          if (focusableElements.length > 0) {
            dispatch(setFocusArea('main'));
            if (mainFocusedIndex === -1) {
              setMainFocusedIndex(0);
            }
          }
        }
      } else {
        // Only switch to sidebar if it's visible
        if (sidebarVisible) {
          dispatch(setFocusArea('sidebar'));
        }
      }
      return;
    }

    // Handle modal shortcuts with Command/Ctrl key
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

    // Handle ESC to close modals
    if (event.key === 'Escape') {
      event.preventDefault();
      if (showControls || showSettings) {
        dispatch(closeAllModals());
        return;
      }
      dispatch(setProjectsOpen(false));
      dispatch(setBackstageOpen(false));
      setFocusedIndex(-1);
      setFocusedProjectIndex(-1);
      setFocusedBackstageIndex(-1);
      setBottomButtonFocused(-1);
      return;
    }

    // Don't process navigation keys when modals are open
    if (showControls || showSettings) return;

    // Don't process arrow navigation when Cmd/Ctrl is pressed (preserve browser shortcuts)
    if ((event.metaKey || event.ctrlKey) && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return;
    }

    // Handle navigation based on focus area
    if (focusArea === 'main') {
      const mainElement = document.querySelector('main');
      if (!mainElement) return;
      
      const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      const focusableArray = Array.from(focusableElements) as HTMLElement[];
      
      if (focusableArray.length === 0) return;

      // Get positions of all focusable elements
      const getElementCenter = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          element,
          rect
        };
      };

      const elements = focusableArray.map((el, index) => ({
        ...getElementCenter(el),
        index
      }));

      const currentElement = mainFocusedIndex >= 0 && mainFocusedIndex < elements.length 
        ? elements[mainFocusedIndex] 
        : null;

      switch (event.key) {
        case 'ArrowUp':
          // Don't prevent default if Cmd/Ctrl is pressed (preserve browser shortcuts)
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault();
          }
          if (currentElement) {
            // Find element above current one
            const candidates = elements.filter(el => 
              el.y < currentElement.y - 10 && // Must be above
              Math.abs(el.x - currentElement.x) < Math.max(el.rect.width, currentElement.rect.width) // Horizontally overlapping
            );
            
            if (candidates.length > 0) {
              // Find the closest one
              const closest = candidates.reduce((prev, curr) => 
                (currentElement.y - curr.y) < (currentElement.y - prev.y) ? curr : prev
              );
              setMainFocusedIndex(closest.index);
            } else {
              // No element above, keep the same index but it won't be visually focused
              // This is handled by the focus styling effect
            }
          } else {
            setMainFocusedIndex(0);
          }
          break;
          
        case 'ArrowDown':
          // Don't prevent default if Cmd/Ctrl is pressed (preserve browser shortcuts)
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault();
          }
          if (currentElement) {
            // Find element below current one
            const candidates = elements.filter(el => 
              el.y > currentElement.y + 10 && // Must be below
              Math.abs(el.x - currentElement.x) < Math.max(el.rect.width, currentElement.rect.width) // Horizontally overlapping
            );
            
            if (candidates.length > 0) {
              // Find the closest one
              const closest = candidates.reduce((prev, curr) => 
                (curr.y - currentElement.y) < (prev.y - currentElement.y) ? curr : prev
              );
              setMainFocusedIndex(closest.index);
            } else {
              // No element below, keep the same index but it won't be visually focused
              // This is handled by the focus styling effect
            }
          } else {
            setMainFocusedIndex(0);
          }
          break;
          
        case 'ArrowLeft':
          // Don't prevent default if Cmd/Ctrl is pressed (preserve browser shortcuts)
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault();
          }
          if (currentElement) {
            // Find element to the left
            const candidates = elements.filter(el => 
              el.x < currentElement.x - 10 && // Must be to the left
              Math.abs(el.y - currentElement.y) < Math.max(el.rect.height, currentElement.rect.height) / 2 // Vertically aligned
            );
            
            if (candidates.length > 0) {
              // Find the closest one
              const closest = candidates.reduce((prev, curr) => 
                (currentElement.x - curr.x) < (currentElement.x - prev.x) ? curr : prev
              );
              setMainFocusedIndex(closest.index);
            } else {
              // No element to the left, switch to sidebar only if it's visible
              if (sidebarVisible) {
                dispatch(setFocusArea('sidebar'));
              }
            }
          } else {
            setMainFocusedIndex(0);
          }
          break;
          
        case 'ArrowRight':
          // Don't prevent default if Cmd/Ctrl is pressed (preserve browser shortcuts)
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault();
          }
          if (currentElement) {
            // Find element to the right
            const candidates = elements.filter(el => 
              el.x > currentElement.x + 10 && // Must be to the right
              Math.abs(el.y - currentElement.y) < Math.max(el.rect.height, currentElement.rect.height) / 2 // Vertically aligned
            );
            
            if (candidates.length > 0) {
              // Find the closest one
              const closest = candidates.reduce((prev, curr) => 
                (curr.x - currentElement.x) < (prev.x - currentElement.x) ? curr : prev
              );
              setMainFocusedIndex(closest.index);
            } else {
              // No element to the right, keep the same index but it won't be visually focused
              // This is handled by the focus styling effect
            }
          } else {
            setMainFocusedIndex(0);
          }
          break;
          
        case 'Enter':
          event.preventDefault();
          if (mainFocusedIndex >= 0 && mainFocusedIndex < focusableArray.length) {
            const element = focusableArray[mainFocusedIndex] as HTMLElement;
            element.click();
          }
          break;
      }
      return;
    }

    // Sidebar navigation
    if (focusArea !== 'sidebar') return;

    // If sidebar is not visible, don't process any navigation
    if (!sidebarVisible) return;

    switch (event.key) {
      case 'ArrowUp':
        // Don't prevent default if Cmd/Ctrl is pressed (preserve browser shortcuts)
        if (!event.metaKey && !event.ctrlKey) {
          event.preventDefault();
        }
        // Handle navigation from bottom buttons
        if (bottomButtonFocused >= 0) {
          setBottomButtonFocused(-1);
          if (backstageUnlocked) {
            setFocusedIndex(navItems.length); // Go to Backstage
          } else {
            setFocusedIndex(navItems.length - 1); // Go to Contact
          }
        }
        // Handle backstage navigation
        else if (backstageOpen && focusedIndex === navItems.length && focusedBackstageIndex >= 0) {
          if (focusedBackstageIndex === 0) {
            setFocusedBackstageIndex(-1);
          } else {
            setFocusedBackstageIndex(prev => prev - 1);
          }
        }
        // Navigate from backstage to last regular nav item
        else if (focusedIndex === navItems.length && focusedBackstageIndex === -1) {
          setFocusedIndex(navItems.length - 1); // Go to Contact
        }
        // Handle projects navigation
        else if (projectsOpen && focusedIndex === 2 && focusedProjectIndex >= 0) {
          if (focusedProjectIndex === 0) {
            setFocusedProjectIndex(-1);
          } else {
            setFocusedProjectIndex(prev => prev - 1);
          }
        } else if (focusedIndex === 3) {
          if (projectsOpen) {
            setFocusedIndex(2);
            setFocusedProjectIndex(projectItems.length - 1);
          } else {
            setFocusedIndex(2);
          }
        } else if (focusedIndex === 0) {
          // From About, loop to bottom buttons
          setFocusedIndex(-1);
          setBottomButtonFocused(3); // Start at the last button
        } else {
          setFocusedProjectIndex(-1);
          setFocusedBackstageIndex(-1);
          setFocusedIndex(prev => prev - 1);
        }
        break;

      case 'ArrowDown':
        // Don't prevent default if Cmd/Ctrl is pressed (preserve browser shortcuts)
        if (!event.metaKey && !event.ctrlKey) {
          event.preventDefault();
        }
        const isLastNavItem = focusedIndex === navItems.length - 1;
        const isBackstageItem = focusedIndex === navItems.length;
        
        // Handle navigation from nav items
        if (isLastNavItem && focusedProjectIndex === -1) {
          if (backstageUnlocked) {
            // From Contact, go to Backstage
            setFocusedIndex(navItems.length);
          } else {
            // From Contact, go to bottom buttons
            setFocusedIndex(-1);
            setBottomButtonFocused(0);
          }
        }
        // Handle navigation from backstage
        else if (isBackstageItem && focusedBackstageIndex === -1) {
          if (backstageOpen) {
            setFocusedBackstageIndex(0);
          } else {
            // Go to bottom buttons
            setFocusedIndex(-1);
            setBottomButtonFocused(0);
          }
        }
        // Handle navigation within backstage items
        else if (backstageOpen && isBackstageItem && focusedBackstageIndex >= 0) {
          if (focusedBackstageIndex === backstageItems.length - 1) {
            // From last backstage item, go to bottom buttons
            setFocusedBackstageIndex(-1);
            setFocusedIndex(-1);
            setBottomButtonFocused(0);
          } else {
            setFocusedBackstageIndex(prev => prev + 1);
          }
        }
        // Handle navigation from bottom buttons - loop to top
        else if (bottomButtonFocused >= 0) {
          setBottomButtonFocused(-1);
          setFocusedIndex(0);
        }
        // Handle projects navigation
        else if (projectsOpen && focusedIndex === 2 && focusedProjectIndex >= 0) {
          if (focusedProjectIndex === projectItems.length - 1) {
            setFocusedProjectIndex(-1);
            setFocusedIndex(3);
          } else {
            setFocusedProjectIndex(prev => prev + 1);
          }
        } else if (projectsOpen && focusedIndex === 2 && focusedProjectIndex === -1) {
          setFocusedProjectIndex(0);
        } else {
          setFocusedProjectIndex(-1);
          setFocusedBackstageIndex(-1);
          setFocusedIndex(prev => prev + 1);
        }
        break;

      case 'ArrowRight':
        // Don't prevent default if Cmd/Ctrl is pressed (preserve browser shortcuts)
        if (!event.metaKey && !event.ctrlKey) {
          event.preventDefault();
        }
        // If in bottom buttons row, navigate right
        if (bottomButtonFocused >= 0) {
          if (bottomButtonFocused < 3) {
            setBottomButtonFocused(prev => prev + 1);
          } else {
            setBottomButtonFocused(0); // Wrap around
          }
        }
        // If focused on expandable item (Projects), expand it
        else if (focusedIndex === 2 && navItems[2].isDropdown && !projectsOpen) {
          dispatch(setProjectsOpen(true));
          // Don't automatically focus first item - keep focus on the section
        }
        // If focused on Backstage, expand it
        else if (focusedIndex === navItems.length && !backstageOpen) {
          dispatch(setBackstageOpen(true));
          // Don't automatically focus first item - keep focus on the section
        } else {
          // Otherwise, switch to main focus area
          const mainElement = document.querySelector('main');
          if (mainElement) {
            const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
              dispatch(setFocusArea('main'));
              if (mainFocusedIndex === -1) {
                setMainFocusedIndex(0);
              }
            }
          }
        }
        break;

      case 'ArrowLeft':
        // Don't prevent default if Cmd/Ctrl is pressed (preserve browser shortcuts)
        if (!event.metaKey && !event.ctrlKey) {
          event.preventDefault();
        }
        // If in bottom buttons row, navigate left
        if (bottomButtonFocused >= 0) {
          if (bottomButtonFocused > 0) {
            setBottomButtonFocused(prev => prev - 1);
          } else {
            setBottomButtonFocused(3); // Wrap around
          }
        }
        // If focused on expandable item (Projects) and it's open, collapse it
        else if (focusedIndex === 2 && navItems[2].isDropdown && projectsOpen) {
          dispatch(setProjectsOpen(false));
          setFocusedProjectIndex(-1);
        }
        // If focused on Backstage and it's open, collapse it
        else if (focusedIndex === navItems.length && backstageOpen) {
          dispatch(setBackstageOpen(false));
          setFocusedBackstageIndex(-1);
        } else {
          // Otherwise, switch to main focus area (wraps around)
          const mainElement = document.querySelector('main');
          if (mainElement) {
            const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
              dispatch(setFocusArea('main'));
              if (mainFocusedIndex === -1) {
                setMainFocusedIndex(0);
              }
            }
          }
        }
        break;

      case 'Enter':
        event.preventDefault();
        // Handle bottom button clicks
        if (bottomButtonFocused >= 0) {
          switch (bottomButtonFocused) {
            case 0:
              dispatch(toggleSidebar());
              break;
            case 1:
              dispatch(setShowSettings(true));
              break;
            case 2:
              dispatch(toggleSound());
              break;
            case 3:
              dispatch(setShowControls(true));
              break;
          }
        }
        // Handle backstage navigation
        else if (focusedBackstageIndex >= 0 && backstageOpen) {
          const backstageItem = backstageItems[focusedBackstageIndex];
          navigate(backstageItem.path);
        }
        // Handle project navigation
        else if (focusedProjectIndex >= 0 && projectsOpen) {
          const projectItem = projectItems[focusedProjectIndex];
          navigate(projectItem.path);
        } else if (focusedIndex >= 0 && focusedIndex < navItems.length) {
          const item = navItems[focusedIndex];
          navigate(item.path);
        } else if (focusedIndex === navItems.length) {
          // Navigate to backstage home
          navigate('/backstage');
        }
        break;
    }
  }, [focusedIndex, focusedProjectIndex, focusedBackstageIndex, projectsOpen, backstageOpen, backstageUnlocked, navigate, showControls, showSettings, focusArea, mainFocusedIndex, dispatch, bottomButtonFocused, sidebarVisible]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Effect to apply focus styling to main area elements
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    
    const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    
    if (focusArea === 'main') {
      focusableElements.forEach((element, index) => {
        if (index === mainFocusedIndex) {
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
  }, [mainFocusedIndex, focusArea, location.pathname]);

  return {
    focusedIndex,
    focusedProjectIndex,
    focusedBackstageIndex,
    mainFocusedIndex,
    bottomButtonFocused,
  };
} 