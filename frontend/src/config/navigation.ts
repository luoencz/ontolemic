export interface NavNode {
  id: string;
  label: string;
  path?: string;
  children?: NavNode[];
}

export const navigationTree: NavNode[] = [
  { id: 'about', label: 'About', path: '/about' },
  { id: 'blog', label: 'Blog', path: '/blog' },
  { id: 'community', label: 'Community', path: '/community' },
  {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    children: [
      { id: 'cue', label: 'Cue', path: '/projects/cue' },
      { id: 'blank', label: 'Blank', path: '/projects/blank' },
      { id: 'scribe', label: 'Scribe', path: '/projects/scribe' },
    ],
  },
  {
    id: 'research',
    label: 'Research',
    path: '/research',
    children: [
      { id: 'sandbagging-detection', label: 'Sandbagging Detection', path: '/research/sandbagging-detection' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    path: '/resources',
    children: [],
  },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

export const backstageTree: NavNode = {
  id: 'backstage',
  label: '// Backstage',
  path: '/backstage',
  children: [
    { id: 'quotes', label: 'Quotes.yaml', path: '/backstage/quotes' },
    { 
      id: 'stats', 
      label: 'Stats.db', 
      path: '/backstage/stats',
      children: [
        { id: 'schema', label: 'Schema.sql', path: '/backstage/schema' },
      ]
    },
  ],
};