import Page from '../../components/pages/Page';
import { BlurImage } from '../../components/common/BlurImage';

function Scribe() {
  return (
    <Page
      thumbnail={{
        image: '/scribe/your-review-asx.webp',
        title: 'Scribe - Chrome Extension',
        summary: 'Convert Substack and LessWrong posts to EPUB format with one click. Preserve formatting and images while creating portable e-books from your favorite online content.'
      }}
    >
      <div className="flex flex-col items-center px-4 pt-8">
        <BlurImage
          src="/scribe/your-review-asx.webp" 
          alt="Scribe Chrome extension - Convert Substack and LessWrong to EPUB"
          className="rounded-lg shadow-lg mb-4 max-w-4xl w-full"
          aspectRatio="3/2"
          placeholderColor="#1f2937"
        />
        <p className="text-sm text-gray-500 italic text-center">
          Scribe: "Transform your favorite posts into e-books"
        </p>
        
        <div className="max-w-2xl mt-8 space-y-4 text-gray-700">
          <p>
            'Scribe' is a local Chrome extension that converts Substack and LessWrong posts into EPUB format with one click. HTML conversion preserves formatting and images, creating portable e-books for offline reading. Built for archiving your favorite newsletters and building a personal library of online content.

            Currently in early development, so expect quirks and things breaking.
          </p>
          <p>
            You can download the extension from the <a href="https://github.com/the-o-space/Scribe/releases" target="_blank" rel="noopener noreferrer">releases page</a>.
          </p>
        </div>
      </div>
    </Page>
  );
}

export default Scribe;