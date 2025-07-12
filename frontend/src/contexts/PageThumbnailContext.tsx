import { createContext, useContext, ReactNode } from 'react';
import { PageThumbnail } from '../types/page';

interface PageThumbnailContextType {
  thumbnail?: PageThumbnail;
}

const PageThumbnailContext = createContext<PageThumbnailContextType | undefined>(undefined);

export function PageThumbnailProvider({ 
  children, 
  thumbnail 
}: { 
  children: ReactNode; 
  thumbnail?: PageThumbnail;
}) {
  return (
    <PageThumbnailContext.Provider value={{ thumbnail }}>
      {children}
    </PageThumbnailContext.Provider>
  );
}

export function usePageThumbnail() {
  const context = useContext(PageThumbnailContext);
  return context?.thumbnail;
} 