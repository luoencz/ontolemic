import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { PageInfo } from './pageRegistry';

export interface SearchResult {
  pageTitle: string;
  pagePath: string;
  text: string;
  context: string;
  index: number;
}

// Extract text content from a React component
export function extractTextFromComponent(component: React.ComponentType): string {
  try {
    const element = React.createElement(component);
    const html = ReactDOMServer.renderToStaticMarkup(element);
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

// Cache for loaded page content
const contentCache = new Map<string, string>();

// Load and extract content from a page
async function loadPageContent(page: PageInfo): Promise<string> {
  // Check cache first
  if (contentCache.has(page.path)) {
    return contentCache.get(page.path)!;
  }

  try {
    const module = await page.loader();
    const Component = module.default;
    const content = extractTextFromComponent(Component);
    
    // Cache the content
    contentCache.set(page.path, content);
    
    return content;
  } catch (error) {
    console.error(`Error loading page ${page.path}:`, error);
    return '';
  }
}

// Search for text in all pages (async version)
export async function searchPages(query: string, pages: PageInfo[]): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];
  
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Load all page content in parallel
  const pageContents = await Promise.all(
    pages.map(async (page) => ({
      page,
      content: await loadPageContent(page)
    }))
  );
  
  // Search through loaded content
  pageContents.forEach(({ page, content }) => {
    const lowerContent = content.toLowerCase();
    let startIndex = 0;
    
    while (true) {
      const index = lowerContent.indexOf(lowerQuery, startIndex);
      if (index === -1) break;
      
      // Extract context around the match
      const contextStart = Math.max(0, index - 50);
      const contextEnd = Math.min(content.length, index + query.length + 50);
      const context = content.slice(contextStart, contextEnd);
      
      results.push({
        pageTitle: page.title,
        pagePath: page.path,
        text: content.slice(index, index + query.length),
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