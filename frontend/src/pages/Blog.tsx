import { useEffect } from 'react';
import Page from '../components/Page';
import { useCachedContent } from '../hooks/usePrefetch';
import { CONTENT_KEYS } from '../utils/contentFetchers';

function Blog() {
  const { data: posts, isLoading, refetch } = useCachedContent<any[]>(CONTENT_KEYS.BLOG_POSTS);
  
  // If not cached yet, fetch immediately
  useEffect(() => {
    if (!posts && !isLoading) {
      refetch();
    }
  }, [posts, isLoading, refetch]);

  return (
    <Page title="Blog">
      <div className="prose prose-sm">
        <p className="mb-6">
          Thoughts on AI safety, technology, and interdisciplinary explorations. For long-form essays, visit my <a href="https://innercosmos.substack.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Substack</a>. For shorter, personal posts in a free form writing format, check out my <a href="https://t.me/ventilation_lair" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Telegram</a>.
        </p>
      </div>
    </Page>
  );
}

export default Blog; 