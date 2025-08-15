import Page from '../components/pages/Page';

function Research() {
  return (
    <Page title="Research">
      <div className="prose prose-sm">
        <div>
          <p className="mb-4">
            Academic papers, technical writing, and research explorations in AI safety and related fields.
          </p>
          <a 
            href="https://scholar.google.com/citations?user=3liDI08AAAAJ&hl=en" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center"
          >
            Google Scholar
          </a>
        </div>
      </div>
    </Page>
  );
}

export default Research; 