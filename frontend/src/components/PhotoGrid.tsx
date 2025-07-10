import { useState, useEffect } from 'react';

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
      // Default photos - you'll replace these with actual photos from public/me-photos
      // Note: HEIC format is not supported by browsers, convert to PNG/JPG first
      const defaultPhotos: Photo[] = [
        { src: '/me-photos/photo1.png', alt: 'Photo 1' },
        { src: '/me-photos/photo2.png', alt: 'Photo 2' },
        { src: '/me-photos/photo3.png', alt: 'Photo 3' }
      ];
      setLoadedPhotos(defaultPhotos);
    }
  }, [photos]);

  if (loadedPhotos.length === 0) return null;

  return (
    <div className="my-8 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
      {/* Left column - one tall image */}
      <div className="col-span-1">
        {loadedPhotos[0] && (
          <img
            src={loadedPhotos[0].src}
            alt={loadedPhotos[0].alt}
            className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        )}
      </div>
      
      {/* Right column - two smaller stacked images */}
      <div className="col-span-1 grid grid-rows-2 gap-4">
        {loadedPhotos.slice(1, 3).map((photo, index) => (
          <img
            key={index}
            src={photo.src}
            alt={photo.alt}
            className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid; 