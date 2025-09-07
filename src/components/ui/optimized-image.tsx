import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  fallback?: string;
  preloadSources?: string[];
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  priority = false,
  className,
  fallback = '/placeholder.svg',
  preloadSources = [],
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : '');
  
  // Preload additional images for better performance
  useImagePreloader([src, ...preloadSources], { priority, preloadCount: priority ? 5 : 2 });

  useEffect(() => {
    if (priority) return;

    // More aggressive loading for mobile
    const isMobile = window.innerWidth < 768;
    const rootMargin = isMobile ? '100px' : '50px';
    const threshold = isMobile ? 0.05 : 0.1;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setCurrentSrc(src);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    console.warn(`Image failed to load: ${src}, falling back to: ${fallback}`);
    setHasError(true);
    // Use a more reliable fallback for production
    const productionFallback = hasError ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==' : fallback;
    setCurrentSrc(productionFallback);
    onError?.();
  };

  // Force load on mobile for critical images
  useEffect(() => {
    if (priority && window.innerWidth < 768) {
      setIsIntersecting(true);
      setCurrentSrc(src);
    }
  }, [priority, src]);

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {/* Loading placeholder with better mobile experience */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse">
          <div className="h-full w-full bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
        </div>
      )}
      
      {/* Main image */}
      {(isIntersecting || priority) && currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            objectFit: 'cover'
          }}
          {...props}
        />
      )}
      
      {/* Error state */}
      {hasError && currentSrc === fallback && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Image unavailable</div>
        </div>
      )}
    </div>
  );
};