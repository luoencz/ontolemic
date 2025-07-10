import { PageContent, extractTextFromComponent } from './searchIndex';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Projects from '../pages/Projects';
import WebDev from '../pages/projects/WebDev';
import AIML from '../pages/projects/AIML';
import OpenSource from '../pages/projects/OpenSource';
import Research from '../pages/projects/Research';
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
    title: 'Blog and Research',
    path: '/blog',
    content: '',
    component: Home // Currently using Home component for blog
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
    title: 'Web Development',
    path: '/projects/web-dev',
    content: '',
    component: WebDev
  },
  {
    title: 'AI & Machine Learning',
    path: '/projects/ai-ml',
    content: '',
    component: AIML
  },
  {
    title: 'Open Source',
    path: '/projects/open-source',
    content: '',
    component: OpenSource
  },
  {
    title: 'Research Papers',
    path: '/projects/research',
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
    title: 'Quotes Database',
    path: '/backstage/quotes',
    content: '',
    component: Quotes
  }
];

// Initialize page content by extracting text from components
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