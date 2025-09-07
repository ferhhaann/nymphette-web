// Production deployment helpers for better performance and reliability

// Check if we're in production environment
export const isProduction = process.env.NODE_ENV === 'production';

// Get optimized image URL for production
export const getProductionImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder.svg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Handle Supabase storage URLs
  if (imagePath.includes('supabase.co/storage')) {
    return imagePath;
  }
  
  // Handle relative paths
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Default fallback
  return `/images/${imagePath}`;
};

// Retry logic for API calls
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      console.warn(`API call attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError!;
};

// Cache management for production
export const getCachedData = (key: string): any => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(`cache_${key}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Cache valid for 5 minutes
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return data;
      }
    }
  } catch (error) {
    console.warn('Cache read error:', error);
  }
  
  return null;
};

export const setCachedData = (key: string, data: any): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`cache_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Cache write error:', error);
  }
};

// Network status check
export const checkNetworkStatus = (): boolean => {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
};

// Image preloading for critical assets
export const preloadCriticalImages = (imageUrls: string[]): void => {
  if (typeof window === 'undefined') return;
  
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};