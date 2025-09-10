import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to optimize SPA for SSR-like behavior
 * Improves SEO and Core Web Vitals scores
 */
export const useSSROptimization = () => {
  const location = useLocation();

  // Preload critical resources for the current route
  const preloadCriticalResources = useCallback(() => {
    // Preload fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontPreload.as = 'style';
    document.head.appendChild(fontPreload);

    // Preload Supabase connection
    const supabasePreload = document.createElement('link');
    supabasePreload.rel = 'preconnect';
    supabasePreload.href = 'https://duouhbzwivonyssvtiqo.supabase.co';
    document.head.appendChild(supabasePreload);

    // Preload critical images based on route
    const routeImages = {
      '/': ['/src/assets/hero-travel.jpg'],
      '/packages': ['/src/assets/packages-hero-bg.jpg'],
      '/about': ['/src/assets/team-photo.jpg'],
      '/regions/asia': ['/src/assets/regions/asia-destinations.jpg'],
      '/regions/europe': ['/src/assets/regions/europe-destinations.jpg'],
      '/regions/africa': ['/src/assets/regions/africa-destinations.jpg'],
      '/regions/americas': ['/src/assets/regions/americas-destinations.jpg'],
      '/regions/pacific-islands': ['/src/assets/regions/pacific-islands-destinations.jpg'],
      '/regions/middle-east': ['/src/assets/regions/middle-east-destinations.jpg'],
    };

    const imagesToPreload = routeImages[location.pathname] || [];
    imagesToPreload.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }, [location.pathname]);

  // Update page metadata immediately for better SEO
  const updateMetadata = useCallback(() => {
    const routeMetadata = {
      '/': {
        title: 'Premium Travel Packages | Explore Asia, Europe & Beyond',
        description: 'Discover amazing travel destinations with our curated packages. From Asia to Europe, Africa to Americas - your perfect journey awaits.',
      },
      '/packages': {
        title: 'Travel Packages by Region | Custom Tours Worldwide',
        description: 'Browse our comprehensive collection of travel packages organized by region. Find your perfect destination and create unforgettable memories.',
      },
      '/group-tours': {
        title: 'Join Group Tours | Small Group Travel Adventures',
        description: 'Join like-minded travelers on our small group tours. Experience destinations with expert guides and make new friends.',
      },
      '/about': {
        title: 'About Us | Your Trusted Travel Partner',
        description: 'Learn about our mission to create exceptional travel experiences. Discover why thousands choose us for their adventures.',
      },
      '/blog': {
        title: 'Travel Blog | Tips, Guides & Inspiration',
        description: 'Get travel tips, destination guides, and inspiration for your next adventure. Expert advice from seasoned travelers.',
      },
      '/contact': {
        title: 'Contact Us | Plan Your Perfect Trip',
        description: 'Get in touch to start planning your dream vacation. Our travel experts are here to help create your perfect itinerary.',
      }
    };

    const metadata = routeMetadata[location.pathname];
    if (metadata) {
      document.title = metadata.title;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = metadata.description;

      // Update canonical URL
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `${window.location.origin}${location.pathname}`;
    }
  }, [location.pathname]);

  // Optimize Core Web Vitals
  const optimizeWebVitals = useCallback(() => {
    // Lazy load images below the fold
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    // Prefetch next likely pages
    const prefetchLinks = {
      '/': ['/packages', '/about'],
      '/packages': ['/group-tours', '/contact'],
      '/about': ['/contact', '/packages'],
      '/contact': ['/packages', '/group-tours']
    };

    const nextPages = prefetchLinks[location.pathname] || [];
    nextPages.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    });
  }, [location.pathname]);

  useEffect(() => {
    // Run optimizations on route change
    const timer = setTimeout(() => {
      updateMetadata();
      preloadCriticalResources();
      optimizeWebVitals();
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [location.pathname, updateMetadata, preloadCriticalResources, optimizeWebVitals]);

  // Performance monitoring
  useEffect(() => {
    if ('web-vitals' in window) return;

    // Basic Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as any; // PerformanceEventTiming
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    } catch (e) {
      console.warn('Performance observer not supported');
    }

    return () => observer.disconnect();
  }, []);
};