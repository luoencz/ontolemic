import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useSearchHighlight() {
  const location = useLocation();

  useEffect(() => {
    const searchTerm = sessionStorage.getItem('searchTerm');
    const searchIndex = sessionStorage.getItem('searchIndex');
    
    if (searchTerm && searchIndex) {
      // Small delay to ensure page is rendered
      setTimeout(() => {
        highlightSpecificOccurrence(searchTerm, parseInt(searchIndex));
        
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

function highlightSpecificOccurrence(searchTerm: string, targetIndex: number) {
  // First, find the occurrence in the full document to match the search index
  const fullTextWalker = document.createTreeWalker(
    document.body,
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

  let currentPosition = 0;
  let node: Node | null;
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  while (node = fullTextWalker.nextNode()) {
    const text = node.textContent || '';
    const lowerText = text.toLowerCase();
    let searchPosition = 0;
    
    // Find all occurrences in this text node
    while (true) {
      const position = lowerText.indexOf(lowerSearchTerm, searchPosition);
      if (position === -1) break;
      
      // Check if this is the target occurrence by index
      if (currentPosition + position === targetIndex) {
        // Check if this node is within the main element
        const mainElement = document.querySelector('main');
        if (mainElement && mainElement.contains(node)) {
          highlightTextInNode(node as Text, position, searchTerm.length);
          scrollToHighlight();
        }
        return;
      }
      
      searchPosition = position + 1;
    }
    
    currentPosition += text.length;
  }
}

function highlightTextInNode(textNode: Text, startOffset: number, length: number) {
  const parent = textNode.parentElement;
  if (!parent) return;

  const text = textNode.textContent || '';
  const beforeText = text.substring(0, startOffset);
  const highlightText = text.substring(startOffset, startOffset + length);
  const afterText = text.substring(startOffset + length);

  const fragment = document.createDocumentFragment();
  
  if (beforeText) {
    fragment.appendChild(document.createTextNode(beforeText));
  }
  
  const mark = document.createElement('mark');
  mark.className = 'bg-yellow-300 search-highlight';
  mark.textContent = highlightText;
  fragment.appendChild(mark);
  
  if (afterText) {
    fragment.appendChild(document.createTextNode(afterText));
  }

  parent.replaceChild(fragment, textNode);
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