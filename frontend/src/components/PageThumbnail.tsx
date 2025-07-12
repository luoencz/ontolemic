import { PageThumbnail as PageThumbnailType } from '../types/page';

interface PageThumbnailProps {
  thumbnail: PageThumbnailType;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function PageThumbnail({ 
  thumbnail, 
  className = '',
  size = 'medium' 
}: PageThumbnailProps) {
  const sizeClasses = {
    small: {
      container: 'h-20',
      image: 'w-20 h-20',
      content: 'p-2',
      title: 'text-sm font-medium',
      summary: 'text-xs'
    },
    medium: {
      container: 'h-24', 
      image: 'w-24 h-24',
      content: 'p-3',
      title: 'text-base font-medium',
      summary: 'text-sm'
    },
    large: {
      container: 'h-32',
      image: 'w-32 h-32', 
      content: 'p-4',
      title: 'text-lg font-medium',
      summary: 'text-base'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${sizes.container} ${className}`}>
      {/* Image/Color section */}
      <div 
        className={`flex-shrink-0 ${sizes.image}`}
        style={{
          backgroundColor: thumbnail.backgroundColor || '#F3F4F6',
          backgroundImage: thumbnail.image ? `url(${thumbnail.image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {!thumbnail.image && !thumbnail.backgroundColor && (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className={`flex-1 ${sizes.content} flex flex-col justify-center overflow-hidden`}>
        <h3 className={`${sizes.title} text-gray-900 truncate mb-1`}>
          {thumbnail.title || 'Untitled Page'}
        </h3>
        <p className={`${sizes.summary} text-gray-600 line-clamp-2`}>
          {thumbnail.summary || 'No description available.'}
        </p>
      </div>
    </div>
  );
} 