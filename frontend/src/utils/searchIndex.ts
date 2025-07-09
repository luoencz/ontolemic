import { ReactElement } from 'react';
import ReactDOMServer from 'react-dom/server';

export interface SearchResult {
  pageTitle: string;
  pagePath: string;
  text: string;
  context: string;
  index: number;
}

export interface PageContent {
  title: string;
  path: string;
  content: string;
  component: () => ReactElement;
}

// Extract text content from a React component
export function extractTextFromComponent(component: () => ReactElement): string {
  try {
    const html = ReactDOMServer.renderToStaticMarkup(component());
    // Remove HTML tags and normalize whitespace
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (error) {
    console.error('Error extracting text:', error);
    return '';
  }
}

// Search for text in all pages
export function searchPages(query: string, pages: PageContent[]): SearchResult[] {
  if (!query || query.length < 2) return [];
  
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  
  pages.forEach(page => {
    const lowerContent = page.content.toLowerCase();
    let startIndex = 0;
    
    while (true) {
      const index = lowerContent.indexOf(lowerQuery, startIndex);
      if (index === -1) break;
      
      // Extract context around the match
      const contextStart = Math.max(0, index - 50);
      const contextEnd = Math.min(page.content.length, index + query.length + 50);
      const context = page.content.slice(contextStart, contextEnd);
      
      results.push({
        pageTitle: page.title,
        pagePath: page.path,
        text: page.content.slice(index, index + query.length),
        context: context,
        index: index
      });
      
      startIndex = index + 1;
    }
  });
  
  return results;
}

// Highlight search term in text
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-300">$1</mark>');
} 