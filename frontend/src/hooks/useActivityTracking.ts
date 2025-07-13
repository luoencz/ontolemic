import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const STATS_API_URL = 'https://home.the-o.space/stats';
const INACTIVITY_THRESHOLD = 60000; // 60 seconds
const UPDATE_INTERVAL = 5000; // Update every 5 seconds
const DEBOUNCE_DELAY = 1000; // Debounce interactions

type InteractionType = 'click' | 'scroll' | 'keypress' | 'mousemove' | 'focus';

export function useActivityTracking() {
  const location = useLocation();
  const lastActivityRef = useRef<number>(Date.now());
  const pageStartTimeRef = useRef<number>(Date.now());
  const engagementTimeRef = useRef<number>(0);
  const updateTimerRef = useRef<number | null>(null);
  const inactivityTimerRef = useRef<number | null>(null);
  const lastScrollDepthRef = useRef<number>(0);
  const maxScrollDepthRef = useRef<number>(0);
  const interactionQueueRef = useRef<Set<InteractionType>>(new Set());
  const lastInteractionTimeRef = useRef<number>(0);

  // Calculate scroll depth
  const calculateScrollDepth = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // If the entire document fits in the viewport, user has seen 100%
    if (documentHeight <= windowHeight) {
      return 100;
    }
    
    // Calculate how much of the document is currently visible
    const viewportBottom = scrollTop + windowHeight;
    
    // The percentage of document that has been viewed
    // (how far down the bottom of the viewport has reached)
    const percentViewed = Math.round((viewportBottom / documentHeight) * 100);
    
    // Cap at 100% (can sometimes exceed due to bounce effects)
    return Math.min(percentViewed, 100);
  }, []);

  // Send activity data to server
  const sendActivity = useCallback(async (interactionType: InteractionType, details?: any) => {
    try {
      await fetch(`${STATS_API_URL}/api/track-activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pagePath: location.pathname,
          pageTitle: document.title,
          interactionType,
          details
        })
      });
    } catch (error) {
      console.debug('Activity tracking error:', error);
    }
  }, [location.pathname]);

  // Send engagement update
  const sendEngagementUpdate = useCallback(async () => {
    const currentTime = Date.now();
    const totalPageTime = Math.floor((currentTime - pageStartTimeRef.current) / 1000);
    const scrollDepth = calculateScrollDepth();
    
    // Update max scroll depth if current is higher
    if (scrollDepth > maxScrollDepthRef.current) {
      maxScrollDepthRef.current = scrollDepth;
    }
    
    try {
      await fetch(`${STATS_API_URL}/api/update-engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pagePath: location.pathname,
          duration: totalPageTime,
          scrollDepth: maxScrollDepthRef.current // Send the maximum depth reached
        })
      });
      
      lastScrollDepthRef.current = scrollDepth;
    } catch (error) {
      console.debug('Engagement update error:', error);
    }
  }, [location.pathname, calculateScrollDepth]);

  // Process queued interactions
  const processInteractionQueue = useCallback(() => {
    const now = Date.now();
    if (now - lastInteractionTimeRef.current < DEBOUNCE_DELAY) {
      return;
    }
    
    if (interactionQueueRef.current.size > 0) {
      // Send the most important interaction type
      const interactions = Array.from(interactionQueueRef.current);
      const priorityOrder: InteractionType[] = ['click', 'keypress', 'scroll', 'focus', 'mousemove'];
      const interaction = priorityOrder.find(type => interactions.includes(type)) || interactions[0];
      
      sendActivity(interaction);
      interactionQueueRef.current.clear();
      lastInteractionTimeRef.current = now;
    }
  }, [sendActivity]);

  // Handle user activity
  const handleActivity = useCallback((interactionType: InteractionType) => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // If user was inactive, start a new active session
    if (timeSinceLastActivity > INACTIVITY_THRESHOLD) {
      pageStartTimeRef.current = now;
      engagementTimeRef.current = 0;
      maxScrollDepthRef.current = calculateScrollDepth(); // Reset max scroll depth
    }
    
    lastActivityRef.current = now;
    interactionQueueRef.current.add(interactionType);
    
    // Update max scroll depth on scroll events
    if (interactionType === 'scroll') {
      const currentDepth = calculateScrollDepth();
      if (currentDepth > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = currentDepth;
      }
    }
    
    // Reset inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    inactivityTimerRef.current = setTimeout(() => {
      // Mark session as inactive after threshold
      sendEngagementUpdate();
    }, INACTIVITY_THRESHOLD);
    
    // Process interactions with debouncing
    setTimeout(processInteractionQueue, DEBOUNCE_DELAY);
  }, [sendEngagementUpdate, processInteractionQueue, calculateScrollDepth]);

  // Set up periodic engagement updates
  useEffect(() => {
    updateTimerRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      
      // Only update if user is active
      if (timeSinceLastActivity < INACTIVITY_THRESHOLD) {
        sendEngagementUpdate();
      }
    }, UPDATE_INTERVAL);

    return () => {
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
      }
    };
  }, [sendEngagementUpdate]);

  // Track page changes
  useEffect(() => {
    // Reset timers on page change
    pageStartTimeRef.current = Date.now();
    engagementTimeRef.current = 0;
    lastScrollDepthRef.current = 0;
    maxScrollDepthRef.current = calculateScrollDepth(); // Initialize with current view
    lastActivityRef.current = Date.now();
    
    // Track initial page view as activity
    sendActivity('focus', { source: 'pageLoad' });
  }, [location.pathname, sendActivity, calculateScrollDepth]);

  // Set up event listeners
  useEffect(() => {
    const handleClick = () => handleActivity('click');
    const handleScroll = () => handleActivity('scroll');
    const handleKeyPress = () => handleActivity('keypress');
    const handleMouseMove = () => handleActivity('mousemove');
    const handleFocus = () => handleActivity('focus');
    
    // Page visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        sendEngagementUpdate();
      } else {
        lastActivityRef.current = Date.now();
        handleActivity('focus');
      }
    };
    
    // Before unload
    const handleBeforeUnload = () => {
      sendEngagementUpdate();
    };

    // Add event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('keypress', handleKeyPress);
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Clean up
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Send final update
      sendEngagementUpdate();
      
      // Clear timers
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [handleActivity, sendEngagementUpdate]);
} 