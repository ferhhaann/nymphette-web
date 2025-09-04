import { useEffect } from 'react';

interface PreloadOptions {
  priority?: boolean;
  preloadCount?: number;
}

export const useImagePreloader = (imageUrls: string[], options: PreloadOptions = {}) => {
  const { priority = false, preloadCount = 3 } = options;

  useEffect(() => {
    if (!priority && !imageUrls.length) return;

    const preloadImages = imageUrls.slice(0, preloadCount);
    
    preloadImages.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      
      // Add to head
      document.head.appendChild(link);
      
      // Clean up function to remove preload links
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    });
  }, [imageUrls, priority, preloadCount]);
};

export const preloadCriticalImages = (imageUrls: string[]) => {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};