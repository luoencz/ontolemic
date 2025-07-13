export interface NavNode {
  id: string;
  label: string;
  path?: string;
  children?: NavNode[];
}

export const navigationTree: NavNode[] = [
  { id: 'about', label: 'About', path: '/about' },
  { id: 'blog', label: 'Blog', path: '/blog' },
  {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    children: [
      { id: 'cue', label: 'Cue', path: '/projects/cue' },
    ],
  },
  {
    id: 'research',
    label: 'Research',
    path: '/research',
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
    { id: 'stats', label: 'Stats.db', path: '/backstage/stats' },
  ],
};

// Legacy exports for backward compatibility - will be removed later
export interface NavItem {
  path: string;
  label: string;
  isDropdown?: boolean;
}

export interface SubNavItem {
  path: string;
  label: string;
}

export const navItems: NavItem[] = navigationTree.map(node => ({
  path: node.path || '',
  label: node.label,
  isDropdown: !!node.children,
}));

export const projectItems: SubNavItem[] = navigationTree
  .find(n => n.id === 'projects')?.children?.map(c => ({ path: c.path!, label: c.label })) || [];

export const researchItems: SubNavItem[] = navigationTree
  .find(n => n.id === 'research')?.children?.map(c => ({ path: c.path!, label: c.label })) || [];

export const backstageItems: SubNavItem[] = backstageTree.children?.map(c => ({ path: c.path!, label: c.label })) || []; 