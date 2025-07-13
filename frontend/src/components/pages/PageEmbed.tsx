import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageThumbnail } from './PageThumbnail';
import { PageThumbnail as PageThumbnailType } from '../../types/page';
import { getPageThumbnail } from '../../utils/thumbnailGenerator';
import { getSearchablePages } from '../../utils/pageRegistry';

interface PageEmbedProps {
  to: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Embedded page preview component that displays a rich preview card
 * Similar to Notion's page embeds
 */
export function PageEmbed({ 
  to, 
  className = '',
  size = 'medium' 
}: PageEmbedProps) {
  const [thumbnail, setThumbnail] = useState<PageThumbnailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadThumbnail = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const pages = getSearchablePages();
        const pageMetadata = pages.find(p => p.path === to);
        
        if (pageMetadata) {
          const thumbnailData = await getPageThumbnail(pageMetadata);
          setThumbnail(thumbnailData);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
        console.error('Error loading page thumbnail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadThumbnail();
  }, [to]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex bg-gray-100 border border-gray-200 rounded-lg overflow-hidden h-24">
          <div className="w-24 h-24 bg-gray-300" />
          <div className="flex-1 p-3 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-3 bg-gray-300 rounded w-full" />
            <div className="h-3 bg-gray-300 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !thumbnail) {
    return (
      <div className={`border border-red-200 bg-red-50 rounded-lg p-4 ${className}`}>
        <p className="text-sm text-red-600">Failed to load page preview for: {to}</p>
      </div>
    );
  }

  return (
    <Link 
      to={to} 
      className={`block no-underline hover:no-underline ${className}`}
    >
      <div className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
        <PageThumbnail 
          thumbnail={thumbnail} 
          size={size}
          className="w-full"
        />
      </div>
    </Link>
  );
} 