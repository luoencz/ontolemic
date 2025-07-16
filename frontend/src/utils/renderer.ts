import * as d3 from 'd3';
import type { ResourceGraph, ResourceNode, ResourceLink, RenderedResourceNode } from '../data/resourcesData';

export const renderGraph = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  _data: ResourceGraph,
  simulation: d3.Simulation<RenderedResourceNode, undefined>,
  _width: number,
  _height: number,
  setSelectedNode: (node: ResourceNode | null) => void
) => {
  // More saturated pastel colors
  const colorScale = d3.scaleOrdinal<string>()
    .domain(['category', 'book', 'paper'])
    .range(['#c084fc', '#60a5fa', '#fbbf24']); // Saturated purple, blue, yellow

  // Add zoom behavior
  const zoom = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, 2])
    .on('zoom', (event) => {
      container.attr('transform', event.transform);
    });

  svg.call(zoom as any);

  // Container for all elements
  const container = svg.append('g');

  // Arrow marker - smaller and more subtle
  const defs = svg.append('defs');
  defs.append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .append('path')
    .attr('d', 'M 0,-3 L 6 ,0 L 0,3')
    .attr('fill', '#999')
    .attr('opacity', 0.6)
    .style('stroke', 'none');

  // Links - thinner and more subtle
  const linkForce = simulation.force('link') as d3.ForceLink<RenderedResourceNode, ResourceLink>;
  const link = container.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(linkForce.links())
    .enter()
    .append('line')
    .attr('stroke', '#e0e0e0')
    .attr('stroke-opacity', 0.8)
    .attr('stroke-width', 1)
    .attr('marker-end', 'url(#arrowhead)');

  // Nodes
  const node = container.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(simulation.nodes())
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag<SVGGElement, RenderedResourceNode>()
      .on('start', (event, d) => dragstarted(event, d, simulation))
      .on('drag', (event, d) => dragged(event, d))
      .on('end', (event, d) => dragended(event, d, simulation))
    )
    .on('click', (_event, d) => setSelectedNode(d))
    .style('cursor', 'pointer');

  // Circles - smaller and uniform size
  node.append('circle')
    .attr('r', d => getNodeRadius(d))
    .attr('fill', d => colorScale(d.type))
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .attr('class', 'node-circle');

  // Labels - smaller and cleaner
  node.append('text')
    .attr('dy', -15)
    .attr('text-anchor', 'middle')
    .style('font-size', '11px')
    .style('font-weight', '500')
    .style('fill', '#4a5568')
    .style('user-select', 'none')
    .text(d => d.title.length > 25 ? d.title.substring(0, 25) + '...' : d.title);

  // Hover effects
  node.on('mouseover', function(event) {
    d3.select(event.currentTarget)
      .select('circle')
      .attr('stroke-width', 3);
  }).on('mouseout', function(event) {
    d3.select(event.currentTarget)
      .select('circle')
      .attr('stroke-width', 2);
  });

  simulation.on('tick', () => {
    link
      .attr('x1', (d: any) => (typeof d.source === 'object' ? d.source.x : 0))
      .attr('y1', (d: any) => (typeof d.source === 'object' ? d.source.y : 0))
      .attr('x2', (d: any) => (typeof d.target === 'object' ? d.target.x : 0))
      .attr('y2', (d: any) => (typeof d.target === 'object' ? d.target.y : 0));

    node
      .attr('transform', (d: RenderedResourceNode) => `translate(${d.x},${d.y})`);
  });
};

const getNodeRadius = (node: RenderedResourceNode): number => {
  switch (node.type) {
    case 'category': return 12;
    case 'book': return 10;
    case 'paper': return 10;
    case 'video': return 10;
    case 'essay': return 10;
    default: return 8;
  }
};

const dragstarted = (
  event: d3.D3DragEvent<SVGGElement, RenderedResourceNode, unknown>,
  d: RenderedResourceNode,
  simulation: d3.Simulation<RenderedResourceNode, undefined>
) => {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
};

const dragged = (
  event: d3.D3DragEvent<SVGGElement, RenderedResourceNode, unknown>,
  d: RenderedResourceNode
) => {
  d.fx = event.x;
  d.fy = event.y;
  // Update position immediately for responsive feel
  d.x = event.x;
  d.y = event.y;
};

const dragended = (
  event: d3.D3DragEvent<SVGGElement, RenderedResourceNode, unknown>,
  d: RenderedResourceNode,
  simulation: d3.Simulation<RenderedResourceNode, undefined>
) => {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}; 