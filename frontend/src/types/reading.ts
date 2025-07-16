import type { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

export interface ReadingNode extends SimulationNodeDatum {
  id: string;
  title: string;
  type: 'category' | 'book' | 'paper';
  author?: string;
  description?: string;
  url?: string;
  children?: string[];
  group?: number;
}

export interface ReadingLink extends SimulationLinkDatum<ReadingNode> {
  source: string | ReadingNode;
  target: string | ReadingNode;
}

export interface ReadingGraph {
  nodes: ReadingNode[];
  links: ReadingLink[];
} 