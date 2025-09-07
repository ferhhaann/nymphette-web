import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useStaticSEO = () => {
  useEffect(() => {
    const updateStaticSEO = async () => {
      try {
        const currentPath = window.location.pathname;
        
        const { data: seoSettings, error } = await supabase
          .from('seo_settings')
          .select('*')
          .eq('page_url', currentPath)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          console.warn('SEO settings query error:', error);
          return;
        }

        if (!seoSettings) return;

        // Force update the actual HTML document meta tags
        // This creates new meta tags that override the initial ones
        const updateOrCreateMeta = (selector: string, content: string, isProperty = false) => {
          let meta = document.querySelector(selector) as HTMLMetaElement;
          if (meta) {
            meta.content = content;
          } else {
            meta = document.createElement('meta');
            if (isProperty) {
              meta.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
            } else {
              meta.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
            }
            meta.content = content;
            document.head.appendChild(meta);
          }
        };

        // Update document title - this is visible in browser tabs and bookmarks
        document.title = seoSettings.meta_title;

        // Update all meta tags
        updateOrCreateMeta('meta[name="description"]', seoSettings.meta_description);
        updateOrCreateMeta('meta[name="keywords"]', seoSettings.meta_keywords);
        
        if (seoSettings.robots_meta) {
          updateOrCreateMeta('meta[name="robots"]', seoSettings.robots_meta);
        }

        // Open Graph
        updateOrCreateMeta('meta[property="og:title"]', seoSettings.og_title || seoSettings.meta_title, true);
        updateOrCreateMeta('meta[property="og:description"]', seoSettings.og_description || seoSettings.meta_description, true);
        
        if (seoSettings.og_image) {
          updateOrCreateMeta('meta[property="og:image"]', seoSettings.og_image, true);
        }

        // Twitter Cards
        updateOrCreateMeta('meta[name="twitter:title"]', seoSettings.og_title || seoSettings.meta_title);
        updateOrCreateMeta('meta[name="twitter:description"]', seoSettings.og_description || seoSettings.meta_description);
        
        if (seoSettings.og_image) {
          updateOrCreateMeta('meta[name="twitter:image"]', seoSettings.og_image);
        }

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (canonical && seoSettings.canonical_url) {
          canonical.href = seoSettings.canonical_url;
        }

        // Structured Data
        if (seoSettings.structured_data) {
          let script = document.querySelector('script[type="application/ld+json"]#dynamic-schema') as HTMLScriptElement;
          if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'dynamic-schema';
            document.head.appendChild(script);
          }
          script.textContent = JSON.stringify(seoSettings.structured_data);
        }

        // Log success for debugging
        console.log('SEO settings applied successfully for:', currentPath);

      } catch (error) {
        console.warn('Failed to update static SEO:', error);
        // Don't fail silently, but also don't break the app
      }
    };

    updateStaticSEO();
  }, []);
};

// Helper function to manually trigger SEO update (useful for testing)
export const triggerSEOUpdate = async (pageUrl: string = '/') => {
  try {
    const { data: seoSettings, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_url', pageUrl)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.warn('SEO settings query error:', error);
      return null;
    }

    if (seoSettings) {
      console.log('SEO Settings for', pageUrl, ':', {
        title: seoSettings.meta_title,
        description: seoSettings.meta_description,
        keywords: seoSettings.meta_keywords,
        ogImage: seoSettings.og_image,
        canonicalUrl: seoSettings.canonical_url
      });
      
      // Log what would be visible in view source
      console.log('Current document title:', document.title);
      console.log('Current meta description:', 
        document.querySelector('meta[name="description"]')?.getAttribute('content'));
    }
    
    return seoSettings;
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return null;
  }
};