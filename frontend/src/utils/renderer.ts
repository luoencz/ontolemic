import * as d3 from 'd3';
import type { ReadingGraph, ReadingNode, ReadingLink } from '../types/reading';

export const renderGraph = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  _data: ReadingGraph,
  simulation: d3.Simulation<ReadingNode, undefined>,
  _width: number,
  _height: number,
  setSelectedNode: (node: ReadingNode | null) => void
) => {
  const colorScale = d3.scaleOrdinal<string>().domain(['category', 'book', 'paper']).range(d3.schemeCategory10);

  // Add zoom behavior
  const zoom = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.1, 3])
    .on('zoom', (event) => {
      container.attr('transform', event.transform);
    });

  svg.call(zoom as any);

  // Container for all elements
  const container = svg.append('g');

  // Arrow marker
  const defs = svg.append('defs');
  defs.append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 13)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 13)
    .attr('markerHeight', 13)
    .append('path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999')
    .style('stroke', 'none');

  // Links
  const linkForce = simulation.force('link') as d3.ForceLink<ReadingNode, ReadingLink>;
  const link = container.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(linkForce.links())
    .enter()
    .append('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)');

  // Nodes
  const node = container.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(simulation.nodes())
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag<SVGGElement, ReadingNode>()
      .on('start', (event, d) => dragstarted(event, d, simulation))
      .on('drag', (event, d) => dragged(event, d))
      .on('end', (event, d) => dragended(event, d, simulation))
    )
    .on('click', (_event, d) => setSelectedNode(d))
    .on('mouseover', (event) => {
      d3.select(event.currentTarget)
        .select('circle')
        .attr('stroke', '#000')
        .attr('stroke-width', 2);
    })
    .on('mouseout', (event) => {
      d3.select(event.currentTarget)
        .select('circle')
        .attr('stroke', 'none');
    });

  // Circles
  node.append('circle')
    .attr('r', d => getNodeRadius(d))
    .attr('fill', d => colorScale(d.type))
    .attr('stroke', 'none');

  // Labels
  node.append('text')
    .attr('dy', -20)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-weight', 'bold')
    .style('fill', '#333')
    .text(d => d.title.length > 20 ? d.title.substring(0, 20) + '...' : d.title);

  // Author labels for books
  node.filter(d => d.type === 'book' && !!d.author)
    .append('text')
    .attr('dy', -8)
    .attr('text-anchor', 'middle')
    .style('font-size', '10px')
    .style('fill', '#666')
    .text(d => d.author || '');

  simulation.on('tick', () => {
    link
      .attr('x1', (d: any) => (typeof d.source === 'object' ? d.source.x : 0))
      .attr('y1', (d: any) => (typeof d.source === 'object' ? d.source.y : 0))
      .attr('x2', (d: any) => (typeof d.target === 'object' ? d.target.x : 0))
      .attr('y2', (d: any) => (typeof d.target === 'object' ? d.target.y : 0));

    node
      .attr('transform', (d: ReadingNode) => `translate(${d.x},${d.y})`);
  });
};

const getNodeRadius = (node: ReadingNode): number => {
  switch (node.type) {
    case 'category': return 25;
    case 'book': return 15;
    case 'paper': return 12;
    default: return 10;
  }
};

const dragstarted = (
  event: d3.D3DragEvent<SVGGElement, ReadingNode, unknown>,
  d: ReadingNode,
  simulation: d3.Simulation<ReadingNode, undefined>
) => {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
};

const dragged = (
  event: d3.D3DragEvent<SVGGElement, ReadingNode, unknown>,
  d: ReadingNode
) => {
  d.fx = event.x;
  d.fy = event.y;
};

const dragended = (
  event: d3.D3DragEvent<SVGGElement, ReadingNode, unknown>,
  d: ReadingNode,
  simulation: d3.Simulation<ReadingNode, undefined>
) => {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}; 