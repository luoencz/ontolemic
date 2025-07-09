function OpenSource() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-normal mb-6">Open Source Contributions</h1>
      
      <div className="prose prose-sm">
        <p className="mb-6">
          Contributions to open source projects and libraries.
        </p>

        <div className="space-y-8">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-normal mb-2">Library/Framework Contribution</h3>
            <p className="text-gray-600 mb-3">
              Description of a contribution you've made to an open source library or framework.
            </p>
            <div className="flex gap-4 text-sm mb-2">
              <span className="bg-gray-100 px-2 py-1">JavaScript</span>
              <span className="bg-gray-100 px-2 py-1">TypeScript</span>
            </div>
            <a href="#" className="text-sm underline">View on GitHub →</a>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-normal mb-2">Bug Fix or Feature</h3>
            <p className="text-gray-600 mb-3">
              Description of a significant bug fix or feature you've contributed to an open source project.
            </p>
            <div className="flex gap-4 text-sm mb-2">
              <span className="bg-gray-100 px-2 py-1">Python</span>
              <span className="bg-gray-100 px-2 py-1">Documentation</span>
            </div>
            <a href="#" className="text-sm underline">View Pull Request →</a>
          </div>

          <div className="pb-6">
            <h3 className="text-lg font-normal mb-2">Personal Open Source Project</h3>
            <p className="text-gray-600 mb-3">
              A library or tool you've created and open-sourced for the community.
            </p>
            <div className="flex gap-4 text-sm mb-2">
              <span className="bg-gray-100 px-2 py-1">MIT License</span>
              <span className="bg-gray-100 px-2 py-1">NPM Package</span>
            </div>
            <a href="#" className="text-sm underline">View Repository →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenSource; 