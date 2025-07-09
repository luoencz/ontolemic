function Research() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-normal mb-6">Research Papers & Publications</h1>
      
      <div className="prose prose-sm">
        <p className="mb-6">
          Academic publications and research documentation.
        </p>

        <div className="space-y-8">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-normal mb-2">Research Paper Title 1</h3>
            <p className="text-gray-600 mb-1">
              <em>Conference/Journal Name, Year</em>
            </p>
            <p className="text-gray-600 mb-3">
              Abstract or brief description of the research paper and its contributions to the field.
            </p>
            <div className="flex gap-4 text-sm mb-2">
              <span className="bg-gray-100 px-2 py-1">Computer Science</span>
              <span className="bg-gray-100 px-2 py-1">Machine Learning</span>
            </div>
            <a href="#" className="text-sm underline">Read Paper →</a>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-normal mb-2">Research Paper Title 2</h3>
            <p className="text-gray-600 mb-1">
              <em>Conference/Journal Name, Year</em>
            </p>
            <p className="text-gray-600 mb-3">
              Abstract or brief description of another research paper you've authored or co-authored.
            </p>
            <div className="flex gap-4 text-sm mb-2">
              <span className="bg-gray-100 px-2 py-1">Data Science</span>
              <span className="bg-gray-100 px-2 py-1">Statistics</span>
            </div>
            <a href="#" className="text-sm underline">Read Paper →</a>
          </div>

          <div className="pb-6">
            <h3 className="text-lg font-normal mb-2">Working Paper</h3>
            <p className="text-gray-600 mb-1">
              <em>In Progress</em>
            </p>
            <p className="text-gray-600 mb-3">
              Description of ongoing research work that hasn't been published yet.
            </p>
            <div className="flex gap-4 text-sm mb-2">
              <span className="bg-gray-100 px-2 py-1">In Review</span>
              <span className="bg-gray-100 px-2 py-1">Experimental</span>
            </div>
            <a href="#" className="text-sm underline">View Draft →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Research; 