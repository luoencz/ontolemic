import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useSearchHighlight() {
  const location = useLocation();

  useEffect(() => {
    const searchTerm = sessionStorage.getItem('searchTerm');
    const searchIndex = sessionStorage.getItem('searchIndex');
    
    if (searchTerm) {
      // Small delay to ensure page is rendered
      setTimeout(() => {
        highlightSearchTerm(searchTerm);
        
        // Clear the session storage after use
        sessionStorage.removeItem('searchTerm');
        sessionStorage.removeItem('searchIndex');
      }, 100);
    }
  }, [location]);

  // Add ESC key handler to clear highlights
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Check if any highlights exist
        const highlights = document.querySelectorAll('.search-highlight');
        if (highlights.length > 0) {
          e.preventDefault();
          e.stopPropagation();
          clearSearchHighlights();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, []);
}

function clearSearchHighlights() {
  const highlights = document.querySelectorAll('.search-highlight');
  
  highlights.forEach(highlight => {
    const parent = highlight.parentElement;
    if (!parent) return;
    
    // Get the text content
    const text = highlight.textContent || '';
    
    // Replace the highlight element with a text node
    const textNode = document.createTextNode(text);
    parent.replaceChild(textNode, highlight);
    
    // Normalize the parent to merge adjacent text nodes
    parent.normalize();
  });
}

function highlightSearchTerm(searchTerm: string) {
  // Only search within the main content area
  const mainElement = document.querySelector('main');
  if (!mainElement) return;

  const walker = document.createTreeWalker(
    mainElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (parent?.tagName === 'SCRIPT' || parent?.tagName === 'STYLE') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes: Text[] = [];
  let node: Node | null;
  
  // Collect all text nodes that contain the search term
  while (node = walker.nextNode()) {
    if (node.textContent && node.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
      textNodes.push(node as Text);
    }
  }

  // Process nodes in reverse order to avoid messing up positions
  textNodes.reverse().forEach(textNode => {
    highlightAllOccurrencesInNode(textNode, searchTerm);
  });

  // Scroll to the first highlight
  scrollToHighlight();
}

function highlightAllOccurrencesInNode(textNode: Text, searchTerm: string) {
  const parent = textNode.parentElement;
  if (!parent) return;

  const text = textNode.textContent || '';
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  const parts = text.split(regex);

  if (parts.length > 1) {
    const fragment = document.createDocumentFragment();
    
    parts.forEach((part) => {
      if (regex.test(part)) {
        const mark = document.createElement('mark');
        mark.className = 'bg-yellow-300 search-highlight';
        mark.textContent = part;
        fragment.appendChild(mark);
      } else {
        fragment.appendChild(document.createTextNode(part));
      }
    });

    parent.replaceChild(fragment, textNode);
  }
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function scrollToHighlight() {
  const highlight = document.querySelector('.search-highlight');
  if (highlight) {
    highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Add a pulsing animation to draw attention
    highlight.classList.add('animate-pulse');
    setTimeout(() => {
      highlight.classList.remove('animate-pulse');
    }, 2000);
  }
} 