import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSidebar, toggleSound, setShowControls, setShowSettings, closeAllModals } from '../store/slices/uiSlice';
import { setProjectsOpen, setFocusArea } from '../store/slices/navigationSlice';
import { navItems, projectItems } from '../components/Sidebar';

export function useKeyboardNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const showControls = useAppSelector(state => state.ui.showControls);
  const showSettings = useAppSelector(state => state.ui.showSettings);
  const projectsOpen = useAppSelector(state => state.navigation.projectsOpen);
  const focusArea = useAppSelector(state => state.navigation.focusArea);
  
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [focusedProjectIndex, setFocusedProjectIndex] = useState(-1);
  const [mainFocusedIndex, setMainFocusedIndex] = useState(-1);
  const [bottomButtonFocused, setBottomButtonFocused] = useState(-1);

  // Set initial focus to current page
  useEffect(() => {
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
    }
  }, [location.pathname, dispatch]);

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
        dispatch(setFocusArea('sidebar'));
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
      setFocusedIndex(-1);
      setFocusedProjectIndex(-1);
      setBottomButtonFocused(-1);
      return;
    }

    // Don't process navigation keys when modals are open
    if (showControls || showSettings) return;

    // Handle navigation based on focus area
    if (focusArea === 'main') {
      const mainElement = document.querySelector('main');
      if (!mainElement) return;
      
      const focusableElements = mainElement.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      const focusableArray = Array.from(focusableElements);
      
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          if (focusableArray.length > 0) {
            setMainFocusedIndex(prev => prev <= 0 ? focusableArray.length - 1 : prev - 1);
          }
          break;
          
        case 'ArrowDown':
          event.preventDefault();
          if (focusableArray.length > 0) {
            setMainFocusedIndex(prev => prev >= focusableArray.length - 1 ? 0 : prev + 1);
          }
          break;
          
        case 'ArrowLeft':
        case 'ArrowRight':
          event.preventDefault();
          // Switch to sidebar focus area
          dispatch(setFocusArea('sidebar'));
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

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        // Handle navigation from bottom buttons
        if (bottomButtonFocused >= 0) {
          setBottomButtonFocused(-1);
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
          setFocusedIndex(prev => prev - 1);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        // Handle navigation from nav items
        if (focusedIndex === navItems.length - 1 && focusedProjectIndex === -1) {
          // From Contact, go to bottom buttons
          setFocusedIndex(-1);
          setBottomButtonFocused(0);
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
          setFocusedIndex(prev => prev >= navItems.length - 1 ? 0 : prev + 1);
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
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
          setFocusedProjectIndex(0);
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
        event.preventDefault();
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
        // Handle project navigation
        else if (focusedProjectIndex >= 0 && projectsOpen) {
          const projectItem = projectItems[focusedProjectIndex];
          navigate(projectItem.path);
        } else if (focusedIndex >= 0 && focusedIndex < navItems.length) {
          const item = navItems[focusedIndex];
          navigate(item.path);
        }
        break;
    }
  }, [focusedIndex, focusedProjectIndex, projectsOpen, navigate, showControls, showSettings, focusArea, mainFocusedIndex, dispatch, bottomButtonFocused]);

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
  }, [mainFocusedIndex, focusArea]);

  return {
    focusedIndex,
    focusedProjectIndex,
    mainFocusedIndex,
    bottomButtonFocused,
  };
} 