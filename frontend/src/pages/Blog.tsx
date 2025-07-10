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
          Thoughts on AI safety, technology, and interdisciplinary explorations. For more detailed posts and regular updates, visit my <a href="https://innercosmos.substack.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Substack</a>.
        </p>
        
        <h2 className="text-lg font-normal mt-8 mb-4">Recent Posts</h2>
        
        {isLoading ? (
          <p className="text-gray-500">Loading posts...</p>
        ) : posts && posts.length > 0 ? (
          <ul className="list-none pl-0">
            {posts.map(post => (
              <li key={post.id} className="mb-3">
                <a href="#" className="text-blue-600 hover:underline">{post.title}</a>
                <span className="text-gray-500 text-sm ml-2">{post.date} · {post.readTime}</span>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mt-1">{post.excerpt}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
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
        )}
        
        <p className="mt-8 text-gray-600">
          More content coming soon...
        </p>
      </div>
    </Page>
  );
}

export default Blog; 