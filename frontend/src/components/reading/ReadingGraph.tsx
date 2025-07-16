import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { ReadingGraph, ReadingNode } from '../../types/reading';
import { createSimulation } from '../../utils/simulation';
import { renderGraph } from '../../utils/renderer';
import './ReadingGraph.css';

interface ReadingGraphProps {
  data: ReadingGraph;
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

const ReadingGraphComponent: React.FC<ReadingGraphProps> = ({
  data,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<ReadingNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const simulation = createSimulation(data, width, height);
    renderGraph(svg, data, simulation, width, height, setSelectedNode);
    
    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return (
    <div className="reading-graph-container">
      <svg ref={svgRef} width={width} height={height} />
      {selectedNode && (
        <div className="node-tooltip">
          <h3>{selectedNode.title}</h3>
          {selectedNode.author && <p><b>by {selectedNode.author}</b></p>}
          {selectedNode.description && <p>{selectedNode.description}</p>}
          {selectedNode.url && <p><a href={selectedNode.url} target="_blank" rel="noopener noreferrer">More info</a></p>}
        </div>
      )}
    </div>
  );
};

export default ReadingGraphComponent; 