import Page from '../../components/pages/Page';

function Backstage() {
  return (
    <Page title="// Backstage" dark>
      <div className="prose prose-invert prose-sm">
        <p className="mb-6 text-gray-300">
          Welcome to the backstage area — a hidden section of this site containing experimental 
          features, personal tools, and various utilities.
        </p>

        <h2 className="text-lg font-normal mt-8 mb-4 text-white">What's Inside</h2>
        
        <div className="space-y-4 mb-8">
          <div className="border-l-2 border-gray-700 pl-4">
            <h3 className="text-base font-normal mb-1 text-white">Quotes.yaml</h3>
            <p className="text-gray-400 text-sm">
              A curated collection of inspiring quotes and thoughts that resonate with me.
            </p>
          </div>
          
          <div className="border-l-2 border-gray-700 pl-4 opacity-50">
            <h3 className="text-base font-normal mb-1 text-gray-500">More Coming Soon</h3>
            <p className="text-gray-600 text-sm">
              Additional tools and experiments will be added here over time.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800">
          <p className="text-sm text-gray-500">
            This area is normally hidden. You've unlocked it through a special sequence.
          </p>
        </div>
      </div>
    </Page>
  );
}

export default Backstage; 