import Page from '../../components/Page';

function WebDev() {
  return (
    <Page title="Web Development Projects">
      <div className="prose prose-sm">
        <p className="mb-6">
          Full-stack applications and web experiences built with modern technologies.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-normal mb-2">E-Commerce Platform</h3>
            <p className="text-gray-600 mb-2">
              A scalable e-commerce solution built with React, Node.js, and PostgreSQL.
              Features include real-time inventory management, payment processing, and 
              advanced analytics dashboard.
            </p>
            <div className="text-sm text-gray-500">
              <span>Tech: React, Node.js, PostgreSQL, Stripe API</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-normal mb-2">Real-time Collaboration Tool</h3>
            <p className="text-gray-600 mb-2">
              WebSocket-based collaboration platform supporting concurrent editing,
              video conferencing, and project management features.
            </p>
            <div className="text-sm text-gray-500">
              <span>Tech: Vue.js, Socket.io, MongoDB, WebRTC</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-normal mb-2">Developer Portfolio Generator</h3>
            <p className="text-gray-600 mb-2">
              Static site generator specifically designed for developer portfolios,
              with built-in themes and GitHub integration.
            </p>
            <div className="text-sm text-gray-500">
              <span>Tech: Next.js, Tailwind CSS, GitHub API</span>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default WebDev; 