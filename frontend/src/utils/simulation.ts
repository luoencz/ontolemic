import * as d3 from 'd3';
import type { ResourceGraph, ResourceLink, RenderedResourceNode } from '../data/resourcesData';

export const createSimulation = (
  data: ResourceGraph,
) => {
  // Copy nodes and links
  const nodes: RenderedResourceNode[] = data.nodes.map(d => ({ ...d }));
  const links: ResourceLink[] = data.links.map(d => ({ ...d }));

  // Standard D3 force simulation for disconnected graphs
  const simulation = d3.forceSimulation<RenderedResourceNode>(nodes)
    .force('link', d3.forceLink<RenderedResourceNode, ResourceLink>(links)
      .id(d => d.id)
      .distance(60)
      .strength(0.5)
    )
    .force('charge', d3.forceManyBody<RenderedResourceNode>().strength(-300))
    .force('x', d3.forceX<RenderedResourceNode>())
    .force('y', d3.forceY<RenderedResourceNode>())
    .force('collision', d3.forceCollide<RenderedResourceNode>()
      .radius(d => getNodeRadius(d) + 10)
      .strength(0.8)
    )
    .velocityDecay(0.4)
    .alphaDecay(0.02);

  // Run the simulation for initial layout
  simulation.tick(300);

  return simulation;
};

const getNodeRadius = (node: RenderedResourceNode): number => {
  switch (node.type) {
    case 'category': return 12;
    case 'book': return 10;
    case 'paper': return 10;
    case 'video': return 10;
    case 'essay': return 10;
    case 'newsletter': return 8;
    case 'blog': return 8;
    case 'channel': return 8;
    case 'game': return 8;
    default: return 8;
  }
}; 