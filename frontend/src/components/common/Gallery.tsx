import { useState, useEffect, useCallback} from 'react';
import { BlurImage } from './BlurImage';

interface Photo {
  src: string;
  alt: string;
}

interface LayoutConfig {
  columns: number;
  gap?: number;
  photoLayout: {
    colSpan?: number;
    rowSpan?: number;
  }[];
}

interface GalleryProps {
  photos?: Photo[];
  layout?: 'masonry' | LayoutConfig;
}

const Gallery: React.FC<GalleryProps> = ({ photos, layout = 'masonry' }) => {
  const [loadedPhotos, setLoadedPhotos] = useState<Photo[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    const defaultPhotos: Photo[] = [
      { src: '/portraits/standing-top-no-face.webp', alt: 'A tall photo of me' },
      { src: '/portraits/sitting-thinking-looking-in-the-distance.webp', alt: 'A wide photo of me' },
      { src: '/portraits/lying-thinking-white-socks.webp', alt: 'A small photo of me' },
    ];
    setLoadedPhotos(photos && photos.length > 0 ? photos : defaultPhotos);
  }, [photos]);

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, []);

  const goToNext = useCallback(() => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % loadedPhotos.length);
    }
  }, [selectedPhotoIndex, loadedPhotos.length]);

  const goToPrevious = useCallback(() => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + loadedPhotos.length) % loadedPhotos.length);
    }
  }, [selectedPhotoIndex, loadedPhotos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeLightbox, goToNext, goToPrevious]);

  if (loadedPhotos.length === 0) return null;

  const MasonryLayout = () => (
    <div className="my-8 columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
      {loadedPhotos.map((photo, index) => (
        <div key={index} className="break-inside-avoid" onClick={() => openLightbox(index)}>
          <BlurImage
            src={photo.src}
            alt={photo.alt}
            className="rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer w-full"
            placeholderColor="#f3f4f6"
          />
        </div>
      ))}
    </div>
  );

  const GridLayout = ({ config }: { config: LayoutConfig }) => {
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
      gridAutoRows: 'minmax(100px, auto)',
      gap: `${config.gap || 16}px`,
    };

    return (
      <div className="my-8" style={gridStyle}>
        {loadedPhotos.slice(0, config.photoLayout.length).map((photo, index) => {
          const { colSpan = 1, rowSpan = 1 } = config.photoLayout[index];
          const itemStyle = {
            gridColumn: `span ${colSpan}`,
            gridRow: `span ${rowSpan}`,
          };
          return (
            <div key={index} style={itemStyle} onClick={() => openLightbox(index)}>
              <BlurImage
                src={photo.src}
                alt={photo.alt}
                className="rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer w-full h-full object-cover"
                placeholderColor="#f3f4f6"
              />
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <>
      {layout === 'masonry' ? <MasonryLayout /> : <GridLayout config={layout} />}

      {selectedPhotoIndex !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl z-50 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity"
            aria-label="Previous Photo"
          >
            &#10094;
          </button>
          
          <img
            src={loadedPhotos[selectedPhotoIndex].src}
            alt={loadedPhotos[selectedPhotoIndex].alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button 
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl z-50 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity"
            aria-label="Next Photo"
          >
            &#10095;
          </button>

          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-3xl z-50"
            aria-label="Close Lightbox"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
};

export default Gallery; 