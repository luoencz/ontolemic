import Page from '../components/Page';

function Home() {
  return (
    <Page title="Exploring AI, Software, and Everything In Between">
      <div className="prose prose-sm">
        <p className="mb-4">
          Welcome to my corner of the internet. This is where I document my journey through
          technology, share insights from my projects, and explore ideas that fascinate me.
        </p>
        
        <h2 className="text-lg font-normal mt-8 mb-4">Recent Posts</h2>
        <ul className="list-none pl-0">
          <li className="mb-3">
            <a href="#" className="text-blue-600 hover:underline">Understanding Neural Networks from First Principles</a>
            <span className="text-gray-500 text-sm ml-2">Dec 2023</span>
          </li>
          <li className="mb-3">
            <a href="#" className="text-blue-600 hover:underline">Building a Real-time Collaboration System</a>
            <span className="text-gray-500 text-sm ml-2">Nov 2023</span>
          </li>
          <li className="mb-3">
            <a href="#" className="text-blue-600 hover:underline">The Art of System Design</a>
            <span className="text-gray-500 text-sm ml-2">Oct 2023</span>
          </li>
        </ul>
        
        <p className="mt-8 text-gray-600">
          More content coming soon...
        </p>
      </div>
    </Page>
  );
}

export default Home; 