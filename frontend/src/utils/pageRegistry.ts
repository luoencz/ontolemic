import { PageContent, extractTextFromComponent } from './searchIndex';
import Home from '../pages/Home';
import About from '../pages/About';
import Blog from '../pages/Blog';
import Contact from '../pages/Contact';
import Projects from '../pages/Projects';
import Research from '../pages/Research';
import Backstage from '../pages/backstage/Backstage';
import Quotes from '../pages/backstage/Quotes';

// Registry of all searchable pages
export const pageRegistry: PageContent[] = [
  {
    title: 'Home',
    path: '/',
    content: '',
    component: Home
  },
  {
    title: 'About',
    path: '/about',
    content: '',
    component: About
  },
  {
    title: 'Blog',
    path: '/blog',
    content: '',
    component: Blog
  },
  {
    title: 'Contact',
    path: '/contact',
    content: '',
    component: Contact
  },
  {
    title: 'Projects',
    path: '/projects',
    content: '',
    component: Projects
  },
  {
    title: 'Research',
    path: '/research',
    content: '',
    component: Research
  }
];

// Backstage pages (added dynamically when unlocked)
const backstagePages: PageContent[] = [
  {
    title: 'Backstage',
    path: '/backstage',
    content: '',
    component: Backstage
  },
  {
    title: 'Quotes.yaml',
    path: '/backstage/quotes',
    content: '',
    component: Quotes
  }
];

// Initialize content by extracting text from components
pageRegistry.forEach(page => {
  page.content = extractTextFromComponent(page.component);
});

// Initialize page content function
export function initializePageContent() {
  pageRegistry.forEach(page => {
    page.content = extractTextFromComponent(page.component);
  });
  
  backstagePages.forEach(page => {
    page.content = extractTextFromComponent(page.component);
  });
}

// Get page content for search
export function getSearchablePages(): PageContent[] {
  // Ensure content is initialized
  if (pageRegistry[0].content === '') {
    initializePageContent();
  }
  
  // Check if backstage is unlocked
  const backstageUnlocked = typeof window !== 'undefined' && localStorage.getItem('backstageUnlocked') === 'true';
  
  if (backstageUnlocked) {
    return [...pageRegistry, ...backstagePages];
  }
  
  return pageRegistry;
} 