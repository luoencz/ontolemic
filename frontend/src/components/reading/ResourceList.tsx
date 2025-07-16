import { ReadingNode } from '../../types/reading';

interface ReadingListProps {
  nodes: ReadingNode[];
  selectedNode: ReadingNode | null;
}

export function ReadingList({ nodes, selectedNode }: ReadingListProps) {
  if (!selectedNode) {
    return (
      <div className="text-gray-400 text-center py-12 border-t border-gray-200">
        <p className="text-lg">Click on a node in the graph to explore reading materials</p>
      </div>
    );
  }

  // Get all children recursively
  const getNodeWithChildren = (nodeId: string, visited = new Set<string>()): ReadingNode[] => {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return [];
    
    const children = node.children?.flatMap(childId => 
      getNodeWithChildren(childId, visited)
    ) || [];
    
    return [node, ...children];
  };

  const nodesToDisplay = getNodeWithChildren(selectedNode.id);

  return (
    <div className="border-t border-gray-200 pt-8">
      <h2 className="text-xl font-medium mb-6 text-gray-800">
        Selected: {selectedNode.title}
      </h2>
      
      <div className="space-y-8">
        {nodesToDisplay.map((node, index) => (
          <div key={node.id} className={`${index === 0 ? 'pb-6 border-b border-gray-200' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`w-1 h-full ${node.type === 'category' ? 'bg-gray-600' : 'bg-gray-300'}`} />
              
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {node.title}
                </h3>
                
                {node.author && (
                  <p className="text-sm text-gray-600 mt-1">
                    by {node.author}
                  </p>
                )}
                
                {node.description && (
                  <p className="text-gray-700 mt-3 leading-relaxed">
                    {node.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 mt-3">
                  {node.url && (
                    <a 
                      href={node.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View →
                    </a>
                  )}
                  
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {node.type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 