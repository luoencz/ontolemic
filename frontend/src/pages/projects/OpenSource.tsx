import Page from '../../components/Page';

function OpenSource() {
  return (
    <Page title="Open Source Contributions">
      <div className="prose prose-sm">
        <p className="mb-6">
          Contributing to the developer community through open source projects and libraries.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-normal mb-2">React Component Library</h3>
            <p className="text-gray-600 mb-2">
              A comprehensive UI component library with 50+ customizable components,
              full TypeScript support, and extensive documentation.
            </p>
            <div className="text-sm text-gray-500 mb-2">
              <span>500+ GitHub stars • 100+ contributors</span>
            </div>
            <a href="#" className="text-blue-600 hover:underline text-sm">View on GitHub →</a>
          </div>

          <div>
            <h3 className="text-lg font-normal mb-2">CLI Development Tool</h3>
            <p className="text-gray-600 mb-2">
              Command-line tool for automating common development tasks,
              with plugin system and cross-platform support.
            </p>
            <div className="text-sm text-gray-500 mb-2">
              <span>10k+ weekly downloads on npm</span>
            </div>
            <a href="#" className="text-blue-600 hover:underline text-sm">View on GitHub →</a>
          </div>

          <div>
            <h3 className="text-lg font-normal mb-2">Documentation Generator</h3>
            <p className="text-gray-600 mb-2">
              Static documentation generator that parses code comments and
              generates beautiful, searchable documentation websites.
            </p>
            <div className="text-sm text-gray-500 mb-2">
              <span>Used by 50+ projects</span>
            </div>
            <a href="#" className="text-blue-600 hover:underline text-sm">View on GitHub →</a>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-normal mb-3">Notable Contributions</h3>
            <ul className="space-y-2 text-sm">
              <li>• Performance improvements to popular web framework (30% faster builds)</li>
              <li>• Security patches for authentication library</li>
              <li>• Documentation improvements for major JS testing framework</li>
              <li>• Bug fixes and feature additions to various developer tools</li>
            </ul>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default OpenSource; 