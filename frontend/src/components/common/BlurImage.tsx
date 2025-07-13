import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';

interface BlurImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
  placeholderColor?: string; // Background color while loading
}

export function BlurImage({
  src,
  alt,
  aspectRatio = '16/9',
  placeholderColor = '#e5e7eb',
  className = '',
  style,
  ...props
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={{
        ...style,
        aspectRatio: aspectRatio,
        backgroundColor: placeholderColor,
      }}
    >
      {/* Blur skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
          
          {/* Blurred shapes for visual interest */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gray-300 rounded-full blur-2xl opacity-50" />
            <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-gray-400 rounded-full blur-2xl opacity-30" />
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
} 