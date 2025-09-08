import type { SiteNode } from '../types/navigation';

export const mainSiteMap: SiteNode[] = [
  {
    id: 'about', label: 'About', segment: 'about', showInNav: true,
    lazyImport: () => import('../pages/About'),
  },
  {
    id: 'blog', label: 'Blog', segment: 'blog', showInNav: true,
    lazyImport: () => import('../pages/Blog'),
  },
  {
    id: 'community', label: 'Community', segment: 'community', showInNav: true,
    lazyImport: () => import('../pages/Community'),
  },
  {
    id: 'projects', label: 'Projects', segment: 'projects', showInNav: true,
    children: [
      { id: 'projects-index', label: 'Projects', showInNav: false, lazyImport: () => import('../pages/Projects') },
      { id: 'cue', label: 'Cue', segment: 'cue', showInNav: true, lazyImport: () => import('../pages/projects/Cue'), maintenance: false },
      { id: 'blank', label: 'Blank', segment: 'blank', showInNav: true, lazyImport: () => import('../pages/projects/Blank') },
      { id: 'scribe', label: 'Scribe', segment: 'scribe', showInNav: true, lazyImport: () => import('../pages/projects/Scribe') },
    ],
  },
  {
    id: 'research', label: 'Research', segment: 'research', showInNav: true,
    children: [
      { id: 'research-index', label: 'Research', showInNav: false, lazyImport: () => import('../pages/Research') },
      { id: 'sandbagging-detection', label: 'Sandbagging Detection', segment: 'sandbagging-detection', showInNav: true, lazyImport: () => import('../pages/research/SandbaggingDetection') },
    ],
  },
  {
    id: 'resources', label: 'Resources', segment: 'resources', showInNav: true,
    lazyImport: () => import('../pages/Resources'),
  },
  {
    id: 'contact', label: 'Contact', segment: 'contact', showInNav: true,
    lazyImport: () => import('../pages/Contact'),
  },
];

export const backstageRoot: SiteNode = {
  id: 'backstage', label: '// Backstage', segment: 'backstage', showInNav: true,
  lazyImport: () => import('../pages/backstage/Backstage'),
  children: [
    { id: 'quotes', label: 'Quotes.yaml', segment: 'quotes', showInNav: true, lazyImport: () => import('../pages/backstage/Quotes') },
    { id: 'stats', label: 'Stats.db', segment: 'stats', showInNav: true, lazyImport: () => import('../pages/backstage/Stats') },
    { id: 'schema', label: 'Schema.sql', segment: 'schema', showInNav: true, lazyImport: () => import('../pages/backstage/Schema') },
  ],
};


