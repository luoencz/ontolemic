import { useMemo } from 'react';
import Page from '../../components/pages/Page';
import ReadingGraphComponent from '../../components/reading/ReadingGraph';
import { ReadingList } from '../../components/reading/ReadingList';
import { readingData } from '../../data/readingData';
import { processReadingData } from '../../utils/dataProcessor';

/**
 * Interactive reading materials page with graph navigation.
 */
function Reading() {
  const processedData = useMemo(() => processReadingData(readingData), []);

  return (
    <Page title="Reading">
      <div className="space-y-6">
        {/* Square Graph Canvas */}
        <div className="w-full mx-auto" style={{ maxWidth: '800px' }}>
          <div className="aspect-square w-full">
            <ReadingGraphComponent data={processedData} />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Click and drag to explore • Scroll to zoom
          </p>
        </div>
        {/* Reading List Below */}
        <div className="max-w-3xl mx-auto">
          <ReadingList 
            nodes={processedData.nodes}
            selectedNode={null}
          />
        </div>
      </div>
    </Page>
  );
}

export default Reading; 