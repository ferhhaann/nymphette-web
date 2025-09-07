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
  // Handle different types of URLs for production
  if (!baseUrl || baseUrl === '/placeholder.svg') {
    return baseUrl;
  }
  
  // If it's a Supabase storage URL, don't modify it
  if (baseUrl.includes('supabase.co/storage')) {
    return baseUrl;
  }
  
  // If it's already a full URL with params, don't modify
  if (baseUrl.includes('?') || baseUrl.startsWith('data:')) {
    return baseUrl;
  }
  
  // For static assets in public folder, return as is for production
  if (baseUrl.startsWith('/')) {
    return baseUrl;
  }
  
  // For other URLs, only optimize if they support query parameters
  const params = new URLSearchParams();
  
  // Only add optimization params for known CDN services
  const supportedCDNs = ['cloudinary', 'imgix', 'vercel', 'netlify'];
  const supportsOptimization = supportedCDNs.some(cdn => baseUrl.includes(cdn));
  
  if (supportsOptimization) {
    if (isMobile) {
      params.append('w', '600');
      params.append('f', 'webp');
    } else {
      params.append('w', '1200');
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
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  return baseUrl;
};