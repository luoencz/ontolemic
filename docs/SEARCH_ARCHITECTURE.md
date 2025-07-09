# Search Functionality Architecture

This document describes the architecture and implementation of the website-wide search functionality in Inner Cosmos. The search system provides full-text search across all pages, with direct navigation to occurrences and text highlighting.

## Table of Contents
- [Overview](#overview)
- [Architecture Components](#architecture-components)
- [Implementation Details](#implementation-details)
- [Data Flow](#data-flow)
- [Key Features](#key-features)
- [Extending the System](#extending-the-system)
- [Technical Considerations](#technical-considerations)

## Overview

The search functionality overrides the browser's default search (Cmd/Ctrl+F) with a custom implementation that:
- Searches through all text content across every page
- Shows results with context preview
- Navigates directly to search occurrences
- Highlights matching text on the target page
- Provides keyboard-only navigation

## Architecture Components

### 1. **Search Index (`frontend/src/utils/searchIndex.ts`)**

The core search engine that handles text extraction and searching.

```typescript
// Key interfaces
interface SearchResult {
  pageTitle: string;
  pagePath: string;
  text: string;
  context: string;
  index: number;
}

interface PageContent {
  title: string;
  path: string;
  content: string;
  component: () => ReactElement;
}
```

**Key Functions:**
- `extractTextFromComponent()`: Renders React components to static HTML and extracts text
- `searchPages()`: Performs case-insensitive search across all page content
- `highlightSearchTerm()`: Wraps search terms in highlight tags

### 2. **Page Registry (`frontend/src/utils/pageRegistry.ts`)**

Maintains a registry of all searchable pages in the application.

```typescript
export const pageRegistry: PageContent[] = [
  {
    title: 'Home',
    path: '/',
    content: '',
    component: Home
  },
  // ... other pages
];
```

**Key Functions:**
- `initializePageContent()`: Extracts text from all components on first search
- `getSearchablePages()`: Returns pages with initialized content

### 3. **Search UI Component (`frontend/src/components/Search.tsx`)**

The modal interface for search functionality.

**Features:**
- Modal overlay with search input
- Real-time search results as you type
- Keyboard navigation (↑↓ arrows)
- Context preview for each result
- Visual highlighting of search terms

### 4. **Search Highlight Hook (`frontend/src/hooks/useSearchHighlight.ts`)**

Handles highlighting search terms on the target page after navigation.

**Process:**
1. Reads search term from sessionStorage
2. Uses DOM TreeWalker API to find text nodes
3. Wraps matching text in `<mark>` elements
4. Scrolls to first match with animation
5. Cleans up sessionStorage after use

### 5. **Layout Integration (`frontend/src/components/Layout.tsx`)**

Integrates search into the application layout:
- Listens for Cmd/Ctrl+F keyboard shortcut
- Manages search modal state
- Applies search highlighting on route changes

## Data Flow

```
1. User presses Cmd+F
   ↓
2. Layout component opens Search modal
   ↓
3. User types query (min 2 characters)
   ↓
4. Search component calls searchPages()
   ↓
5. searchIndex searches through pageRegistry
   ↓
6. Results displayed with context
   ↓
7. User selects result (Enter/Click)
   ↓
8. Search stores term in sessionStorage
   ↓
9. React Router navigates to page
   ↓
10. useSearchHighlight hook highlights matches
    ↓
11. Page scrolls to first match
```

## Key Features

### 1. **Text Extraction from React Components**

```typescript
export function extractTextFromComponent(component: () => ReactElement): string {
  const html = ReactDOMServer.renderToStaticMarkup(component());
  return html
    .replace(/<[^>]*>/g, ' ')  // Remove HTML tags
    .replace(/\s+/g, ' ')       // Normalize whitespace
    .trim();
}
```

This approach:
- Works with any React component
- Extracts all visible text
- Maintains search accuracy

### 2. **Context-Aware Search Results**

Each result shows surrounding text (±50 characters) for context:

```typescript
const contextStart = Math.max(0, index - 50);
const contextEnd = Math.min(page.content.length, index + query.length + 50);
const context = page.content.slice(contextStart, contextEnd);
```

### 3. **DOM-Based Highlighting**

Uses TreeWalker API for efficient DOM traversal:

```typescript
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
```

### 4. **Session-Based State Transfer**

Uses sessionStorage to pass search context between pages:

```typescript
// Before navigation
sessionStorage.setItem('searchTerm', query);
sessionStorage.setItem('searchIndex', result.index.toString());

// After navigation
const searchTerm = sessionStorage.getItem('searchTerm');
// ... apply highlighting
sessionStorage.removeItem('searchTerm');
```

## Extending the System

### Adding Command Functionality

The search system can be extended to support commands:

```typescript
// In Search component
if (query.startsWith(':')) {
  // Handle as command
  const command = query.substring(1);
  switch(command) {
    case 'settings':
      dispatch(setShowSettings(true));
      break;
    case 'toggle-sidebar':
      dispatch(toggleSidebar());
      break;
    // Add more commands
  }
}
```

### Adding Page Metadata

Enhance search with page tags or categories:

```typescript
interface PageContent {
  title: string;
  path: string;
  content: string;
  component: () => ReactElement;
  tags?: string[];  // Add metadata
  description?: string;
}
```

### Implementing Search Filters

Add filtering capabilities:

```typescript
// Filter by page type
const filteredPages = pages.filter(page => 
  filters.includes(page.category)
);

// Search within filtered pages
const results = searchPages(query, filteredPages);
```

### Adding Search History

Store recent searches:

```typescript
const searchHistory = JSON.parse(
  localStorage.getItem('searchHistory') || '[]'
);
searchHistory.unshift(query);
localStorage.setItem(
  'searchHistory', 
  JSON.stringify(searchHistory.slice(0, 10))
);
```

## Technical Considerations

### Performance

1. **Lazy Initialization**: Page content is extracted only on first search
2. **Efficient Search**: Uses native string methods for performance
3. **Debouncing**: Consider adding debounce for large sites

### Accessibility

1. **Keyboard Navigation**: Full keyboard support (arrows, Enter, Escape)
2. **Focus Management**: Auto-focuses search input
3. **Screen Reader Support**: Semantic HTML structure

### Browser Compatibility

- Uses standard DOM APIs (TreeWalker, querySelector)
- SessionStorage for state transfer
- CSS classes for highlighting
- Works in all modern browsers

### Limitations

1. **Static Content**: Only searches content available at render time
2. **Memory Usage**: Stores all page content in memory
3. **Dynamic Content**: Doesn't search dynamically loaded content

### Future Enhancements

1. **Fuzzy Search**: Implement fuzzy matching for typos
2. **Search Analytics**: Track popular searches
3. **Advanced Queries**: Support for operators (AND, OR, NOT)
4. **Search API**: Backend search for larger sites
5. **Caching**: Cache extracted content for performance

## Example Usage

### Basic Search Implementation

```typescript
// Initialize pages
import { getSearchablePages } from './utils/pageRegistry';

// Perform search
const pages = getSearchablePages();
const results = searchPages('react hooks', pages);

// Display results
results.forEach(result => {
  console.log(`Found in ${result.pageTitle}: ${result.context}`);
});
```

### Custom Page Registration

```typescript
// Add a new page to the registry
pageRegistry.push({
  title: 'My New Page',
  path: '/my-new-page',
  content: '',
  component: MyNewPage
});

// Re-initialize content
initializePageContent();
```

This architecture provides a solid foundation for search functionality that can be extended with additional features while maintaining performance and usability. 