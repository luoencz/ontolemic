import { useState, useEffect } from 'react';
import { BlurImage } from './BlurImage';

interface Photo {
  src: string;
  alt: string;
}

interface PhotoGridProps {
  photos?: Photo[];
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  const [loadedPhotos, setLoadedPhotos] = useState<Photo[]>([]);
  
  useEffect(() => {
    if (photos && photos.length > 0) {
      setLoadedPhotos(photos);
    } else {
      // Optimized WebP photos for web display
      const defaultPhotos: Photo[] = [
        { src: '/me-photos/photo1.webp', alt: 'Photo 1' },
        { src: '/me-photos/photo2.webp', alt: 'Photo 2' },
        { src: '/me-photos/photo3.webp', alt: 'Photo 3' }
      ];
      setLoadedPhotos(defaultPhotos);
    }
  }, [photos]);

  if (loadedPhotos.length === 0) return null;

  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {/* Mobile: all images stacked, Desktop: left column - one tall image */}
      <div className="col-span-1">
        {loadedPhotos[0] && (
          <BlurImage
            src={loadedPhotos[0].src}
            alt={loadedPhotos[0].alt}
            className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            aspectRatio="3/4"
            placeholderColor="#f3f4f6"
          />
        )}
      </div>
      
      {/* Mobile: images continue stacking, Desktop: right column - two smaller stacked images */}
      <div className="col-span-1 grid grid-rows-1 md:grid-rows-2 gap-4">
        {loadedPhotos.slice(1, 3).map((photo, index) => (
          <BlurImage
            key={index}
            src={photo.src}
            alt={photo.alt}
            className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            aspectRatio="4/3"
            placeholderColor="#f3f4f6"
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid; 