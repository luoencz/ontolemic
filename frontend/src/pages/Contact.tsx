import Page from '../components/Page';

function Contact() {
  return (
    <Page title="Contact">
      <div className="prose prose-sm">
        <p className="mb-6">
          This is where you can find me.
        </p>

        <div className="space-y-4">
          <div>
            <span className="text-base font-normal">Email: </span>
            <a href="mailto:hello@xn--the-2na.space" className="text-blue-600 hover:underline">
              hello@xn--the-2na.space
            </a>
          </div>

          <div>
            <span className="text-base font-normal">Telegram: </span>
            <a href="https://t.me/Luoencz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              @Luoencz
            </a>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default Contact; 