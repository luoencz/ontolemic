import React from 'react';
import ReactDOMServer from 'react-dom/server';
import type { SiteNode } from '../types/navigation';
import { mainSiteMap, backstageRoot } from '../data/navigation-graph';

export interface SearchResult {
  pageTitle: string;
  pagePath: string;
  text: string;
  context: string;
  index: number;
}

export interface PageInfo {
  title: string;
  path: string;
  loader: () => Promise<any>;
}

function joinPaths(parent: string, segment?: string): string {
  if (!segment) return parent;
  return `${parent.replace(/\/$/, '')}/${segment}`;
}

function collectPages(nodes: SiteNode[], basePath: string, acc: PageInfo[]): void {
  for (const node of nodes) {
    const fullPath = joinPaths(basePath, node.segment);
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const hasPage = typeof node.lazyImport === 'function';

    if (node.segment) {
      if (hasChildren) {
        collectPages(node.children!, fullPath, acc);
      }
      if (hasPage) {
        // Index page at this route
        acc.push({ title: node.label, path: fullPath, loader: node.lazyImport! });
      }
    } else if (hasPage) {
      // Index page at current base path
      acc.push({ title: node.label, path: basePath, loader: node.lazyImport! });
    }
  }
}

export function getSearchablePages(): PageInfo[] {
  const pages: PageInfo[] = [];
  collectPages(mainSiteMap, '/', pages);
  collectPages([backstageRoot], '/', pages);
  return pages;
}

export function extractTextFromComponent(component: React.ComponentType): string {
  try {
    const element = React.createElement(component);
    const html = ReactDOMServer.renderToStaticMarkup(element);
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