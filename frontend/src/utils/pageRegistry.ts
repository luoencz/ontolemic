import { PageMetadata } from '../types/page';

// Page registry with dynamic imports for code splitting
export interface PageInfo {
  title: string;
  path: string;
  loader: () => Promise<any>;
}

// Registry of all searchable pages with dynamic imports
export const pageRegistry: PageMetadata[] = [
  {
    title: 'About',
    path: '/about',
    loader: () => import('../pages/About'),
    thumbnail: {
      summary: 'Hi! My name is Theo. I\'m an AI safety researcher and engineer, located in Tbilisi, Georgia / London, UK.'
    }
  },
  {
    title: 'Blog',
    path: '/blog',
    loader: () => import('../pages/Blog'),
    thumbnail: {
      summary: 'Thoughts on AI safety, technology, and interdisciplinary explorations.'
    }
  },
  {
    title: 'Contact',
    path: '/contact',
    loader: () => import('../pages/Contact')
  },
  {
    title: 'Projects',
    path: '/projects',
    loader: () => import('../pages/Projects'),
    thumbnail: {
      summary: 'A collection of my work across different domains of software engineering and research.'
    }
  },
  {
    title: 'Research',
    path: '/research',
    loader: () => import('../pages/Research'),
    thumbnail: {
      summary: 'Academic papers, technical writing, and research explorations in AI safety and related fields.'
    }
  },
  {
    title: 'Navigation',
    path: '/navigation',
    loader: () => import('../pages/NavigationPage')
  }
];

// Backstage pages (added dynamically when unlocked)
const backstagePages: PageMetadata[] = [
  {
    title: 'Backstage',
    path: '/backstage',
    loader: () => import('../pages/backstage/Backstage'),
    thumbnail: {
      backgroundColor: '#1a1a1a',
      summary: 'Welcome to the backstage area — a hidden section containing experimental features and personal tools.'
    }
  },
  {
    title: 'Quotes.yaml',
    path: '/backstage/quotes',
    loader: () => import('../pages/backstage/Quotes'),
    thumbnail: {
      backgroundColor: '#2a2a2a',
      summary: 'A curated collection of inspiring quotes and thoughts that resonate with me.'
    }
  }
];

// Project pages
const projectPages: PageMetadata[] = [
  {
    title: 'Cue',
    path: '/projects/cue',
    loader: () => import('../pages/projects/Cue'),
    thumbnail: {
      image: '/cue/cue-preview.webp',
      summary: 'A generative art project that uses machine learning for sentiment analysis to produce multidimensional vectors.'
    }
  }
];

// Get all searchable pages
export function getSearchablePages(): PageMetadata[] {
  // Check if backstage is unlocked
  const backstageUnlocked = typeof window !== 'undefined' && localStorage.getItem('backstageUnlocked') === 'true';
  
  const allPages = [...pageRegistry, ...projectPages];
  
  if (backstageUnlocked) {
    return [...allPages, ...backstagePages];
  }
  
  return allPages;
} 