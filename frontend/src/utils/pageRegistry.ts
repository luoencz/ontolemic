// Page registry with dynamic imports for code splitting
export interface PageInfo {
  title: string;
  path: string;
  loader: () => Promise<any>;
}

// Registry of all searchable pages with dynamic imports
export const pageRegistry: PageInfo[] = [
  {
    title: 'About',
    path: '/about',
    loader: () => import('../pages/About')
  },
  {
    title: 'Blog',
    path: '/blog',
    loader: () => import('../pages/Blog')
  },
  {
    title: 'Contact',
    path: '/contact',
    loader: () => import('../pages/Contact')
  },
  {
    title: 'Projects',
    path: '/projects',
    loader: () => import('../pages/Projects')
  },
  {
    title: 'Research',
    path: '/research',
    loader: () => import('../pages/Research')
  },
  {
    title: 'Navigation',
    path: '/navigation',
    loader: () => import('../pages/NavigationPage')
  }
];

// Backstage pages (added dynamically when unlocked)
const backstagePages: PageInfo[] = [
  {
    title: 'Backstage',
    path: '/backstage',
    loader: () => import('../pages/backstage/Backstage')
  },
  {
    title: 'Quotes.yaml',
    path: '/backstage/quotes',
    loader: () => import('../pages/backstage/Quotes')
  }
];

// Project pages
const projectPages: PageInfo[] = [
  {
    title: 'Cue',
    path: '/projects/cue',
    loader: () => import('../pages/projects/Cue')
  }
];

// Get all searchable pages
export function getSearchablePages(): PageInfo[] {
  // Check if backstage is unlocked
  const backstageUnlocked = typeof window !== 'undefined' && localStorage.getItem('backstageUnlocked') === 'true';
  
  const allPages = [...pageRegistry, ...projectPages];
  
  if (backstageUnlocked) {
    return [...allPages, ...backstagePages];
  }
  
  return allPages;
} 