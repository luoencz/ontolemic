export interface NavSection {
  id: string;
  label: string;
}

export interface NavRoute {
  path: string;
  label: string;
  sections: NavSection[];
}

export const navigationConfig: NavRoute[] = [
  {
    path: '/',
    label: 'Home',
    sections: []
  },
  {
    path: '/links',
    label: 'Links',
    sections: [
      { id: 'contact', label: 'Contact' },
      { id: 'me', label: 'Me' },
      { id: 'blogs', label: 'Blogs' },
      { id: 'websites', label: 'Websites' },
      { id: 'books', label: 'Books' },
      { id: 'music', label: 'Music' },
      { id: 'software', label: 'Software' }
    ]
  },
  {
    path: '/project',
    label: 'Projects',
    sections: []
  },
  {
    path: '/map',
    label: 'Map',
    sections: []
  }
];

export function getRouteConfig(pathname: string): NavRoute | undefined {
  return navigationConfig.find(route => route.path === pathname);
}

