import { useEffect } from 'react';

export const usePerformanceOptimization = () => {
  useEffect(() => {
    // Critical resource hints
    const addResourceHint = (href: string, rel: string, as?: string) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (as) link.as = as;
      document.head.appendChild(link);
    };

    // Preload critical fonts
    addResourceHint('https://fonts.googleapis.com', 'preconnect');
    addResourceHint('https://fonts.gstatic.com', 'preconnect');

    // Optimize images with intersection observer
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach((img) => imageObserver.observe(img));

    // Prefetch next pages on hover
    const setupPrefetch = () => {
      const links = document.querySelectorAll('a[href^="/"]');
      const prefetchedUrls = new Set();

      links.forEach((link) => {
        link.addEventListener('mouseenter', () => {
          const href = (link as HTMLAnchorElement).href;
          if (!prefetchedUrls.has(href)) {
            addResourceHint(href, 'prefetch');
            prefetchedUrls.add(href);
          }
        });
      });
    };

    // Setup after initial load
    setTimeout(setupPrefetch, 1000);

    // Critical CSS optimization
    const optimizeCSS = () => {
      // Remove unused CSS classes (simple implementation)
      const usedClasses = new Set<string>();
      document.querySelectorAll('*').forEach((el) => {
        el.classList.forEach((cls) => usedClasses.add(cls));
      });
    };

    // Run optimization after page load
    if (document.readyState === 'complete') {
      optimizeCSS();
    } else {
      window.addEventListener('load', optimizeCSS);
    }

    return () => {
      imageObserver.disconnect();
    };
  }, []);
};

// Performance monitoring utility
export const measurePerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      // Performance metrics are available but not logged in production
      const metrics = {
        'DOM Content Loaded': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        'Load Complete': navigation.loadEventEnd - navigation.loadEventStart,
        'First Paint': paint.find(entry => entry.name === 'first-paint')?.startTime,
        'First Contentful Paint': paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
      };
      
      // Metrics can be used for monitoring in production
    });
  }
};