import { useEffect } from 'react';
import { PageProps } from '../../types/page';
import { PageThumbnailProvider } from '../../contexts/PageThumbnailContext';

/**
 * Unified page component for consistent layout across all pages.
 * Provides centered content with max width constraint by default.
 */
function Page({ 
  children, 
  title, 
  className = '', 
  fullWidth = false,
  dark = false,
  thumbnail
}: PageProps) {
  // Set body background color for dark pages to prevent white overscroll
  useEffect(() => {
    if (dark) {
      document.body.style.backgroundColor = '#000000';
      document.documentElement.style.backgroundColor = '#000000';
      return () => {
        document.body.style.backgroundColor = '';
        document.documentElement.style.backgroundColor = '';
      };
    }
  }, [dark]);

  const containerClasses = dark 
    ? "bg-black text-white -m-4 lg:-m-8 min-h-screen"
    : "";
    
  const contentClasses = fullWidth
    ? "p-4 lg:p-8"
    : "max-w-3xl mx-auto p-4 lg:p-8";

  const pageContent = dark ? (
    <div className={containerClasses}>
      {/* Extra padding at top and bottom for overscroll effect */}
      <div className="h-4 lg:h-8 bg-black" />
      <div className={`${contentClasses} ${className}`}>
        {title && <h1 className="text-xl lg:text-2xl font-normal mb-4 lg:mb-6">{title}</h1>}
        {children}
      </div>
      {/* Extra padding at bottom for overscroll effect */}
      <div className="h-16 lg:h-32 bg-black" />
    </div>
  ) : (
    <div className={`${contentClasses} ${className} ${containerClasses}`}>
      {title && <h1 className="text-xl lg:text-2xl font-normal mb-4 lg:mb-6">{title}</h1>}
      {children}
    </div>
  );

  return (
    <PageThumbnailProvider thumbnail={thumbnail}>
      {pageContent}
    </PageThumbnailProvider>
  );
}

export default Page; 