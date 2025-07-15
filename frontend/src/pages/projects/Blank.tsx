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
          aspectRatio="16/9"
          placeholderColor="#1f2937"
        />
        <p className="text-sm text-gray-500 italic text-center">
          Blank: "A gentle pause before you doomscroll."
        </p>
        <div className="max-w-2xl mt-8 space-y-4 text-gray-700">
          <p>
            <b>Blank</b> is a local Chrome extension that accepts a list of restricted URLs and, on navigation, triggers a calming interstitial. Purpose-built for assisting with information overload, compulsive doomscrolling, and mindful browsing.
          </p>
          <p>
            <b>How to use:</b> Download from releases or clone the repo, then load it as an unpacked extension in Chrome. Configure your restricted URLs in the options.
          </p>
          <p>
            <b>Features:</b> Minimal UI, customizable blocklist, calming interstitial, privacy-first (all processing is local).
          </p>
          <p>
            <b>Source & install:</b> <a href="https://github.com/the-o-space/Blank" target="_blank" rel="noopener noreferrer">the-o-space/Blank</a>
          </p>
          <p>
            <b>Tech:</b> Pure JavaScript, HTML, and CSS. No tracking, no analytics, no cloud dependencies.
          </p>
        </div>
      </div>
    </Page>
  );
}

export default Blank; 