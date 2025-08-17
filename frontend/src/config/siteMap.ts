import type { RouteObject } from 'react-router-dom';
import type { ComponentType } from 'react';

/**
 * Single source of truth for site structure.
 * From this we derive both Data Router routes and the sidebar navigation tree.
 */
export interface NavNode {
  id: string;
  label: string;
  path?: string;
  children?: NavNode[];
}

interface SiteNode {
  id: string;
  label: string;
  /** Path segment under its parent, e.g., 'projects' or 'cue'. Omit for index nodes */
  segment?: string;
  /** Whether this node should show up in the navigation sidebar */
  showInNav?: boolean;
  /** Optional children */
  children?: SiteNode[];
  /** When present, used to build a route element via route.lazy */
  lazyImport?: () => Promise<{ default: ComponentType<any> }>;
}

// Define the sitemap
export const siteMap: SiteNode[] = [
  {
    id: 'about',
    label: 'About',
    segment: 'about',
    showInNav: true,
    lazyImport: () => import('../pages/About'),
  },
  {
    id: 'blog',
    label: 'Blog',
    segment: 'blog',
    showInNav: true,
    lazyImport: () => import('../pages/Blog'),
  },
  {
    id: 'community',
    label: 'Community',
    segment: 'community',
    showInNav: true,
    lazyImport: () => import('../pages/Community'),
  },
  {
    id: 'projects',
    label: 'Projects',
    segment: 'projects',
    showInNav: true,
    children: [
      { id: 'projects-index', label: 'Projects', showInNav: false, lazyImport: () => import('../pages/Projects') },
      { id: 'cue', label: 'Cue', segment: 'cue', showInNav: true, lazyImport: () => import('../pages/projects/Cue') },
      { id: 'blank', label: 'Blank', segment: 'blank', showInNav: true, lazyImport: () => import('../pages/projects/Blank') },
      { id: 'scribe', label: 'Scribe', segment: 'scribe', showInNav: true, lazyImport: () => import('../pages/projects/Scribe') },
    ],
  },
  {
    id: 'research',
    label: 'Research',
    segment: 'research',
    showInNav: true,
    children: [
      { id: 'research-index', label: 'Research', showInNav: false, lazyImport: () => import('../pages/Research') },
      { id: 'sandbagging-detection', label: 'Sandbagging Detection', segment: 'sandbagging-detection', showInNav: true, lazyImport: () => import('../pages/research/SandbaggingDetection') },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    segment: 'resources',
    showInNav: true,
    lazyImport: () => import('../pages/Resources'),
  },
  {
    id: 'contact',
    label: 'Contact',
    segment: 'contact',
    showInNav: true,
    lazyImport: () => import('../pages/Contact'),
  },
  {
    id: 'backstage',
    label: '// Backstage',
    segment: 'backstage',
    showInNav: true,
    lazyImport: () => import('../pages/backstage/Backstage'),
    children: [
      { id: 'quotes', label: 'Quotes.yaml', segment: 'quotes', showInNav: true, lazyImport: () => import('../pages/backstage/Quotes') },
      { id: 'stats', label: 'Stats.db', segment: 'stats', showInNav: true, lazyImport: () => import('../pages/backstage/Stats') },
      { id: 'schema', label: 'Schema.sql', segment: 'schema', showInNav: true, lazyImport: () => import('../pages/backstage/Schema') },
    ],
  },
];

function joinPaths(parent: string, segment?: string): string {
  if (!segment) return parent;
  return `${parent.replace(/\/$/, '')}/${segment}`;
}

function buildRoutesFromSiteNodes(nodes: SiteNode[], basePath: string): RouteObject[] {
  const routeObjects: RouteObject[] = [];
  for (const node of nodes) {
    const fullPath = joinPaths(basePath, node.segment);

    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const hasPage = typeof node.lazyImport === 'function';

    if (node.segment) {
      const route: RouteObject = {
        path: node.segment,
        children: [],
      };
      if (hasChildren) {
        (route.children as RouteObject[]).push(...buildRoutesFromSiteNodes(node.children!, fullPath));
      }
      if (hasPage) {
        // Provide an index route when a page exists at the parent path and there are children
        (route.children as RouteObject[]).push({
          index: true,
          lazy: async () => {
            const mod = await node.lazyImport!();
            return { Component: mod.default };
          },
        });
      }
      routeObjects.push(route);
    } else if (hasPage) {
      // Index under current basePath
      routeObjects.push({
        index: true,
        lazy: async () => {
          const mod = await node.lazyImport!();
          return { Component: mod.default };
        },
      });
    }
  }
  return routeObjects;
}

export function buildChildRoutes(): RouteObject[] {
  // Root-level children
  return [
    // Index route at "/" -> About
    {
      index: true,
      lazy: async () => {
        const mod = await import('../pages/About');
        return { Component: mod.default };
      },
    },
    ...buildRoutesFromSiteNodes(siteMap, '/'),
    // Catch-all NotFound
    {
      path: '*',
      lazy: async () => {
        const mod = await import('../pages/system/NotFound');
        return { Component: mod.default };
      },
    },
  ];
}

function buildNavFromSiteNodes(nodes: SiteNode[], basePath: string): NavNode[] {
  const result: NavNode[] = [];
  for (const node of nodes) {
    const fullPath = joinPaths(basePath, node.segment);
    const children = node.children ? buildNavFromSiteNodes(node.children, fullPath) : [];
    if (node.showInNav || children.length > 0) {
      result.push({ id: node.id, label: node.label, path: node.segment ? fullPath : undefined, children });
    }
  }
  return result;
}

export const navigationTree: NavNode[] = buildNavFromSiteNodes(siteMap, '/');

export const backstageTree: NavNode = (function findBackstage(nodes: NavNode[]): NavNode {
  for (const n of nodes) {
    if (n.id === 'backstage') return n;
    if (n.children) {
      const found = findBackstage(n.children);
      if (found) return found;
    }
  }
  return { id: 'backstage', label: '// Backstage', path: '/backstage', children: [] };
})(navigationTree);


