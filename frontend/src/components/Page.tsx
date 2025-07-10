import { ReactNode, useEffect } from 'react';

interface PageProps {
  children: ReactNode;
  title?: string;
  className?: string;
  fullWidth?: boolean;
  dark?: boolean;
}

/**
 * Unified page component for consistent layout across all pages.
 * Provides centered content with max width constraint by default.
 */
function Page({ 
  children, 
  title, 
  className = '', 
  fullWidth = false,
  dark = false 
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
    ? "bg-black text-white -m-8 min-h-screen [&_a]:!underline [&_.prose_a]:!underline"
    : "[&_a]:!underline [&_.prose_a]:!underline";
    
  const contentClasses = fullWidth
    ? "p-8"
    : "max-w-3xl mx-auto p-8";

  if (dark) {
    return (
      <div className={containerClasses}>
        {/* Extra padding at top and bottom for overscroll effect */}
        <div className="h-8 bg-black" />
        <div className={`${contentClasses} ${className}`}>
          {title && <h1 className="text-2xl font-normal mb-6">{title}</h1>}
          {children}
        </div>
        {/* Extra padding at bottom for overscroll effect */}
        <div className="h-32 bg-black" />
      </div>
    );
  }

  return (
    <div className={`${contentClasses} ${className} ${containerClasses}`}>
      {title && <h1 className="text-2xl font-normal mb-6">{title}</h1>}
      {children}
    </div>
  );
}

export default Page; 