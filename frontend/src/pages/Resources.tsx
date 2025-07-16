import Page from '../components/pages/Page';
import ResourceGraphComponent from '../components/reading/ResourceGraph';
import { resourcesData } from '../data/resourcesData';

function Resources() {
  return (
    <Page>
      <ResourceGraphComponent data={resourcesData} />
    </Page>
  );
}

export default Resources; 