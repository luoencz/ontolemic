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
        highlightSearchTerms(searchTerm);
        
        if (searchIndex) {
          scrollToFirstHighlight();
          // Clear the session storage after use
          sessionStorage.removeItem('searchTerm');
          sessionStorage.removeItem('searchIndex');
        }
      }, 100);
    }
  }, [location]);
}

function highlightSearchTerms(searchTerm: string) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Skip script and style tags
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
  
  while (node = walker.nextNode()) {
    if (node.textContent && node.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
      textNodes.push(node as Text);
    }
  }

  // Highlight each occurrence
  textNodes.forEach(textNode => {
    const parent = textNode.parentElement;
    if (!parent) return;

    const text = textNode.textContent || '';
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    if (parts.length > 1) {
      const fragment = document.createDocumentFragment();
      
      parts.forEach((part, index) => {
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
  });
}

function scrollToFirstHighlight() {
  const firstHighlight = document.querySelector('.search-highlight');
  if (firstHighlight) {
    firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Add a pulsing animation to draw attention
    firstHighlight.classList.add('animate-pulse');
    setTimeout(() => {
      firstHighlight.classList.remove('animate-pulse');
    }, 2000);
  }
} 