function Projects() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-normal mb-6">Projects</h1>
      
      <div className="prose prose-sm">
        <p className="mb-6">
          A collection of my technical projects, research, and experiments.
        </p>

        <div className="grid gap-6 mt-8">
          <div className="border border-gray-200 p-6">
            <h3 className="text-lg font-normal mb-2">Web Development</h3>
            <p className="text-gray-600 mb-3">
              Full-stack applications, frontend frameworks, and web technologies.
            </p>
            <a href="/projects/web-dev" className="text-sm underline">View Projects →</a>
          </div>

          <div className="border border-gray-200 p-6">
            <h3 className="text-lg font-normal mb-2">AI & Machine Learning</h3>
            <p className="text-gray-600 mb-3">
              Research projects, models, and experiments in artificial intelligence.
            </p>
            <a href="/projects/ai-ml" className="text-sm underline">View Projects →</a>
          </div>

          <div className="border border-gray-200 p-6">
            <h3 className="text-lg font-normal mb-2">Open Source</h3>
            <p className="text-gray-600 mb-3">
              Contributions to open source projects and libraries.
            </p>
            <a href="/projects/open-source" className="text-sm underline">View Projects →</a>
          </div>

          <div className="border border-gray-200 p-6">
            <h3 className="text-lg font-normal mb-2">Research Papers</h3>
            <p className="text-gray-600 mb-3">
              Academic publications and research documentation.
            </p>
            <a href="/projects/research" className="text-sm underline">View Projects →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects; 