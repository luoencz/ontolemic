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
  const [ready, setReady] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;
    
    // Reset ready state when data changes
    setReady(false);
    setInitialized(false);
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const simulation = createSimulation(data, width, height);
    
    // Important: Set ready to true before renderGraph to ensure SVG is visible
    setReady(true);
    
    renderGraph(svg, data, simulation, width, height, setSelectedNode);
    
    // Enable transitions after initial render
    const timer = setTimeout(() => setInitialized(true), 100);
    
    return () => {
      clearTimeout(timer);
      simulation.stop();
    };
  }, [data, width, height]);

  // Update node highlighting when selection changes
  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      if ((svg as any).updateSelectedNode) {
        (svg as any).updateSelectedNode(selectedNode?.id || null);
      }
    }
  }, [selectedNode]);

  // Get children of selected node
  const getNodeChildren = (node: ReadingNode): ReadingNode[] => {
    const childLinks = data.links.filter(link => 
      (typeof link.source === 'string' ? link.source : link.source.id) === node.id
    );
    return childLinks.map(link => {
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      return data.nodes.find(n => n.id === targetId);
    }).filter((n): n is ReadingNode => n !== undefined);
  };

  const selectedNodeChildren = selectedNode ? getNodeChildren(selectedNode) : [];

  return (
    <div className="reading-graph-wrapper">
      <div className={`reading-graph-container ${initialized ? 'initialized' : ''}`}>
        <svg 
          ref={svgRef} 
          width={width} 
          height={height} 
          style={{ visibility: ready ? 'visible' : 'hidden' }}
        />
      </div>
      
      {selectedNode && (
        <div className="selected-node-details">
          <div className="selected-node-header">
            <h3>{selectedNode.title}</h3>
            {selectedNode.author && <p className="author">by {selectedNode.author}</p>}
            {selectedNode.description && <p className="description">{selectedNode.description}</p>}
            {selectedNode.url && (
              <a 
                href={selectedNode.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link"
              >
                Learn more →
              </a>
            )}
          </div>
          
          {selectedNodeChildren.length > 0 && (
            <div className="node-children">
              <h4>Related Items</h4>
              <ul className="children-list">
                {selectedNodeChildren.map(child => (
                  <li key={child.id} onClick={() => setSelectedNode(child)}>
                    <span className="child-title">{child.title}</span>
                    {child.author && <span className="child-author">by {child.author}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingGraphComponent; 