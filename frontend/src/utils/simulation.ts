import * as d3 from 'd3';
import type { ReadingGraph, ReadingNode, ReadingLink } from '../types/reading';

export const createSimulation = (
  data: ReadingGraph,
  width: number,
  height: number
) => {
  // Defensive copy
  const nodes: ReadingNode[] = data.nodes.map(d => ({ ...d }));
  const links: ReadingLink[] = data.links.map(d => ({ ...d }));

  // Set initial positions
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Create a map for quick node lookup
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  
  // Position nodes
  nodes.forEach((node, _) => {
    if (node.type === 'category') {
      // Arrange categories in a circle
      const categoryNodes = nodes.filter(n => n.type === 'category');
      const angle = (categoryNodes.indexOf(node) / categoryNodes.length) * 2 * Math.PI;
      node.x = centerX + Math.cos(angle) * 150;
      node.y = centerY + Math.sin(angle) * 150;
    } else {
      // Position items near their parent category
      const parentLink = links.find(l => l.target === node.id);
      if (parentLink) {
        const parent = nodeMap.get(parentLink.source as string);
        if (parent && parent.x !== undefined && parent.y !== undefined) {
          const angle = Math.random() * 2 * Math.PI;
          const distance = 80 + Math.random() * 40;
          node.x = parent.x + Math.cos(angle) * distance;
          node.y = parent.y + Math.sin(angle) * distance;
        } else {
          // Fallback position
          node.x = centerX + (Math.random() - 0.5) * width * 0.8;
          node.y = centerY + (Math.random() - 0.5) * height * 0.8;
        }
      } else {
        // Fallback for unlinked nodes
        node.x = centerX + (Math.random() - 0.5) * width * 0.8;
        node.y = centerY + (Math.random() - 0.5) * height * 0.8;
      }
    }
  });

  const simulation = d3.forceSimulation<ReadingNode>(nodes)
    .force('link', d3.forceLink<ReadingNode, ReadingLink>(links)
      .id(d => d.id)
      .distance(80) // Reduced for smaller nodes
      .strength(0.5)
    )
    .force('charge', d3.forceManyBody<ReadingNode>()
      .strength(-200) // Reduced for tighter clustering
      .distanceMin(20)
      .distanceMax(200)
    )
    .force('center', d3.forceCenter<ReadingNode>(centerX, centerY))
    .force('collision', d3.forceCollide<ReadingNode>()
      .radius(d => getNodeRadius(d) + 10) // Increased padding
      .strength(0.8)
    )
    .velocityDecay(0.4) // Add damping for smoother animation
    .alphaDecay(0.02); // Slower decay for smoother settling

  // Run many ticks to ensure stable initial layout
  simulation.tick(300);

  return simulation;
};

const getNodeRadius = (node: ReadingNode): number => {
  switch (node.type) {
    case 'category': return 12;
    case 'book': return 10;
    case 'paper': return 10;
    default: return 8;
  }
}; 