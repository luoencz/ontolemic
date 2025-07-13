import Page from '../../components/Page';
import { BlurImage } from '../../components/BlurImage';

function Cue() {
  return (
    <Page
      thumbnail={{
        image: '/cue/cue-preview.webp',
        title: 'Cue - Generative Art',
        summary: 'Transform your emotions into unique visual experiences through AI-powered sentiment analysis and generative algorithms.'
      }}
    >
      <div className="flex flex-col items-center px-4 pt-8">
        <BlurImage
          src="/cue/cue-preview.webp" 
          alt="Cue art generation preview - abstract emotional visualization"
          className="rounded-lg shadow-lg mb-4 max-w-4xl w-full"
          aspectRatio="16/9"
          placeholderColor="#1f2937"
        />
        <p className="text-sm text-gray-500 italic text-center">
          Cue 03: "I feel stranded in a lush winter forest, longing for someone who isn't here"
        </p>
        
        <div className="max-w-2xl mt-8 space-y-4 text-gray-700">
          <p>
            'Cue' is a generative art project that uses machine learning for sentiment analysis to produce multidimensional vectors with which to parametrise noise algorithms. It's conception has been heavily influenced by my girlfriend's journaling, which I've though would be beutiful to visualise.
          </p>
          
          <p>
            You can explore Cue on your own at <a href="https://cue.the-o.space" target="_blank" rel="noopener noreferrer">cue.the-o.space</a>
          </p>
          
          <p>
            For the technically inclined: the project is built with React and TypeScript, and uses the Claude AI API for sentiment analysis. To host it yourself, you'll need to acquire the Claude API key and set it in the .env file. My future plans for Cue include expanding the algorithmic complexities to make it truly surprising each time — a unique mirror of your state of mind set out to prompt introspection. The source code is available at <a href="https://github.com/the-o-space/Cue" target="_blank" rel="noopener noreferrer">the-o-space/Cue</a>.
          </p>
        </div>
      </div>
    </Page>
  );
}

export default Cue;
