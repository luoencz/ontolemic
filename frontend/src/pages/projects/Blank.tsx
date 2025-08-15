import Page from '../../components/pages/Page';
import { BlurImage } from '../../components/common/BlurImage';

function Blank() {
  return (
    <Page
      thumbnail={{
        image: '/blank/blank-preview.webp',
        title: 'Blank',
        summary: 'A minimalist Chrome extension that intercepts distracting sites and replaces them with a calming interstitial, designed to help you break compulsive browsing habits.'
      }}
    >
      <div className="flex flex-col items-center px-4 pt-8">
        <BlurImage
          src="/blank/blank-preview.webp"
          alt="Blank extension preview - calming interstitial"
          className="rounded-lg shadow-lg mb-4 max-w-4xl w-full"
          aspectRatio="3/2"
          placeholderColor="#1f2937"
        />
        <p className="text-sm text-gray-500 italic text-center">
          Blank: "A gentle pause before you doomscroll."
        </p>
        <div className="max-w-2xl mt-8 space-y-4 text-gray-700">
          <p>
            'Blank' is a local Chrome extension that accepts a list of restricted URLs and, on navigation, triggers a calming interstitial that requires to input a series of meditative words and allows you to take a breath and reconsider. Purpose-built for assisting with information overload, compulsive doomscrolling, and mindful browsing.
          </p>
          <p>
            You can download the extension from the <a href="https://github.com/the-o-space/Blank/releases" target="_blank" rel="noopener noreferrer">releases page</a>.
          </p>
        </div>
      </div>
    </Page>
  );
}

export default Blank; 