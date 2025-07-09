export function Backstage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-normal mb-6">Backstage</h1>
      
      <div className="prose prose-gray">
        <p className="text-gray-600 mb-6">
          Welcome to the backstage area. This is a hidden section for special content, 
          experimental features, or administrative access.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-3">Experimental Features</h2>
            <p className="text-gray-600">
              Test new features and functionality before they go live.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-3">Developer Tools</h2>
            <p className="text-gray-600">
              Access debugging tools and system information.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-3">Analytics</h2>
            <p className="text-gray-600">
              View site statistics and performance metrics.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-3">Content Management</h2>
            <p className="text-gray-600">
              Manage and update site content dynamically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 