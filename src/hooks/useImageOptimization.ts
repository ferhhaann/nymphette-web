import { useEffect } from 'react';

export const useImageOptimization = () => {
  useEffect(() => {
    // Enable lazy loading for all images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img) => {
      if (img instanceof HTMLImageElement) {
        img.loading = 'lazy';
        img.decoding = 'async';
      }
    });

    // Preload critical images
    const criticalImages = [
      '/assets/hero-travel.jpg',
      '/assets/regions-world.jpg'
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Add intersection observer for better lazy loading
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    // Observe all images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach((img) => imageObserver.observe(img));

    return () => {
      imageObserver.disconnect();
    };
  }, []);
};

// Image compression utility
export const compressImage = (file: File, quality = 0.8, maxWidth = 1200): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxWidth / height);
      
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};