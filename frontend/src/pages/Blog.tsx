import Page from '../components/pages/Page';

function Blog() {
  return (
    <Page title="Blog">
      <div className="prose prose-sm">
        <p className="mb-6">
          Thoughts on AI safety, technology, and interdisciplinary explorations. For long-form essays, visit my <a href="https://innercosmos.substack.com/" target="_blank" rel="noopener noreferrer">Substack</a>. For shorter, personal posts in a free form writing format, check out my <a href="https://t.me/ventilation_lair" target="_blank" rel="noopener noreferrer">Telegram</a>.
        </p>
      </div>
    </Page>
  );
}

export default Blog; 