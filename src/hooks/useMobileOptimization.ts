import { useEffect, useState } from 'react';
import { useIsMobile } from './use-mobile';

interface MobileOptimizationOptions {
  preloadCount?: number;
  imageQuality?: 'low' | 'medium' | 'high';
  lazyLoadThreshold?: number;
}

export const useMobileOptimization = (options: MobileOptimizationOptions = {}) => {
  const isMobile = useIsMobile();
  const [connectionType, setConnectionType] = useState<string>('');
  
  const {
    preloadCount = isMobile ? 2 : 4,
    imageQuality = isMobile ? 'medium' : 'high',
    lazyLoadThreshold = isMobile ? 0.05 : 0.1
  } = options;

  useEffect(() => {
    // Detect connection type for better optimization
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection?.effectiveType || '');
      
      const handleConnectionChange = () => {
        setConnectionType(connection?.effectiveType || '');
      };
      
      connection?.addEventListener('change', handleConnectionChange);
      return () => connection?.removeEventListener('change', handleConnectionChange);
    }
  }, []);

  // Optimize based on connection and device
  const getOptimizedSettings = () => {
    const isSlowConnection = connectionType === '2g' || connectionType === 'slow-2g';
    
    return {
      preloadCount: isSlowConnection ? 1 : preloadCount,
      imageQuality: isSlowConnection ? 'low' : imageQuality,
      lazyLoadThreshold: isSlowConnection ? 0.01 : lazyLoadThreshold,
      shouldPreload: !isSlowConnection,
      rootMargin: isMobile ? '100px' : '50px',
      cardHeight: isMobile ? 'h-40' : 'h-48',
      gridCols: isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      gap: isMobile ? 'gap-3 sm:gap-4' : 'gap-6',
      skeletonCount: isMobile ? 4 : 6,
      priorityImageCount: isMobile ? 2 : 3
    };
  };

  return {
    isMobile,
    connectionType,
    isSlowConnection: connectionType === '2g' || connectionType === 'slow-2g',
    optimizedSettings: getOptimizedSettings()
  };
};

// Helper function to get optimized image URL based on device and connection
export const getOptimizedImageUrl = (
  baseUrl: string, 
  isMobile: boolean, 
  quality: 'low' | 'medium' | 'high' = 'medium'
): string => {
  // For mobile or slow connections, we can add query parameters for optimization
  // This assumes your CDN or image service supports these parameters
  const params = new URLSearchParams();
  
  if (isMobile) {
    params.append('w', '600'); // Max width for mobile
    params.append('f', 'webp'); // Prefer WebP format
  } else {
    params.append('w', '1200'); // Max width for desktop
  }
  
  switch (quality) {
    case 'low':
      params.append('q', '60');
      break;
    case 'medium':
      params.append('q', '75');
      break;
    case 'high':
      params.append('q', '90');
      break;
  }
  
  // Only append params if the URL doesn't already have them
  if (baseUrl.includes('?')) {
    return baseUrl;
  }
  
  return `${baseUrl}?${params.toString()}`;
};