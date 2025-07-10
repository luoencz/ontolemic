export interface NavItem {
  path: string;
  label: string;
  isDropdown?: boolean;
}

export interface SubNavItem {
  path: string;
  label: string;
}

export const navItems: NavItem[] = [
  { path: '/about', label: 'About' },
  { path: '/blog', label: 'Blog' },
  { path: '/projects', label: 'Projects', isDropdown: true },
  { path: '/research', label: 'Research', isDropdown: true },
  { path: '/contact', label: 'Contact' },
];

export const projectItems: SubNavItem[] = [];

export const researchItems: SubNavItem[] = [];

export const backstageItems: SubNavItem[] = [
  { path: '/backstage/quotes', label: 'Quotes.yaml' },
]; 