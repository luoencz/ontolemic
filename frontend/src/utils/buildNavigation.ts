import type { RouteObject } from 'react-router-dom';
import type { NavNode, SiteNode } from '../types/navigation';
import { mainSiteMap, backstageRoot } from '../data/navigation-graph';
import { withMaintenanceGuard } from '../router/withMaintenanceGuard';

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
        (route.children as RouteObject[]).push({
          index: true,
          lazy: async () => {
            const mod = await node.lazyImport!();
            const Component = node.maintenance ? withMaintenanceGuard(mod.default, { enabled: true }) : mod.default;
            return { Component };
          },
        });
      }
      routeObjects.push(route);
    } else if (hasPage) {
      routeObjects.push({
        index: true,
        lazy: async () => {
          const mod = await node.lazyImport!();
          const Component = node.maintenance ? withMaintenanceGuard(mod.default, { enabled: true }) : mod.default;
          return { Component };
        },
      });
    }
  }
  return routeObjects;
}

export function buildChildRoutes(): RouteObject[] {
  return [
    {
      index: true,
      lazy: async () => {
        const mod = await import('../pages/About');
        return { Component: mod.default };
      },
    },
    ...buildRoutesFromSiteNodes(mainSiteMap, '/'),
    ...buildRoutesFromSiteNodes([backstageRoot], '/'),
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

export const mainNavigationTree: NavNode[] = buildNavFromSiteNodes(mainSiteMap, '/');
export const backstageTree: NavNode = buildNavFromSiteNodes([backstageRoot], '/')[0];


