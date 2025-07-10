import { ReactNode } from 'react';

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
  const containerClasses = dark 
    ? "bg-black text-white -m-8 min-h-[calc(100vh-4rem)]"
    : "";
    
  const contentClasses = fullWidth
    ? "p-8"
    : "max-w-3xl mx-auto p-8";

  if (dark) {
    return (
      <div className={containerClasses}>
        <div className={`${contentClasses} ${className}`}>
          {title && <h1 className="text-2xl font-normal mb-6">{title}</h1>}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`${contentClasses} ${className}`}>
      {title && <h1 className="text-2xl font-normal mb-6">{title}</h1>}
      {children}
    </div>
  );
}

export default Page; 