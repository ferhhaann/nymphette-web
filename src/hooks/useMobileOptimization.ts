import { useEffect, useState } from 'react';
import { useIsMobile } from './use-mobile';

interface MobileOptimizationOptions {
  preloadCount?: number;
  imageQuality?: 'low' | 'medium' | 'high';
  lazyLoadThreshold?: number;
  mobileLayoutMode?: 'compact' | 'minimal' | 'standard';
}

export const useMobileOptimization = (options: MobileOptimizationOptions = {}) => {
  const isMobile = useIsMobile();
  const [connectionType, setConnectionType] = useState<string>('');
  
  const {
    preloadCount = isMobile ? 2 : 4,
    imageQuality = isMobile ? 'medium' : 'high',
    lazyLoadThreshold = isMobile ? 0.05 : 0.1,
    mobileLayoutMode = 'compact'
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
    
    // Mobile-specific layout configurations
    const getMobileLayout = () => {
      if (!isMobile) return {};
      
      switch (mobileLayoutMode) {
        case 'minimal':
          return {
            heroHeight: 'h-[50vh]',
            sectionPadding: 'py-4 px-3',
            cardHeight: 'h-32',
            textSizes: 'text-sm',
            titleSizes: 'text-lg',
            gridCols: 'grid-cols-1',
            gap: 'gap-2'
          };
        case 'compact':
          return {
            heroHeight: 'h-[60vh]',
            sectionPadding: 'py-6 px-4',
            cardHeight: 'h-36',
            textSizes: 'text-sm',
            titleSizes: 'text-xl',
            gridCols: 'grid-cols-1 sm:grid-cols-2',
            gap: 'gap-3'
          };
        default:
          return {
            heroHeight: 'h-[70vh]',
            sectionPadding: 'py-8 px-4',
            cardHeight: 'h-40',
            textSizes: 'text-base',
            titleSizes: 'text-2xl',
            gridCols: 'grid-cols-1 sm:grid-cols-2',
            gap: 'gap-4'
          };
      }
    };
    
    return {
      preloadCount: isSlowConnection ? 1 : preloadCount,
      imageQuality: isSlowConnection ? 'low' : imageQuality,
      lazyLoadThreshold: isSlowConnection ? 0.01 : lazyLoadThreshold,
      shouldPreload: !isSlowConnection,
      rootMargin: isMobile ? '100px' : '50px',
      cardHeight: isMobile ? getMobileLayout().cardHeight : 'h-48',
      gridCols: isMobile ? getMobileLayout().gridCols : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      gap: isMobile ? getMobileLayout().gap : 'gap-6',
      skeletonCount: isMobile ? 4 : 6,
      priorityImageCount: isMobile ? 2 : 3,
      // Mobile-specific layout settings
      mobileLayout: getMobileLayout(),
      // Navigation settings
      navHeight: isMobile ? 'h-14' : 'h-16',
      buttonSize: isMobile ? 'h-10 px-4 text-sm' : 'h-12 px-6 text-base',
      // Content spacing
      heroMargin: isMobile ? 'mt-14' : 'mt-16',
      containerPadding: isMobile ? 'px-3 sm:px-4' : 'px-4 sm:px-6 lg:px-8',
      // Typography
      heroTitle: isMobile ? 'text-2xl sm:text-3xl' : 'text-4xl md:text-5xl lg:text-6xl',
      sectionTitle: isMobile ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl',
      bodyText: isMobile ? 'text-sm sm:text-base' : 'text-base lg:text-lg',
      // Touch targets
      minTouchTarget: isMobile ? 'min-h-[44px] min-w-[44px]' : '',
      // Visual density
      listSpacing: isMobile ? 'space-y-2' : 'space-y-4',
      cardPadding: isMobile ? 'p-3 sm:p-4' : 'p-6',
      // Navigation specific
      mobileMenu: isMobile ? 'slide-in-right' : 'none',
      dropdownAnimation: isMobile ? 'accordion-down' : 'fade-in'
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