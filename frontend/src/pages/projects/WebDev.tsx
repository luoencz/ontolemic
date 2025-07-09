function WebDev() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-normal mb-6">Web Development Projects</h1>
      
      <div className="prose prose-sm">
        <p className="mb-6">
          Full-stack applications, frontend frameworks, and web technologies.
        </p>

        <div className="space-y-8">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-normal mb-2">Personal Website</h3>
            <p className="text-gray-600 mb-3">
              React + TypeScript frontend with Python FastAPI backend. Features responsive design, 
              routing, and modern CSS with Tailwind.
            </p>
            <div className="flex gap-4 text-sm">
              <span className="bg-gray-100 px-2 py-1">React</span>
              <span className="bg-gray-100 px-2 py-1">TypeScript</span>
              <span className="bg-gray-100 px-2 py-1">Tailwind CSS</span>
              <span className="bg-gray-100 px-2 py-1">FastAPI</span>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-normal mb-2">Project Title 2</h3>
            <p className="text-gray-600 mb-3">
              Description of another web development project you've worked on.
            </p>
            <div className="flex gap-4 text-sm">
              <span className="bg-gray-100 px-2 py-1">Technology 1</span>
              <span className="bg-gray-100 px-2 py-1">Technology 2</span>
            </div>
          </div>

          <div className="pb-6">
            <h3 className="text-lg font-normal mb-2">Project Title 3</h3>
            <p className="text-gray-600 mb-3">
              Description of another web development project you've worked on.
            </p>
            <div className="flex gap-4 text-sm">
              <span className="bg-gray-100 px-2 py-1">Technology 1</span>
              <span className="bg-gray-100 px-2 py-1">Technology 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebDev; 