import type { ReadingGraph, ReadingNode, ReadingLink } from '../types/reading';

export const processReadingData = (rawData: any): ReadingGraph => {
  const processedNodes: ReadingNode[] = rawData.nodes.map((node: any) => ({
    ...node,
    group: getNodeGroup(node.type)
  }));

  const processedLinks: ReadingLink[] = rawData.links.map((link: any) => ({
    source: link.source,
    target: link.target
  }));

  return {
    nodes: processedNodes,
    links: processedLinks
  };
};

const getNodeGroup = (type: string): number => {
  switch (type) {
    case 'category': return 0;
    case 'book': return 1;
    case 'paper': return 2;
    default: return 3;
  }
}; 