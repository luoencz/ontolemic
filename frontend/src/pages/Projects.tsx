import Page from '../components/pages/Page';

function Projects() {
  return (
    <Page title="Projects">
      <div className="prose prose-sm">
        <div>
          <p className="mb-4">
            For more projects and source code, visit my GitHub profile.
          </p>
          <a 
            href="https://github.com/the-o-space" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center"
          >
            GitHub
          </a>
        </div>
      </div>
    </Page>
  );
}

export default Projects; 