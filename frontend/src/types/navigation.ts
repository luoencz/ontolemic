import type { ComponentType } from 'react';

export interface NavNode {
  id: string;
  label: string;
  path?: string;
  children?: NavNode[];
}

export interface SiteNode {
  id: string;
  label: string;
  /** Path segment under its parent, e.g., 'projects' or 'cue'. Omit for index nodes */
  segment?: string;
  /** Whether this node should show up in the navigation sidebar */
  showInNav?: boolean;
  /** If true, route is maintenance-gated on non-local machines */
  maintenance?: boolean;
  /** Optional children */
  children?: SiteNode[];
  /** When present, used to build a route element via route.lazy */
  lazyImport?: () => Promise<{ default: ComponentType<any> }>;
}


