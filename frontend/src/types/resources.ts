export interface ResourceNode {
  id: string;
  title: string;
  type: 'book' | 'paper' | 'video' | 'essay' | 'category' | 'newsletter' | 'blog' | 'channel' | 'game' | 'website' | 'page';
  author?: string;
  description?: string;
  url?: string;
  children?: string[];
}

export interface RenderedResourceNode extends ResourceNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface ResourceLink {
  source: string;
  target: string;
  type: 'parent' | 'sibling';
  label?: string;
}

export interface ResourceGraph {
  nodes: ResourceNode[];
  links: ResourceLink[];
}


